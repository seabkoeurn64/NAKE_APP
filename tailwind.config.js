/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      // ✅ Optimized animations with reduced motion support
      animation: {
        'float': 'float 12s ease-in-out infinite',
        'float-slow': 'float 18s ease-in-out infinite',
        'pulse-slow': 'pulse 4s ease-in-out infinite',
        'bounce-slow': 'bounce 3s infinite',
        'gradient-x': 'gradient-x 15s ease infinite',
        'spin-slow': 'spin 8s linear infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.6s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { 
            transform: 'translateY(0px) scale(1)',
            opacity: '0.7'
          },
          '33%': { 
            transform: 'translateY(-20px) translateX(15px) scale(1.05)',
            opacity: '0.9'
          },
          '66%': { 
            transform: 'translateY(10px) translateX(-10px) scale(0.95)',
            opacity: '0.8'
          },
        },
        'gradient-x': {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center'
          },
        },
        shimmer: {
          '0%': {
            transform: 'translateX(-100%)',
          },
          '100%': {
            transform: 'translateX(100%)',
          },
        },
        fadeIn: {
          '0%': {
            opacity: '0',
            transform: 'translateY(10px)'
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)'
          },
        },
        slideUp: {
          '0%': {
            opacity: '0',
            transform: 'translateY(30px)'
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)'
          },
        }
      },
      
      // ✅ Optimized backdrop effects
      backdropBlur: {
        xs: '2px',
        sm: '4px',
        md: '8px',
        lg: '12px',
        xl: '16px',
        '2xl': '24px',
        '3xl': '40px',
        '4xl': '64px',
      },
      blur: {
        xs: '2px',
        sm: '4px',
        md: '8px',
        lg: '12px',
        xl: '16px',
        '2xl': '24px',
        '3xl': '40px',
        '4xl': '64px',
      },
      
      // ✅ Extended color palette with performance in mind
      colors: {
        // Primary brand colors
        'primary': {
          50: '#f0f9ff',
          100: '#e0f2fe',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        },
        // Accent colors
        'accent': {
          purple: '#8b5cf6',
          pink: '#ec4899',
          blue: '#3b82f6',
          indigo: '#6366f1',
        },
        // Dark theme colors
        'dark': {
          bg: '#030014',
          surface: '#0f0c29',
          card: '#1a1039',
          border: 'rgba(255, 255, 255, 0.1)',
        },
        // Glass morphism
        'glass': {
          DEFAULT: 'rgba(255, 255, 255, 0.1)',
          light: 'rgba(255, 255, 255, 0.05)',
          dark: 'rgba(0, 0, 0, 0.2)',
        },
        // Neon effects
        'neon': {
          blue: '#3b82f6',
          purple: '#8b5cf6',
          pink: '#ec4899',
        }
      },
      
      // ✅ Optimized shadows for performance
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        'glass-lg': '0 8px 32px 0 rgba(31, 38, 135, 0.5)',
        'neon': '0 0 20px rgba(139, 92, 246, 0.4)',
        'neon-lg': '0 0 40px rgba(139, 92, 246, 0.6)',
        'inner-glow': 'inset 0 2px 4px 0 rgba(255, 255, 255, 0.1)',
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'card-hover': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      },
      
      // ✅ Optimized background images
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-primary': 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%)',
        'gradient-dark': 'linear-gradient(135deg, #030014 0%, #0f0c29 50%, #1a1039 100%)',
        'noise-texture': "url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iLjc1IiBzdGl0Y2hUaWxlcz0ic3RpdGNoIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiBmaWx0ZXI9InVybCgjYSkiIG9wYWNpdHk9Ii4wMyIvPjwvc3ZnPg==')",
        'grid-pattern': "linear-gradient(to right, rgba(79, 79, 79, 0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(79, 79, 79, 0.03) 1px, transparent 1px)",
      },
      backgroundSize: {
        'grid-sm': '20px 20px',
        'grid-md': '40px 40px',
        'grid-lg': '60px 60px',
      },
      
      // ✅ Extended spacing system
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
        '144': '36rem',
        '160': '40rem',
      },
      
      // ✅ Enhanced border radius
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
        '6xl': '3rem',
      },
      
      // ✅ Optimized typography
      fontFamily: {
        'sans': ['Poppins', 'system-ui', 'sans-serif'],
        'mono': ['JetBrains Mono', 'monospace'],
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
        '6xl': ['3.75rem', { lineHeight: '1' }],
        '7xl': ['4.5rem', { lineHeight: '1' }],
        '8xl': ['6rem', { lineHeight: '1' }],
        '9xl': ['8rem', { lineHeight: '1' }],
      },
      
      // ✅ Optimized transitions
      transitionProperty: {
        'height': 'height',
        'spacing': 'margin, padding',
        'size': 'width, height',
        'opacity': 'opacity',
        'transform': 'transform',
        'colors': 'color, background-color, border-color, text-decoration-color, fill, stroke',
      },
      transitionDuration: {
        '2000': '2000ms',
        '3000': '3000ms',
        '4000': '4000ms',
      },
      transitionTimingFunction: {
        'bounce': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      
      // ✅ Z-index hierarchy
      zIndex: {
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        '100': '100',
      },
      
      // ✅ Opacity scale
      opacity: {
        '15': '0.15',
        '35': '0.35',
        '65': '0.65',
        '85': '0.85',
      },
    },
  },
  
  // ✅ Performance plugins
  plugins: [
    // Add form styles plugin for better form elements
    require('@tailwindcss/forms')({
      strategy: 'class', // only generate classes
    }),
  ],
  
  // ✅ PurgeCSS configuration for production
  safelist: [
    // Safelist critical animation classes
    'animate-float',
    'animate-pulse-slow',
    'animate-gradient-x',
    'animate-fade-in',
    'animate-slide-up',
    
    // Safelist critical color classes
    'bg-dark-bg',
    'text-accent-purple',
    'border-dark-border',
    
    // Safelist critical gradient classes
    'bg-gradient-primary',
    'bg-gradient-dark',
    
    // Safelist critical backdrop classes
    'backdrop-blur-md',
    'backdrop-blur-lg',
  ],
}