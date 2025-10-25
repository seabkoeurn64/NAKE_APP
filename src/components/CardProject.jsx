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
    <div className="group relative w-full cursor-pointer">
      {/* Main Card Container - More Compact */}
      <div className="relative overflow-hidden rounded-xl glass-morphism shadow-lg transition-all duration-300 hover:shadow-purple-500/10 border border-white/10 bg-gray-900/20">
        
        {/* Content Container - Reduced Padding */}
        <div className="relative p-3 sm:p-4 z-10">
          
          {/* Image Section - Smaller for Posters */}
          <Link
            to={id ? `/project/${id}` : '#'}
            onClick={handleDetails}
            className="block relative overflow-hidden rounded-lg mb-3 group/image"
          >
            {/* Image Container - Square aspect for posters */}
            <div className="relative overflow-hidden rounded-lg bg-gray-900/20 aspect-square">
              {/* Skeleton Loader */}
              <div className={`absolute inset-0 transition-opacity duration-300 ${imageLoaded ? 'opacity-0' : 'opacity-100'}`}>
                <div className="skeleton w-full h-full rounded-lg" />
              </div>
              
              {/* Main Image */}
              {!imageError && Img && (
                <img
                  src={Img}
                  alt={Title}
                  loading="lazy"
                  decoding="async"
                  className={`w-full h-full object-cover transform transition-all duration-300 ${
                    imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
                  } group-hover/image:scale-105`}
                  onLoad={handleImageLoad}
                  onError={handleImageError}
                />
              )}
              
              {/* Error State */}
              {imageError && (
                <div className="w-full h-full flex flex-col items-center justify-center bg-gray-800/30 rounded-lg">
                  <Image className="w-6 h-6 text-gray-500 mb-1" />
                  <span className="text-xs text-gray-400">No Image</span>
                </div>
              )}
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-60 group-hover/image:opacity-80 transition-opacity duration-300 rounded-lg" />
            </div>
            
            {/* Badge - Smaller */}
            <div className="absolute top-1 left-1 z-20">
              <div className="flex items-center gap-1 px-1.5 py-0.5 bg-black/80 backdrop-blur-md rounded-md border border-white/10 text-xs">
                <Sparkles className="w-2 h-2 text-pink-400" />
                <span className="text-white/90">Poster</span>
              </div>
            </div>

            {/* Action Icons - Always visible but smaller */}
            <div className="absolute top-1 right-1 z-20 opacity-70 group-hover/image:opacity-100 transition-opacity duration-300">
              <div className="flex gap-0.5">
                <div className="p-1 bg-black/80 backdrop-blur-md rounded-md border border-white/10">
                  <Eye className="w-2 h-2 text-white" />
                </div>
                {prototypeLink && (
                  <a
                    href={prototypeLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1 bg-black/80 backdrop-blur-md rounded-md border border-white/10"
                    onClick={stopPropagation}
                  >
                    <Figma className="w-2 h-2 text-white" />
                  </a>
                )}
              </div>
            </div>
          </Link>
          
          {/* Content Section - More Compact */}
          <div className="space-y-2">
            {/* Title & Description */}
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-white line-clamp-2 leading-tight">
                {Title}
              </h3>
              
              <p className="text-gray-300/80 text-xs leading-relaxed line-clamp-2">
                {Description}
              </p>
            </div>

            {/* Technology Tags - Single row, compact */}
            {technologies.length > 0 && (
              <div className="flex gap-1 overflow-x-auto scrollbar-hide">
                {technologies.slice(0, 3).map((tech, index) => (
                  <span
                    key={index}
                    className="flex-shrink-0 px-1.5 py-0.5 bg-white/5 rounded text-xs text-gray-300 border border-white/5"
                  >
                    {tech}
                  </span>
                ))}
                {technologies.length > 3 && (
                  <span className="flex-shrink-0 px-1.5 py-0.5 bg-white/5 rounded text-xs text-gray-400">
                    +{technologies.length - 3}
                  </span>
                )}
              </div>
            )}
            
            {/* Action Buttons - Compact */}
            <div className="flex items-center justify-between gap-1 pt-1">
              {/* External Links */}
              <div className="flex items-center gap-0.5">
                {behanceLink && (
                  <a
                    href={behanceLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1 bg-white/5 rounded border border-white/10 text-gray-400 hover:bg-white/10 transition-colors"
                    onClick={stopPropagation}
                  >
                    <Palette className="w-3 h-3" />
                  </a>
                )}
                {Img && (
                  <a
                    href={Img}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1 bg-white/5 rounded border border-white/10 text-gray-400 hover:bg-white/10 transition-colors"
                    onClick={stopPropagation}
                  >
                    <Image className="w-3 h-3" />
                  </a>
                )}
              </div>
              
              {/* Details Button */}
              <div className="flex-1 flex justify-end min-w-0">
                {id ? (
                  <Link
                    to={`/project/${id}`}
                    onClick={handleDetails}
                    className="inline-flex items-center justify-center space-x-1 px-2 py-1 rounded bg-gradient-to-r from-pink-500/10 to-purple-500/10 hover:from-pink-500/20 border border-pink-500/20 text-white/90 hover:text-white transition-all duration-200 group/button text-xs font-medium whitespace-nowrap overflow-hidden"
                  >
                    <span className="truncate">View</span>
                    <ArrowRight className="w-2 h-2 flex-shrink-0 transform group-hover/button:translate-x-0.5 transition-transform" />
                  </Link>
                ) : (
                  <div className="inline-flex items-center justify-center space-x-1 px-2 py-1 rounded bg-gray-500/5 border border-gray-500/20 text-gray-500 cursor-not-allowed text-xs font-medium whitespace-nowrap">
                    <span className="truncate">N/A</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

CardProject.displayName = 'CardProject';

export default CardProject;