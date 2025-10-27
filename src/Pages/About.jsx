// src/Pages/About.jsx - FIXED FOR NAVBAR
import React, { useEffect, memo, useMemo, useState, useCallback, useRef } from "react";
import { Code, Award, Globe, ArrowUpRight, Sparkles, UserCheck, Download, Eye, Star, Zap, Heart } from "lucide-react";

// Constants
const STATS_CONFIG = {
  COUNT_DURATION: 1500,
  COUNT_STEPS: 60,
  DELAY_BETWEEN_CARDS: 200,
  ANIMATION_DELAYS: {
    HEADER: 100,
    PROFILE: 200,
    CONTENT: 300,
    BUTTONS: 500,
    STATS: 600
  }
};

// Memoized Components
const Header = memo(() => (
  <div className="text-center mb-8 lg:mb-12 px-4">
    <div className="inline-block relative group mb-4">
      <div className="absolute -inset-3 bg-gradient-to-r from-[#6366f1] to-[#a855f7] rounded-full opacity-10 blur-xl group-hover:opacity-20 transition-opacity duration-500"></div>
      <h2 className="relative text-3xl lg:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#6366f1] via-[#8b5cf6] to-[#a855f7] tracking-tight">
        About Me
      </h2>
    </div>
    <p className="text-lg lg:text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed font-light">
      Crafting <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6366f1] to-[#a855f7] font-semibold">digital experiences</span> that blend aesthetics with functionality
    </p>
  </div>
));

const ProfileImage = memo(() => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleMouseEnter = useCallback(() => setIsHovered(true), []);
  const handleMouseLeave = useCallback(() => setIsHovered(false), []);
  const handleImageLoad = useCallback(() => setImageLoaded(true), []);
  const handleImageError = useCallback(() => setImageError(true), []);

  return (
    <div className="flex justify-center items-center p-4 lg:p-8">
      <div 
        className="relative group cursor-pointer"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Floating animation */}
        <div 
          className="absolute -inset-6 bg-gradient-to-r from-[#6366f1] to-[#a855f7] rounded-full opacity-10 blur-2xl"
          style={{ animation: 'aboutFloat 6s ease-in-out infinite' }}
        ></div>

        {/* Animated stars */}
        <div className="absolute -top-4 -right-4">
          <Star className="w-5 h-5 text-yellow-400 fill-current" style={{ animation: 'bounce 2s infinite' }} />
        </div>
        <div className="absolute -bottom-4 -left-4">
          <Zap className="w-4 h-4 text-blue-400" style={{ animation: 'pulse 2s infinite' }} />
        </div>

        <div className="relative">
          <div className="relative w-64 h-64 lg:w-80 lg:h-80 xl:w-96 xl:h-96 rounded-2xl overflow-hidden shadow-2xl transform transition-all duration-700 group-hover:scale-105 group-hover:rotate-1">
            {/* Gradient border with animation */}
            <div 
              className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#6366f1] via-[#8b5cf6] to-[#a855f7] p-1"
              style={{ 
                backgroundSize: '200% 200%',
                animation: 'aboutGradient 3s ease infinite'
              }}
            >
              <div className="w-full h-full rounded-2xl bg-[#030014] relative overflow-hidden">
                {/* Image with enhanced hover effects and error handling */}
                {!imageError ? (
                  <img
                    src="/images/Cover.png"
                    alt="Koeurn - Graphic Designer"
                    className={`w-full h-full object-cover transform transition-all duration-700 group-hover:scale-110 ${
                      imageLoaded ? 'opacity-100' : 'opacity-0'
                    }`}
                    onLoad={handleImageLoad}
                    onError={handleImageError}
                    loading="lazy"
                    width={384}
                    height={384}
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                    <div className="text-center p-6">
                      <UserCheck className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-300 text-base">Profile Image</p>
                      <p className="text-gray-500 text-sm">Koeurn - Graphic Designer</p>
                    </div>
                  </div>
                )}
                
                {/* Loading state */}
                {!imageLoaded && !imageError && (
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                    <div className="relative">
                      <UserCheck className="w-12 h-12 text-gray-600" style={{ animation: 'ping 1s infinite' }} />
                      <UserCheck className="w-12 h-12 text-gray-400 absolute top-0" />
                    </div>
                  </div>
                )}
                
                {/* Enhanced overlay effects */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#030014] via-transparent to-transparent opacity-70"></div>
                <div className={`absolute inset-0 bg-gradient-to-br from-[#6366f1]/30 to-[#a855f7]/30 transition-all duration-500 ${
                  isHovered ? 'opacity-100 backdrop-blur-sm' : 'opacity-0'
                }`}></div>
                
                {/* Shine effect on hover */}
                <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 transition-all duration-1000 ${
                  isHovered ? 'translate-x-full' : '-translate-x-full'
                }`}></div>
              </div>
            </div>
          </div>
          
          {/* Enhanced status badge */}
          <div className="absolute -bottom-3 -right-3 bg-gradient-to-r from-[#6366f1] to-[#a855f7] rounded-xl p-3 shadow-2xl transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-6" style={{
            boxShadow: '0 0 20px rgba(168, 85, 247, 0.5)'
          }}>
            <div className="flex items-center gap-2 text-white text-sm font-semibold">
              <div className="relative">
                <UserCheck className="w-4 h-4" style={{ animation: 'pulse 2s infinite' }} />
                <div className="absolute top-0 left-0 w-1.5 h-1.5 bg-green-400 rounded-full" style={{ animation: 'ping 1s infinite' }}></div>
              </div>
              <span>Available</span>
            </div>
          </div>

          {/* Floating elements */}
          <div className="absolute -top-1 -left-1 w-3 h-3 bg-purple-500 rounded-full opacity-60" style={{ animation: 'bounce 2s infinite' }}></div>
          <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-pink-500 rounded-full opacity-60" style={{ animation: 'bounce 2s infinite 0.3s' }}></div>
        </div>
      </div>
    </div>
  );
});

const StatCard = memo(({ icon: Icon, color, value, label, description, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [count, setCount] = useState(0);
  const [localMounted, setLocalMounted] = useState(false);
  const animationRef = useRef();

  useEffect(() => {
    setLocalMounted(true);
  }, []);

  useEffect(() => {
    if (localMounted && value > 0) {
      const timer = setTimeout(() => {
        let startTime = null;
        const duration = STATS_CONFIG.COUNT_DURATION;
        
        const animateCount = (currentTime) => {
          if (!startTime) startTime = currentTime;
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          
          const easedProgress = 1 - Math.pow(1 - progress, 3);
          setCount(Math.floor(value * easedProgress));
          
          if (progress < 1) {
            animationRef.current = requestAnimationFrame(animateCount);
          } else {
            setCount(value);
          }
        };
        
        animationRef.current = requestAnimationFrame(animateCount);
      }, index * STATS_CONFIG.DELAY_BETWEEN_CARDS);
      
      return () => {
        clearTimeout(timer);
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
      };
    }
  }, [value, index, localMounted]);

  const handleMouseEnter = useCallback(() => setIsHovered(true), []);
  const handleMouseLeave = useCallback(() => setIsHovered(false), []);

  return (
    <div 
      className="relative group cursor-pointer"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Hover glow effect */}
      <div className={`absolute -inset-1 bg-gradient-to-br ${color} rounded-xl blur opacity-0 group-hover:opacity-30 transition-all duration-500`}></div>
      
      <div className="relative z-10 bg-gray-900/80 backdrop-blur-2xl rounded-xl p-6 border border-white/10 overflow-hidden transition-all duration-500 hover:scale-105 h-full flex flex-col justify-between group-hover:border-white/20">
        {/* Animated background */}
        <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>

        {/* Floating particles */}
        <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-white rounded-full opacity-0 group-hover:opacity-40" style={{ animation: 'ping 1s infinite' }}></div>

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br ${color} shadow-xl transform transition-all duration-300 group-hover:rotate-12 group-hover:scale-110 relative overflow-hidden`}>
              <Icon className="w-6 h-6 text-white relative z-10" />
              {/* Icon shine effect */}
              <div className={`absolute inset-0 bg-white/20 transform -skew-x-12 transition-all duration-1000 ${
                isHovered ? 'translate-x-full' : '-translate-x-full'
              }`}></div>
            </div>
            <span className="text-2xl lg:text-3xl font-bold text-white drop-shadow-lg bg-gradient-to-br from-white to-gray-300 bg-clip-text text-transparent">
              {count}+
            </span>
          </div>

          <div>
            <p className="text-sm uppercase tracking-widest text-gray-300 mb-3 font-semibold" style={{
              letterSpacing: '0.1em'
            }}>
              {label}
            </p>
            <div className="flex items-center justify-between">
              <p className="text-base text-gray-400 leading-relaxed font-light">
                {description}
              </p>
              <ArrowUpRight className={`w-5 h-5 transition-all duration-300 flex-shrink-0 ml-3 transform ${
                isHovered ? 'text-white translate-x-0.5 -translate-y-0.5 scale-110' : 'text-white/60'
              }`} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

// Optimized button components
const DownloadCVButton = memo(({ onClick }) => (
  <button 
    onClick={onClick}
    className="group relative px-5 py-3.5 rounded-xl bg-gradient-to-r from-[#6366f1] to-[#a855f7] text-white font-semibold text-base transition-all duration-500 hover:scale-105 active:scale-95 flex items-center justify-center gap-3 shadow-xl overflow-hidden hover:shadow-2xl w-full sm:w-auto sm:flex-1"
    style={{
      boxShadow: '0 0 20px rgba(168, 85, 247, 0.5)'
    }}
  >
    {/* Button shine effect */}
    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 transition-all duration-1000 group-hover:translate-x-full"></div>
    
    <Download className="w-4 h-4 sm:w-5 sm:h-5 group-hover:animate-bounce relative z-10 flex-shrink-0" />
    <span className="relative z-10 font-semibold whitespace-nowrap">Download CV</span>
    
    {/* Floating hearts */}
    <Heart className="absolute -top-1 -right-1 w-2 h-2 sm:w-3 sm:h-3 text-pink-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ animation: 'bounce 2s infinite' }} />
  </button>
));

const ViewWorkButton = memo(({ onClick }) => (
  <button 
    onClick={onClick}
    className="group relative px-5 py-3.5 rounded-xl border-2 border-[#a855f7] text-[#a855f7] font-semibold text-base transition-all duration-500 hover:scale-105 active:scale-95 flex items-center justify-center gap-3 hover:bg-[#a855f7]/10 overflow-hidden cursor-pointer hover:shadow-xl w-full sm:w-auto sm:flex-1"
  >
    {/* Hover background */}
    <div className="absolute inset-0 bg-gradient-to-r from-[#a855f7] to-[#ec4899] opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>
    
    <Eye className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform duration-300 relative z-10 flex-shrink-0" />
    <span className="relative z-10 font-semibold whitespace-nowrap">View Work</span>
    
    {/* Border animation */}
    <div className="absolute inset-0 rounded-xl border-2 border-transparent bg-gradient-to-r from-[#6366f1] via-[#a855f7] to-[#ec4899] bg-clip-border opacity-0 group-hover:opacity-100 transition-opacity duration-500 -m-0.5"></div>
  </button>
));

const AboutPage = () => {
  const [mounted, setMounted] = useState(false);
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const scrollThrottleRef = useRef();

  useEffect(() => {
    setMounted(true);
    
    // Check for reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReducedMotion(mediaQuery.matches);
    
    // Add throttled scroll listener for section tracking
    const handleScroll = () => {
      if (scrollThrottleRef.current) return;
      
      scrollThrottleRef.current = requestAnimationFrame(() => {
        scrollThrottleRef.current = null;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollThrottleRef.current) {
        cancelAnimationFrame(scrollThrottleRef.current);
      }
    };
  }, []);

  // Memoized calculations
  const { totalProjects, totalCertificates, YearExperience } = useMemo(() => {
    if (!mounted) return { totalProjects: 0, totalCertificates: 0, YearExperience: 0 };
    
    try {
      let storedProjects = [];
      let storedCertificates = [];
      
      try {
        storedProjects = JSON.parse(localStorage.getItem("projects") || "[]");
        storedCertificates = JSON.parse(localStorage.getItem("certificates") || "[]");
      } catch (storageError) {
        console.warn("LocalStorage access failed:", storageError);
        storedProjects = [];
        storedCertificates = [];
      }
      
      // Experience calculation
      let experience = 0;
      try {
        const startDate = new Date("2024-11-06");
        const today = new Date();
        experience = today.getFullYear() - startDate.getFullYear();
        
        if (today.getMonth() < startDate.getMonth() || 
            (today.getMonth() === startDate.getMonth() && today.getDate() < startDate.getDate())) {
          experience--;
        }
      } catch (dateError) {
        console.warn("Date calculation failed, using fallback experience:", dateError);
        experience = 1;
      }

      return {
        totalProjects: storedProjects?.length || 6,
        totalCertificates: storedCertificates?.length || 3,
        YearExperience: Math.max(experience, 1)
      };
    } catch (error) {
      console.error("Error calculating stats:", error);
      return {
        totalProjects: 6,
        totalCertificates: 3,
        YearExperience: 1
      };
    }
  }, [mounted]);

  // Memoized stats data
  const statsData = useMemo(() => [
    {
      icon: Code,
      color: "from-[#6366f1] to-[#8b5cf6]",
      value: totalProjects,
      label: "Projects",
      description: "Successful designs"
    },
    {
      icon: Award,
      color: "from-[#a855f7] to-[#ec4899]",
      value: totalCertificates,
      label: "Certificates",
      description: "Achievements earned"
    },
    {
      icon: Globe,
      color: "from-[#8b5cf6] to-[#6366f1]",
      value: YearExperience,
      label: "Years Exp",
      description: "Design excellence"
    },
  ], [totalProjects, totalCertificates, YearExperience]);

  const handleViewWork = useCallback(() => {
    const portfolioSection = document.getElementById('Portfolio');
    if (portfolioSection) {
      portfolioSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  }, []);

  const handleDownloadCV = useCallback((e) => {
    e.preventDefault();
    try {
      console.log('CV download initiated');
      window.open("https://drive.google.com/file/d/1qJ7awhiMQMHxmhZu5D8ySG3DvtQx_yLK/view?usp=drive_link", '_blank', 'noopener,noreferrer');
    } catch (error) {
      console.error('Failed to open CV link:', error);
    }
  }, []);

  // Memoized background elements
  const backgroundElements = useMemo(() => (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-[#6366f1] rounded-full blur-3xl opacity-10" style={{ animation: 'pulse 4s infinite' }}></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#a855f7] rounded-full blur-3xl opacity-5" style={{ animation: 'pulse 4s infinite 1s' }}></div>
      <div className="absolute top-1/2 left-1/2 w-56 h-56 bg-[#8b5cf6] rounded-full blur-2xl opacity-5" style={{ animation: 'pulse 4s infinite 0.5s' }}></div>
      
      {/* Animated grid background with reduced motion support */}
      <div className="absolute inset-0 opacity-10">
        <div 
          className="w-full h-full"
          style={!isReducedMotion ? {
            backgroundImage: 'linear-gradient(#6366f1 1px, transparent 1px), linear-gradient(90deg, #6366f1 1px, transparent 1px)',
            backgroundSize: '40px 40px',
            animation: 'aboutGridMove 20s linear infinite'
          } : {}}
        ></div>
      </div>
    </div>
  ), [isReducedMotion]);

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#030014] via-[#0f0a28] to-[#030014]">
        <div className="text-center">
          <div className="relative">
            <div className="w-12 h-12 border-3 border-[#6366f1] border-t-transparent rounded-full" style={{ animation: 'spin 1s linear infinite' }}></div>
            <div className="absolute top-0 left-0 w-12 h-12 border-3 border-[#a855f7] border-b-transparent rounded-full" style={{ animation: 'spin 1s linear infinite', opacity: '0.5' }}></div>
          </div>
          <p className="mt-3 text-gray-300 text-sm">Loading portfolio...</p>
        </div>
      </div>
    );
  }

  return (
    // ✅ FIXED: Added proper section structure and navbar padding
    <section 
      id="About" 
      className="min-h-screen py-8 lg:py-16 text-white overflow-hidden bg-gradient-to-br from-[#030014] via-[#0f0a28] to-[#030014] relative scroll-mt-16"
    >
      {backgroundElements}

      <div className="relative z-10 container mx-auto px-4 lg:px-8 xl:px-16">
        {/* Header Section */}
        <Header />

        {/* Main Content */}
        <div className="w-full max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 xl:gap-16 items-center justify-between">
            
            {/* Left Side - Content */}
            <div className="w-full lg:w-1/2 space-y-6 lg:space-y-8 text-center lg:text-left order-2 lg:order-1">
              <div>
                <h1 className="text-3xl lg:text-5xl xl:text-6xl font-bold mb-4 tracking-tight">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300 block leading-tight">
                    Koeurn
                  </span>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6366f1] via-[#8b5cf6] to-[#a855f7] block mt-2 leading-tight text-2xl lg:text-4xl xl:text-5xl">
                    Graphic Designer
                  </span>
                </h1>
              </div>
              
              <p className="text-lg lg:text-xl text-gray-300 leading-relaxed font-light">
                Passionate about creating <span className="text-white font-semibold bg-gradient-to-r from-[#6366f1] to-[#a855f7] bg-clip-text text-transparent">user-centered designs</span> that blend aesthetics with functionality.
              </p>

              {/* Description section */}
              <div className="bg-gray-900/60 backdrop-blur-2xl rounded-xl p-6 border border-white/10 hover:border-white/20 transition-all duration-500 hover:shadow-xl group cursor-pointer">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center justify-center lg:justify-start gap-2">
                  <Sparkles className="w-5 h-5 text-[#a855f7] group-hover:rotate-180 transition-transform duration-500" />
                  My Approach
                </h3>
                <p className="text-base text-gray-300 leading-relaxed font-light">
                  I craft <span className="text-white font-medium">user-focused designs</span> that captivate and communicate effectively. With attention to detail and creative problem-solving, I transform ideas into visually compelling experiences.
                </p>
              </div>

              {/* Enhanced CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full">
                <DownloadCVButton onClick={handleDownloadCV} />
                <ViewWorkButton onClick={handleViewWork} />
              </div>
            </div>

            {/* Right Side - Profile Image */}
            <div className="w-full lg:w-1/2 flex justify-center order-1 lg:order-2">
              <ProfileImage />
            </div>
          </div>

          {/* Stats Section */}
          <div className="mt-16 lg:mt-20">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
              {statsData.map((stat, index) => (
                <StatCard 
                  key={`stat-${index}`} 
                  {...stat}
                  index={index}
                />
              ))}
            </div>
          </div>

          {/* Additional Info Section */}
          <div className="mt-16 lg:mt-20 grid grid-cols-1 xl:grid-cols-2 gap-8">
            <div className="bg-gray-900/60 backdrop-blur-2xl rounded-xl p-6 border border-white/10 hover:border-white/20 transition-all duration-500 hover:shadow-xl group cursor-pointer">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#6366f1] group-hover:rotate-180 transition-transform duration-500" />
                Design Philosophy
              </h3>
              <p className="text-base text-gray-300 leading-relaxed font-light">
                I believe in creating designs that not only look beautiful but also serve a purpose. Every element should have intention, and every design should tell a story.
              </p>
            </div>
            
            <div className="bg-gray-900/60 backdrop-blur-2xl rounded-xl p-6 border border-white/10 hover:border-white/20 transition-all duration-500 hover:shadow-xl group cursor-pointer">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#a855f7] group-hover:scale-110 transition-transform duration-500" />
                What I Offer
              </h3>
              <p className="text-base text-gray-300 leading-relaxed font-light">
                From branding and visual identity to digital graphics, I deliver comprehensive design solutions that elevate brands and engage target audiences.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ✅ FIXED: Move inline styles to regular style tag to avoid jsx prop warning */}
      <style>
        {`
          @keyframes aboutFloat {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-15px) rotate(180deg); }
          }
          
          @keyframes aboutGradient {
            0%, 100% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
          }
          
          @keyframes aboutGridMove {
            0% { transform: translate(0, 0); }
            100% { transform: translate(40px, 40px); }
          }

          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }

          @keyframes ping {
            0% { transform: scale(1); opacity: 1; }
            75%, 100% { transform: scale(2); opacity: 0; }
          }

          @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
          }

          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
          
          /* Reduced motion support */
          @media (prefers-reduced-motion: reduce) {
            .about-float-slow,
            .about-gradient-slow,
            .about-grid-move,
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
            
            .group-hover\\:scale-105:hover,
            .group-hover\\:rotate-12:hover,
            .group-hover\\:rotate-180:hover,
            .group-hover\\:scale-110:hover {
              transform: none !important;
            }
          }
        `}
      </style>
    </section>
  );
};

export default memo(AboutPage);