import React, { useState, useEffect } from "react";
import SocialLinks from "../components/SocialLinks";
import AOS from "aos";
import "aos/dist/aos.css";
import { MessageCircle } from "lucide-react";

const ContactPage = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Check mobile device and reduced motion preference
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    const checkReducedMotion = () => {
      setPrefersReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    };

    checkMobile();
    checkReducedMotion();
    setMounted(true);

    let resizeTimeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(checkMobile, 100);
    };

    window.addEventListener('resize', handleResize);
    
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    mediaQuery.addEventListener('change', checkReducedMotion);

    return () => {
      window.removeEventListener('resize', handleResize);
      mediaQuery.removeEventListener('change', checkReducedMotion);
      clearTimeout(resizeTimeout);
    };
  }, []);

  // Optimized AOS initialization
  useEffect(() => {
    if (!mounted) return;

    AOS.init({
      once: true,
      offset: isMobile ? 20 : 40,
      duration: isMobile ? 500 : 700,
      easing: 'ease-out',
      disable: prefersReducedMotion ? true : (isMobile ? false : 'mobile')
    });

    return () => {
      AOS.refresh();
    };
  }, [isMobile, prefersReducedMotion, mounted]);

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-20" id="Contact">
      {/* Header Section */}
      <div className="text-center mb-8 sm:mb-12 lg:mb-16">
        <h2
          data-aos="fade-down"
          data-aos-duration={prefersReducedMotion ? 0 : 800}
          className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#6366f1] via-[#8b5cf6] to-[#a855f7] mb-4"
        >
          Let's Connect
        </h2>
        <p
          data-aos="fade-up"
          data-aos-duration={prefersReducedMotion ? 0 : 800}
          data-aos-delay="100"
          className="text-gray-400 text-base sm:text-lg lg:text-xl max-w-2xl mx-auto leading-relaxed"
        >
          Ready to bring your creative vision to life? Let's collaborate and create something extraordinary together.
        </p>
      </div>

      {/* Main Content */}
      <div className="flex justify-center">
        <div className="w-full max-w-4xl">
          <div
            className="bg-gradient-to-br from-gray-900/60 to-gray-800/40 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 lg:p-12 transform transition-all duration-500 border border-white/10 hover:border-white/20"
            data-aos="zoom-in"
            data-aos-duration={prefersReducedMotion ? 0 : 1000}
            style={{
              backdropFilter: isMobile ? 'blur(12px)' : 'blur(20px)',
            }}
          >
            {/* Header Icon & Title */}
            <div className="text-center mb-8 sm:mb-12">
              <div 
                className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-r from-[#6366f1] to-[#a855f7] rounded-2xl mb-4 sm:mb-6 shadow-lg transform transition-transform duration-300 hover:scale-110"
                data-aos="fade-down"
                data-aos-duration={prefersReducedMotion ? 0 : 800}
                data-aos-delay="200"
              >
                <MessageCircle className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
              </div>
              <h2 
                className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4 text-white"
                data-aos="fade-up"
                data-aos-duration={prefersReducedMotion ? 0 : 800}
                data-aos-delay="300"
              >
                Let's Create <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6366f1] to-[#a855f7]">Magic</span>
              </h2>
              <p 
                className="text-gray-300 text-sm sm:text-base lg:text-lg max-w-xl mx-auto leading-relaxed"
                data-aos="fade-up"
                data-aos-duration={prefersReducedMotion ? 0 : 800}
                data-aos-delay="400"
              >
                Passionate about transforming ideas into stunning visual experiences. 
                Let's collaborate on your next design project.
              </p>
            </div>

            {/* Social Links Section */}
            <div className="text-center">
              <h3 
                className="text-lg sm:text-xl lg:text-2xl font-semibold text-white mb-6 sm:mb-8 flex items-center justify-center gap-3"
                data-aos="fade-up"
                data-aos-duration={prefersReducedMotion ? 0 : 800}
                data-aos-delay="500"
              >
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-[#6366f1] rounded-full animate-pulse"></div>
                  Connect With Me
                  <div className="w-2 h-2 bg-[#a855f7] rounded-full animate-pulse"></div>
                </div>
              </h3>
              
              <div 
                className="flex justify-center"
                data-aos="fade-up"
                data-aos-duration={prefersReducedMotion ? 0 : 800}
                data-aos-delay="600"
              >
                <SocialLinks />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Background Elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 sm:w-64 sm:h-64 bg-[#6366f1] rounded-full blur-3xl opacity-5 animate-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-40 h-40 sm:w-80 sm:h-80 bg-[#a855f7] rounded-full blur-3xl opacity-5 animate-float" style={{animationDelay: '2s'}}></div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-10px) scale(1.05); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        @media (prefers-reduced-motion: reduce) {
          .animate-float {
            animation: none;
          }
        }
        
        /* Mobile optimizations */
        @media (max-width: 768px) {
          .backdrop-blur-xl {
            backdrop-filter: blur(12px);
          }
        }
      `}</style>
    </div>
  );
};

export default ContactPage;