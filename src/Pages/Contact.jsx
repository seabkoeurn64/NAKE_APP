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
    // ✅ FIXED: Added proper section structure and navbar padding
    <section 
      id="Contact" 
      className="min-h-screen py-8 lg:py-16 text-white overflow-hidden bg-gradient-to-br from-[#030014] via-[#0f0a28] to-[#030014] relative scroll-mt-16"
    >
      {/* Enhanced background decoration from About page */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-[#6366f1] rounded-full blur-3xl opacity-10 animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#a855f7] rounded-full blur-3xl opacity-5 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-56 h-56 bg-[#8b5cf6] rounded-full blur-2xl opacity-5 animate-pulse delay-500"></div>
        
        {/* Animated grid background from About page */}
        <div className="absolute inset-0 opacity-10">
          <div className="w-full h-full" style={{
            backgroundImage: `linear-gradient(#6366f1 1px, transparent 1px), linear-gradient(90deg, #6366f1 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
            animation: prefersReducedMotion ? 'none' : 'grid-move 20s linear infinite'
          }}></div>
        </div>
      </div>

      <div className="relative z-10 px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-20">
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
            className="text-gray-300 text-base sm:text-lg lg:text-xl max-w-2xl mx-auto leading-relaxed"
          >
            Ready to bring your creative vision to life? Let's collaborate and create something extraordinary together.
          </p>
        </div>

        {/* Main Content */}
        <div className="flex justify-center">
          <div className="w-full max-w-4xl">
            <div
              className="bg-gray-900/60 backdrop-blur-2xl rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 lg:p-12 transform transition-all duration-500 border border-white/10 hover:border-white/20 hover:shadow-2xl"
              data-aos="zoom-in"
              data-aos-duration={prefersReducedMotion ? 0 : 1000}
            >
              {/* Header Icon & Title */}
              <div className="text-center mb-8 sm:mb-12">
                <div 
                  className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-r from-[#6366f1] to-[#a855f7] rounded-2xl mb-4 sm:mb-6 shadow-lg transform transition-transform duration-300 hover:scale-110 group relative overflow-hidden"
                  data-aos="fade-down"
                  data-aos-duration={prefersReducedMotion ? 0 : 800}
                  data-aos-delay="200"
                >
                  {/* Shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 transition-all duration-1000 group-hover:translate-x-full"></div>
                  <MessageCircle className="w-6 h-6 sm:w-7 sm:h-7 text-white relative z-10" />
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
      </div>

      {/* Add CSS animations from About page */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-15px) rotate(180deg); }
          }
          @keyframes gradient-x {
            0%, 100% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
          }
          @keyframes grid-move {
            0% { transform: translate(0, 0); }
            100% { transform: translate(40px, 40px); }
          }
          .animation-delay-2000 {
            animation-delay: 2s;
          }
          
          /* Reduced motion support */
          @media (prefers-reduced-motion: reduce) {
            .animate-pulse,
            .animate-bounce,
            .animate-ping,
            .animate-spin {
              animation: none !important;
            }
            
            .transition-all,
            .transform {
              transition: none !important;
            }
            
            .hover\\:scale-110:hover {
              transform: none !important;
            }
          }
        `
      }} />
    </section>
  );
};

export default ContactPage;