<template>
  <div>
    <h1>欢迎使用百货进销存管理系统</h1>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
// import { getStatistics, getLatestOrders } from '@/api/dashboard'

// 统计数据
const statistics = ref({
  todayOrders: 0,
  monthSales: 0
})

// 最新订单
const latestOrders = ref([])

// 获取统计数据
const loadStatistics = async () => {
  try {
    // const res = await getStatistics()
    // statistics.value = res.data
  } catch (error) {
    console.error('获取统计数据失败:', error)
  }
}

// 获取最新订单
const loadLatestOrders = async () => {
  try {
    // const res = await getLatestOrders()
    // latestOrders.value = res.data
  } catch (error) {
    console.error('获取最新订单失败:', error)
  }
}

// 状态映射
const getStatusType = (status) => {
  const map = {
    1: 'success',
    2: 'warning',
    3: 'danger'
  }
  return map[status] || 'info'
}

const getStatusText = (status) => {
  const map = {
    1: '已完成',
    2: '处理中',
    3: '已取消'
  }
  return map[status] || '未知'
}

onMounted(() => {
  loadStatistics()
  loadLatestOrders()
})
</script>

<style scoped>
.dashboard-container {
  padding: 20px;
}

.chart-row {
  margin-top: 20px;
}

.latest-orders {
  margin-top: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-body {
  text-align: center;
}

.card-body h2 {
  margin: 0;
  font-size: 24px;
  color: #303133;
}
</style> 