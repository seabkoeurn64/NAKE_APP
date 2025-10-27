import React, { useState, useEffect, useCallback, memo, useRef } from 'react';
import { Eye, ArrowRight, ExternalLink, X, Github, Figma, Play, Calendar, Users, Clock } from 'lucide-react';
import PropTypes from 'prop-types';

// Utility functions moved to separate module
const modalUtils = {
  getScrollbarWidth: () => window.innerWidth - document.documentElement.clientWidth,
  
  lockBodyScroll: () => {
    const scrollBarWidth = modalUtils.getScrollbarWidth();
    document.body.style.overflow = 'hidden';
    document.body.style.paddingRight = `${scrollBarWidth}px`;
    document.body.classList.add('modal-open');
  },
  
  unlockBodyScroll: () => {
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
    document.body.classList.remove('modal-open');
  },
  
  throttle: (func, limit) => {
    let inThrottle;
    return function(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }
};

// Custom hook for mobile detection
const useMobileDetection = () => {
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
    };
    
    checkMobile();
    const throttledResize = modalUtils.throttle(checkMobile, 100);
    window.addEventListener('resize', throttledResize);
    
    return () => window.removeEventListener('resize', throttledResize);
  }, []);
  
  return isMobile;
};

// Error Boundary Component
const ModalErrorBoundary = memo(({ children, fallback = null }) => {
  const [hasError, setHasError] = useState(false);
  
  useEffect(() => {
    const handleError = () => setHasError(true);
    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);
  
  if (hasError) return fallback;
  return children;
});

ModalErrorBoundary.displayName = 'ModalErrorBoundary';

// Configuration objects
const statusConfig = {
  completed: { label: 'Completed', color: 'bg-green-500/20 text-green-300 border-green-500/30' },
  'in-progress': { label: 'In Progress', color: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30' },
  planned: { label: 'Planned', color: 'bg-blue-500/20 text-blue-300 border-blue-500/30' }
};

const categoryConfig = {
  web: { label: 'Web App', color: 'bg-purple-500/20 text-purple-300 border-purple-500/30' },
  mobile: { label: 'Mobile', color: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30' },
  design: { label: 'Design', color: 'bg-pink-500/20 text-pink-300 border-pink-500/30' },
  other: { label: 'Other', color: 'bg-gray-500/20 text-gray-300 border-gray-500/30' }
};

// Main Component
const ProjectCardModal = memo(({ 
  title, 
  description, 
  link, 
  image, 
  technologies = [],
  githubLink = null,
  figmaLink = null,
  videoDemo = null,
  status = 'completed',
  category = 'web',
  timeline = null,
  teamSize = null,
  projectDuration = null,
  challenges = [],
  achievements = [],
  ...props 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [loadingLink, setLoadingLink] = useState(null);
  
  const isMobile = useMobileDetection();
  const modalRef = useRef(null);
  const previousFocusRef = useRef(null);
  const focusTrapRef = useRef(null);

  // Simplified modal lifecycle
  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement;
      modalUtils.lockBodyScroll();
      
      if (isMobile) {
        document.body.style.touchAction = 'none';
      }
      
      requestAnimationFrame(() => setIsVisible(true));
      setupFocusTrap();
    } else {
      modalUtils.unlockBodyScroll();
      
      if (isMobile) {
        document.body.style.touchAction = '';
      }
      
      // Restore focus safely
      setTimeout(() => {
        if (previousFocusRef.current && document.contains(previousFocusRef.current)) {
          previousFocusRef.current.focus();
        }
      }, 100);
    }

    return () => {
      modalUtils.unlockBodyScroll();
      document.body.style.touchAction = '';
    };
  }, [isOpen, isMobile]);

  // Simplified keyboard handlers
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };

    const handleTabKey = (e) => {
      if (e.key === 'Tab' && isOpen) {
        trapFocus(e);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.addEventListener('keydown', handleTabKey);
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('keydown', handleTabKey);
    };
  }, [isOpen]);

  // Click outside handler
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

  // Focus trap implementation
  const setupFocusTrap = useCallback(() => {
    const focusableSelectors = [
      'button:not([disabled])',
      '[href]:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      '[tabindex]:not([tabindex="-1"])'
    ].join(', ');
    
    const focusableElements = modalRef.current?.querySelectorAll(focusableSelectors);
    
    if (focusableElements?.length > 0) {
      focusTrapRef.current = Array.from(focusableElements);
      setTimeout(() => focusTrapRef.current[0]?.focus(), 100);
    }
  }, []);

  const trapFocus = useCallback((e) => {
    if (!focusTrapRef.current || focusTrapRef.current.length === 0) return;

    const firstElement = focusTrapRef.current[0];
    const lastElement = focusTrapRef.current[focusTrapRef.current.length - 1];

    if (e.shiftKey) {
      if (document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      }
    } else {
      if (document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    }
  }, []);

  // Event handlers
  const handleOpen = useCallback(() => {
    setIsOpen(true);
    setActiveTab('overview');
    
    // Analytics tracking
    if (typeof gtag !== 'undefined') {
      gtag('event', 'modal_open', {
        event_category: 'engagement',
        event_label: title
      });
    }
  }, [title]);

  const handleClose = useCallback(() => {
    setIsVisible(false);
    setTimeout(() => {
      setIsOpen(false);
      setImageLoaded(false);
      setLoadingLink(null);
    }, 300);
  }, []);

  const handleModalClick = useCallback((e) => {
    e.stopPropagation();
  }, []);

  const handleImageLoad = useCallback(() => {
    setImageLoaded(true);
  }, []);

  const handleImageError = useCallback(() => {
    setImageLoaded(true);
  }, []);

  const handleActionClick = useCallback(async (type, url, e) => {
    e.stopPropagation();
    setLoadingLink(type);
    
    try {
      // Analytics tracking
      if (typeof gtag !== 'undefined') {
        gtag('event', 'project_action', {
          event_category: 'engagement',
          event_label: `${title} - ${type}`
        });
      }
      
      // Haptic feedback for mobile
      if (navigator.vibrate) {
        navigator.vibrate(50);
      }
      
      // Small delay for better UX
      await new Promise(resolve => setTimeout(resolve, 150));
      window.open(url, '_blank', 'noopener,noreferrer');
    } catch (error) {
      console.error('Error opening link:', error);
    } finally {
      setLoadingLink(null);
    }
  }, [title]);

  const handleTabChange = useCallback((tab) => {
    setActiveTab(tab);
  }, []);

  // Tab configuration
  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'details', label: 'Details' },
    ...(challenges.length > 0 ? [{ id: 'challenges', label: 'Challenges' }] : []),
    ...(achievements.length > 0 ? [{ id: 'achievements', label: 'Achievements' }] : [])
  ];

  // Render tab content
  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-4">
            <p className="text-gray-300 text-sm sm:text-base leading-relaxed font-light">
              {description}
            </p>
            
            {/* Project Metadata */}
            {(timeline || teamSize || projectDuration) && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-white/5 rounded-xl border border-white/10">
                {timeline && (
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-purple-400" />
                    <span className="text-gray-300">{timeline}</span>
                  </div>
                )}
                {teamSize && (
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="w-4 h-4 text-blue-400" />
                    <span className="text-gray-300">{teamSize} people</span>
                  </div>
                )}
                {projectDuration && (
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4 text-green-400" />
                    <span className="text-gray-300">{projectDuration}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      
      case 'details':
        return (
          <div className="space-y-4">
            <h4 className="text-white font-semibold text-sm">Technical Details</h4>
            {technologies.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {technologies.map((tech, index) => (
                  <span
                    key={index}
                    className="px-3 py-1.5 bg-blue-500/10 text-blue-300 text-sm rounded-lg border border-blue-500/20 hover:bg-blue-500/20 transition-colors duration-200"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            )}
          </div>
        );
      
      case 'challenges':
        return (
          <div className="space-y-3">
            <h4 className="text-white font-semibold text-sm">Key Challenges</h4>
            <ul className="space-y-2">
              {challenges.map((challenge, index) => (
                <li key={index} className="flex items-start gap-3 text-gray-300 text-sm">
                  <span className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0" />
                  <span>{challenge}</span>
                </li>
              ))}
            </ul>
          </div>
        );
      
      case 'achievements':
        return (
          <div className="space-y-3">
            <h4 className="text-white font-semibold text-sm">Key Achievements</h4>
            <ul className="space-y-2">
              {achievements.map((achievement, index) => (
                <li key={index} className="flex items-start gap-3 text-gray-300 text-sm">
                  <span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                  <span>{achievement}</span>
                </li>
              ))}
            </ul>
          </div>
        );
      
      default:
        return null;
    }
  };

  // Loading component for buttons
  const LoadingSpinner = () => (
    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
  );

  return (
    <ModalErrorBoundary 
      fallback={
        <button className="px-4 py-2 bg-red-500 text-white rounded-lg">
          Error Loading Modal
        </button>
      }
    >
      <>
        {/* Trigger Button */}
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
            className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ${
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
              className={`relative w-full max-w-4xl rounded-2xl bg-gradient-to-br from-gray-900/95 via-gray-800/95 to-gray-900/95 backdrop-blur-xl border border-white/10 shadow-2xl overflow-hidden transform transition-all duration-300 ${
                isVisible 
                  ? 'opacity-100 scale-100 translate-y-0' 
                  : 'opacity-0 scale-95 translate-y-4'
              }`}
              onClick={handleModalClick}
            >
              {/* Header */}
              <div className="border-b border-white/10 p-4 sm:p-6 bg-gradient-to-r from-white/5 to-transparent">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      {/* Status Badge */}
                      <span className={`px-2 py-1 text-xs rounded-md border ${statusConfig[status]?.color || statusConfig.completed.color}`}>
                        {statusConfig[status]?.label || 'Completed'}
                      </span>
                      
                      {/* Category Badge */}
                      <span className={`px-2 py-1 text-xs rounded-md border ${categoryConfig[category]?.color || categoryConfig.other.color}`}>
                        {categoryConfig[category]?.label || 'Project'}
                      </span>
                    </div>
                    
                    <h2 
                      id="modal-title"
                      className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent break-words"
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

              {/* Content Area */}
              <div className="max-h-[70vh] overflow-y-auto custom-scrollbar">
                {/* Image/Media Section */}
                {image && (
                  <div className="p-4 sm:p-6 pb-0">
                    <div className="rounded-lg overflow-hidden border border-white/10 bg-black/20 relative aspect-video">
                      {!imageLoaded && (
                        <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                          <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                        </div>
                      )}
                      <img 
                        src={image} 
                        alt={`${title} project screenshot`}
                        className={`w-full h-full object-cover transition-opacity duration-300 ${
                          imageLoaded ? 'opacity-100' : 'opacity-0'
                        }`}
                        loading="lazy"
                        onLoad={handleImageLoad}
                        onError={handleImageError}
                      />
                    </div>
                  </div>
                )}

                {/* Tab Navigation */}
                {tabs.length > 1 && (
                  <div className="border-b border-white/10 px-4 sm:px-6 mt-4">
                    <div className="flex space-x-1">
                      {tabs.map((tab) => (
                        <button
                          key={tab.id}
                          onClick={() => handleTabChange(tab.id)}
                          className={`px-4 py-2 text-sm font-medium transition-all duration-300 border-b-2 ${
                            activeTab === tab.id
                              ? 'text-purple-400 border-purple-400'
                              : 'text-gray-400 border-transparent hover:text-gray-300'
                          }`}
                        >
                          {tab.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tab Content */}
                <div className="p-4 sm:p-6">
                  {renderTabContent()}
                </div>
              </div>

              {/* Actions */}
              <div className="border-t border-white/10 p-4 sm:p-6 bg-gradient-to-r from-transparent to-white/5">
                <div className={`flex flex-col sm:flex-row gap-3 ${isMobile ? 'space-y-3' : 'space-x-4 justify-end'}`}>
                  {/* Additional Action Buttons */}
                  {githubLink && (
                    <button
                      onClick={(e) => handleActionClick('GitHub', githubLink, e)}
                      disabled={loadingLink === 'GitHub'}
                      className="group relative inline-flex items-center justify-center space-x-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-gray-600/50 hover:bg-gray-600/70 rounded-xl text-white font-medium transition-all duration-300 touch-manipulation active:scale-95 overflow-hidden focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loadingLink === 'GitHub' ? (
                        <LoadingSpinner />
                      ) : (
                        <Github className="w-4 h-4" />
                      )}
                      <span className="text-sm sm:text-base">
                        {loadingLink === 'GitHub' ? 'Opening...' : 'Code'}
                      </span>
                    </button>
                  )}

                  {figmaLink && (
                    <button
                      onClick={(e) => handleActionClick('Figma', figmaLink, e)}
                      disabled={loadingLink === 'Figma'}
                      className="group relative inline-flex items-center justify-center space-x-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-purple-600/50 hover:bg-purple-600/70 rounded-xl text-white font-medium transition-all duration-300 touch-manipulation active:scale-95 overflow-hidden focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loadingLink === 'Figma' ? (
                        <LoadingSpinner />
                      ) : (
                        <Figma className="w-4 h-4" />
                      )}
                      <span className="text-sm sm:text-base">
                        {loadingLink === 'Figma' ? 'Opening...' : 'Design'}
                      </span>
                    </button>
                  )}

                  {videoDemo && (
                    <button
                      onClick={(e) => handleActionClick('Video Demo', videoDemo, e)}
                      disabled={loadingLink === 'Video Demo'}
                      className="group relative inline-flex items-center justify-center space-x-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-red-600/50 hover:bg-red-600/70 rounded-xl text-white font-medium transition-all duration-300 touch-manipulation active:scale-95 overflow-hidden focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loadingLink === 'Video Demo' ? (
                        <LoadingSpinner />
                      ) : (
                        <Play className="w-4 h-4" />
                      )}
                      <span className="text-sm sm:text-base">
                        {loadingLink === 'Video Demo' ? 'Opening...' : 'Demo'}
                      </span>
                    </button>
                  )}

                  {/* Primary Action */}
                  <button
                    onClick={(e) => handleActionClick('Live Demo', link, e)}
                    disabled={loadingLink === 'Live Demo'}
                    className="group relative inline-flex items-center justify-center space-x-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 rounded-xl text-white font-medium transition-all duration-300 touch-manipulation active:scale-95 overflow-hidden focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 flex-1 sm:flex-none disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    {loadingLink === 'Live Demo' ? (
                      <LoadingSpinner />
                    ) : (
                      <>
                        <span className="relative text-sm sm:text-base">Live Demo</span>
                        <ExternalLink className="relative w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                      </>
                    )}
                  </button>
                  
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

        {/* Enhanced CSS */}
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
          
          @media (prefers-reduced-motion: reduce) {
            .transition-all, .transform {
              transition: none !important;
            }
          }
        `}</style>
      </>
    </ModalErrorBoundary>
  );
});

// PropTypes
ProjectCardModal.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  link: PropTypes.string.isRequired,
  image: PropTypes.string,
  technologies: PropTypes.arrayOf(PropTypes.string),
  githubLink: PropTypes.string,
  figmaLink: PropTypes.string,
  videoDemo: PropTypes.string,
  status: PropTypes.oneOf(['completed', 'in-progress', 'planned']),
  category: PropTypes.oneOf(['web', 'mobile', 'design', 'other']),
  timeline: PropTypes.string,
  teamSize: PropTypes.number,
  projectDuration: PropTypes.string,
  challenges: PropTypes.arrayOf(PropTypes.string),
  achievements: PropTypes.arrayOf(PropTypes.string),
};

ProjectCardModal.defaultProps = {
  technologies: [],
  image: null,
  status: 'completed',
  category: 'web',
  challenges: [],
  achievements: []
};

ProjectCardModal.displayName = 'ProjectCardModal';

export default ProjectCardModal;