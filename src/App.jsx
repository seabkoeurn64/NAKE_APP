// src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import React, { useState, useEffect, useCallback } from 'react';
import "./index.css";
import Home from "./Pages/Home";
import About from "./Pages/About";
import Navbar from "./components/Navbar";
import Portofolio from "./Pages/Portofolio";
import ContactPage from "./Pages/Contact";
import WelcomeScreen from "./Pages/WelcomeScreen";
import { AnimatePresence, motion } from 'framer-motion';
import NotFoundPage from "./Pages/404";
import ThankYouPage from "./Pages/ThankYou";
import ProjectDetails from "./components/ProjectDetail";

function App() {
  const [showWelcome, setShowWelcome] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  // Handle loading completion
  const handleLoadingComplete = useCallback(() => {
    setShowWelcome(false);
  }, []);

  // Auto-hide welcome screen after delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowWelcome(false);
    }, 4000);

    // Set mounted state for animations
    setIsMounted(true);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  // Main content component
  const MainContent = useCallback(() => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="min-h-screen"
    >
      <Navbar />
      <main>
        <Home />
        <About />
        <Portofolio />
        <ContactPage />
      </main>
      <footer className="text-center py-6 px-4 text-gray-500 bg-black/30 backdrop-blur-sm border-t border-white/10 mt-20">
        <div className="max-w-7xl mx-auto">
          <p className="text-sm md:text-base">
            © 2025 koeurn™. All Rights Reserved.
          </p>
          <p className="text-xs text-gray-600 mt-2">
            Crafted with passion and modern web technologies
          </p>
        </div>
      </footer>
    </motion.div>
  ), []);

  // Loading component
  const LoadingFallback = () => (
    <div className="min-h-screen bg-[#030014] flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-400">Loading portfolio...</p>
      </div>
    </div>
  );

  // Don't render until mounted to avoid hydration issues
  if (!isMounted) {
    return <LoadingFallback />;
  }

  return (
    <BrowserRouter>
      <div className="App bg-[#030014] min-h-screen overflow-hidden">
        <Routes>
          {/* Home route with welcome screen */}
          <Route 
            path="/" 
            element={
              <div className="relative">
                <AnimatePresence mode="wait">
                  {showWelcome ? (
                    <WelcomeScreen 
                      key="welcome-screen" 
                      onLoadingComplete={handleLoadingComplete} 
                    />
                  ) : (
                    <MainContent key="main-content" />
                  )}
                </AnimatePresence>
              </div>
            } 
          />

          {/* Project Details page route - ADD THIS ROUTE */}
          <Route 
            path="/project/:id" 
            element={
              <div className="min-h-screen bg-[#030014]">
                <ProjectDetails />
              </div>
            } 
          />

          {/* Thank You page route */}
          <Route 
            path="/thank-you" 
            element={
              <div className="min-h-screen bg-[#030014]">
                <ThankYouPage />
              </div>
            } 
          />

          {/* 404 Not Found page route */}
          <Route 
            path="*" 
            element={
              <div className="min-h-screen bg-[#030014]">
                <NotFoundPage />
              </div>
            } 
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default React.memo(App);