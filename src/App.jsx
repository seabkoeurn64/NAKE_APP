// src/App.jsx - ULTRA PERFORMANCE OPTIMIZED & CLEANED (v10.29.2025)
import React, { useState, useEffect, useCallback, lazy, Suspense, useRef } from "react";
import "./index.css";
import Navbar from "./components/Navbar";
import WelcomeScreen from "./Pages/WelcomeScreen";
import { AnimatePresence, motion } from "framer-motion";

// ✅ Lazy load main components
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
PageLoader.displayName = 'PageLoader'; // Added display name

// ✅ Enhanced Error Boundary
class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };
  static getDerivedStateFromError(error) { return { hasError: true, error }; }
  componentDidCatch(error, errorInfo) { console.error('App Error:', error, errorInfo); }
  handleReload = () => { this.setState({ hasError: false, error: null }); window.location.reload(); }
  resetError = () => { this.setState({ hasError: false, error: null }); };
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#030014] flex items-center justify-center p-4">
          <div className="text-center text-white max-w-md">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4"><span className="text-2xl">⚠️</span></div>
            <h2 className="text-2xl font-bold mb-2">Something went wrong</h2>
            <p className="text-gray-400 mb-4">Please try reloading the page</p>
            <button onClick={this.handleReload} className="px-6 py-3 bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors min-h-[44px] min-w-[44px]">Reload Page</button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// ✅ Footer Component (Memoized)
const Footer = React.memo(() => (
  <footer className="text-center py-6 px-4 text-gray-500 bg-black/30 backdrop-blur-sm border-t border-white/10 mt-20">
    <div className="max-w-7xl mx-auto">
      <p className="text-sm md:text-base">© 2025 koeurn™. All Rights Reserved.</p>
      <p className="text-xs text-gray-600 mt-2">Crafted with passion and modern web technologies</p>
    </div>
  </footer>
));
Footer.displayName = 'Footer'; // Added display name

// ✅ Reusable animation configurations
const getAnimationProps = (reducedMotion, type = 'page') => {
  const presets = {
    page: { initial: reducedMotion ? { opacity: 0 } : { opacity: 0, y: 20 }, animate: reducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }, exit: reducedMotion ? { opacity: 0 } : { opacity: 0, y: -20 }, transition: { duration: reducedMotion ? 0.2 : 0.5, ease: [0.4, 0, 0.2, 1] } },
    fade: { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, transition: { duration: 0.3 } }
  };
  return presets[type];
};

// ✅ Main Content Component (Memoized)
const MainContent = React.memo(({ reducedMotion }) => {
  const animationProps = React.useMemo(() => getAnimationProps(reducedMotion, 'page'), [reducedMotion]);
  return (
    <motion.div key="main-content" {...animationProps}>
      <div className="min-h-screen">
        <Navbar />
        <main>
          <Suspense fallback={<PageLoader message="Loading home..." />}><Home /></Suspense>
          <Suspense fallback={<PageLoader message="Loading about..." />}><About /></Suspense>
          <Suspense fallback={<PageLoader message="Loading portfolio..." />}><Portofolio /></Suspense>
          <Suspense fallback={<PageLoader message="Loading contact..." />}><ContactPage /></Suspense>
        </main>
        <Footer />
      </div>
    </motion.div>
  );
});
MainContent.displayName = 'MainContent'; // Added display name

// ✅ Custom Hook for Media Queries
const useMediaQueries = () => {
  const [reducedMotion, setReducedMotion] = useState(false);
  const [mounted, setMounted] = useState(false);
  const mediaQueryRef = useRef(null);
  useEffect(() => {
    mediaQueryRef.current = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQueryRef.current.matches);
    setMounted(true);
    const handleChange = (e) => { setReducedMotion(e.matches); };
    mediaQueryRef.current.addEventListener('change', handleChange);
    return () => { if (mediaQueryRef.current) mediaQueryRef.current.removeEventListener('change', handleChange); };
  }, []);
  return { reducedMotion, mounted };
};

// ✅ Performance Monitoring Hook
const usePerformanceMonitor = () => {
  useEffect(() => {
    if (process.env.NODE_ENV === 'development' && 'performance' in window) {
      const measureAppLoad = () => {
        const navTiming = performance.getEntriesByType('navigation')[0];
        if (navTiming) { console.log('App Load Time:', Math.round(navTiming.loadEventEnd - navTiming.fetchStart)); }
      };
      if (document.readyState === 'complete') { measureAppLoad(); }
      else { window.addEventListener('load', measureAppLoad); return () => window.removeEventListener('load', measureAppLoad); }
    }
  }, []);
};

// ✅ Preload function (Refined)
const preloadComponents = () => {
  // Preload in likely navigation order
  const preloadQueue = [
    // Home.jsx is handled by Suspense on initial load
    () => import("./Pages/About.jsx"),
    () => import("./Pages/Portofolio.jsx"),
    () => import("./Pages/Contact.jsx")
  ];
  // Stagger preloading to avoid blocking, preferably during idle time
  preloadQueue.forEach((preload, index) => {
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(preload);
    } else {
      setTimeout(preload, index * 200 + 500); // Fallback with delay
    }
  });
};

// ✅ Main App Component
function App() {
  const [showWelcome, setShowWelcome] = useState(true);
  const { reducedMotion, mounted } = useMediaQueries();
  const welcomeTimeoutRef = useRef(null);
  const preloadTimeoutRef = useRef(null);

  usePerformanceMonitor(); // Initialize performance monitoring

  const handleWelcomeComplete = useCallback(() => { setShowWelcome(false); }, []);

  // Preload other components after welcome screen finishes
  useEffect(() => {
    if (!showWelcome) {
      preloadTimeoutRef.current = setTimeout(preloadComponents, 1000); // Start preloading after a short delay
    }
    return () => { if (preloadTimeoutRef.current) clearTimeout(preloadTimeoutRef.current); };
  }, [showWelcome]);

  // Handle welcome screen visibility timeout
  useEffect(() => {
    if (!mounted) return; // Wait until media queries are mounted
    const duration = reducedMotion ? 800 : 1500; // Shorter duration if reduced motion
    welcomeTimeoutRef.current = setTimeout(() => { setShowWelcome(false); }, duration);
    return () => { if (welcomeTimeoutRef.current) clearTimeout(welcomeTimeoutRef.current); };
  }, [mounted, reducedMotion]);

  // Cleanup all timeouts on unmount
  useEffect(() => {
    return () => {
      if (welcomeTimeoutRef.current) clearTimeout(welcomeTimeoutRef.current);
      if (preloadTimeoutRef.current) clearTimeout(preloadTimeoutRef.current);
    };
  }, []);

  // Show initial loading state until media queries are ready
  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#030014] flex items-center justify-center">
        <PageLoader message="Initializing application..." />
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="App bg-[#030014] min-h-screen overflow-hidden">
        <AnimatePresence mode="wait">
          {showWelcome ? (
            <motion.div key="welcome-screen" {...getAnimationProps(reducedMotion, 'fade')}>
              <WelcomeScreen reducedMotion={reducedMotion} onLoadingComplete={handleWelcomeComplete}/>
            </motion.div>
          ) : (
            <motion.div key="main-content" {...getAnimationProps(reducedMotion, 'page')}>
              <MainContent reducedMotion={reducedMotion} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </ErrorBoundary>
  );
}

export default React.memo(App); // Memoize App for performance