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
    <div className="min-h-screen bg-gradient-to-br from-[#030014] via-purple-900/20 to-[#030014] flex items-center justify-center px-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="text-center relative z-10">
        {/* 404 Number with Gradient */}
        <div className="mb-8">
          <h1 className="text-9xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent mb-4 animate-float">
            404
          </h1>
          <div className="w-32 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto rounded-full shadow-lg"></div>
        </div>

        {/* Message */}
        <div className="mb-12">
          <h2 className="text-4xl font-bold text-white mb-6">
            Oops! Page Not Found
          </h2>
          <p className="text-xl text-gray-300 max-w-md mx-auto leading-relaxed font-light">
            The page you're looking for might have been moved, deleted, or never existed.
          </p>
        </div>

        {/* Animated Illustration */}
        <div className="mb-12">
          <div className="w-40 h-40 mx-auto bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-3xl flex items-center justify-center mb-6 border border-white/10 backdrop-blur-sm shadow-2xl animate-pulse">
            <div className="text-6xl">🎨</div>
          </div>
        </div>

        {/* Enhanced Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          <button
            onClick={handleGoBack}
            className="group flex items-center gap-3 px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-2xl hover:bg-white/20 transition-all duration-300 border border-white/20 hover:border-white/40 hover:scale-105 shadow-lg hover:shadow-purple-500/25"
          >
            <ArrowLeft size={22} className="group-hover:-translate-x-1 transition-transform" />
            <span className="font-semibold text-lg">Go Back</span>
          </button>
          
          <button
            onClick={handleGoHome}
            className="group flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-purple-500/30"
          >
            <Palette size={22} className="group-hover:scale-110 transition-transform" />
            <span className="font-semibold text-lg">Back to Portfolio</span>
          </button>
        </div>

        {/* Decorative Elements */}
        <div className="mt-16 flex justify-center space-x-4">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-pulse"
              style={{ animationDelay: `${i * 0.3}s` }}
            ></div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}