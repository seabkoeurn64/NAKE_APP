// src/Pages/Portofolio.jsx
import React, { useEffect, useState, useCallback, memo, useMemo } from "react";
import { useTheme } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import { X } from "lucide-react";
import AOS from "aos";
import "aos/dist/aos.css";

// Import components
import CardProject from "../components/CardProject";
import PortfolioLoading from "../components/LoadingScreen";
import { PortfolioErrorBoundary, ToggleButton, LoadingSpinner } from "../components/PortfolioComponents";
import { useProjects } from "../hooks/usePreload";

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

// Animated Image Modal Component
const ImageModal = memo(({ image, title, isOpen, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setTimeout(() => setIsVisible(true), 50);
    } else {
      setIsVisible(false);
      document.body.style.overflow = 'unset';
    }
  }, [isOpen]);

  if (!isOpen || !image) return null;

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 transition-all duration-500 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      onClick={onClose}
    >
      <div 
        className={`relative max-w-6xl max-h-full w-full transform transition-all duration-500 ${
          isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute -top-16 right-0 z-10 p-3 text-white/80 hover:text-white rounded-xl bg-black/50 backdrop-blur-sm border border-white/20 transition-all duration-300 hover:scale-110 hover:bg-black/70 hover:shadow-lg"
          aria-label="Close modal"
        >
          <X className="w-6 h-6" />
        </button>
        
        {/* Image Container */}
        <div className="relative bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-slate-700/50 transform transition-all duration-700 hover:shadow-2xl">
          <img
            src={image}
            alt={`Full size: ${title}`}
            className="w-full h-auto max-h-[80vh] object-contain transform transition-all duration-1000 hover:scale-105"
            draggable={false}
          />

          {/* Animated Title */}
          {title && (
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-6 transform transition-all duration-500 hover:translate-y-1">
              <h3 className="text-2xl font-bold text-white animate-pulse">{title}</h3>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

ImageModal.displayName = 'ImageModal';

// Main Portfolio Component
const Portfolio = memo(() => {
  const theme = useTheme();
  const [value, setValue] = useState(0);
  const [showAllProjects, setShowAllProjects] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const { projects, loading, error } = useProjects();

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    const checkReducedMotion = () => setPrefersReducedMotion(
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
    
    checkMobile();
    checkReducedMotion();
    
    window.addEventListener('resize', checkMobile);

    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  useEffect(() => {
    AOS.init({
      once: true,
      offset: isMobile ? 30 : 50,
      duration: prefersReducedMotion ? 0 : (isMobile ? 600 : 800),
      easing: 'ease-out-cubic',
      disable: prefersReducedMotion
    });

    return () => AOS.refresh();
  }, [isMobile, prefersReducedMotion]);

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

  if (loading) {
    return <PortfolioLoading />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="text-center p-8 max-w-md bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 transform transition-all duration-500 hover:scale-105">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-500/30 animate-pulse">
            <X className="w-8 h-8 text-red-400" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2 animate-pulse">Failed to load</h3>
          <p className="text-slate-300 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <PortfolioErrorBoundary>
      <div className="min-h-screen py-8 lg:py-16 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden" id="portfolio">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-pink-500/5 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '4s' }}></div>
        </div>

        <div className="relative z-10 container mx-auto px-4 sm:px-6">
          {/* Animated Header */}
          <div className="text-center mb-12" data-aos="fade-down" data-aos-duration="1000">
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4 animate-pulse">
              Design Portfolio
            </h2>
            <p className="text-slate-300 text-lg max-w-2xl mx-auto transform transition-all duration-500 hover:scale-105">
              Professional design projects with creative excellence
            </p>
          </div>

          <Box sx={{ width: "100%" }}>
            {/* Projects Grid */}
            <TabPanel value={value} index={0} dir={theme.direction}>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8">
                {displayedProjects.map((project, index) => (
                  <div 
                    key={project.id}
                    data-aos={prefersReducedMotion ? "fade-up" : "fade-up"}
                    data-aos-duration={prefersReducedMotion ? 0 : 800}
                    data-aos-delay={prefersReducedMotion ? 0 : (index % 3) * 100}
                    className="transform transition-all duration-500 hover:-translate-y-2"
                  >
                    <CardProject 
                      {...project}
                      onImageClick={handleImageClick}
                    />
                  </div>
                ))}
              </div>

              {/* Animated Show More Button */}
              {projects.length > initialItems && (
                <div className="flex justify-center mt-12" data-aos="fade-up" data-aos-delay="300">
                  <ToggleButton 
                    onClick={toggleShowMore}
                    isShowingMore={showAllProjects}
                    loading={loading}
                  />
                </div>
              )}
            </TabPanel>
          </Box>
        </div>

        {/* Image Modal */}
        <ImageModal
          image={selectedImage?.image}
          title={selectedImage?.title}
          isOpen={!!selectedImage}
          onClose={closeImageModal}
        />
      </div>
    </PortfolioErrorBoundary>
  );
});

Portfolio.displayName = 'Portfolio';

export default Portfolio;