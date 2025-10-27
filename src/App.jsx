import React, { useState, useEffect, useCallback, lazy, Suspense, startTransition } from "react";
import "./index.css";
import Navbar from "./components/Navbar";
import WelcomeScreen from "./Pages/WelcomeScreen";
import { AnimatePresence, motion } from "framer-motion";

// Enhanced ErrorBoundary with performance optimization
class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };
  
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  
  componentDidCatch(error, errorInfo) {
    console.error('App Error:', error, errorInfo);
    
    // Log to analytics in production
    if (process.env.NODE_ENV === 'production') {
      // You can integrate with your error tracking service here
    }
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
              className="px-6 py-2 bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
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

// Optimized loading components with reduced motion support
const LoadingFallback = React.memo(() => {
  const [reducedMotion, setReducedMotion] = useState(false);
  
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);
    
    const handleChange = (e) => setReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handleChange);
    
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);
  
  return (
    <div className="min-h-screen bg-[#030014] flex items-center justify-center">
      <div className="text-center">
        <div 
          className={`w-12 h-12 border-3 border-indigo-600 border-t-transparent rounded-full mx-auto mb-4 ${
            reducedMotion ? '' : 'animate-spin'
          }`}
          style={reducedMotion ? { 
            borderColor: '#4f46e5',
            borderTopColor: 'transparent'
          } : {}}
        ></div>
        <p className="text-gray-400 text-sm">Loading...</p>
      </div>
    </div>
  );
});

const SectionLoader = React.memo(() => {
  const [reducedMotion, setReducedMotion] = useState(false);
  
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);
    
    const handleChange = (e) => setReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handleChange);
    
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);
  
  return (
    <div className="min-h-[50vh] flex items-center justify-center">
      <div 
        className={`w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full ${
          reducedMotion ? '' : 'animate-spin'
        }`}
        style={reducedMotion ? { 
          borderColor: '#4f46e5',
          borderTopColor: 'transparent'
        } : {}}
      ></div>
    </div>
  );
});

// Lazy load pages with preloading
const Home = lazy(() => import(/* webpackPrefetch: true */ "./Pages/Home"));
const About = lazy(() => import(/* webpackPrefetch: true */ "./Pages/About"));
const Portofolio = lazy(() => import(/* webpackPrefetch: true */ "./Pages/Portofolio"));
const ContactPage = lazy(() => import(/* webpackPrefetch: true */ "./Pages/Contact"));

// Preload strategy for critical components
const preloadCriticalComponents = () => {
  if (typeof window !== 'undefined') {
    // Preload above-the-fold components
    const criticalComponents = [
      import('./components/Navbar'),
      import('./Pages/Home')
    ];
    
    return Promise.allSettled(criticalComponents);
  }
};

// Resource hints for better preloading
const addResourceHints = () => {
  if (typeof document !== 'undefined') {
    // Add preconnect for external domains if you have any
    const preconnectUrls = [
      'https://fonts.googleapis.com',
      'https://fonts.gstatic.com'
    ];
    
    preconnectUrls.forEach(url => {
      const link = document.createElement('link');
      link.rel = 'preconnect';
      link.href = url;
      link.crossOrigin = 'true';
      document.head.appendChild(link);
    });
  }
};

// Main App component with performance optimizations
function App() {
  const [showWelcome, setShowWelcome] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const [shouldPreload, setShouldPreload] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  const handleLoadingComplete = useCallback(() => {
    startTransition(() => {
      setShowWelcome(false);
    });
  }, []);

  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);
    
    const handleChange = (e) => setReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handleChange);
    
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Optimized preload with priority
  const preloadPages = useCallback(() => {
    if (typeof window === 'undefined') return;
    
    const preloadStrategy = () => {
      startTransition(() => {
        Promise.allSettled([
          import("./Pages/Home"),
          import("./Pages/About"), 
          import("./Pages/Portofolio"),
          import("./Pages/Contact")
        ]).catch(() => {}); // Silent fail for better UX
      });
    };

    if ('requestIdleCallback' in window) {
      requestIdleCallback(preloadStrategy, { timeout: 2000 });
    } else {
      // Fallback with shorter timeout
      setTimeout(preloadStrategy, 100);
    }
  }, []);

  // Preload critical components on mount
  useEffect(() => {
    preloadCriticalComponents();
    addResourceHints();
  }, []);

  // Preload pages after mount
  useEffect(() => {
    if (shouldPreload) {
      preloadPages();
    }
  }, [shouldPreload, preloadPages]);

  // Main initialization effect
  useEffect(() => {
    let mounted = true;
    let welcomeTimer;
    let preloadTimer;
    
    const initializeApp = () => {
      if (!mounted) return;
      
      // Start preloading after a short delay
      preloadTimer = setTimeout(() => {
        if (mounted) {
          setShouldPreload(true);
        }
      }, 200);

      // Auto-hide welcome screen with reduced motion consideration
      const welcomeDuration = reducedMotion ? 800 : 1500;
      welcomeTimer = setTimeout(() => {
        if (mounted) {
          startTransition(() => {
            setShowWelcome(false);
          });
        }
      }, welcomeDuration);

      setIsMounted(true);
    };

    // Small delay to ensure DOM is ready
    const initTimer = setTimeout(initializeApp, 50);

    return () => {
      mounted = false;
      clearTimeout(initTimer);
      clearTimeout(preloadTimer);
      clearTimeout(welcomeTimer);
    };
  }, [reducedMotion]);

  // Animation configurations based on motion preference
  const animationProps = {
    initial: reducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.98 },
    animate: reducedMotion ? { opacity: 1 } : { opacity: 1, scale: 1 },
    exit: reducedMotion ? { opacity: 0 } : { opacity: 0, scale: 1.02 },
    transition: {
      duration: reducedMotion ? 0.2 : 0.4,
      ease: "easeOut"
    }
  };

  // Early return before mount
  if (!isMounted) {
    return <LoadingFallback />;
  }

  return (
    <ErrorBoundary>
      <div className="App bg-[#030014] min-h-screen overflow-hidden">
        <AnimatePresence mode="wait" initial={false}>
          {showWelcome ? (
            <motion.div
              key="welcome-screen"
              {...animationProps}
            >
              <WelcomeScreen 
                onLoadingComplete={handleLoadingComplete}
                reducedMotion={reducedMotion}
              />
            </motion.div>
          ) : (
            <motion.div
              key="main-content"
              {...animationProps}
            >
              <div className="min-h-screen">
                <Navbar />
                <main>
                  <Suspense fallback={<SectionLoader />}>
                    <Home />
                  </Suspense>
                  <Suspense fallback={<SectionLoader />}>
                    <About />
                  </Suspense>
                  <Suspense fallback={<SectionLoader />}>
                    <Portofolio />
                  </Suspense>
                  <Suspense fallback={<SectionLoader />}>
                    <ContactPage />
                  </Suspense>
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

// Add display name for better dev tools
App.displayName = 'App';

export default React.memo(App);