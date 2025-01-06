import axios from 'axios'
import { ElMessage } from 'element-plus'
import router from '@/router'

const service = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API,
  timeout: 5000
})

// 请求拦截器
service.interceptors.request.use(
  config => {
    const token = localStorage.getItem('satoken')
    if (token) {
      config.headers['satoken'] = token
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  response => {
    const res = response.data
    
    // 请求成功
    if (res.code === 200) {
      return res.data
    }
    
    // token失效
    if (res.code === 401) {
      localStorage.removeItem('satoken')
      localStorage.removeItem('userInfo')
      router.push('/login')
      return Promise.reject(new Error('登录已过期，请重新登录'))
    }
    
    // 其他业务错误
    const error = new Error(res.message || '操作失败')
    error.code = res.code
    return Promise.reject(error)
  },
  error => {
    // 网络错误等
    const message = error.response?.data?.message || '网络错误'
    ElMessage.error(message)
    return Promise.reject(error)
  }
)

export default service 