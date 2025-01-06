import request from '@/utils/request'

// 登录接口
export function login(data) {
  return request({
    url: '/user/login',
    method: 'post',
    data
  })
}

// 退出登录
export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
} 