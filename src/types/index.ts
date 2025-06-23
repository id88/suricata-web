// 用户信息类型
export interface UserInfo {
  ip: string
  location: string
  dailyQuota: number
  remainingQuota: number
  isVipUser: boolean
}

// 邀请码信息类型
export interface InviteCode {
  code: string
  quota: number
  description: string
  isActive: boolean
}

// 邀请码验证结果类型
export interface InviteCodeResult {
  success: boolean
  message: string
  quota?: number
  description?: string
}

// 告警等级
export type AlertSeverity = 'high' | 'medium' | 'low'

// 告警信息类型
export interface Alert {
  id: number
  severity: AlertSeverity
  ruleId: string
  description: string
  sourceIp: string
  targetIp: string
  protocol: string
  timestamp: string
}

// 流量包信息类型
export interface TrafficPacket {
  id: number
  filename: string
  uploadTime: string
  fileSize: string
  alertCount: number
  status: 'analyzing' | 'completed' | 'failed'
  analysisTime?: string
  userIp?: string
  userLocation?: string
  alertTypes?: number
}

// 统计信息类型
export interface Statistics {
  todayAnalyzed: number
  todayTrafficVolume: string
  totalAnalyzed: number
  totalTrafficVolume: string
}

// 文件检测结果类型
export interface AnalysisResult {
  id: number
  filename: string
  fileSize: string
  packetCount: number
  analysisTime: number
  alerts: Alert[]
  statistics: {
    totalAlerts: number
    highSeverity: number
    mediumSeverity: number
    lowSeverity: number
  }
  status: string
  startTime: string
  endTime: string
} 