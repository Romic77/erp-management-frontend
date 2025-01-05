import request from '@/utils/request'

// 获取商品列表
export function getProductList(params) {
  return request({
    url: '/products/list',
    method: 'get',
    params
  })
}

// 创建商品
export function createProduct(data) {
  return request({
    url: '/products',
    method: 'post',
    data
  })
}

// 更新商品
export function updateProduct(id, data) {
  return request({
    url: `/products/${id}`,
    method: 'put',
    data
  })
}

// 删除商品
export function deleteProduct(id) {
  return request({
    url: `/products/${id}`,
    method: 'delete'
  })
}

// 更新商品状态
export function updateProductStatus(id, status) {
  return request({
    url: `/products/${id}/status`,
    method: 'put',
    params: { status }
  })
} 