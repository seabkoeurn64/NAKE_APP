import React, { useState, useEffect, useRef, useCallback, memo } from "react";
import SocialLinks from "../components/SocialLinks";
import AOS from "aos";
import "aos/dist/aos.css";
import { MessageCircle } from "lucide-react";

// ✅ Constants
const ANIMATION_CONFIG = {
  AOS_OFFSET: 40,
  AOS_DURATION: 700,
  RESIZE_DEBOUNCE: 100
};

// ✅ Custom Hook for Media Queries
const useMediaQueries = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [mounted, setMounted] = useState(false);
  const resizeTimeout = useRef();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    const checkReducedMotion = () => {
      setPrefersReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    };

    const initialize = () => {
      checkMobile();
      checkReducedMotion();
      setMounted(true);
    };

    initialize();

    const handleResize = () => {
      clearTimeout(resizeTimeout.current);
      resizeTimeout.current = setTimeout(checkMobile, ANIMATION_CONFIG.RESIZE_DEBOUNCE);
    };

    window.addEventListener('resize', handleResize, { passive: true });
    
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    mediaQuery.addEventListener('change', checkReducedMotion);

    return () => {
      window.removeEventListener('resize', handleResize);
      mediaQuery.removeEventListener('change', checkReducedMotion);
      clearTimeout(resizeTimeout.current);
    };
  }, []);

  return { isMobile, prefersReducedMotion, mounted };
};

// ✅ Optimized Background Component
const ContactBackground = memo(({ prefersReducedMotion, isMobile }) => {
  // Reduced number of elements for better performance
  const floatingShapes = [
    { class: "top-20 left-10 w-64 h-64 bg-purple-500/10", delay: "0s" },
    { class: "top-40 right-20 w-48 h-48 bg-pink-500/10", delay: "1s" },
    ...(isMobile ? [] : [
      { class: "bottom-32 left-1/4 w-56 h-56 bg-blue-500/10", delay: "0.5s" },
      { class: "bottom-20 right-32 w-40 h-40 bg-indigo-500/10", delay: "1.5s" }
    ])
  ];

  const messageShapes = [
    { class: "top-1/3 left-20 w-16 h-16 bg-white/5 rounded-2xl rounded-bl-none blur-sm rotate-45", delay: "0s" },
    ...(isMobile ? [] : [
      { class: "bottom-1/3 right-24 w-12 h-12 bg-purple-400/10 rounded-2xl rounded-br-none blur-sm -rotate-45", delay: "0.8s" },
      { class: "top-1/2 right-40 w-10 h-10 bg-pink-400/10 rounded-2xl rounded-bl-none blur-sm rotate-12", delay: "1.2s" }
    ])
  ];

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Static gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#030014] via-[#0f0a28] to-[#1a1039]" />
      
      {/* Animated gradient overlay - conditionally rendered */}
      {!prefersReducedMotion && (
        <div 
          className="absolute inset-0 opacity-20 performance-layer"
          style={{
            background: 'linear-gradient(45deg, #6366f1, #8b5cf6, #a855f7, #ec4899)',
            backgroundSize: '400% 400%',
            animation: 'contactGradient 8s ease infinite'
          }}
        />
      )}
      
      {/* Optimized floating shapes */}
      {floatingShapes.map((shape, index) => (
        <div
          key={`float-${index}`}
          className={`absolute ${shape.class} rounded-full blur-3xl performance-layer`}
          style={!prefersReducedMotion ? { 
            animation: `contactFloatSimple 8s ease-in-out infinite ${shape.delay}` 
          } : {}}
        />
      ))}
      
      {/* Message bubble shapes */}
      {messageShapes.map((shape, index) => (
        <div
          key={`message-${index}`}
          className={`absolute ${shape.class} performance-layer`}
          style={!prefersReducedMotion ? { 
            animation: `contactMessageSimple 6s ease-in-out infinite ${shape.delay}` 
          } : {}}
        />
      ))}
      
      {/* Connection lines - only on desktop */}
      {!isMobile && (
        <>
          <div className="absolute top-1/4 left-1/2 w-px h-32 bg-gradient-to-b from-purple-500/20 to-transparent" />
          <div className="absolute bottom-1/4 right-1/2 w-px h-24 bg-gradient-to-t from-pink-500/20 to-transparent" />
        </>
      )}
      
      {/* Static grid pattern without animation */}
      <div className="absolute inset-0 opacity-5">
        <div 
          className="w-full h-full"
          style={{
            backgroundImage: 'linear-gradient(#6366f1 1px, transparent 1px), linear-gradient(90deg, #6366f1 1px, transparent 1px)',
            backgroundSize: isMobile ? '30px 30px' : '50px 50px',
          }}
        />
      </div>
      
      {/* Reduced sparkle effects */}
      {!prefersReducedMotion && (
        <>
          <div className="absolute top-1/4 left-1/3 w-2 h-2 bg-white rounded-full opacity-60 performance-layer" 
               style={{ animation: 'contactSparkleSimple 3s ease-in-out infinite' }} />
          {!isMobile && (
            <div className="absolute top-1/3 right-1/4 w-1.5 h-1.5 bg-purple-300 rounded-full opacity-70 performance-layer" 
                 style={{ animation: 'contactSparkleSimple 4s ease-in-out infinite 0.7s' }} />
          )}
        </>
      )}
    </div>
  );
});

// ✅ Header Icon Component
const HeaderIcon = memo(({ prefersReducedMotion }) => (
  <div 
    className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl mb-4 sm:mb-6 shadow-lg transform transition-transform duration-300 hover:scale-110 group relative overflow-hidden performance-layer"
    data-aos="fade-down"
    data-aos-duration={prefersReducedMotion ? 0 : 800}
    data-aos-delay="200"
  >
    {/* Shine effect */}
    {!prefersReducedMotion && (
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 transition-all duration-1000 group-hover:translate-x-full" />
    )}
    <MessageCircle className="w-6 h-6 sm:w-7 sm:h-7 text-white relative z-10" />
  </div>
));

// ✅ Pulsing Dots Component
const PulsingDots = memo(({ prefersReducedMotion }) => (
  <div className="flex items-center gap-2">
    <div className={`w-2 h-2 bg-purple-500 rounded-full ${!prefersReducedMotion ? 'animate-pulse-custom' : ''}`} />
    Connect With Me
    <div className={`w-2 h-2 bg-pink-500 rounded-full ${!prefersReducedMotion ? 'animate-pulse-custom-delayed' : ''}`} />
  </div>
));

// ✅ Main ContactPage Component
const ContactPage = () => {
  const { isMobile, prefersReducedMotion, mounted } = useMediaQueries();

  // ✅ Optimized AOS initialization
  useEffect(() => {
    if (!mounted) return;

    AOS.init({
      once: true,
      offset: isMobile ? 20 : ANIMATION_CONFIG.AOS_OFFSET,
      duration: isMobile ? 500 : ANIMATION_CONFIG.AOS_DURATION,
      easing: 'ease-out',
      disable: prefersReducedMotion ? true : (isMobile ? false : 'mobile')
    });

    return () => {
      AOS.refreshHard();
    };
  }, [isMobile, prefersReducedMotion, mounted]);

  const headerAnimationProps = useCallback(() => ({
    'data-aos': 'fade-down',
    'data-aos-duration': prefersReducedMotion ? 0 : 800
  }), [prefersReducedMotion]);

  const contentAnimationProps = useCallback((delay = 0) => ({
    'data-aos': 'fade-up',
    'data-aos-duration': prefersReducedMotion ? 0 : 800,
    'data-aos-delay': delay
  }), [prefersReducedMotion]);

  return (
    <section 
      id="contact" 
      className="min-h-screen py-8 lg:py-16 text-white overflow-hidden relative scroll-mt-16"
    >
      {/* ✅ OPTIMIZED: Enhanced Background */}
      <ContactBackground prefersReducedMotion={prefersReducedMotion} isMobile={isMobile} />
      
      <div className="relative z-10 px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-20">
        {/* Header Section */}
        <div className="text-center mb-8 sm:mb-12 lg:mb-16">
          <div className="inline-block relative group mb-6">
            <div className="absolute -inset-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full opacity-10 blur-xl group-hover:opacity-20 transition-opacity duration-500" />
            <h2
              {...headerAnimationProps()}
              className="relative text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-4"
            >
              Let's <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-rose-500">Connect</span>
            </h2>
          </div>
          <p
            {...contentAnimationProps(100)}
            className="text-gray-300 text-base sm:text-lg lg:text-xl max-w-2xl mx-auto leading-relaxed font-light"
          >
            Ready to bring your creative vision to life? Let's collaborate and create something extraordinary together.
          </p>
        </div>

        {/* Main Content */}
        <div className="flex justify-center">
          <div className="w-full max-w-4xl">
            <div
              className="bg-gray-900/60 backdrop-blur-2xl rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 lg:p-12 transform transition-all duration-500 border border-white/10 hover:border-purple-500/30 hover:shadow-2xl hover:shadow-purple-500/10 performance-layer"
              data-aos="zoom-in"
              data-aos-duration={prefersReducedMotion ? 0 : 1000}
            >
              {/* Header Icon & Title */}
              <div className="text-center mb-8 sm:mb-12">
                <HeaderIcon prefersReducedMotion={prefersReducedMotion} />
                <h2 
                  className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4 text-white"
                  {...contentAnimationProps(300)}
                >
                  Let's Create <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">Magic</span>
                </h2>
                <p 
                  className="text-gray-300 text-sm sm:text-base lg:text-lg max-w-xl mx-auto leading-relaxed font-light"
                  {...contentAnimationProps(400)}
                >
                  Passionate about transforming ideas into stunning visual experiences. 
                  Let's collaborate on your next design project.
                </p>
              </div>

              {/* Social Links Section */}
              <div className="text-center">
                <h3 
                  className="text-lg sm:text-xl lg:text-2xl font-semibold text-white mb-6 sm:mb-8 flex items-center justify-center gap-3"
                  {...contentAnimationProps(500)}
                >
                  <PulsingDots prefersReducedMotion={prefersReducedMotion} />
                </h3>
                
                <div 
                  {...contentAnimationProps(600)}
                >
                  <SocialLinks />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ✅ OPTIMIZED: Enhanced CSS animations */}
      <style>{`
        @keyframes contactGradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        @keyframes contactFloatSimple {
          0%, 100% { transform: translateY(0px) scale(1); opacity: 0.3; }
          50% { transform: translateY(-20px) scale(1.1); opacity: 0.6; }
        }
        
        @keyframes contactMessageSimple {
          0%, 100% { transform: translateY(0px) rotate(45deg) scale(1); opacity: 0.3; }
          50% { transform: translateY(-15px) rotate(45deg) scale(1.1); opacity: 0.7; }
        }
        
        @keyframes contactSparkleSimple {
          0%, 100% { opacity: 0; transform: scale(0); }
          50% { opacity: 1; transform: scale(1); }
        }

        .animate-pulse-custom {
          animation: pulse 2s infinite;
        }

        .animate-pulse-custom-delayed {
          animation: pulse 2s infinite 1s;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        .performance-layer {
          transform: translateZ(0);
          backface-visibility: hidden;
          perspective: 1000px;
          will-change: transform, opacity;
        }
        
        /* Reduced motion support */
        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </section>
  );
};

export default ContactPage;