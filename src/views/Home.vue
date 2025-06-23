<template>
  <div class="home-page">
    <!-- 统计卡片区域 -->
    <section class="stats-section">
      <el-row :gutter="20">
        <el-col :lg="6">
          <div class="stats-card flex items-center">
            <div class="stats-icon today">
              <el-icon :size="24">
                <Calendar />
              </el-icon>
            </div>
            <div class="stats-text">
              <p class="stats-label">今日已分析</p>
              <p class="stats-value">{{ trafficStore.statistics.todayAnalyzed }}</p>
              <p class="stats-unit">个流量包</p>
            </div>
          </div>
        </el-col>
        <el-col :lg="6">
          <div class="stats-card flex items-center">
            <div class="stats-icon volume">
              <el-icon :size="24">
                <DataBoard />
              </el-icon>
            </div>
            <div class="stats-text">
              <p class="stats-label">今日已分析流量</p>
              <p class="stats-value">{{ trafficStore.statistics.todayTrafficVolume }}</p>
              <p class="stats-unit">GB</p>
            </div>
          </div>
        </el-col>
        <el-col :lg="6">
          <div class="stats-card flex items-center">
            <div class="stats-icon total">
              <el-icon :size="24">
                <TrendCharts />
              </el-icon>
            </div>
            <div class="stats-text">
              <p class="stats-label">累计已分析</p>
              <p class="stats-value">{{ trafficStore.statistics.totalAnalyzed.toLocaleString() }}</p>
              <p class="stats-unit">个流量包</p>
            </div>
          </div>
        </el-col>
        <el-col :lg="6">
          <div class="stats-card flex items-center">
            <div class="stats-icon server">
              <el-icon :size="24">
                <Monitor />
              </el-icon>
            </div>
            <div class="stats-text">
              <p class="stats-label">累计已分析流量</p>
              <p class="stats-value">{{ trafficStore.statistics.totalTrafficVolume }}</p>
              <p class="stats-unit">TB</p>
            </div>
          </div>
        </el-col>
      </el-row>
    </section>

    <!-- 用户信息区域 -->
    <el-card class="user-info-card">
      <template #header>
        <div class="card-header">
          <div class="header-left">
            <el-icon :size="20" color="#2563eb">
              <User />
            </el-icon>
            <span class="header-title">用户信息</span>
          </div>
        </div>
      </template>
      
      <div class="user-details-horizontal">
        <div class="detail-item-horizontal">
          <div class="detail-icon-small">
            <el-icon :size="18" color="#6366f1">
              <Location />
            </el-icon>
          </div>
          <div class="detail-content-small">
            <div class="detail-label-small">IP地址</div>
            <div class="detail-value-small ip-address">{{ userStore.userInfo.ip }}</div>
          </div>
        </div>
        
        <div class="detail-divider"></div>
        
        <div class="detail-item-horizontal">
          <div class="detail-icon-small">
            <el-icon :size="18" color="#10b981">
              <MapLocation />
            </el-icon>
          </div>
          <div class="detail-content-small">
            <div class="detail-label-small">归属地</div>
            <div class="detail-value-small location">{{ userStore.userInfo.location }}</div>
          </div>
        </div>
        
        <div class="detail-divider"></div>
        
        <div class="detail-item-horizontal">
          <div class="detail-icon-small">
            <el-icon :size="18" color="#f59e0b">
              <Coin />
            </el-icon>
          </div>
          <div class="detail-content-small">
            <div class="detail-label-small">今日剩余额度</div>
            <div class="detail-value-small quota">
              {{ userStore.userInfo.remainingQuota }} / {{ userStore.userInfo.dailyQuota }}
            </div>
          </div>
        </div>
        
        <div class="detail-divider"></div>
        
        <!-- 邀请码按钮或VIP标识 -->
        <div class="detail-item-horizontal">
          <el-button
            v-if="!userStore.userInfo.isVipUser"
            link
            size="small"
            @click="showInviteDialog"
            class="invite-btn-inline"
          >
            使用邀请码
          </el-button>
          
          <el-tag
            v-else
            type="warning"
            size="large"
            class="vip-badge-inline"
          >
            <el-icon><Trophy /></el-icon>
            VIP用户
          </el-tag>
        </div>
      </div>
    </el-card>

    <!-- 上传记录表格 -->
    <el-card class="records-card">
      <template #header>
        <div class="card-header-left">
          <el-icon :size="20" color="#2563eb">
            <Clock />
          </el-icon>
          <span class="header-title">我的上传记录</span>
        </div>
      </template>
      
      <div class="table-container">
        <el-table
          :data="paginatedData"
          style="width: 100%"
          :default-sort="{ prop: 'uploadTime', order: 'descending' }"
          stripe
          class="data-table"
        >
          <el-table-column prop="filename" label="文件名" min-width="280" show-overflow-tooltip sortable />
          <el-table-column prop="fileSize" label="文件大小" width="120" sortable />
          <el-table-column prop="uploadTime" label="上传时间" width="160" sortable />
          <el-table-column prop="analysisTime" label="分析耗时" width="120" sortable />
          <el-table-column prop="alertCount" label="告警数量" width="120" sortable>
            <template #default="scope">
              <span v-if="scope.row.status === 'analyzing'" class="text-gray">-</span>
              <span v-else :class="getAlertCountClass(scope.row.alertCount)">
                {{ scope.row.alertCount }}
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="alertTypes" label="告警种类" width="120" sortable>
            <template #default="scope">
              <span class="alert-types">
                {{ scope.row.alertTypes || 0 }}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="状态" width="100">
            <template #default="scope">
              <el-tag :type="getStatusType(scope.row.status)" size="small">
                {{ getStatusText(scope.row.status) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="120" fixed="right">
            <template #default="scope">
              <el-button
                v-if="scope.row.status === 'completed'"
                type="primary"
                link
                size="small"
                @click="viewReport(scope.row.id)"
              >
                查看详情
              </el-button>
              <span v-else class="text-gray">{{ getActionText(scope.row.status) }}</span>
            </template>
          </el-table-column>
        </el-table>
        
        <!-- 分页组件 -->
        <div class="pagination-container" v-if="totalRecords > pageSize">
          <el-pagination
            v-model:current-page="currentPage"
            v-model:page-size="pageSize"
            :page-sizes="[10, 20, 50, 100]"
            :total="totalRecords"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleSizeChange"
            @current-change="handlePageChange"
          />
        </div>
      </div>
    </el-card>

    <!-- 邀请码对话框 -->
    <el-dialog
      v-model="inviteDialogVisible"
      title=""
      width="400px"
      :close-on-click-modal="false"
      class="invite-dialog"
      align-center
    >
      <div class="invite-dialog-content">
        <div class="dialog-form">
          <el-input
            v-model="inviteCode"
            placeholder="请输入邀请码"
            size="large"
            maxlength="10"
            :disabled="userStore.isBlocked || inviteLoading"
            @keyup.enter="handleInviteCode"
          />

          <el-button
            type="success"
            size="large"
            @click="handleInviteCode"
            :disabled="userStore.isBlocked || !inviteCode.trim()"
            :loading="inviteLoading"
            class="invite-submit-btn"
          >
            <span v-if="!inviteLoading">激活邀请码</span>
            <span v-else>验证中...</span>
          </el-button>
        </div>

        <div class="dialog-warning" v-if="showErrorWarning">
          <el-icon :size="16" color="#f59e0b">
            <Warning />
          </el-icon>
          <span>连续输入错误邀请码将被禁止访问</span>
        </div>

        <!-- 开发环境显示可用邀请码 -->
        <div class="dev-invite-codes" v-if="isDevelopment">
          <div class="dev-title">开发模式 - 可用邀请码：</div>
          <div class="dev-codes">
            <el-tag 
              v-for="code in availableInviteCodes" 
              :key="code.code"
              size="small"
              type="info"
              @click="inviteCode = code.code"
              style="cursor: pointer; margin: 2px;"
              :title="code.description"
            >
              {{ code.code }} ({{ code.quota }}个)
            </el-tag>
          </div>
        </div>
      </div>
      
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="inviteDialogVisible = false" size="large">
            稍后再说
          </el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 庆祝动画容器 -->
    <div v-if="showCelebration" class="celebration-overlay">
      <div class="celebration-content">
        <div class="celebration-icon">
          <el-icon :size="80" color="#10b981">
            <Trophy />
          </el-icon>
        </div>
        <h2 class="celebration-title">🎉 升级成功！</h2>
        <p class="celebration-message">
          {{ inviteResult?.description || '您的账户已成功升级' }}<br>
          每日额度已提升至{{ inviteResult?.quota || userStore.userInfo.dailyQuota }}个！
        </p>
      </div>
      
      <!-- 烟花效果 -->
      <div class="fireworks">
        <div class="firework" v-for="i in 6" :key="i" :style="getFireworkStyle(i)">
          <div class="firework-spark" v-for="j in 8" :key="j" :style="getSparkStyle(j)"></div>
        </div>
      </div>

      <!-- 飘落的彩纸 -->
      <div class="confetti">
        <div 
          class="confetti-piece" 
          v-for="i in 50" 
          :key="i" 
          :style="getConfettiStyle(i)"
        ></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import {
  Calendar,
  DataBoard,
  TrendCharts,
  Monitor,
  User,
  Clock,
  Warning,
  Location,
  MapLocation,
  Coin,
  Trophy
} from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/user'
import { useTrafficStore } from '@/stores/traffic'

const router = useRouter()
const userStore = useUserStore()
const trafficStore = useTrafficStore()

const inviteCode = ref('')
const inviteLoading = ref(false)
const inviteDialogVisible = ref(false)
const showCelebration = ref(false)
const showErrorWarning = ref(false)

// 分页相关
const currentPage = ref(1)
const pageSize = ref(10)

// 计算当前页的数据
const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return trafficStore.userTrafficPackets.slice(start, end)
})

// 总数据量
const totalRecords = computed(() => trafficStore.userTrafficPackets.length)

// 分页改变处理
const handlePageChange = (page: number) => {
  currentPage.value = page
}

const handleSizeChange = (size: number) => {
  pageSize.value = size
  currentPage.value = 1
}

// 显示邀请码对话框
const showInviteDialog = () => {
  if (userStore.userInfo.isVipUser) {
    ElMessage.info('您的账户已经升级，无需再次使用邀请码')
    return
  }
  inviteDialogVisible.value = true
  inviteCode.value = ''
  showErrorWarning.value = false
}

// 存储邀请码验证结果用于庆祝动画
const inviteResult = ref<{quota: number, description: string} | null>(null)

// 开发环境检测
const isDevelopment = computed(() => import.meta.env.DEV)

// 获取可用邀请码（仅开发环境显示）
const availableInviteCodes = computed(() => {
  return isDevelopment.value ? userStore.getAvailableInviteCodes() : []
})

// 处理邀请码
const handleInviteCode = async () => {
  if (!inviteCode.value.trim()) {
    ElMessage.warning('请输入邀请码')
    return
  }

  inviteLoading.value = true
  try {
    const result = userStore.applyInviteCode(inviteCode.value)
    if (result.success) {
      inviteDialogVisible.value = false
      showErrorWarning.value = false
      
      // 保存邀请码结果用于庆祝动画
      inviteResult.value = {
        quota: result.quota || 0,
        description: result.description || ''
      }
      
      await nextTick()
      
      // 显示庆祝动画
      showCelebration.value = true
      ElMessage.success({
        message: result.message,
        duration: 3000,
        showClose: true
      })
      
      // 3.5秒后隐藏庆祝动画
      setTimeout(() => {
        showCelebration.value = false
        inviteResult.value = null
      }, 3500)
      
      inviteCode.value = ''
    } else {
      ElMessage.error(result.message)
      showErrorWarning.value = true
    }
  } finally {
    inviteLoading.value = false
  }
}

// 查看报告
const viewReport = (id: number) => {
  router.push(`/alert/${id}`)
}

// 获取告警数量样式
const getAlertCountClass = (count: number) => {
  if (count === 0) return 'text-gray'
  if (count > 30) return 'text-danger'
  if (count > 10) return 'text-warning'
  return 'text-success'
}

// 获取状态类型
const getStatusType = (status: string) => {
  switch (status) {
    case 'completed': return 'success'
    case 'analyzing': return 'warning'
    case 'failed': return 'danger'
    default: return 'info'
  }
}

// 获取状态文本
const getStatusText = (status: string) => {
  switch (status) {
    case 'completed': return '已完成'
    case 'analyzing': return '分析中'
    case 'failed': return '失败'
    default: return '未知'
  }
}

// 获取操作文本
const getActionText = (status: string) => {
  switch (status) {
    case 'analyzing': return '分析中'
    case 'failed': return '分析失败'
    default: return '等待完成'
  }
}

// 烟花动画样式
const getFireworkStyle = (index: number) => {
  const positions = [
    { left: '10%', top: '20%' },
    { left: '20%', top: '60%' },
    { left: '40%', top: '30%' },
    { left: '60%', top: '70%' },
    { left: '80%', top: '40%' },
    { left: '90%', top: '80%' }
  ]
  const pos = positions[index - 1]
  return {
    left: pos.left,
    top: pos.top,
    animationDelay: `${(index - 1) * 0.3}s`
  }
}

// 火花样式
const getSparkStyle = (index: number) => {
  const angle = (index - 1) * 45
  return {
    transform: `rotate(${angle}deg)`,
    animationDelay: `${index * 0.1}s`
  }
}

// 彩纸样式
const getConfettiStyle = (index: number) => {
  const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3', '#54a0ff']
  return {
    left: `${Math.random() * 100}%`,
    backgroundColor: colors[index % colors.length],
    animationDelay: `${Math.random() * 3}s`,
    animationDuration: `${3 + Math.random() * 2}s`
  }
}
</script>

<style scoped>
.home-page {
  display: flex;
  flex-direction: column;
  gap: 32px;
  width: 100%;
  max-width: 100%;
}

/* 统计卡片区域 */
.stats-section {
  width: 100%;
}

.stats-card {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 24px;
}

/* Flex 工具类 */
.flex {
  display: flex;
}

.items-center {
  align-items: center;
}

.ml-4 {
  margin-left: 16px;
}

.stats-text {
  flex: 1;
  min-width: 0;
}

.stats-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-right: 16px;
}

.stats-icon.today {
  background-color: #dbeafe;
  color: #2563eb;
}

.stats-icon.volume {
  background-color: #e9d5ff;
  color: #7c3aed;
}

.stats-icon.total {
  background-color: #dcfce7;
  color: #16a34a;
}

.stats-icon.server {
  background-color: #fecaca;
  color: #dc2626;
}

.stats-label {
  font-size: 14px;
  font-weight: 500;
  color: #6b7280;
  margin: 0 0 4px 0;
  line-height: 1.2;
}

.stats-value {
  font-size: 32px;
  font-weight: 700;
  color: #111827;
  line-height: 1;
  margin: 0 0 2px 0;
}

.stats-unit {
  font-size: 12px;
  color: #9ca3af;
  font-weight: 400;
  margin: 0;
  line-height: 1.2;
}

/* 用户信息卡片 */
.user-info-card {
  background: #ffffff;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.card-header-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.header-title {
  font-size: 18px;
  font-weight: 600;
  color: #1e293b;
}

.user-details-horizontal {
  display: flex;
  align-items: center;
  gap: 16px;
}

.detail-item-horizontal {
  display: flex;
  align-items: center;
  gap: 8px;
}

.detail-icon-small {
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.detail-content-small {
  flex: 1;
}

.detail-label-small {
  font-size: 14px;
  color: #64748b;
  margin-bottom: 4px;
  font-weight: 500;
}

.detail-value-small {
  font-size: 18px;
  font-weight: 600;
  color: #1e293b;
}

.detail-value-small.ip-address,
.detail-value-small.location {
  font-size: 16px;
  font-weight: 500;
}

.detail-value-small.quota {
  color: #059669;
}

.detail-divider {
  width: 1px;
  height: 20px;
  background: #e2e8f0;
}

/* 内联邀请码按钮 */
.invite-btn-inline {
  color: #16A34A;
  font-size: 14px;
  font-weight: 500;
  padding: 4px 8px;
}

.invite-btn-inline:hover {
  color: #059669;
  background: rgba(22, 163, 74, 0.1);
}

.vip-badge-inline {
  background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
  color: white;
  border: none;
}

/* 记录表格卡片 */
.records-card {
  background: #ffffff;
}

.table-container {
  width: 100%;
  overflow-x: auto;
}

.data-table {
  width: 100%;
  border: none;
}

.data-table :deep(.el-table__header-wrapper) {
  background-color: #f8fafc;
}

.data-table :deep(.el-table__header th) {
  background-color: #f8fafc;
  color: #374151;
  font-weight: 600;
  border-bottom: 2px solid #e2e8f0;
  padding: 16px 0;
}

.data-table :deep(.el-table__body td) {
  padding: 16px 0;
  border-bottom: 1px solid #f1f5f9;
}

.data-table :deep(.el-table__row:hover) {
  background-color: #f8fafc;
}

.pagination-container {
  display: flex;
  justify-content: center;
  margin-top: 20px;
  padding: 0 16px;
}

/* 告警相关样式 */
.alert-types {
  color: #6b7280;
  font-weight: 500;
}

.text-gray {
  color: #6b7280;
}

.text-success {
  color: #10b981;
  font-weight: 600;
}

.text-warning {
  color: #f59e0b;
  font-weight: 600;
}

.text-danger {
  color: #ef4444;
  font-weight: 600;
}

/* 邀请码对话框 */
.invite-dialog-content {
  padding: 20px;
}

.dialog-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 16px;
}

.invite-submit-btn {
  background: #16A34A;
  border: none;
}

.invite-submit-btn:hover {
  background: #15803D;
}

.dialog-warning {
  display: flex;
  align-items: center;
  gap: 8px;
  justify-content: center;
  font-size: 13px;
  color: #f59e0b;
  background: #fef3c7;
  padding: 8px 12px;
  border-radius: 4px;
}

/* 庆祝动画 */
.celebration-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.8);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: fadeIn 0.3s ease;
}

.celebration-content {
  background: white;
  padding: 48px 32px;
  border-radius: 24px;
  text-align: center;
  max-width: 400px;
  z-index: 10000;
  animation: scaleIn 0.5s ease;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

.celebration-icon {
  margin-bottom: 24px;
  animation: bounce 0.6s ease infinite alternate;
}

.celebration-title {
  font-size: 28px;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 16px 0;
}

.celebration-message {
  font-size: 16px;
  color: #64748b;
  margin: 0;
  line-height: 1.6;
}

/* 烟花效果 */
.fireworks {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.firework {
  position: absolute;
  width: 20px;
  height: 20px;
}

.firework-spark {
  position: absolute;
  width: 4px;
  height: 4px;
  background: #fbbf24;
  border-radius: 50%;
  animation: spark 1.5s ease-out forwards;
}

.firework:nth-child(1) .firework-spark { background: #ef4444; }
.firework:nth-child(2) .firework-spark { background: #3b82f6; }
.firework:nth-child(3) .firework-spark { background: #10b981; }
.firework:nth-child(4) .firework-spark { background: #f59e0b; }
.firework:nth-child(5) .firework-spark { background: #8b5cf6; }
.firework:nth-child(6) .firework-spark { background: #ec4899; }

/* 彩纸效果 */
.confetti {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.confetti-piece {
  position: absolute;
  width: 10px;
  height: 10px;
  top: -10px;
  animation: confetti-fall linear forwards;
}

/* 动画关键帧 */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes scaleIn {
  from { transform: scale(0.9); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

@keyframes bounce {
  from { transform: translateY(0); }
  to { transform: translateY(-10px); }
}

@keyframes spark {
  0% {
    transform: translateY(0) scale(1);
    opacity: 1;
  }
  100% {
    transform: translateY(-100px) scale(0);
    opacity: 0;
  }
}

@keyframes confetti-fall {
  0% {
    transform: translateY(-100vh) rotate(0deg);
    opacity: 1;
  }
  100% {
    transform: translateY(100vh) rotate(720deg);
    opacity: 0;
  }
}

/* 开发环境邀请码显示 */
.dev-invite-codes {
  margin-top: 16px;
  padding: 12px;
  background-color: #f8f9fa;
  border-radius: 6px;
  border: 1px dashed #dee2e6;
}

.dev-title {
  font-size: 12px;
  color: #6c757d;
  margin-bottom: 8px;
  font-weight: 500;
}

.dev-codes {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.dev-codes .el-tag {
  transition: all 0.2s ease;
}

.dev-codes .el-tag:hover {
  background-color: #e3f2fd;
  border-color: #2196f3;
  color: #1976d2;
  transform: scale(1.05);
}
</style> 