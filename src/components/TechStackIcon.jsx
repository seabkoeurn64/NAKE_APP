import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';

const TechStackIcon = ({ TechStackIcon, Language, delay = 0 }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Memoize gradient classes for better performance
  const gradientClasses = useMemo(() => ({
    mainGradient: "bg-gradient-to-br from-slate-800/50 to-slate-900/50 hover:from-slate-700/60 hover:to-slate-800/60",
    animatedGradient: "bg-gradient-to-r from-blue-500/0 via-purple-500/0 to-pink-500/0 group-hover:from-blue-500/10 group-hover:via-purple-500/5 group-hover:to-pink-500/10",
    outerGlow: "bg-gradient-to-r from-blue-500 to-purple-500",
    textGradient: "bg-gradient-to-r from-slate-300 to-slate-400 group-hover:from-white group-hover:to-slate-200",
    underlineGradient: "bg-gradient-to-r from-blue-500 to-purple-500"
  }), []);

  // Handle image load
  const handleImageLoad = (e) => {
    setImageLoaded(true);
    e.target.style.opacity = '0';
    setTimeout(() => {
      e.target.style.transition = 'opacity 0.3s ease-in';
      e.target.style.opacity = '1';
    }, 100);
  };

  // Handle image error
  const handleImageError = (e) => {
    setImageError(true);
    e.target.style.display = 'none';
  };

  // Inline styles for animations - moved to useMemo for better performance
  const animationStyles = useMemo(() => `
    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    @keyframes techStackFloat {
      0%, 100% {
        transform: translateY(0px);
      }
      50% {
        transform: translateY(-5px);
      }
    }
    
    /* Reduced motion support */
    @media (prefers-reduced-motion: reduce) {
      .techstack-reduce-motion {
        transform: none !important;
        animation: none !important;
      }
      .techstack-reduce-motion-hover:hover {
        transform: none !important;
      }
    }
  `, []);

  return (
    <>
      <style>{animationStyles}</style>
      <div 
        className="group relative p-6 rounded-3xl backdrop-blur-sm transition-all duration-500 ease-out flex flex-col items-center justify-center gap-4 hover:scale-105 cursor-pointer border border-white/10 hover:border-white/20 shadow-xl hover:shadow-2xl hover:shadow-blue-500/10 techstack-reduce-motion techstack-reduce-motion-hover"
        style={{
          animationDelay: `${delay}ms`,
          animation: 'fadeInUp 0.6s ease-out both'
        }}
        role="button"
        tabIndex={0}
        aria-label={`${Language} technology`}
        onMouseEnter={(e) => {
          if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            e.currentTarget.style.animation = 'techStackFloat 3s ease-in-out infinite';
          }
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.animation = 'fadeInUp 0.6s ease-out both';
        }}
        onKeyDown={(e) => {
          // Add keyboard support
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            // Add any keyboard action here
          }
        }}
      >
        
        {/* Main Background */}
        <div className={`absolute inset-0 rounded-3xl ${gradientClasses.mainGradient}`} />
        
        {/* Animated Background Gradient */}
        <div className={`absolute inset-0 rounded-3xl transition-all duration-700 opacity-0 group-hover:opacity-100 ${gradientClasses.animatedGradient}`} />
        
        {/* Outer Glow Effect */}
        <div className="absolute -inset-2 rounded-3xl opacity-0 group-hover:opacity-20 blur-xl transition duration-500 group-hover:duration-300 -z-10">
          <div className={`w-full h-full rounded-3xl ${gradientClasses.outerGlow}`} />
        </div>
        
        {/* Inner Glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Icon Container */}
        <div className="relative z-10 transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 techstack-reduce-motion techstack-reduce-motion-hover">
          {/* Icon Shadow Effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition duration-500" />
          
          {!imageError ? (
            <img 
              src={TechStackIcon} 
              alt={`${Language} icon`} 
              className="relative h-16 w-16 md:h-20 md:w-20 drop-shadow-lg filter group-hover:drop-shadow-xl transition-all duration-300"
              loading="lazy"
              onLoad={handleImageLoad}
              onError={handleImageError}
              style={{ opacity: imageLoaded ? 1 : 0 }}
            />
          ) : (
            <div 
              className="h-16 w-16 md:h-20 md:w-20 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg"
            >
              {Language.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        {/* Language Text */}
        <div className="relative z-10 text-center">
          <span className={`font-semibold text-sm md:text-base tracking-wide transition-colors duration-300 bg-clip-text text-transparent ${gradientClasses.textGradient}`}>
            {Language}
          </span>
          
          {/* Underline Effect */}
          <div className={`absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0.5 transition-all duration-300 ease-out ${gradientClasses.underlineGradient} group-hover:w-8`} />
        </div>

        {/* Particle Effects */}
        <div className="absolute top-2 left-2 w-1 h-1 bg-blue-400 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping techstack-reduce-motion" />
        <div className="absolute bottom-2 right-2 w-1 h-1 bg-purple-400 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping techstack-reduce-motion" style={{animationDelay: '0.2s'}} />
        
        {/* Additional subtle particles */}
        <div className="absolute top-3 right-3 w-0.5 h-0.5 bg-cyan-400 rounded-full opacity-0 group-hover:opacity-80 group-hover:animate-pulse techstack-reduce-motion" style={{animationDelay: '0.4s'}} />
        <div className="absolute bottom-3 left-3 w-0.5 h-0.5 bg-pink-400 rounded-full opacity-0 group-hover:opacity-80 group-hover:animate-pulse techstack-reduce-motion" style={{animationDelay: '0.6s'}} />

        {/* Interactive Border Animation */}
        <div className="absolute inset-0 rounded-3xl border-2 border-transparent bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-border opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-5">
          <div className="absolute inset-0 rounded-3xl bg-[#030014] m-0.5" />
        </div>
      </div>
    </>
  );
};

// Proper PropTypes validation
TechStackIcon.propTypes = {
  TechStackIcon: PropTypes.string.isRequired,
  Language: PropTypes.string.isRequired,
  delay: PropTypes.number
};

// Default props
TechStackIcon.defaultProps = {
  TechStackIcon: '',
  Language: 'Tech',
  delay: 0
};

export default React.memo(TechStackIcon);