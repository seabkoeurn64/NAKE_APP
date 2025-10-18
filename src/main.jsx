// src/main.jsx - Minimal enhanced version
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

// Simple error handler
const handleRenderError = (error) => {
  console.error('Failed to render React app:', error);
  
  // Fallback UI if React fails to render
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
        font-family: Poppins, sans-serif;
        text-align: center;
        padding: 2rem;
      ">
        <div>
          <h1 style="color: #6366f1; margin-bottom: 1rem;">Loading Error</h1>
          <p style="margin-bottom: 2rem; color: #94a3b8;">
            Unable to load the portfolio. Please check your connection and refresh the page.
          </p>
          <button 
            onclick="window.location.reload()"
            style="
              background: #6366f1;
              color: white;
              border: none;
              padding: 0.75rem 1.5rem;
              border-radius: 0.5rem;
              cursor: pointer;
              font-size: 1rem;
            "
          >
            Refresh Page
          </button>
        </div>
      </div>
    `;
  }
};

try {
  const rootElement = document.getElementById("root");
  
  if (!rootElement) {
    throw new Error("Root element not found");
  }

  const root = ReactDOM.createRoot(rootElement);
  
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} catch (error) {
  handleRenderError(error);
}