import React, { memo } from "react";
import { Linkedin, Instagram, Youtube, Github, MessageCircle } from "lucide-react";

// Memoized social data to prevent re-renders
const socials = [
  {
    name: "LinkedIn",
    icon: Linkedin,
    url: "https://linkedin.com/in/ekizr",
    handle: "@koeurn65",
    color: "from-blue-500 to-blue-600",
    bgColor: "hover:bg-blue-500/20",
    borderColor: "hover:border-blue-500/30"
  },
  {
    name: "Instagram",
    icon: Instagram,
    url: "https://instagram.com/koeurn65",
    handle: "@koeurn65",
    color: "from-pink-500 to-purple-500",
    bgColor: "hover:bg-pink-500/20",
    borderColor: "hover:border-pink-500/30"
  },
  {
    name: "YouTube",
    icon: Youtube,
    url: "https://youtube.com/@koeurn65",
    handle: "@koeurn65",
    color: "from-red-500 to-red-600",
    bgColor: "hover:bg-red-500/20",
    borderColor: "hover:border-red-500/30"
  },
  {
    name: "GitHub",
    icon: Github,
    url: "https://github.com/seabkoeurn64",
    handle: "@seabkoeurn64",
    color: "from-gray-600 to-gray-700",
    bgColor: "hover:bg-gray-500/20",
    borderColor: "hover:border-gray-500/30"
  },
  {
    name: "TikTok",
    icon: MessageCircle,
    url: "https://tiktok.com/@123kr123",
    handle: "@123kr123",
    color: "from-black to-gray-800",
    bgColor: "hover:bg-gray-800/20",
    borderColor: "hover:border-gray-800/30"
  },
  {
    name: "Telegram",
    icon: (props) => (
      <svg {...props} fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.157l-1.895 8.386c-.125.534-.462.657-.924.41l-2.55-1.876-1.233 1.184c-.136.136-.25.25-.512.25l.183-2.587 4.734-4.27c.206-.185-.045-.287-.318-.1l-5.846 3.68-2.524-.788c-.545-.17-.556-.544.114-.806l9.724-3.73c.453-.18.85.112.7.747z"/>
      </svg>
    ),
    url: "https://t.me/koeurn65",
    handle: "@koeurn65",
    color: "from-blue-400 to-blue-500",
    bgColor: "hover:bg-blue-400/20",
    borderColor: "hover:border-blue-400/30"
  }
];

const SocialLinkItem = memo(({ social, index }) => {
  const IconComponent = social.icon;
  
  const handleClick = (e) => {
    // Optional: Add analytics tracking here
    console.log(`Clicked ${social.name} link`);
    
    // Optional: Add smooth transition effect
    e.currentTarget.style.transform = 'scale(0.95)';
    setTimeout(() => {
      e.currentTarget.style.transform = 'scale(1)';
    }, 150);
  };

  return (
    <a
      href={social.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`
        group relative bg-white/5 rounded-xl sm:rounded-2xl p-3 sm:p-4 
        border border-white/10 backdrop-blur-sm transition-all duration-300 
        hover:scale-105 hover:border-white/20 ${social.bgColor} ${social.borderColor}
        focus:outline-none focus:ring-2 focus:ring-white/50 focus:scale-105
      `}
      data-aos="fade-up"
      data-aos-delay={index * 100}
      data-aos-duration="600"
      onClick={handleClick}
      aria-label={`Visit ${social.name} profile (${social.handle})`}
    >
      {/* Animated Background Gradient */}
      <div 
        className={`
          absolute inset-0 rounded-xl sm:rounded-2xl bg-gradient-to-br 
          opacity-0 group-hover:opacity-100 transition-all duration-500
          ${social.color}
        `}
        style={{ 
          filter: 'blur(8px)',
          transform: 'scale(1.1)'
        }}
      />
      
      {/* Main Content Container */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Icon Container */}
        <div 
          className={`
            bg-gradient-to-br ${social.color} p-2 sm:p-3 rounded-lg sm:rounded-xl 
            mb-2 sm:mb-3 group-hover:shadow-lg transition-all duration-300 
            group-hover:scale-110 w-10 h-10 sm:w-14 sm:h-14 flex items-center justify-center
            group-focus:scale-110 group-focus:shadow-lg
          `}
        >
          <IconComponent className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
        </div>
        
        {/* Text Content */}
        <div className="text-center w-full">
          <h4 
            className="text-white font-semibold text-xs sm:text-sm mb-1 truncate transition-colors duration-300 group-hover:text-white/90"
          >
            {social.name}
          </h4>
          <p 
            className="text-gray-400 text-xs truncate transition-colors duration-300 group-hover:text-gray-300"
          >
            {social.handle}
          </p>
        </div>
      </div>

      {/* Subtle Pulse Effect on Hover */}
      <div 
        className={`
          absolute inset-0 rounded-xl sm:rounded-2xl border-2 border-transparent
          opacity-0 group-hover:opacity-100 transition-opacity duration-300
          bg-gradient-to-br ${social.color}
        `}
        style={{
          mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
          padding: '1px'
        }}
      />
    </a>
  );
});

SocialLinkItem.displayName = 'SocialLinkItem';

const SocialLinks = () => {
  // Calculate staggered delays for animation
  const getStaggerDelay = (index) => {
    return (index % 3) * 100; // Stagger in columns
  };

  return (
    <div 
      className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 max-w-4xl mx-auto px-2 sm:px-0"
      role="list"
      aria-label="Social media links"
    >
      {socials.map((social, index) => (
        <div key={`${social.name}-${index}`} role="listitem">
          <SocialLinkItem 
            social={social} 
            index={getStaggerDelay(index)} 
          />
        </div>
      ))}
    </div>
  );
};

SocialLinks.displayName = 'SocialLinks';

export default memo(SocialLinks);