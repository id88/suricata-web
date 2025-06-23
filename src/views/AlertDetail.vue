<template>
  <div class="alert-detail-page">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-left">
        <el-button @click="goBack" :icon="ArrowLeft"  plain>
          返回
        </el-button>
          <p class="page-subtitle">{{ analysisResult?.filename }} 的检测结果</p>
      </div>
      <div class="header-right">
        <el-button :icon="Download" class="download-btn">
          下载文件
        </el-button>
      </div>
    </div>

    <!-- 告警列表 -->
    <el-card class="alerts-section">
      <template #header>
        <div class="section-header">
          <h2 class="section-title">告警列表</h2>
          <el-button :icon="Document" class="export-btn">
            导出告警列表
          </el-button>
        </div>
      </template>

             <el-table
         :data="analysisResult?.alerts"
         style="width: 100%; max-width: 100%;"
         :default-sort="{ prop: 'timestamp', order: 'descending' }"
       >
         <el-table-column label="严重等级" width="140">
           <template #default="scope">
             <el-tag :type="getSeverityType(scope.row.severity)" effect="plain">
               {{ getSeverityText(scope.row.severity) }}
             </el-tag>
           </template>
         </el-table-column>
         <el-table-column prop="ruleId" label="规则ID" width="140" />
         <el-table-column prop="description" label="告警描述" min-width="350" />
         <el-table-column prop="sourceIp" label="源IP" width="160" />
         <el-table-column prop="targetIp" label="目标IP" width="160" />
         <el-table-column prop="protocol" label="协议" width="120" />
         <el-table-column prop="timestamp" label="时间戳" width="160" sortable />
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import {
  ArrowLeft,
  Download,
  Document
} from '@element-plus/icons-vue'
import { useTrafficStore } from '@/stores/traffic'
import type { AnalysisResult } from '@/types'

const router = useRouter()
const route = useRoute()
const trafficStore = useTrafficStore()

// 获取检测结果
const analysisResult = computed<AnalysisResult | undefined>(() => {
  const id = Number(route.params.id)
  return trafficStore.getAnalysisResult(id)
})

// 返回上一页
const goBack = () => {
  router.back()
}

// 获取严重等级类型
const getSeverityType = (severity: string) => {
  switch (severity) {
    case 'high': return 'danger'
    case 'medium': return 'warning'
    case 'low': return 'info'
    default: return 'info'
  }
}

// 获取严重等级文本
const getSeverityText = (severity: string) => {
  switch (severity) {
    case 'high': return '高危'
    case 'medium': return '中危'
    case 'low': return '低危'
    default: return '未知'
  }
}
</script>

<style scoped>
.alert-detail-page {
  display: flex;
  flex-direction: column;
  gap: 32px;
  width: 100%;
  padding: 48px;
  box-sizing: border-box;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.page-subtitle {
  font-size: 18px;
  color: #6b7280;
  margin: 0;
  font-weight: 400;
}



.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
  margin: 0;
}

/* 按钮样式 */
.download-btn,
.export-btn {
  background-color: #f8fafc;
  border-color: #e2e8f0;
  color: #475569;
  font-weight: 500;
}

.download-btn:hover,
.export-btn:hover {
  background-color: #f1f5f9;
  border-color: #cbd5e1;
  color: #334155;
}

/* PC端专用布局 */
</style> 