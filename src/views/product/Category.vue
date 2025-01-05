<template>
  <div class="category-container">
    <page-header title="商品分类">
      <template #action>
        <el-button type="primary" @click="handleAdd">
          新增分类
        </el-button>
      </template>
    </page-header>

    <!-- 分类树形表格 -->
    <el-table
      v-loading="loading"
      :data="tableData"
      row-key="id"
      border
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      style="width: 100%">
      <el-table-column prop="id" label="分类编号" width="120" align="center" />
      <el-table-column prop="name" label="分类名称" min-width="200" align="left" />
      <el-table-column prop="level" label="级别" width="100" align="center" />
      <el-table-column label="操作" width="200" fixed="right" align="center">
        <template #default="{ row }">
          <el-button type="primary" link @click="handleAddSub(row)">添加子分类</el-button>
          <el-button type="primary" link @click="handleEdit(row)">编辑</el-button>
          <el-button type="danger" link @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

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
        <el-form-item label="分类名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入分类名称" />
        </el-form-item>
        <el-form-item label="上级分类" prop="parentId">
          <el-cascader
            v-model="form.parentId"
            :options="categoryOptions"
            :props="{ 
              checkStrictly: true,
              value: 'id',
              label: 'name',
              emitPath: false
            }"
            clearable
            placeholder="请选择上级分类"
          />
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
import { getCategoryList, createCategory, updateCategory, deleteCategory } from '@/api/category'
import PageHeader from '@/components/common/PageHeader/index.vue'
import { ElMessage, ElMessageBox } from 'element-plus'

// 表格数据
const tableData = ref([])
const loading = ref(false)

// 分类选项
const categoryOptions = ref([])

// 表单对话框
const dialogVisible = ref(false)
const dialogTitle = ref('新增分类')
const formRef = ref(null)
const submitLoading = ref(false)

// 表单数据
const form = reactive({
  name: '',
  parentId: undefined
})

// 表单验证规则
const rules = {
  name: [
    { required: true, message: '请输入分类名称', trigger: 'blur' }
  ]
}

// 加载数据
const loadData = async () => {
  try {
    loading.value = true
    const res = await getCategoryList()
    const data = JSON.parse(res)  // 解析 JSON 字符串
    tableData.value = data.data
    categoryOptions.value = JSON.parse(JSON.stringify(data.data))
  } catch (error) {
    console.error('加载失败:', error)
  } finally {
    loading.value = false
  }
}

// 打开新增对话框
const handleAdd = () => {
  dialogTitle.value = '新增分类'
  dialogVisible.value = true
  form.parentId = undefined
  // 重置表单
  if (formRef.value) {
    formRef.value.resetFields()
  }
}

// 打开添加子分类对话框
const handleAddSub = (row) => {
  dialogTitle.value = '新增子分类'
  dialogVisible.value = true
  form.parentId = row.id
  // 重置表单
  if (formRef.value) {
    formRef.value.resetFields()
  }
}

// 打开编辑对话框
const handleEdit = (row) => {
  dialogTitle.value = '编辑分类'
  dialogVisible.value = true
  Object.assign(form, row)
}

// 删除分类
const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm(`确认删除分类"${row.name}"吗？`, '提示', {
      type: 'warning'
    })
    await deleteCategory(row.id)
    ElMessage.success('删除成功')
    loadData()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除失败:', error)
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
      await updateCategory(form)
      ElMessage.success('更新成功')
    } else {
      await createCategory(form)
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

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.category-container {
  padding: 20px;
  background-color: #f5f7fa;
  min-height: calc(100vh - 84px);
}

.el-table {
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);
  margin-top: 20px;
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