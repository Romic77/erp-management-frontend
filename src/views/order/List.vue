<template>
  <div class="order-container">
    <page-header title="订单列表">
      <template #action>
        <el-button type="primary" @click="handleAdd">
          新增订单
        </el-button>
      </template>
    </page-header>

    <!-- 搜索栏 -->
    <div class="search-bar">
      <el-form :inline="true" :model="queryParams">
        <el-form-item label="订单编号">
          <el-input v-model="queryParams.id" placeholder="请输入订单编号" clearable style="width: 180px" />
        </el-form-item>
        <el-form-item label="客户编号">
          <el-input v-model="queryParams.customerId" placeholder="请输入客户编号" clearable style="width: 180px" />
        </el-form-item>
        <el-form-item label="员工编号">
          <el-input v-model="queryParams.employeeId" placeholder="请输入员工编号" clearable style="width: 180px" />
        </el-form-item>
        <el-form-item label="订单日期">
          <el-date-picker
            v-model="dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="YYYY-MM-DD HH:mm:ss"
            :shortcuts="dateShortcuts"
            style="width: 360px"
          />
        </el-form-item>
        <el-form-item label="收件省份">
          <el-input v-model="queryParams.shipProvince" placeholder="请输入省份" clearable style="width: 180px" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 表格 -->
    <el-table
      v-loading="loading"
      :data="tableData"
      border
      style="width: 100%">
      <el-table-column prop="id" label="订单编号" width="180" align="center" />
      <el-table-column prop="customerId" label="客户编号" width="100" align="center" />
      <el-table-column prop="employeeId" label="员工编号" width="100" align="center" />
      <el-table-column prop="orderDate" label="订货日期" width="180" align="center">
        <template #default="{ row }">
          {{ formatDateTime(row.orderDate) }}
        </template>
      </el-table-column>
      <el-table-column prop="arrivalDate" label="到货日期" width="180" align="center">
        <template #default="{ row }">
          {{ formatDateTime(row.arrivalDate) }}
        </template>
      </el-table-column>
      <el-table-column prop="shipDate" label="发货日期" width="180" align="center">
        <template #default="{ row }">
          {{ formatDateTime(row.shipDate) }}
        </template>
      </el-table-column>
      <el-table-column prop="contact" label="收件人" width="100" align="center" />
      <el-table-column prop="phone" label="联系电话" width="120" align="center" />
      <el-table-column prop="shipAddress" label="收件地址" min-width="200" align="center" />
      <el-table-column prop="freight" label="运费" width="100" align="center">
        <template #default="{ row }">
          ¥{{ row.freight }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150" fixed="right" align="center">
        <template #default="{ row }">
          <el-button type="primary" link @click="handleDetail(row)">详情</el-button>
          <el-button type="danger" link @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="pagination">
      <el-pagination
        v-model:current-page="pagination.current"
        v-model:page-size="pagination.pageSize"
        :total="pagination.total"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <!-- 添加新增订单对话框 -->
    <el-dialog
      v-model="dialogVisible"
      title="新增订单"
      width="800px"
      @close="handleDialogClose">
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="120px">
        <el-form-item label="客户编号" prop="customerId">
          <el-input v-model="form.customerId" placeholder="请输入客户编号" />
        </el-form-item>
        <el-form-item label="员工编号" prop="employeeId">
          <el-input v-model="form.employeeId" placeholder="请输入员工编号" />
        </el-form-item>
        <el-form-item label="收件人" prop="contact">
          <el-input v-model="form.contact" placeholder="请输入收件人" />
        </el-form-item>
        <el-form-item label="联系电话" prop="phone">
          <el-input v-model="form.phone" placeholder="请输入联系电话" />
        </el-form-item>
        <el-form-item label="收件地址" prop="shipAddress">
          <el-input v-model="form.shipAddress" placeholder="请输入收件地址" />
        </el-form-item>
        <el-form-item label="省份" prop="shipProvince">
          <el-input v-model="form.shipProvince" placeholder="请输入省份" />
        </el-form-item>
        <el-form-item label="城市" prop="shipCity">
          <el-input v-model="form.shipCity" placeholder="请输入城市" />
        </el-form-item>
        <el-form-item label="地区" prop="shipRegion">
          <el-input v-model="form.shipRegion" placeholder="请输入地区" />
        </el-form-item>
        <el-form-item label="运费" prop="freight">
          <el-input-number v-model="form.freight" :min="0" :precision="2" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="submitLoading">
          确定
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getOrderList, deleteOrder, createOrder } from '@/api/order'
import { formatDateTime } from '@/utils/date'
import PageHeader from '@/components/common/PageHeader/index.vue'

const router = useRouter()

// 查询参数
const queryParams = reactive({
  id: '',
  customerId: '',
  employeeId: '',
  startDate: undefined,
  endDate: undefined,
  shipProvince: ''
})

// 日期范围
const dateRange = ref([])

// 监听日期范围变化
watch(dateRange, (val) => {
  queryParams.startDate = val ? val[0] : undefined
  queryParams.endDate = val ? val[1] : undefined
})

// 日期快捷选项
const dateShortcuts = [
  {
    text: '最近一周',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
      return [start, end]
    },
  },
  {
    text: '最近一个月',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setMonth(start.getMonth() - 1)
      return [start, end]
    },
  },
  {
    text: '最近三个月',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setMonth(start.getMonth() - 3)
      return [start, end]
    },
  }
]

// 分页参数
const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0
})

// 表格数据
const tableData = ref([])
const loading = ref(false)

// 表单对话框
const dialogVisible = ref(false)
const formRef = ref(null)
const submitLoading = ref(false)

// 表单数据
const form = reactive({
  customerId: '',
  employeeId: '',
  contact: '',
  phone: '',
  shipAddress: '',
  shipProvince: '',
  shipCity: '',
  shipRegion: '',
  freight: 0
})

// 表单验证规则
const rules = {
  customerId: [
    { required: true, message: '请输入客户编号', trigger: 'blur' }
  ],
  employeeId: [
    { required: true, message: '请输入员工编号', trigger: 'blur' }
  ],
  contact: [
    { required: true, message: '请输入收件人', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: '请输入联系电话', trigger: 'blur' }
  ],
  shipAddress: [
    { required: true, message: '请输入收件地址', trigger: 'blur' }
  ],
  shipProvince: [
    { required: true, message: '请输入省份', trigger: 'blur' }
  ],
  shipCity: [
    { required: true, message: '请输入城市', trigger: 'blur' }
  ]
}

// 加载数据
const loadData = async () => {
  try {
    loading.value = true
    const res = await getOrderList({
      ...queryParams,
      page: pagination.current,
      pageSize: pagination.pageSize
    })
    tableData.value = res.list
    pagination.total = res.total
  } catch (error) {
    console.error('加载失败:', error)
  } finally {
    loading.value = false
  }
}

// 查询
const handleSearch = () => {
  pagination.current = 1
  loadData()
}

// 重置
const handleReset = () => {
  dateRange.value = []
  Object.assign(queryParams, {
    id: '',
    customerId: '',
    employeeId: '',
    startDate: undefined,
    endDate: undefined,
    shipProvince: ''
  })
  handleSearch()
}

// 打开新增对话框
const handleAdd = () => {
  dialogVisible.value = true
  // 重置表单
  if (formRef.value) {
    formRef.value.resetFields()
  }
}

// 查看详情
const handleDetail = (row) => {
  router.push(`/order/detail/${row.id}`)
}

// 删除订单
const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm(`确认删除订单"${row.id}"吗？`, '提示', {
      type: 'warning'
    })
    await deleteOrder(row.id)
    ElMessage.success('删除成功')
    loadData()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除失败:', error)
    }
  }
}

// 分页大小改变
const handleSizeChange = (val) => {
  pagination.pageSize = val
  loadData()
}

// 当前页改变
const handleCurrentChange = (val) => {
  pagination.current = val
  loadData()
}

// 关闭对话框
const handleDialogClose = () => {
  formRef.value?.resetFields()
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    submitLoading.value = true
    
    await createOrder(form)
    ElMessage.success('创建成功')
    dialogVisible.value = false
    loadData()  // 重新加载列表
  } catch (error) {
    console.error('提交失败:', error)
  } finally {
    submitLoading.value = false
  }
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.order-container {
  padding: 20px;
  background-color: #f5f7fa;
  min-height: calc(100vh - 84px);
}

.search-bar {
  background-color: #fff;
  padding: 20px;
  border-radius: 4px;
  margin-bottom: 20px;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);
}

.el-table {
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
  padding: 20px;
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);
}

:deep(.el-form-item__label) {
  font-weight: normal;
}

:deep(.el-table th) {
  background-color: #f5f7fa;
  color: #606266;
  font-weight: 500;
}

:deep(.el-button--primary) {
  --el-button-font-weight: normal;
}
</style> 