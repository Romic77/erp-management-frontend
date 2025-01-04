import { ref, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

export default function useTable(options = {}) {
  const {
    listApi,
    deleteApi,
    defaultSort = {},
    defaultQuery = {}
  } = options

  // 表格数据
  const tableData = ref([])
  const loading = ref(false)
  const selectedRows = ref([])

  // 分页参数
  const pagination = reactive({
    current: 1,
    pageSize: 10,
    total: 0
  })

  // 查询参数
  const queryParams = reactive({
    ...defaultQuery
  })

  // 排序参数
  const sortParams = reactive({
    ...defaultSort
  })

  // 获取表格数据
  const loadData = async () => {
    if (!listApi) return
    loading.value = true
    try {
      const params = {
        page: pagination.current,
        pageSize: pagination.pageSize,
        ...queryParams,
        ...sortParams
      }
      const { list, total } = await listApi(params)
      tableData.value = list
      pagination.total = total
    } catch (error) {
      console.error('加载数据失败:', error)
    } finally {
      loading.value = false
    }
  }

  // 表格选择
  const handleSelectionChange = (selection) => {
    selectedRows.value = selection
  }

  // 删除
  const handleDelete = async (id) => {
    if (!deleteApi) return
    try {
      await ElMessageBox.confirm('确认删除该记录吗？', '提示', {
        type: 'warning'
      })
      await deleteApi(id)
      ElMessage.success('删除成功')
      loadData()
    } catch (error) {
      if (error !== 'cancel') {
        console.error('删除失败:', error)
      }
    }
  }

  // 批量删除
  const handleBatchDelete = async () => {
    if (!deleteApi || !selectedRows.value.length) return
    try {
      await ElMessageBox.confirm(
        `确认删除选中的 ${selectedRows.value.length} 条记录吗？`,
        '提示',
        { type: 'warning' }
      )
      await Promise.all(selectedRows.value.map(row => deleteApi(row.id)))
      ElMessage.success('删除成功')
      loadData()
    } catch (error) {
      if (error !== 'cancel') {
        console.error('删除失败:', error)
      }
    }
  }

  // 刷新
  const refresh = () => {
    pagination.current = 1
    loadData()
  }

  // 重置
  const reset = () => {
    pagination.current = 1
    Object.assign(queryParams, defaultQuery)
    Object.assign(sortParams, defaultSort)
    loadData()
  }

  return {
    tableData,
    loading,
    selectedRows,
    pagination,
    queryParams,
    sortParams,
    loadData,
    refresh,
    reset,
    handleSelectionChange,
    handleDelete,
    handleBatchDelete
  }
} 