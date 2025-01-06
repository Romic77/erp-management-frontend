import request from '@/utils/request'

// 获取订单列表
export function getOrderList(params) {
  return request({
    url: '/orders/list',
    method: 'get',
    params
  })
}

// 删除订单
export function deleteOrder(id) {
  return request({
    url: `/orders/${id}`,
    method: 'delete'
  })
}

// 获取订单详情
export function getOrderDetail(id) {
  return request({
    url: `/orders/${id}`,
    method: 'get'
  })
}

// 创建订单
export function createOrder(data) {
  return request({
    url: '/orders',
    method: 'post',
    data
  })
}

// 更新订单
export function updateOrder(id, data) {
  return request({
    url: `/orders/${id}`,
    method: 'put',
    data
  })
}

// 获取快递公司列表(用于选择)
export function getShipperOptions() {
  return request({
    url: '/shippers/list',
    method: 'get'
  })
}

// 获取客户列表(用于选择)
export function getCustomerOptions() {
  return request({
    url: '/customers/list',
    method: 'get'
  })
} 