// components/PortfolioComponents.jsx
import React, { memo } from 'react';
import { RefreshCw, ChevronDown, ChevronUp, AlertCircle, Loader2 } from 'lucide-react';

// Professional Error Boundary
export class PortfolioErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false,
      error: null 
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Portfolio Error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
          <div className="text-center p-8 max-w-md bg-slate-800/50 backdrop-blur-sm rounded-3xl border border-slate-700/50 shadow-2xl">
            <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-500/30">
              <AlertCircle className="w-10 h-10 text-red-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">Something went wrong</h3>
            <p className="text-slate-300 mb-2">We encountered an unexpected error.</p>
            <p className="text-slate-400 text-sm mb-6">Don't worry, it's not your fault.</p>
            <div className="flex gap-3 justify-center">
              <button 
                onClick={this.handleReset}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all duration-300 hover:scale-105 active:scale-95 font-medium"
              >
                Reload Page
              </button>
              <button 
                onClick={() => window.history.back()}
                className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl transition-all duration-300 hover:scale-105 active:scale-95 font-medium"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Professional Toggle Button
export const ToggleButton = memo(({ 
  onClick, 
  isShowingMore, 
  loading = false,
  disabled = false 
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-2xl font-semibold transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/25 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900"
    >
      <div className="flex items-center justify-center gap-3">
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Loading...</span>
          </>
        ) : (
          <>
            <span>{isShowingMore ? 'Show Less' : 'Show More Projects'}</span>
            {isShowingMore ? (
              <ChevronUp className="w-5 h-5 transition-transform duration-300 group-hover:-translate-y-1" />
            ) : (
              <ChevronDown className="w-5 h-5 transition-transform duration-300 group-hover:translate-y-1" />
            )}
          </>
        )}
      </div>
    </button>
  );
});

ToggleButton.displayName = 'ToggleButton';

// Professional Loading Spinner
export const LoadingSpinner = memo(({ 
  size = "medium", 
  text = "Loading projects..." 
}) => {
  const sizes = {
    small: "w-6 h-6",
    medium: "w-12 h-12", 
    large: "w-16 h-16"
  };

  return (
    <div className="flex flex-col items-center justify-center p-12">
      <div className={`${sizes[size]} border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4`}></div>
      {text && (
        <p className="text-slate-400 text-lg font-medium animate-pulse">
          {text}
        </p>
      )}
    </div>
  );
});

LoadingSpinner.displayName = 'LoadingSpinner';

export default {
  PortfolioErrorBoundary,
  ToggleButton,
  LoadingSpinner
};