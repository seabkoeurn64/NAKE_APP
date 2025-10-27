import React, { memo, useState, useCallback, useRef, useEffect, useImperativeHandle } from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import PropTypes from 'prop-types';

// Custom hook for animation controls
const useLottieControls = (animationRef) => {
  const play = useCallback(() => {
    animationRef.current?.play();
  }, [animationRef]);

  const pause = useCallback(() => {
    animationRef.current?.pause();
  }, [animationRef]);

  const stop = useCallback(() => {
    animationRef.current?.stop();
  }, [animationRef]);

  const setSpeed = useCallback((speed) => {
    if (animationRef.current) {
      animationRef.current.setSpeed(speed);
    }
  }, [animationRef]);

  const goToAndPlay = useCallback((value, isFrame = false) => {
    if (animationRef.current) {
      animationRef.current.goToAndPlay(value, isFrame);
    }
  }, [animationRef]);

  const setDirection = useCallback((direction) => {
    if (animationRef.current) {
      animationRef.current.setDirection(direction);
    }
  }, [animationRef]);

  const getDuration = useCallback((inFrames = false) => {
    return animationRef.current?.getDuration(inFrames);
  }, [animationRef]);

  const getCurrentFrame = useCallback(() => {
    return animationRef.current?.currentFrame;
  }, [animationRef]);

  const setSegment = useCallback((start, end) => {
    if (animationRef.current) {
      animationRef.current.setSegment(start, end);
    }
  }, [animationRef]);

  return {
    play,
    pause,
    stop,
    setSpeed,
    goToAndPlay,
    setDirection,
    getDuration,
    getCurrentFrame,
    setSegment
  };
};

const LottieAnimation = memo(React.forwardRef(({
  src = "https://assets-v2.lottiefiles.com/a/a48f1c1e-1181-11ee-8323-1fd18ac98420/CefN62GDJc.lottie",
  autoplay = true,
  loop = true,
  speed = 1,
  className = "",
  fallback = "🎨",
  fallbackText = "Design Animation",
  interactive = false,
  loadPriority = false,
  onLoad,
  onError,
  onLoopComplete,
  onComplete,
  onFrame,
  ...props
}, ref) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(null);
  const [isInView, setIsInView] = useState(loadPriority || autoplay);
  const [isPlaying, setIsPlaying] = useState(autoplay);
  const [progress, setProgress] = useState(0);
  const [announcement, setAnnouncement] = useState('');
  const [cached, setCached] = useState(false);

  const animationRef = useRef(null);
  const containerRef = useRef(null);

  const controls = useLottieControls(animationRef);

  // Expose controls via ref
  useImperativeHandle(ref, () => ({
    ...controls,
    animation: animationRef.current,
    isPlaying: () => isPlaying,
    isLoaded: () => loaded
  }), [controls, isPlaying, loaded]);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (loadPriority || autoplay) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { 
        rootMargin: '100px',
        threshold: 0.1 
      }
    );

    const currentContainer = containerRef.current;
    if (currentContainer) {
      observer.observe(currentContainer);
    }

    return () => {
      if (currentContainer) {
        observer.unobserve(currentContainer);
      }
      observer.disconnect();
    };
  }, [autoplay, loadPriority]);

  // Screen reader announcements
  useEffect(() => {
    if (interactive && loaded) {
      setAnnouncement(`${isPlaying ? 'Playing' : 'Paused'} ${fallbackText}`);
    }
  }, [isPlaying, interactive, loaded, fallbackText]);

  const handleLoad = useCallback((event) => {
    setLoaded(true);
    setIsPlaying(autoplay);
    setCached(true);
    onLoad?.(event);
  }, [onLoad, autoplay]);

  const handleError = useCallback((error) => {
    console.error('Lottie animation failed to load:', error);
    const errorState = {
      message: error?.message || 'Unknown error occurred',
      type: 'load',
      timestamp: Date.now()
    };
    setError(errorState);
    setIsPlaying(false);
    onError?.(error);
  }, [onError]);

  const handleLoopComplete = useCallback((event) => {
    onLoopComplete?.(event);
  }, [onLoopComplete]);

  const handleComplete = useCallback((event) => {
    setIsPlaying(false);
    onComplete?.(event);
  }, [onComplete]);

  const handleFrame = useCallback((event) => {
    if (animationRef.current) {
      const currentFrame = event.currentFrame;
      const totalFrames = event.totalFrames;
      setProgress((currentFrame / totalFrames) * 100);
    }
    onFrame?.(event);
  }, [onFrame]);

  const handlePlay = useCallback(() => {
    controls.play();
    setIsPlaying(true);
  }, [controls]);

  const handlePause = useCallback(() => {
    controls.pause();
    setIsPlaying(false);
  }, [controls]);

  const handleStop = useCallback(() => {
    controls.stop();
    setIsPlaying(false);
    setProgress(0);
  }, [controls]);

  // Interactive handlers
  const handleMouseEnter = useCallback(() => {
    if (interactive && animationRef.current && !isPlaying) {
      handlePlay();
    }
  }, [interactive, isPlaying, handlePlay]);

  const handleMouseLeave = useCallback(() => {
    if (interactive && animationRef.current && isPlaying) {
      handlePause();
    }
  }, [interactive, isPlaying, handlePause]);

  const handleClick = useCallback((e) => {
    if (interactive && animationRef.current) {
      e.stopPropagation();
      if (isPlaying) {
        handlePause();
      } else {
        handlePlay();
      }
    }
  }, [interactive, isPlaying, handlePlay, handlePause]);

  // Keyboard accessibility
  const handleKeyDown = useCallback((e) => {
    if (interactive && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      handleClick(e);
    }
  }, [interactive, handleClick]);

  // Progress bar for interactive mode
  const handleProgressClick = useCallback((e) => {
    if (interactive && animationRef.current) {
      e.stopPropagation();
      const rect = e.currentTarget.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const percentage = clickX / rect.width;
      const duration = controls.getDuration(true) || 1;
      const targetFrame = Math.floor(percentage * duration);
      
      controls.goToAndPlay(targetFrame, true);
    }
  }, [interactive, controls]);

  if (error) {
    return (
      <div 
        className={`flex items-center justify-center w-full h-full bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-lg ${className}`}
        role="img"
        aria-label={fallbackText}
      >
        <div className="text-center text-gray-400">
          <span className="text-2xl md:text-3xl">{fallback}</span>
          <p className="text-sm mt-2 opacity-75">{fallbackText}</p>
          <p className="text-xs mt-1 text-red-400">Failed to load animation</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className={`relative w-full h-full ${className} ${
        interactive ? 'cursor-pointer transition-transform duration-300' : ''
      }`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role={interactive ? 'button' : 'img'}
      aria-label={interactive ? `${isPlaying ? 'Pause' : 'Play'} ${fallbackText}` : fallbackText}
      tabIndex={interactive ? 0 : undefined}
      style={{
        transform: interactive && isPlaying ? 'scale(1.05)' : 'scale(1)'
      }}
    >
      {/* Screen reader announcements */}
      <div 
        aria-live="polite" 
        aria-atomic="true" 
        className="sr-only"
      >
        {announcement}
      </div>

      {/* Loading Skeleton */}
      {!loaded && (
        <div 
          className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg flex items-center justify-center z-10"
          aria-hidden="true"
          style={{ animation: 'pulse 2s ease-in-out infinite' }}
        >
          <div className="flex flex-col items-center space-y-2">
            <div 
              className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full"
              style={{ animation: 'spin 1s linear infinite' }}
            />
            <span className="text-xs text-gray-400">Loading animation...</span>
          </div>
        </div>
      )}

      {/* Lottie Animation */}
      {isInView && (
        <DotLottieReact
          ref={animationRef}
          src={src}
          autoplay={autoplay}
          loop={loop}
          speed={speed}
          onLoad={handleLoad}
          onError={handleError}
          onLoopComplete={handleLoopComplete}
          onComplete={handleComplete}
          onFrame={handleFrame}
          className="w-full h-full"
          {...props}
        />
      )}

      {/* Loading fallback for slow connections */}
      {!isInView && !autoplay && (
        <div className="w-full h-full bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-lg flex items-center justify-center">
          <div className="text-center text-gray-500">
            <span className="text-xl">⏳</span>
            <p className="text-xs mt-1">Loading...</p>
          </div>
        </div>
      )}

      {/* Progress Bar for Interactive Mode */}
      {interactive && loaded && (
        <div 
          className="absolute bottom-2 left-2 right-2 h-1 bg-gray-700/50 rounded-full overflow-hidden cursor-pointer"
          onClick={handleProgressClick}
          role="slider"
          aria-label="Animation progress"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div 
            className="h-full bg-purple-500 transition-all duration-100"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {/* Interactive overlay */}
      {interactive && loaded && (
        <div 
          className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-lg pointer-events-none"
          style={{ 
            opacity: 0,
            transition: 'opacity 300ms ease-in-out'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.opacity = '1';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = '0';
          }}
        >
          <div className="bg-black/50 rounded-full p-2 backdrop-blur-sm">
            <span className="text-white text-xs">
              {isPlaying ? 'Click to pause' : 'Click to play'}
            </span>
          </div>
        </div>
      )}

      {/* Play/Pause indicator for interactive mode */}
      {interactive && loaded && (
        <div className="absolute top-2 right-2 bg-black/50 rounded-full p-1 backdrop-blur-sm">
          <div 
            className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-green-400' : 'bg-yellow-400'}`}
            aria-label={isPlaying ? 'Playing' : 'Paused'}
          />
        </div>
      )}

      {/* Cache indicator */}
      {cached && (
        <div className="absolute top-2 left-2 bg-black/50 rounded-full p-1 backdrop-blur-sm">
          <div className="w-2 h-2 bg-blue-400 rounded-full" aria-label="Cached" />
        </div>
      )}

      {/* ✅ FIXED: Add CSS animations via style tag */}
      <style>
        {`
          @keyframes pulse {
            0%, 100% {
              opacity: 1;
            }
            50% {
              opacity: 0.7;
            }
          }
          @keyframes spin {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
          }
        `}
      </style>
    </div>
  );
}));

// PropTypes
LottieAnimation.propTypes = {
  src: PropTypes.string,
  autoplay: PropTypes.bool,
  loop: PropTypes.bool,
  speed: PropTypes.number,
  className: PropTypes.string,
  fallback: PropTypes.string,
  fallbackText: PropTypes.string,
  interactive: PropTypes.bool,
  loadPriority: PropTypes.bool,
  onLoad: PropTypes.func,
  onError: PropTypes.func,
  onLoopComplete: PropTypes.func,
  onComplete: PropTypes.func,
  onFrame: PropTypes.func,
};

LottieAnimation.displayName = 'LottieAnimation';

export default LottieAnimation;