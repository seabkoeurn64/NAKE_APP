import React, { useEffect, useState, useCallback, memo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft, Palette, Star,
  ChevronRight, Brush, Image,
} from "lucide-react";

// Memoized Loading Component
const LoadingState = memo(({ onBack }) => (
  <div className="min-h-screen bg-[#030014] flex items-center justify-center p-4">
    <div className="text-center space-y-4">
      <div className="w-12 h-12 mx-auto border-3 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
      <h2 className="text-lg font-bold text-white">Loading Design Project...</h2>
      <button 
        onClick={onBack}
        className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg text-white text-sm font-medium active:scale-95 transition-transform"
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

  if (prefersReducedMotion) {
    return (
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.02]" />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      <div className="absolute -inset-4 opacity-10">
        <div className="absolute top-10 left-4 w-48 h-48 bg-purple-500 rounded-full blur-2xl opacity-40" />
        <div className="absolute top-20 right-4 w-40 h-40 bg-pink-500 rounded-full blur-2xl opacity-40" />
        <div className="absolute bottom-10 left-8 w-36 h-36 bg-fuchsia-500 rounded-full blur-2xl opacity-40" />
      </div>
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.02]" />
    </div>
  );
});

// Memoized Navigation Component - FIXED Z-INDEX
const ProjectNavigation = memo(({ onBack, projectTitle }) => (
  <div className="flex items-center space-x-2 mb-4 pt-16 md:pt-4"> {/* Added padding top for mobile */}
    <button
      onClick={onBack}
      className="group inline-flex items-center space-x-2 px-4 py-3 bg-white/10 backdrop-blur-xl rounded-xl text-white/90 active:bg-white/20 transition-all duration-200 border border-white/20 active:scale-95 text-sm font-medium touch-manipulation z-50 relative" // Added z-50 and relative
    >
      <ArrowLeft className="w-4 h-4" />
      <span>Back</span>
    </button>
    <div className="flex items-center space-x-1 text-xs text-white/50 flex-1 min-w-0 ml-2">
      <span className="text-white/70">Portfolio</span>
      <ChevronRight className="w-3 h-3" />
      <span className="text-white/90 truncate font-medium">{projectTitle}</span>
    </div>
  </div>
));

// Memoized Design Process Component
const DesignProcess = memo(() => (
  <div className="bg-white/[0.03] backdrop-blur-xl rounded-xl p-4 border border-white/10 space-y-3">
    <h3 className="text-base font-semibold text-white/90 flex items-center gap-2">
      <Brush className="w-4 h-4 text-purple-400" />
      Design Process
    </h3>
    <div className="space-y-2">
      {[
        { step: "Research & Analysis", color: "bg-purple-400" },
        { step: "Concept Development", color: "bg-pink-400" },
        { step: "Final Execution", color: "bg-fuchsia-400" }
      ].map((item, index) => (
        <div 
          key={index} 
          className="flex items-center space-x-2 p-2 rounded-lg bg-white/5"
        >
          <div className={`w-2 h-2 ${item.color} rounded-full`} />
          <span className="text-gray-300 text-sm">
            {item.step}
          </span>
        </div>
      ))}
    </div>
  </div>
));

// Memoized Project Impact Component
const ProjectImpact = memo(() => (
  <div className="bg-white/[0.03] backdrop-blur-xl rounded-xl p-4 border border-white/10 space-y-3">
    <h3 className="text-base font-semibold text-white/90 flex items-center gap-2">
      <Star className="w-4 h-4 text-yellow-400" />
      Project Impact
    </h3>
    <div className="space-y-2">
      <p className="text-gray-300 text-sm leading-relaxed">
        This design showcases innovative approaches to visual communication, combining modern aesthetics with functional design principles.
      </p>
      <div className="grid grid-cols-2 gap-2 pt-2">
        <div className="text-center p-2 rounded-lg bg-purple-600/10 border border-purple-500/20">
          <div className="text-base font-bold text-purple-300">100%</div>
          <div className="text-xs text-gray-400">Creative</div>
        </div>
        <div className="text-center p-2 rounded-lg bg-pink-600/10 border border-pink-500/20">
          <div className="text-base font-bold text-pink-300">100%</div>
          <div className="text-xs text-gray-400">Innovative</div>
        </div>
      </div>
    </div>
  </div>
));

// Memoized Image Component with lazy loading
const ProjectImage = memo(({ src, alt, onLoad, onError, isLoaded }) => (
  <div className="relative rounded-xl overflow-hidden border border-white/10 shadow-lg">
    <img
      src={src}
      alt={alt}
      className="w-full h-48 object-contain bg-gray-900/30"
      loading="lazy"
      decoding="async"
      onLoad={onLoad}
      onError={onError}
    />
    
    {/* Loading Overlay */}
    {!isLoaded && (
      <div className="absolute inset-0 bg-gray-900/50 flex items-center justify-center rounded-xl">
        <div className="text-center space-y-2">
          <div className="w-6 h-6 border-3 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto" />
          <p className="text-gray-400 text-xs">Loading image...</p>
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
  const [isMobile, setIsMobile] = useState(true);

  // Check mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  useEffect(() => {
    // Scroll to top but below navbar
    window.scrollTo(0, 0);
    
    // Get projects from localStorage
    const storedProjects = JSON.parse(localStorage.getItem("projects")) || [];
    
    // Find the project by ID
    const selectedProject = storedProjects.find((p) => String(p.id) === id);
    
    if (selectedProject) {
      setProject(selectedProject);
    } else {
      // If project not found, redirect to home
      console.log('Project not found, redirecting to home');
      navigate('/');
    }
  }, [id, navigate]);

  // FIXED: Better back function with timeout
  const handleBack = useCallback((e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    console.log('Back button clicked');
    
    // Small delay to ensure click is registered
    setTimeout(() => {
      if (window.history.length > 1) {
        navigate(-1);
      } else {
        navigate('/');
      }
    }, 50);
  }, [navigate]);

  // FIXED: Improved image view function
  const handleViewImage = useCallback((e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    if (project?.Img) {
      console.log('Opening image:', project.Img);
      // Create a new window/tab for the image
      const newWindow = window.open(project.Img, '_blank');
      if (!newWindow) {
        // If popup blocked, fallback to current window
        window.location.href = project.Img;
      }
    } else {
      console.log('No image URL available');
    }
  }, [project]);

  // FIXED: Improved more projects function
  const handleMoreProjects = useCallback((e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    console.log('More projects clicked');
    navigate('/'); // Navigate to home
  }, [navigate]);

  const handleImageLoad = useCallback(() => {
    console.log('Image loaded successfully');
    setIsImageLoaded(true);
  }, []);

  const handleImageError = useCallback((e) => {
    console.error('Failed to load project image');
    // Use a placeholder image or show error
    e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%231e1b4b'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='18' fill='%238b5cf6'%3EImage Not Available%3C/text%3E%3C/svg%3E";
    setIsImageLoaded(true);
  }, []);

  // Add debug logging
  useEffect(() => {
    console.log('ProjectDetails mounted with ID:', id);
    console.log('Project data:', project);
    console.log('Navigation function available:', !!navigate);
  }, [id, project, navigate]);

  if (!project) {
    return <LoadingState onBack={handleBack} />;
  }

  return (
    <div className="min-h-screen bg-[#030014] px-3 relative overflow-x-hidden">
      <BackgroundEffects />

      {/* FIXED: Added top padding to avoid navbar overlap */}
      <div className="relative pt-20 md:pt-4"> {/* Added padding top */}
        <div className="max-w-7xl mx-auto py-4">
          <ProjectNavigation onBack={handleBack} projectTitle={project.Title} />

          <div className="space-y-6">
            {/* Project Image - Top on mobile */}
            <ProjectImage 
              src={project.Img}
              alt={project.Title}
              onLoad={handleImageLoad}
              onError={handleImageError}
              isLoaded={isImageLoaded}
            />

            {/* Project Info */}
            <div className="space-y-4">
              {/* Title Section */}
              <div className="space-y-2">
                <h1 className="text-xl font-bold bg-gradient-to-r from-purple-200 via-pink-200 to-fuchsia-200 bg-clip-text text-transparent leading-tight">
                  {project.Title}
                </h1>
                <div className="flex items-center space-x-2">
                  <div className="h-1 w-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" />
                </div>
              </div>

              {/* Description */}
              <div>
                <p className="text-sm text-gray-300/90 leading-relaxed">
                  {project.Description}
                </p>
              </div>

              {/* FIXED: Action Buttons with better event handling */}
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={handleViewImage}
                  className="flex-1 min-w-[120px] inline-flex items-center justify-center space-x-1 px-3 py-3 bg-gradient-to-r from-purple-600/20 to-pink-600/20 text-purple-300 rounded-lg transition-all duration-200 border border-purple-500/30 backdrop-blur-xl text-xs font-medium active:scale-95 touch-manipulation z-40 relative" // Added z-40
                >
                  <Image className="w-3 h-3" />
                  <span>Full Image</span>
                </button>

                <button
                  onClick={handleMoreProjects}
                  className="flex-1 min-w-[120px] inline-flex items-center justify-center space-x-1 px-3 py-3 bg-gradient-to-r from-fuchsia-600/20 to-rose-600/20 text-fuchsia-300 rounded-lg transition-all duration-200 border border-fuchsia-500/30 backdrop-blur-xl text-xs font-medium active:scale-95 touch-manipulation z-40 relative" // Added z-40
                >
                  <Palette className="w-3 h-3" />
                  <span>More Projects</span>
                </button>
              </div>

              {/* Additional Sections */}
              <DesignProcess />
              <ProjectImpact />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(ProjectDetails);