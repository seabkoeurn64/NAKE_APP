// src/main.jsx - COMPLETE VERSION WITHOUT REACT ROUTER
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

// Enhanced error handler with better styling
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
        font-family: 'Poppins', sans-serif;
        text-align: center;
        padding: 2rem;
        background-image: 
          radial-gradient(at 40% 20%, rgba(99, 102, 241, 0.1) 0px, transparent 50%),
          radial-gradient(at 80% 0%, rgba(168, 85, 247, 0.1) 0px, transparent 50%);
      ">
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
                box-shadow: 0 4px 14px 0 rgba(99, 102, 241, 0.3);
              "
              onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 6px 20px 0 rgba(99, 102, 241, 0.4)'"
              onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 14px 0 rgba(99, 102, 241, 0.3)'"
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
              "
              onmouseover="this.style.background='rgba(255, 255, 255, 0.1)'; this.style.transform='translateY(-2px)'"
              onmouseout="this.style.background='transparent'; this.style.transform='translateY(0)'"
            >
              🏠 Go Home
            </button>
          </div>
          
          <div style="
            margin-top: 2rem;
            padding-top: 1.5rem;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
          ">
            <p style="
              color: #64748b;
              font-size: 0.875rem;
              margin: 0;
            ">
              If the problem persists, please check your internet connection 
              or try using a different browser.
            </p>
          </div>
        </div>
      </div>
    `;
  }
};

// Performance monitoring
const startTime = performance.now();

try {
  const rootElement = document.getElementById("root");
  
  if (!rootElement) {
    throw new Error("Root element '#root' not found in the DOM");
  }

  // Clear any existing content
  rootElement.innerHTML = '';
  
  const root = ReactDOM.createRoot(rootElement);
  
  console.log('🚀 Starting React application...');
  
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
  
  const endTime = performance.now();
  console.log(`✅ React app rendered successfully in ${(endTime - startTime).toFixed(2)}ms`);
  
} catch (error) {
  const endTime = performance.now();
  console.error(`❌ Failed to render React app after ${(endTime - startTime).toFixed(2)}ms:`, error);
  handleRenderError(error);
}

// Add some global error handling
window.addEventListener('error', (event) => {
  console.error('Global error caught:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
});

// Log successful load
window.addEventListener('load', () => {
  console.log('🎉 Portfolio website loaded successfully!');
});