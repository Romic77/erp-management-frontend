<template>
  <div class="create-order-container">
    <page-header title="创建订单">
      <template #action>
        <el-button @click="$router.back()">返回</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="submitLoading">
          提交订单
        </el-button>
      </template>
    </page-header>

    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-width="120px"
      class="order-form">
      
      <!-- 客户信息 -->
      <el-card class="form-card">
        <template #header>
          <div class="card-header">
            <span>客户信息</span>
          </div>
        </template>
        
        <el-form-item label="客户" prop="customerId">
          <el-select
            v-model="form.customerId"
            placeholder="请选择客户"
            style="width: 100%"
            filterable>
            <el-option
              v-for="item in customerOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
      </el-card>

      <!-- 收货信息 -->
      <el-card class="form-card">
        <template #header>
          <div class="card-header">
            <span>收货信息</span>
          </div>
        </template>
        
        <el-form-item label="收件人" prop="contact">
          <el-input v-model="form.contact" placeholder="请输入收件人姓名" />
        </el-form-item>
        
        <el-form-item label="联系电话" prop="phone">
          <el-input v-model="form.phone" placeholder="请输入联系电话" />
        </el-form-item>
        
        <el-form-item label="所在地区" required>
          <el-row :gutter="10">
            <el-col :span="8">
              <el-form-item prop="shipProvince">
                <el-input v-model="form.shipProvince" placeholder="省份" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item prop="shipCity">
                <el-input v-model="form.shipCity" placeholder="城市" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item prop="shipRegion">
                <el-input v-model="form.shipRegion" placeholder="地区" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form-item>
        
        <el-form-item label="详细地址" prop="shipAddress">
          <el-input
            v-model="form.shipAddress"
            type="textarea"
            placeholder="请输入详细地址"
          />
        </el-form-item>
      </el-card>

      <!-- 配送信息 -->
      <el-card class="form-card">
        <template #header>
          <div class="card-header">
            <span>配送信息</span>
          </div>
        </template>
        
        <el-form-item label="快递公司" prop="shipperId">
          <el-select
            v-model="form.shipperId"
            placeholder="请选择快递公司"
            style="width: 100%">
            <el-option
              v-for="item in shipperOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        
        <el-form-item label="运单号" prop="trackingNumber">
          <el-input v-model="form.trackingNumber" placeholder="请输入运单号" />
        </el-form-item>
        
        <el-form-item label="运费" prop="freight">
          <el-input-number
            v-model="form.freight"
            :precision="2"
            :step="0.1"
            :min="0"
            style="width: 100%"
          />
        </el-form-item>
      </el-card>
    </el-form>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { createOrder, getShipperOptions, getCustomerOptions } from '@/api/order'
import PageHeader from '@/components/common/PageHeader/index.vue'
import { ElMessage } from 'element-plus'

const router = useRouter()

// 表单数据
const form = reactive({
  customerId: undefined,
  shipperId: undefined,
  trackingNumber: '',
  freight: 0,
  contact: '',
  phone: '',
  shipAddress: '',
  shipProvince: '',
  shipCity: '',
  shipRegion: ''
})

// 表单验证规则
const rules = {
  customerId: [
    { required: true, message: '请选择客户', trigger: 'change' }
  ],
  shipperId: [
    { required: true, message: '请选择快递公司', trigger: 'change' }
  ],
  freight: [
    { required: true, message: '请输入运费', trigger: 'blur' }
  ],
  contact: [
    { required: true, message: '请输入收件人姓名', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: '请输入联系电话', trigger: 'blur' }
  ],
  shipAddress: [
    { required: true, message: '请输入详细地址', trigger: 'blur' }
  ],
  shipProvince: [
    { required: true, message: '请输入省份', trigger: 'blur' }
  ],
  shipCity: [
    { required: true, message: '请输入城市', trigger: 'blur' }
  ],
  shipRegion: [
    { required: true, message: '请输入地区', trigger: 'blur' }
  ]
}

// 选项数据
const customerOptions = ref([])
const shipperOptions = ref([])

// 加载选项数据
const loadOptions = async () => {
  try {
    const [customerRes, shipperRes] = await Promise.all([
      getCustomerOptions(),
      getShipperOptions()
    ])
    customerOptions.value = customerRes.data
    shipperOptions.value = shipperRes.data
  } catch (error) {
    console.error('加载选项数据失败:', error)
  }
}

// 表单引用
const formRef = ref(null)
const submitLoading = ref(false)

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    submitLoading.value = true
    
    const res = await createOrder(form)
    ElMessage.success('创建成功')
    router.push(`/order/detail/${res.data}`)
  } catch (error) {
    console.error('提交失败:', error)
    ElMessage.error('提交失败')
  } finally {
    submitLoading.value = false
  }
}

onMounted(() => {
  loadOptions()
})
</script>

<style scoped>
.create-order-container {
  padding: 20px;
  background-color: #f5f7fa;
  min-height: calc(100vh - 84px);
}

.form-card {
  margin-bottom: 20px;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

:deep(.el-form-item__label) {
  font-weight: normal;
}
</style> 