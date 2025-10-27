// src/components/CardProject.jsx - FIXED VERSION (Icon visibility on hover)
import React, { useState, useCallback, memo, useRef, useEffect } from 'react';

// ✅ Custom hook for hover and tap effects
const useHoverScale = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [isTapped, setIsTapped] = useState(false);

  const handleMouseEnter = useCallback(() => setIsHovered(true), []);
  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    setIsTapped(false);
  }, []);
  
  const handleMouseDown = useCallback(() => setIsTapped(true), []);
  const handleMouseUp = useCallback(() => setIsTapped(false), []);

  return {
    isHovered,
    isTapped,
    handleMouseEnter,
    handleMouseLeave,
    handleMouseDown,
    handleMouseUp
  };
};

// ✅ Custom hook for image optimization
const useOptimizedImage = (src) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [imageSrc, setImageSrc] = useState('');

  useEffect(() => {
    if (!src) {
      setImageError(true);
      return;
    }

    setImageSrc('');
    setImageLoaded(false);
    setImageError(false);

    const img = new Image();
    img.src = src;

    img.onload = () => {
      setImageSrc(src);
      setImageLoaded(true);
    };

    img.onerror = () => {
      setImageError(true);
      setImageLoaded(true);
    };

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [src]);

  return { imageSrc, imageLoaded, imageError };
};

// ✅ Shimmer loading component
const ShimmerLoader = memo(() => (
  <div className="absolute inset-0 bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 animate-pulse">
    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-600/20 to-transparent animate-shimmer" />
  </div>
));

ShimmerLoader.displayName = 'ShimmerLoader';

// ✅ Main CardProject Component - FIXED icon visibility
const CardProject = memo(({ 
  Img, 
  Title, 
  Description, 
  onImageClick,
  demoUrl,
  githubUrl,
  className = '',
  priority = false
}) => {
  const cardRef = useRef(null);
  const {
    isHovered,
    isTapped,
    handleMouseEnter,
    handleMouseLeave,
    handleMouseDown,
    handleMouseUp
  } = useHoverScale();

  const { imageSrc, imageLoaded, imageError } = useOptimizedImage(Img);

  // ✅ Handle image click with ripple effect
  const handleClick = useCallback((e) => {
    if (onImageClick) {
      const card = cardRef.current;
      if (card) {
        const ripple = document.createElement('span');
        const rect = card.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        ripple.style.cssText = `
          position: absolute;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.5);
          transform: scale(0);
          animation: ripple 600ms linear;
          width: ${size}px;
          height: ${size}px;
          top: ${y}px;
          left: ${x}px;
          pointer-events: none;
          z-index: 10;
        `;

        card.style.position = 'relative';
        card.style.overflow = 'hidden';
        card.appendChild(ripple);

        setTimeout(() => {
          if (card.contains(ripple)) {
            card.removeChild(ripple);
          }
        }, 600);
      }
      onImageClick();
    }
  }, [onImageClick]);

  // ✅ Smooth scroll into view when component mounts
  useEffect(() => {
    if (priority && cardRef.current) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            if (Img && !imageLoaded && !imageError) {
              const img = new Image();
              img.src = Img;
            }
            observer.disconnect();
          }
        },
        { rootMargin: '100px' }
      );

      observer.observe(cardRef.current);
      return () => observer.disconnect();
    }
  }, [priority, Img, imageLoaded, imageError]);

  // ✅ Keyboard navigation support
  const handleKeyPress = useCallback((e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick(e);
    }
  }, [handleClick]);

  return (
    <div
      ref={cardRef}
      className={`
        group relative bg-slate-800/40 backdrop-blur-sm rounded-2xl 
        border border-slate-700/30 overflow-hidden
        transition-all duration-300 ease-out
        hover:border-blue-500/50 hover:bg-slate-800/60
        hover:shadow-2xl hover:shadow-blue-500/10
        active:scale-[0.98]
        ${isHovered ? 'transform-gpu scale-[1.02]' : 'transform-gpu scale-100'}
        ${isTapped ? 'scale-[0.98]' : ''}
        ${className}
      `}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      role="article"
      aria-label={`Project: ${Title}`}
    >
      {/* ✅ Background Gradient Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* ✅ Image Container */}
      <div 
        className="relative aspect-video overflow-hidden cursor-pointer bg-slate-900"
        onClick={handleClick}
        onKeyDown={handleKeyPress} {/* ✅ FIXED: Changed from onKeyPress to onKeyDown */}
        tabIndex={0}
        role="button"
        aria-label={`View ${Title} project details`}
      >
        {/* ✅ Loading State */}
        {!imageLoaded && !imageError && <ShimmerLoader />}
        
        {/* ✅ Error State */}
        {imageError ? (
          <div className="w-full h-full flex items-center justify-center bg-slate-800/50">
            <div className="text-center text-slate-500">
              <div className="text-2xl mb-2">🖼️</div>
              <div className="text-sm">Image not available</div>
            </div>
          </div>
        ) : (
          // ✅ Optimized Image
          imageSrc && (
            <img
              src={imageSrc}
              alt={`${Title} project screenshot`}
              loading={priority ? "eager" : "lazy"}
              decoding="async"
              className={`
                w-full h-full object-cover transition-all duration-500 ease-out
                ${imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'}
                group-hover:scale-110
              `}
            />
          )
        )}

        {/* ✅ FIXED: Hover Overlay with Icons - Improved visibility */}
        <div className={`
          absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20
          flex items-center justify-center gap-4
          transition-all duration-300 ease-out
          ${isHovered ? 'opacity-100' : 'opacity-0 pointer-events-none'}
        `}>
          
          {/* ✅ FIXED: View Details Button (Always visible on hover) */}
          <button
            onClick={handleClick}
            className="
              px-6 py-3 bg-white/95 text-slate-900 rounded-xl font-semibold text-sm
              transform-gpu transition-all duration-200 ease-out
              hover:bg-white hover:scale-105 active:scale-95
              focus:outline-none focus:ring-2 focus:ring-white/50
              shadow-lg hover:shadow-xl
              flex items-center gap-2
            "
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            View Details
          </button>

          {/* ✅ FIXED: Action Buttons Container */}
          <div className="flex gap-3">
            {demoUrl && (
              <a
                href={demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="
                  w-12 h-12 bg-blue-600/90 text-white rounded-xl
                  transform-gpu transition-all duration-200 ease-out
                  hover:bg-blue-500 hover:scale-105 active:scale-95
                  focus:outline-none focus:ring-2 focus:ring-blue-500/50
                  flex items-center justify-center
                  shadow-lg hover:shadow-xl
                "
                onClick={(e) => e.stopPropagation()}
                aria-label="View live demo"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            )}
            
            {githubUrl && (
              <a
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="
                  w-12 h-12 bg-slate-800/90 text-white rounded-xl
                  transform-gpu transition-all duration-200 ease-out
                  hover:bg-slate-700 hover:scale-105 active:scale-95
                  focus:outline-none focus:ring-2 focus:ring-slate-500/50
                  flex items-center justify-center
                  shadow-lg hover:shadow-xl
                "
                onClick={(e) => e.stopPropagation()}
                aria-label="View source code"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </a>
            )}
          </div>
        </div>
      </div>

      {/* ✅ Content Section */}
      <div className="p-6 relative z-10">
        {/* ✅ Title */}
        <h3 className="
          text-xl font-bold text-white mb-3 
          transition-colors duration-200
          group-hover:text-transparent group-hover:bg-clip-text 
          group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-purple-400
        ">
          {Title}
        </h3>

        {/* ✅ Description */}
        <p className="
          text-slate-300 leading-relaxed mb-6 line-clamp-4
          transition-colors duration-200 group-hover:text-slate-200
        ">
          {Description}
        </p>

        {/* ✅ Interactive Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-700/30">
          <span className="text-slate-400 text-sm group-hover:text-slate-300 transition-colors">
            Click to view details
          </span>
          <div className="
            w-8 h-8 rounded-full bg-slate-700/50 flex items-center justify-center
            transform-gpu transition-all duration-200 ease-out
            group-hover:bg-blue-500/20 group-hover:scale-110
            group-hover:rotate-12
          ">
            <svg 
              className="w-4 h-4 text-slate-400 group-hover:text-blue-400 transition-colors" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </div>
        </div>
      </div>

      {/* ✅ Glow effect */}
      <div className="
        absolute inset-0 rounded-2xl pointer-events-none
        bg-gradient-to-r from-blue-500/0 via-purple-500/0 to-pink-500/0
        group-hover:from-blue-500/10 group-hover:via-purple-500/5 group-hover:to-pink-500/10
        transition-all duration-500 ease-out
        opacity-0 group-hover:opacity-100
      " />

      {/* ✅ FIXED: Move inline styles to proper CSS-in-JS */}
      <style jsx>{`
        @keyframes ripple {
          to {
            transform: scale(4);
            opacity: 0;
          }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite linear;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.1),
            transparent
          );
          background-size: 1000px 100%;
        }
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        .line-clamp-4 {
          display: -webkit-box;
          -webkit-line-clamp: 4;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
});

// ✅ Display name for better debugging
CardProject.displayName = 'CardProject';

export default CardProject;