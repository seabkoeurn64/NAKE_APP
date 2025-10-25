import React, { useEffect, useState, useCallback, memo, useMemo, useRef } from "react";
import PropTypes from "prop-types";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

import { useTheme } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

import { Palette, ArrowRight, Eye, Sparkles, Figma, Image, X, ExternalLink } from "lucide-react";
import AOS from "aos";
import "aos/dist/aos.css";

// Portfolio Theme Constants
const PORTFOLIO_THEME = {
  colors: {
    primary: '#8b5cf6',
    secondary: '#ec4899',
    background: '#030014',
    text: {
      primary: '#ffffff',
      secondary: '#cbd5e1',
      tertiary: '#94a3b8'
    }
  },
  breakpoints: {
    mobile: '768px',
    tablet: '1024px'
  },
  animations: {
    duration: {
      fast: '300ms',
      normal: '500ms',
      slow: '800ms'
    }
  }
};

// Custom Hooks
const useDebounce = (func, wait) => {
  const timeoutRef = useRef();

  return useCallback((...args) => {
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => func(...args), wait);
  }, [func, wait]);
};

const useInView = (options = {}) => {
  const [isInView, setIsInView] = useState(false);
  const ref = useRef();
  
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setIsInView(entry.isIntersecting);
    }, {
      threshold: 0.1,
      ...options
    });
    
    if (ref.current) observer.observe(ref.current);
    
    return () => observer.disconnect();
  }, [options]);
  
  return [ref, isInView];
};

const useProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const loadProjects = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const cachedProjects = localStorage.getItem("projects");
        if (cachedProjects) {
          setProjects(JSON.parse(cachedProjects));
        } else {
          localStorage.setItem("projects", JSON.stringify(sampleProjects));
          setProjects(sampleProjects);
        }
      } catch (e) {
        console.error("Error loading projects:", e);
        setError("Failed to load projects");
        setProjects(sampleProjects);
      } finally {
        setLoading(false);
      }
    };
    
    loadProjects();
  }, []);
  
  return { projects, loading, error };
};

const useSwipe = (onSwipeLeft, onSwipeRight) => {
  const touchStart = useRef(null);
  
  const onTouchStart = useCallback((e) => {
    touchStart.current = e.touches[0].clientX;
  }, []);

  const onTouchEnd = useCallback((e) => {
    if (!touchStart.current) return;
    
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart.current - touchEnd;
    
    if (Math.abs(diff) > 50) {
      diff > 0 ? onSwipeRight?.() : onSwipeLeft?.();
    }
    
    touchStart.current = null;
  }, [onSwipeLeft, onSwipeRight]);
  
  return { onTouchStart, onTouchEnd };
};

// Error Boundary Component
class PortfolioErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  
  componentDidCatch(error, errorInfo) {
    console.error('Portfolio Error:', error, errorInfo);
  }
  
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#030014] via-[#0f0a28] to-[#030014]">
          <div className="text-center p-8 max-w-md mx-auto">
            <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <X className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Something went wrong</h3>
            <p className="text-gray-300 mb-6">
              We encountered an error while loading the portfolio.
            </p>
            <button 
              onClick={() => this.setState({ hasError: false, error: null })}
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors duration-300"
            >
              Try Again
            </button>
          </div>
        </div>
      );
    }
    
    return this.props.children;
  }
}

// Sub-Components
const ProjectImage = memo(({ 
  src, 
  alt, 
  onLoad, 
  onError, 
  isHovered, 
  imageLoaded,
  className = "" 
}) => {
  const [imageSrc, setImageSrc] = useState(src);
  const [hasError, setHasError] = useState(false);
  const [naturalAspectRatio, setNaturalAspectRatio] = useState(4/3);
  
  const handleError = useCallback((e) => {
    console.error(`Failed to load image: ${src}`);
    setHasError(true);
    setImageSrc('/images/fallback-project.jpg');
    onError?.(e);
  }, [src, onError]);

  const handleLoad = useCallback((e) => {
    const img = e.target;
    if (img.naturalWidth && img.naturalHeight) {
      setNaturalAspectRatio(img.naturalWidth / img.naturalHeight);
    }
    setHasError(false);
    onLoad?.(e);
  }, [onLoad]);

  if (hasError) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-gray-800/40 rounded-t-3xl">
        <Image className="w-12 h-12 text-gray-500 mb-2" />
        <span className="text-gray-400 text-sm">Image not available</span>
      </div>
    );
  }

  return (
    <div 
      className="w-full h-full flex items-center justify-center bg-gray-900/20"
      style={{ paddingBottom: `${(1 / naturalAspectRatio) * 100}%` }}
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <img
          src={imageSrc}
          alt={alt}
          loading="lazy"
          decoding="async"
          className={`w-full h-full object-contain transform transition-all duration-700 ${className} ${
            imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-110'
          } ${isHovered ? 'scale-110' : 'scale-100'}`}
          onLoad={handleLoad}
          onError={handleError}
        />
        
        {!imageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-800/40 rounded-t-3xl">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-purple-500 border-t-transparent"></div>
          </div>
        )}
      </div>
    </div>
  );
});

ProjectImage.displayName = 'ProjectImage';

ProjectImage.propTypes = {
  src: PropTypes.string,
  alt: PropTypes.string.isRequired,
  onLoad: PropTypes.func,
  onError: PropTypes.func,
  isHovered: PropTypes.bool,
  imageLoaded: PropTypes.bool,
  className: PropTypes.string
};

const TechnologyTags = memo(({ 
  technologies, 
  visibleCount = 4, 
  variant = "default",
  className = "" 
}) => {
  const visibleTechnologies = useMemo(() => 
    technologies.slice(0, visibleCount), [technologies, visibleCount]
  );

  const remainingTechCount = useMemo(() => 
    Math.max(0, technologies.length - visibleCount), [technologies, visibleCount]
  );

  const tagClasses = {
    default: "px-3 py-1.5 bg-black/80 backdrop-blur-lg rounded-full text-xs text-white/90 border border-white/10 font-medium shadow-lg",
    minimal: "px-3 py-1.5 bg-white/5 rounded-full text-xs text-gray-300 border border-white/5 hover:bg-white/10 hover:border-white/10 hover:text-white transition-all duration-300 font-medium"
  };

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {visibleTechnologies.map((tech, index) => (
        <span
          key={`${tech}-${index}`}
          className={tagClasses[variant]}
        >
          {tech}
        </span>
      ))}
      {remainingTechCount > 0 && (
        <span className={tagClasses[variant]}>
          +{remainingTechCount}
        </span>
      )}
    </div>
  );
});

TechnologyTags.displayName = 'TechnologyTags';

TechnologyTags.propTypes = {
  technologies: PropTypes.arrayOf(PropTypes.string).isRequired,
  visibleCount: PropTypes.number,
  variant: PropTypes.oneOf(['default', 'minimal']),
  className: PropTypes.string
};

const FullImageModal = memo(({ 
  image, 
  title, 
  onClose, 
  imageLoaded,
  onImageLoad 
}) => {
  const stopPropagation = useCallback((e) => {
    e.stopPropagation();
  }, []);

  const handleBackdropClick = useCallback((e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  }, [onClose]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [onClose]);

  return (
    <div 
      className="fixed inset-0 bg-black/98 backdrop-blur-lg z-50 flex items-center justify-center p-2 sm:p-4 portfolio-fade-in"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="relative w-full h-full max-w-6xl max-h-[95vh] flex flex-col items-center justify-center">
        <div className="relative w-full max-w-4xl flex justify-end mb-2 sm:mb-4 z-30">
          <button 
            className="p-3 bg-black/90 hover:bg-red-500/90 rounded-full text-white transition-all duration-300 border border-white/20 shadow-2xl hover:scale-110 hover:shadow-red-500/25 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-white/50"
            onClick={onClose}
            aria-label="Close preview"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>
        
        <div className="relative w-full max-w-4xl flex-1 flex items-center justify-center">
          <div className="relative w-full h-full flex items-center justify-center">
            <img
              src={image}
              alt={`Full view of ${title}`}
              className="max-w-full max-h-full object-contain rounded-xl sm:rounded-2xl shadow-2xl portfolio-scale-in"
              onClick={stopPropagation}
              onLoad={onImageLoad}
              style={{ 
                width: 'auto', 
                height: 'auto',
                maxWidth: '95vw',
                maxHeight: '70vh'
              }}
            />
            
            {!imageLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-900/50 rounded-xl sm:rounded-2xl">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"></div>
              </div>
            )}
          </div>
        </div>

        <div className="relative w-full max-w-4xl mt-3 sm:mt-4 z-20">
          <div className="bg-black/80 backdrop-blur-xl rounded-xl p-3 sm:p-4 border border-white/20 text-center portfolio-slide-up">
            <h3 id="modal-title" className="text-white text-base sm:text-lg font-bold mb-1">{title}</h3>
            <p className="text-gray-300 text-xs sm:text-sm">Click outside or press ESC to close</p>
          </div>
        </div>
      </div>

      <div 
        className="fixed bottom-0 left-0 right-0 sm:hidden z-40 portfolio-slide-up"
        onClick={onClose}
      >
        <div className="bg-gradient-to-t from-black/95 to-transparent pt-8 pb-4 flex justify-center">
          <div className="text-white text-sm bg-black/70 px-6 py-3 rounded-full border border-white/30 shadow-lg">
            👆 Tap to close
          </div>
        </div>
      </div>
    </div>
  );
});

FullImageModal.displayName = 'FullImageModal';

FullImageModal.propTypes = {
  image: PropTypes.string,
  title: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  imageLoaded: PropTypes.bool,
  onImageLoad: PropTypes.func
};

// Enhanced CardProject Component
const CardProject = memo(({ 
  Img, 
  Title, 
  Description, 
  id, 
  technologies = [], 
  prototypeLink, 
  behanceLink,
  scrollTargetId,
  onViewPosterClick
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [showFullImage, setShowFullImage] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [ref, isInView] = useInView();

  const handleImageLoad = useCallback(() => {
    setImageLoaded(true);
    setImageError(false);
  }, []);

  const handleImageError = useCallback(() => {
    setImageError(true);
    setImageLoaded(true);
  }, []);

  const stopPropagation = useCallback((e) => {
    e.stopPropagation();
  }, []);

  const handleViewFullImage = useCallback((e) => {
    e?.preventDefault();
    e?.stopPropagation();
    setShowFullImage(true);
  }, []);

  const handleCloseFullImage = useCallback((e) => {
    e?.stopPropagation();
    setShowFullImage(false);
  }, []);

  const handleMouseEnter = useCallback(() => setIsHovered(true), []);
  const handleMouseLeave = useCallback(() => setIsHovered(false), []);

  const handleViewPosterClick = useCallback((e) => {
    e?.preventDefault();
    e?.stopPropagation();
    
    if (hasScrolled) {
      handleViewFullImage();
      return;
    }

    if (scrollTargetId && onViewPosterClick) {
      setHasScrolled(true);
      onViewPosterClick(scrollTargetId);
    } else {
      handleViewFullImage();
    }
  }, [hasScrolled, scrollTargetId, onViewPosterClick, handleViewFullImage]);

  // Debug image loading
  useEffect(() => {
    console.log(`Image for ${Title}:`, Img, `Loaded: ${imageLoaded}`, `Error: ${imageError}`);
  }, [Img, Title, imageLoaded, imageError]);

  return (
    <>
      {showFullImage && Img && (
        <FullImageModal
          image={Img}
          title={Title}
          onClose={handleCloseFullImage}
          imageLoaded={imageLoaded}
          onImageLoad={handleImageLoad}
        />
      )}

      <div 
        ref={ref}
        className="group relative w-full cursor-pointer transform transition-all duration-500 hover:scale-[1.02] will-change-transform"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-900/50 to-gray-800/30 shadow-2xl transition-all duration-500 hover:shadow-purple-500/20 border border-white/10 backdrop-blur-sm">
          
          {/* Image Container with Dynamic Aspect Ratio */}
          <div className="relative overflow-hidden rounded-t-3xl bg-gray-900/20">
            <ProjectImage
              src={Img}
              alt={Title}
              isHovered={isHovered}
              imageLoaded={imageLoaded}
              onLoad={handleImageLoad}
              onError={handleImageError}
            />
            
            {/* Overlays */}
            <div className={`absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent transition-opacity duration-500 rounded-t-3xl ${
              isHovered ? 'opacity-60' : 'opacity-80'
            }`} />
            
            <div className={`absolute inset-0 bg-purple-500/0 transition-all duration-500 rounded-t-3xl ${
              isHovered ? 'bg-purple-500/10' : ''
            }`} />

            {/* Project Type Badge */}
            <div className="absolute top-3 left-3 z-20 transform transition-transform duration-300 hover:scale-105">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-black/90 backdrop-blur-md rounded-full border border-purple-500/30 text-sm font-medium shadow-lg">
                <Sparkles className="w-3 h-3 text-purple-400 animate-pulse" />
                <span className="text-white/95">Poster Design</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className={`absolute top-3 right-3 z-20 transform transition-all duration-500 ${
              isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
            }`}>
              <div className="flex gap-2">
                <button
                  onClick={handleViewPosterClick}
                  className="p-2.5 bg-black/90 backdrop-blur-md rounded-xl border border-white/20 text-white hover:bg-purple-600 hover:scale-110 hover:border-purple-400 transition-all duration-300 shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                  title="View full poster"
                  aria-label="View full poster image"
                >
                  <Eye className="w-4 h-4" />
                </button>
                
                {prototypeLink && (
                  <a
                    href={prototypeLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 bg-black/90 backdrop-blur-md rounded-xl border border-white/20 text-white hover:bg-blue-600 hover:scale-110 hover:border-blue-400 transition-all duration-300 shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    onClick={stopPropagation}
                    title="Open prototype"
                    aria-label="Open prototype in Figma"
                  >
                    <Figma className="w-4 h-4" />
                  </a>
                )}

                {behanceLink && (
                  <a
                    href={behanceLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 bg-black/90 backdrop-blur-md rounded-xl border border-white/20 text-white hover:bg-blue-500 hover:scale-110 hover:border-blue-300 transition-all duration-300 shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    onClick={stopPropagation}
                    title="View on Behance"
                    aria-label="View project on Behance"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>

            {/* Technologies Tags */}
            {technologies.length > 0 && (
              <div className={`absolute bottom-3 left-3 right-3 z-20 transform transition-all duration-500 delay-100 ${
                isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
              }`}>
                <TechnologyTags technologies={technologies} variant="default" />
              </div>
            )}
          </div>
          
          {/* Card Content */}
          <div className="p-5 space-y-4">
            <div className="space-y-3">
              <h3 className="text-xl font-bold text-white leading-tight line-clamp-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-pink-400 transition-all duration-500">
                {Title}
              </h3>
              
              <p className="text-gray-300/90 text-sm leading-relaxed line-clamp-3">
                {Description}
              </p>
            </div>

            {technologies.length > 0 && (
              <TechnologyTags technologies={technologies} variant="minimal" />
            )}
            
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-2">
                {behanceLink && (
                  <a
                    href={behanceLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 bg-white/5 rounded-xl border border-white/10 text-gray-400 hover:bg-blue-500 hover:text-white hover:scale-110 hover:border-blue-400 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    onClick={stopPropagation}
                    title="Behance"
                    aria-label="View on Behance"
                  >
                    <Palette className="w-4 h-4" />
                  </a>
                )}
              </div>
              
              <div className="flex-1 flex justify-end">
                <button
                  onClick={handleViewPosterClick}
                  className="inline-flex items-center justify-center space-x-3 px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-600/20 to-pink-600/20 hover:from-purple-600/40 hover:to-pink-600/40 border border-purple-500/30 hover:border-purple-400/50 text-white/95 hover:text-white transition-all duration-500 group/button text-sm font-semibold backdrop-blur-sm hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                  aria-label={`View ${Title} poster`}
                >
                  <span className="truncate">
                    {hasScrolled ? "View Full Image" : "View Poster"}
                  </span>
                  <ArrowRight className="w-4 h-4 flex-shrink-0 transform group-hover/button:translate-x-1 transition-transform duration-300" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
});

CardProject.displayName = 'CardProject';

CardProject.propTypes = {
  Img: PropTypes.string,
  Title: PropTypes.string.isRequired,
  Description: PropTypes.string.isRequired,
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  technologies: PropTypes.arrayOf(PropTypes.string),
  prototypeLink: PropTypes.string,
  behanceLink: PropTypes.string,
  scrollTargetId: PropTypes.string,
  onViewPosterClick: PropTypes.func
};

// ToggleButton Component
const ToggleButton = memo(({ onClick, isShowingMore, loading = false }) => (
  <button
    onClick={onClick}
    disabled={loading}
    className="px-8 py-4 text-white text-base font-semibold transition-all duration-500 ease-out flex items-center gap-3 bg-gradient-to-r from-purple-600/20 to-pink-600/20 hover:from-purple-600/40 hover:to-pink-600/40 rounded-2xl border border-purple-500/30 hover:border-purple-400/50 backdrop-blur-sm hover:scale-105 hover:shadow-xl hover:shadow-purple-500/20 group relative overflow-hidden focus:outline-none focus:ring-2 focus:ring-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
    aria-expanded={isShowingMore}
  >
    <span className="relative z-10 flex items-center gap-3">
      {loading ? (
        <>
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
          Loading...
        </>
      ) : (
        <>
          {isShowingMore ? "Show Less" : "Show More Projects"}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`transition-all duration-500 ${isShowingMore ? "rotate-180 group-hover:-translate-y-1" : "group-hover:translate-y-1"}`}
          >
            <polyline points={isShowingMore ? "18 15 12 9 6 15" : "6 9 12 15 18 9"}></polyline>
          </svg>
        </>
      )}
    </span>
    <span className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-pink-600/10 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left rounded-2xl"></span>
  </button>
));

ToggleButton.displayName = 'ToggleButton';

ToggleButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  isShowingMore: PropTypes.bool.isRequired,
  loading: PropTypes.bool
};

// TabPanel Component
function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: { xs: 2, sm: 3 } }}>
          <Typography component="div">{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`,
  };
}

// Scroll target section component
const ScrollTargetSection = memo(({ id, title, description }) => (
  <section 
    id={id}
    className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900/20 via-pink-900/20 to-purple-900/20 py-20"
  >
    <div className="text-center max-w-4xl mx-auto px-4">
      <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
        {title}
      </h2>
      <p className="text-xl text-gray-300 mb-8">
        {description}
      </p>
      <div className="animate-bounce mt-8">
        <div className="w-6 h-6 border-2 border-white rounded-full animate-ping"></div>
      </div>
    </div>
  </section>
));

ScrollTargetSection.displayName = 'ScrollTargetSection';

ScrollTargetSection.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired
};

// Loading Component
const PortfolioLoading = memo(() => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#030014] via-[#0f0a28] to-[#030014]">
    <div className="text-center">
      <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-500 border-t-transparent mx-auto mb-4"></div>
      <p className="text-gray-300 text-lg">Loading portfolio...</p>
    </div>
  </div>
));

PortfolioLoading.displayName = 'PortfolioLoading';

// Sample Projects Data with working images
const sampleProjects = [
  {
    id: 1,
    Img: "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800&h=600&fit=crop",
    Title: "Creative Poster Design",
    Description: "Modern and intuitive poster design with user-centered approach",
    technologies: ["Photoshop", "Illustrator", "Typography"],
    scrollTargetId: "poster-detail-1"
  },
  {
    id: 2,
    Img: "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=800&h=600&fit=crop",
    Title: "Website Redesign", 
    Description: "Complete website redesign with improved user experience",
    technologies: ["Figma", "UI Design", "Prototyping"],
    scrollTargetId: "poster-detail-2"
  },
  {
    id: 3,
    Img: "https://images.unsplash.com/photo-1634942537034-2531766767d1?w=800&h=600&fit=crop",
    Title: "Brand Identity",
    Description: "Comprehensive brand identity design including logo and visual guidelines",
    technologies: ["Illustrator", "Branding", "Typography"],
    scrollTargetId: "poster-detail-3"
  },
  {
    id: 4,
    Img: "https://images.unsplash.com/photo-1586339949216-35c2747cc36d?w=800&h=600&fit=crop",
    Title: "Poster Design",
    Description: "Clean and functional poster design with data visualization", 
    technologies: ["Photoshop", "Layout", "Color Theory"],
    scrollTargetId: "poster-detail-4"
  },
  {
    id: 5,
    Img: "https://images.unsplash.com/photo-1649180556628-9ba7041153c2?w=800&h=600&fit=crop",
    Title: "Logo Design",
    Description: "Seamless logo design with intuitive navigation and visual flow",
    technologies: ["Illustrator", "Logo Design", "Vector"],
    scrollTargetId: "poster-detail-5"
  },
  {
    id: 6,
    Img: "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=800&h=600&fit=crop",
    Title: "Product Poster", 
    Description: "Creative product poster design showcasing design work and case studies",
    technologies: ["Photoshop", "Product Design", "Marketing"],
    scrollTargetId: "poster-detail-6"
  }
];

// Scroll target data
const scrollTargets = [
  { id: "poster-detail-1", title: "Creative Poster Design", description: "Explore the creative process behind this modern poster design" },
  { id: "poster-detail-2", title: "Website Redesign", description: "Discover the journey of transforming user experience" },
  { id: "poster-detail-3", title: "Brand Identity", description: "Building a comprehensive visual identity system" },
  { id: "poster-detail-4", title: "Poster Design", description: "Data visualization meets creative design" },
  { id: "poster-detail-5", title: "Logo Design", description: "Crafting memorable brand symbols" },
  { id: "poster-detail-6", title: "Product Poster", description: "Showcasing products through compelling visuals" }
];

// Main Portfolio Component
const FullWidthTabs = memo(() => {
  const theme = useTheme();
  const [value, setValue] = useState(0);
  const [showAllProjects, setShowAllProjects] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const scrollHistoryRef = useRef(new Set());

  const { projects, loading, error } = useProjects();
  const swipeHandlers = useSwipe(
    useCallback(() => setValue(prev => Math.min(prev + 1, 1)), []),
    useCallback(() => setValue(prev => Math.max(prev - 1, 0)), [])
  );

  const initialItems = useMemo(() => isMobile ? 4 : 6, [isMobile]);

  const checkMobile = useCallback(() => setIsMobile(window.innerWidth < 768), []);
  const checkReducedMotion = useCallback(() => setPrefersReducedMotion(
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ), []);

  const debouncedResize = useDebounce(checkMobile, 100);

  useEffect(() => {
    checkMobile();
    checkReducedMotion();
    
    window.addEventListener('resize', debouncedResize);
    
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    mediaQuery.addEventListener('change', checkReducedMotion);

    return () => {
      window.removeEventListener('resize', debouncedResize);
      mediaQuery.removeEventListener('change', checkReducedMotion);
    };
  }, [checkMobile, checkReducedMotion, debouncedResize]);

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

  const handleViewPosterClick = useCallback((targetId) => {
    if (scrollHistoryRef.current.has(targetId)) {
      return;
    }

    scrollHistoryRef.current.add(targetId);

    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      const offset = 80;
      const targetPosition = targetElement.offsetTop - offset;
      
      window.scrollTo({
        top: targetPosition,
        behavior: prefersReducedMotion ? 'auto' : 'smooth'
      });

      targetElement.classList.add('highlight-section');
      setTimeout(() => {
        targetElement.classList.remove('highlight-section');
      }, 2000);
    }
  }, [prefersReducedMotion]);

  const displayedProjects = useMemo(() => 
    showAllProjects ? projects : projects.slice(0, initialItems),
    [showAllProjects, projects, initialItems]
  );

  const getAnimationDelay = useCallback((index) => {
    return prefersReducedMotion ? 0 : 100 + (index * 100);
  }, [prefersReducedMotion]);

  const getAnimationType = useCallback((index) => {
    if (prefersReducedMotion) return "fade-up";
    const types = ["fade-up-right", "fade-up", "fade-up-left"];
    return types[index % 3];
  }, [prefersReducedMotion]);

  if (loading) {
    return <PortfolioLoading />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#030014] via-[#0f0a28] to-[#030014]">
        <div className="text-center p-8 max-w-md mx-auto">
          <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <X className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Loading Error</h3>
          <p className="text-gray-300 mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors duration-300"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <PortfolioErrorBoundary>
      <div className="min-h-screen py-8 lg:py-16 text-white overflow-hidden bg-gradient-to-br from-[#030014] via-[#0f0a28] to-[#030014] relative" id="Portofolio">
        {/* Background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-[#6366f1] rounded-full blur-3xl opacity-10 animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#a855f7] rounded-full blur-3xl opacity-5 animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 w-56 h-56 bg-[#8b5cf6] rounded-full blur-2xl opacity-5 animate-pulse delay-500"></div>
          
          <div className="absolute inset-0 opacity-10">
            <div className="w-full h-full portfolio-grid-move"></div>
          </div>
        </div>

        <div className="relative z-10 md:px-[5%] px-[4%] w-full sm:mt-0 mt-[2rem]">
          <div className="text-center pb-8" data-aos="fade-up" data-aos-duration="1000">
            <h2 className="inline-block text-3xl md:text-5xl font-bold text-center mx-auto text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-purple-600 mb-4">
              Design Portfolio
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
              Explore my design journey through carefully crafted UI/UX projects. Each project showcases my passion for creating beautiful and functional digital experiences.
            </p>
          </div>

          <Box sx={{ width: "100%" }} {...swipeHandlers}>
            <AppBar
              position="static"
              elevation={0}
              sx={{
                bgcolor: "transparent",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                borderRadius: "24px",
                position: "relative",
                overflow: "hidden",
                "&::before": {
                  content: '""',
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: "linear-gradient(135deg, rgba(139, 92, 246, 0.08) 0%, rgba(236, 72, 153, 0.08) 100%)",
                  backdropFilter: isMobile ? "blur(8px)" : "blur(12px)",
                  zIndex: 0,
                },
              }}
              className="md:px-4"
            >
              <Tabs
                value={value}
                onChange={handleChange}
                textColor="secondary"
                indicatorColor="secondary"
                variant="fullWidth"
                sx={{
                  minHeight: "70px",
                  "& .MuiTab-root": {
                    fontSize: { xs: "0.9rem", md: "1rem" },
                    fontWeight: "700",
                    color: "#cbd5e1",
                    textTransform: "none",
                    transition: prefersReducedMotion ? "none" : "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
                    padding: "20px 0",
                    zIndex: 1,
                    margin: "8px",
                    borderRadius: "16px",
                    "&:hover": prefersReducedMotion ? {} : { 
                      color: "#fff", 
                      backgroundColor: "rgba(139, 92, 246, 0.15)", 
                      transform: "translateY(-3px)",
                      boxShadow: "0 10px 30px rgba(139, 92, 246, 0.2)"
                    },
                    "&.Mui-selected": { 
                      color: "#fff", 
                      background: "linear-gradient(135deg, rgba(139, 92, 246, 0.3), rgba(236, 72, 153, 0.3))",
                      boxShadow: "0 8px 25px rgba(139, 92, 246, 0.3)"
                    },
                  },
                  "& .MuiTabs-indicator": { height: 0 },
                  "& .MuiTabs-flexContainer": { gap: "8px" },
                }}
              >
                <Tab 
                  icon={<Palette className="mb-1 w-5 h-5 transition-all duration-500" />}
                  label="Design Projects" 
                  {...a11yProps(0)} 
                />
              </Tabs>
            </AppBar>

            <Swiper
              slidesPerView={1}
              onSlideChange={(swiper) => setValue(swiper.activeIndex)}
              initialSlide={value}
              speed={prefersReducedMotion ? 0 : 500}
            >
              <SwiperSlide>
                <TabPanel value={value} index={0} dir={theme.direction}>
                  <div className="container mx-auto flex justify-center items-center overflow-hidden">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 md:gap-8">
                      {displayedProjects.map((project, index) => (
                        <div 
                          key={project.id || index} 
                          data-aos={getAnimationType(index)}
                          data-aos-duration={prefersReducedMotion ? 0 : 800}
                          data-aos-delay={getAnimationDelay(index)}
                          className="flex justify-center"
                        >
                          <CardProject 
                            Img={project.Img} 
                            Title={project.Title} 
                            Description={project.Description} 
                            id={project.id}
                            technologies={project.technologies}
                            scrollTargetId={project.scrollTargetId}
                            onViewPosterClick={handleViewPosterClick}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                  {projects.length > initialItems && (
                    <div 
                      className="flex justify-center mt-12"
                      data-aos="fade-up"
                      data-aos-delay="300"
                      data-aos-duration={prefersReducedMotion ? 0 : 800}
                    >
                      <ToggleButton 
                        onClick={toggleShowMore} 
                        isShowingMore={showAllProjects} 
                        loading={loading}
                      />
                    </div>
                  )}
                </TabPanel>
              </SwiperSlide>
            </Swiper>
          </Box>
        </div>

        {/* Scroll Target Sections */}
        {scrollTargets.map((target, index) => (
          <ScrollTargetSection
            key={target.id}
            id={target.id}
            title={target.title}
            description={target.description}
          />
        ))}

        {/* Portfolio Animations CSS */}
        <style>{`
          .portfolio-fade-in {
            animation: portfolioFadeIn 0.3s ease-out;
          }
          
          .portfolio-scale-in {
            animation: portfolioScaleIn 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          }
          
          .portfolio-slide-up {
            animation: portfolioSlideUp 0.5s ease-out;
          }
          
          .portfolio-grid-move {
            background-image: linear-gradient(#6366f1 1px, transparent 1px), linear-gradient(90deg, #6366f1 1px, transparent 1px);
            background-size: 40px 40px;
            animation: portfolioGridMove 20s linear infinite;
          }

          .highlight-section {
            animation: highlightPulse 2s ease-in-out;
          }
          
          @keyframes portfolioFadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          
          @keyframes portfolioScaleIn {
            from { transform: scale(0.9); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
          }
          
          @keyframes portfolioSlideUp {
            from { transform: translateY(20px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }
          
          @keyframes portfolioGridMove {
            0% { transform: translate(0, 0); }
            100% { transform: translate(40px, 40px); }
          }

          @keyframes highlightPulse {
            0% { background: rgba(139, 92, 246, 0); }
            50% { background: rgba(139, 92, 246, 0.1); }
            100% { background: rgba(139, 92, 246, 0); }
          }
          
          @media (prefers-reduced-motion: reduce) {
            .portfolio-fade-in,
            .portfolio-scale-in,
            .portfolio-slide-up,
            .portfolio-grid-move,
            .highlight-section,
            .transition-all,
            .transform {
              animation: none !important;
              transition: none !important;
            }
          }
        `}</style>
      </div>
    </PortfolioErrorBoundary>
  );
});

FullWidthTabs.displayName = 'FullWidthTabs';

export default FullWidthTabs;