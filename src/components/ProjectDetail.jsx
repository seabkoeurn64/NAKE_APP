import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft, Palette, Star,
  ChevronRight, Brush, Image,
} from "lucide-react";

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

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

  if (!project) {
    return (
      <div className="min-h-screen bg-[#030014] flex items-center justify-center">
        <div className="text-center space-y-6 animate-fadeIn">
          <div className="w-16 h-16 md:w-24 md:h-24 mx-auto border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
          <h2 className="text-xl md:text-3xl font-bold text-white">Loading Design Project...</h2>
          <button 
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg text-white font-medium hover:scale-105 transition-transform"
          >
            Back to Portfolio
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030014] px-[2%] sm:px-0 relative overflow-hidden">
      {/* Enhanced Background Animations */}
      <div className="fixed inset-0">
        <div className="absolute -inset-[10px] opacity-20">
          <div className="absolute top-0 -left-4 w-72 md:w-96 h-72 md:h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob" />
          <div className="absolute top-0 -right-4 w-72 md:w-96 h-72 md:h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000" />
          <div className="absolute -bottom-8 left-20 w-72 md:w-96 h-72 md:h-96 bg-fuchsia-500 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000" />
        </div>
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.02]" />
      </div>

      <div className="relative">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-16">
          {/* Enhanced Navigation */}
          <div className="flex items-center space-x-2 md:space-x-4 mb-8 md:mb-12 animate-fadeIn">
            <button
              onClick={() => navigate(-1)}
              className="group inline-flex items-center space-x-2 md:space-x-3 px-4 md:px-6 py-3 md:py-3 bg-white/5 backdrop-blur-xl rounded-2xl text-white/90 hover:bg-white/10 transition-all duration-300 border border-white/10 hover:border-white/20 hover:scale-105 text-base md:text-lg font-medium"
            >
              <ArrowLeft className="w-5 h-5 md:w-6 md:h-6 group-hover:-translate-x-1 transition-transform" />
              <span>Back to Projects</span>
            </button>
            <div className="flex items-center space-x-2 md:space-x-3 text-base md:text-lg text-white/50">
              <span className="text-white/70">Portfolio</span>
              <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
              <span className="text-white/90 truncate font-medium">{project.Title}</span>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 md:gap-16">
            {/* Left Column - Project Info */}
            <div className="space-y-8 md:space-y-12 animate-slideInLeft">
              {/* Enhanced Title Section */}
              <div className="space-y-6">
                <h1 className="text-4xl md:text-7xl font-bold bg-gradient-to-r from-purple-200 via-pink-200 to-fuchsia-200 bg-clip-text text-transparent leading-tight">
                  {project.Title}
                </h1>
                <div className="flex items-center space-x-4">
                  <div className="relative h-2 w-24 md:w-32 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-pulse" />
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-ping" />
                </div>
              </div>

              {/* Enhanced Description */}
              <div className="prose prose-invert max-w-none">
                <p className="text-lg md:text-xl text-gray-300/90 leading-relaxed font-light tracking-wide">
                  {project.Description}
                </p>
              </div>

              {/* Enhanced Action Buttons */}
              <div className="flex flex-wrap gap-4 md:gap-6">
                <button
                  onClick={() => window.open(project.Img, '_blank')}
                  className="group relative inline-flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-purple-600/20 to-pink-600/20 hover:from-purple-600/40 hover:to-pink-600/30 text-purple-300 rounded-2xl transition-all duration-300 border border-purple-500/30 hover:border-purple-400/50 backdrop-blur-xl overflow-hidden text-base md:text-lg font-medium"
                >
                  <div className="absolute inset-0 translate-y-[100%] bg-gradient-to-r from-purple-600/10 to-pink-600/10 transition-transform duration-300 group-hover:translate-y-[0%]" />
                  <Image className="relative w-5 h-5 md:w-6 md:h-6 group-hover:scale-110 transition-transform" />
                  <span className="relative">View Full Image</span>
                </button>

                <button
                  onClick={() => navigate('/')}
                  className="group relative inline-flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-fuchsia-600/20 to-rose-600/20 hover:from-fuchsia-600/40 hover:to-rose-600/30 text-fuchsia-300 rounded-2xl transition-all duration-300 border border-fuchsia-500/30 hover:border-fuchsia-400/50 backdrop-blur-xl overflow-hidden text-base md:text-lg font-medium"
                >
                  <div className="absolute inset-0 translate-y-[100%] bg-gradient-to-r from-fuchsia-600/10 to-rose-600/10 transition-transform duration-300 group-hover:translate-y-[0%]" />
                  <Palette className="relative w-5 h-5 md:w-6 md:h-6 group-hover:scale-110 transition-transform" />
                  <span className="relative">More Projects</span>
                </button>
              </div>

              {/* Design Process Section */}
              <div className="bg-white/[0.03] backdrop-blur-xl rounded-3xl p-8 border border-white/10 space-y-6 hover:border-white/20 transition-all duration-500 group">
                <h3 className="text-2xl font-semibold text-white/90 flex items-center gap-4">
                  <Brush className="w-6 h-6 text-purple-400 group-hover:rotate-12 transition-transform duration-300" />
                  Design Process
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4 p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-all duration-300 group/item">
                    <div className="w-3 h-3 bg-purple-400 rounded-full group-hover/item:scale-150 transition-transform duration-300" />
                    <span className="text-gray-300 group-hover/item:text-white transition-colors">Research & Analysis</span>
                  </div>
                  <div className="flex items-center space-x-4 p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-all duration-300 group/item">
                    <div className="w-3 h-3 bg-pink-400 rounded-full group-hover/item:scale-150 transition-transform duration-300" />
                    <span className="text-gray-300 group-hover/item:text-white transition-colors">Concept Development</span>
                  </div>
                  <div className="flex items-center space-x-4 p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-all duration-300 group/item">
                    <div className="w-3 h-3 bg-fuchsia-400 rounded-full group-hover/item:scale-150 transition-transform duration-300" />
                    <span className="text-gray-300 group-hover/item:text-white transition-colors">Final Execution</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Visual Content */}
            <div className="space-y-8 md:space-y-12 animate-slideInRight">
              {/* Enhanced Image Display */}
              <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl group">
                <div className="absolute inset-0 bg-gradient-to-t from-[#030014] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />
                <img
                  src={project.Img}
                  alt={project.Title}
                  className="w-full h-96 md:h-[500px] object-contain transform transition-transform duration-700 will-change-transform group-hover:scale-105 bg-gray-900/30"
                  onLoad={() => setIsImageLoaded(true)}
                  onError={(e) => {
                    e.target.src = "/fallback-poster.jpg";
                  }}
                />
                <div className="absolute inset-0 border-2 border-white/0 group-hover:border-white/20 transition-all duration-500 rounded-3xl" />
                
                {/* Loading Overlay */}
                {!isImageLoaded && (
                  <div className="absolute inset-0 bg-gray-900/50 flex items-center justify-center rounded-3xl">
                    <div className="text-center space-y-4">
                      <div className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto" />
                      <p className="text-gray-400 text-sm">Loading image...</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Project Impact Section */}
              <div className="bg-white/[0.03] backdrop-blur-xl rounded-3xl p-8 border border-white/10 space-y-6 hover:border-white/20 transition-all duration-500 group">
                <h3 className="text-2xl font-semibold text-white/90 flex items-center gap-4">
                  <Star className="w-6 h-6 text-yellow-400 group-hover:rotate-[20deg] transition-transform duration-300" />
                  Project Impact
                </h3>
                <div className="space-y-4">
                  <p className="text-gray-300 leading-relaxed">
                    This design showcases innovative approaches to visual communication, combining modern aesthetics with functional design principles to create engaging user experiences.
                  </p>
                  <div className="grid grid-cols-2 gap-4 pt-4">
                    <div className="text-center p-4 rounded-2xl bg-purple-600/10 border border-purple-500/20">
                      <div className="text-2xl font-bold text-purple-300">100%</div>
                      <div className="text-xs text-gray-400">Creative</div>
                    </div>
                    <div className="text-center p-4 rounded-2xl bg-pink-600/10 border border-pink-500/20">
                      <div className="text-2xl font-bold text-pink-300">100%</div>
                      <div className="text-xs text-gray-400">Innovative</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

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
        .animate-blob {
          animation: blob 10s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
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

export default ProjectDetails;