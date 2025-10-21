import React from 'react';
import { Home, ArrowLeft, Search, Palette } from 'lucide-react';

export default function NotFoundPage() {
  const handleGoBack = () => {
    window.history.back();
  };

  const handleGoHome = () => {
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#030014] via-purple-900/20 to-[#030014] flex items-center justify-center px-4 sm:px-6 relative overflow-hidden">
      {/* Optimized Background Elements - Reduced for mobile */}
      <div className="absolute inset-0">
        <div className="absolute -top-20 -right-20 sm:-top-40 sm:-right-40 w-40 h-40 sm:w-80 sm:h-80 bg-purple-500/5 sm:bg-purple-500/10 rounded-full blur-xl sm:blur-3xl"></div>
        <div className="absolute -bottom-20 -left-20 sm:-bottom-40 sm:-left-40 w-40 h-40 sm:w-80 sm:h-80 bg-blue-500/5 sm:bg-blue-500/10 rounded-full blur-xl sm:blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 sm:w-96 sm:h-96 bg-pink-500/3 sm:bg-pink-500/5 rounded-full blur-xl sm:blur-3xl"></div>
      </div>

      <div className="text-center relative z-10 w-full max-w-md sm:max-w-lg">
        {/* 404 Number with Gradient - Mobile Optimized */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-7xl sm:text-8xl md:text-9xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent mb-3 sm:mb-4 animate-float">
            404
          </h1>
          <div className="w-24 h-0.5 sm:w-32 sm:h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto rounded-full shadow-lg"></div>
        </div>

        {/* Message - Mobile Optimized */}
        <div className="mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 sm:mb-6">
            Oops! Page Not Found
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-sm sm:max-w-md mx-auto leading-relaxed font-light">
            The page you're looking for might have been moved, deleted, or never existed.
          </p>
        </div>

        {/* Animated Illustration - Mobile Optimized */}
        <div className="mb-8 sm:mb-12">
          <div className="w-32 h-32 sm:w-40 sm:h-40 mx-auto bg-gradient-to-br from-purple-500/15 to-pink-500/15 sm:from-purple-500/20 sm:to-pink-500/20 rounded-2xl sm:rounded-3xl flex items-center justify-center mb-4 sm:mb-6 border border-white/10 backdrop-blur-sm shadow-xl sm:shadow-2xl animate-pulse">
            <div className="text-4xl sm:text-6xl">🎨</div>
          </div>
        </div>

        {/* Enhanced Action Buttons - Mobile Optimized */}
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center">
          <button
            onClick={handleGoBack}
            className="group flex items-center justify-center gap-2 sm:gap-3 w-full sm:w-auto px-6 py-3 sm:px-8 sm:py-4 bg-white/10 backdrop-blur-sm text-white rounded-xl sm:rounded-2xl hover:bg-white/20 transition-all duration-300 border border-white/20 hover:border-white/40 active:scale-95 sm:hover:scale-105 shadow-lg hover:shadow-purple-500/25 mobile-touch"
          >
            <ArrowLeft size={18} className="sm:w-5 sm:h-5 group-hover:-translate-x-0.5 sm:group-hover:-translate-x-1 transition-transform" />
            <span className="font-semibold text-sm sm:text-base">Go Back</span>
          </button>
          
          <button
            onClick={handleGoHome}
            className="group flex items-center justify-center gap-2 sm:gap-3 w-full sm:w-auto px-6 py-3 sm:px-8 sm:py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl sm:rounded-2xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 active:scale-95 sm:hover:scale-105 shadow-lg hover:shadow-purple-500/30 mobile-touch"
          >
            <Palette size={18} className="sm:w-5 sm:h-5 group-hover:scale-105 sm:group-hover:scale-110 transition-transform" />
            <span className="font-semibold text-sm sm:text-base">Back to Portfolio</span>
          </button>
        </div>

        {/* Decorative Elements */}
        <div className="mt-12 sm:mt-16 flex justify-center space-x-2 sm:space-x-4">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-pulse"
              style={{ animationDelay: `${i * 0.3}s` }}
            ></div>
          ))}
        </div>
      </div>

      {/* Performance optimized animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
        
        /* Reduced motion support */
        @media (prefers-reduced-motion: reduce) {
          .animate-float {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}