import React, { useState, useEffect, memo, useMemo } from 'react';
import PropTypes from 'prop-types';

// FloatingParticle component defined outside
const FloatingParticle = memo(({ size, color, delay, top, left, right, bottom }) => (
  <div 
    className={`absolute ${size} ${color} rounded-full opacity-60 animate-float`}
    style={{ 
      animationDelay: delay,
      top: top || 'auto',
      left: left || 'auto',
      right: right || 'auto',
      bottom: bottom || 'auto'
    }}
  />
));
FloatingParticle.displayName = 'FloatingParticle';

// Debounce utility
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

// FIXED: Use JavaScript default parameters instead of defaultProps
const LoadingScreen = memo(({ onLoadingComplete, minDisplayTime = 2000 }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [showLoadingText, setShowLoadingText] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [loadingPhase, setLoadingPhase] = useState('initializing');

  // Memoized particle configurations for better performance
  const particles = useMemo(() => [
    { size: 'w-2 h-2', color: 'bg-[#6366f1]', delay: '0s', top: '25%', left: '25%' },
    { size: 'w-1.5 h-1.5', color: 'bg-[#a855f7]', delay: '1.5s', top: '33%', right: '25%' },
    { size: 'w-1 h-1', color: 'bg-[#8b5cf6]', delay: '2.5s', bottom: '25%', left: '33%' },
    { size: 'w-1.5 h-1.5', color: 'bg-[#ec4899]', delay: '0.8s', top: '40%', right: '35%' },
    { size: 'w-2 h-2', color: 'bg-[#06b6d4]', delay: '3s', bottom: '35%', right: '30%' }
  ], []);

  // Update loading phase based on progress
  useEffect(() => {
    if (progress < 30) setLoadingPhase('initializing');
    else if (progress < 70) setLoadingPhase('loading-assets');
    else if (progress < 95) setLoadingPhase('finalizing');
    else setLoadingPhase('complete');
  }, [progress]);

  // Debounced mobile detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    
    const debouncedResize = debounce(checkMobile, 100);
    window.addEventListener('resize', debouncedResize);
    
    return () => window.removeEventListener('resize', debouncedResize);
  }, []);

  // Enhanced loading simulation with progress and error handling
  useEffect(() => {
    try {
      let progressInterval;
      let startTime = Date.now();

      // Show loading text after short delay
      const textTimer = setTimeout(() => {
        setShowLoadingText(true);
      }, 300);

      // Simulate loading progress with more realistic increments
      progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 95) {
            clearInterval(progressInterval);
            return 95;
          }
          // Slower progression as we approach completion
          const remaining = 100 - prev;
          const increment = Math.min(remaining * 0.2, 10);
          return prev + increment;
        });
      }, 300);

      // Complete loading after minimum display time
      const completeTimer = setTimeout(() => {
        const elapsed = Date.now() - startTime;
        const remainingTime = Math.max(0, minDisplayTime - elapsed);
        
        setTimeout(() => {
          setProgress(100);
          setIsComplete(true);
          
          // Call completion callback after animation
          setTimeout(() => {
            onLoadingComplete?.();
          }, 500);
        }, remainingTime);
      }, minDisplayTime);

      return () => {
        clearTimeout(textTimer);
        clearInterval(progressInterval);
        clearTimeout(completeTimer);
      };
    } catch (error) {
      console.error('LoadingScreen error:', error);
      setHasError(true);
      // Fallback: complete loading immediately on error
      setTimeout(() => onLoadingComplete?.(), 500);
    }
  }, [onLoadingComplete, minDisplayTime]);

  // Loading phase messages
  const getLoadingMessage = () => {
    switch (loadingPhase) {
      case 'initializing':
        return 'Initializing portfolio...';
      case 'loading-assets':
        return 'Loading design assets...';
      case 'finalizing':
        return 'Finalizing experience...';
      case 'complete':
        return 'Ready!';
      default:
        return 'Loading portfolio...';
    }
  };

  // Error state fallback
  if (hasError) {
    return (
      <div className="fixed inset-0 bg-[#030014] flex items-center justify-center z-50">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400 text-sm">Loading portfolio...</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`fixed inset-0 bg-[#030014] flex items-center justify-center overflow-hidden z-50 transition-opacity duration-500 ${
        isComplete ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className="relative w-full max-w-sm sm:max-w-md mx-auto">
        {/* Enhanced Animated Background Effects */}
        <div className="absolute -inset-8 sm:-inset-12 bg-gradient-to-r from-[#6366f1] to-[#a855f7] rounded-full opacity-20 blur-3xl animate-pulse-slow mx-auto left-1/2 transform -translate-x-1/2"></div>
        
        {/* Dynamic Floating Particles */}
        <div className="absolute inset-0 flex items-center justify-center">
          {particles.map((particle, index) => (
            <FloatingParticle key={index} {...particle} />
          ))}
        </div>

        {/* Main Loading Content */}
        <div className="relative flex flex-col items-center justify-center gap-4 sm:gap-6 p-6 sm:p-8">
          {/* Enhanced Spinner Container */}
          <div className="relative flex items-center justify-center will-change-transform">
            <div className="absolute -inset-3 sm:-inset-4 bg-gradient-to-r from-[#6366f1] to-[#a855f7] rounded-full opacity-30 blur-xl animate-ping-slow"></div>
            <div 
              className={`relative rounded-full border-4 border-t-transparent ${
                isMobile 
                  ? "w-10 h-10 border-3" 
                  : "w-12 h-12 border-4"
              } border-[#6366f1] animate-spin-slow`}
            />
            
            {/* Inner spinner for depth */}
            <div 
              className={`absolute rounded-full border-2 border-[#a855f7] border-t-transparent ${
                isMobile ? "w-8 h-8" : "w-10 h-10"
              } animate-spin-slow-reverse opacity-60`}
            />
          </div>

          {/* Enhanced Loading Text with Staggered Animation */}
          <div className="relative flex flex-col items-center justify-center gap-2 sm:gap-3 text-center w-full">
            <div 
              className={`relative transition-all duration-500 transform ${
                showLoadingText ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
              }`}
            >
              <div className="absolute -inset-2 bg-gradient-to-r from-[#6366f1] to-[#a855f7] rounded blur opacity-20 animate-pulse"></div>
              <span className="relative text-gray-200 text-sm sm:text-base font-light tracking-wide bg-gradient-to-r from-gray-200 to-gray-300 bg-clip-text text-transparent">
                {getLoadingMessage()}
              </span>
            </div>
            
            {/* Enhanced Subtitle */}
            {showLoadingText && (
              <div 
                className="relative transition-all duration-500 delay-200 text-center"
                style={{
                  opacity: showLoadingText ? 1 : 0,
                  transform: showLoadingText ? 'translateY(0)' : 'translateY(2px)'
                }}
              >
                <span className="text-gray-400 text-xs sm:text-sm font-light">
                  {loadingPhase === 'initializing' && 'Setting up your experience...'}
                  {loadingPhase === 'loading-assets' && 'Loading design projects...'}
                  {loadingPhase === 'finalizing' && 'Applying final touches...'}
                  {loadingPhase === 'complete' && 'Welcome!'}
                </span>
              </div>
            )}
          </div>

          {/* Enhanced Progress Bar */}
          <div className="w-32 sm:w-40 h-1.5 bg-white/10 rounded-full overflow-hidden mt-2 mx-auto border border-white/5">
            <div 
              className="h-full bg-gradient-to-r from-[#6366f1] via-[#a855f7] to-[#ec4899] rounded-full transition-all duration-300 ease-out shadow-lg shadow-purple-500/30"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Progress Percentage */}
          {showLoadingText && progress > 0 && (
            <div className="text-gray-500 text-xs font-mono transition-opacity duration-300">
              {Math.round(progress)}%
            </div>
          )}
        </div>
      </div>

      {/* Enhanced CSS Styles */}
      <style>{`
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        @keyframes spin-slow-reverse {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(-360deg);
          }
        }
        @keyframes pulse-slow {
          0%, 100% {
            opacity: 0.15;
            transform: scale(1);
          }
          50% {
            opacity: 0.25;
            transform: scale(1.05);
          }
        }
        @keyframes ping-slow {
          0% {
            transform: scale(1);
            opacity: 0.3;
          }
          75%, 100% {
            transform: scale(2.5);
            opacity: 0;
          }
        }
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) translateX(0px) scale(1);
            opacity: 0.6;
          }
          25% {
            transform: translateY(-12px) translateX(8px) scale(1.1);
            opacity: 0.8;
          }
          50% {
            transform: translateY(-5px) translateX(-6px) scale(0.9);
            opacity: 0.7;
          }
          75% {
            transform: translateY(8px) translateX(4px) scale(1.05);
            opacity: 0.5;
          }
        }
        .animate-spin-slow {
          animation: spin-slow 1.8s linear infinite;
        }
        .animate-spin-slow-reverse {
          animation: spin-slow-reverse 2.2s linear infinite;
        }
        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }
        .animate-ping-slow {
          animation: ping-slow 3s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
        .animate-float {
          animation: float 8s ease-in-out infinite;
        }

        /* Enhanced reduced motion support */
        @media (prefers-reduced-motion: reduce) {
          .animate-spin-slow,
          .animate-spin-slow-reverse,
          .animate-pulse-slow,
          .animate-ping-slow,
          .animate-float {
            animation: none;
          }
          
          .transition-all,
          .transform {
            transition: none !important;
          }
        }
      `}</style>
    </div>
  );
});

// FIXED: Remove defaultProps and keep only PropTypes for development
LoadingScreen.propTypes = {
  onLoadingComplete: PropTypes.func,
  minDisplayTime: PropTypes.number
};

LoadingScreen.displayName = 'LoadingScreen';

export default LoadingScreen;