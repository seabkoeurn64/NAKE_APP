import React, { useState, useEffect, memo } from 'react';

const LoadingScreen = memo(() => {
  const [isMobile, setIsMobile] = useState(false);
  const [showLoadingText, setShowLoadingText] = useState(false);

  // Check mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Show loading text after a short delay for better UX
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoadingText(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-[#030014] flex items-center justify-center overflow-hidden">
      <div className="relative w-full max-w-sm sm:max-w-md mx-auto">
        {/* Animated Background Effects - CENTERED */}
        <div className="absolute -inset-8 sm:-inset-12 bg-gradient-to-r from-[#6366f1] to-[#a855f7] rounded-full opacity-20 blur-3xl animate-pulse-slow mx-auto left-1/2 transform -translate-x-1/2"></div>
        
        {/* Floating Particles - CENTERED AROUND MAIN CONTENT */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div 
            className="absolute w-2 h-2 bg-[#6366f1] rounded-full opacity-60 animate-float"
            style={{ 
              animationDelay: '0s',
              top: '25%',
              left: '25%'
            }}
          />
          <div 
            className="absolute w-1.5 h-1.5 bg-[#a855f7] rounded-full opacity-40 animate-float"
            style={{ 
              animationDelay: '1.5s',
              top: '33%',
              right: '25%'
            }}
          />
          <div 
            className="absolute w-1 h-1 bg-[#8b5cf6] rounded-full opacity-50 animate-float"
            style={{ 
              animationDelay: '2.5s',
              bottom: '25%',
              left: '33%'
            }}
          />
        </div>

        {/* Main Loading Content - PERFECTLY CENTERED */}
        <div className="relative flex flex-col items-center justify-center gap-4 sm:gap-6 p-6 sm:p-8">
          {/* Spinner Container - CENTERED */}
          <div className="relative flex items-center justify-center">
            <div className="absolute -inset-3 sm:-inset-4 bg-gradient-to-r from-[#6366f1] to-[#a855f7] rounded-full opacity-30 blur-xl animate-ping-slow"></div>
            <div 
              className={`relative rounded-full border-4 border-t-transparent ${
                isMobile 
                  ? "w-10 h-10 border-3" 
                  : "w-12 h-12 border-4"
              } border-[#6366f1] animate-spin-slow`}
            />
          </div>

          {/* Loading Text with Staggered Animation - CENTERED */}
          <div className="relative flex flex-col items-center justify-center gap-2 sm:gap-3 text-center w-full">
            <div 
              className={`relative transition-all duration-500 ${
                showLoadingText ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
              }`}
            >
              <div className="absolute -inset-2 bg-gradient-to-r from-[#6366f1] to-[#a855f7] rounded blur opacity-20 animate-pulse"></div>
              <span className="relative text-gray-200 text-sm sm:text-base font-light tracking-wide">
                Loading Portfolio...
              </span>
            </div>
            
            {/* Optional Subtitle - CENTERED */}
            {showLoadingText && (
              <div 
                className="relative transition-all duration-500 delay-200 text-center"
                style={{
                  opacity: showLoadingText ? 1 : 0,
                  transform: showLoadingText ? 'translateY(0)' : 'translateY(2px)'
                }}
              >
                <span className="text-gray-400 text-xs sm:text-sm font-light">
                  Preparing amazing content
                </span>
              </div>
            )}
          </div>

          {/* Progress Bar (Optional) - CENTERED */}
          <div className="w-32 sm:w-40 h-1 bg-white/10 rounded-full overflow-hidden mt-2 mx-auto">
            <div 
              className="h-full bg-gradient-to-r from-[#6366f1] to-[#a855f7] rounded-full animate-progress"
            />
          </div>
        </div>
      </div>

      {/* Inline styles for custom animations */}
      <style jsx>{`
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        @keyframes pulse-slow {
          0%, 100% {
            opacity: 0.2;
            transform: scale(1);
          }
          50% {
            opacity: 0.3;
            transform: scale(1.05);
          }
        }
        @keyframes ping-slow {
          0% {
            transform: scale(1);
            opacity: 0.3;
          }
          75%, 100% {
            transform: scale(2);
            opacity: 0;
          }
        }
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) translateX(0px);
          }
          33% {
            transform: translateY(-10px) translateX(5px);
          }
          66% {
            transform: translateY(5px) translateX(-5px);
          }
        }
        @keyframes progress {
          0% {
            transform: translateX(-100%);
          }
          50% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        .animate-spin-slow {
          animation: spin-slow 2s linear infinite;
        }
        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }
        .animate-ping-slow {
          animation: ping-slow 2s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-progress {
          animation: progress 2s ease-in-out infinite;
        }

        /* Reduced motion support */
        @media (prefers-reduced-motion: reduce) {
          .animate-spin-slow,
          .animate-pulse-slow,
          .animate-ping-slow,
          .animate-float,
          .animate-progress {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
});

export default LoadingScreen;