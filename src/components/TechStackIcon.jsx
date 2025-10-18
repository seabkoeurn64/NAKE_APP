import React from 'react';

const TechStackIcon = ({ TechStackIcon, Language }) => {
  return (
    <div className="group relative p-6 rounded-3xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 hover:from-slate-700/60 hover:to-slate-800/60 backdrop-blur-sm transition-all duration-500 ease-out flex flex-col items-center justify-center gap-4 hover:scale-105 cursor-pointer border border-white/10 hover:border-white/20 shadow-xl hover:shadow-2xl hover:shadow-blue-500/10">
      
      {/* Animated Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-purple-500/0 to-pink-500/0 rounded-3xl group-hover:from-blue-500/10 group-hover:via-purple-500/5 group-hover:to-pink-500/10 transition-all duration-700 opacity-0 group-hover:opacity-100"></div>
      
      {/* Outer Glow Effect */}
      <div className="absolute -inset-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-3xl opacity-0 group-hover:opacity-20 blur-xl transition duration-500 group-hover:duration-300 -z-10"></div>
      
      {/* Inner Glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

      {/* Icon Container */}
      <div className="relative z-10 transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-3">
        {/* Icon Shadow Effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition duration-500"></div>
        
        <img 
          src={TechStackIcon} 
          alt={`${Language} icon`} 
          className="relative h-16 w-16 md:h-20 md:w-20 drop-shadow-lg filter group-hover:drop-shadow-xl transition-all duration-300"
        />
      </div>

      {/* Language Text */}
      <div className="relative z-10 text-center">
        <span className="text-slate-300 font-semibold text-sm md:text-base tracking-wide group-hover:text-white transition-colors duration-300 bg-gradient-to-r from-slate-300 to-slate-400 bg-clip-text text-transparent group-hover:from-white group-hover:to-slate-200">
          {Language}
        </span>
        
        {/* Underline Effect */}
        <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 group-hover:w-8 transition-all duration-300 ease-out"></div>
      </div>

      {/* Particle Effects */}
      <div className="absolute top-2 left-2 w-1 h-1 bg-blue-400 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping"></div>
      <div className="absolute bottom-2 right-2 w-1 h-1 bg-purple-400 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping" style={{animationDelay: '0.2s'}}></div>
    </div>
  );
};

export default TechStackIcon;