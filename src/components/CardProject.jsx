import React, { useState, useCallback, memo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Eye, Sparkles, Palette, Figma, Image } from 'lucide-react';

const CardProject = memo(({ 
  Img, 
  Title, 
  Description, 
  id, 
  technologies = [], 
  prototypeLink, 
  behanceLink 
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleDetails = useCallback((e) => {
    if (!id) {
      e.preventDefault();
      alert("Project details are not available");
    }
  }, [id]);

  const handleImageLoad = useCallback(() => {
    setImageLoaded(true);
  }, []);

  const handleImageError = useCallback(() => {
    setImageError(true);
    setImageLoaded(true);
  }, []);

  const stopPropagation = useCallback((e) => {
    e.stopPropagation();
  }, []);

  return (
    <div className="group relative w-full cursor-pointer performance-optimized">
      {/* Simplified Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-fuchsia-500/10 rounded-2xl lg:rounded-3xl blur-lg group-hover:blur-xl transition-all duration-500 opacity-0 group-hover:opacity-60 -z-10 scale-95 group-hover:scale-100" />
      
      {/* Main Card Container */}
      <div className="relative overflow-hidden rounded-2xl lg:rounded-3xl glass-morphism shadow-lg transition-all duration-300 hover:shadow-purple-500/10 border border-white/10">
        
        {/* Content Container */}
        <div className="relative p-4 sm:p-6 lg:p-8 z-10">
          
          {/* Image Section */}
          <Link
            to={id ? `/project/${id}` : '#'}
            onClick={handleDetails}
            className="block relative overflow-hidden rounded-xl lg:rounded-2xl mb-4 sm:mb-6 group/image performance-container"
          >
            {/* Image Container */}
            <div className="relative overflow-hidden rounded-xl lg:rounded-2xl bg-gray-900/20 aspect-video sm:aspect-[4/3]">
              {/* Skeleton Loader */}
              <div className={`absolute inset-0 transition-opacity duration-300 ${imageLoaded ? 'opacity-0' : 'opacity-100'}`}>
                <div className="skeleton w-full h-full rounded-xl lg:rounded-2xl" />
              </div>
              
              {/* Main Image */}
              {!imageError && Img && (
                <img
                  src={Img}
                  alt={Title}
                  loading="lazy"
                  decoding="async"
                  className={`w-full h-full object-cover transform transition-all duration-500 gpu-accelerated ${
                    imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
                  } group-hover/image:scale-102`}
                  onLoad={handleImageLoad}
                  onError={handleImageError}
                />
              )}
              
              {/* Error State */}
              {imageError && (
                <div className="w-full h-full flex flex-col items-center justify-center bg-gray-800/30 rounded-xl lg:rounded-2xl">
                  <Image className="w-8 h-8 lg:w-10 lg:h-10 text-gray-500 mb-2" />
                  <span className="text-xs text-gray-400 text-center px-2">Image<br />Not Available</span>
                </div>
              )}
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent opacity-70 group-hover/image:opacity-90 transition-opacity duration-300 rounded-xl lg:rounded-2xl" />
            </div>
            
            {/* Badge */}
            <div className="absolute top-2 left-2 sm:top-3 sm:left-3 z-20">
              <div className="flex items-center gap-1 px-2 py-1 sm:px-3 sm:py-1.5 bg-black/80 backdrop-blur-md rounded-lg border border-white/10 transition-all duration-200 group/badge mobile-touch">
                <Sparkles className="w-3 h-3 text-pink-400" />
                <span className="text-xs font-medium text-white/90">Poster</span>
              </div>
            </div>

            {/* Action Icons */}
            <div className="absolute top-2 right-2 sm:top-3 sm:right-3 z-20 opacity-0 group-hover/image:opacity-100 transition-opacity duration-300">
              <div className="flex gap-1">
                <div className="p-2 bg-black/80 backdrop-blur-md rounded-lg border border-white/10 transition-all duration-200 hover:scale-105 mobile-touch">
                  <Eye className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                </div>
                {prototypeLink && (
                  <a
                    href={prototypeLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-black/80 backdrop-blur-md rounded-lg border border-white/10 transition-all duration-200 hover:scale-105 mobile-touch"
                    onClick={stopPropagation}
                  >
                    <Figma className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                  </a>
                )}
              </div>
            </div>

            {/* Technology Tags */}
            {technologies.length > 0 && (
              <div className="absolute bottom-2 left-2 right-2 sm:bottom-3 sm:left-3 sm:right-3 z-20">
                <div className="flex flex-wrap gap-1 justify-center">
                  {technologies.slice(0, 2).map((tech, index) => (
                    <span
                      key={index}
                      className="px-1.5 py-0.5 bg-black/70 backdrop-blur-sm rounded text-xs text-white/80 border border-white/10"
                    >
                      {tech}
                    </span>
                  ))}
                  {technologies.length > 2 && (
                    <span className="px-1.5 py-0.5 bg-black/70 backdrop-blur-sm rounded text-xs text-white/60 border border-white/10">
                      +{technologies.length - 2}
                    </span>
                  )}
                </div>
              </div>
            )}
          </Link>
          
          {/* Content Section */}
          <div className="space-y-3 sm:space-y-4">
            {/* Title & Description */}
            <div className="space-y-2">
              <h3 className="text-lg sm:text-xl font-bold gradient-text text-balance line-clamp-2 leading-tight">
                {Title}
              </h3>
              
              <p className="text-gray-300/80 text-xs sm:text-sm leading-relaxed line-clamp-2 font-normal text-balance">
                {Description}
              </p>
            </div>

            {/* Technology Tags */}
            {technologies.length > 0 && (
              <div className="flex gap-1 overflow-x-auto scrollbar-hide pb-1">
                {technologies.slice(0, 4).map((tech, index) => (
                  <span
                    key={index}
                    className="flex-shrink-0 px-2 py-1 bg-white/5 backdrop-blur-sm rounded-lg text-xs text-gray-300 border border-white/5 transition-colors duration-200 mobile-touch"
                  >
                    {tech}
                  </span>
                ))}
                {technologies.length > 4 && (
                  <span className="flex-shrink-0 px-2 py-1 bg-white/5 backdrop-blur-sm rounded-lg text-xs text-gray-400 border border-white/5">
                    +{technologies.length - 4}
                  </span>
                )}
              </div>
            )}
            
            {/* Action Buttons */}
            <div className="flex items-center justify-between gap-2 pt-2">
              {/* External Links */}
              <div className="flex items-center gap-1">
                {behanceLink && (
                  <a
                    href={behanceLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 text-gray-400 transition-all duration-200 hover:bg-white/10 mobile-touch"
                    onClick={stopPropagation}
                  >
                    <Palette className="w-3 h-3 sm:w-4 sm:h-4" />
                  </a>
                )}
                {Img && (
                  <a
                    href={Img}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 text-gray-400 transition-all duration-200 hover:bg-white/10 mobile-touch"
                    onClick={stopPropagation}
                  >
                    <Image className="w-3 h-3 sm:w-4 sm:h-4" />
                  </a>
                )}
              </div>
              
              {/* Details Button */}
              <div className="flex-1 flex justify-end min-w-0">
                {id ? (
                  <Link
                    to={`/project/${id}`}
                    onClick={handleDetails}
                    className="inline-flex items-center justify-center space-x-1 sm:space-x-2 px-3 sm:px-4 py-2 rounded-lg bg-gradient-to-r from-pink-500/10 to-purple-500/10 hover:from-pink-500/20 hover:to-purple-500/20 border border-pink-500/20 hover:border-pink-400/40 text-white/90 hover:text-white transition-all duration-200 group/button shadow-sm hover:shadow-pink-500/10 focus:outline-none cursor-pointer backdrop-blur-sm mobile-touch text-xs sm:text-sm font-medium whitespace-nowrap overflow-hidden"
                  >
                    <span className="truncate">View Poster</span>
                    <ArrowRight className="w-3 h-3 flex-shrink-0 transform group-hover/button:translate-x-0.5 transition-transform duration-200" />
                  </Link>
                ) : (
                  <div className="inline-flex items-center justify-center space-x-1 sm:space-x-2 px-3 sm:px-4 py-2 rounded-lg bg-gray-500/5 border border-gray-500/20 text-gray-500 cursor-not-allowed backdrop-blur-sm text-xs sm:text-sm font-medium whitespace-nowrap">
                    <span className="truncate">N/A</span>
                    <ArrowRight className="w-3 h-3 flex-shrink-0" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Floating Elements - Only on Desktop */}
        <div className="hidden sm:block absolute -top-2 -right-2 w-12 h-12 bg-pink-500/15 rounded-full blur-md group-hover:bg-pink-500/20 transition-all duration-500" />
        <div className="hidden sm:block absolute -bottom-2 -left-2 w-10 h-10 bg-purple-500/15 rounded-full blur-md group-hover:bg-purple-500/20 transition-all duration-500 delay-100" />
      </div>
    </div>
  );
});

CardProject.displayName = 'CardProject';

export default CardProject;