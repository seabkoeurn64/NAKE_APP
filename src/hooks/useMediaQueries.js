// useMediaQueries.js - Custom React Hook for Responsive Media Queries
import { useState, useEffect, useMemo, useCallback } from 'react';

// Common breakpoints (Tailwind CSS standard)
const defaultBreakpoints = {
  xs: '(max-width: 479px)',
  sm: '(min-width: 480px) and (max-width: 767px)',
  md: '(min-width: 768px) and (max-width: 1023px)',
  lg: '(min-width: 1024px) and (max-width: 1279px)',
  xl: '(min-width: 1280px) and (max-width: 1535px)',
  '2xl': '(min-width: 1536px)',
  
  // Additional useful queries
  mobile: '(max-width: 767px)',
  tablet: '(min-width: 768px) and (max-width: 1023px)',
  desktop: '(min-width: 1024px)',
  
  // Orientation
  portrait: '(orientation: portrait)',
  landscape: '(orientation: landscape)',
  
  // Reduced motion
  reducedMotion: '(prefers-reduced-motion: reduce)',
  
  // Color scheme
  dark: '(prefers-color-scheme: dark)',
  light: '(prefers-color-scheme: light)',
  
  // High contrast
  highContrast: '(prefers-contrast: high)',
  
  // Hover capability
  hover: '(hover: hover)',
  noHover: '(hover: none)',
  
  // Pointer type
  finePointer: '(pointer: fine)',
  coarsePointer: '(pointer: coarse)',
};

// Utility functions
const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

const throttle = (func, limit) => {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// Main hook for single media query
const useMediaQuery = (query, options = {}) => {
  const {
    defaultValue = false,
    debounce: debounceMs = 100,
    throttle: throttleMs = 0,
    initializeWithValue = true,
  } = options;

  const [matches, setMatches] = useState(() => {
    if (initializeWithValue && typeof window !== 'undefined') {
      return window.matchMedia(query).matches;
    }
    return defaultValue;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia(query);
    
    const updateMatches = () => {
      setMatches(mediaQuery.matches);
    };

    // Create the handler with optional debouncing/throttling
    let handler = updateMatches;
    
    if (debounceMs > 0) {
      handler = debounce(updateMatches, debounceMs);
    } else if (throttleMs > 0) {
      handler = throttle(updateMatches, throttleMs);
    }

    // Initial check
    updateMatches();

    // Add event listener
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handler);
    } else {
      // Fallback for older browsers
      mediaQuery.addListener(handler);
    }

    // Cleanup
    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handler);
      } else {
        mediaQuery.removeListener(handler);
      }
    };
  }, [query, debounceMs, throttleMs]);

  return matches;
};

// Hook for multiple media queries
const useMediaQueries = (queries, options = {}) => {
  const {
    defaultValue = {},
    debounce: debounceMs = 100,
    throttle: throttleMs = 0,
    initializeWithValue = true,
  } = options;

  const [matches, setMatches] = useState(() => {
    if (initializeWithValue && typeof window !== 'undefined') {
      const initialMatches = {};
      Object.keys(queries).forEach(key => {
        initialMatches[key] = window.matchMedia(queries[key]).matches;
      });
      return initialMatches;
    }
    return defaultValue;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQueries = {};
    const handlers = {};

    const updateAllMatches = () => {
      const newMatches = {};
      Object.keys(queries).forEach(key => {
        newMatches[key] = mediaQueries[key].matches;
      });
      setMatches(newMatches);
    };

    // Create individual handlers
    Object.keys(queries).forEach(key => {
      mediaQueries[key] = window.matchMedia(queries[key]);
      
      let handler = () => {
        setMatches(prev => ({
          ...prev,
          [key]: mediaQueries[key].matches
        }));
      };

      // Apply debouncing/throttling
      if (debounceMs > 0) {
        handler = debounce(handler, debounceMs);
      } else if (throttleMs > 0) {
        handler = throttle(handler, throttleMs);
      }

      handlers[key] = handler;

      // Add event listeners
      if (mediaQueries[key].addEventListener) {
        mediaQueries[key].addEventListener('change', handlers[key]);
      } else {
        mediaQueries[key].addListener(handlers[key]);
      }
    });

    // Initial check
    updateAllMatches();

    // Cleanup
    return () => {
      Object.keys(mediaQueries).forEach(key => {
        if (mediaQueries[key].removeEventListener) {
          mediaQueries[key].removeEventListener('change', handlers[key]);
        } else {
          mediaQueries[key].removeListener(handlers[key]);
        }
      });
    };
  }, [queries, debounceMs, throttleMs]);

  return matches;
};

// Hook for breakpoint detection with common presets
const useBreakpoint = (customBreakpoints = {}) => {
  const breakpoints = useMemo(() => ({
    ...defaultBreakpoints,
    ...customBreakpoints,
  }), [customBreakpoints]);

  const matches = useMediaQueries(breakpoints);

  const currentBreakpoint = useMemo(() => {
    const active = Object.keys(matches).filter(key => matches[key]);
    
    // Priority order for breakpoints
    const priority = ['2xl', 'xl', 'lg', 'md', 'sm', 'xs', 'desktop', 'tablet', 'mobile'];
    
    for (const bp of priority) {
      if (active.includes(bp)) return bp;
    }
    
    return 'unknown';
  }, [matches]);

  const isMobile = useMemo(() => 
    matches.mobile || matches.xs || matches.sm, 
    [matches.mobile, matches.xs, matches.sm]
  );

  const isTablet = useMemo(() => 
    matches.tablet || matches.md, 
    [matches.tablet, matches.md]
  );

  const isDesktop = useMemo(() => 
    matches.desktop || matches.lg || matches.xl || matches['2xl'], 
    [matches.desktop, matches.lg, matches.xl, matches['2xl']]
  );

  const isPortrait = matches.portrait;
  const isLandscape = matches.landscape;
  const prefersReducedMotion = matches.reducedMotion;
  const prefersDark = matches.dark;
  const prefersLight = matches.light;
  const prefersHighContrast = matches.highContrast;
  const supportsHover = matches.hover;
  const hasFinePointer = matches.finePointer;
  const hasCoarsePointer = matches.coarsePointer;

  return {
    // Individual matches
    matches,
    
    // Breakpoint detection
    currentBreakpoint,
    isMobile,
    isTablet,
    isDesktop,
    
    // Device capabilities
    isPortrait,
    isLandscape,
    supportsHover,
    hasFinePointer,
    hasCoarsePointer,
    
    // User preferences
    prefersReducedMotion,
    prefersDark,
    prefersLight,
    prefersHighContrast,
    
    // Helper methods
    isBreakpoint: useCallback((breakpoint) => matches[breakpoint], [matches]),
    isBreakpointUp: useCallback((breakpoint) => {
      const breakpointOrder = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'];
      const currentIndex = breakpointOrder.indexOf(currentBreakpoint);
      const targetIndex = breakpointOrder.indexOf(breakpoint);
      return currentIndex >= targetIndex;
    }, [currentBreakpoint]),
    isBreakpointDown: useCallback((breakpoint) => {
      const breakpointOrder = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'];
      const currentIndex = breakpointOrder.indexOf(currentBreakpoint);
      const targetIndex = breakpointOrder.indexOf(breakpoint);
      return currentIndex <= targetIndex;
    }, [currentBreakpoint]),
  };
};

// Hook for responsive values
const useResponsiveValue = (values, options = {}) => {
  const {
    defaultValue,
    breakpoints = defaultBreakpoints,
  } = options;

  const breakpointMatches = useMediaQueries(breakpoints);

  return useMemo(() => {
    // Priority order for breakpoints
    const priority = ['2xl', 'xl', 'lg', 'md', 'sm', 'xs'];
    
    for (const bp of priority) {
      if (breakpointMatches[bp] && values[bp] !== undefined) {
        return values[bp];
      }
    }
    
    // Fallback to common names
    if (breakpointMatches.desktop && values.desktop !== undefined) return values.desktop;
    if (breakpointMatches.tablet && values.tablet !== undefined) return values.tablet;
    if (breakpointMatches.mobile && values.mobile !== undefined) return values.mobile;
    
    return defaultValue !== undefined ? defaultValue : values.default;
  }, [breakpointMatches, values, defaultValue]);
};

// Hook for responsive style objects
const useResponsiveStyles = (styles, options = {}) => {
  const {
    default: defaultStyles = {},
    breakpoints = defaultBreakpoints,
  } = options;

  const breakpointMatches = useMediaQueries(breakpoints);

  return useMemo(() => {
    let responsiveStyles = { ...defaultStyles };
    
    // Apply styles in priority order
    const priority = ['2xl', 'xl', 'lg', 'md', 'sm', 'xs', 'desktop', 'tablet', 'mobile'];
    
    for (const bp of priority) {
      if (breakpointMatches[bp] && styles[bp]) {
        responsiveStyles = { ...responsiveStyles, ...styles[bp] };
      }
    }
    
    return responsiveStyles;
  }, [breakpointMatches, styles, defaultStyles]);
};

// Hook for conditional rendering based on media queries
const useMediaComponent = (components, options = {}) => {
  const {
    default: DefaultComponent,
    breakpoints = defaultBreakpoints,
  } = options;

  const breakpointMatches = useMediaQueries(breakpoints);

  return useMemo(() => {
    // Priority order for breakpoints
    const priority = ['2xl', 'xl', 'lg', 'md', 'sm', 'xs', 'desktop', 'tablet', 'mobile'];
    
    for (const bp of priority) {
      if (breakpointMatches[bp] && components[bp]) {
        return components[bp];
      }
    }
    
    return DefaultComponent || components.default;
  }, [breakpointMatches, components, DefaultComponent]);
};

// Export all hooks
export {
  useMediaQuery,
  useMediaQueries,
  useBreakpoint,
  useResponsiveValue,
  useResponsiveStyles,
  useMediaComponent,
  defaultBreakpoints,
};

// Default export
const useMedia = {
  useMediaQuery,
  useMediaQueries,
  useBreakpoint,
  useResponsiveValue,
  useResponsiveStyles,
  useMediaComponent,
  defaultBreakpoints,
};

export default useMedia;

// Usage Examples:
/*
// 1. Single media query:
function Component() {
  const isMobile = useMediaQuery('(max-width: 768px)');
  return <div>{isMobile ? 'Mobile' : 'Desktop'}</div>;
}

// 2. Multiple queries:
function Component() {
  const { isMobile, isTablet, isDesktop } = useBreakpoint();
  return (
    <div>
      {isMobile && 'Mobile'}
      {isTablet && 'Tablet'}
      {isDesktop && 'Desktop'}
    </div>
  );
}

// 3. Responsive values:
function Component() {
  const fontSize = useResponsiveValue({
    mobile: '14px',
    tablet: '16px',
    desktop: '18px',
    default: '16px'
  });
  
  return <div style={{ fontSize }}>Responsive text</div>;
}

// 4. Responsive styles:
function Component() {
  const styles = useResponsiveStyles({
    default: { padding: '10px' },
    mobile: { padding: '5px', fontSize: '14px' },
    desktop: { padding: '20px', fontSize: '18px' }
  });
  
  return <div style={styles}>Responsive styles</div>;
}

// 5. Conditional components:
function Component() {
  const ResponsiveComponent = useMediaComponent({
    mobile: MobileView,
    desktop: DesktopView,
    default: DefaultView
  });
  
  return <ResponsiveComponent />;
}

// 6. User preferences:
function Component() {
  const { prefersReducedMotion, prefersDark } = useBreakpoint();
  
  useEffect(() => {
    if (prefersReducedMotion) {
      // Disable animations
    }
    if (prefersDark) {
      // Apply dark theme
    }
  }, [prefersReducedMotion, prefersDark]);
  
  return <div>Adaptive component</div>;
}
*/