<template>
  <div class="global-list-page">
    <!-- 搜索过滤区域 -->
    <div class="search-section">
      <div class="search-filters">
        <el-row :gutter="20">
          <el-col :xs="24" :sm="6">
            <div class="filter-item">
              <label class="filter-label">文件名</label>
              <el-input
                v-model="searchForm.filename"
                placeholder="搜索文件名"
                clearable
                class="filter-input"
              />
            </div>
          </el-col>
          <el-col :xs="24" :sm="6">
            <div class="filter-item">
              <label class="filter-label">告警数量</label>
              <el-select
                v-model="searchForm.alertFilter"
                placeholder="全部"
                clearable
                class="filter-select"
              >
                <el-option label="全部" value="" />
                <el-option label="有告警" value="with_alerts" />
                <el-option label="无告警" value="no_alerts" />
              </el-select>
            </div>
          </el-col>
          <el-col :xs="24" :sm="6">
            <div class="filter-item">
              <label class="filter-label">状态</label>
              <el-select
                v-model="searchForm.statusFilter"
                placeholder="全部"
                clearable
                class="filter-select"
              >
                <el-option label="全部" value="" />
                <el-option label="已完成" value="completed" />
                <el-option label="分析中" value="analyzing" />
                <el-option label="分析失败" value="failed" />
              </el-select>
            </div>
          </el-col>
          <el-col :xs="24" :sm="6">
            <div class="filter-actions">
              <el-button type="primary" :icon="Search" @click="handleSearch" :loading="loading">
                搜索
              </el-button>
              <el-button :icon="Refresh" @click="handleReset">
                重置
              </el-button>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>

    <!-- 流量包列表 -->
    <el-card class="list-card">
      <div class="table-container">
        <el-table
          :data="paginatedData"
          v-loading="loading"
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
              <span :class="getAlertCountClass(scope.row.alertCount)">
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
          <el-table-column prop="userIp" label="用户IP" width="130" sortable />
          <el-table-column prop="userLocation" label="用户地区" width="110" />
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
                @click="viewDetails(scope.row.id)"
              >
                查看详情
              </el-button>
              <span v-else class="text-gray">{{ getActionText(scope.row.status) }}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- 分页组件 -->
      <div class="pagination-container">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="filteredData.length"
          :background="true"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { Search, Refresh } from '@element-plus/icons-vue'
import { useTrafficStore } from '@/stores/traffic'
import type { TrafficPacket } from '@/types'

const router = useRouter()
const trafficStore = useTrafficStore()

const loading = ref(false)
const currentPage = ref(1)
const pageSize = ref(20)

// 搜索表单
const searchForm = reactive({
  filename: '',
  alertFilter: '', // 默认为空字符串，对应"全部"选项
  statusFilter: '' // 状态筛选，默认为空字符串，对应"全部"选项
})

// 筛选后的数据
const filteredData = computed<TrafficPacket[]>(() => {
  return trafficStore.searchTrafficPackets(
    searchForm.filename,
    searchForm.alertFilter,
    searchForm.statusFilter
  )
})

// 分页数据
const paginatedData = computed<TrafficPacket[]>(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredData.value.slice(start, end)
})



// 搜索处理
const handleSearch = () => {
  loading.value = true
  currentPage.value = 1
  
  // 模拟搜索延迟
  setTimeout(() => {
    loading.value = false
  }, 300)
}

// 重置搜索
const handleReset = () => {
  searchForm.filename = ''
  searchForm.alertFilter = ''
  searchForm.statusFilter = ''
  currentPage.value = 1
}

// 分页处理
const handleSizeChange = (val: number) => {
  pageSize.value = val
  currentPage.value = 1
}

const handleCurrentChange = (val: number) => {
  currentPage.value = val
}

// 查看详情
const viewDetails = (id: number) => {
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
</script>

<style scoped>
.global-list-page {
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;
  max-width: 100%;
}

/* 搜索区域 */
.search-section {
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
}



.search-filters {
  width: 100%;
}

.filter-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.filter-label {
  font-size: 14px;
  font-weight: 600;
  color: #374151;
}

.filter-input,
.filter-select {
  width: 100%;
}

.filter-actions {
  display: flex;
  gap: 12px;
  align-items: end;
  height: 100%;
  padding-top: 24px;
}

.filter-actions .el-button {
  flex: 1;
  height: 40px;
}



/* 列表卡片 */
.list-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  overflow: hidden;
}

.list-card :deep(.el-card__body) {
  padding: 0;
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
  padding: 24px;
  border-top: 1px solid #f1f5f9;
  background-color: #fafbfc;
  display: flex;
  justify-content: center;
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

/* 响应式设计 */
@media (max-width: 1024px) {
}

@media (max-width: 768px) {
  .global-list-page {
    gap: 20px;
  }
  
  .search-section {
    padding: 24px 20px;
  }
  
  .filter-actions {
    padding-top: 16px;
  }
  
  .filter-actions .el-button {
    height: 36px;
  }
  
  .data-table :deep(.el-table__header th),
  .data-table :deep(.el-table__body td) {
    padding: 12px 0;
  }
  
  .pagination-container {
    padding: 20px 16px;
  }
}

@media (max-width: 480px) {
  .search-section {
    padding: 20px 16px;
  }
  
  .filter-actions {
    flex-direction: column;
    padding-top: 12px;
  }
  
  .filter-actions .el-button {
    width: 100%;
    height: 40px;
  }
  
  .data-table :deep(.el-table__header th),
  .data-table :deep(.el-table__body td) {
    padding: 10px 0;
    font-size: 14px;
  }
  
  .pagination-container {
    padding: 16px 12px;
  }
  
  .pagination-container :deep(.el-pagination) {
    flex-wrap: wrap;
    justify-content: center;
  }
  
  .pagination-container :deep(.el-pagination .el-pagination__total),
  .pagination-container :deep(.el-pagination .el-pagination__sizes) {
    order: 3;
    margin-top: 12px;
  }
}
</style> 