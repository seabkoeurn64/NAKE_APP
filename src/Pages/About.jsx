import React, { useEffect, memo, useMemo, useState } from "react"
import { Code, Award, Globe, ArrowUpRight, Sparkles, UserCheck, Download, Eye } from "lucide-react"

// Memoized Components
const Header = memo(() => (
  <div className="text-center mb-8 lg:mb-12 px-4">
    <div className="inline-block relative group mb-4">
      <div className="absolute -inset-4 bg-gradient-to-r from-[#6366f1] to-[#a855f7] rounded-full opacity-10 blur-xl group-hover:opacity-20 transition-opacity duration-500"></div>
      <h2 className="relative text-4xl sm:text-5xl lg:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#6366f1] via-[#8b5cf6] to-[#a855f7]">
        About Me
      </h2>
    </div>
    <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
      Crafting <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6366f1] to-[#a855f7] font-semibold">digital experiences</span> that blend aesthetics with functionality
    </p>
  </div>
));

const ProfileImage = memo(() => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div className="flex justify-center items-center p-4 lg:p-8">
      <div 
        className="relative group"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Animated background orb */}
        <div className="absolute -inset-8 bg-gradient-to-r from-[#6366f1] to-[#a855f7] rounded-full opacity-10 blur-3xl animate-pulse"></div>
        
        {/* Floating elements */}
        <div className="absolute -top-4 -right-4 w-8 h-8 bg-[#6366f1] rounded-full opacity-60 animate-bounce"></div>
        <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-[#a855f7] rounded-full opacity-40 animate-bounce" style={{animationDelay: '1s'}}></div>

        <div className="relative">
          <div className="relative w-64 h-64 sm:w-72 sm:h-72 lg:w-80 lg:h-80 rounded-3xl overflow-hidden shadow-2xl transform transition-all duration-700 group-hover:scale-105">
            {/* Gradient border */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[#6366f1] via-[#8b5cf6] to-[#a855f7] p-1">
              <div className="w-full h-full rounded-2xl bg-[#030014] relative overflow-hidden">
                {/* Image */}
                <img
                  src="/Cover.png"
                  alt="Koeurn - UI/UX Designer"
                  className={`w-full h-full object-cover transform transition-all duration-700 group-hover:scale-110 ${
                    imageLoaded ? 'opacity-100' : 'opacity-0'
                  }`}
                  onLoad={() => setImageLoaded(true)}
                  loading="lazy"
                />
                
                {/* Loading state */}
                {!imageLoaded && (
                  <div className="absolute inset-0 bg-gray-800 animate-pulse flex items-center justify-center">
                    <UserCheck className="w-12 h-12 text-gray-600" />
                  </div>
                )}
                
                {/* Overlay effects */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#030014] via-transparent to-transparent opacity-60"></div>
                <div className={`absolute inset-0 bg-gradient-to-br from-[#6366f1]/20 to-[#a855f7]/20 transition-opacity duration-500 ${isHovered ? 'opacity-100' : 'opacity-0'}`}></div>
                
                {/* Shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
              </div>
            </div>
          </div>
          
          {/* Status badge */}
          <div className="absolute -bottom-3 -right-3 bg-gradient-to-r from-[#6366f1] to-[#a855f7] rounded-2xl p-3 shadow-2xl transform transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12">
            <div className="flex items-center gap-2 text-white text-sm font-medium">
              <UserCheck className="w-4 h-4" />
              <span>Available</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

const StatCard = memo(({ icon: Icon, color, value, label, description }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="relative group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative z-10 bg-gray-900/60 backdrop-blur-xl rounded-2xl p-6 border border-white/10 overflow-hidden transition-all duration-500 hover:scale-105 hover:shadow-2xl h-full flex flex-col justify-between">
        {/* Animated background */}
        <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
        
        {/* Shimmer effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center bg-gradient-to-br ${color} shadow-lg transform transition-transform duration-300 group-hover:rotate-6`}>
              <Icon className="w-7 h-7 text-white" />
            </div>
            <span className="text-4xl sm:text-5xl font-bold text-white drop-shadow-lg">
              {value}+
            </span>
          </div>

          <div>
            <p className="text-sm uppercase tracking-widest text-gray-300 mb-3 font-semibold">
              {label}
            </p>
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-400 leading-relaxed">
                {description}
              </p>
              <ArrowUpRight className={`w-5 h-5 transition-colors duration-300 flex-shrink-0 ml-3 transform ${
                isHovered ? 'text-white translate-x-1 -translate-y-1' : 'text-white/60'
              }`} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

const AboutPage = () => {
  // Memoized calculations with error handling
  const { totalProjects, totalCertificates, YearExperience } = useMemo(() => {
    try {
      const storedProjects = JSON.parse(localStorage.getItem("projects") || "[]");
      const storedCertificates = JSON.parse(localStorage.getItem("certificates") || "[]");
      
      const startDate = new Date("2021-11-06");
      const today = new Date();
      const experience = today.getFullYear() - startDate.getFullYear() -
        (today < new Date(today.getFullYear(), startDate.getMonth(), startDate.getDate()) ? 1 : 0);

      return {
        totalProjects: storedProjects.length || 0,
        totalCertificates: storedCertificates.length || 0,
        YearExperience: experience || 0
      };
    } catch (error) {
      console.error('Error calculating stats:', error);
      return {
        totalProjects: 0,
        totalCertificates: 0,
        YearExperience: 0
      };
    }
  }, []);

  // Memoized stats data
  const statsData = useMemo(() => [
    {
      icon: Code,
      color: "from-[#6366f1] to-[#8b5cf6]",
      value: totalProjects,
      label: "Projects",
      description: "Successful designs delivered"
    },
    {
      icon: Award,
      color: "from-[#a855f7] to-[#ec4899]",
      value: totalCertificates,
      label: "Certificates",
      description: "Professional achievements"
    },
    {
      icon: Globe,
      color: "from-[#8b5cf6] to-[#6366f1]",
      value: YearExperience,
      label: "Years Experience",
      description: "Design excellence"
    },
  ], [totalProjects, totalCertificates, YearExperience]);

  // Function to handle View Work button click - IMPROVED VERSION
  const handleViewWork = () => {
    console.log('View Work button clicked'); // Debug log
    
    // Method 1: Try to find Portfolio section with multiple possible IDs
    const portfolioSection = document.getElementById('Portfolio') || 
                            document.getElementById('portfolio') || 
                            document.getElementById('Portofolio');
    
    if (portfolioSection) {
      console.log('Portfolio section found:', portfolioSection);
      // Smooth scroll to portfolio section
      portfolioSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    } else {
      // Method 2: Try to find by class name
      const portfolioByClass = document.querySelector('.portfolio-section, .portfolio, [class*="portfolio"]');
      if (portfolioByClass) {
        console.log('Portfolio section found by class:', portfolioByClass);
        portfolioByClass.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
        return;
      }
      
      // Method 3: Use hash navigation
      console.log('Portfolio section not found, using hash navigation');
      window.location.href = '#Portfolio';
      
      // Method 4: Fallback - scroll to bottom
      setTimeout(() => {
        window.scrollTo({
          top: document.body.scrollHeight,
          behavior: 'smooth'
        });
      }, 100);
    }
  };

  return (
    <div
      className="min-h-screen py-12 lg:py-24 text-white overflow-hidden bg-gradient-to-br from-[#030014] via-[#0f0a28] to-[#030014] relative"
      id="About"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-[#6366f1] rounded-full blur-3xl opacity-10 animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#a855f7] rounded-full blur-3xl opacity-5 animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <Header />

        {/* Main Content - Fixed layout */}
        <div className="w-full mx-auto">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 xl:gap-16 items-center justify-between">
            
            {/* Left Side - Content */}
            <div className="w-full lg:w-1/2 space-y-6 lg:space-y-8 text-center lg:text-left order-2 lg:order-1">
              <div>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300 block">
                    Koeurn
                  </span>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6366f1] via-[#8b5cf6] to-[#a855f7] block mt-2">
                    UI/UX Designer
                  </span>
                </h1>
              </div>
              
              <p className="text-lg sm:text-xl text-gray-300 leading-relaxed">
                Passionate about creating <span className="text-white font-medium">intuitive digital experiences</span> that seamlessly blend aesthetics with functionality. I transform complex challenges into elegant solutions that users love.
              </p>

              {/* Enhanced description section */}
              <div className="bg-gray-900/40 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center justify-center lg:justify-start gap-2">
                  <Sparkles className="w-5 h-5 text-[#a855f7]" />
                  My Approach
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  I believe in <span className="text-white font-medium">user-centered design</span> that prioritizes both aesthetics and functionality. Every project starts with understanding user needs and ends with delivering seamless, beautiful experiences that make a difference.
                </p>
              </div>

              {/* CTA Buttons - IMPROVED View Work button */}
              <div className="flex flex-col sm:flex-row gap-4">
                <a 
                  href="https://drive.google.com/file/d/1qJ7awhiMQMHxmhZu5D8ySG3DvtQx_yLK/view?usp=drive_link" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1"
                >
                  <button className="w-full px-8 py-4 rounded-2xl bg-gradient-to-r from-[#6366f1] to-[#a855f7] text-white font-semibold transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center gap-3 shadow-2xl hover:shadow-3xl group">
                    <Download className="w-5 h-5 group-hover:animate-bounce" />
                    Download CV
                  </button>
                </a>
                
                {/* IMPROVED: Better button with multiple fallbacks */}
                <div className="flex-1">
                  <button 
                    onClick={handleViewWork}
                    className="w-full px-8 py-4 rounded-2xl border-2 border-[#a855f7] text-[#a855f7] font-semibold transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center gap-3 hover:bg-[#a855f7]/10 group cursor-pointer hover:border-[#8b5cf6] hover:text-[#8b5cf6]"
                  >
                    <Eye className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    View Work
                  </button>
                </div>
              </div>
            </div>

            {/* Right Side - Profile Image */}
            <div className="w-full lg:w-1/2 flex justify-center order-1 lg:order-2">
              <ProfileImage />
            </div>
          </div>

          {/* Stats Section */}
          <div className="mt-16 lg:mt-24">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
              {statsData.map((stat, index) => (
                <StatCard key={index} {...stat} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(AboutPage);