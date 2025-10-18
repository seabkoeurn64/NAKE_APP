import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Eye, Sparkles, Palette, Figma, Image } from 'lucide-react';

const CardProject = ({ Img, Title, Description, id, technologies = [], prototypeLink, behanceLink }) => {
  const handleDetails = (e) => {
    if (!id) {
      console.log("ID kosong");
      e.preventDefault();
      alert("Project details are not available");
    }
  };

  return (
    <div className="group relative w-full cursor-pointer">
      {/* Premium Background Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/30 via-pink-500/30 to-fuchsia-500/30 rounded-3xl blur-2xl group-hover:blur-3xl transition-all duration-1000 opacity-0 group-hover:opacity-100 -z-10 scale-90 group-hover:scale-100 animate-pulse-slow"></div>
      
      {/* Animated Border Glow */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-purple-500/40 via-pink-500/40 to-fuchsia-500/40 opacity-0 group-hover:opacity-100 transition-all duration-700 blur-xl -z-5"></div>

      {/* Main Card Container */}
      <div className="relative overflow-hidden rounded-3xl glass-morphism-intense shadow-2xl transition-all duration-700 hover-lift hover:shadow-purple-500/30 border border-white/20">
        
        {/* Animated Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/15 via-pink-500/15 to-fuchsia-500/15 opacity-60 group-hover:opacity-90 transition-opacity duration-700 animate-gradient-shift"></div>
        
        {/* Premium Shimmer Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 transform translate-x-[-150%] group-hover:translate-x-[150%] transition-transform duration-1500 animate-shine"></div>
        
        {/* Floating Particles */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-pink-400/30 rounded-full animate-particle-float"
              style={{
                left: `${20 + i * 30}%`,
                top: `${10 + i * 25}%`,
                animationDelay: `${i * 0.5}s`
              }}
            />
          ))}
        </div>

        {/* Content Container */}
        <div className="relative p-8 z-10">
          
          {/* Premium Image Section - OPTIMIZED FOR POSTER DESIGN */}
          <Link
            to={id ? `/project/${id}` : '#'}
            onClick={handleDetails}
            className="block relative overflow-hidden rounded-2xl mb-6 group/image"
          >
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent z-10 opacity-0 group-hover/image:opacity-100 transition-all duration-700"></div>
            
            {/* Image Container with Enhanced Effects - UPDATED FOR POSTER */}
            <div className="relative overflow-hidden rounded-2xl bg-gray-900/50">
              <img
                src={Img}
                alt={Title}
                className="w-full h-64 object-contain transform group-hover/image:scale-105 transition-transform duration-1000 gpu-accelerate" 
                // Changed to object-contain for poster design
                // Increased height for better poster display
              />
              
              {/* Glass Overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent backdrop-blur-sm opacity-0 group-hover/image:opacity-100 transition-all duration-500 rounded-2xl"></div>
              
              {/* Scan Line Effect */}
              <div className="absolute inset-0 bg-linear-to-b from-transparent via-white/5 to-transparent opacity-0 group-hover/image:opacity-100 transform -skew-y-12 scale-150 transition-all duration-1000"></div>

              {/* Fallback for missing images */}
              {!Img && (
                <div className="w-full h-64 flex items-center justify-center bg-gray-800/50 rounded-2xl">
                  <Image className="w-16 h-16 text-gray-500" />
                  <span className="ml-2 text-gray-400">Poster Image</span>
                </div>
              )}
            </div>
            
            {/* Premium Image Overlay Icons - UPDATED FOR POSTER DESIGN */}
            <div className="absolute top-4 right-4 opacity-0 group-hover/image:opacity-100 transition-all duration-500 delay-300 transform translate-y-6 group-hover/image:translate-y-0 z-20 space-y-2">
              <div className="flex flex-col gap-2">
                <div className="p-3 bg-black/80 backdrop-blur-xl rounded-xl border border-white/20 shadow-2xl transition-all duration-300 hover:scale-110 hover:bg-black/90 hover:border-pink-400/50 group/icon">
                  <Eye className="w-5 h-5 text-white group-hover/icon:text-pink-300 transition-colors duration-300" />
                </div>
                {prototypeLink && (
                  <a
                    href={prototypeLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-black/80 backdrop-blur-xl rounded-xl border border-white/20 shadow-2xl transition-all duration-300 hover:scale-110 hover:bg-black/90 hover:border-purple-400/50 group/icon"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Figma className="w-5 h-5 text-white group-hover/icon:text-purple-300 transition-colors duration-300" />
                  </a>
                )}
              </div>
            </div>

            {/* Premium Badge - UPDATED FOR POSTER */}
            <div className="absolute top-4 left-4 z-20">
              <div className="flex items-center gap-2 px-4 py-2 bg-black/80 backdrop-blur-xl rounded-full border border-white/10 shadow-2xl group/badge hover:border-pink-400/50 transition-all duration-300">
                <Sparkles className="w-4 h-4 text-pink-400 group-hover/badge:text-pink-300 transition-colors duration-300" />
                <span className="text-sm font-semibold text-white/90 group-hover/badge:text-white transition-colors duration-300">Poster</span>
                {/* Changed from "Design" to "Poster" */}
              </div>
            </div>

            {/* Design Tools Preview - UPDATED FOR POSTER DESIGN */}
            {technologies.length > 0 && (
              <div className="absolute bottom-4 left-4 right-4 z-20">
                <div className="flex flex-wrap gap-1 opacity-0 group-hover/image:opacity-100 transition-opacity duration-500 delay-200">
                  {technologies.slice(0, 3).map((tech, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-black/70 backdrop-blur-md rounded-lg text-xs text-white/80 border border-white/10"
                    >
                      {tech}
                    </span>
                  ))}
                  {technologies.length > 3 && (
                    <span className="px-2 py-1 bg-black/70 backdrop-blur-md rounded-lg text-xs text-white/60 border border-white/10">
                      +{technologies.length - 3}
                    </span>
                  )}
                </div>
              </div>
            )}
          </Link>
          
          {/* Premium Content Section */}
          <div className="space-y-6">
            {/* Enhanced Title Section */}
            <div className="space-y-3">
              <h3 className="text-2xl font-bold gradient-text group-hover:neon-glow transition-all duration-500 text-balance">
                {Title}
              </h3>
              
              {/* Description with Premium Typography */}
              <p className="text-gray-300/90 text-[15px] leading-relaxed line-clamp-3 group-hover:text-gray-200 transition-colors duration-400 font-medium text-balance">
                {Description}
              </p>
            </div>

            {/* Design Tools Tags - UPDATED FOR POSTER DESIGN */}
            {technologies.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {technologies.slice(0, 4).map((tech, index) => (
                  <span
                    key={index}
                    className="px-3 py-1.5 bg-white/5 backdrop-blur-sm rounded-xl text-xs text-gray-300 border border-white/5 transition-all duration-300 hover:bg-white/10 hover:border-pink-400/30 hover:text-white hover-scale"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            )}
            
            {/* Premium Action Buttons - UPDATED FOR POSTER */}
            <div className="pt-4 flex items-center justify-between gap-4">
              {/* External Links */}
              <div className="flex items-center gap-3">
                {behanceLink && (
                  <a
                    href={behanceLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 text-gray-400 transition-all duration-300 hover:bg-white/10 hover:border-blue-400/30 hover:text-blue-300 hover-scale group/link"
                  >
                    <Palette className="w-4 h-4 group-hover/link:scale-110 transition-transform duration-300" />
                  </a>
                )}
                {/* You can add more poster-specific links here */}
                <a
                  href={Img} // Link to download high-quality poster
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 text-gray-400 transition-all duration-300 hover:bg-white/10 hover:border-green-400/30 hover:text-green-300 hover-scale group/link"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Image className="w-4 h-4 group-hover/link:scale-110 transition-transform duration-300" />
                </a>
              </div>
              
              {/* Details Button - UPDATED TEXT */}
              <div className="flex-1 flex justify-end">
                {id ? (
                  <Link
                    to={`/project/${id}`}
                    onClick={handleDetails}
                    className="inline-flex items-center justify-center space-x-3 px-6 py-3 rounded-2xl bg-gradient-to-r from-pink-500/20 to-purple-500/20 hover:from-pink-500/40 hover:to-purple-500/30 border border-pink-500/40 hover:border-pink-400/60 text-white/95 hover:text-white transition-all duration-400 group/button hover-scale shadow-lg hover:shadow-pink-500/25 focus:outline-none focus:ring-3 focus:ring-pink-500/40 cursor-pointer backdrop-blur-sm"
                  >
                    <span className="text-sm font-semibold">View Poster</span>
                    {/* Changed from "View Design" to "View Poster" */}
                    <ArrowRight className="w-4 h-4 transform group-hover/button:translate-x-2 transition-transform duration-300" />
                  </Link>
                ) : (
                  <div className="inline-flex items-center justify-center space-x-3 px-6 py-3 rounded-2xl bg-gray-500/10 border border-gray-500/30 text-gray-500 cursor-not-allowed backdrop-blur-sm">
                    <span className="text-sm font-semibold">Details Not Available</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Premium Hover Border Effect */}
          <div className="absolute inset-0 border-2 border-transparent group-hover:border-pink-500/50 rounded-3xl transition-all duration-700 -z-10 group-hover:shadow-2xl"></div>
        </div>
        
        {/* Premium Floating Elements */}
        <div className="absolute -top-3 -right-3 w-28 h-28 bg-pink-500/25 rounded-full blur-2xl group-hover:bg-pink-500/35 group-hover:scale-125 transition-all duration-700 animate-blob"></div>
        <div className="absolute -bottom-3 -left-3 w-24 h-24 bg-purple-500/25 rounded-full blur-2xl group-hover:bg-purple-500/35 group-hover:scale-125 transition-all duration-700 delay-200 animate-blob animation-delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-36 h-36 bg-fuchsia-500/15 rounded-full blur-xl group-hover:bg-fuchsia-500/25 group-hover:scale-150 transition-all duration-700 delay-400 animate-blob animation-delay-2000"></div>
      </div>
    </div>
  );
};

export default CardProject;