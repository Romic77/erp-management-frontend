<template>
  <el-container class="home-container">
    <el-aside width="200px">
      <el-menu
        router
        :default-active="route.path"
        class="el-menu-vertical"
        background-color="#545c64"
        text-color="#fff"
        active-text-color="#ffd04b">
        
        <el-menu-item index="/dashboard">
          <el-icon><Monitor /></el-icon>
          <span>控制台</span>
        </el-menu-item>
        
        <el-sub-menu index="/product">
          <template #title>
            <el-icon><Shop /></el-icon>
            <span>商品管理</span>
          </template>
          <el-menu-item index="/product/list">商品列表</el-menu-item>
          <el-menu-item index="/product/category">商品分类</el-menu-item>
        </el-sub-menu>

        <el-sub-menu index="/order">
          <template #title>
            <el-icon><List /></el-icon>
            <span>订单管理</span>
          </template>
          <el-menu-item index="/order/list">订单列表</el-menu-item>
        </el-sub-menu>

        <el-sub-menu index="/customer">
          <template #title>
            <el-icon><User /></el-icon>
            <span>客户管理</span>
          </template>
          <el-menu-item index="/customer/list">客户列表</el-menu-item>
          <el-menu-item index="/customer/analysis">客户分析</el-menu-item>
        </el-sub-menu>

        <el-sub-menu index="/supplier">
          <template #title>
            <el-icon><Van /></el-icon>
            <span>供应商管理</span>
          </template>
          <el-menu-item index="/supplier/list">供应商列表</el-menu-item>
          <el-menu-item index="/supplier/evaluation">供应商评估</el-menu-item>
        </el-sub-menu>

        <el-sub-menu index="/inventory">
          <template #title>
            <el-icon><ShoppingCart /></el-icon>
            <span>进销存管理</span>
          </template>
          <el-menu-item index="/inventory/purchase">进货管理</el-menu-item>
          <el-menu-item index="/inventory/stock">库存管理</el-menu-item>
          <el-menu-item index="/inventory/sales">销售管理</el-menu-item>
        </el-sub-menu>

        <el-sub-menu index="/system">
          <template #title>
            <el-icon><Setting /></el-icon>
            <span>系统管理</span>
          </template>
          <el-menu-item index="/system/user">用户管理</el-menu-item>
          <el-menu-item index="/system/employee">员工管理</el-menu-item>
        </el-sub-menu>
      </el-menu>
    </el-aside>
    
    <el-container>
      <el-header>
        <div class="header-left">百货进销存管理系统</div>
        <div class="header-right">
          <el-dropdown>
            <span class="el-dropdown-link">
              {{ userInfo.realName || userInfo.username }} <el-icon><ArrowDown /></el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item>个人信息</el-dropdown-item>
                <el-dropdown-item @click="handleLogout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>
      
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { logout } from '@/api/auth'
import { 
  Monitor,
  Shop,
  List,
  User,
  ShoppingCart,
  Setting,
  ArrowDown,
  Van
} from '@element-plus/icons-vue'

const router = useRouter()
const route = useRoute()

const userInfo = ref({
  username: '',
  realName: '',
  avatar: ''
})

onMounted(() => {
  const info = localStorage.getItem('userInfo')
  if (info) {
    userInfo.value = JSON.parse(info)
  }
})

const handleLogout = async () => {
  try {
    await logout()
    localStorage.removeItem('satoken')
    localStorage.removeItem('userInfo')
    router.push('/login')
    ElMessage.success('退出成功')
  } catch (error) {
    console.error('退出失败:', error)
    ElMessage.error('退出失败')
  }
}
</script>

<style scoped>
.home-container {
  height: 100vh;
}

.el-header {
  background-color: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #ddd;
}

.el-aside {
  background-color: #545c64;
}

.el-menu {
  border-right: none;
}

.header-right {
  cursor: pointer;
}

.el-dropdown-link {
  color: #409EFF;
  cursor: pointer;
}
</style> 