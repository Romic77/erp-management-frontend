import request from '@/utils/request'

// 获取作者列表
export function getAuthorList(params) {
  return request({
    url: '/authors/list',
    method: 'get',
    params
  })
}

// 创建作者
export function createAuthor(data) {
  return request({
    url: '/authors',
    method: 'post',
    data
  })
}

// 更新作者
export function updateAuthor(data) {
  return request({
    url: `/authors/${data.id}`,
    method: 'put',
    data
  })
}

// 删除作者
export function deleteAuthor(id) {
  return request({
    url: `/authors/${id}`,
    method: 'delete'
  })
} 