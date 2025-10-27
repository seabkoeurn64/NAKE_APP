// src/Pages/Portofolio.jsx
import React, { useEffect, useState, useCallback, memo, useMemo, useRef } from "react";
import { useTheme } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import { X, Github, Linkedin, Mail, ExternalLink, Sparkles } from "lucide-react";
import AOS from "aos";
import "aos/dist/aos.css";

// Import components
import CardProject from "../components/CardProject";
import PortfolioLoading from "../components/LoadingScreen";
import { PortfolioErrorBoundary, ToggleButton, LoadingSpinner } from "../components/PortfolioComponents";
import { useProjects } from "../hooks/usePreload";

// Enhanced media queries hook (same as Home.jsx)
const useMediaQueries = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [breakpoint, setBreakpoint] = useState('mobile');

  useEffect(() => {
    if (typeof window === 'undefined') return;

    let animationFrameId;

    const updateBreakpoint = () => {
      const width = window.innerWidth;
      const mobile = width < 768;
      const tablet = width >= 768 && width < 1024;
      
      setIsMobile(mobile);
      setIsTablet(tablet);
      
      if (mobile) setBreakpoint('mobile');
      else if (tablet) setBreakpoint('tablet');
      else setBreakpoint('desktop');
    };

    const checkReducedMotion = () => 
      setPrefersReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    
    const throttledResize = () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      animationFrameId = requestAnimationFrame(updateBreakpoint);
    };
    
    updateBreakpoint();
    checkReducedMotion();
    
    window.addEventListener('resize', throttledResize, { passive: true });
    
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    mediaQuery.addEventListener('change', checkReducedMotion);
    
    return () => {
      window.removeEventListener('resize', throttledResize);
      mediaQuery.removeEventListener('change', checkReducedMotion);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return { isMobile, isTablet, prefersReducedMotion, breakpoint };
};

// TabPanel Component
function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`portfolio-tabpanel-${index}`}
      aria-labelledby={`portfolio-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `portfolio-tab-${index}`,
    'aria-controls': `portfolio-tabpanel-${index}`,
  };
}

// Enhanced Animated Image Modal Component with Home.jsx effects
const ImageModal = memo(({ image, title, isOpen, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  const modalRef = useRef();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setTimeout(() => setIsVisible(true), 50);
    } else {
      setIsVisible(false);
      setTimeout(() => {
        document.body.style.overflow = 'unset';
      }, 500);
    }
  }, [isOpen]);

  const handleBackdropClick = useCallback((e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      onClose();
    }
  }, [onClose]);

  if (!isOpen || !image) return null;

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-500 backdrop-blur-sm ${
        isVisible ? 'opacity-100 bg-black/90' : 'opacity-0 bg-black/0'
      }`}
      onClick={handleBackdropClick}
    >
      {/* Animated Background Glow */}
      <div className={`absolute inset-0 transition-all duration-700 ${
        isVisible ? 'opacity-40' : 'opacity-0'
      }`}>
        <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-[#6366f1] rounded-full blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#a855f7] rounded-full blur-3xl opacity-10 animate-pulse delay-1000"></div>
      </div>
      
      <div 
        ref={modalRef}
        className={`relative max-w-6xl max-h-full w-full transform transition-all duration-500 ${
          isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Enhanced Close Button with Home.jsx styling */}
        <button
          onClick={onClose}
          className="group absolute -top-16 right-0 z-10 p-3 rounded-xl bg-black/50 backdrop-blur-sm border border-white/20 transition-all duration-300 hover:scale-110 hover:bg-black/70 hover:shadow-lg mobile-touch"
          aria-label="Close modal"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#6366f1] to-[#a855f7] rounded-xl blur opacity-15 group-hover:opacity-25 transition duration-200"></div>
          <X className="relative w-6 h-6 text-white/80 group-hover:text-white transition-colors" />
        </button>
        
        {/* Enhanced Image Container with Home.jsx effects */}
        <div className="relative bg-gradient-to-br from-slate-900/90 to-slate-800/90 rounded-2xl overflow-hidden shadow-2xl border border-white/10 backdrop-blur-xl transform transition-all duration-700 hover:shadow-2xl performance-optimized">
          <img
            src={image}
            alt={`Full size: ${title}`}
            className="w-full h-auto max-h-[80vh] object-contain transform transition-all duration-1000 hover:scale-105"
            draggable={false}
          />

          {/* Enhanced Animated Title with gradient effects */}
          {title && (
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-6 transform transition-all duration-500 group">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent animate-pulse">
                {title}
              </h3>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

ImageModal.displayName = 'ImageModal';

// Enhanced Status Badge Component (from Home.jsx)
const PortfolioBadge = memo(() => (
  <div className="inline-block animate-float mx-auto" data-aos="zoom-in" data-aos-delay="200">
    <div className="relative group">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-[#6366f1] to-[#a855f7] rounded-full blur opacity-20 group-hover:opacity-30 transition duration-500"></div>
      <div className="relative px-4 py-2 rounded-full bg-black/40 backdrop-blur-xl border border-white/10">
        <span className="bg-gradient-to-r from-[#6366f1] to-[#a855f7] text-transparent bg-clip-text text-sm font-medium flex items-center">
          <Sparkles className="w-4 h-4 mr-2 text-blue-400" />
          Creative Portfolio
        </span>
      </div>
    </div>
  </div>
));

// Enhanced CTA Button Component (from Home.jsx)
const PortfolioCTAButton = memo(({ href, text, icon: Icon }) => (
  <a href={href} className="block">
    <button className="group relative w-[140px] mobile-touch active:scale-95">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-[#4f52c9] to-[#8644c5] rounded-xl opacity-40 blur group-hover:opacity-70 transition-all duration-500"></div>
      <div className="relative h-10 bg-[#030014] backdrop-blur-xl rounded-lg border border-white/10 leading-none overflow-hidden">
        <div className="absolute inset-0 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300 bg-gradient-to-r from-[#4f52c9]/20 to-[#8644c5]/20"></div>
        <span className="absolute inset-0 flex items-center justify-center gap-1.5 text-xs group-hover:gap-2 transition-all duration-200">
          <span className="bg-gradient-to-r from-gray-200 to-white bg-clip-text text-transparent font-medium z-10">
            {text}
          </span>
          <Icon className={`w-3 h-3 text-gray-200 ${text === 'Contact' ? 'group-hover:translate-x-0.5' : 'group-hover:rotate-45'} transform transition-all duration-200 z-10`} />
        </span>
      </div>
    </button>
  </a>
));

// Main Portfolio Component with Home.jsx effects
const Portfolio = memo(() => {
  const theme = useTheme();
  const [value, setValue] = useState(0);
  const [showAllProjects, setShowAllProjects] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const { isMobile, isTablet, prefersReducedMotion } = useMediaQueries();
  const { projects, loading, error } = useProjects();

  useEffect(() => {
    if (prefersReducedMotion) return;

    let timeoutId;

    const initAOS = () => {
      AOS.init({
        once: true,
        offset: isMobile ? 10 : 50,
        duration: isMobile ? 300 : 800,
        easing: 'ease-out',
        disable: isMobile ? false : 'mobile',
      });
    };

    timeoutId = setTimeout(initAOS, 50);
    
    return () => {
      clearTimeout(timeoutId);
      AOS.refresh();
    };
  }, [isMobile, prefersReducedMotion]);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const handleChange = useCallback((event, newValue) => {
    setValue(newValue);
  }, []);

  const toggleShowMore = useCallback(() => {
    setShowAllProjects(prev => !prev);
  }, []);

  const handleImageClick = useCallback((image, title) => {
    if (image) {
      setSelectedImage({ image, title });
    }
  }, []);

  const closeImageModal = useCallback(() => {
    setSelectedImage(null);
  }, []);

  const initialItems = useMemo(() => isMobile ? 4 : 6, [isMobile]);
  const displayedProjects = useMemo(() => 
    showAllProjects ? projects : projects.slice(0, initialItems),
    [showAllProjects, projects, initialItems]
  );

  // Enhanced background elements (from Home.jsx)
  const backgroundElements = useMemo(() => (
    <div className="absolute inset-0 overflow-hidden">
      {/* Reduced background elements on mobile */}
      {!isMobile && (
        <>
          <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-[#6366f1] rounded-full blur-3xl opacity-10 animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#a855f7] rounded-full blur-3xl opacity-5 animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 w-56 h-56 bg-[#8b5cf6] rounded-full blur-2xl opacity-5 animate-pulse delay-500"></div>
        </>
      )}
      
      {/* Simplified grid for mobile */}
      <div className="absolute inset-0 opacity-10">
        <div className="w-full h-full" style={{
          backgroundImage: `linear-gradient(#6366f1 1px, transparent 1px), linear-gradient(90deg, #6366f1 1px, transparent 1px)`,
          backgroundSize: isMobile ? '20px 20px' : '40px 40px',
          animation: !prefersReducedMotion ? 'grid-move 20s linear infinite' : 'none'
        }}></div>
      </div>
    </div>
  ), [isMobile, prefersReducedMotion]);

  if (loading) {
    return <PortfolioLoading />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#030014] via-[#0f0a28] to-[#030014]">
        <div className="text-center p-8 max-w-md bg-black/40 backdrop-blur-xl rounded-2xl border border-white/10 transform transition-all duration-500 hover:scale-105">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-500/30 animate-pulse">
            <X className="w-8 h-8 text-red-400" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2 animate-pulse">Failed to load</h3>
          <p className="text-gray-300 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-gradient-to-r from-[#6366f1] to-[#a855f7] hover:from-[#4f52c9] hover:to-[#8644c5] text-white rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg mobile-touch"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <PortfolioErrorBoundary>
      <div className={`min-h-screen py-8 lg:py-16 bg-gradient-to-br from-[#030014] via-[#0f0a28] to-[#030014] relative overflow-hidden transition-all duration-500 ${isLoaded ? "opacity-100" : "opacity-0"}`} id="portfolio">
        {backgroundElements}

        <div className="relative z-10 container mx-auto px-4 sm:px-6">
          {/* Enhanced Animated Header with Home.jsx styling */}
          <div className="text-center mb-12" data-aos="fade-down" data-aos-duration="1000">
            <PortfolioBadge />
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mt-4">
              <span className="relative inline-block">
                <span className="absolute -inset-1 bg-gradient-to-r from-[#6366f1] to-[#a855f7] blur-lg sm:blur-xl opacity-20"></span>
                <span className="relative bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent">
                  Design
                </span>
              </span>
              <br />
              <span className="relative inline-block mt-1">
                <span className="absolute -inset-1 bg-gradient-to-r from-[#6366f1] to-[#a855f7] blur-lg sm:blur-xl opacity-20"></span>
                <span className="relative bg-gradient-to-r from-[#6366f1] to-[#a855f7] bg-clip-text text-transparent">
                  Portfolio
                </span>
              </span>
            </h2>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto mt-4 transform transition-all duration-500 hover:scale-105">
              Professional design projects with creative excellence and innovative solutions
            </p>
          </div>

          <Box sx={{ width: "100%" }}>
            {/* Enhanced Projects Grid with Home.jsx animations */}
            <TabPanel value={value} index={0} dir={theme.direction}>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8">
                {displayedProjects.map((project, index) => (
                  <div 
                    key={project.id}
                    data-aos={prefersReducedMotion ? "fade-up" : "fade-up"}
                    data-aos-duration={prefersReducedMotion ? 0 : 800}
                    data-aos-delay={prefersReducedMotion ? 0 : (index % 3) * 100}
                    className="transform transition-all duration-500 hover:-translate-y-2 performance-optimized"
                  >
                    <CardProject 
                      {...project}
                      onImageClick={handleImageClick}
                    />
                  </div>
                ))}
              </div>

              {/* Enhanced Animated Show More Button */}
              {projects.length > initialItems && (
                <div className="flex justify-center mt-12" data-aos="fade-up" data-aos-delay="300">
                  <ToggleButton 
                    onClick={toggleShowMore}
                    isShowingMore={showAllProjects}
                    loading={loading}
                  />
                </div>
              )}

              {/* Additional CTA Buttons */}
              <div className="flex flex-row gap-3 justify-center mt-8" data-aos="fade-up" data-aos-delay="500">
                <PortfolioCTAButton href="#Contact" text="Get in Touch" icon={Mail} />
                <PortfolioCTAButton href="#Home" text="Back to Home" icon={ExternalLink} />
              </div>
            </TabPanel>
          </Box>
        </div>

        {/* Enhanced Image Modal */}
        <ImageModal
          image={selectedImage?.image}
          title={selectedImage?.title}
          isOpen={!!selectedImage}
          onClose={closeImageModal}
        />
      </div>

      {/* CSS animations from Home.jsx */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes grid-move {
          0% { transform: translate(0, 0); }
          100% { transform: translate(40px, 40px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .mobile-touch:active {
          transform: scale(0.95);
        }
        .performance-optimized {
          transform: translateZ(0);
          backface-visibility: hidden;
          perspective: 1000px;
        }
        
        @media (prefers-reduced-motion: reduce) {
          .animate-float,
          .animate-pulse,
          .animate-bounce {
            animation: none !important;
          }
          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </PortfolioErrorBoundary>
  );
});

Portfolio.displayName = 'Portfolio';

export default Portfolio;