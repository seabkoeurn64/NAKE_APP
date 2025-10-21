// src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import React, { useState, useEffect, useCallback, lazy, Suspense } from "react";
import "./index.css";
import Navbar from "./components/Navbar";
import WelcomeScreen from "./Pages/WelcomeScreen";
import NotFoundPage from "./Pages/404";
import ThankYouPage from "./Pages/ThankYou";
import ProjectDetails from "./components/ProjectDetail";
import { AnimatePresence, motion } from "framer-motion";

// Lazy load main page sections with better error handling
const Home = lazy(() => import("./Pages/Home").catch(() => ({ default: () => <div>Error loading Home</div> })));
const About = lazy(() => import("./Pages/About").catch(() => ({ default: () => <div>Error loading About</div> })));
const Portofolio = lazy(() => import("./Pages/Portofolio").catch(() => ({ default: () => <div>Error loading Portfolio</div> })));
const ContactPage = lazy(() => import("./Pages/Contact").catch(() => ({ default: () => <div>Error loading Contact</div> })));

// Improved loading fallback component
const LoadingFallback = () => (
  <div className="min-h-screen bg-[#030014] flex items-center justify-center">
    <div className="text-center">
      <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-gray-400 animate-pulse">Loading portfolio...</p>
    </div>
  </div>
);

// Error Boundary component
const ErrorBoundary = ({ children }) => {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const handleError = (error) => {
      console.error('App Error:', error);
      setHasError(true);
    };

    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  if (hasError) {
    return (
      <div className="min-h-screen bg-[#030014] flex items-center justify-center">
        <div className="text-center text-white">
          <h2 className="text-2xl mb-4">Something went wrong</h2>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  return children;
};

function App() {
  const [showWelcome, setShowWelcome] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Handle welcome screen complete
  const handleLoadingComplete = useCallback(() => {
    setShowWelcome(false);
  }, []);

  // Mounted & auto-hide welcome with better timing
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowWelcome(false);
    }, 3500);

    setIsMounted(true);

    // Check for reduced motion preference
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handleMediaChange = (e) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleMediaChange);

    return () => {
      clearTimeout(timer);
      mediaQuery.removeEventListener('change', handleMediaChange);
    };
  }, []);

  // Main content with better performance
  const MainContent = useCallback(() => (
    <motion.div
      initial={{ opacity: prefersReducedMotion ? 1 : 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: prefersReducedMotion ? 1 : 0 }}
      transition={{ 
        duration: prefersReducedMotion ? 0 : 0.6, 
        ease: "easeOut" 
      }}
      className="min-h-screen"
    >
      <Navbar />
      <main>
        <Suspense fallback={<LoadingFallback />}>
          <Home />
        </Suspense>
        <Suspense fallback={<LoadingFallback />}>
          <About />
        </Suspense>
        <Suspense fallback={<LoadingFallback />}>
          <Portofolio />
        </Suspense>
        <Suspense fallback={<LoadingFallback />}>
          <ContactPage />
        </Suspense>
      </main>
      <footer className="text-center py-6 px-4 text-gray-500 bg-black/30 backdrop-blur-sm border-t border-white/10 mt-20">
        <div className="max-w-7xl mx-auto">
          <p className="text-sm md:text-base">© 2025 koeurn™. All Rights Reserved.</p>
          <p className="text-xs text-gray-600 mt-2">Crafted with passion and modern web technologies</p>
        </div>
      </footer>
    </motion.div>
  ), [prefersReducedMotion]);

  // Don't render anything until mounted to avoid hydration issues
  if (!isMounted) {
    return <LoadingFallback />;
  }

  return (
    <ErrorBoundary>
      <BrowserRouter>
        <div className="App bg-[#030014] min-h-screen overflow-hidden">
          <Routes>
            {/* Home route with welcome */}
            <Route
              path="/"
              element={
                <div className="relative">
                  <AnimatePresence mode="wait">
                    {showWelcome ? (
                      <motion.div
                        key="welcome-screen"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                      >
                        <WelcomeScreen onLoadingComplete={handleLoadingComplete} />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="main-content"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                      >
                        <MainContent />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              }
            />

            {/* Project Details */}
            <Route
              path="/project/:id"
              element={
                <div className="min-h-screen bg-[#030014]">
                  <Navbar />
                  <ProjectDetails />
                </div>
              }
            />

            {/* Thank You page */}
            <Route
              path="/thank-you"
              element={
                <div className="min-h-screen bg-[#030014]">
                  <Navbar />
                  <ThankYouPage />
                </div>
              }
            />

            {/* 404 Not Found */}
            <Route
              path="*"
              element={
                <div className="min-h-screen bg-[#030014]">
                  <Navbar />
                  <NotFoundPage />
                </div>
              }
            />
          </Routes>
        </div>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default React.memo(App);