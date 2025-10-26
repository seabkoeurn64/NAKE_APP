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
              onClick={() => window.location.reload()}
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

// Preload strategy for critical components
const preloadCriticalComponents = () => {
  // Preload above-the-fold components
  import('./components/Navbar');
  import('./Pages/Home');
};

// Preload strategy for lazy components
const preloadComponent = (importFn) => {
  const preloadPromise = importFn();
  return () => preloadPromise;
};

// Lazy load pages with preloading
const Home = lazy(() => import(/* webpackPrefetch: true */ "./Pages/Home"));
const About = lazy(() => import(/* webpackPrefetch: true */ "./Pages/About"));
const Portofolio = lazy(() => import(/* webpackPrefetch: true */ "./Pages/Portofolio"));
const ContactPage = lazy(() => import(/* webpackPrefetch: true */ "./Pages/Contact"));

// Preload components after welcome screen
const preloadPages = () => {
  startTransition(() => {
    import("./Pages/Home");
    import("./Pages/About"); 
    import("./Pages/Portofolio");
    import("./Pages/Contact");
  });
};

// Optimized loading components with reduced motion support
const LoadingFallback = React.memo(() => (
  <div className="min-h-screen bg-[#030014] flex items-center justify-center">
    <div className="text-center">
      <div className="w-12 h-12 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-gray-400 text-sm">Loading...</p>
    </div>
  </div>
));

const SectionLoader = React.memo(() => (
  <div className="min-h-[50vh] flex items-center justify-center">
    <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
  </div>
));

// Main App component with performance optimizations
function App() {
  const [showWelcome, setShowWelcome] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const [shouldPreload, setShouldPreload] = useState(false);

  const handleLoadingComplete = useCallback(() => {
    startTransition(() => {
      setShowWelcome(false);
    });
  }, []);

  // Preload critical components on mount
  useEffect(() => {
    preloadCriticalComponents();
  }, []);

  // Preload pages after mount
  useEffect(() => {
    if (shouldPreload) {
      preloadPages();
    }
  }, [shouldPreload]);

  useEffect(() => {
    let mounted = true;
    
    // Start preloading after a short delay
    const preloadTimer = setTimeout(() => {
      if (mounted) {
        setShouldPreload(true);
      }
    }, 1000);

    // Auto-hide welcome screen
    const welcomeTimer = setTimeout(() => {
      if (mounted) {
        startTransition(() => {
          setShowWelcome(false);
        });
      }
    }, 2500); // Reduced from 3000ms

    setIsMounted(true);

    return () => {
      mounted = false;
      clearTimeout(preloadTimer);
      clearTimeout(welcomeTimer);
    };
  }, []);

  // Early return before mount
  if (!isMounted) {
    return <LoadingFallback />;
  }

  return (
    <ErrorBoundary>
      <div className="App bg-[#030014] min-h-screen overflow-hidden">
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
              transition={{ duration: 0.3 }} // Reduced duration
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

export default React.memo(App);