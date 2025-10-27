// src/components/PortfolioComponents.jsx - COMPLETE FIXED VERSION
import React, { memo, useCallback } from 'react';
import { ChevronDown, ChevronUp, AlertCircle, Loader2 } from 'lucide-react';

// ✅ Enhanced Error Boundary
class PortfolioErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false,
      error: null,
      retryCount: 0
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Portfolio Error:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleRetry = () => {
    if (this.state.retryCount < 3) {
      this.setState({ 
        hasError: false, 
        error: null,
        retryCount: this.state.retryCount + 1 
      });
    } else {
      this.handleReload();
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
          <div className="text-center p-6 md:p-8 max-w-md w-full bg-slate-800/70 backdrop-blur-xl rounded-3xl border border-slate-700/50 shadow-2xl mx-4">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6 border border-red-500/30">
              <AlertCircle className="w-8 h-8 md:w-10 md:h-10 text-red-400" />
            </div>
            
            <h3 className="text-xl md:text-2xl font-bold text-white mb-3">Something went wrong</h3>
            <p className="text-slate-300 mb-2 text-sm md:text-base">
              We encountered an unexpected error.
            </p>
            <p className="text-slate-400 text-xs md:text-sm mb-6">
              {this.state.retryCount > 0 ? `Retry attempt ${this.state.retryCount}/3` : "Don't worry, it's not your fault."}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button 
                onClick={this.handleReload}
                className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all duration-300 hover:scale-105 active:scale-95 font-medium text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-800"
              >
                Reload Page
              </button>
              <button 
                onClick={this.handleRetry}
                className="flex-1 px-4 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl transition-all duration-300 hover:scale-105 active:scale-95 font-medium text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 focus:ring-offset-slate-800"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// ✅ Optimized Toggle Button
const ToggleButton = memo(({ 
  onClick, 
  isShowingMore, 
  loading = false,
  disabled = false,
  className = "",
  size = "medium"
}) => {
  const sizes = {
    small: "px-4 py-2 text-sm",
    medium: "px-6 py-3 md:px-8 md:py-4 text-sm md:text-base",
    large: "px-8 py-4 md:px-10 md:py-5 text-base md:text-lg"
  };

  const handleClick = useCallback((e) => {
    if (!disabled && !loading) {
      onClick(e);
    }
  }, [onClick, disabled, loading]);

  return (
    <button
      onClick={handleClick}
      disabled={disabled || loading}
      className={`group relative ${sizes[size]} bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-2xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-blue-500/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900 ${className}`}
      aria-label={isShowingMore ? 'Show less projects' : 'Show more projects'}
    >
      <div className="flex items-center justify-center gap-2 md:gap-3">
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 md:w-5 md:h-5 animate-spin" />
            <span>Loading...</span>
          </>
        ) : (
          <>
            <span>
              {isShowingMore ? 'Show Less' : 'Show More'}
            </span>
            {isShowingMore ? (
              <ChevronUp className="w-4 h-4 md:w-5 md:h-5 transition-transform duration-300 group-hover:-translate-y-0.5" />
            ) : (
              <ChevronDown className="w-4 h-4 md:w-5 md:h-5 transition-transform duration-300 group-hover:translate-y-0.5" />
            )}
          </>
        )}
      </div>
    </button>
  );
});

ToggleButton.displayName = 'ToggleButton';

// ✅ Enhanced Loading Spinner with Variants
const LoadingSpinner = memo(({ 
  size = "medium", 
  text = "Loading projects...",
  className = "",
  variant = "default" // 'default' | 'inline' | 'fullscreen'
}) => {
  const sizes = {
    small: {
      spinner: "w-6 h-6 border-2",
      text: "text-sm"
    },
    medium: {
      spinner: "w-10 h-10 md:w-12 md:h-12 border-3",
      text: "text-base md:text-lg"
    }, 
    large: {
      spinner: "w-14 h-14 md:w-16 md:h-16 border-4",
      text: "text-lg md:text-xl"
    }
  };

  const currentSize = sizes[size];
  const isFullscreen = variant === 'fullscreen';

  const content = (
    <div className={`flex flex-col items-center justify-center ${isFullscreen ? 'min-h-screen' : 'p-6 md:p-8'} ${className}`}>
      <div 
        className={`${currentSize.spinner} border-blue-500 border-t-transparent rounded-full animate-spin mb-3 md:mb-4`}
        role="status"
        aria-label="Loading"
      />
      {text && (
        <p className={`text-slate-400 ${currentSize.text} font-medium text-center`}>
          {text}
        </p>
      )}
    </div>
  );

  if (isFullscreen) {
    return (
      <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center">
        {content}
      </div>
    );
  }

  return content;
});

LoadingSpinner.displayName = 'LoadingSpinner';

// ✅ Enhanced Card Skeleton with Variants
const CardSkeleton = memo(({ 
  count = 6,
  className = "",
  variant = "default" // 'default' | 'compact'
}) => {
  const skeletons = Array.from({ length: count }, (_, index) => (
    <div
      key={index}
      className="group relative w-full bg-slate-800/40 backdrop-blur-sm rounded-2xl border border-slate-700/30 shadow-lg overflow-hidden animate-pulse"
      role="status"
      aria-label="Loading project"
    >
      <div className="aspect-[4/3] w-full bg-gradient-to-r from-slate-700/50 to-slate-600/50 rounded-t-2xl" />
      <div className={`p-4 md:p-6 space-y-3 md:space-y-4 ${variant === 'compact' ? 'p-4 space-y-2' : ''}`}>
        <div className="space-y-2 md:space-y-3">
          <div className="h-6 bg-slate-700/50 rounded-lg w-3/4" />
          <div className="space-y-2">
            <div className="h-4 bg-slate-700/50 rounded w-full" />
            <div className="h-4 bg-slate-700/50 rounded w-2/3" />
            {variant !== 'compact' && (
              <div className="h-4 bg-slate-700/50 rounded w-1/2" />
            )}
          </div>
        </div>
        {variant !== 'compact' && (
          <div className="flex gap-2 pt-2">
            <div className="h-6 bg-slate-700/50 rounded-full w-16" />
            <div className="h-6 bg-slate-700/50 rounded-full w-12" />
          </div>
        )}
      </div>
    </div>
  ));

  return (
    <div 
      className={`grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8 px-4 md:px-6 ${className}`}
      aria-busy="true"
    >
      {skeletons}
    </div>
  );
});

CardSkeleton.displayName = 'CardSkeleton';

// ✅ Enhanced Empty State with Variants
const EmptyState = memo(({ 
  title = "No projects found", 
  description = "Check your projects data source",
  icon = "📁",
  action = null,
  variant = "default", // 'default' | 'error' | 'loading'
  className = ""
}) => {
  const variants = {
    default: "text-slate-300",
    error: "text-red-300",
    loading: "text-blue-300"
  };

  const currentVariant = variants[variant] || variants.default;

  return (
    <div className={`col-span-full text-center py-16 md:py-20 px-4 ${className}`} role="status" aria-live="polite">
      <div className="text-5xl md:text-6xl mb-6 animate-bounce">{icon}</div>
      <h3 className={`text-xl md:text-2xl mb-3 font-semibold ${currentVariant}`}>
        {title}
      </h3>
      <p className="text-slate-400 text-base md:text-lg mb-8 max-w-md mx-auto leading-relaxed">
        {description}
      </p>
      {action && (
        <div className="flex justify-center">
          {action}
        </div>
      )}
    </div>
  );
});

EmptyState.displayName = 'EmptyState';

// ✅ Filter Button Component
const FilterButton = memo(({
  active = false,
  onClick,
  children,
  count,
  className = ""
}) => {
  return (
    <button
      onClick={onClick}
      className={`group relative px-4 py-2 rounded-xl font-medium transition-all duration-300 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900 ${
        active 
          ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25' 
          : 'bg-slate-700/50 text-slate-300 hover:bg-slate-600/50 hover:text-white'
      } ${className}`}
    >
      <div className="flex items-center gap-2">
        <span>{children}</span>
        {count !== undefined && (
          <span className={`px-1.5 py-0.5 text-xs rounded-full ${
            active ? 'bg-white/20 text-white' : 'bg-slate-600/50 text-slate-400'
          }`}>
            {count}
          </span>
        )}
      </div>
    </button>
  );
});

FilterButton.displayName = 'FilterButton';

// ✅ Search Input Component
const SearchInput = memo(({
  value,
  onChange,
  placeholder = "Search projects...",
  className = ""
}) => {
  return (
    <div className={`relative ${className}`}>
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600/50 rounded-2xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm transition-all duration-300"
      />
      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
    </div>
  );
});

SearchInput.displayName = 'SearchInput';

// ✅ CORRECTED EXPORTS - Clean and Simple
export {
  PortfolioErrorBoundary,
  ToggleButton,
  LoadingSpinner,
  CardSkeleton,
  EmptyState,
  FilterButton,
  SearchInput
};