<template>
  <div class="customer-container">
    <page-header title="客户列表" />

    <!-- 搜索栏 -->
    <div class="search-bar">
      <el-form :inline="true" :model="queryParams">
        <el-form-item label="客户公司">
          <el-input v-model="queryParams.name" placeholder="请输入客户公司名" clearable style="width: 200px" />
        </el-form-item>
        <el-form-item label="联系人">
          <el-input v-model="queryParams.contact" placeholder="请输入联系人" clearable style="width: 200px" />
        </el-form-item>
        <el-form-item label="省份">
          <el-input v-model="queryParams.province" placeholder="请输入省份" clearable style="width: 200px" />
        </el-form-item>
        <el-form-item label="联系电话">
          <el-input v-model="queryParams.phone" placeholder="请输入联系电话" clearable style="width: 200px" />
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
      <el-table-column prop="id" label="客户编号" width="100" align="center" />
      <el-table-column prop="name" label="客户公司" min-width="200" align="center" />
      <el-table-column prop="contact" label="联系人" width="120" align="center" />
      <el-table-column prop="phone" label="联系电话" width="150" align="center" />
      <el-table-column prop="province" label="省份" width="120" align="center" />
      <el-table-column prop="city" label="城市" width="120" align="center" />
      <el-table-column prop="region" label="地区" width="120" align="center" />
      <el-table-column prop="address" label="详细地址" min-width="250" align="center" />
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
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { getCustomerList } from '@/api/customer'
import PageHeader from '@/components/common/PageHeader/index.vue'

// 查询参数
const queryParams = reactive({
  name: '',
  contact: '',
  province: '',
  phone: ''
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

// 加载数据
const loadData = async () => {
  try {
    loading.value = true
    const res = await getCustomerList({
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
    name: '',
    contact: '',
    province: '',
    phone: ''
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

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.customer-container {
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