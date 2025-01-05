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