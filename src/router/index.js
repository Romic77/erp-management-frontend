import { createRouter, createWebHistory } from 'vue-router'
import Layout from '../layout/index.vue'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/login/index.vue'),
    meta: { title: '登录' }
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('../views/dashboard/Index.vue'),
        meta: { title: '控制台' }
      },
      {
        path: 'product',
        name: 'Product',
        redirect: '/product/list',
        meta: { title: '商品管理' },
        children: [
          {
            path: 'list',
            name: 'ProductList',
            component: () => import('../views/product/List.vue'),
            meta: { title: '商品列表' }
          },
          {
            path: 'category',
            name: 'ProductCategory',
            component: () => import('../views/product/Category.vue'),
            meta: { title: '商品分类' }
          }
        ]
      },
      {
        path: 'order',
        name: 'Order',
        redirect: '/order/list',
        meta: { title: '订单管理' },
        children: [
          {
            path: 'list',
            name: 'OrderList',
            component: () => import('../views/order/List.vue'),
            meta: { title: '订单列表' }
          },
          {
            path: 'detail/:id',
            name: 'OrderDetail',
            component: () => import('../views/order/Detail.vue'),
            meta: { title: '订单详情' }
          }
        ]
      },
      {
        path: 'customer',
        name: 'Customer',
        redirect: '/customer/list',
        meta: { title: '客户管理' },
        children: [
          {
            path: 'list',
            name: 'CustomerList',
            component: () => import('../views/customer/List.vue'),
            meta: { title: '客户列表' }
          },
          {
            path: 'analysis',
            name: 'CustomerAnalysis',
            component: () => import('../views/customer/Analysis.vue'),
            meta: { title: '客户分析' }
          }
        ]
      },
      {
        path: 'supplier',
        name: 'Supplier',
        redirect: '/supplier/list',
        meta: { title: '供应商管理' },
        children: [
          {
            path: 'list',
            name: 'SupplierList',
            component: () => import('../views/supplier/List.vue'),
            meta: { title: '供应商列表' }
          },
          {
            path: 'evaluation',
            name: 'SupplierEvaluation',
            component: () => import('../views/supplier/Evaluation.vue'),
            meta: { title: '供应商评估' }
          }
        ]
      },
      {
        path: 'inventory',
        name: 'Inventory',
        redirect: '/inventory/list',
        meta: { title: '供货商管理' },
        children: [
          {
            path: 'list',
            name: 'InventoryList',
            component: () => import('../views/inventory/List.vue'),
            meta: { title: '供货商列表' }
          }
        ]
      },
      {
        path: '/system',
        name: 'System',
        redirect: '/system/user',
        meta: { title: '系统管理' },
        children: [
          {
            path: 'user',
            name: 'User',
            component: () => import('../views/system/User.vue'),
            meta: { title: '用户管理' }
          },
          {
            path: 'employee',
            name: 'Employee',
            component: () => import('../views/system/Employee.vue'),
            meta: { title: '员工管理' }
          },
          {
            path: 'author',
            name: 'Author',
            component: () => import('../views/system/Author.vue'),
            meta: { title: '作者管理' }
          }
        ]
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
  // 如果访问登录页，直接放行
  if (to.path === '/login') {
    next()
    return
  }
  
  // 检查是否已登录
  const token = localStorage.getItem('token')
  if (!token) {
    next('/login')
    return
  }
  
  next()
})

export default router 