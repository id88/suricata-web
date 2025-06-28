#!/bin/bash

echo "🔍 Suricata 容器排查脚本"
echo "=================================="

# 1. 检查容器状态
echo "1. 检查容器状态..."
docker ps -a | grep suricata

echo ""
echo "2. 跳过日志检查（容器重启无日志）..."
echo "容器状态: Restarting - 说明启动命令有问题"

echo ""
echo "3. 检查配置文件是否存在..."
if [ -f "suricata/config/suricata.yaml" ]; then
    echo "✅ suricata.yaml 存在"
else
    echo "❌ suricata.yaml 不存在"
fi

if [ -f "storage/suricata-rules/test2025.rules" ]; then
    echo "✅ test2025.rules 存在"
    echo "规则文件内容预览："
    head -5 storage/suricata-rules/test2025.rules
else
    echo "❌ test2025.rules 不存在"
fi

echo ""
echo "4. 检查必要目录..."
directories=(
    "suricata/config"
    "suricata/logs" 
    "suricata/run"
    "storage/suricata-rules"
    "uploads/pcap-files"
)

for dir in "${directories[@]}"; do
    if [ -d "$dir" ]; then
        echo "✅ $dir 目录存在"
    else
        echo "❌ $dir 目录不存在，正在创建..."
        mkdir -p "$dir"
        chmod 755 "$dir"
    fi
done

echo ""
echo "5. 测试 Suricata 配置语法..."
if [ -f "suricata/config/suricata.yaml" ]; then
    docker run --rm \
        -v "$(pwd)/suricata/config/suricata.yaml:/etc/suricata/suricata.yaml" \
        -v "$(pwd)/storage/suricata-rules:/etc/suricata/rules" \
        jasonish/suricata:latest \
        suricata -T -c /etc/suricata/suricata.yaml 2>&1
    
    if [ $? -eq 0 ]; then
        echo "✅ Suricata 配置语法正确"
    else
        echo "❌ Suricata 配置语法错误"
    fi
else
    echo "❌ 配置文件不存在，无法测试"
fi

echo ""
echo "6. 检查规则文件语法..."
if [ -f "storage/suricata-rules/test2025.rules" ]; then
    # 检查规则是否有明显的语法错误
    if grep -q "alert\|drop\|pass\|reject" "storage/suricata-rules/test2025.rules"; then
        echo "✅ 规则文件包含有效规则"
    else
        echo "❌ 规则文件可能格式错误"
    fi
else
    echo "❌ 规则文件不存在"
fi

echo ""
echo "7. 检查 Docker Compose 配置..."
if docker compose config >/dev/null 2>&1; then
    echo "✅ Docker Compose 配置有效"
else
    echo "❌ Docker Compose 配置错误"
    docker compose config
fi

echo ""
echo "8. 检查容器启动命令..."
echo "Docker Compose 中的 Suricata 命令："
echo "============================================"
docker compose config 2>/dev/null | grep -A 30 "container_name: traffic-suricata" | head -35
echo "============================================"

echo ""
echo "9. 手动测试容器启动..."
echo "尝试手动启动容器进行调试..."
docker run --rm \
    -v "/opt/traffic-detection-system/storage/suricata-rules:/etc/suricata/rules:ro" \
    -v "/opt/traffic-detection-system/uploads/pcap-files:/pcap-files:rw" \
    jasonish/suricata:latest \
    sh -c "
        echo '测试容器启动...'
        ls -la /etc/suricata/rules/ || echo '规则目录不存在'
        echo '检查 Suricata 可执行文件...'
        which suricata || echo 'suricata 命令不存在'
        echo '测试 Suricata 版本...'
        suricata --version || echo 'suricata 版本命令失败'
        echo '测试完成'
    " 2>&1

echo ""
echo "10. 检查挂载权限..."
echo "规则文件权限："
ls -la storage/suricata-rules/test2025.rules
echo "目录权限："
ls -ld storage/suricata-rules/

echo ""
echo "11. 交互式调试测试..."
read -p "是否要进入容器进行交互式调试？(y/N): " debug_interactive
if [[ $debug_interactive =~ ^[Yy]$ ]]; then
    echo "启动交互式调试容器..."
    docker run -it --rm \
        -v "/opt/traffic-detection-system/storage/suricata-rules:/etc/suricata/rules:ro" \
        -v "/opt/traffic-detection-system/uploads/pcap-files:/pcap-files:rw" \
        jasonish/suricata:latest \
        sh
fi

echo ""
echo "12. 重建 Suricata 容器..."
read -p "是否要重建 Suricata 容器？(y/N): " rebuild
if [[ $rebuild =~ ^[Yy]$ ]]; then
    echo "正在重建 Suricata 容器..."
    docker compose stop suricata
    docker compose rm -f suricata
    
    echo "启动容器并实时查看日志..."
    docker compose up suricata &
    COMPOSE_PID=$!
    
    echo "等待 10 秒并查看日志..."
    sleep 10
    
    echo "检查容器状态..."
    docker ps | grep suricata
    echo ""
    echo "强制检查容器日志..."
    docker logs traffic-suricata 2>&1 | head -50
    
    # 停止后台进程
    kill $COMPOSE_PID 2>/dev/null
fi

echo ""
echo "🔧 故障排查完成！"
echo ""
echo "📋 根据以上输出分析问题："
echo "  1. 如果手动测试容器启动失败 -> 检查 Docker 镜像或基础环境"
echo "  2. 如果容器启动但立即退出 -> 检查启动命令中的 shell 脚本语法"
echo "  3. 如果挂载失败 -> 检查路径和权限"
echo "  4. 如果配置错误 -> 修改 docker-compose.yml 中的 command 部分"
echo ""
echo "🚨 常见解决方案："
echo "  • 简化启动命令，移除复杂的 shell 脚本"
echo "  • 使用标准的 Suricata 启动方式而不是自定义脚本"  
echo "  • 检查 docker-compose.yml 中 command 部分的语法错误"
echo "  • 确保所有 \$ 符号正确转义为 \$\$" 