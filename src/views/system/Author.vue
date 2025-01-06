<template>
  <div class="author-container">
    <page-header title="作者管理">
      <template #action>
        <el-button type="primary" @click="handleAdd">
          新增作者
        </el-button>
      </template>
    </page-header>

    <!-- 搜索栏 -->
    <div class="search-bar">
      <el-form :inline="true" :model="queryParams">
        <el-form-item label="学号">
          <el-input v-model="queryParams.sno" placeholder="请输入学号" clearable style="width: 200px" />
        </el-form-item>
        <el-form-item label="姓名">
          <el-input v-model="queryParams.name" placeholder="请输入姓名" clearable style="width: 200px" />
        </el-form-item>
        <el-form-item label="年级">
          <el-input v-model="queryParams.grade" placeholder="请输入年级" clearable style="width: 200px" />
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
      <el-table-column prop="sno" label="学号" width="120" align="center" />
      <el-table-column prop="name" label="姓名" min-width="120" align="center" />
      <el-table-column prop="grade" label="年级" width="100" align="center" />
      <el-table-column prop="klass" label="班级" width="100" align="center" />
      <el-table-column label="操作" width="150" fixed="right" align="center">
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

    <!-- 添加/编辑对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="500px"
      @close="handleDialogClose">
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="100px">
        <el-form-item label="学号" prop="sno">
          <el-input v-model="form.sno" placeholder="请输入学号" :disabled="!!form.id" />
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="form.name" placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item label="年级" prop="grade">
          <el-input v-model="form.grade" placeholder="请输入年级" />
        </el-form-item>
        <el-form-item label="班级" prop="klass">
          <el-input v-model="form.klass" placeholder="请输入班级" />
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
import { ref, reactive, onMounted } from 'vue'
import { getAuthorList, createAuthor, updateAuthor, deleteAuthor } from '@/api/author'
import PageHeader from '@/components/common/PageHeader/index.vue'
import { ElMessage, ElMessageBox } from 'element-plus'

// 查询参数
const queryParams = reactive({
  sno: '',
  name: '',
  grade: ''
})

// 表单对话框
const dialogVisible = ref(false)
const dialogTitle = ref('新增作者')
const formRef = ref(null)
const submitLoading = ref(false)

// 表单数据
const form = reactive({
  sno: '',
  name: '',
  grade: '',
  klass: ''
})

// 表单验证规则
const rules = {
  sno: [
    { required: true, message: '请输入学号', trigger: 'blur' }
  ],
  name: [
    { required: true, message: '请输入姓名', trigger: 'blur' }
  ],
  grade: [
    { required: true, message: '请输入年级', trigger: 'blur' }
  ],
  klass: [
    { required: true, message: '请输入班级', trigger: 'blur' }
  ]
}

// 分页参数
const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0
})

// 表格数据
const tableData = ref([])
const loading = ref(false)

// 加载数据
const loadData = async () => {
  try {
    loading.value = true
    const res = await getAuthorList({
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
  Object.assign(queryParams, {
    sno: '',
    name: '',
    grade: ''
  })
  handleSearch()
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

// 新增作者
const handleAdd = () => {
  dialogTitle.value = '新增作者'
  dialogVisible.value = true
  Object.assign(form, {
    sno: '',
    name: '',
    grade: '',
    klass: ''
  })
}

// 编辑作者
const handleEdit = (row) => {
  dialogTitle.value = '编辑作者'
  dialogVisible.value = true
  Object.assign(form, row)
}

// 删除作者
const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm(`确认删除作者"${row.name}"吗？`, '提示', {
      type: 'warning'
    })
    await deleteAuthor(row.sno)
    ElMessage.success('删除成功')
    loadData()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除失败:', error)
      ElMessage.error('删除失败')
    }
  }
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
    
    if (form.id) {
      await updateAuthor(form)
      ElMessage.success('更新成功')
    } else {
      await createAuthor(form)
      ElMessage.success('创建成功')
    }
    dialogVisible.value = false
    loadData()
  } catch (error) {
    console.error('提交失败:', error)
    ElMessage.error('提交失败')
  } finally {
    submitLoading.value = false
  }
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.author-container {
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
</style> 