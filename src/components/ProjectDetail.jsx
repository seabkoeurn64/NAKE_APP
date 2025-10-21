import React, { useEffect, useState, useCallback, memo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft, Palette, Star,
  ChevronRight, Brush, Image,
} from "lucide-react";

// Memoized Loading Component
const LoadingState = memo(({ onBack }) => (
  <div className="min-h-screen bg-[#030014] flex items-center justify-center">
    <div className="text-center space-y-6 animate-fadeIn">
      <div className="w-16 h-16 md:w-24 md:h-24 mx-auto border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
      <h2 className="text-xl md:text-3xl font-bold text-white">Loading Design Project...</h2>
      <button 
        onClick={onBack}
        className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg text-white font-medium hover:scale-105 transition-transform duration-300"
      >
        Back to Portfolio
      </button>
    </div>
  </div>
));

// Memoized Background Effects with reduced motion support
const BackgroundEffects = memo(() => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handleChange);
    
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none">
      <div className="absolute -inset-[10px] opacity-20">
        <div 
          className="absolute top-0 -left-4 w-72 md:w-96 h-72 md:h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-70"
          style={{ 
            animation: prefersReducedMotion ? 'none' : 'blob 10s infinite' 
          }}
        />
        <div 
          className="absolute top-0 -right-4 w-72 md:w-96 h-72 md:h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-70"
          style={{ 
            animation: prefersReducedMotion ? 'none' : 'blob 10s infinite 2s' 
          }}
        />
        <div 
          className="absolute -bottom-8 left-20 w-72 md:w-96 h-72 md:h-96 bg-fuchsia-500 rounded-full mix-blend-multiply filter blur-3xl opacity-70"
          style={{ 
            animation: prefersReducedMotion ? 'none' : 'blob 10s infinite 4s' 
          }}
        />
      </div>
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.02]" />
    </div>
  );
});

// Memoized Navigation Component
const ProjectNavigation = memo(({ onBack, projectTitle }) => (
  <div className="flex items-center space-x-2 md:space-x-4 mb-6 md:mb-12 animate-fadeIn">
    <button
      onClick={onBack}
      className="group inline-flex items-center space-x-2 md:space-x-3 px-3 md:px-6 py-2 md:py-3 bg-white/5 backdrop-blur-xl rounded-xl md:rounded-2xl text-white/90 hover:bg-white/10 transition-all duration-300 border border-white/10 hover:border-white/20 active:scale-95 text-sm md:text-base font-medium touch-manipulation"
    >
      <ArrowLeft className="w-4 h-4 md:w-5 md:h-5 group-hover:-translate-x-0.5 md:group-hover:-translate-x-1 transition-transform" />
      <span className="hidden sm:inline">Back to Projects</span>
      <span className="sm:hidden">Back</span>
    </button>
    <div className="flex items-center space-x-1 md:space-x-3 text-sm md:text-base text-white/50">
      <span className="text-white/70 hidden sm:inline">Portfolio</span>
      <ChevronRight className="w-3 h-3 md:w-4 md:h-4" />
      <span className="text-white/90 truncate font-medium max-w-[120px] md:max-w-none">{projectTitle}</span>
    </div>
  </div>
));

// Memoized Design Process Component
const DesignProcess = memo(() => (
  <div className="bg-white/[0.03] backdrop-blur-xl rounded-2xl md:rounded-3xl p-4 md:p-6 lg:p-8 border border-white/10 space-y-4 md:space-y-6 hover:border-white/20 transition-all duration-500 group">
    <h3 className="text-lg md:text-xl lg:text-2xl font-semibold text-white/90 flex items-center gap-2 md:gap-4">
      <Brush className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 text-purple-400 group-hover:rotate-12 transition-transform duration-300" />
      Design Process
    </h3>
    <div className="space-y-2 md:space-y-4">
      {[
        { step: "Research & Analysis", color: "bg-purple-400" },
        { step: "Concept Development", color: "bg-pink-400" },
        { step: "Final Execution", color: "bg-fuchsia-400" }
      ].map((item, index) => (
        <div 
          key={index} 
          className="flex items-center space-x-2 md:space-x-4 p-2 md:p-3 lg:p-4 rounded-xl md:rounded-2xl bg-white/5 hover:bg-white/10 transition-all duration-300 group/item cursor-default"
        >
          <div className={`w-2 h-2 md:w-3 md:h-3 ${item.color} rounded-full group-hover/item:scale-150 transition-transform duration-300`} />
          <span className="text-gray-300 text-sm md:text-base group-hover/item:text-white transition-colors">
            {item.step}
          </span>
        </div>
      ))}
    </div>
  </div>
));

// Memoized Project Impact Component
const ProjectImpact = memo(() => (
  <div className="bg-white/[0.03] backdrop-blur-xl rounded-2xl md:rounded-3xl p-4 md:p-6 lg:p-8 border border-white/10 space-y-4 md:space-y-6 hover:border-white/20 transition-all duration-500 group">
    <h3 className="text-lg md:text-xl lg:text-2xl font-semibold text-white/90 flex items-center gap-2 md:gap-4">
      <Star className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 text-yellow-400 group-hover:rotate-[20deg] transition-transform duration-300" />
      Project Impact
    </h3>
    <div className="space-y-3 md:space-y-4">
      <p className="text-gray-300 text-sm md:text-base leading-relaxed">
        This design showcases innovative approaches to visual communication, combining modern aesthetics with functional design principles to create engaging user experiences.
      </p>
      <div className="grid grid-cols-2 gap-2 md:gap-4 pt-2 md:pt-4">
        <div className="text-center p-2 md:p-3 lg:p-4 rounded-xl md:rounded-2xl bg-purple-600/10 border border-purple-500/20">
          <div className="text-lg md:text-xl lg:text-2xl font-bold text-purple-300">100%</div>
          <div className="text-xs text-gray-400">Creative</div>
        </div>
        <div className="text-center p-2 md:p-3 lg:p-4 rounded-xl md:rounded-2xl bg-pink-600/10 border border-pink-500/20">
          <div className="text-lg md:text-xl lg:text-2xl font-bold text-pink-300">100%</div>
          <div className="text-xs text-gray-400">Innovative</div>
        </div>
      </div>
    </div>
  </div>
));

// Memoized Image Component with lazy loading
const ProjectImage = memo(({ src, alt, onLoad, onError, isLoaded }) => (
  <div className="relative rounded-xl md:rounded-2xl lg:rounded-3xl overflow-hidden border border-white/10 shadow-2xl group">
    <div className="absolute inset-0 bg-gradient-to-t from-[#030014] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />
    <img
      src={src}
      alt={alt}
      className="w-full h-64 sm:h-80 md:h-96 lg:h-[500px] object-contain transform transition-transform duration-700 will-change-transform group-hover:scale-105 bg-gray-900/30"
      loading="lazy"
      decoding="async"
      onLoad={onLoad}
      onError={onError}
    />
    <div className="absolute inset-0 border-2 border-white/0 group-hover:border-white/20 transition-all duration-500 rounded-xl md:rounded-2xl lg:rounded-3xl" />
    
    {/* Loading Overlay */}
    {!isLoaded && (
      <div className="absolute inset-0 bg-gray-900/50 flex items-center justify-center rounded-xl md:rounded-2xl lg:rounded-3xl">
        <div className="text-center space-y-2 md:space-y-4">
          <div className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto" />
          <p className="text-gray-400 text-xs md:text-sm">Loading image...</p>
        </div>
      </div>
    )}
  </div>
));

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Check mobile device and reduced motion preference
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    const checkReducedMotion = () => {
      setPrefersReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    };
    
    checkMobile();
    checkReducedMotion();
    
    window.addEventListener('resize', checkMobile);
    
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    mediaQuery.addEventListener('change', checkReducedMotion);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
      mediaQuery.removeEventListener('change', checkReducedMotion);
    };
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Get projects from localStorage
    const storedProjects = JSON.parse(localStorage.getItem("projects")) || [];
    
    // Find the project by ID
    const selectedProject = storedProjects.find((p) => String(p.id) === id);
    
    if (selectedProject) {
      setProject(selectedProject);
    }
  }, [id]);

  const handleBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  const handleViewImage = useCallback(() => {
    if (project?.Img) {
      window.open(project.Img, '_blank', 'noopener,noreferrer');
    }
  }, [project]);

  const handleMoreProjects = useCallback(() => {
    navigate('/');
  }, [navigate]);

  const handleImageLoad = useCallback(() => {
    setIsImageLoaded(true);
  }, []);

  const handleImageError = useCallback((e) => {
    console.error('Failed to load project image');
    e.target.src = "/fallback-poster.jpg";
    setIsImageLoaded(true);
  }, []);

  if (!project) {
    return <LoadingState onBack={handleBack} />;
  }

  return (
    <div className="min-h-screen bg-[#030014] px-3 sm:px-4 md:px-[2%] relative overflow-hidden">
      <BackgroundEffects />

      <div className="relative">
        <div className="max-w-7xl mx-auto py-6 md:py-12 lg:py-16">
          <ProjectNavigation onBack={handleBack} projectTitle={project.Title} />

          <div className="grid lg:grid-cols-2 gap-6 md:gap-12 lg:gap-16">
            {/* Left Column - Project Info */}
            <div 
              className="space-y-6 md:space-y-8 lg:space-y-12"
              style={{
                animation: prefersReducedMotion ? 'none' : 'slideInLeft 0.7s ease-out'
              }}
            >
              {/* Enhanced Title Section */}
              <div className="space-y-4 md:space-y-6">
                <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl xl:text-7xl font-bold bg-gradient-to-r from-purple-200 via-pink-200 to-fuchsia-200 bg-clip-text text-transparent leading-tight">
                  {project.Title}
                </h1>
                <div className="flex items-center space-x-3 md:space-x-4">
                  <div 
                    className="relative h-1.5 md:h-2 w-16 md:w-24 lg:w-32 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                    style={{
                      animation: prefersReducedMotion ? 'none' : 'pulse 2s infinite'
                    }}
                  />
                  <div 
                    className="w-1.5 h-1.5 md:w-2 md:h-2 bg-purple-400 rounded-full"
                    style={{
                      animation: prefersReducedMotion ? 'none' : 'ping 1s infinite'
                    }}
                  />
                </div>
              </div>

              {/* Enhanced Description */}
              <div className="prose prose-invert max-w-none">
                <p className="text-base md:text-lg lg:text-xl text-gray-300/90 leading-relaxed font-light tracking-wide">
                  {project.Description}
                </p>
              </div>

              {/* Enhanced Action Buttons */}
              <div className="flex flex-wrap gap-3 md:gap-4 lg:gap-6">
                <button
                  onClick={handleViewImage}
                  className="group relative inline-flex items-center space-x-2 md:space-x-3 px-4 md:px-6 lg:px-8 py-2 md:py-3 lg:py-4 bg-gradient-to-r from-purple-600/20 to-pink-600/20 hover:from-purple-600/40 hover:to-pink-600/30 text-purple-300 rounded-xl md:rounded-2xl transition-all duration-300 border border-purple-500/30 hover:border-purple-400/50 backdrop-blur-xl overflow-hidden text-sm md:text-base lg:text-lg font-medium touch-manipulation active:scale-95"
                >
                  <div className="absolute inset-0 translate-y-[100%] bg-gradient-to-r from-purple-600/10 to-pink-600/10 transition-transform duration-300 group-hover:translate-y-[0%]" />
                  <Image className="relative w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 group-hover:scale-110 transition-transform" />
                  <span className="relative">View Full Image</span>
                </button>

                <button
                  onClick={handleMoreProjects}
                  className="group relative inline-flex items-center space-x-2 md:space-x-3 px-4 md:px-6 lg:px-8 py-2 md:py-3 lg:py-4 bg-gradient-to-r from-fuchsia-600/20 to-rose-600/20 hover:from-fuchsia-600/40 hover:to-rose-600/30 text-fuchsia-300 rounded-xl md:rounded-2xl transition-all duration-300 border border-fuchsia-500/30 hover:border-fuchsia-400/50 backdrop-blur-xl overflow-hidden text-sm md:text-base lg:text-lg font-medium touch-manipulation active:scale-95"
                >
                  <div className="absolute inset-0 translate-y-[100%] bg-gradient-to-r from-fuchsia-600/10 to-rose-600/10 transition-transform duration-300 group-hover:translate-y-[0%]" />
                  <Palette className="relative w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 group-hover:scale-110 transition-transform" />
                  <span className="relative">More Projects</span>
                </button>
              </div>

              <DesignProcess />
            </div>

            {/* Right Column - Visual Content */}
            <div 
              className="space-y-6 md:space-y-8 lg:space-y-12"
              style={{
                animation: prefersReducedMotion ? 'none' : 'slideInRight 0.7s ease-out'
              }}
            >
              <ProjectImage 
                src={project.Img}
                alt={project.Title}
                onLoad={handleImageLoad}
                onError={handleImageError}
                isLoaded={isImageLoaded}
              />

              <ProjectImpact />
            </div>
          </div>
        </div>
      </div>

      {/* Inline styles for animations with reduced motion support */}
      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.7s ease-out;
        }
        .animate-slideInLeft {
          animation: slideInLeft 0.7s ease-out;
        }
        .animate-slideInRight {
          animation: slideInRight 0.7s ease-out;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
};

export default memo(ProjectDetails);