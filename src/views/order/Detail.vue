<template>
  <div class="order-detail">
    <page-header title="订单详情">
      <template #action>
        <el-button @click="$router.back()">返回</el-button>
      </template>
    </page-header>

    <div class="detail-container" v-loading="loading">
      <el-descriptions :column="2" border>
        <el-descriptions-item label="订单编号">{{ detail.id }}</el-descriptions-item>
        <el-descriptions-item label="客户编号">{{ detail.customerId }}</el-descriptions-item>
        <el-descriptions-item label="员工编号">{{ detail.employeeId }}</el-descriptions-item>
        <el-descriptions-item label="订货日期">{{ formatDateTime(detail.orderDate) }}</el-descriptions-item>
        <el-descriptions-item label="到货日期">{{ formatDateTime(detail.arrivalDate) }}</el-descriptions-item>
        <el-descriptions-item label="发货日期">{{ formatDateTime(detail.shipDate) }}</el-descriptions-item>
        <el-descriptions-item label="运货商">{{ detail.shipperId }}</el-descriptions-item>
        <el-descriptions-item label="运单号">{{ detail.trackingNumber }}</el-descriptions-item>
        <el-descriptions-item label="运费">¥{{ detail.freight }}</el-descriptions-item>
        <el-descriptions-item label="收件人">{{ detail.contact }}</el-descriptions-item>
        <el-descriptions-item label="联系电话">{{ detail.phone }}</el-descriptions-item>
        <el-descriptions-item label="收件地址">{{ detail.shipAddress }}</el-descriptions-item>
        <el-descriptions-item label="省份">{{ detail.shipProvince }}</el-descriptions-item>
        <el-descriptions-item label="城市">{{ detail.shipCity }}</el-descriptions-item>
        <el-descriptions-item label="地区">{{ detail.shipRegion }}</el-descriptions-item>
      </el-descriptions>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getOrderDetail } from '@/api/order'
import { formatDateTime } from '@/utils/date'
import PageHeader from '@/components/common/PageHeader/index.vue'

const route = useRoute()
const router = useRouter()

const detail = ref({})
const loading = ref(false)

// 加载订单详情
const loadDetail = async () => {
  try {
    loading.value = true
    const res = await getOrderDetail(route.params.id)
    detail.value = res
  } catch (error) {
    console.error('加载失败:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadDetail()
})
</script>

<style scoped>
.order-detail {
  padding: 20px;
  background-color: #f5f7fa;
  min-height: calc(100vh - 84px);
}

.detail-container {
  background-color: #fff;
  padding: 20px;
  border-radius: 4px;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);
}
</style> 