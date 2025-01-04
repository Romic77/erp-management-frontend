<template>
  <div class="dashboard-container">
    <el-row :gutter="20">
      <el-col :span="6">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>今日订单</span>
            </div>
          </template>
          <div class="card-body">
            <h2>123</h2>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>今日销售额</span>
            </div>
          </template>
          <div class="card-body">
            <h2>￥45,600</h2>
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
            <h2>￥345,600</h2>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>库存预警</span>
            </div>
          </template>
          <div class="card-body">
            <h2>12</h2>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
defineOptions({
  name: 'DashboardPage'
})
</script>

<style scoped>
.dashboard-container {
  padding: 20px;
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.card-body {
  text-align: center;
  padding: 20px 0;
}
</style> 