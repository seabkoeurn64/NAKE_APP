import React, { useState, useEffect, useCallback, memo } from 'react';
import { Eye, ArrowRight, ExternalLink, X } from 'lucide-react';

const ProjectCardModal = memo(({ title, description, link }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Handle body scroll lock
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  const handleOpen = useCallback(() => {
    setIsOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  const handleModalClick = useCallback((e) => {
    e.stopPropagation();
  }, []);

  const handleLiveDemoClick = useCallback((e) => {
    e.stopPropagation();
    // Additional tracking or analytics can be added here
  }, []);

  return (
    <>
      {/* Trigger Button */}
      <button
        className="group inline-flex items-center space-x-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/90 transition-all duration-300 border border-white/10 hover:border-white/20 backdrop-blur-sm touch-manipulation active:scale-95"
        onClick={handleOpen}
        aria-label={`View details for ${title}`}
      >
        <span className="text-xs sm:text-sm font-medium">Details</span>
        <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 group-hover:translate-x-0.5 transition-transform duration-300" />
      </button>

      {/* Modal Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in p-4"
          onClick={handleClose}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          {/* Modal Content */}
          <div
            className="relative w-full max-w-md rounded-2xl bg-gradient-to-br from-gray-900/95 to-gray-800/95 backdrop-blur-xl border border-white/10 shadow-2xl animate-slide-up overflow-hidden"
            onClick={handleModalClick}
          >
            {/* Header */}
            <div className="border-b border-white/10 p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <h2 
                  id="modal-title"
                  className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent pr-2"
                >
                  {title}
                </h2>
                <button
                  className="flex-shrink-0 rounded-xl p-2 hover:bg-white/10 transition-all duration-300 touch-manipulation active:scale-95 group"
                  onClick={handleClose}
                  aria-label="Close modal"
                >
                  <X className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 group-hover:text-white transition-colors duration-300" />
                </button>
              </div>
            </div>

            {/* Description */}
            <div className="p-4 sm:p-6">
              <p className="text-gray-300 text-sm sm:text-base leading-relaxed font-light">
                {description}
              </p>
            </div>

            {/* Actions */}
            <div className="border-t border-white/10 p-4 sm:p-6">
              <div className={`flex flex-col sm:flex-row gap-3 ${isMobile ? 'space-y-3' : 'space-x-4 justify-end'}`}>
                <a
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative inline-flex items-center justify-center space-x-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 rounded-xl text-white font-medium transition-all duration-300 touch-manipulation active:scale-95 overflow-hidden"
                  onClick={handleLiveDemoClick}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <span className="relative text-sm sm:text-base">Live Demo</span>
                  <ExternalLink className="relative w-3 h-3 sm:w-4 sm:h-4 group-hover:scale-110 transition-transform duration-300" />
                </a>
                
                <button
                  className="inline-flex items-center justify-center px-4 sm:px-6 py-2.5 sm:py-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-xl text-white font-medium transition-all duration-300 touch-manipulation active:scale-95 backdrop-blur-sm"
                  onClick={handleClose}
                >
                  <span className="text-sm sm:text-base">Close</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Inline styles for animations */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
        .animate-slide-up {
          animation: slide-up 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
      `}</style>
    </>
  );
});

export default ProjectCardModal;