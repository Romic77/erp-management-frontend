import request from '@/utils/request'

// 获取员工列表
export function getEmployeeList(params) {
  return request({
    url: '/employee/list',
    method: 'get',
    params
  })
}

// 获取员工详情
export function getEmployeeDetail(id) {
  return request({
    url: `/employee/${id}`,
    method: 'get'
  })
}

// 新增员工
export function createEmployee(data) {
  return request({
    url: '/employee',
    method: 'post',
    data
  })
}

// 更新员工信息
export function updateEmployee(id, data) {
  return request({
    url: `/employee/${id}`,
    method: 'put',
    data
  })
}

// 删除员工
export function deleteEmployee(id) {
  return request({
    url: `/employee/${id}`,
    method: 'delete'
  })
}