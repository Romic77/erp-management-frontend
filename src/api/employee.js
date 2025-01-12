import request from '@/utils/request'

// 获取员工列表
export function getEmployeeList(params) {
  return request({
    url: '/employees/list',
    method: 'get',
    params
  })
}

// 添加员工
export function createEmployee(data) {
  return request({
    url: '/employees',
    method: 'post',
    data
  })
}

// 更新员工
export function updateEmployee(id, data) {
  return request({
    url: `/employees/${id}`,
    method: 'put',
    data
  })
}

// 删除员工
export function deleteEmployee(id) {
  return request({
    url: `/employees/${id}`,
    method: 'delete'
  })
}

// 更新员工状态
export function updateEmployeeStatus(id, status) {
  return request({
    url: `/employees/${id}/status`,
    method: 'put',
    params: { status }
  })
}