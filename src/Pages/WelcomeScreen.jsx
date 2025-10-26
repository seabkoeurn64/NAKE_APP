import React, { useState, useEffect, useCallback, memo, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Code2, Github, Globe, User } from 'lucide-react';
import AOS from 'aos';
import 'aos/dist/aos.css';

// Debounce helper function
const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Enhanced Typewriter Component with performance improvements
const TypewriterEffect = memo(({ text, speed = 150, onComplete }) => {
  const [displayText, setDisplayText] = useState('');
  
  useEffect(() => {
    if (!text) {
      onComplete?.();
      return;
    }

    let index = 0;
    let animationFrame;
    let lastTime = 0;

    const animate = (currentTime) => {
      if (!lastTime) lastTime = currentTime;
      const delta = currentTime - lastTime;

      if (delta >= speed) {
        if (index <= text.length) {
          setDisplayText(text.slice(0, index));
          index++;
          
          if (index > text.length && onComplete) {
            onComplete();
            return;
          }
        } else {
          return;
        }
        lastTime = currentTime;
      }
      animationFrame = requestAnimationFrame(animate);
    };

    animationFrame = requestAnimationFrame(animate);
    
    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [text, speed, onComplete]);

  return (
    <span className="inline-block">
      {displayText}
      <span className="animate-pulse">|</span>
    </span>
  );
});

// Optimized Background Component with reduced motion support
const BackgroundEffect = memo(() => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  
  useEffect(() => {
    // Check for reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    if (prefersReducedMotion) return;

    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100
      });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [prefersReducedMotion]);

  if (prefersReducedMotion) {
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10" />
        <div className="absolute top-1/4 left-1/4 w-48 h-48 bg-blue-500/5 rounded-full blur-xl" />
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-purple-500/5 rounded-full blur-xl" />
      </div>
    );
  }

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div 
        className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 transition-transform duration-1000"
        style={{
          transform: `translate(${(mousePosition.x - 50) * 0.01}%, ${(mousePosition.y - 50) * 0.01}%)`
        }}
      />
      <div 
        className="absolute top-1/4 left-1/4 w-48 h-48 bg-blue-500/5 rounded-full blur-xl transition-transform duration-1500"
        style={{
          transform: `translate(${(mousePosition.x - 50) * 0.02}px, ${(mousePosition.y - 50) * 0.02}px)`
        }}
      />
      <div 
        className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-purple-500/5 rounded-full blur-xl transition-transform duration-1500"
        style={{
          transform: `translate(${(mousePosition.x - 50) * -0.02}px, ${(mousePosition.y - 50) * -0.02}px)`
        }}
      />
    </div>
  );
});

// Progress Bar Component
const ProgressBar = memo(({ progress }) => (
  <div className="w-48 h-1 bg-white/10 rounded-full overflow-hidden mx-auto">
    <motion.div
      className="h-full bg-gradient-to-r from-indigo-400 to-purple-400"
      initial={{ width: 0 }}
      animate={{ width: `${progress}%` }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    />
  </div>
));

// Balanced Icon Button Component
const IconButton = memo(({ Icon, index, isMobile }) => {
  const animationDelay = useMemo(() => index * 200, [index]);

  return (
    <div 
      className="relative group"
      data-aos={!isMobile ? "fade-down" : undefined}
      data-aos-delay={!isMobile ? animationDelay : undefined}
    >
      <div className="absolute -inset-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full blur opacity-20 group-hover:opacity-40 transition duration-500" />
      <div className="relative p-3 bg-black/30 backdrop-blur-sm rounded-xl border border-white/10">
        <Icon className="w-6 h-6 text-white" />
      </div>
    </div>
  );
});

const WelcomeScreen = ({ onLoadingComplete }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [assetsLoaded, setAssetsLoaded] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);
  const [typewriterComplete, setTypewriterComplete] = useState(false);
  const [hasVisitedBefore, setHasVisitedBefore] = useState(false);

  // Memoized icon data
  const icons = useMemo(() => [Code2, User, Github], []);

  // Check for reduced motion and mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    const checkReducedMotion = () => {
      setPrefersReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    };
    
    checkMobile();
    checkReducedMotion();

    const debouncedResize = debounce(checkMobile, 100);
    window.addEventListener('resize', debouncedResize);
    
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    mediaQuery.addEventListener('change', checkReducedMotion);
    
    return () => {
      window.removeEventListener('resize', debouncedResize);
      mediaQuery.removeEventListener('change', checkReducedMotion);
    };
  }, []);

  // Check for returning visitors
  useEffect(() => {
    const visited = localStorage.getItem('welcomeScreenSeen');
    setHasVisitedBefore(!!visited);
    if (!visited) {
      localStorage.setItem('welcomeScreenSeen', 'true');
    }
  }, []);

  // Preload critical assets
  useEffect(() => {
    const preloadAssets = async () => {
      try {
        // Preload fonts and critical assets
        const steps = 4;
        for (let i = 1; i <= steps; i++) {
          await new Promise(resolve => setTimeout(resolve, 100));
          setLoadProgress((i / steps) * 30); // 30% for asset loading
        }
        setAssetsLoaded(true);
      } catch (error) {
        console.warn('Asset preloading failed:', error);
        setAssetsLoaded(true); // Continue anyway
      }
    };

    preloadAssets();
  }, []);

  // Balanced animation variants with reduced motion support
  const containerVariants = useMemo(() => ({
    exit: {
      opacity: 0,
      transition: {
        duration: prefersReducedMotion ? 0.2 : (isMobile ? 0.4 : 0.6),
        ease: "easeInOut"
      }
    }
  }), [isMobile, prefersReducedMotion]);

  const childVariants = useMemo(() => ({
    exit: {
      opacity: 0,
      y: -10,
      transition: {
        duration: prefersReducedMotion ? 0.2 : 0.4,
        ease: "easeOut"
      }
    }
  }), [prefersReducedMotion]);

  // Handle typewriter completion
  const handleTypewriterComplete = useCallback(() => {
    setTypewriterComplete(true);
  }, []);

  // Handle loading completion
  const handleLoadingComplete = useCallback(() => {
    onLoadingComplete?.();
  }, [onLoadingComplete]);

  // Initialize AOS with proper cleanup
  useEffect(() => {
    if (prefersReducedMotion) return;

    const initAOS = () => {
      AOS.init({
        duration: 800,
        once: false,
        mirror: false,
        offset: 50,
        throttleDelay: 99,
        startEvent: 'DOMContentLoaded',
        disable: isMobile ? false : 'phone'
      });
    };

    const timer = setTimeout(initAOS, 100);
    
    return () => {
      clearTimeout(timer);
      AOS.refresh();
    };
  }, [isMobile, prefersReducedMotion]);

  // Main loading logic
  useEffect(() => {
    if (!assetsLoaded) return;

    // Faster loading for returning visitors
    const minimumLoadTime = hasVisitedBefore ? 1200 : 2500;
    const startTime = Date.now();

    // Progress animation
    const progressInterval = setInterval(() => {
      setLoadProgress(prev => {
        if (prev >= 85) {
          clearInterval(progressInterval);
          return 85;
        }
        return prev + (hasVisitedBefore ? 8 : 5);
      });
    }, hasVisitedBefore ? 100 : 150);

    const completeLoading = () => {
      clearInterval(progressInterval);
      setLoadProgress(100);
      
      setTimeout(() => {
        setIsLoading(false);
        setTimeout(handleLoadingComplete, prefersReducedMotion ? 100 : 400);
      }, prefersReducedMotion ? 200 : 500);
    };

    const timer = setTimeout(() => {
      const elapsed = Date.now() - startTime;
      const remainingTime = Math.max(0, minimumLoadTime - elapsed);
      
      if (!typewriterComplete && remainingTime > 0) {
        setTimeout(completeLoading, remainingTime);
      } else {
        completeLoading();
      }
    }, 300);

    return () => {
      clearTimeout(timer);
      clearInterval(progressInterval);
    };
  }, [assetsLoaded, typewriterComplete, handleLoadingComplete, hasVisitedBefore, prefersReducedMotion]);

  // Skip loading for very fast connections or returning visitors
  useEffect(() => {
    if (hasVisitedBefore && assetsLoaded) {
      const timer = setTimeout(() => {
        if (isLoading) {
          setIsLoading(false);
          setTimeout(handleLoadingComplete, 100);
        }
      }, 800);
      
      return () => clearTimeout(timer);
    }
  }, [hasVisitedBefore, assetsLoaded, isLoading, handleLoadingComplete]);

  const handleSkipIntro = useCallback(() => {
    setIsLoading(false);
    setTimeout(handleLoadingComplete, prefersReducedMotion ? 50 : 200);
  }, [handleLoadingComplete, prefersReducedMotion]);

  return (
    <AnimatePresence mode="wait">
      {isLoading && (
        <motion.div
          className="fixed inset-0 bg-[#030014] z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit="exit"
          variants={containerVariants}
        >
          <BackgroundEffect />
          
          <div className="relative w-full max-w-2xl mx-auto px-4">
            {/* Icons Row */}
            <motion.div 
              className="flex justify-center gap-6 mb-8"
              variants={childVariants}
            >
              {icons.map((Icon, index) => (
                <IconButton 
                  key={index} 
                  Icon={Icon} 
                  index={index}
                  isMobile={isMobile}
                />
              ))}
            </motion.div>

            {/* Welcome Text */}
            <motion.div 
              className="text-center mb-8"
              variants={childVariants}
            >
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
                <div className="mb-4">
                  <span 
                    data-aos={!prefersReducedMotion ? "fade-right" : undefined}
                    data-aos-delay={!prefersReducedMotion ? "200" : undefined}
                    className="inline-block mr-2"
                  >
                    Welcome
                  </span>
                  <span 
                    data-aos={!prefersReducedMotion ? "fade-right" : undefined}
                    data-aos-delay={!prefersReducedMotion ? "400" : undefined}
                    className="inline-block mr-2"
                  >
                    To
                  </span>
                  <span 
                    data-aos={!prefersReducedMotion ? "fade-right" : undefined}
                    data-aos-delay={!prefersReducedMotion ? "600" : undefined}
                    className="inline-block"
                  >
                    My
                  </span>
                </div>
                <div>
                  <span 
                    data-aos={!prefersReducedMotion ? "fade-up" : undefined}
                    data-aos-delay={!prefersReducedMotion ? "800" : undefined}
                    className="inline-block bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent mr-2"
                  >
                    Portfolio
                  </span>
                  <span 
                    data-aos={!prefersReducedMotion ? "fade-up" : undefined}
                    data-aos-delay={!prefersReducedMotion ? "1000" : undefined}
                    className="inline-block bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent"
                  >
                    Website
                  </span>
                </div>
              </h1>
            </motion.div>

            {/* Website Link */}
            <motion.div 
              className="text-center mb-8"
              variants={childVariants}
            >
              <a
                href="https://www.koeurn.my.id"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-colors duration-300 group"
                target="_blank"
                rel="noopener noreferrer"
                data-aos={!prefersReducedMotion ? "fade-up" : undefined}
                data-aos-delay={!prefersReducedMotion ? "1200" : undefined}
              >
                <Globe className="w-5 h-5 text-indigo-400 group-hover:scale-110 transition-transform duration-300" />
                <span className="text-white text-lg">
                  <TypewriterEffect 
                    text="www.koeurn.my.id" 
                    speed={prefersReducedMotion ? 50 : 120}
                    onComplete={handleTypewriterComplete}
                  />
                </span>
              </a>
            </motion.div>

            {/* Progress Bar */}
            <motion.div 
              className="mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: prefersReducedMotion ? 0.3 : 1 }}
            >
              <ProgressBar progress={loadProgress} />
            </motion.div>

            {/* Loading Text */}
            <motion.div 
              className="text-center mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: prefersReducedMotion ? 0.5 : 1.2 }}
            >
              <p className="text-gray-400 text-sm">
                {loadProgress < 100 ? 'Loading your experience...' : 'Ready!'}
              </p>
            </motion.div>

            {/* Skip Button - Show earlier for returning visitors */}
            {(hasVisitedBefore || loadProgress > 50) && (
              <motion.div 
                className="text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: prefersReducedMotion ? 0.7 : 1.5 }}
              >
                <button
                  onClick={handleSkipIntro}
                  className="text-gray-400 text-sm hover:text-white transition-colors duration-300 underline hover:no-underline focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 rounded px-2 py-1"
                  aria-label="Skip introduction"
                >
                  Skip intro
                </button>
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default memo(WelcomeScreen);