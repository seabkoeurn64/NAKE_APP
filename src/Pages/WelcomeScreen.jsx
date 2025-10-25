import React, { useState, useEffect, useCallback, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Code2, Github, Globe, User } from 'lucide-react';
import AOS from 'aos';
import 'aos/dist/aos.css';

// Enhanced Typewriter Component
const TypewriterEffect = memo(({ text, speed = 180, onComplete }) => {
  const [displayText, setDisplayText] = useState('');
  
  useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      if (index <= text.length) {
        setDisplayText(text.slice(0, index));
        index++;
        
        // Call onComplete when finished
        if (index > text.length && onComplete) {
          onComplete();
        }
      } else {
        clearInterval(timer);
      }
    }, speed);
    
    return () => clearInterval(timer);
  }, [text, speed, onComplete]);

  return (
    <span className="inline-block">
      {displayText}
      <span className="animate-pulse">|</span>
    </span>
  );
});

// Enhanced Background Component with Parallax
const BackgroundEffect = memo(() => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100
      });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

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
      transition={{ duration: 0.3 }}
    />
  </div>
));

// Balanced Icon Button Component
const IconButton = memo(({ Icon, index }) => {
  return (
    <div 
      className="relative group"
      data-aos="fade-down" 
      data-aos-delay={index * 200}
    >
      <div className="absolute -inset-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full blur opacity-20 group-hover:opacity-40 transition duration-500" />
      <div className="relative p-3 bg-black/30 backdrop-blur-sm rounded-xl border border-white/10">
        <Icon className="w-6 h-6 text-white" />
      </div>
    </div>
  );
});

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

const WelcomeScreen = ({ onLoadingComplete }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [assetsLoaded, setAssetsLoaded] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);
  const [typewriterComplete, setTypewriterComplete] = useState(false);

  // Preload critical assets
  useEffect(() => {
    const preloadAssets = async () => {
      try {
        // Simulate asset loading with progress
        const steps = 5;
        for (let i = 1; i <= steps; i++) {
          await new Promise(resolve => setTimeout(resolve, 200));
          setLoadProgress((i / steps) * 40); // 40% for asset loading
        }
        setAssetsLoaded(true);
      } catch (error) {
        console.warn('Asset preloading failed:', error);
        setAssetsLoaded(true); // Continue anyway
      }
    };

    preloadAssets();
  }, []);

  // Detect mobile device with debouncing
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    const debouncedResize = debounce(checkMobile, 100);
    window.addEventListener('resize', debouncedResize);
    
    return () => {
      window.removeEventListener('resize', debouncedResize);
    };
  }, []);

  // Balanced animation variants
  const containerVariants = {
    exit: {
      opacity: 0,
      transition: {
        duration: isMobile ? 0.4 : 0.6,
        ease: "easeInOut"
      }
    }
  };

  const childVariants = {
    exit: {
      opacity: 0,
      y: -10,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    }
  };

  // Handle typewriter completion
  const handleTypewriterComplete = useCallback(() => {
    setTypewriterComplete(true);
  }, []);

  // Handle loading completion
  const handleLoadingComplete = useCallback(() => {
    onLoadingComplete?.();
  }, [onLoadingComplete]);

  // Initialize AOS
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: false,
      mirror: false,
      offset: 50,
      throttleDelay: 99,
      startEvent: 'DOMContentLoaded',
      disable: isMobile ? false : 'phone'
    });

    return () => {
      AOS.refresh();
    };
  }, [isMobile]);

  // Main loading logic
  useEffect(() => {
    if (!assetsLoaded) return;

    const minimumLoadTime = 2500; // 2.5s minimum for brand impression
    const startTime = Date.now();

    // Progress animation
    const progressInterval = setInterval(() => {
      setLoadProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 5;
      });
    }, 150);

    const completeLoading = () => {
      clearInterval(progressInterval);
      setLoadProgress(100);
      
      setTimeout(() => {
        setIsLoading(false);
        setTimeout(handleLoadingComplete, 400);
      }, 500);
    };

    const timer = setTimeout(() => {
      const elapsed = Date.now() - startTime;
      const remainingTime = Math.max(0, minimumLoadTime - elapsed);
      
      // Wait for typewriter to complete if needed
      if (!typewriterComplete && remainingTime > 0) {
        setTimeout(completeLoading, remainingTime);
      } else {
        completeLoading();
      }
    }, 500);

    return () => {
      clearTimeout(timer);
      clearInterval(progressInterval);
    };
  }, [assetsLoaded, typewriterComplete, handleLoadingComplete]);

  // Check for returning visitors
  useEffect(() => {
    const hasVisitedBefore = localStorage.getItem('welcomeScreenSeen');
    if (hasVisitedBefore) {
      // Shorten welcome time for returning visitors
      const timer = setTimeout(() => {
        if (assetsLoaded) {
          setIsLoading(false);
          setTimeout(handleLoadingComplete, 200);
        }
      }, 1200);
      
      return () => clearTimeout(timer);
    } else {
      localStorage.setItem('welcomeScreenSeen', 'true');
    }
  }, [assetsLoaded, handleLoadingComplete]);

  // Icon data
  const icons = [Code2, User, Github];

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
                <IconButton key={index} Icon={Icon} index={index} />
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
                    data-aos="fade-right" 
                    data-aos-delay="200" 
                    className="inline-block mr-2"
                  >
                    Welcome
                  </span>
                  <span 
                    data-aos="fade-right" 
                    data-aos-delay="400" 
                    className="inline-block mr-2"
                  >
                    To
                  </span>
                  <span 
                    data-aos="fade-right" 
                    data-aos-delay="600" 
                    className="inline-block"
                  >
                    My
                  </span>
                </div>
                <div>
                  <span 
                    data-aos="fade-up" 
                    data-aos-delay="800" 
                    className="inline-block bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent mr-2"
                  >
                    Portfolio
                  </span>
                  <span 
                    data-aos="fade-up" 
                    data-aos-delay="1000" 
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
                data-aos="fade-up"
                data-aos-delay="1200"
              >
                <Globe className="w-5 h-5 text-indigo-400 group-hover:scale-110 transition-transform duration-300" />
                <span className="text-white text-lg">
                  <TypewriterEffect 
                    text="www.koeurn.my.id" 
                    speed={150}
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
              transition={{ delay: 1 }}
            >
              <ProgressBar progress={loadProgress} />
            </motion.div>

            {/* Loading Text */}
            <motion.div 
              className="text-center mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
            >
              <p className="text-gray-400 text-sm">
                {loadProgress < 100 ? 'Loading your experience...' : 'Ready!'}
              </p>
            </motion.div>

            {/* Skip Button for Returning Visitors */}
            <motion.div 
              className="text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2 }}
            >
              <button
                onClick={() => {
                  setIsLoading(false);
                  setTimeout(handleLoadingComplete, 200);
                }}
                className="text-gray-400 text-sm hover:text-white transition-colors duration-300 underline hover:no-underline"
              >
                Skip intro
              </button>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default memo(WelcomeScreen);