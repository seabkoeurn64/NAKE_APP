// src/App.jsx - COMPLETELY FIXED VERSION WITH PORTFOLIO
import React, { useState, useEffect, useCallback } from "react";
import "./index.css";
import Navbar from "./components/Navbar";
import WelcomeScreen from "./Pages/WelcomeScreen";
import Home from "./Pages/Home.jsx";
import About from "./Pages/About.jsx";
import Portofolio from "./Pages/Portofolio.jsx"; // ✅ Import the actual Portfolio
import ContactPage from "./Pages/Contact.jsx";
import { AnimatePresence, motion } from "framer-motion";

// Enhanced Error Boundary
class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };
  
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  
  componentDidCatch(error, errorInfo) {
    console.error('App Error:', error, errorInfo);
  }
  
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#030014] flex items-center justify-center p-4">
          <div className="text-center text-white max-w-md">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">⚠️</span>
            </div>
            <h2 className="text-2xl font-bold mb-2">Something went wrong</h2>
            <p className="text-gray-400 mb-4">Please try reloading the page</p>
            <button 
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.reload();
              }}
              className="px-6 py-3 bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors min-h-[44px] min-w-[44px]"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// Loading Components
const LoadingFallback = React.memo(() => (
  <div className="min-h-screen bg-[#030014] flex items-center justify-center p-4">
    <div className="text-center">
      <div className="w-12 h-12 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-gray-400 text-sm md:text-base">Loading portfolio...</p>
    </div>
  </div>
));

// Main App Component
function App() {
  const [showWelcome, setShowWelcome] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);
    
    const handleChange = (e) => setReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handleChange);
    
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Main initialization
  useEffect(() => {
    let mounted = true;
    
    const initializeApp = () => {
      if (!mounted) return;

      const welcomeDuration = reducedMotion ? 800 : 1500;
      setTimeout(() => {
        if (mounted) {
          setShowWelcome(false);
        }
      }, welcomeDuration);

      setIsMounted(true);
    };

    const initTimer = setTimeout(initializeApp, 50);
    return () => {
      mounted = false;
      clearTimeout(initTimer);
    };
  }, [reducedMotion]);

  // Animation configurations
  const animationProps = {
    initial: reducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.98 },
    animate: reducedMotion ? { opacity: 1 } : { opacity: 1, scale: 1 },
    exit: reducedMotion ? { opacity: 0 } : { opacity: 0, scale: 1.02 },
    transition: {
      duration: reducedMotion ? 0.2 : 0.4,
      ease: "easeOut"
    }
  };

  if (!isMounted) {
    return <LoadingFallback />;
  }

  return (
    <ErrorBoundary>
      <div className="App bg-[#030014] min-h-screen overflow-hidden">
        <AnimatePresence mode="wait" initial={false}>
          {showWelcome ? (
            <motion.div key="welcome-screen" {...animationProps}>
              <WelcomeScreen reducedMotion={reducedMotion} />
            </motion.div>
          ) : (
            <motion.div key="main-content" {...animationProps}>
              <div className="min-h-screen">
                <Navbar />
                <main>
                  {/* ✅ ALL COMPONENTS INCLUDING ACTUAL PORTFOLIO */}
                  <Home />
                  <About />
                  <Portofolio /> {/* ✅ Now using the actual Portfolio component */}
                  <ContactPage />
                </main>
                <footer className="text-center py-6 px-4 text-gray-500 bg-black/30 backdrop-blur-sm border-t border-white/10 mt-20">
                  <div className="max-w-7xl mx-auto">
                    <p className="text-sm md:text-base">© 2025 koeurn™. All Rights Reserved.</p>
                    <p className="text-xs text-gray-600 mt-2">Crafted with passion and modern web technologies</p>
                  </div>
                </footer>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </ErrorBoundary>
  );
}

export default React.memo(App);