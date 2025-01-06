import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  return {
    plugins: [vue()],
    
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src')
      }
    },
    
    // 构建配置
    build: {
      // 生产环境不生成 sourceMap
      sourcemap: false,
      // 输出目录
      outDir: 'dist',
      // 静态资源目录
      assetsDir: 'static',
      // 小于此阈值的导入或引用资源将内联为 base64 编码
      assetsInlineLimit: 4096,
      // 启用/禁用 brotli 压缩大小报告
      brotliSize: false,
      // chunk 大小警告的限制
      chunkSizeWarningLimit: 2000,
      // 自定义底层的 Rollup 打包配置
      rollupOptions: {
        output: {
          // 分包配置
          manualChunks: {
            // 移除手动分包配置，让 Vite 自动处理
            // 'element-plus': ['element-plus'],
            // 'vue-vendor': ['vue', 'vue-router']
          },
          // 确保 chunk 加载顺序
          chunkFileNames: 'static/js/[name]-[hash].js',
          entryFileNames: 'static/js/[name]-[hash].js',
          assetFileNames: 'static/[ext]/[name]-[hash].[ext]'
        }
      },
      // 添加 CSS 代码分割配置
      cssCodeSplit: true,
      // 添加 minify 配置
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true
        }
      }
    },
    
    // 开发服务器配置
    server: {
      host: '0.0.0.0',
      port: 8080,
      open: true,
      cors: true,
      proxy: {
        '/api': {
          target: 'http://localhost:8180',
          changeOrigin: true
        }
      }
    },
    
    // CSS 配置
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@use "@/styles/element/index.scss" as *;`
        }
      }
    },
    
    // 性能优化配置
    optimizeDeps: {
      include: ['vue', 'vue-router', 'axios', 'element-plus']
    }
  }
}) 