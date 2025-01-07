import request from '@/utils/request'

// 获取供货商列表
export function getSupplierList(params) {
  return request({
    url: '/suppliers/list',
    method: 'get',
    params
  })
}

// 创建供货商
export function createSupplier(data) {
  return request({
    url: '/suppliers',
    method: 'post',
    data
  })
}

// 更新供货商
export function updateSupplier(id, data) {
  return request({
    url: `/suppliers/${id}`,
    method: 'put',
    data
  })
}

// 删除供货商
export function deleteSupplier(id) {
  return request({
    url: `/suppliers/${id}`,
    method: 'delete'
  })
}