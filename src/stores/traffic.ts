import { defineStore } from 'pinia'
import { ref, reactive } from 'vue'
import type { TrafficPacket, Statistics, AnalysisResult } from '@/types'

export const useTrafficStore = defineStore('traffic', () => {
  // 统计信息
  const statistics = reactive<Statistics>({
    todayAnalyzed: 42,
    todayTrafficVolume: '25.8',
    totalAnalyzed: 1286,
    totalTrafficVolume: '1.5'
  })

  // 用户上传记录
  const userTrafficPackets = ref<TrafficPacket[]>([
    {
      id: 1,
      filename: 'malware_sample.pcap',
      uploadTime: '2024-01-15 14:30',
      fileSize: '12.5 MB',
      alertCount: 25,
      status: 'completed',
      analysisTime: '2.3s',
      alertTypes: 8
    },
    {
      id: 2,
      filename: 'network_traffic.pcapng',
      uploadTime: '2024-01-15 13:45',
      fileSize: '8.2 MB',
      alertCount: 0,
      status: 'analyzing',
      analysisTime: '-',
      alertTypes: 0
    },
    {
      id: 3,
      filename: 'suspicious_activity.pcap',
      uploadTime: '2024-01-15 12:20',
      fileSize: '18.9 MB',
      alertCount: 12,
      status: 'completed',
      analysisTime: '1.8s',
      alertTypes: 5
    },
    {
      id: 4,
      filename: 'corrupted_file.pcapng',
      uploadTime: '2024-01-15 11:15',
      fileSize: '3.2 MB',
      alertCount: 0,
      status: 'failed',
      analysisTime: '-',
      alertTypes: 0
    }
  ])

  // 全部流量包列表
  const allTrafficPackets = ref<TrafficPacket[]>([
    {
      id: 1,
      filename: 'malware_analysis.pcap',
      uploadTime: '2024-01-15 14:30',
      fileSize: '15.2 MB',
      alertCount: 25,
      status: 'completed',
      analysisTime: '45s',
      userIp: '123.45.67.89',
      userLocation: '中国 上海',
      alertTypes: 8
    },
    {
      id: 2,
      filename: 'network_scan.pcapng',
      uploadTime: '2024-01-15 13:45',
      fileSize: '8.7 MB',
      alertCount: 47,
      status: 'completed',
      analysisTime: '23s',
      userIp: '98.76.54.32',
      userLocation: '美国 加州',
      alertTypes: 12
    },
    {
      id: 3,
      filename: 'web_traffic.pcap',
      uploadTime: '2024-01-15 12:20',
      fileSize: '22.1 MB',
      alertCount: 21,
      status: 'completed',
      analysisTime: '58s',
      userIp: '210.12.34.56',
      userLocation: '日本 东京',
      alertTypes: 6
    },
    {
      id: 4,
      filename: 'ddos_attack.pcap',
      uploadTime: '2024-01-15 11:15',
      fileSize: '32.4 MB',
      alertCount: 0,
      status: 'analyzing',
      analysisTime: '-',
      userIp: '192.168.1.50',
      userLocation: '中国 北京',
      alertTypes: 0
    },
    {
      id: 5,
      filename: 'malformed_packet.pcapng',
      uploadTime: '2024-01-15 10:30',
      fileSize: '5.2 MB',
      alertCount: 0,
      status: 'failed',
      analysisTime: '-',
      userIp: '172.16.0.100',
      userLocation: '韩国 首尔',
      alertTypes: 0
    }
  ])

  // 检测结果
  const analysisResults = ref<AnalysisResult[]>([
    {
      id: 1,
      filename: 'malware_sample.pcap',
      fileSize: '2.3 MB',
      packetCount: 1247,
      analysisTime: 2.3,
      alerts: [
        {
          id: 1,
          severity: 'high',
          ruleId: '2024001',
          description: '检测到恶意软件外连通信',
          sourceIp: '192.168.1.100',
          targetIp: '203.0.113.5',
          protocol: 'TCP',
          timestamp: '14:30:15.234'
        },
        {
          id: 2,
          severity: 'medium',
          ruleId: '2024002',
          description: '异常端口扫描行为',
          sourceIp: '10.0.0.50',
          targetIp: '192.168.1.1',
          protocol: 'TCP',
          timestamp: '14:30:16.456'
        },
        {
          id: 3,
          severity: 'low',
          ruleId: '2024003',
          description: '可疑DNS查询',
          sourceIp: '192.168.1.105',
          targetIp: '8.8.8.8',
          protocol: 'UDP',
          timestamp: '14:30:17.789'
        }
      ],
      statistics: {
        totalAlerts: 23,
        highSeverity: 5,
        mediumSeverity: 12,
        lowSeverity: 6
      },
      status: '分析完成',
      startTime: '2024-01-15 14:30:15',
      endTime: '2024-01-15 14:30:18'
    }
  ])

  // 上传文件
  const uploadFile = async (file: File): Promise<{ success: boolean; message: string }> => {
    // 验证文件类型
    const validTypes = ['.pcap', '.pcapng']
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase()
    
    if (!validTypes.includes(fileExtension)) {
      return {
        success: false,
        message: '只支持 .pcap 和 .pcapng 格式的文件'
      }
    }
    
    // 验证文件大小
    if (file.size > 50 * 1024 * 1024) {
      return {
        success: false,
        message: '文件大小不能超过 50MB'
      }
    }

    // 模拟文件上传
    const newPacket: TrafficPacket = {
      id: Date.now(),
      filename: file.name,
      uploadTime: new Date().toLocaleString('zh-CN'),
      fileSize: (file.size / (1024 * 1024)).toFixed(1) + ' MB',
      alertCount: 0,
      status: 'analyzing',
      analysisTime: '-',
      alertTypes: 0
    }

    userTrafficPackets.value.unshift(newPacket)
    
    // 模拟分析过程
    setTimeout(() => {
      const packet = userTrafficPackets.value.find(p => p.id === newPacket.id)
      if (packet) {
        packet.status = 'completed'
        packet.alertCount = Math.floor(Math.random() * 50)
        packet.analysisTime = (Math.random() * 60 + 10).toFixed(1) + 's'
        packet.alertTypes = packet.alertCount > 0 ? Math.floor(Math.random() * 10) + 1 : 0
      }
    }, 3000)

    return {
      success: true,
      message: `文件 "${file.name}" 上传成功，正在分析中...`
    }
  }

  // 获取检测结果
  const getAnalysisResult = (id: number): AnalysisResult | undefined => {
    return analysisResults.value.find(result => result.id === id)
  }

  // 搜索流量包
  const searchTrafficPackets = (filename: string, alertFilter: string, statusFilter: string = '') => {
    let filtered = [...allTrafficPackets.value]
    
    if (filename) {
      filtered = filtered.filter(packet => 
        packet.filename.toLowerCase().includes(filename.toLowerCase())
      )
    }
    
    if (alertFilter === 'with_alerts') {
      filtered = filtered.filter(packet => packet.alertCount > 0)
    } else if (alertFilter === 'no_alerts') {
      filtered = filtered.filter(packet => packet.alertCount === 0)
    }
    
    if (statusFilter) {
      filtered = filtered.filter(packet => packet.status === statusFilter)
    }
    
    return filtered
  }

  return {
    statistics,
    userTrafficPackets,
    allTrafficPackets,
    analysisResults,
    uploadFile,
    getAnalysisResult,
    searchTrafficPackets
  }
}) 