<template>
  <div class="layout">
    <!-- 顶部导航栏 -->
    <header class="header">
      <div class="header-container">
        <div class="logo-section">
          <div class="logo-icon">
            <img src="/favicon.svg" alt="流量检测系统" class="logo-svg" />
          </div>
          <h1 class="title">流量检测系统</h1>
        </div>
        <nav class="nav-section">
        <button @click="showUploadDialog" class="nav-link upload-btn">
            上传流量包
        </button>
          <router-link to="/" class="nav-link" :class="{ active: isActive('/') }">
            首页
          </router-link>
          <router-link to="/global-list" class="nav-link" :class="{ active: isActive('/global-list') }">
            全部流量包
          </router-link>
        </nav>
      </div>
    </header>

    <!-- 主要内容区域 -->
    <main class="main-content">
      <router-view />
    </main>

    <!-- 上传流量包对话框 -->
    <el-dialog
      v-model="uploadDialogVisible"
      title="上传流量包"
      width="500px"
      :close-on-click-modal="false"
      class="upload-dialog"
    >
      <div class="upload-dialog-content">
        <el-upload
          class="upload-dragger"
          drag
          :auto-upload="false"
          :on-change="handleFileUpload"
          accept=".pcap,.pcapng"
          :show-file-list="false"
        >
          <div class="upload-area">
            <el-icon class="upload-icon">
              <UploadFilled />
            </el-icon>
            <div class="upload-text">
              <p class="upload-title">拖拽文件到此处或点击上传</p>
              <p class="upload-hint">支持 .pcap, .pcapng 格式，最大 50MB</p>
            </div>
          </div>
        </el-upload>
        
        <div class="upload-agreement">
          <el-checkbox v-model="agreed" class="agreement-checkbox">
            我已阅读并同意
            <a href="/terms.txt" target="_blank" class="policy-link">《服务条款》</a>
            和
            <a href="/privacy.txt" target="_blank" class="policy-link">《隐私政策》</a>
          </el-checkbox>
        </div>
      </div>
      
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="uploadDialogVisible = false" class="cancel-btn">取消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { UploadFilled } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/user'
import { useTrafficStore } from '@/stores/traffic'

const route = useRoute()
const userStore = useUserStore()
const trafficStore = useTrafficStore()

const uploadDialogVisible = ref(false)
const agreed = ref(false)

// 判断导航链接是否激活
const isActive = (path: string) => {
  return route.path === path
}

// 显示上传对话框
const showUploadDialog = () => {
  uploadDialogVisible.value = true
  agreed.value = false
}

// 处理文件上传
const handleFileUpload = async (file: any) => {
  if (!agreed.value) {
    ElMessage.warning('请先同意服务条款和隐私政策')
    return
  }

  if (!userStore.consumeQuota()) {
    ElMessage.error('今日额度已用完，请明天再试或使用邀请码提升额度')
    return
  }

  const result = await trafficStore.uploadFile(file.raw)
  if (result.success) {
    ElMessage.success(result.message)
    uploadDialogVisible.value = false
  } else {
    ElMessage.error(result.message)
  }
}
</script>

<style scoped>
.layout {
  min-height: 100vh;
  background-color: #f8fafc;
  width: 100%;
  overflow-x: hidden;
}

.header {
  background-color: #ffffff;
  border-bottom: 1px solid #e2e8f0;
  position: sticky;
  top: 0;
  z-index: 1000;
  width: 100%;
}

.header-container {
  max-width: 1400px;
  margin: 0 auto;
  height: 64px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
}

.logo-section {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background-color: #eff6ff;
  border-radius: 8px;
}

.logo-svg {
  width: 28px;
  height: 28px;
  object-fit: contain;
}

.title {
  font-size: 22px;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
  white-space: nowrap;
}

.nav-section {
  display: flex;
  gap: 8px;
}

.nav-link {
  color: #64748b;
  text-decoration: none;
  font-weight: 500;
  font-size: 15px;
  padding: 10px 16px;
  border-radius: 8px;
  transition: all 0.2s ease;
  cursor: pointer;
  border: none;
  background-color: #eff6ff;
  white-space: nowrap;
}

.nav-link:hover {
  color: #2563eb;
  background-color: #dbeafe;
}

.nav-link.active {
  color: #2563eb;
  background-color: #dbeafe;
}

.upload-btn {
  color: #059669;
  background-color: #ecfdf5;
  border: 1px solid #a7f3d0;
}

.upload-btn:hover {
  color: #047857;
  background-color: #d1fae5;
  border-color: #6ee7b7;
}

.main-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
  min-height: calc(100vh - 64px);
  width: 100%;
  box-sizing: border-box;
}

/* 上传对话框样式 */
.upload-dialog :deep(.el-dialog) {
  border-radius: 12px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.upload-dialog :deep(.el-dialog__header) {
  padding: 24px 24px 0;
  border-bottom: none;
}

.upload-dialog :deep(.el-dialog__title) {
  font-size: 20px;
  font-weight: 600;
  color: #1e293b;
}

.upload-dialog :deep(.el-dialog__body) {
  padding: 20px 24px;
}

.upload-dialog :deep(.el-dialog__footer) {
  padding: 0 24px 24px;
  border-top: none;
}

.upload-dialog-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.upload-dragger {
  width: 100%;
}

.upload-dragger :deep(.el-upload-dragger) {
  border: 2px dashed #d1d5db;
  border-radius: 12px;
  background-color: #fafbfc;
  padding: 32px;
  transition: all 0.2s ease;
  width: 100%;
  height: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.upload-dragger :deep(.el-upload-dragger:hover) {
  border-color: #2563eb;
  background-color: #f8fafc;
}

.upload-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 16px;
}

.upload-icon {
  font-size: 48px;
  color: #94a3b8;
}

.upload-text {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.upload-title {
  font-size: 16px;
  font-weight: 500;
  color: #374151;
  margin: 0;
}

.upload-hint {
  font-size: 14px;
  color: #64748b;
  margin: 0;
}

.upload-agreement {
  padding: 12px;
  text-align: center;
}

.agreement-checkbox :deep(.el-checkbox__label) {
  font-size: 14px;
  color: #374151;
  font-weight: 400;
}

.policy-link {
  color: #2563eb;
  text-decoration: none;
  font-weight: 500;
}

.policy-link:hover {
  color: #1d4ed8;
  text-decoration: underline;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
}

.cancel-btn {
  background-color: #f1f5f9;
  border-color: #e2e8f0;
  color: #64748b;
  border-radius: 8px;
  font-weight: 500;
}

.cancel-btn:hover {
  background-color: #e2e8f0;
  border-color: #cbd5e1;
  color: #475569;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .header-container {
    padding: 0 16px;
  }
  
  .title {
    font-size: 18px;
  }
  
  .nav-section {
    gap: 4px;
  }
  
  .nav-link {
    padding: 8px 12px;
    font-size: 14px;
  }
  
  .main-content {
    padding: 16px;
  }
  
  .upload-dialog :deep(.el-dialog) {
    width: 90% !important;
    margin: 5vh auto !important;
  }
}

@media (max-width: 480px) {
  .header-container {
    padding: 0 12px;
  }
  
  .title {
    font-size: 16px;
  }
  
  .nav-link {
    padding: 6px 8px;
    font-size: 13px;
  }
  
  .main-content {
    padding: 12px;
  }
}
</style> 