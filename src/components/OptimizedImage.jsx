import React, { useState, useCallback, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

const OptimizedImage = ({ 
  src, 
  alt, 
  width, 
  height, 
  className = '',
  fallback = "/placeholder.jpg",
  placeholder = null,
  priority = false,
  objectFit = 'cover',
  quality = 85,
  blurDataURL = null,
  onLoad: externalOnLoad,
  onError: externalOnError,
  sizes, // For responsive images
  srcSet, // For responsive images
  ...props 
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const [imageDimensions, setImageDimensions] = useState({ naturalWidth: 0, naturalHeight: 0 });
  
  const imgRef = useRef(null);
  const observerRef = useRef(null);

  // Intersection Observer for lazy loading with better configuration
  useEffect(() => {
    if (priority || !window.IntersectionObserver) {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { 
        rootMargin: '100px', // Increased for better perceived performance
        threshold: 0.01 // Lower threshold for earlier loading
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    observerRef.current = observer;

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [priority]);

  const handleLoad = useCallback((e) => {
    const img = e.target;
    setImageDimensions({
      naturalWidth: img.naturalWidth,
      naturalHeight: img.naturalHeight
    });
    setIsLoading(false);
    externalOnLoad?.(e);
  }, [externalOnLoad]);

  const handleError = useCallback((e) => {
    setIsLoading(false);
    setHasError(true);
    externalOnError?.(e);
    
    // Retry logic for transient errors
    if (src && src !== fallback) {
      console.warn(`Image failed to load: ${src}. Using fallback.`);
    }
  }, [externalOnError, src, fallback]);

  // Enhanced CDN optimization with multiple providers
  const getOptimizedSrc = (imageSrc) => {
    if (!imageSrc || hasError) return fallback;
    
    // Skip optimization for data URLs and fallbacks
    if (imageSrc.startsWith('data:') || imageSrc === fallback) {
      return imageSrc;
    }
    
    // Example: Cloudinary optimization
    if (imageSrc.includes('cloudinary.com')) {
      const transformations = [
        'f_auto', // Automatic format
        'q_auto', // Automatic quality
        'c_limit' // Constrain proportions
      ];
      
      if (width) transformations.push(`w_${width}`);
      if (height) transformations.push(`h_${height}`);
      
      const baseUrl = imageSrc.split('/upload/')[0];
      const imagePath = imageSrc.split('/upload/')[1];
      
      return `${baseUrl}/upload/${transformations.join(',')}/${imagePath}`;
    }
    
    // Example: Imgix optimization
    if (imageSrc.includes('imgix.net')) {
      const params = new URLSearchParams({
        auto: 'format,compress',
        fit: objectFit,
        q: quality.toString(),
      });
      
      if (width) params.set('w', width.toString());
      if (height) params.set('h', height.toString());
      
      return `${imageSrc}?${params.toString()}`;
    }
    
    // Generic URL parameters for custom CDNs
    if (imageSrc.startsWith('http') && !imageSrc.includes('?')) {
      const params = new URLSearchParams({
        width: width?.toString() || '',
        height: height?.toString() || '',
        quality: quality.toString(),
        fit: objectFit,
      });
      
      // Only add params if we have meaningful values
      const paramString = params.toString();
      return paramString ? `${imageSrc}?${paramString}` : imageSrc;
    }
    
    return imageSrc;
  };

  const imageSrc = getOptimizedSrc(hasError ? fallback : src);
  const shouldShowPlaceholder = isLoading && placeholder;
  const shouldShowSkeleton = isLoading && !placeholder;
  const hasValidDimensions = width && height;

  // Calculate aspect ratio padding
  const aspectRatioStyle = hasValidDimensions 
    ? { paddingBottom: `${(height / width) * 100}%` }
    : {};

  return (
    <div 
      ref={imgRef}
      className={`relative overflow-hidden ${className}`}
      style={{ 
        width: width || '100%', 
        height: height || 'auto',
        ...(hasValidDimensions && { aspectRatio: `${width} / ${height}` })
      }}
    >
      {/* Aspect Ratio Spacer */}
      {hasValidDimensions && (
        <div 
          className="relative h-0"
          style={aspectRatioStyle}
          aria-hidden="true"
        />
      )}

      {/* Skeleton Loading */}
      {shouldShowSkeleton && (
        <div 
          className={`absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 animate-pulse flex items-center justify-center z-10 ${
            hasValidDimensions ? '' : 'h-full'
          }`}
          aria-hidden="true"
        >
          <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* Blurred Placeholder */}
      {shouldShowPlaceholder && (
        <img
          src={placeholder}
          alt=""
          className={`absolute inset-0 w-full h-full filter blur-md scale-110 z-10 ${
            hasValidDimensions ? 'object-cover' : ''
          }`}
          aria-hidden="true"
        />
      )}

      {/* Blur Data URL Placeholder */}
      {blurDataURL && isLoading && (
        <img
          src={blurDataURL}
          alt=""
          className={`absolute inset-0 w-full h-full filter blur-sm scale-105 z-10 ${
            hasValidDimensions ? 'object-cover' : ''
          }`}
          aria-hidden="true"
        />
      )}

      {/* Main Image Container */}
      <div className={`relative ${hasValidDimensions ? 'absolute inset-0' : ''}`}>
        {/* Main Image */}
        {isInView && (
          <img
            src={imageSrc}
            alt={alt}
            width={width}
            height={height}
            sizes={sizes}
            srcSet={srcSet}
            loading={priority ? "eager" : "lazy"}
            decoding="async"
            onLoad={handleLoad}
            onError={handleError}
            className={`w-full h-full transition-all duration-700 ${
              objectFit === 'cover' ? 'object-cover' :
              objectFit === 'contain' ? 'object-contain' :
              objectFit === 'fill' ? 'object-fill' :
              objectFit === 'none' ? 'object-none' :
              'object-scale-down'
            } ${
              isLoading ? 'opacity-0 scale-105' : 'opacity-100 scale-100'
            } ${hasError ? 'filter grayscale' : ''}`}
            style={{
              objectFit: objectFit
            }}
            {...props}
          />
        )}

        {/* Loading state for non-priority images */}
        {!isInView && !priority && (
          <div 
            className={`absolute inset-0 bg-gray-800 flex items-center justify-center ${
              hasValidDimensions ? '' : 'h-full'
            }`}
            aria-hidden="true"
          >
            <div className="text-gray-500 text-sm">
              <div className="w-6 h-6 border-2 border-gray-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              Loading...
            </div>
          </div>
        )}
      </div>

      {/* SEO and Accessibility - Only render when image is loaded */}
      {!isLoading && !hasError && (
        <>
          <meta itemProp="image" content={imageSrc} />
          {width && <meta itemProp="width" content={width.toString()} />}
          {height && <meta itemProp="height" content={height.toString()} />}
          {imageDimensions.naturalWidth && (
            <meta itemProp="naturalWidth" content={imageDimensions.naturalWidth.toString()} />
          )}
          {imageDimensions.naturalHeight && (
            <meta itemProp="naturalHeight" content={imageDimensions.naturalHeight.toString()} />
          )}
        </>
      )}

      {/* Screen reader status */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {isLoading ? `Loading image: ${alt}` : hasError ? `Failed to load image: ${alt}` : `Image loaded: ${alt}`}
      </div>
    </div>
  );
};

// Enhanced Prop Types
OptimizedImage.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  className: PropTypes.string,
  fallback: PropTypes.string,
  placeholder: PropTypes.string,
  priority: PropTypes.bool,
  objectFit: PropTypes.oneOf(['cover', 'contain', 'fill', 'none', 'scale-down']),
  quality: PropTypes.number,
  blurDataURL: PropTypes.string,
  sizes: PropTypes.string,
  srcSet: PropTypes.string,
  onLoad: PropTypes.func,
  onError: PropTypes.func,
};

// Default Props
OptimizedImage.defaultProps = {
  className: '',
  fallback: "/placeholder.jpg",
  priority: false,
  objectFit: 'cover',
  quality: 85,
  alt: 'Image',
};

export default React.memo(OptimizedImage);