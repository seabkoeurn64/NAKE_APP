import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    react({
      // ✅ Optimize React for production
      jsxRuntime: 'automatic',
    }),
    visualizer({
      filename: 'dist/stats.html',
      open: false,
      gzipSize: true,
      brotliSize: true,
      template: 'treemap', // Better visualization
    }),
  ],
  
  build: {
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: [
          'console.log', 
          'console.info', 
          'console.warn',
          'console.debug',
          'console.trace'
        ],
        passes: 3, // Increased passes for better compression
        unsafe: true,
        unsafe_math: true,
        unsafe_methods: true,
        unsafe_proto: true,
        unsafe_regexp: true,
        unsafe_undefined: true,
        dead_code: true,
        unused: true,
      },
      mangle: {
        safari10: true,
        properties: {
          regex: /^_[^_].*$/, // Mangle private properties
        },
      },
      format: {
        comments: false,
        beautify: false,
        ecma: 2018,
      },
    },
    
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // ✅ Ultra-fine vendor splitting
          if (id.includes('node_modules')) {
            // React core libraries (separate for better caching)
            if (id.includes('react-dom')) {
              return 'vendor-react-dom';
            }
            if (id.includes('react/') && !id.includes('react-dom')) {
              return 'vendor-react';
            }
            
            // Animation libraries (heavy - separate)
            if (id.includes('framer-motion')) {
              return 'vendor-framer-motion';
            }
            
            // Lottie animations (heavy - separate)
            if (id.includes('@lottiefiles/dotlottie-react')) {
              return 'vendor-lottie';
            }
            
            // Icons (medium size - separate)
            if (id.includes('lucide-react')) {
              return 'vendor-icons';
            }
            
            // Scroll animations (light - can be grouped)
            if (id.includes('aos')) {
              return 'vendor-aos';
            }
            
            // Small utilities (group together)
            if (id.includes('web-vitals') || id.includes('@vercel/speed-insights')) {
              return 'vendor-analytics';
            }
            
            // Everything else
            return 'vendor-other';
          }
          
          // ✅ Page-based splitting with route optimization
          if (id.includes('src/Pages/')) {
            const match = id.match(/src\/Pages\/([^\/]+)/);
            if (match) {
              const pageName = match[1].toLowerCase();
              
              // Group smaller pages to avoid too many small chunks
              const smallPages = ['contact', 'about'];
              if (smallPages.includes(pageName)) {
                return 'page-secondary';
              }
              
              // Critical pages get their own chunks
              return `page-${pageName}`;
            }
          }
          
          // ✅ Component splitting by type
          if (id.includes('src/components/')) {
            const match = id.match(/src\/components\/([^\/]+)/);
            if (match) {
              const componentType = match[1].toLowerCase();
              
              // Group UI components
              if (['ui', 'layout', 'common', 'shared'].includes(componentType)) {
                return 'components-ui';
              }
              
              // Heavy components get their own chunks
              if (['navbar', 'footer', 'welcome'].includes(componentType)) {
                return `components-${componentType}`;
              }
              
              return 'components-common';
            }
          }
          
          // ✅ Utility functions
          if (id.includes('src/utils/') || id.includes('src/hooks/')) {
            return 'utils';
          }
        },
        
        // ✅ Optimized file naming and structure
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.');
          const ext = info[info.length - 1];
          
          // Organize assets by type for better caching
          if (/\.(png|jpe?g|gif|svg|webp|avif)$/i.test(assetInfo.name)) {
            return 'assets/images/[name]-[hash].[ext]';
          }
          
          if (/\.(woff2?|eot|ttf|otf)$/i.test(assetInfo.name)) {
            return 'assets/fonts/[name]-[hash].[ext]';
          }
          
          if (/\.css$/i.test(assetInfo.name)) {
            return 'assets/css/[name]-[hash].[ext]';
          }
          
          return 'assets/[name]-[hash].[ext]';
        },
        
        // ✅ Optimized code splitting
        experimentalMinChunkSize: 20000, // 20KB minimum chunk size
      },
      
      // ✅ Advanced tree shaking
      treeshake: {
        preset: 'recommended',
        annotations: true,
        propertyReadSideEffects: false,
        tryCatchDeoptimization: false,
        moduleSideEffects: false,
      },
    },
    
    // ✅ Build optimization
    chunkSizeWarningLimit: 300, // Reduced to catch smaller oversized chunks
    target: 'es2018',
    cssCodeSplit: true,
    sourcemap: false,
    reportCompressedSize: false,
    
    // ✅ Asset optimization
    assetsInlineLimit: 4096, // 4KB inline limit
  },
  
  // ✅ Dependency optimization
  optimizeDeps: {
    include: [
      'react', 
      'react-dom',
      'framer-motion',
      'lucide-react',
      'aos'
    ],
    exclude: [
      '@lottiefiles/dotlottie-react', // Heavy library, exclude from pre-bundling
    ],
    force: true,
  },
  
  // ✅ Server configuration
  server: {
    port: 3000,
    open: true,
    cors: true,
    hmr: {
      overlay: true,
    },
  },
  
  preview: {
    port: 4173,
    open: true,
  },
  
  // ✅ CSS configuration
  css: {
    devSourcemap: false,
  },
  
  // ✅ Base path
  base: './',
});