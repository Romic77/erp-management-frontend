<template>
  <div class="product-container">
    <page-header title="商品列表">
      <template #action>
        <el-button type="primary" @click="handleAdd">
          新增商品
        </el-button>
      </template>
    </page-header>

    <!-- 搜索栏 -->
    <div class="search-bar">
      <el-form :inline="true" :model="queryParams">
        <el-form-item label="商品编号">
          <el-input v-model="queryParams.id" placeholder="请输入商品编号" clearable style="width: 180px" />
        </el-form-item>
        <el-form-item label="产品名称">
          <el-input v-model="queryParams.name" placeholder="请输入产品名称" clearable style="width: 180px" />
        </el-form-item>
        <el-form-item label="品牌">
          <el-input v-model="queryParams.brand" placeholder="请输入品牌" clearable style="width: 180px" />
        </el-form-item>
        <el-form-item label="分类编号">
          <el-input v-model="queryParams.categoryId" placeholder="请输入分类编号" clearable style="width: 180px" />
        </el-form-item>
        <el-form-item label="条码">
          <el-input v-model="queryParams.barCode" placeholder="请输入条码" clearable style="width: 180px" />
        </el-form-item>
        <el-form-item label="价格区间">
          <el-input-number v-model="queryParams.minPrice" placeholder="最低价" :min="0" style="width: 120px" />
          <span class="mx-2">-</span>
          <el-input-number v-model="queryParams.maxPrice" placeholder="最高价" :min="0" style="width: 120px" />
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
      <el-table-column prop="id" label="编号" width="100" align="center" />
      <el-table-column label="商品图片" width="100" align="center">
        <template #default="{ row }">
          <el-image
            style="width: 50px; height: 50px"
            :src="row.photo"
            :preview-src-list="[row.photo]"
            :preview-teleported="true"
            fit="cover">
            <template #error>
              <div class="image-slot">
                <el-icon><Picture /></el-icon>
              </div>
            </template>
          </el-image>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="商品名称" min-width="150" align="center" />
      <el-table-column prop="brand" label="品牌" align="center" />
      <el-table-column prop="categoryId" label="分类编号" align="center" />
      <el-table-column prop="barCode" label="条码" align="center" />
      <el-table-column prop="quantityPerUnit" label="规格" align="center" />
      <el-table-column prop="unitPrice" label="单价" align="center">
        <template #default="{ row }">
          ¥{{ row.unitPrice }}
        </template>
      </el-table-column>
      <el-table-column prop="unitsInStock" label="库存数量" align="center" />
      <el-table-column prop="unitsSell" label="销售数量" align="center" />
      <el-table-column prop="unitsTotal" label="总量" align="center" />
      <el-table-column label="操作" width="200" fixed="right" align="center">
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

    <!-- 商品表单对话框 -->
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
        <el-form-item label="产品名称" prop="name">
          <el-input v-model="form.name" style="width: 260px" />
        </el-form-item>
        <el-form-item label="品牌" prop="brand">
          <el-input v-model="form.brand" style="width: 260px" />
        </el-form-item>
        <el-form-item label="分类编号" prop="categoryId">
          <el-input v-model="form.categoryId" style="width: 260px" />
        </el-form-item>
        <el-form-item label="条码" prop="barCode">
          <el-input v-model="form.barCode" style="width: 260px" />
        </el-form-item>
        <el-form-item label="规格" prop="quantityPerUnit">
          <el-input v-model="form.quantityPerUnit" style="width: 260px" />
        </el-form-item>
        <el-form-item label="单价" prop="unitPrice">
          <el-input-number 
            v-model="form.unitPrice" 
            :min="0.01" 
            :precision="2" 
            style="width: 260px" 
          />
        </el-form-item>
        <el-form-item label="库存数量" prop="unitsInStock">
          <el-input-number 
            v-model="form.unitsInStock" 
            :min="0" 
            style="width: 260px" 
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
import { ElMessage, ElMessageBox } from 'element-plus'
import { getProductList, createProduct, updateProduct, deleteProduct, updateProductStatus } from '@/api/product'
import PageHeader from '@/components/common/PageHeader/index.vue'
import { Picture } from '@element-plus/icons-vue'

// 查询参数
const queryParams = reactive({
  id: '',
  name: '',
  brand: '',
  categoryId: '',
  barCode: '',
  minPrice: null,
  maxPrice: null
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
  brand: '',
  categoryId: '',
  barCode: '',
  quantityPerUnit: '',
  unitPrice: 0,
  unitsInStock: 0,
  unitsSell: 0
})

// 表单校验规则
const rules = {
  name: [
    { required: true, message: '请输入商品名称', trigger: 'blur' }
  ],
  brand: [
    { required: true, message: '请输入品牌', trigger: 'blur' }
  ],
  categoryId: [
    { required: true, message: '请输入分类编号', trigger: 'blur' }
  ],
  barCode: [
    { required: true, message: '请输入条码', trigger: 'blur' }
  ],
  quantityPerUnit: [
    { required: true, message: '请输入规格', trigger: 'blur' }
  ],
  unitPrice: [
    { required: true, message: '请输入单价', trigger: 'blur' }
  ],
  unitsInStock: [
    { required: true, message: '请输入库存数量', trigger: 'blur' }
  ]
}

// 加载数据
const loadData = async () => {
  try {
    loading.value = true
    const res = await getProductList({
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
    id: '',
    name: '',
    brand: '',
    categoryId: '',
    barCode: '',
    minPrice: null,
    maxPrice: null
  })
  handleSearch()
}

// 新增商品
const handleAdd = () => {
  dialogTitle.value = '新增商品'
  dialogVisible.value = true
  Object.assign(form, {
    id: '',
    name: '',
    brand: '',
    categoryId: '',
    barCode: '',
    quantityPerUnit: '',
    unitPrice: 0,
    unitsInStock: 0,
    unitsSell: 0
  })
}

// 编辑商品
const handleEdit = (row) => {
  dialogTitle.value = '编辑商品'
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
      await updateProduct(form.id, form)
      ElMessage.success('更新成功')
    } else {
      await createProduct(form)
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

// 删除商品
const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm(`确认删除商品"${row.name}"吗？`, '提示', {
      type: 'warning'
    })
    await deleteProduct(row.id)
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
  const newStatus = row.status === 1 ? 0 : 1
  const actionText = newStatus === 1 ? '上架' : '下架'
  
  try {
    await ElMessageBox.confirm(`确认${actionText}商品"${row.name}"吗？`, '提示', {
      type: 'warning'
    })
    await updateProductStatus(row.id, newStatus)
    ElMessage.success(`${actionText}成功`)
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
.product-container {
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

:deep(.el-dialog__body) {
  padding: 20px 40px;
}

.mx-2 {
  margin: 0 8px;
}

.image-slot {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background: #f5f7fa;
  color: #909399;
}

:deep(.el-image-viewer__mask) {
  background: rgba(0, 0, 0, 0.8);
}

:deep(.el-image-viewer__close) {
  color: #fff;
}
</style> 