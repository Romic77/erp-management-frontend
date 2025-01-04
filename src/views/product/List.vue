<template>
  <div class="product-list">
    <!-- 搜索栏 -->
    <div class="search-bar">
      <el-form :inline="true" :model="searchForm">
        <el-form-item label="商品名称">
          <el-input v-model="searchForm.name" placeholder="请输入商品名称" clearable />
        </el-form-item>
        <el-form-item label="商品分类">
          <el-cascader
            v-model="searchForm.categoryId"
            :options="categoryOptions"
            :props="{ 
              checkStrictly: true,
              label: 'name',
              value: 'id',
            }"
            clearable
            placeholder="请选择商品分类"
          />
        </el-form-item>
        <el-form-item label="品牌">
          <el-input v-model="searchForm.brand" placeholder="请输入品牌" clearable />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 工具栏 -->
    <div class="toolbar">
      <el-button type="primary" @click="handleAdd">新增商品</el-button>
      <el-button type="danger" :disabled="!selectedProducts.length" @click="handleBatchDelete">
        批量删除
      </el-button>
    </div>

    <!-- 表格 -->
    <el-table
      v-loading="loading"
      :data="productList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column prop="id" label="商品编号" width="100" />
      <el-table-column prop="name" label="商品名称" min-width="200" show-overflow-tooltip />
      <el-table-column prop="categoryName" label="商品分类" width="150" />
      <el-table-column prop="brand" label="品牌" width="120" />
      <el-table-column prop="price" label="价格" width="120">
        <template #default="{ row }">
          ¥{{ row.price }}
        </template>
      </el-table-column>
      <el-table-column prop="stock" label="库存" width="100" />
      <el-table-column prop="status" label="状态" width="100">
        <template #default="{ row }">
          <el-tag :type="row.status === 1 ? 'success' : 'info'">
            {{ row.status === 1 ? '上架' : '下架' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200" fixed="right">
        <template #default="{ row }">
          <el-button link type="primary" @click="handleEdit(row)">编辑</el-button>
          <el-button link type="primary" @click="handleToggleStatus(row)">
            {{ row.status === 1 ? '下架' : '上架' }}
          </el-button>
          <el-button link type="danger" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="pagination">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :total="total"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <!-- 新增/编辑对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogType === 'add' ? '新增商品' : '编辑商品'"
      width="600px"
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item label="商品名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入商品名称" />
        </el-form-item>
        <el-form-item label="商品分类" prop="categoryId">
          <el-cascader
            v-model="form.categoryId"
            :options="categoryOptions"
            :props="{ 
              checkStrictly: true,
              label: 'name',
              value: 'id',
            }"
            placeholder="请选择商品分类"
          />
        </el-form-item>
        <el-form-item label="品牌" prop="brand">
          <el-input v-model="form.brand" placeholder="请输入品牌" />
        </el-form-item>
        <el-form-item label="价格" prop="price">
          <el-input-number 
            v-model="form.price"
            :precision="2"
            :step="0.1"
            :min="0"
          />
        </el-form-item>
        <el-form-item label="库存" prop="stock">
          <el-input-number 
            v-model="form.stock"
            :min="0"
            :precision="0"
          />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio :label="1">上架</el-radio>
            <el-radio :label="0">下架</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input
            v-model="form.description"
            type="textarea"
            rows="3"
            placeholder="请输入商品描述"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmit">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

defineOptions({
  name: 'ProductListPage'
})

// 搜索表单
const searchForm = reactive({
  name: '',
  categoryId: '',
  brand: ''
})

// 表格数据
const loading = ref(false)
const productList = ref([])
const selectedProducts = ref([])
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

// 分类选项
const categoryOptions = ref([])

// 对话框控制
const dialogVisible = ref(false)
const dialogType = ref('add') // add 或 edit
const formRef = ref(null)
const form = reactive({
  id: '',
  name: '',
  categoryId: '',
  brand: '',
  price: 0,
  stock: 0,
  status: 1,
  description: ''
})

// 表单校验规则
const rules = {
  name: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
  categoryId: [{ required: true, message: '请选择商品分类', trigger: 'change' }],
  brand: [{ required: true, message: '请输入品牌', trigger: 'blur' }],
  price: [{ required: true, message: '请输入价格', trigger: 'blur' }],
  stock: [{ required: true, message: '请输入库存', trigger: 'blur' }],
  status: [{ required: true, message: '请选择状态', trigger: 'change' }]
}

// 初始化
onMounted(() => {
  fetchCategoryOptions()
  fetchProductList()
})

// 获取分类选项
const fetchCategoryOptions = async () => {
  // TODO: 调用后端接口获取分类数据
  categoryOptions.value = [
    {
      id: '01',
      name: '食品饮料',
      children: [
        {
          id: '0101',
          name: '饮料',
          children: [
            { id: '010101', name: '碳酸饮料' },
            { id: '010102', name: '果汁饮料' }
          ]
        }
      ]
    }
  ]
}

// 获取商品列表
const fetchProductList = async () => {
  loading.value = true
  try {
    // TODO: 调用后端接口获取商品列表
    // 模拟数据
    productList.value = [
      {
        id: 1,
        name: '可口可乐',
        categoryName: '碳酸饮料',
        brand: '可口可乐',
        price: 3.00,
        stock: 100,
        status: 1
      }
    ]
    total.value = 100
  } catch (error) {
    console.error('获取商品列表失败:', error)
    ElMessage.error('获取商品列表失败')
  } finally {
    loading.value = false
  }
}

// 搜索
const handleSearch = () => {
  currentPage.value = 1
  fetchProductList()
}

// 重置搜索
const resetSearch = () => {
  Object.keys(searchForm).forEach(key => {
    searchForm[key] = ''
  })
  handleSearch()
}

// 表格选择
const handleSelectionChange = (selection) => {
  selectedProducts.value = selection
}

// 分页
const handleSizeChange = (val) => {
  pageSize.value = val
  fetchProductList()
}

const handleCurrentChange = (val) => {
  currentPage.value = val
  fetchProductList()
}

// 新增
const handleAdd = () => {
  dialogType.value = 'add'
  Object.keys(form).forEach(key => {
    form[key] = key === 'status' ? 1 : ''
  })
  dialogVisible.value = true
}

// 编辑
const handleEdit = (row) => {
  dialogType.value = 'edit'
  Object.keys(form).forEach(key => {
    form[key] = row[key]
  })
  dialogVisible.value = true
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return
  await formRef.value.validate(async (valid) => {
    if (valid) {
      try {
        // TODO: 调用后端接口保存数据
        ElMessage.success(dialogType.value === 'add' ? '添加成功' : '修改成功')
        dialogVisible.value = false
        fetchProductList()
      } catch (error) {
        console.error('保存失败:', error)
        ElMessage.error('保存失败')
      }
    }
  })
}

// 删除
const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm('确认删除该商品吗？', '提示', {
      type: 'warning'
    })
    // TODO: 调用后端接口删除数据
    ElMessage.success('删除成功')
    fetchProductList()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除失败:', error)
      ElMessage.error('删除失败')
    }
  }
}

// 批量删除
const handleBatchDelete = async () => {
  if (!selectedProducts.value.length) return
  try {
    await ElMessageBox.confirm(`确认删除选中的 ${selectedProducts.value.length} 个商品吗？`, '提示', {
      type: 'warning'
    })
    // TODO: 调用后端接口批量删除数据
    ElMessage.success('删除成功')
    fetchProductList()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除失败:', error)
      ElMessage.error('删除失败')
    }
  }
}

// 切换状态
const handleToggleStatus = async (row) => {
  try {
    // TODO: 调用后端接口更新状态
    ElMessage.success(row.status === 1 ? '下架成功' : '上架成功')
    row.status = row.status === 1 ? 0 : 1
  } catch (error) {
    console.error('操作失败:', error)
    ElMessage.error('操作失败')
  }
}
</script>

<style scoped>
.product-list {
  padding: 20px;
}

.search-bar {
  background-color: #fff;
  padding: 20px;
  border-radius: 4px;
  margin-bottom: 20px;
}

.toolbar {
  margin-bottom: 20px;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

:deep(.el-input-number .el-input__wrapper) {
  width: 180px;
}
</style> 