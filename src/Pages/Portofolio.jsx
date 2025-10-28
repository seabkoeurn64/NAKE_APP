// src/Pages/Portofolio.jsx - WITH NEW BACKGROUND DESIGN
import React, { memo, useCallback, useState, useEffect, useRef, useMemo } from 'react';

// ✅ SIMPLIFIED: Using WebP directly since you have all WebP files
const useOptimizedImage = (src) => {
  const [optimizedSrc, setOptimizedSrc] = useState(src);

  useEffect(() => {
    // Since all images are WebP, use them directly
    setOptimizedSrc(src);
  }, [src]);

  const handleWebPError = useCallback(() => {
    console.warn('WebP image failed to load:', src);
  }, [src]);

  return { optimizedSrc, handleWebPError };
};

// ✅ Custom hook for intersection observer
const useIntersectionObserver = (options = {}) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
    }, {
      threshold: 0.1,
      rootMargin: '50px',
      ...options
    });

    observer.observe(element);
    return () => observer.disconnect();
  }, [options]);

  return [ref, isIntersecting];
};

// ✅ Custom hook for image preloading
const useImagePreloader = (src, priority = false) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const { optimizedSrc } = useOptimizedImage(src);

  useEffect(() => {
    if (!optimizedSrc || !priority) return;

    const img = new Image();
    img.src = optimizedSrc;
    img.onload = () => setLoaded(true);
    img.onerror = () => setError(true);
  }, [optimizedSrc, priority]);

  return { loaded, error };
};

// ✅ Optimized Image Modal Component
const ImageModal = memo(({ imageUrl, title, isOpen, onClose }) => {
  const modalRef = useRef(null);
  const { optimizedSrc, handleWebPError } = useOptimizedImage(imageUrl);

  const handleBackdropClick = useCallback((e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  }, [onClose]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') {
      onClose();
    }
  }, [onClose]);

  // Focus trap and body scroll lock
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      
      if (modalRef.current) {
        modalRef.current.focus();
      }
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div 
      ref={modalRef}
      className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
      onKeyDown={handleKeyDown}
      tabIndex={-1}
      role="dialog"
      aria-label={`Full size image of ${title}`}
      aria-modal="true"
    >
      <div className="relative max-w-4xl max-h-full w-full h-auto">
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-all duration-200 p-2 sm:-top-16 sm:right-4 hover:scale-110 active:scale-95 transform-gpu"
          aria-label="Close modal"
        >
          <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        <img
          src={optimizedSrc}
          alt={title}
          className="w-full h-auto max-h-[70vh] sm:max-h-[80vh] object-contain rounded-lg transform-gpu"
          loading="eager"
          onError={handleWebPError}
        />
        
        <div className="text-white text-center mt-3 sm:mt-4">
          <p className="text-base sm:text-lg font-semibold">{title}</p>
        </div>
      </div>
    </div>
  );
});

ImageModal.displayName = 'ImageModal';

// ✅ Shimmer loading component
const ShimmerLoader = memo(() => (
  <div className="absolute inset-0 bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 animate-pulse">
    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-600/20 to-transparent animate-shimmer" />
  </div>
));

ShimmerLoader.displayName = 'ShimmerLoader';

// ✅ Optimized Project Card Component with WebP Support
const ProjectCard = memo(({ project, index, onImageClick }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [cardRef, isCardVisible] = useIntersectionObserver();
  const { loaded: preloaded } = useImagePreloader(project.image, index < 3);
  const { optimizedSrc, handleWebPError } = useOptimizedImage(project.image);

  const handleImageLoad = useCallback(() => {
    setImageLoaded(true);
  }, []);

  const handleImageError = useCallback(() => {
    setImageError(true);
    setImageLoaded(true);
  }, []);

  const handleCombinedError = useCallback((e) => {
    handleWebPError();
    handleImageError(e);
  }, [handleWebPError, handleImageError]);

  const handleImageClick = useCallback(() => {
    onImageClick(project.image, project.title);
  }, [onImageClick, project.image, project.title]);

  // Load image when card becomes visible
  useEffect(() => {
    if (isCardVisible && !imageLoaded && !imageError) {
      const img = new Image();
      img.src = optimizedSrc;
      img.onload = handleImageLoad;
      img.onerror = handleCombinedError;
    }
  }, [isCardVisible, optimizedSrc, imageLoaded, imageError, handleImageLoad, handleCombinedError]);

  return (
    <article 
      ref={cardRef}
      className="group relative bg-slate-800/40 backdrop-blur-sm rounded-2xl border border-slate-700/30 overflow-hidden hover:border-purple-500/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20 active:scale-95 transform-gpu will-change-transform"
      style={{ 
        animationDelay: `${index * 50}ms`,
        animationFillMode: 'both'
      }}
    >
      {/* Image Container */}
      <div 
        className="relative aspect-[4/3] w-full overflow-hidden bg-gradient-to-br from-slate-700/50 to-slate-600/50 cursor-pointer"
        onClick={handleImageClick}
        role="button"
        tabIndex={0}
        aria-label={`View full size image of ${project.title}`}
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleImageClick()}
      >
        {/* Loading State */}
        {!imageLoaded && !imageError && (
          <ShimmerLoader />
        )}
        
        {/* Error State */}
        {imageError ? (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-700">
            <div className="text-slate-400 text-center p-4">
              <div className="text-2xl sm:text-3xl mb-2">📷</div>
              <p className="text-xs sm:text-sm">Image not available</p>
            </div>
          </div>
        ) : (
          <img
            src={optimizedSrc}
            alt={project.title}
            onLoad={handleImageLoad}
            onError={handleCombinedError}
            className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 transform-gpu will-change-transform ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            loading={index < 3 ? "eager" : "lazy"}
          />
        )}
        
        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform-gpu scale-90 group-hover:scale-100">
            <div className="bg-white/10 backdrop-blur-sm rounded-full p-3 border border-white/20">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v0" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-6 lg:p-8 space-y-3 sm:space-y-4">
        <div className="space-y-2 sm:space-y-3">
          <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-white line-clamp-2 group-hover:text-purple-400 transition-colors duration-300">
            {project.title}
          </h3>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed line-clamp-3 group-hover:text-slate-200 transition-colors duration-300">
            {project.description}
          </p>
        </div>
      </div>
    </article>
  );
});

ProjectCard.displayName = 'ProjectCard';

// ✅ Projects Data with WebP Images
const PROJECTS_DATA = [
  {
    id: 1,
    title: "E-Commerce Platform",
    description: "Full-stack e-commerce solution with modern technologies, payment processing, and admin dashboard.",
    image: "/images/project1.webp" // ✅ Using WebP directly
  },
  {
    id: 2,
    title: "Mobile Fitness App",
    description: "Cross-platform mobile application for fitness tracking, workout plans, and progress monitoring.",
    image: "/images/project2.webp" // ✅ Using WebP directly
  },
  {
    id: 3,
    title: "AI Content Generator",
    description: "AI-powered content generation tool with natural language processing and customizable templates.",
    image: "/images/project3.webp" // ✅ Using WebP directly
  },
  {
    id: 4,
    title: "Task Management",
    description: "Collaborative task management app with real-time updates and team collaboration features.",
    image: "/images/project4.webp" // ✅ Using WebP directly
  },
  {
    id: 5,
    title: "Weather Dashboard",
    description: "Responsive weather application with location-based forecasts and interactive maps.",
    image: "/images/project5.webp" // ✅ Using WebP directly
  },
  {
    id: 6,
    title: "Social Analytics",
    description: "Dashboard for analyzing social media performance with real-time metrics and reporting.",
    image: "/images/project6.webp" // ✅ Using WebP directly
  },
  {
    id: 7,
    title: "Social Analytics",
    description: "Dashboard for analyzing social media performance with real-time metrics and reporting.",
    image: "/images/project7.webp" // ✅ Using WebP directly
  }
];

// ✅ NEW: Background Elements Component
const PortfolioBackground = memo(() => {
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReducedMotion(mediaQuery.matches);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Main gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#030014] via-[#0f0a28] to-[#1a1039]" />
      
      {/* Animated gradient overlay */}
      <div 
        className="absolute inset-0 opacity-20"
        style={!isReducedMotion ? {
          background: 'linear-gradient(45deg, #6366f1, #8b5cf6, #a855f7, #ec4899)',
          backgroundSize: '400% 400%',
          animation: 'portfolioGradient 8s ease infinite'
        } : {}}
      />
      
      {/* Floating shapes */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl" 
           style={{ animation: 'portfolioFloat 6s ease-in-out infinite' }} />
      <div className="absolute top-40 right-20 w-48 h-48 bg-pink-500/10 rounded-full blur-2xl" 
           style={{ animation: 'portfolioFloat 8s ease-in-out infinite 1s' }} />
      <div className="absolute bottom-32 left-1/4 w-56 h-56 bg-blue-500/10 rounded-full blur-3xl" 
           style={{ animation: 'portfolioFloat 7s ease-in-out infinite 0.5s' }} />
      <div className="absolute bottom-20 right-32 w-40 h-40 bg-indigo-500/10 rounded-full blur-2xl" 
           style={{ animation: 'portfolioFloat 9s ease-in-out infinite 1.5s' }} />
      
      {/* Grid pattern */}
      <div className="absolute inset-0 opacity-5">
        <div 
          className="w-full h-full"
          style={!isReducedMotion ? {
            backgroundImage: 'linear-gradient(#6366f1 1px, transparent 1px), linear-gradient(90deg, #6366f1 1px, transparent 1px)',
            backgroundSize: '50px 50px',
            animation: 'portfolioGridMove 20s linear infinite'
          } : {}}
        />
      </div>
      
      {/* Sparkle effects */}
      <div className="absolute top-1/4 left-1/3 w-2 h-2 bg-white rounded-full opacity-60" 
           style={{ animation: 'portfolioSparkle 3s ease-in-out infinite' }} />
      <div className="absolute top-1/3 right-1/4 w-1.5 h-1.5 bg-purple-300 rounded-full opacity-70" 
           style={{ animation: 'portfolioSparkle 4s ease-in-out infinite 0.7s' }} />
      <div className="absolute bottom-1/4 left-1/2 w-1 h-1 bg-blue-300 rounded-full opacity-80" 
           style={{ animation: 'portfolioSparkle 3.5s ease-in-out infinite 1.2s' }} />
    </div>
  );
});

PortfolioBackground.displayName = 'PortfolioBackground';

// ✅ Main Portfolio Component
const Portofolio = memo(() => {
  const [visibleCount, setVisibleCount] = useState(6);
  const [modalImage, setModalImage] = useState({ url: '', title: '' });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const sectionRef = useRef(null);
  const loadMoreRef = useRef(null);

  // Memoized displayed projects
  const displayedProjects = useMemo(() => 
    PROJECTS_DATA.slice(0, visibleCount), 
    [visibleCount]
  );

  const hasMoreProjects = visibleCount < PROJECTS_DATA.length;

  // Smooth scroll for navbar link
  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#portfolio' && sectionRef.current) {
        sectionRef.current.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }
    };

    if (window.location.hash === '#portfolio') {
      setTimeout(handleHashChange, 100);
    }

    window.addEventListener('hashchange', handleHashChange);
    
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  // Intersection Observer for load more button
  useEffect(() => {
    if (!hasMoreProjects || !loadMoreRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          handleShowMore();
        }
      },
      { threshold: 0.5, rootMargin: '100px' }
    );

    observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [hasMoreProjects]);

  const handleShowMore = useCallback(() => {
    setVisibleCount(prev => Math.min(prev + 3, PROJECTS_DATA.length));
  }, []);

  const handleImageClick = useCallback((imageUrl, title) => {
    setModalImage({ url: imageUrl, title });
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setTimeout(() => {
      setModalImage({ url: '', title: '' });
    }, 300);
  }, []);

  return (
    <>
      <section 
        ref={sectionRef}
        id="portfolio" 
        className="min-h-screen py-12 sm:py-16 lg:py-20 relative overflow-hidden scroll-mt-20"
      >
        {/* ✅ NEW: Enhanced Background */}
        <PortfolioBackground />
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Header */}
          <div className="text-center mb-12 sm:mb-16 lg:mb-20">
            <div className="inline-block relative group mb-6">
              <div className="absolute -inset-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full opacity-10 blur-xl group-hover:opacity-20 transition-opacity duration-500" />
              <h2 className="relative text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6">
                My <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-rose-500">Portfolio</span>
              </h2>
            </div>
            <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed px-4 font-light">
              A collection of creative projects that showcase innovative design solutions and technical expertise.
            </p>
          </div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8 lg:gap-10 max-w-7xl mx-auto">
            {displayedProjects.map((project, index) => (
              <ProjectCard
                key={project.id}
                project={project}
                index={index}
                onImageClick={handleImageClick}
              />
            ))}
          </div>

          {/* Load More Button */}
          {hasMoreProjects && (
            <div ref={loadMoreRef} className="text-center mt-16 sm:mt-20 lg:mt-24">
              <button
                onClick={handleShowMore}
                className="group relative px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-2xl font-semibold text-base transition-all duration-500 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-[#030014] transform-gpu will-change-transform overflow-hidden"
              >
                {/* Button shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 transition-all duration-1000 group-hover:translate-x-full" />
                <span className="relative z-10">Load More Projects</span>
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Image Modal */}
      <ImageModal
        imageUrl={modalImage.url}
        title={modalImage.title}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />

      <style>
        {`
          @keyframes portfolioGradient {
            0%, 100% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
          }
          
          @keyframes portfolioFloat {
            0%, 100% { transform: translateY(0px) rotate(0deg) scale(1); }
            33% { transform: translateY(-20px) rotate(120deg) scale(1.1); }
            66% { transform: translateY(10px) rotate(240deg) scale(0.9); }
          }
          
          @keyframes portfolioGridMove {
            0% { transform: translate(0, 0); }
            100% { transform: translate(50px, 50px); }
          }
          
          @keyframes portfolioSparkle {
            0%, 100% { opacity: 0; transform: scale(0) rotate(0deg); }
            50% { opacity: 1; transform: scale(1) rotate(180deg); }
          }

          @keyframes fade-in {
            from { opacity: 0; }
            to { opacity: 1; }
          }

          @keyframes shimmer {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
          
          .animate-shimmer {
            animation: shimmer 2s infinite;
          }

          .will-change-transform {
            will-change: transform;
          }

          /* Reduced motion support */
          @media (prefers-reduced-motion: reduce) {
            .portfolio-float-slow,
            .portfolio-gradient-slow,
            .portfolio-grid-move,
            .portfolio-sparkle,
            .animate-shimmer {
              animation: none !important;
            }
          }
        `}
      </style>
    </>
  );
});

Portofolio.displayName = 'Portofolio';

export default Portofolio;