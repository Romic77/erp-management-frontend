import request from '@/utils/request'

// 获取快递公司列表
export function getShipperList(params) {
  return request({
    url: '/shippers/list',
    method: 'get',
    params
  })
}

// 创建快递公司
export function createShipper(data) {
  return request({
    url: '/shippers',
    method: 'post',
    data
  })
}

// 更新快递公司
export function updateShipper(id, data) {
  return request({
    url: `/shippers/${id}`,
    method: 'put',
    data
  })
}

// 删除快递公司
export function deleteShipper(id) {
  return request({
    url: `/shippers/${id}`,
    method: 'delete'
  })
} 