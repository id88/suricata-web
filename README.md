# 流量检测系统 (Traffic Analysis System)

一个基于 Vue3 + TypeScript + Element Plus + Vite + Pinia 的流量包检测系统。用户可以上传网络流量包文件，系统将使用 Suricata 引擎进行检测，并提供告警报告。

## 🚀 项目概述

### 核心功能
- 🔒 **无需注册**：免登录使用，降低使用门槛
- 📁 **文件上传**：支持 .pcap/.pcapng 格式，最大 50MB
- 🔍 **智能分析**：基于 Suricata 引擎的检测
- 📊 **详细报告**：提供时间、IP、规则ID、严重级别等完整告警信息
- 🎛️ **数据管理**：支持筛选、排序、导出CSV功能
- 🌍 **地理位置**：集成IP归属地查询
- 📈 **统计面板**：实时显示全局分析统计
- 🎫 **邀请码系统**：VIP用户额度提升机制

### 技术特色
- 🎨 **现代UI设计**：基于 Element Plus 的精美界面
- 📱 **响应式布局**：专为PC端优化的布局设计
- 🔄 **状态管理**：使用 Pinia 进行状态管理
- 🛡️ **安全防护**：前后端双重文件验证
- ⚡ **性能优化**：Vite构建工具，快速开发体验

## 🛠️ 技术栈

### 前端技术
```json
{
  "核心框架": "Vue 3.5.13 (Composition API)",
  "开发语言": "TypeScript 5.8.2",
  "构建工具": "Vite 6.3.5",
  "UI组件库": "Element Plus 2.9.11",
  "状态管理": "Pinia 3.0.1",
  "路由管理": "Vue Router 4.5.1",
  "图标库": "@element-plus/icons-vue 2.1.0"
}
```

### 开发工具
```json
{
  "自动导入": "unplugin-auto-import 19.3.0",
  "组件导入": "unplugin-vue-components 28.5.0",
  "类型检查": "vue-tsc 2.2.8",
  "插件支持": "@vitejs/plugin-vue 5.2.3"
}
```

### 后端技术 (规划)
- **Web框架**: Flask
- **数据库**: MySQL/Redis
- **分析引擎**: Suricata
- **部署环境**: Ubuntu 24.04.3

## 📋 功能详细说明

### 1. 用户额度管理
- **基础用户**: 每日10个流量包额度
- **VIP用户**: 通过邀请码激活，支持多级额度提升
- **额度重置**: 每日0点（UTC+8）自动重置
- **安全机制**: 邀请码错误5次后当日IP禁止访问

#### 邀请码系统设计
邀请码存储在数据库中，支持多种不同级别的会员权限：

| 邀请码类型 | 示例代码 | 每日额度 | 说明 |
|------------|----------|----------|------|
| 体验会员 | DEMO20 | 20个 | 基础体验版本 |
| 学生优惠 | STUDENT30 | 30个 | 教育用户专享 |
| VIP会员 | VIP50 | 50个 | 标准VIP服务 |
| VIP高级会员 | VIP100 | 100个 | 高级VIP服务 |
| VIP至尊会员 | VIP200 | 200个 | 顶级VIP服务 |

**邀请码数据结构**:
```typescript
interface InviteCode {
  code: string        // 邀请码
  quota: number       // 提升的每日额度
  description: string // 会员类型描述
  isActive: boolean   // 是否激活状态
}
```

### 2. 文件上传验证
#### 前端验证
- 文件格式：仅支持 `.pcap` 和 `.pcapng`
- 文件大小：最大 50MB
- 协议确认：必须同意《服务条款》和《隐私政策》

#### 后端验证（规划）
- 文件头验证：检查文件真实格式
- 内容验证：确认为有效的网络流量包

### 3. 数据统计展示
#### 全局统计
- 今日已分析流量包数量
- 今日已分析流量总大小（GB）
- 累计已分析流量包数量
- 累计已分析流量总大小（TB）

#### 用户信息
- IP地址自动识别
- 地理位置显示（基于现有API）
- 实时剩余额度显示
- VIP状态标识

## 🏗️ 项目结构

```
src/
├── components/          # 组件目录
│   └── Layout.vue      # 主布局组件（导航栏、上传对话框）
├── views/              # 页面组件
│   ├── Home.vue        # 首页（统计、用户信息、上传记录）
│   ├── GlobalList.vue  # 全部流量包列表页
│   └── AlertDetail.vue # 告警详情页
├── stores/             # 状态管理
│   ├── traffic.ts      # 流量包相关状态
│   └── user.ts         # 用户相关状态
├── types/              # TypeScript类型定义
│   └── index.ts        # 全局类型定义
├── router/             # 路由配置
│   └── index.ts        # 路由定义
├── App.vue             # 根组件
├── main.ts             # 应用入口
└── style.css           # 全局样式
```

## 🖥️ 页面结构详解

### 导航栏组件 (Layout.vue)
- **logo区域**: 系统图标 + 标题
- **导航菜单**: 首页、全部流量包
- **上传按钮**: 触发上传对话框

### 首页 (Home.vue)
#### 统计卡片区域
```typescript
// 四个统计卡片，展示全局数据
interface Statistics {
  todayAnalyzed: number      // 今日已分析
  todayTrafficVolume: string // 今日已分析流量
  totalAnalyzed: number      // 累计已分析
  totalTrafficVolume: string // 累计已分析流量
}
```

#### 用户信息卡片
```typescript
interface UserInfo {
  ip: string           // IP地址
  location: string     // 归属地
  dailyQuota: number   // 每日总额度
  remainingQuota: number // 今日剩余额度
  isVipUser: boolean   // 是否VIP用户
}
```

#### 上传记录表格
- 文件名、文件大小、上传时间
- 分析耗时、告警数量、告警种类
- 状态标识、操作按钮

### 全部流量包列表 (GlobalList.vue)
#### 搜索过滤功能
- 文件名模糊搜索
- 告警数量筛选（全部/有告警/无告警）
- 状态筛选（全部/已完成/分析中/分析失败）

#### 数据表格
```typescript
interface TrafficPacket {
  id: number
  filename: string      // 文件名
  uploadTime: string    // 上传时间
  fileSize: string      // 文件大小
  alertCount: number    // 告警数量
  status: 'analyzing' | 'completed' | 'failed' // 状态
  analysisTime?: string // 分析耗时
  userIp?: string      // 用户IP
  userLocation?: string // 用户地区
  alertTypes?: number  // 告警种类
}
```

### 告警详情页 (AlertDetail.vue)
#### 页面头部
- 返回按钮
- 文件名显示
- 下载文件按钮
- 导出告警列表按钮

#### 告警列表表格
```typescript
interface Alert {
  id: number
  severity: 'high' | 'medium' | 'low' // 严重等级
  ruleId: string         // 规则ID
  description: string    // 告警描述
  sourceIp: string      // 源IP
  targetIp: string      // 目标IP
  protocol: string      // 协议
  timestamp: string     // 时间戳
}
```

## 📦 状态管理 (Pinia Stores)

### 流量包状态 (traffic.ts)
```typescript
// 主要功能
- uploadFile()          // 文件上传处理
- getAnalysisResult()   // 获取检测结果
- searchTrafficPackets() // 搜索筛选流量包
- statistics           // 全局统计数据
- userTrafficPackets   // 用户上传记录
- allTrafficPackets    // 全部流量包列表
```

### 用户状态 (user.ts)
```typescript
// 主要功能
- applyInviteCode()           // 应用邀请码
- consumeQuota()              // 消费额度
- getAvailableInviteCodes()   // 获取可用邀请码列表
- userInfo                    // 用户信息
- inviteCodeAttempts          // 邀请码尝试次数
- isBlocked                   // 是否被禁止访问

// 邀请码数据
- inviteCodes[]               // 模拟邀请码数据库
```

## 🎨 UI设计规范

### 颜色主题
```css
:root {
  --el-color-primary: #2563eb;      /* 主色调 */
  --el-color-success: #059669;      /* 成功色 */
  --el-color-warning: #d97706;      /* 警告色 */
  --el-color-danger: #dc2626;       /* 危险色 */
  --el-color-info: #64748b;         /* 信息色 */
}
```

### 组件样式
- **卡片**: 12px 圆角，柔和阴影
- **按钮**: 8px 圆角，500字重
- **表格**: 条纹样式，悬停效果
- **输入框**: 8px 圆角，聚焦高亮

## 🚀 开发指南

### 环境要求
- Node.js >= 16.0.0
- npm >= 8.0.0

### 安装依赖
```bash
npm install
```

### 开发启动
```bash
npm run dev
```

### 项目构建
```bash
npm run build
```

### 预览构建
```bash
npm run preview
```

### 代码规范
- 使用 TypeScript 严格模式
- 遵循 Vue 3 Composition API 规范
- 组件命名采用 PascalCase
- 方法命名采用 camelCase



## 📝 API接口设计 (规划)

### 文件上传
```typescript
POST /api/upload
Content-Type: multipart/form-data

Request:
- file: File (pcap/pcapng)
- agreed: boolean

Response:
{
  success: boolean
  message: string
  data?: {
    id: number
    filename: string
    status: string
  }
}
```

### 获取分析结果
```typescript
GET /api/analysis/:id

Response:
{
  success: boolean
  data: AnalysisResult
}
```

### 获取流量包列表
```typescript
GET /api/traffic-packets
Query: filename?, alertFilter?, statusFilter?, page?, pageSize?

Response:
{
  success: boolean
  data: {
    list: TrafficPacket[]
    total: number
  }
}
```

### 统计信息
```typescript
GET /api/statistics

Response:
{
  success: boolean
  data: Statistics
}
```

### 用户信息
```typescript
GET /api/user/info

Response:
{
  success: boolean
  data: UserInfo
}
```

### 邀请码验证
```typescript
POST /api/user/invite-code
Body: { code: string }

Response:
{
  success: boolean
  message: string
  quota?: number        // 提升后的总额度
  description?: string  // 会员类型描述
}
```





## 🔒 安全机制

### 文件安全
1. **前端验证**: 文件类型、大小检查
2. **后端验证**: 文件头、内容验证

### 访问控制
1. **IP限制**: 基于IP的上传额度控制
2. **频率限制**: 防止恶意上传
3. **邀请码防护**: 防暴力破解机制
4. **文件清理**: 定期清理过期文件

## 📊 性能优化

### 前端优化
- 组件懒加载
- 路由级别代码分割
- Element Plus 按需引入

### 数据处理
- 虚拟滚动（大数据量）
- 分页加载
- 搜索防抖
- 缓存机制

## 🔧 部署配置

### 生产环境
- **服务器**:  Ubuntu 24.04.3
- **Web服务**: Nginx
- **进程管理**: PM2
- **SSL证书**: Let's Encrypt

### 环境变量
```bash
# 开发环境
VITE_APP_ENV=development
VITE_API_BASE_URL=http://localhost:5000

# 生产环境
VITE_APP_ENV=production
VITE_API_BASE_URL=https://api.example.com
```

## 🐳 后端部署方案

### 容器化部署
本项目采用 Docker 容器化部署方案，详细安装配置请参考：**[后端组件安装方案.md](./后端组件安装方案.md)**

#### 核心组件
- **MySQL 8.0**: 主数据库，存储用户信息、流量包记录、告警数据
- **Redis 7**: 高性能缓存，存储会话数据和统计信息
- **Nginx**: Web服务器和反向代理，处理静态资源和API转发
- **Suricata**: 网络流量分析引擎，基于规则检测威胁
- **Flask API**: Python后端服务，处理业务逻辑和数据接口

#### 快速启动
```bash
# 1. 克隆项目到 Ubuntu 24.04 服务器
git clone <repository-url>
cd suricata-web

# 2. 执行后端部署脚本
cd /opt/traffic-detection-system
./start-system.sh

# 3. 验证部署结果
./verify-installation.sh
```

#### 部署特性
- ✅ **一键部署**: 自动化脚本完成所有组件安装
- ✅ **健康检查**: 内置服务健康监控机制
- ✅ **数据持久化**: 完整的数据存储和备份方案
- ✅ **日志管理**: 统一的日志收集和轮转策略
- ✅ **安全配置**: 生产级安全配置和访问控制

## 📈 功能扩展计划

### 已完成 ✅
- [x] 前端界面开发（Vue3 + TypeScript + Element Plus）
- [x] 后端容器化部署方案（Docker + Docker Compose）
- [x] 数据库设计（MySQL 表结构设计）
- [x] Suricata 引擎配置（规则管理和分析配置）
- [x] 系统架构设计（微服务容器化架构）

### 进行中 🚧
- [ ] Flask API 开发（业务逻辑实现）
- [ ] 前后端接口对接（数据交互实现）
- [ ] Suricata 引擎集成（PCAP分析流程）

### 计划中 📋
- [ ] 系统监控和告警机制
- [ ] 性能优化和压力测试
- [ ] SSL证书配置和HTTPS支持
- [ ] 日志分析和审计功能
- [ ] 用户行为分析和统计报表
- [ ] API接口文档和SDK开发



## 🐛 问题反馈

如果您在使用过程中遇到问题，请通过以下方式反馈：
1. 提交 GitHub Issues
2. 联系系统管理员
3. 查看在线文档

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

---

**注意**: 本系统专为PC端设计，暂不支持移动端访问。请使用桌面浏览器获得最佳体验。

