import React, { useMemo } from 'react';

const TechStackIcon = ({ TechStackIcon, Language, delay = 0 }) => {
  // Memoize gradient classes for better performance
  const gradientClasses = useMemo(() => ({
    mainGradient: "bg-gradient-to-br from-slate-800/50 to-slate-900/50 hover:from-slate-700/60 hover:to-slate-800/60",
    animatedGradient: "bg-gradient-to-r from-blue-500/0 via-purple-500/0 to-pink-500/0 group-hover:from-blue-500/10 group-hover:via-purple-500/5 group-hover:to-pink-500/10",
    outerGlow: "bg-gradient-to-r from-blue-500 to-purple-500",
    textGradient: "bg-gradient-to-r from-slate-300 to-slate-400 group-hover:from-white group-hover:to-slate-200",
    underlineGradient: "bg-gradient-to-r from-blue-500 to-purple-500"
  }), []);

  // Inline styles for animations
  const styles = `
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
  `;

  return (
    <>
      <style>{styles}</style>
      <div 
        className="group relative p-6 rounded-3xl backdrop-blur-sm transition-all duration-500 ease-out flex flex-col items-center justify-center gap-4 hover:scale-105 cursor-pointer border border-white/10 hover:border-white/20 shadow-xl hover:shadow-2xl hover:shadow-blue-500/10 techstack-reduce-motion techstack-reduce-motion-hover"
        style={{
          animationDelay: `${delay}ms`,
          animation: 'fadeInUp 0.6s ease-out both'
        }}
        onMouseEnter={(e) => {
          // Add floating animation on hover
          e.currentTarget.style.animation = 'techStackFloat 3s ease-in-out infinite';
        }}
        onMouseLeave={(e) => {
          // Restore original animation
          e.currentTarget.style.animation = 'fadeInUp 0.6s ease-out both';
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
          
          <img 
            src={TechStackIcon} 
            alt={`${Language} icon`} 
            className="relative h-16 w-16 md:h-20 md:w-20 drop-shadow-lg filter group-hover:drop-shadow-xl transition-all duration-300"
            loading="lazy"
            onError={(e) => {
              // Fallback if image fails to load
              e.target.style.display = 'none';
              const fallback = e.target.parentNode.querySelector('.techstack-fallback');
              if (fallback) fallback.style.display = 'flex';
            }}
            onLoad={(e) => {
              // Smooth image load
              e.target.style.opacity = '0';
              setTimeout(() => {
                e.target.style.transition = 'opacity 0.3s ease-in';
                e.target.style.opacity = '1';
              }, 100);
            }}
          />
          
          {/* Fallback for broken images */}
          <div 
            className="techstack-fallback hidden h-16 w-16 md:h-20 md:w-20 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-lg"
            style={{ display: 'none' }}
          >
            {Language.charAt(0).toUpperCase()}
          </div>
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

// Default props for better error handling
TechStackIcon.defaultProps = {
  TechStackIcon: '',
  Language: 'Tech',
  delay: 0
};

// Prop types validation (optional but recommended)
TechStackIcon.propTypes = {
  TechStackIcon: (props, propName, componentName) => {
    if (!props[propName]) {
      return new Error(`Invalid prop ${propName} supplied to ${componentName}. Validation failed.`);
    }
  },
  Language: (props, propName, componentName) => {
    if (!props[propName] || typeof props[propName] !== 'string') {
      return new Error(`Invalid prop ${propName} supplied to ${componentName}. Must be a string.`);
    }
  },
  delay: (props, propName, componentName) => {
    if (props[propName] && typeof props[propName] !== 'number') {
      return new Error(`Invalid prop ${propName} supplied to ${componentName}. Must be a number.`);
    }
  }
};

export default React.memo(TechStackIcon);


// USAGE EXAMPLE (commented out but included for reference)
/*
// Example of how to use this component in a grid:
const TechStackGrid = () => {
  const techStack = [
    { icon: "/icons/react.svg", name: "React", delay: 0 },
    { icon: "/icons/javascript.svg", name: "JavaScript", delay: 100 },
    { icon: "/icons/typescript.svg", name: "TypeScript", delay: 200 },
    { icon: "/icons/tailwind.svg", name: "Tailwind CSS", delay: 300 },
    { icon: "/icons/nodejs.svg", name: "Node.js", delay: 400 },
    { icon: "/icons/python.svg", name: "Python", delay: 500 },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 md:gap-6 p-4">
      {techStack.map((tech, index) => (
        <TechStackIcon
          key={tech.name}
          TechStackIcon={tech.icon}
          Language={tech.name}
          delay={tech.delay || index * 100}
        />
      ))}
    </div>
  );
};
*/