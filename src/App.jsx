// src/App.jsx - ULTRA PERFORMANCE OPTIMIZED
import React, { useState, useEffect, useCallback, lazy, Suspense, useRef } from "react";
import "./index.css";
import Navbar from "./components/Navbar";
import WelcomeScreen from "./Pages/WelcomeScreen";
import { AnimatePresence, motion } from "framer-motion";

// ✅ Preload critical components
const preloadComponents = () => {
  // Preload Home component immediately after welcome screen
  import("./Pages/Home.jsx");
};

// ✅ Lazy load main components with individual loading states
const Home = lazy(() => import("./Pages/Home.jsx"));
const About = lazy(() => import("./Pages/About.jsx"));
const Portofolio = lazy(() => import("./Pages/Portofolio.jsx"));
const ContactPage = lazy(() => import("./Pages/Contact.jsx"));

// ✅ Optimized Loading Component
const PageLoader = React.memo(({ message = "Loading..." }) => (
  <div className="min-h-[50vh] flex items-center justify-center">
    <div className="text-center">
      <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
      <p className="text-gray-400 text-sm">{message}</p>
    </div>
  </div>
));

// ✅ Enhanced Error Boundary with performance optimization
class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };
  
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  
  componentDidCatch(error, errorInfo) {
    console.error('App Error:', error, errorInfo);
  }

  handleReload = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
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
              onClick={this.handleReload}
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

// ✅ Main Content Component with individual suspense boundaries
const MainContent = React.memo(({ reducedMotion }) => {
  const animationProps = React.useMemo(() => ({
    initial: reducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.98 },
    animate: reducedMotion ? { opacity: 1 } : { opacity: 1, scale: 1 },
    exit: reducedMotion ? { opacity: 0 } : { opacity: 0, scale: 1.02 },
    transition: {
      duration: reducedMotion ? 0.2 : 0.4,
      ease: "easeOut"
    }
  }), [reducedMotion]);

  return (
    <motion.div key="main-content" {...animationProps}>
      <div className="min-h-screen">
        <Navbar />
        <main>
          {/* Individual suspense for better perceived performance */}
          <Suspense fallback={<PageLoader message="Loading home..." />}>
            <Home />
          </Suspense>
          
          <Suspense fallback={<PageLoader message="Loading about..." />}>
            <About />
          </Suspense>
          
          <Suspense fallback={<PageLoader message="Loading portfolio..." />}>
            <Portofolio />
          </Suspense>
          
          <Suspense fallback={<PageLoader message="Loading contact..." />}>
            <ContactPage />
          </Suspense>
        </main>
        <Footer />
      </div>
    </motion.div>
  );
});

// ✅ Footer Component (Memoized)
const Footer = React.memo(() => (
  <footer className="text-center py-6 px-4 text-gray-500 bg-black/30 backdrop-blur-sm border-t border-white/10 mt-20">
    <div className="max-w-7xl mx-auto">
      <p className="text-sm md:text-base">© 2025 koeurn™. All Rights Reserved.</p>
      <p className="text-xs text-gray-600 mt-2">Crafted with passion and modern web technologies</p>
    </div>
  </footer>
));

// ✅ Custom Hook for Media Queries with performance optimization
const useMediaQueries = () => {
  const [reducedMotion, setReducedMotion] = useState(false);
  const [mounted, setMounted] = useState(false);
  const mediaQueryRef = useRef(null);

  useEffect(() => {
    // Initialize reduced motion preference immediately
    mediaQueryRef.current = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQueryRef.current.matches);
    setMounted(true);
    
    const handleChange = (e) => {
      setReducedMotion(e.matches);
    };
    
    mediaQueryRef.current.addEventListener('change', handleChange);
    
    return () => {
      if (mediaQueryRef.current) {
        mediaQueryRef.current.removeEventListener('change', handleChange);
      }
    };
  }, []);

  return { reducedMotion, mounted };
};

// ✅ Main App Component
function App() {
  const [showWelcome, setShowWelcome] = useState(true);
  const { reducedMotion, mounted } = useMediaQueries();
  const welcomeTimeoutRef = useRef(null);
  const initTimeoutRef = useRef(null);
  const preloadTimeoutRef = useRef(null);

  // Handle welcome screen completion
  const handleWelcomeComplete = useCallback(() => {
    setShowWelcome(false);
  }, []);

  // Preload components after welcome screen
  useEffect(() => {
    if (!showWelcome) {
      // Preload remaining components after welcome screen
      preloadTimeoutRef.current = setTimeout(preloadComponents, 1000);
    }
    
    return () => {
      if (preloadTimeoutRef.current) {
        clearTimeout(preloadTimeoutRef.current);
      }
    };
  }, [showWelcome]);

  // Main initialization
  useEffect(() => {
    if (!mounted) return;

    const initializeApp = () => {
      const welcomeDuration = reducedMotion ? 800 : 1500;
      welcomeTimeoutRef.current = setTimeout(() => {
        setShowWelcome(false);
      }, welcomeDuration);
    };

    initTimeoutRef.current = setTimeout(initializeApp, 50);
    
    return () => {
      if (welcomeTimeoutRef.current) {
        clearTimeout(welcomeTimeoutRef.current);
      }
      if (initTimeoutRef.current) {
        clearTimeout(initTimeoutRef.current);
      }
    };
  }, [reducedMotion, mounted]);

  // Cleanup all timeouts on unmount
  useEffect(() => {
    return () => {
      if (welcomeTimeoutRef.current) clearTimeout(welcomeTimeoutRef.current);
      if (initTimeoutRef.current) clearTimeout(initTimeoutRef.current);
      if (preloadTimeoutRef.current) clearTimeout(preloadTimeoutRef.current);
    };
  }, []);

  // Memoized animation configurations
  const animationProps = React.useMemo(() => ({
    initial: reducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.98 },
    animate: reducedMotion ? { opacity: 1 } : { opacity: 1, scale: 1 },
    exit: reducedMotion ? { opacity: 0 } : { opacity: 0, scale: 1.02 },
    transition: {
      duration: reducedMotion ? 0.2 : 0.4,
      ease: "easeOut"
    }
  }), [reducedMotion]);

  // Show loading state until mounted
  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#030014] flex items-center justify-center">
        <PageLoader message="Initializing..." />
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="App bg-[#030014] min-h-screen overflow-hidden">
        <AnimatePresence mode="wait" initial={false}>
          {showWelcome ? (
            <motion.div key="welcome-screen" {...animationProps}>
              <WelcomeScreen 
                reducedMotion={reducedMotion} 
                onLoadingComplete={handleWelcomeComplete}
              />
            </motion.div>
          ) : (
            <MainContent reducedMotion={reducedMotion} />
          )}
        </AnimatePresence>
      </div>
    </ErrorBoundary>
  );
}

export default React.memo(App);