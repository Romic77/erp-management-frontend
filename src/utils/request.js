import axios from 'axios'
import { ElMessage } from 'element-plus'

const service = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000
})

// 请求拦截器
service.interceptors.request.use(
  config => {
    // 可以在这里添加token等认证信息
    const token = localStorage.getItem('token')
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  error => {
    console.error('请求错误:', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  response => {
    const { code, message, data } = response.data
    
    if (code === 200) {
      return data
    }
    
    ElMessage.error(message || '操作失败')
    return Promise.reject(new Error(message || '操作失败'))
  },
  error => {
    console.error('响应错误:', error)
    const message = error.response?.data?.message || '网络错误'
    ElMessage.error(message)
    return Promise.reject(error)
  }
)

export default service 