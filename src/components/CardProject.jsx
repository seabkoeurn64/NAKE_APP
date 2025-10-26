import React, { useState, useCallback, memo, useMemo, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Eye, Sparkles, Palette, Figma, Image, ExternalLink } from 'lucide-react';
import PropTypes from 'prop-types';

// Custom hook for intersection observer
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

const CardProject = memo(({ 
  Img, 
  Title, 
  Description, 
  id, 
  technologies = [], 
  prototypeLink, 
  behanceLink,
  category = "Design",
  status = "available",
  priority = false,
  index = 0
}) => {
  const [imageState, setImageState] = useState({
    loaded: false,
    error: false,
    naturalAspectRatio: 4/3 // Keep original aspect ratio
  });
  const [isHovered, setIsHovered] = useState(false);
  const [ref, isInView] = useInView({ threshold: 0.1 });
  const imgRef = useRef(null);

  // Determine loading strategy
  const loadingStrategy = useMemo(() => {
    if (priority || index < 3) return 'eager';
    return 'lazy';
  }, [priority, index]);

  // Memoized category icons
  const categoryIcons = useMemo(() => ({
    Design: Sparkles,
    Web: Palette,
    Brand: Image,
    Print: Figma,
    default: Sparkles
  }), []);

  const CategoryIcon = categoryIcons[category] || categoryIcons.default;

  const handleDetails = useCallback((e) => {
    if (!id || status === "unavailable") {
      e.preventDefault();
    }
  }, [id, status]);

  const handleImageLoad = useCallback((e) => {
    const img = e.target;
    if (img.naturalWidth && img.naturalHeight) {
      setImageState(prev => ({
        ...prev,
        loaded: true,
        error: false,
        naturalAspectRatio: img.naturalWidth / img.naturalHeight
      }));
    } else {
      setImageState(prev => ({
        ...prev,
        loaded: true,
        error: false
      }));
    }
  }, []);

  const handleImageError = useCallback(() => {
    setImageState(prev => ({
      ...prev,
      loaded: true,
      error: true
    }));
  }, []);

  const stopPropagation = useCallback((e) => {
    e.stopPropagation();
  }, []);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
  }, []);

  // Memoized technology tags
  const technologyTags = useMemo(() => {
    const visibleTechs = technologies.slice(0, 3);
    const remainingCount = technologies.length - 3;
    
    return {
      visible: visibleTechs,
      remaining: remainingCount > 0 ? remainingCount : 0
    };
  }, [technologies]);

  // Generate fallback image
  const fallbackImage = useMemo(() => {
    const colors = {
      Design: '8b5cf6',
      Web: 'ec4899', 
      Brand: 'f59e0b',
      Print: '10b981',
      default: '6b7280'
    };
    const color = colors[category] || colors.default;
    const text = encodeURIComponent(Title);
    return `https://via.placeholder.com/600x400/${color}/ffffff?text=${text}`;
  }, [Title, category]);

  const isProjectAvailable = id && status === "available";
  const imageSource = imageState.error ? fallbackImage : Img;

  return (
    <div 
      ref={ref}
      className="group relative w-full cursor-pointer"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="relative overflow-hidden rounded-xl glass-morphism shadow-lg transition-all duration-300 hover:shadow-purple-500/20 border border-white/10 bg-gray-900/20 hover:bg-gray-900/30 backdrop-blur-sm">
        
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl" />
        
        <div className="relative p-3 sm:p-4 z-10">
          
          {/* Image Section with Dynamic Aspect Ratio */}
          <Link
            to={isProjectAvailable ? `/project/${id}` : '#'}
            onClick={handleDetails}
            className="block relative overflow-hidden rounded-lg mb-3 group/image"
            aria-label={`View ${Title} project details`}
          >
            <div 
              className="relative overflow-hidden rounded-lg bg-gradient-to-br from-gray-800/30 to-gray-900/30 border border-white/5"
              style={{ paddingBottom: `${(1 / imageState.naturalAspectRatio) * 100}%` }}
            >
              {/* Skeleton Loader */}
              <div className={`absolute inset-0 transition-all duration-500 ${
                imageState.loaded ? 'opacity-0 scale-105' : 'opacity-100 scale-100'
              }`}>
                <div className="skeleton w-full h-full rounded-lg bg-gradient-to-r from-gray-700/50 to-gray-600/50 animate-pulse" />
              </div>
              
              {/* Main Image - Preserve Original Aspect Ratio */}
              {isInView && imageSource && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <img
                    ref={imgRef}
                    src={imageSource}
                    alt={`${Title} - ${category} project`}
                    loading={loadingStrategy}
                    decoding="async"
                    className={`max-w-full max-h-full object-contain transition-all duration-700 ${
                      imageState.loaded ? 'opacity-100 scale-100' : 'opacity-0 scale-110'
                    } ${isHovered ? 'scale-105' : 'scale-100'}`}
                    onLoad={handleImageLoad}
                    onError={handleImageError}
                  />
                </div>
              )}
              
              <div className={`absolute inset-0 bg-gradient-to-t from-slate-900/70 via-slate-900/20 to-transparent transition-all duration-500 ${
                isHovered ? 'opacity-80' : 'opacity-60'
              } rounded-lg`} />
            </div>
            
            {/* Badge */}
            <div className="absolute top-2 left-2 z-20 transform transition-transform duration-300 group-hover/image:scale-110">
              <div className="flex items-center gap-1 px-2 py-1 bg-black/90 backdrop-blur-md rounded-lg border border-white/10 text-xs shadow-lg">
                <CategoryIcon className="w-3 h-3 text-pink-400" />
                <span className="text-white/90 font-medium">{category}</span>
              </div>
            </div>

            {/* Action Icons */}
            <div className={`absolute top-2 right-2 z-20 transition-all duration-300 ${
              isHovered ? 'opacity-100 scale-100' : 'opacity-70 scale-95'
            }`}>
              <div className="flex gap-1">
                <div className="p-1.5 bg-black/90 backdrop-blur-md rounded-lg border border-white/10 shadow-lg transition-transform duration-200 hover:scale-110">
                  <Eye className="w-3 h-3 text-white" />
                </div>
                {prototypeLink && (
                  <a
                    href={prototypeLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 bg-black/90 backdrop-blur-md rounded-lg border border-white/10 shadow-lg transition-transform duration-200 hover:scale-110"
                    onClick={stopPropagation}
                    aria-label={`Open ${Title} prototype`}
                  >
                    <Figma className="w-3 h-3 text-white" />
                  </a>
                )}
              </div>
            </div>

            {/* Hover Indicator */}
            <div className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${
              isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
            }`}>
              <div className="bg-black/80 backdrop-blur-md rounded-full p-3 border border-white/20 transform transition-transform duration-300 group-hover/image:scale-110">
                <ExternalLink className="w-4 h-4 text-white" />
              </div>
            </div>
          </Link>
          
          {/* Content Section */}
          <div className="space-y-2">
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-white line-clamp-2 leading-tight transition-colors duration-200 group-hover:text-white/90">
                {Title}
              </h3>
              
              <p className="text-gray-300/80 text-xs leading-relaxed line-clamp-2 transition-colors duration-200 group-hover:text-gray-300">
                {Description}
              </p>
            </div>

            {technologies.length > 0 && (
              <div className="flex gap-1 overflow-x-auto scrollbar-hide pb-1">
                {technologyTags.visible.map((tech, index) => (
                  <span
                    key={`${tech}-${index}`}
                    className="flex-shrink-0 px-2 py-1 bg-white/5 rounded-lg text-xs text-gray-300 border border-white/5 transition-all duration-200 hover:bg-white/10 hover:border-white/10 hover:text-white"
                    title={tech}
                  >
                    {tech}
                  </span>
                ))}
                {technologyTags.remaining > 0 && (
                  <span 
                    className="flex-shrink-0 px-2 py-1 bg-white/5 rounded-lg text-xs text-gray-400 border border-white/5"
                    title={`${technologyTags.remaining} more technologies`}
                  >
                    +{technologyTags.remaining}
                  </span>
                )}
              </div>
            )}
            
            <div className="flex items-center justify-between gap-2 pt-2">
              <div className="flex items-center gap-1">
                {behanceLink && (
                  <a
                    href={behanceLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 bg-white/5 rounded-lg border border-white/10 text-gray-400 hover:bg-white/10 hover:text-white transition-all duration-200 hover:scale-110"
                    onClick={stopPropagation}
                    aria-label={`View ${Title} on Behance`}
                  >
                    <Palette className="w-3 h-3" />
                  </a>
                )}
                <a
                  href={imageSource}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 bg-white/5 rounded-lg border border-white/10 text-gray-400 hover:bg-white/10 hover:text-white transition-all duration-200 hover:scale-110"
                  onClick={stopPropagation}
                  aria-label={`Open ${Title} image in new tab`}
                >
                  <Image className="w-3 h-3" />
                </a>
              </div>
              
              <div className="flex-1 flex justify-end min-w-0">
                {isProjectAvailable ? (
                  <Link
                    to={`/project/${id}`}
                    onClick={handleDetails}
                    className="inline-flex items-center justify-center space-x-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-pink-500/10 to-purple-500/10 hover:from-pink-500/20 hover:to-purple-500/20 border border-pink-500/20 hover:border-pink-500/30 text-white/90 hover:text-white transition-all duration-200 group/button text-xs font-medium whitespace-nowrap overflow-hidden shadow-lg hover:shadow-pink-500/10"
                  >
                    <span className="truncate">View Details</span>
                    <ArrowRight className="w-3 h-3 flex-shrink-0 transform group-hover/button:translate-x-0.5 transition-transform duration-200" />
                  </Link>
                ) : (
                  <div className="inline-flex items-center justify-center space-x-1.5 px-3 py-1.5 rounded-lg bg-gray-500/5 border border-gray-500/20 text-gray-500 cursor-not-allowed text-xs font-medium whitespace-nowrap">
                    <span className="truncate">Coming Soon</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
});

CardProject.propTypes = {
  Img: PropTypes.string,
  Title: PropTypes.string.isRequired,
  Description: PropTypes.string.isRequired,
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  technologies: PropTypes.arrayOf(PropTypes.string),
  prototypeLink: PropTypes.string,
  behanceLink: PropTypes.string,
  category: PropTypes.oneOf(['Design', 'Web', 'Brand', 'Print']),
  status: PropTypes.oneOf(['available', 'unavailable']),
  priority: PropTypes.bool,
  index: PropTypes.number
};

CardProject.defaultProps = {
  technologies: [],
  category: "Design",
  status: "available",
  priority: false,
  index: 0
};

CardProject.displayName = 'CardProject';

export default CardProject;