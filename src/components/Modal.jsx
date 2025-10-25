import React, { useState, useEffect, useCallback, memo, useRef } from 'react';
import { Eye, ArrowRight, ExternalLink, X } from 'lucide-react';

const ProjectCardModal = memo(({ title, description, link, image, technologies = [] }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const modalRef = useRef(null);
  const previousFocusRef = useRef(null);

  // Debounced mobile detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    
    const debouncedResize = debounce(checkMobile, 100);
    window.addEventListener('resize', debouncedResize);
    
    return () => window.removeEventListener('resize', debouncedResize);
  }, []);

  // Enhanced body scroll lock and focus management
  useEffect(() => {
    if (isOpen) {
      // Store current focused element
      previousFocusRef.current = document.activeElement;
      
      // Lock body scroll
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = `${getScrollbarWidth()}px`;
      
      // Add backdrop
      document.body.classList.add('modal-open');
      
      // Set visible after mount for animation
      setTimeout(() => setIsVisible(true), 10);
      
      // Focus trap
      const focusableElements = modalRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusableElements?.length) {
        focusableElements[0]?.focus();
      }
    } else {
      // Restore body styles
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
      document.body.classList.remove('modal-open');
      
      // Restore focus
      previousFocusRef.current?.focus();
    }

    return () => {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
      document.body.classList.remove('modal-open');
    };
  }, [isOpen]);

  // Enhanced escape key handler
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }
    
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  // Enhanced outside click handler
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target) && isOpen) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen]);

  const handleOpen = useCallback(() => {
    setIsOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setIsVisible(false);
    // Delay closing to allow animation
    setTimeout(() => setIsOpen(false), 300);
  }, []);

  const handleModalClick = useCallback((e) => {
    e.stopPropagation();
  }, []);

  const handleLiveDemoClick = useCallback((e) => {
    e.stopPropagation();
    // Analytics tracking example
    console.log(`Live demo clicked for: ${title}`);
    
    // Optional: Add delay for animation before navigation
    setTimeout(() => {
      window.open(link, '_blank', 'noopener,noreferrer');
    }, 150);
  }, [title, link]);

  // Calculate scrollbar width to prevent layout shift
  const getScrollbarWidth = () => {
    return window.innerWidth - document.documentElement.clientWidth;
  };

  // Debounce utility
  const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  };

  return (
    <>
      {/* Enhanced Trigger Button */}
      <button
        className="group inline-flex items-center space-x-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/90 transition-all duration-300 border border-white/10 hover:border-white/20 backdrop-blur-sm touch-manipulation active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 focus:ring-offset-gray-900"
        onClick={handleOpen}
        aria-label={`View details for ${title}`}
        aria-haspopup="dialog"
      >
        <Eye className="w-3 h-3 sm:w-4 sm:h-4 group-hover:scale-110 transition-transform duration-300" />
        <span className="text-xs sm:text-sm font-medium">Details</span>
        <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 group-hover:translate-x-0.5 transition-transform duration-300" />
      </button>

      {/* Modal Overlay */}
      {isOpen && (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-300 ${
            isVisible 
              ? 'bg-black/70 backdrop-blur-md opacity-100' 
              : 'bg-black/0 backdrop-blur-0 opacity-0'
          }`}
          onClick={handleClose}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          aria-describedby="modal-description"
        >
          {/* Modal Content */}
          <div
            ref={modalRef}
            className={`relative w-full max-w-lg rounded-2xl bg-gradient-to-br from-gray-900/95 via-gray-800/95 to-gray-900/95 backdrop-blur-xl border border-white/10 shadow-2xl overflow-hidden transform transition-all duration-300 ${
              isVisible 
                ? 'opacity-100 scale-100 translate-y-0' 
                : 'opacity-0 scale-95 translate-y-4'
            }`}
            onClick={handleModalClick}
          >
            {/* Enhanced Header */}
            <div className="border-b border-white/10 p-4 sm:p-6 bg-gradient-to-r from-white/5 to-transparent">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <h2 
                    id="modal-title"
                    className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent truncate"
                    title={title}
                  >
                    {title}
                  </h2>
                </div>
                <button
                  className="flex-shrink-0 rounded-xl p-2 hover:bg-white/10 transition-all duration-300 touch-manipulation active:scale-95 group focus:outline-none focus:ring-2 focus:ring-white/50 ml-4"
                  onClick={handleClose}
                  aria-label="Close modal"
                >
                  <X className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 group-hover:text-white transition-colors duration-300" />
                </button>
              </div>
            </div>

            {/* Enhanced Content Area */}
            <div className="max-h-[60vh] overflow-y-auto custom-scrollbar">
              {/* Optional Image Section */}
              {image && (
                <div className="p-4 sm:p-6 pb-0">
                  <div className="rounded-lg overflow-hidden border border-white/10 bg-black/20">
                    <img 
                      src={image} 
                      alt={`${title} project screenshot`}
                      className="w-full h-32 sm:h-40 object-cover"
                      loading="lazy"
                    />
                  </div>
                </div>
              )}

              {/* Description */}
              <div className="p-4 sm:p-6">
                <p 
                  id="modal-description"
                  className="text-gray-300 text-sm sm:text-base leading-relaxed font-light"
                >
                  {description}
                </p>
                
                {/* Optional Technologies */}
                {technologies.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {technologies.map((tech, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-blue-500/10 text-blue-300 text-xs rounded-md border border-blue-500/20"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Enhanced Actions */}
            <div className="border-t border-white/10 p-4 sm:p-6 bg-gradient-to-r from-transparent to-white/5">
              <div className={`flex flex-col sm:flex-row gap-3 ${isMobile ? 'space-y-3' : 'space-x-4 justify-end'}`}>
                <a
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative inline-flex items-center justify-center space-x-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 rounded-xl text-white font-medium transition-all duration-300 touch-manipulation active:scale-95 overflow-hidden focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800"
                  onClick={handleLiveDemoClick}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <span className="relative text-sm sm:text-base">Live Demo</span>
                  <ExternalLink className="relative w-3 h-3 sm:w-4 sm:h-4 group-hover:scale-110 transition-transform duration-300" />
                </a>
                
                <button
                  className="inline-flex items-center justify-center px-4 sm:px-6 py-2.5 sm:py-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-xl text-white font-medium transition-all duration-300 touch-manipulation active:scale-95 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-gray-800"
                  onClick={handleClose}
                >
                  <span className="text-sm sm:text-base">Close</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced CSS for better animations and scrollbar */}
      <style jsx>{`
        .modal-open {
          overflow: hidden;
        }
        
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 3px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 3px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.3);
        }
        
        /* Reduced motion support */
        @media (prefers-reduced-motion: reduce) {
          .transition-all, .transform, .animate-fade-in, .animate-slide-up {
            transition: none !important;
            animation: none !important;
          }
        }
      `}</style>
    </>
  );
});

// Default props for better error handling
ProjectCardModal.defaultProps = {
  technologies: [],
  image: null
};

export default ProjectCardModal;