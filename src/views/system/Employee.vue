<template>
  <div class="employee-container">
    <page-header title="员工管理">
      <template #action>
        <el-button type="primary" @click="handleAdd">
          新增员工
        </el-button>
      </template>
    </page-header>

    <!-- 搜索栏 -->
    <div class="search-bar">
      <el-form :inline="true" :model="queryParams">
        <el-form-item label="姓名">
          <el-input v-model="queryParams.name" placeholder="请输入姓名" clearable />
        </el-form-item>
        <el-form-item label="职务">
          <el-input v-model="queryParams.title" placeholder="请输入职务" clearable />
        </el-form-item>
        <el-form-item label="地区">
          <el-input v-model="queryParams.region" placeholder="请输入地区" clearable />
        </el-form-item>
        <el-form-item label="雇佣日期">
          <el-date-picker
            v-model="dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="YYYY-MM-DD"
          />
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
      <el-table-column prop="id" label="员工编号" width="80" />
      <el-table-column prop="name" label="姓名" width="100" />
      <el-table-column prop="title" label="职务" width="120" />
      <el-table-column prop="gender" label="性别" width="60" />
      <el-table-column prop="birthDate" label="出生日期" width="100" />
      <el-table-column prop="hireDate" label="雇佣日期" width="100" />
      <el-table-column prop="region" label="所在地区" width="120" />
      <el-table-column prop="phone" label="家庭电话" width="120" />
      <el-table-column label="操作" width="150" fixed="right">
        <template #default="{ row }">
          <el-button type="primary" link @click="handleEdit(row)">编辑</el-button>
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

    <!-- 员工表单对话框 -->
    <el-dialog
      :title="dialogTitle"
      v-model="dialogVisible"
      width="500px"
      @close="handleDialogClose">
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="100px">
        <el-form-item label="姓名" prop="name">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="职务" prop="title">
          <el-input v-model="form.title" />
        </el-form-item>
        <el-form-item label="性别" prop="gender">
          <el-radio-group v-model="form.gender">
            <el-radio label="男">男</el-radio>
            <el-radio label="女">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="出生日期" prop="birthDate">
          <el-date-picker
            v-model="form.birthDate"
            type="date"
            placeholder="请选择出生日期"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>
        <el-form-item label="雇佣日期" prop="hireDate">
          <el-date-picker
            v-model="form.hireDate"
            type="date"
            placeholder="请选择雇佣日期"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>
        <el-form-item label="所在地区" prop="region">
          <el-input v-model="form.region" />
        </el-form-item>
        <el-form-item label="家庭电话" prop="phone">
          <el-input v-model="form.phone" />
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
import { ref, reactive, computed, watch, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getEmployeeList, createEmployee, updateEmployee, deleteEmployee, updateEmployeeStatus } from '@/api/employee'
import { formatDate } from '@/utils/date'
import PageHeader from '@/components/common/PageHeader/index.vue'

// 查询参数
const queryParams = reactive({
  name: '',
  title: '',
  region: '',
  startDate: undefined,
  endDate: undefined
})

// 日期范围
const dateRange = ref([])

// 监听日期范围变化
watch(dateRange, (val) => {
  queryParams.startDate = val ? val[0] : undefined
  queryParams.endDate = val ? val[1] : undefined
})

// 分页参数
const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0
})

// 表格数据
const tableData = ref([])
const loading = ref(false)

// 表单相关
const dialogVisible = ref(false)
const dialogTitle = ref('')
const submitLoading = ref(false)
const formRef = ref(null)
const form = reactive({
  id: '',
  name: '',
  title: '',
  gender: '男',
  birthDate: '',
  hireDate: '',
  region: '',
  phone: ''
})

// 表单校验规则
const rules = {
  name: [
    { required: true, message: '请输入姓名', trigger: 'blur' }
  ],
  title: [
    { required: true, message: '请输入职务', trigger: 'blur' }
  ],
  gender: [
    { required: true, message: '请选择性别', trigger: 'change' }
  ],
  birthDate: [
    { required: true, message: '请选择出生日期', trigger: 'change' }
  ],
  hireDate: [
    { required: true, message: '请选择雇佣日期', trigger: 'change' }
  ]
}

// 获取员工列表
const loadData = async () => {
  loading.value = true
  try {
    const { list, total } = await getEmployeeList({
      page: pagination.current,
      pageSize: pagination.pageSize,
      ...queryParams
    })
    tableData.value = list
    pagination.total = total
  } catch (error) {
    console.error('获取员工列表失败:', error)
  } finally {
    loading.value = false
  }
}

// 搜索
const handleSearch = () => {
  pagination.current = 1
  loadData()
}

// 重置
const handleReset = () => {
  dateRange.value = []
  Object.assign(queryParams, {
    name: '',
    title: '',
    region: '',
    startDate: undefined,
    endDate: undefined
  })
  handleSearch()
}

// 新增员工
const handleAdd = () => {
  dialogTitle.value = '新增员工'
  dialogVisible.value = true
  Object.assign(form, {
    id: '',
    name: '',
    title: '',
    gender: '男',
    birthDate: '',
    hireDate: '',
    region: '',
    phone: ''
  })
}

// 编辑员工
const handleEdit = (row) => {
  dialogTitle.value = '编辑员工'
  dialogVisible.value = true
  Object.assign(form, { ...row })
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    submitLoading.value = true
    
    if (form.id) {
      await updateEmployee(form.id, form)
      ElMessage.success('更新成功')
    } else {
      await createEmployee(form)
      ElMessage.success('创建成功')
    }
    
    dialogVisible.value = false
    loadData()
  } catch (error) {
    console.error('提交失败:', error)
  } finally {
    submitLoading.value = false
  }
}

// 删除员工
const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm(`确认删除员工"${row.name}"吗？`, '提示', {
      type: 'warning'
    })
    await deleteEmployee(row.id)
    ElMessage.success('删除成功')
    loadData()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除失败:', error)
    }
  }
}

// 更新状态
const handleUpdateStatus = async (row) => {
  try {
    await ElMessageBox.confirm(`确认将员工"${row.name}"设置为离职状态吗？`, '提示', {
      type: 'warning'
    })
    await updateEmployeeStatus(row.id, 2)
    ElMessage.success('更新成功')
    loadData()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('更新失败:', error)
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

// 对话框关闭
const handleDialogClose = () => {
  formRef.value?.resetFields()
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.employee-container {
  padding: 20px;
}

.search-bar {
  background-color: #fff;
  padding: 20px;
  border-radius: 4px;
  margin-bottom: 20px;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style> 