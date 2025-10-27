// hooks/usePerformance.js
import { useEffect, useRef, useState, useCallback } from 'react';

// Check if web-vitals is available and handle different versions
let webVitalsAvailable = false;
let webVitals = null;

try {
  webVitals = await import('web-vitals');
  webVitalsAvailable = true;
} catch (error) {
  console.warn('web-vitals not available:', error);
}

export const usePerformance = (options = {}) => {
  const {
    enabled = true,
    logToConsole = false,
    sendToAnalytics = false,
    analyticsEndpoint = '/api/analytics',
    threshold = 4000, // 4 seconds threshold for poor performance
    onPoorPerformance,
    customMetrics = {}
  } = options;

  const metricsRef = useRef({
    LCP: null,
    FID: null,
    CLS: null,
    FCP: null,
    TTFB: null,
    custom: {}
  });

  const reportMetric = useRef((metric) => {
    const { name, value, rating } = metric;
    
    // Update metrics ref
    metricsRef.current[name] = { value, rating, timestamp: Date.now() };

    // Log to console if enabled
    if (logToConsole) {
      console.log(`[Performance] ${name}:`, {
        value: value.toFixed(2),
        rating,
        timestamp: new Date().toISOString()
      });
    }

    // Send to analytics if enabled
    if (sendToAnalytics) {
      sendToAnalyticsEndpoint(metric);
    }

    // Check for poor performance
    if (rating === 'poor' && onPoorPerformance) {
      onPoorPerformance(metric);
    }

    // Check custom thresholds
    if (value > threshold && name === 'LCP') {
      console.warn(`[Performance Warning] LCP exceeded threshold: ${value}ms`);
    }
  });

  const sendToAnalyticsEndpoint = async (metric) => {
    try {
      const payload = {
        ...metric,
        url: window.location.href,
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString(),
        connection: navigator.connection ? {
          effectiveType: navigator.connection.effectiveType,
          downlink: navigator.connection.downlink,
          rtt: navigator.connection.rtt
        } : null
      };

      if (analyticsEndpoint) {
        await fetch(analyticsEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
          keepalive: true // Ensure request completes even if page unloads
        });
      }
    } catch (error) {
      console.error('Failed to send performance metrics:', error);
    }
  };

  const measureCustomMetric = (name, value) => {
    metricsRef.current.custom[name] = {
      value,
      timestamp: Date.now()
    };

    if (logToConsole) {
      console.log(`[Custom Metric] ${name}:`, value);
    }
  };

  const getPerformanceMetrics = () => {
    return { ...metricsRef.current };
  };

  const measureResourceTiming = () => {
    if ('performance' in window) {
      const resources = performance.getEntriesByType('resource');
      const pageLoadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
      
      measureCustomMetric('pageLoadTime', pageLoadTime);
      measureCustomMetric('resourceCount', resources.length);

      // Log slow resources
      const slowResources = resources.filter(resource => 
        resource.duration > 1000
      );
      
      if (slowResources.length > 0 && logToConsole) {
        console.warn('[Performance] Slow resources detected:', slowResources);
      }
    }
  };

  const measureMemory = () => {
    if ('memory' in performance) {
      const memory = performance.memory;
      measureCustomMetric('usedJSHeapSize', memory.usedJSHeapSize);
      measureCustomMetric('totalJSHeapSize', memory.totalJSHeapSize);
      measureCustomMetric('jsHeapSizeLimit', memory.jsHeapSizeLimit);
    }
  };

  useEffect(() => {
    if (!enabled || !webVitalsAvailable) return;

    try {
      // Handle different web-vitals versions
      if (webVitals.getCLS) {
        // v2 format
        webVitals.getCLS(reportMetric.current);
        webVitals.getFID(reportMetric.current);
        webVitals.getLCP(reportMetric.current);
        webVitals.getFCP(reportMetric.current);
        webVitals.getTTFB(reportMetric.current);
      } else if (webVitals.onCLS) {
        // v3+ format
        webVitals.onCLS(reportMetric.current);
        webVitals.onFID(reportMetric.current);
        webVitals.onLCP(reportMetric.current);
        webVitals.onFCP(reportMetric.current);
        webVitals.onTTFB(reportMetric.current);
      }
    } catch (error) {
      console.warn('Failed to initialize web-vitals:', error);
    }

    // Custom metrics
    if (customMetrics.resourceTiming) {
      setTimeout(measureResourceTiming, 1000); // Wait for page to load
    }

    if (customMetrics.memory && 'memory' in performance) {
      setInterval(measureMemory, 30000); // Measure memory every 30 seconds
    }

    // First Input Delay polyfill for older browsers
    if (!('PerformanceEventTiming' in window)) {
      const originalAddEventListener = EventTarget.prototype.addEventListener;
      EventTarget.prototype.addEventListener = function(type, listener, options) {
        if (type === 'click' || type === 'keydown' || type === 'mousedown') {
          const startTime = Date.now();
          const wrappedListener = function(...args) {
            const delay = Date.now() - startTime;
            if (delay > 100) { // Only log delays > 100ms
              measureCustomMetric('firstInputDelay', delay);
            }
            return listener.apply(this, args);
          };
          return originalAddEventListener.call(this, type, wrappedListener, options);
        }
        return originalAddEventListener.call(this, type, listener, options);
      };
    }

    // Performance observer for long tasks
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (entry.duration > 50) { // Tasks longer than 50ms
            measureCustomMetric('longTask', entry.duration);
          }
        });
      });

      try {
        observer.observe({ entryTypes: ['longtask'] });
      } catch (e) {
        // Some browsers don't support longtask observation
      }
    }

    // Cleanup function
    return () => {
      // Cleanup any ongoing measurements if needed
    };
  }, [enabled, customMetrics]);

  return {
    getMetrics: getPerformanceMetrics,
    measureCustomMetric,
    metrics: metricsRef.current
  };
};

// Hook for measuring component performance
export const useComponentPerformance = (componentName, options = {}) => {
  const { enabled = true, logToConsole = false } = options;
  const mountTimeRef = useRef(null);
  const renderCountRef = useRef(0);

  useEffect(() => {
    if (!enabled) return;

    mountTimeRef.current = performance.now();
    renderCountRef.current = 0;

    return () => {
      const unmountTime = performance.now();
      const lifetime = unmountTime - mountTimeRef.current;
      
      if (logToConsole) {
        console.log(`[Component Performance] ${componentName}:`, {
          lifetime: lifetime.toFixed(2),
          renderCount: renderCountRef.current,
          averageRenderTime: lifetime / Math.max(renderCountRef.current, 1)
        });
      }
    };
  }, [componentName, enabled, logToConsole]);

  useEffect(() => {
    if (enabled) {
      renderCountRef.current += 1;
    }
  });

  const measureRender = (phase = 'render') => {
    if (!enabled) return;

    const renderTime = performance.now();
    if (logToConsole) {
      console.log(`[Render] ${componentName} ${phase}:`, {
        time: renderTime.toFixed(2),
        renderCount: renderCountRef.current
      });
    }
  };

  return {
    measureRender,
    getStats: () => ({
      renderCount: renderCountRef.current,
      mountTime: mountTimeRef.current
    })
  };
};

// Hook for measuring network performance
export const useNetworkPerformance = (options = {}) => {
  const { enabled = true, logToConsole = false } = options;
  const [networkInfo, setNetworkInfo] = useState(null);

  useEffect(() => {
    if (!enabled || !navigator.connection) return;

    const updateNetworkInfo = () => {
      const connection = navigator.connection;
      setNetworkInfo({
        effectiveType: connection.effectiveType,
        downlink: connection.downlink,
        rtt: connection.rtt,
        saveData: connection.saveData
      });

      if (logToConsole) {
        console.log('[Network Performance]', {
          effectiveType: connection.effectiveType,
          downlink: connection.downlink,
          rtt: connection.rtt,
          saveData: connection.saveData
        });
      }
    };

    updateNetworkInfo();
    navigator.connection.addEventListener('change', updateNetworkInfo);

    return () => {
      navigator.connection.removeEventListener('change', updateNetworkInfo);
    };
  }, [enabled, logToConsole]);

  return networkInfo;
};

// Swipe hook for mobile navigation
export const useSwipe = (onSwipeLeft, onSwipeRight, threshold = 50) => {
  const touchStart = useRef(null);
  const touchEnd = useRef(null);

  const onTouchStart = useCallback((e) => {
    touchEnd.current = null;
    touchStart.current = e.targetTouches[0].clientX;
  }, []);

  const onTouchMove = useCallback((e) => {
    touchEnd.current = e.targetTouches[0].clientX;
  }, []);

  const onTouchEnd = useCallback(() => {
    if (!touchStart.current || !touchEnd.current) return;
    
    const distance = touchStart.current - touchEnd.current;
    const isLeftSwipe = distance > threshold;
    const isRightSwipe = distance < -threshold;

    if (isLeftSwipe) {
      onSwipeLeft();
    } else if (isRightSwipe) {
      onSwipeRight();
    }
  }, [onSwipeLeft, onSwipeRight, threshold]);

  return {
    onTouchStart,
    onTouchMove,
    onTouchEnd
  };
};

// Debounce hook
export const useDebounce = (callback, delay) => {
  const timeoutRef = useRef(null);

  return useCallback((...args) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      callback(...args);
    }, delay);
  }, [callback, delay]);
};

export default usePerformance;