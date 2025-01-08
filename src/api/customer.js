import request from '@/utils/request'

// 获取客户列表
export function getCustomerList(params) {
  return request({
    url: '/customers/list',
    method: 'get',
    params
  })
}

// 创建客户
export function createCustomer(data) {
  return request({
    url: '/customers',
    method: 'post',
    data
  })
} 