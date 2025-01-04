import request from '@/utils/request'

// 获取商品列表
export function getProductList(params) {
  return request({
    url: '/product/list',
    method: 'get',
    params
  })
}

// 获取商品分类
export function getCategoryList() {
  return request({
    url: '/product/category',
    method: 'get'
  })
}

// 新增商品
export function createProduct(data) {
  return request({
    url: '/product',
    method: 'post',
    data
  })
}

// 更新商品
export function updateProduct(id, data) {
  return request({
    url: `/product/${id}`,
    method: 'put',
    data
  })
}

// 删除商品
export function deleteProduct(id) {
  return request({
    url: `/product/${id}`,
    method: 'delete'
  })
} 