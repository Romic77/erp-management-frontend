# ERP Management System Frontend

基于 Vue 3 + Element Plus + Vite 的进销存管理系统前端项目

## 技术栈

- Vue 3 - 渐进式 JavaScript 框架
- Vue Router 4 - 官方路由管理器
- Element Plus - 基于 Vue 3 的组件库
- Axios - HTTP 请求库
- Vite - 下一代前端构建工具

## 开发环境要求

- Node.js >= 16
- npm >= 7
- Git

## 项目结构

```bash
src/
├── api/              # API 接口
│   ├── auth.js       # 认证相关接口
│   ├── product.js    # 商品相关接口
│   └── order.js      # 订单相关接口
├── assets/           # 静态资源
│   ├── images/       # 图片资源
│   └── styles/       # 样式资源
├── components/       # 公共组件
│   └── common/       # 通用组件
├── layout/          # 布局组件
│   └── index.vue    # 主布局
├── router/          # 路由配置
│   └── index.js     # 路由定义
├── utils/           # 工具函数
│   ├── request.js   # axios 封装
│   └── auth.js      # 认证工具
└── views/           # 页面组件
    ├── login/       # 登录页
    ├── dashboard/   # 控制台
    ├── product/     # 商品管理
    └── order/       # 订单管理
```

## 快速开始

1. 克隆项目
```bash
git clone <repository-url>
cd erp-management-frontend
```

2. 安装依赖
```bash
npm install
```

3. 启动开发服务器
```bash
npm run dev
# 或
npm run serve
```

4. 打包构建
```bash
# 生产环境打包
npm run build:prod

# 测试环境打包
npm run build:stage

# 预览打包结果
npm run preview
```

## 环境配置

项目包含三个环境配置文件：

- `.env.development`: 开发环境配置
  ```properties
  VITE_NODE_ENV=development
  VITE_APP_BASE_API=/api
  ```

- `.env.production`: 生产环境配置
  ```properties
  VITE_NODE_ENV=production
  VITE_APP_BASE_API=/api
  ```

- `.env.staging`: 测试环境配置
  ```properties
  VITE_NODE_ENV=staging
  VITE_APP_BASE_API=/api
  ```

## 代理配置

开发环境下的代理配置在 `vite.config.js` 中：

```javascript
server: {
  host: '0.0.0.0',
  port: 8080,
  proxy: {
    '/api': {
      target: 'http://localhost:8180',
      changeOrigin: true
    }
  }
}
```

## 主要功能模块

- [x] 用户认证
  - 登录/登出
  - 记住密码
  - Token 管理
- [x] 商品管理
  - 商品列表
  - 商品分类
  - 库存管理
- [x] 订单管理
  - 订单列表
  - 订单创建
  - 订单详情
- [x] 客户管理
  - 客户列表
  - 客户分析
- [x] 供应商管理
  - 供应商列表
  - 供应商评估
- [x] 快递公司管理
  - 快递公司列表
- [x] 系统设置
  - 用户管理
  - 员工管理
  - 权限配置

## 开发规范

1. 命名规范
   - 组件名：大驼峰命名（PascalCase）
   - 文件名：kebab-case
   - 变量名：小驼峰命名（camelCase）

2. 目录结构规范
   - 页面组件放在 views 目录
   - 公共组件放在 components 目录
   - API 接口统一管理在 api 目录

3. 代码风格
   - 使用 ESLint 进行代码规范检查
   - 使用 Prettier 进行代码格式化
   - 提交前进行代码检查

## 部署说明

1. 构建生产环境代码
```bash
npm run build:prod
```

2. 创建nginx的docker服务

   ```
   docker run -d \
     --name nginx \
     -p 8000:8000 \
     -v /usr/local/soft/dist:/usr/share/nginx/html/dist:ro \ 
     -v /usr/local/soft/nginx/conf/nginx.conf:/etc/nginx/nginx.conf:ro \
     nginx
   ```

   

3. 部署 dist 目录

   - 将 dist 目录下的文件复制到 Web 服务器的对应目录
   - 确保 Web 服务器已正确配置

4. 配置 Web 服务器
   - Nginx 配置示例：
   ```nginx
   server {
       listen 8000;
       server_name localhost;
       charset utf-8;
       
       # gzip 配置
       gzip on;
       gzip_min_length 1k;
       gzip_comp_level 6;
       gzip_types text/plain text/css text/javascript application/json application/javascript application/x-javascript application/xml;
       gzip_vary on;
       gzip_disable "MSIE [1-6]\.";
       gzip_proxied any;
   
       # 静态资源缓存
       location ~* \.(jpg|jpeg|png|gif|ico|css|js)$ {
           root /usr/share/nginx/html/erp;
           expires 7d;
           add_header Cache-Control "public, no-transform";
       }
   
       # 前端项目
       location / {
           root /usr/share/nginx/html/erp;
           index index.html;
           try_files $uri $uri/ /index.html;
           
           # 安全相关头部
           add_header X-Frame-Options "SAMEORIGIN";
           add_header X-XSS-Protection "1; mode=block";
           add_header X-Content-Type-Options "nosniff";
       }
   
       # 后端API代理
       location /api {
           proxy_pass http://localhost:8180;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
           proxy_cache_bypass $http_upgrade;
           
           # 超时设置
           proxy_connect_timeout 60s;
           proxy_send_timeout 60s;
           proxy_read_timeout 60s;
       }
   
       # 禁止访问隐藏文件
       location ~ /\. {
           deny all;
           access_log off;
           log_not_found off;
       }
   
       # 禁止访问备份文件
       location ~ ~$ {
           deny all;
           access_log off;
           log_not_found off;
       }
   
       # 错误页面配置
       error_page 404 /404.html;
       error_page 500 502 503 504 /50x.html;
       location = /50x.html {
           root /usr/share/nginx/html;
       }
   
       # 访问日志配置
       access_log /var/log/nginx/erp.access.log combined buffer=512k flush=1m;
       error_log /var/log/nginx/erp.error.log warn;
   }
   ```

5. 部署命令
   ```bash
   # 创建部署目录
   sudo mkdir -p /usr/share/nginx/html/erp
   
   # 复制打包文件
   sudo cp -r dist/* /usr/share/nginx/html/erp/
   
   # 重启 Nginx
   sudo nginx -t && sudo systemctl restart nginx
   ```

## 常见问题

1. 安装依赖失败
```bash
# 清除 npm 缓存
npm cache clean --force
# 删除 node_modules
rm -rf node_modules
# 重新安装依赖
npm install
```

2. 开发环境跨域问题
   - 检查 vite.config.js 中的代理配置
   - 确保后端服务正常运行
   - 检查请求 URL 是否正确

3. 环境变量使用注意事项
   - 环境变量必须以 VITE_ 开头
   - 通过 import.meta.env 访问环境变量
   - 修改环境变量后需要重启开发服务器

## 更新日志

### v1.0.0 (2024-01-20)
- 初始版本发布
- 实现基础功能模块
- 使用 Vite 作为构建工具
- 完善项目文档

## 贡献指南

1. Fork 项目
2. 创建功能分支
3. 提交代码
4. 创建 Pull Request

## License

[MIT](LICENSE)

## 联系方式

- 项目负责人：[Your Name]
- Email：[Your Email]
- GitHub：[Your GitHub]
