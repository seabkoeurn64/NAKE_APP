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

  // ✅ NEW: Contact Background Component
  const ContactBackground = () => (
    <div className="absolute inset-0 overflow-hidden">
      {/* Main gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#030014] via-[#0f0a28] to-[#1a1039]" />
      
      {/* Animated gradient overlay */}
      <div 
        className="absolute inset-0 opacity-20"
        style={!prefersReducedMotion ? {
          background: 'linear-gradient(45deg, #6366f1, #8b5cf6, #a855f7, #ec4899)',
          backgroundSize: '400% 400%',
          animation: 'contactGradient 8s ease infinite'
        } : {}}
      />
      
      {/* Floating communication elements */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl" 
           style={!prefersReducedMotion ? { animation: 'contactFloat 6s ease-in-out infinite' } : {}} />
      <div className="absolute top-40 right-20 w-48 h-48 bg-pink-500/10 rounded-full blur-2xl" 
           style={!prefersReducedMotion ? { animation: 'contactFloat 8s ease-in-out infinite 1s' } : {}} />
      <div className="absolute bottom-32 left-1/4 w-56 h-56 bg-blue-500/10 rounded-full blur-3xl" 
           style={!prefersReducedMotion ? { animation: 'contactFloat 7s ease-in-out infinite 0.5s' } : {}} />
      <div className="absolute bottom-20 right-32 w-40 h-40 bg-indigo-500/10 rounded-full blur-2xl" 
           style={!prefersReducedMotion ? { animation: 'contactFloat 9s ease-in-out infinite 1.5s' } : {}} />
      
      {/* Message bubble shapes */}
      <div className="absolute top-1/3 left-20 w-16 h-16 bg-white/5 rounded-2xl rounded-bl-none blur-sm rotate-45" 
           style={!prefersReducedMotion ? { animation: 'contactMessage 4s ease-in-out infinite' } : {}} />
      <div className="absolute bottom-1/3 right-24 w-12 h-12 bg-purple-400/10 rounded-2xl rounded-br-none blur-sm -rotate-45" 
           style={!prefersReducedMotion ? { animation: 'contactMessage 5s ease-in-out infinite 0.8s' } : {}} />
      <div className="absolute top-1/2 right-40 w-10 h-10 bg-pink-400/10 rounded-2xl rounded-bl-none blur-sm rotate-12" 
           style={!prefersReducedMotion ? { animation: 'contactMessage 3.5s ease-in-out infinite 1.2s' } : {}} />
      
      {/* Connection lines */}
      <div className="absolute top-1/4 left-1/2 w-px h-32 bg-gradient-to-b from-purple-500/20 to-transparent" />
      <div className="absolute bottom-1/4 right-1/2 w-px h-24 bg-gradient-to-t from-pink-500/20 to-transparent" />
      
      {/* Grid pattern */}
      <div className="absolute inset-0 opacity-5">
        <div 
          className="w-full h-full"
          style={!prefersReducedMotion ? {
            backgroundImage: 'linear-gradient(#6366f1 1px, transparent 1px), linear-gradient(90deg, #6366f1 1px, transparent 1px)',
            backgroundSize: '50px 50px',
            animation: 'contactGridMove 25s linear infinite'
          } : {}}
        />
      </div>
      
      {/* Sparkle effects */}
      <div className="absolute top-1/4 left-1/3 w-2 h-2 bg-white rounded-full opacity-60" 
           style={!prefersReducedMotion ? { animation: 'contactSparkle 3s ease-in-out infinite' } : {}} />
      <div className="absolute top-1/3 right-1/4 w-1.5 h-1.5 bg-purple-300 rounded-full opacity-70" 
           style={!prefersReducedMotion ? { animation: 'contactSparkle 4s ease-in-out infinite 0.7s' } : {}} />
      <div className="absolute bottom-1/4 left-1/2 w-1 h-1 bg-blue-300 rounded-full opacity-80" 
           style={!prefersReducedMotion ? { animation: 'contactSparkle 3.5s ease-in-out infinite 1.2s' } : {}} />
    </div>
  );

  return (
    // ✅ UPDATED: New background design
    <section 
      id="contact" 
      className="min-h-screen py-8 lg:py-16 text-white overflow-hidden relative scroll-mt-16"
    >
      {/* ✅ NEW: Enhanced Background */}
      <ContactBackground />
      
      <div className="relative z-10 px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-20">
        {/* Header Section */}
        <div className="text-center mb-8 sm:mb-12 lg:mb-16">
          <div className="inline-block relative group mb-6">
            <div className="absolute -inset-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full opacity-10 blur-xl group-hover:opacity-20 transition-opacity duration-500" />
            <h2
              data-aos="fade-down"
              data-aos-duration={prefersReducedMotion ? 0 : 800}
              className="relative text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-4"
            >
              Let's <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-rose-500">Connect</span>
            </h2>
          </div>
          <p
            data-aos="fade-up"
            data-aos-duration={prefersReducedMotion ? 0 : 800}
            data-aos-delay="100"
            className="text-gray-300 text-base sm:text-lg lg:text-xl max-w-2xl mx-auto leading-relaxed font-light"
          >
            Ready to bring your creative vision to life? Let's collaborate and create something extraordinary together.
          </p>
        </div>

        {/* Main Content */}
        <div className="flex justify-center">
          <div className="w-full max-w-4xl">
            <div
              className="bg-gray-900/60 backdrop-blur-2xl rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 lg:p-12 transform transition-all duration-500 border border-white/10 hover:border-purple-500/30 hover:shadow-2xl hover:shadow-purple-500/10"
              data-aos="zoom-in"
              data-aos-duration={prefersReducedMotion ? 0 : 1000}
            >
              {/* Header Icon & Title */}
              <div className="text-center mb-8 sm:mb-12">
                <div 
                  className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl mb-4 sm:mb-6 shadow-lg transform transition-transform duration-300 hover:scale-110 group relative overflow-hidden"
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
                  Let's Create <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">Magic</span>
                </h2>
                <p 
                  className="text-gray-300 text-sm sm:text-base lg:text-lg max-w-xl mx-auto leading-relaxed font-light"
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
                    <div className="w-2 h-2 bg-purple-500 rounded-full" 
                         style={!prefersReducedMotion ? { animation: 'pulse 2s infinite' } : {}} />
                    Connect With Me
                    <div className="w-2 h-2 bg-pink-500 rounded-full" 
                         style={!prefersReducedMotion ? { animation: 'pulse 2s infinite 1s' } : {}} />
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

      {/* ✅ UPDATED: Enhanced CSS animations */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes contactGradient {
            0%, 100% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
          }
          
          @keyframes contactFloat {
            0%, 100% { transform: translateY(0px) rotate(0deg) scale(1); }
            33% { transform: translateY(-20px) rotate(120deg) scale(1.1); }
            66% { transform: translateY(10px) rotate(240deg) scale(0.9); }
          }
          
          @keyframes contactMessage {
            0%, 100% { transform: translateY(0px) rotate(45deg) scale(1); opacity: 0.3; }
            50% { transform: translateY(-15px) rotate(45deg) scale(1.2); opacity: 0.7; }
          }
          
          @keyframes contactGridMove {
            0% { transform: translate(0, 0); }
            100% { transform: translate(50px, 50px); }
          }
          
          @keyframes contactSparkle {
            0%, 100% { opacity: 0; transform: scale(0) rotate(0deg); }
            50% { opacity: 1; transform: scale(1) rotate(180deg); }
          }

          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
          
          /* Reduced motion support */
          @media (prefers-reduced-motion: reduce) {
            .contact-float-slow,
            .contact-gradient-slow,
            .contact-grid-move,
            .contact-message,
            .contact-sparkle,
            .animate-pulse {
              animation: none !important;
            }
            
            .transition-all,
            .transform {
              transition: none !important;
            }
            
            .hover\\:scale-110:hover,
            .group:hover .group-hover\\:translate-x-full {
              transform: none !important;
            }
          }
        `
      }} />
    </section>
  );
};

export default ContactPage;