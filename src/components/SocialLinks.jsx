import React, { memo } from "react";
import { Linkedin, Instagram, Youtube, Github, MessageCircle } from "lucide-react";

// Memoized social data to prevent re-renders
const socials = [
  {
    name: "LinkedIn",
    icon: <Linkedin className="w-5 h-5 sm:w-6 sm:h-6" />,
    url: "https://linkedin.com/in/ekizr",
    handle: "@koeurn65",
    color: "from-blue-500 to-blue-600",
    bgColor: "hover:bg-blue-500/20"
  },
  {
    name: "Instagram",
    icon: <Instagram className="w-5 h-5 sm:w-6 sm:h-6" />,
    url: "https://instagram.com/koeurn65",
    handle: "@koeurn65",
    color: "from-pink-500 to-purple-500",
    bgColor: "hover:bg-pink-500/20"
  },
  {
    name: "YouTube",
    icon: <Youtube className="w-5 h-5 sm:w-6 sm:h-6" />,
    url: "https://youtube.com/@koeurn65",
    handle: "@koeurn65",
    color: "from-red-500 to-red-600",
    bgColor: "hover:bg-red-500/20"
  },
  {
    name: "GitHub",
    icon: <Github className="w-5 h-5 sm:w-6 sm:h-6" />,
    url: "https://github.com/seabkoeurn64",
    handle: "@seabkoeurn64",
    color: "from-gray-600 to-gray-700",
    bgColor: "hover:bg-gray-500/20"
  },
  {
    name: "TikTok",
    icon: <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6" />,
    url: "https://tiktok.com/@123kr123",
    handle: "@123kr123",
    color: "from-black to-gray-800",
    bgColor: "hover:bg-gray-800/20"
  },
  {
    name: "Telegram",
    icon: (
      <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.157l-1.895 8.386c-.125.534-.462.657-.924.41l-2.55-1.876-1.233 1.184c-.136.136-.25.25-.512.25l.183-2.587 4.734-4.27c.206-.185-.045-.287-.318-.1l-5.846 3.68-2.524-.788c-.545-.17-.556-.544.114-.806l9.724-3.73c.453-.18.85.112.7.747z"/>
      </svg>
    ),
    url: "https://t.me/koeurn65",
    handle: "@koeurn65",
    color: "from-blue-400 to-blue-500",
    bgColor: "hover:bg-blue-400/20"
  }
];

const SocialLinkItem = memo(({ social, index }) => (
  <a
    href={social.url}
    target="_blank"
    rel="noopener noreferrer"
    className={`group relative bg-white/5 rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-white/10 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:border-white/20 ${social.bgColor}`}
    data-aos="fade-up"
    data-aos-delay={index * 100}
    data-aos-duration="600"
  >
    {/* Hover Effect */}
    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-xl sm:rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    
    {/* Icon */}
    <div className={`relative z-10 bg-gradient-to-br ${social.color} p-2 sm:p-3 rounded-lg sm:rounded-xl mb-2 sm:mb-3 group-hover:shadow-lg transition-all duration-300 group-hover:scale-110 mx-auto w-10 h-10 sm:w-14 sm:h-14 flex items-center justify-center`}>
      {social.icon}
    </div>
    
    {/* Text */}
    <div className="relative z-10 text-center">
      <h4 className="text-white font-semibold text-xs sm:text-sm mb-1 truncate">
        {social.name}
      </h4>
      <p className="text-gray-400 text-xs truncate">
        {social.handle}
      </p>
    </div>
  </a>
));

const SocialLinks = () => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 max-w-4xl mx-auto px-2 sm:px-0">
      {socials.map((social, index) => (
        <SocialLinkItem 
          key={social.name} 
          social={social} 
          index={index} 
        />
      ))}
    </div>
  );
};

export default memo(SocialLinks);