<template>
    <div class="login-container">
      <el-card class="login-card">
        <template #header>
          <h2>百货进销存管理系统</h2>
        </template>
        
        <el-form :model="loginForm" :rules="rules" ref="loginFormRef">
          <el-form-item prop="username">
            <el-input 
              v-model="loginForm.username"
              prefix-icon="User"
              placeholder="请输入用户名">
            </el-input>
          </el-form-item>
          
          <el-form-item prop="password">
            <el-input 
              v-model="loginForm.password"
              prefix-icon="Lock"
              type="password"
              placeholder="请输入密码"
              @keyup.enter="handleLogin">
            </el-input>
          </el-form-item>
  
          <el-form-item>
            <el-button type="primary" @click="handleLogin" style="width: 100%">
              登录
            </el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
  </template>
  
  <script setup>
  defineOptions({
    name: 'LoginPage'
  })
  
  import { ref, reactive } from 'vue'
  import { useRouter } from 'vue-router'
  import { ElMessage } from 'element-plus'
  
  const router = useRouter()
  const loginFormRef = ref(null)
  
  const loginForm = reactive({
    username: '',
    password: ''
  })
  
  const rules = {
    username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
    password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
  }
  
  const handleLogin = () => {
    if (!loginFormRef.value) return
    
    loginFormRef.value.validate((valid) => {
      if (valid) {
        // TODO: 调用登录接口
        if (loginForm.username === 'admin' && loginForm.password === '123456') {
          // 设置token
          localStorage.setItem('token', 'dummy-token')
          
          ElMessage.success('登录成功')
          // 跳转到首页
          router.push('/')
        } else {
          ElMessage.error('用户名或密码错误')
        }
      }
    })
  }
  </script>
  
  <style scoped>
  .login-container {
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #f5f5f5;
  }
  
  .login-card {
    width: 400px;
  }
  
  :deep(.el-card__header) {
    text-align: center;
    padding: 15px;
    
    h2 {
      margin: 0;
      font-size: 20px;
      color: #303133;
    }
  }
  </style> 