// components/CardProject.jsx
import React, { memo, useState, useCallback } from 'react';

const ProjectImage = memo(({ src, alt, onLoad, onError, onClick }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleLoad = useCallback(() => {
    setImageLoaded(true);
    onLoad?.();
  }, [onLoad]);

  const handleError = useCallback(() => {
    setImageLoaded(true);
    onError?.();
  }, [onError]);

  const handleClick = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    onClick?.();
  }, [onClick]);

  return (
    <div 
      className="relative aspect-[4/3] w-full overflow-hidden bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-t-2xl cursor-pointer group performance-optimized"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      aria-label={`View full size image of ${alt}`}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleClick(e)}
    >
      {src ? (
        <>
          <img
            src={src}
            alt={alt}
            className={`w-full h-full object-cover transition-all duration-700 ease-out ${
              isHovered ? 'scale-110 rotate-1' : 'scale-100 rotate-0'
            } ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
            onLoad={handleLoad}
            onError={handleError}
            loading="lazy"
            decoding="async"
          />
          
          {/* Loading State - Hidden as requested */}
          {!imageLoaded && (
            <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
              <div className="text-center text-slate-500 opacity-0">
                <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                <p className="text-sm">Loading...</p>
              </div>
            </div>
          )}

          {/* Enhanced Animated Overlay with Home.jsx gradient */}
          <div className={`absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent transition-all duration-500 ${
            isHovered ? 'opacity-60' : 'opacity-30'
          }`} />

          {/* Enhanced Shine Effect */}
          <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 transition-all duration-1000 ${
            isHovered ? 'translate-x-full' : '-translate-x-full'
          }`} />

          {/* Gradient Border Glow */}
          <div className={`absolute inset-0 rounded-t-2xl border-2 transition-all duration-700 ${
            isHovered ? 'border-blue-500/20 shadow-lg shadow-blue-500/10' : 'border-transparent'
          }`} />
        </>
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
          <div className="text-center text-slate-500">
            <div className="w-12 h-12 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">🖼️</span>
            </div>
            <p className="text-sm">Project Image</p>
          </div>
        </div>
      )}
    </div>
  );
});

ProjectImage.displayName = 'ProjectImage';

// Main CardProject Component with Home.jsx effects
const CardProject = memo(({ 
  Img, 
  Title, 
  Description, 
  onImageClick 
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleImageClick = useCallback(() => {
    if (onImageClick && Img) {
      onImageClick(Img, Title);
    }
  }, [onImageClick, Img, Title]);

  return (
    <article 
      className="group relative w-full bg-gradient-to-br from-slate-900/80 to-slate-800/60 backdrop-blur-xl rounded-2xl border border-white/10 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] overflow-hidden performance-optimized"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Enhanced Floating Animation with Home.jsx colors */}
      <div className={`absolute inset-0 bg-gradient-to-r from-[#6366f1]/0 via-[#a855f7]/0 to-[#8b5cf6]/0 rounded-2xl transition-all duration-1000 ${
        isHovered ? 'opacity-10' : 'opacity-0'
      }`} />
      
      {/* Enhanced Glow Border */}
      <div className={`absolute inset-0 rounded-2xl border transition-all duration-500 ${
        isHovered ? 'border-[#6366f1]/20 shadow-2xl shadow-[#6366f1]/10' : 'border-transparent'
      }`} />

      {/* Background Glow Effect */}
      <div className={`absolute inset-0 bg-gradient-to-br from-[#6366f1]/5 to-[#a855f7]/5 rounded-2xl transition-all duration-700 ${
        isHovered ? 'opacity-100' : 'opacity-0'
      }`} />

      {/* Image Section */}
      <ProjectImage
        src={Img}
        alt={`Project: ${Title}`}
        onClick={handleImageClick}
      />

      {/* Content Section */}
      <div className="p-6 space-y-4 relative z-10">
        {/* Enhanced Header with Home.jsx gradient text */}
        <div className="space-y-3">
          <h3 className="text-xl font-bold text-white line-clamp-2 transition-all duration-500 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-[#6366f1] group-hover:to-[#a855f7]">
            {Title}
          </h3>
          <p className="text-gray-300 text-sm leading-relaxed line-clamp-3 transition-all duration-500 group-hover:text-gray-200">
            {Description}
          </p>
        </div>
      </div>

      {/* Enhanced Floating Particles Effect */}
      <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
        <div className={`absolute top-2 right-2 w-2 h-2 bg-[#6366f1] rounded-full transition-all duration-1000 ${
          isHovered ? 'opacity-70 animate-bounce' : 'opacity-0'
        }`} style={{ animationDelay: '0.1s' }} />
        <div className={`absolute bottom-4 left-4 w-1 h-1 bg-[#a855f7] rounded-full transition-all duration-1000 ${
          isHovered ? 'opacity-60 animate-bounce' : 'opacity-0'
        }`} style={{ animationDelay: '0.3s' }} />
        <div className={`absolute top-4 left-2 w-1.5 h-1.5 bg-[#8b5cf6] rounded-full transition-all duration-1000 ${
          isHovered ? 'opacity-50 animate-bounce' : 'opacity-0'
        }`} style={{ animationDelay: '0.5s' }} />
      </div>

      {/* Corner Accents */}
      <div className={`absolute top-0 left-0 w-4 h-4 border-l-2 border-t-2 border-[#6366f1]/20 transition-all duration-500 ${
        isHovered ? 'opacity-100' : 'opacity-0'
      }`} />
      <div className={`absolute bottom-0 right-0 w-4 h-4 border-r-2 border-b-2 border-[#a855f7]/20 transition-all duration-500 ${
        isHovered ? 'opacity-100' : 'opacity-0'
      }`} />
    </article>
  );
});

CardProject.displayName = 'CardProject';

export default CardProject;