// src/Pages/Portofolio.jsx - FIXED VERSION (NO WARNINGS)
import React, { memo, useCallback, useState, useEffect, useRef, useMemo } from 'react';

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

  useEffect(() => {
    if (!src || !priority) return;

    const img = new Image();
    img.src = src;
    img.onload = () => setLoaded(true);
    img.onerror = () => setError(true);
  }, [src, priority]);

  return { loaded, error };
};

// ✅ Optimized Image Modal Component
const ImageModal = memo(({ imageUrl, title, isOpen, onClose }) => {
  const modalRef = useRef(null);

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
          src={imageUrl}
          alt={title}
          className="w-full h-auto max-h-[70vh] sm:max-h-[80vh] object-contain rounded-lg transform-gpu"
          loading="eager"
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

// ✅ Optimized Project Card Component - FIXED fetchPriority warning
const ProjectCard = memo(({ project, index, onImageClick }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [cardRef, isCardVisible] = useIntersectionObserver();
  const { loaded: preloaded } = useImagePreloader(project.image, index < 3);

  const handleImageLoad = useCallback(() => {
    setImageLoaded(true);
  }, []);

  const handleImageError = useCallback(() => {
    setImageError(true);
    setImageLoaded(true);
  }, []);

  const handleImageClick = useCallback(() => {
    onImageClick(project.image, project.title);
  }, [onImageClick, project.image, project.title]);

  // Load image when card becomes visible
  useEffect(() => {
    if (isCardVisible && !imageLoaded && !imageError) {
      const img = new Image();
      img.src = project.image;
      img.onload = handleImageLoad;
      img.onerror = handleImageError;
    }
  }, [isCardVisible, project.image, imageLoaded, imageError, handleImageLoad, handleImageError]);

  return (
    <article 
      ref={cardRef}
      className="group relative bg-slate-800/40 backdrop-blur-sm rounded-2xl border border-slate-700/30 overflow-hidden hover:border-blue-500/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/10 active:scale-95 transform-gpu will-change-transform"
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
          // ✅ FIXED: Remove fetchPriority prop - use loading attribute instead
          <img
            src={project.image}
            alt={project.title}
            onLoad={handleImageLoad}
            onError={handleImageError}
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
          <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-white line-clamp-2 group-hover:text-blue-400 transition-colors duration-300">
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

// ✅ Projects Data with Images
const PROJECTS_DATA = [
  {
    id: 1,
    title: "E-Commerce Platform",
    description: "Full-stack e-commerce solution with modern technologies, payment processing, and admin dashboard.",
    image: "/images/project1.png"
  },
  {
    id: 2,
    title: "Mobile Fitness App",
    description: "Cross-platform mobile application for fitness tracking, workout plans, and progress monitoring.",
    image: "/images/project2.png"
  },
  {
    id: 3,
    title: "AI Content Generator",
    description: "AI-powered content generation tool with natural language processing and customizable templates.",
    image: "/images/project3.jpg"
  },
  {
    id: 4,
    title: "Task Management",
    description: "Collaborative task management app with real-time updates and team collaboration features.",
    image: "/images/project4.jpg"
  },
  {
    id: 5,
    title: "Weather Dashboard",
    description: "Responsive weather application with location-based forecasts and interactive maps.",
    image: "/images/project5.jpg"
  },
  {
    id: 6,
    title: "Social Analytics",
    description: "Dashboard for analyzing social media performance with real-time metrics and reporting.",
    image: "/images/project6.jpg"
  }
];

// ✅ Main Portfolio Component - FIXED jsx warning
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
        className="min-h-screen py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden scroll-mt-20"
      >
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5" />
        <div className="absolute top-1/4 -left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-1/4 -right-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse-slow" />
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Header */}
          <div className="text-center mb-12 sm:mb-16 lg:mb-20">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6">
              My <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">Portfolio</span>
            </h2>
            <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed px-4">
              A collection of projects that showcase my skills in modern web development and problem-solving.
            </p>
          </div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 max-w-7xl mx-auto">
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
            <div ref={loadMoreRef} className="text-center mt-12 sm:mt-16 lg:mt-20">
              <button
                onClick={handleShowMore}
                className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-semibold text-sm sm:text-base transition-all duration-300 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900 transform-gpu will-change-transform"
              >
                Load More Projects
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

      {/* ✅ FIXED: Move inline styles to CSS classes to avoid jsx prop warning */}
      <style>
        {`
          @keyframes fade-in {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes scale-in {
            from { transform: scale(0.9); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
          }
          @keyframes pulse-slow {
            0%, 100% { opacity: 0.3; }
            50% { opacity: 0.6; }
          }
          @keyframes gradient {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          @keyframes shimmer {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
          .animate-shimmer {
            animation: shimmer 2s infinite;
          }
          .animate-pulse-slow {
            animation: pulse-slow 4s ease-in-out infinite;
          }
          .will-change-transform {
            will-change: transform;
          }
        `}
      </style>
    </>
  );
});

// ✅ Performance optimizations
Portofolio.displayName = 'Portofolio';

// ✅ MUST HAVE DEFAULT EXPORT
export default Portofolio;