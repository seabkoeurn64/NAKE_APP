import React, { useState, useEffect, useCallback, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Code2, Github, Globe, User } from 'lucide-react';
import AOS from 'aos';
import 'aos/dist/aos.css';

// Memoized Typewriter Component with balanced speed
const TypewriterEffect = memo(({ text, speed = 180 }) => {
  const [displayText, setDisplayText] = useState('');
  
  useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      if (index <= text.length) {
        setDisplayText(text.slice(0, index));
        index++;
      } else {
        clearInterval(timer);
      }
    }, speed);
    
    return () => clearInterval(timer);
  }, [text, speed]);

  return (
    <span className="inline-block">
      {displayText}
      <span className="animate-pulse">|</span>
    </span>
  );
});

// Simple Background Component
const BackgroundEffect = memo(() => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10" />
    <div className="absolute top-1/4 left-1/4 w-48 h-48 bg-blue-500/5 rounded-full blur-xl" />
    <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-purple-500/5 rounded-full blur-xl" />
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

const WelcomeScreen = ({ onLoadingComplete }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Balanced animation variants
  const containerVariants = {
    exit: {
      opacity: 0,
      transition: {
        duration: 0.6,
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

  // Handle loading completion
  const handleLoadingComplete = useCallback(() => {
    onLoadingComplete?.();
  }, [onLoadingComplete]);

  useEffect(() => {
    // Initialize AOS with balanced settings
    AOS.init({
      duration: 800,
      once: false,
      mirror: false,
      offset: 50,
    });

    // Balanced timing - not too fast, not too slow
    const timer = setTimeout(() => {
      setIsLoading(false);
      setTimeout(handleLoadingComplete, 400);
    }, 3500);
    
    return () => {
      clearTimeout(timer);
      AOS.refresh();
    };
  }, [handleLoadingComplete]);

  // Icon data
  const icons = [Code2, User, Github];

  return (
    <AnimatePresence mode="wait">
      {isLoading && (
        <motion.div
          className="fixed inset-0 bg-[#030014] z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit="exit"
          variants={containerVariants}
        >
          <BackgroundEffect />
          
          <div className="relative min-h-screen flex items-center justify-center px-4">
            <div className="w-full max-w-2xl mx-auto">
              {/* Icons Row - Balanced spacing */}
              <motion.div 
                className="flex justify-center gap-6 mb-8"
                variants={childVariants}
              >
                {icons.map((Icon, index) => (
                  <IconButton key={index} Icon={Icon} index={index} />
                ))}
              </motion.div>

              {/* Welcome Text - Balanced font sizes */}
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

              {/* Website Link - Balanced sizing */}
              <motion.div 
                className="text-center"
                variants={childVariants}
              >
                <a
                  href="https://www.koeurn.my.id"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-colors duration-300"
                  target="_blank"
                  rel="noopener noreferrer"
                  data-aos="fade-up"
                  data-aos-delay="1200"
                >
                  <Globe className="w-5 h-5 text-indigo-400" />
                  <span className="text-white text-lg">
                    <TypewriterEffect 
                      text="www.koeurn.my.id" 
                      speed={150} 
                    />
                  </span>
                </a>
              </motion.div>

              {/* Simple loading text */}
              <motion.div 
                className="text-center mt-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
              >
                <p className="text-gray-400 text-sm">Loading your experience...</p>
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default memo(WelcomeScreen);