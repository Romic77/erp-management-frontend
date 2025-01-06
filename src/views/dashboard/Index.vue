<template>
  <div class="dashboard-container">
    <!-- 统计卡片 -->
    <el-row :gutter="20">
      <el-col :span="6">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>今日订单</span>
            </div>
          </template>
          <div class="card-body">
            <h2>{{ statistics.todayOrders }}</h2>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>本月销售额</span>
            </div>
          </template>
          <div class="card-body">
            <h2>¥{{ statistics.monthSales }}</h2>
          </div>
        </el-card>
      </el-col>
      <!-- 更多统计卡片 -->
    </el-row>

    <!-- 图表区域 -->
    <el-row :gutter="20" class="chart-row">
      <el-col :span="12">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>销售趋势</span>
            </div>
          </template>
          <!-- 销售趋势图表 -->
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>商品分类占比</span>
            </div>
          </template>
          <!-- 商品分类饼图 -->
        </el-card>
      </el-col>
    </el-row>

    <!-- 最新订单列表 -->
    <el-card shadow="hover" class="latest-orders">
      <template #header>
        <div class="card-header">
          <span>最新订单</span>
        </div>
      </template>
      <el-table :data="latestOrders" stripe>
        <el-table-column prop="id" label="订单编号" width="180" />
        <el-table-column prop="customerName" label="客户名称" width="120" />
        <el-table-column prop="amount" label="订单金额" width="120" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">
              {{ getStatusText(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" />
      </el-table>
    </el-card>
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