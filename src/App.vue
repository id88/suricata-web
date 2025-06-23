<script setup lang="ts">
import Layout from '@/components/Layout.vue'
</script>

<template>
  <Layout />
</template>

<style>
/* CSS Reset & 基础样式 */
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  padding: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif;
  background-color: #f8fafc;
  color: #1e293b;
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

#app {
  width: 100%;
  min-height: 100vh;
}

/* Element Plus 样式覆盖 */
:root {
  --el-color-primary: #2563eb;
  --el-color-primary-light-3: #3b82f6;
  --el-color-primary-light-5: #60a5fa;
  --el-color-primary-light-7: #93c5fd;
  --el-color-primary-light-8: #bfdbfe;
  --el-color-primary-light-9: #dbeafe;
  --el-color-primary-dark-2: #1d4ed8;
  --el-color-success: #059669;
  --el-color-warning: #d97706;
  --el-color-danger: #dc2626;
  --el-color-info: #64748b;
  --el-border-radius-base: 8px;
  --el-border-radius-small: 6px;
  --el-border-radius-round: 20px;
  --el-box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  --el-box-shadow-light: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
}

/* 卡片样式重置 */
.el-card {
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  transition: all 0.2s ease;
}

.el-card:hover {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.el-card__header {
  padding: 20px 24px 16px;
  border-bottom: 1px solid #f1f5f9;
  background-color: #fafbfc;
  border-radius: 12px 12px 0 0;
}

.el-card__body {
  padding: 24px;
}

/* 按钮样式优化 */
.el-button {
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.el-button--primary {
  background-color: #2563eb;
  border-color: #2563eb;
}

.el-button--primary:hover {
  background-color: #1d4ed8;
  border-color: #1d4ed8;
}

.el-button--success {
  background-color: #059669;
  border-color: #059669;
}

.el-button--success:hover {
  background-color: #047857;
  border-color: #047857;
}

/* 表格样式优化 */
.el-table {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
}

.el-table th.el-table__cell {
  background-color: #f8fafc;
  color: #374151;
  font-weight: 600;
  border-bottom: 1px solid #e2e8f0;
}

.el-table td.el-table__cell {
  border-bottom: 1px solid #f1f5f9;
}

.el-table--striped .el-table__body tr.el-table__row--striped td.el-table__cell {
  background-color: #fafbfc;
}

/* 输入框样式优化 */
.el-input__wrapper {
  border-radius: 8px;
  border: 1px solid #d1d5db;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  transition: all 0.2s ease;
}

.el-input__wrapper:hover {
  border-color: #94a3b8;
}

.el-input__wrapper.is-focus {
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

/* 选择框样式优化 */
.el-select .el-input__wrapper {
  cursor: pointer;
}

/* 分页样式优化 */
.el-pagination {
  margin-top: 32px;
  justify-content: center;
}

.el-pagination .el-pager li {
  border-radius: 6px;
  margin: 0 2px;
}

.el-pagination .el-pager li.is-active {
  background-color: #2563eb;
}

/* 标签样式优化 */
.el-tag {
  border-radius: 6px;
  font-weight: 500;
}

.el-tag--success {
  background-color: #dcfce7;
  border-color: #bbf7d0;
  color: #166534;
}

.el-tag--warning {
  background-color: #fef3c7;
  border-color: #fde68a;
  color: #92400e;
}

.el-tag--danger {
  background-color: #fee2e2;
  border-color: #fecaca;
  color: #991b1b;
}

/* 复选框样式优化 */
.el-checkbox__input.is-checked .el-checkbox__inner {
  background-color: #2563eb;
  border-color: #2563eb;
}

/* 对话框样式优化 */
.el-dialog {
  border-radius: 12px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

/* 工具类 */
.text-gray {
  color: #64748b;
}

.text-danger {
  color: #dc2626;
  font-weight: 600;
}

.text-warning {
  color: #d97706;
  font-weight: 600;
}

.text-success {
  color: #059669;
  font-weight: 600;
}

/* 响应式工具类 */
@media (max-width: 768px) {
  .el-card__header {
    padding: 16px 20px 12px;
  }
  
  .el-card__body {
    padding: 20px;
  }
}

@media (max-width: 480px) {
  .el-card__header {
    padding: 12px 16px 8px;
  }
  
  .el-card__body {
    padding: 16px;
  }
}
</style>
