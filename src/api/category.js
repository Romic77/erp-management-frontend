import request from '@/utils/request'

// 获取分类列表(树形)
export function getCategoryList() {
  return request({
    url: '/categories/tree',
    method: 'get'
  })
}

// 创建分类
export function createCategory(data) {
  return request({
    url: '/categories',
    method: 'post',
    data
  })
}

// 更新分类
export function updateCategory(data) {
  return request({
    url: `/categories/${data.id}`,
    method: 'put',
    data
  })
}

// 删除分类
export function deleteCategory(id) {
  return request({
    url: `/categories/${id}`,
    method: 'delete'
  })
} 