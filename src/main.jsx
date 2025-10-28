// src/main.jsx - PERFORMANCE OPTIMIZED
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

// ✅ Performance monitoring
const startTime = performance.now();

// ✅ Enhanced error handler with better UX
const handleRenderError = (error) => {
  console.error('Failed to render React app:', error);
  
  const rootElement = document.getElementById('root');
  if (rootElement) {
    rootElement.innerHTML = `
      <div style="
        min-height: 100vh;
        background: #030014;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-family: system-ui, -apple-system, sans-serif;
        text-align: center;
        padding: 2rem;
      " role="alert" aria-live="assertive">
        <div style="
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 1.5rem;
          padding: 3rem 2rem;
          max-width: 500px;
          width: 100%;
        ">
          <div style="
            width: 80px;
            height: 80px;
            margin: 0 auto 1.5rem;
            background: linear-gradient(135deg, #6366f1, #a855f7);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 2rem;
          ">
            ⚠️
          </div>
          
          <h1 style="
            color: #6366f1; 
            margin-bottom: 1rem;
            font-size: 1.875rem;
            font-weight: bold;
          ">
            Application Error
          </h1>
          
          <p style="
            margin-bottom: 2rem; 
            color: #94a3b8;
            line-height: 1.6;
            font-size: 1rem;
          ">
            We encountered an issue while loading the portfolio. 
            This might be due to a network problem or browser compatibility issue.
          </p>
          
          <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
            <button 
              onclick="window.location.reload()"
              style="
                background: linear-gradient(135deg, #6366f1, #a855f7);
                color: white;
                border: none;
                padding: 0.75rem 1.5rem;
                border-radius: 0.75rem;
                cursor: pointer;
                font-size: 1rem;
                font-weight: 500;
                transition: all 0.2s ease;
                min-height: 44px;
                min-width: 120px;
              "
              aria-label="Refresh the page"
            >
              🔄 Refresh Page
            </button>
            
            <button 
              onclick="window.location.href='/'"
              style="
                background: transparent;
                color: #e2e8f0;
                border: 1px solid rgba(255, 255, 255, 0.2);
                padding: 0.75rem 1.5rem;
                border-radius: 0.75rem;
                cursor: pointer;
                font-size: 1rem;
                font-weight: 500;
                transition: all 0.2s ease;
                min-height: 44px;
                min-width: 120px;
              "
              aria-label="Go to home page"
            >
              🏠 Go Home
            </button>
          </div>
        </div>
      </div>
    `;
  }
};

// ✅ Optimized loading state
const showLoadingState = () => {
  const rootElement = document.getElementById("root");
  if (!rootElement) return;

  rootElement.innerHTML = `
    <div style="
      min-height: 100vh;
      background: #030014;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-family: system-ui, -apple-system, sans-serif;
    " aria-busy="true" aria-label="Loading portfolio">
      <div style="text-align: center;">
        <div style="
          width: 40px;
          height: 40px;
          border: 3px solid #6366f1;
          border-top: 3px solid transparent;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 1rem;
        "></div>
        <p style="color: #94a3b8; font-size: 0.875rem;">Loading portfolio...</p>
      </div>
    </div>
    <style>
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    </style>
  `;
};

// ✅ Initialize the application
const initializeApp = () => {
  try {
    const rootElement = document.getElementById("root");
    
    if (!rootElement) {
      throw new Error("Root element '#root' not found in the DOM");
    }

    // Show loading state immediately
    showLoadingState();
    
    // Create React root and render with error boundary
    const root = ReactDOM.createRoot(rootElement);
    
    if (process.env.NODE_ENV !== 'production') {
      console.log('🚀 Starting React application...');
    }
    
    // Use requestAnimationFrame for smoother initialization
    requestAnimationFrame(() => {
      root.render(
        <React.StrictMode>
          <App />
        </React.StrictMode>
      );
      
      const endTime = performance.now();
      if (process.env.NODE_ENV !== 'production') {
        console.log(`✅ React app rendered successfully in ${(endTime - startTime).toFixed(2)}ms`);
      }
    });
    
  } catch (error) {
    const endTime = performance.now();
    console.error(`❌ Failed to render React app after ${(endTime - startTime).toFixed(2)}ms:`, error);
    handleRenderError(error);
  }
};

// ✅ Optimized application start
const startApp = () => {
  // Use microtask for better performance
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp, { once: true });
  } else {
    // Use setTimeout to yield to browser for better performance
    setTimeout(initializeApp, 0);
  }
};

// Start the application
startApp();

// ✅ Global error handling for better debugging
const handleGlobalError = (event) => {
  console.error('Global error caught:', event.error);
};

const handleUnhandledRejection = (event) => {
  console.error('Unhandled promise rejection:', event.reason);
  event.preventDefault(); // Prevent browser default error handling
};

// Add error listeners with better cleanup
window.addEventListener('error', handleGlobalError);
window.addEventListener('unhandledrejection', handleUnhandledRejection);

// ✅ Performance monitoring
window.addEventListener('load', () => {
  const loadTime = performance.now();
  if (process.env.NODE_ENV !== 'production') {
    console.log('🎉 Portfolio website loaded successfully!');
    console.log(`📊 Total load time: ${loadTime.toFixed(2)}ms`);
  }
  
  // Remove error listeners after successful load to reduce memory usage
  window.removeEventListener('error', handleGlobalError);
  window.removeEventListener('unhandledrejection', handleUnhandledRejection);
});

// ✅ Cleanup function for hot module replacement (HMR)
if (import.meta.hot) {
  import.meta.hot.dispose(() => {
    const rootElement = document.getElementById('root');
    if (rootElement) {
      const root = ReactDOM.createRoot(rootElement);
      root.unmount();
    }
  });
}