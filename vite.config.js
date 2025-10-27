import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'

export default defineConfig({
  plugins: [
    react(),
    visualizer({
      filename: 'dist/stats.html',
      open: false, // Set to true if you want it to open automatically
      gzipSize: true,
      brotliSize: true,
    })
  ],
  build: {
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.warn']
      },
      mangle: {
        safari10: true
      },
      format: {
        comments: false
      }
    },
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Split vendor chunks
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom')) {
              return 'vendor-react';
            }
            if (id.includes('framer-motion')) {
              return 'vendor-animation';
            }
            if (id.includes('lucide-react')) {
              return 'vendor-icons';
            }
            if (id.includes('aos')) {
              return 'vendor-aos';
            }
            if (id.includes('@lottiefiles')) {
              return 'vendor-lottie';
            }
            return 'vendor-other';
          }
          
          // Split page chunks
          if (id.includes('src/Pages/')) {
            const page = id.split('src/Pages/')[1].split('/')[0];
            if (page) return `page-${page.toLowerCase()}`;
          }
          
          // Split component chunks
          if (id.includes('src/components/')) {
            return 'components';
          }
        },
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    },
    chunkSizeWarningLimit: 800,
    target: 'es2015'
  },
  optimizeDeps: {
    include: [
      'react', 
      'react-dom', 
      'framer-motion',
      'lucide-react'
    ],
    exclude: ['@lottiefiles/dotlottie-react']
  }
})