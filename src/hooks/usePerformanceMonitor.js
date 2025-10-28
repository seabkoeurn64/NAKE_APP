// src/hooks/useRoutePerformance.js
import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Hook to monitor route change performance
 */
const useRoutePerformance = (options = {}) => {
  const {
    enabled = process.env.NODE_ENV === 'development',
    logToConsole = true,
  } = options;

  const location = useLocation();
  const routeStartTime = useRef(performance.now());
  const lastPathname = useRef(location.pathname);

  useEffect(() => {
    if (!enabled) return;

    // Only measure if route actually changed
    if (location.pathname !== lastPathName.current) {
      const routeChangeTime = Math.round(performance.now() - routeStartTime.current);
      
      if (logToConsole) {
        console.log(`🛣️ Route Change (${lastPathname.current} → ${location.pathname}):`, `${routeChangeTime}ms`);
      }

      // Reset for next route change
      routeStartTime.current = performance.now();
      lastPathname.current = location.pathname;
    }
  }, [location.pathname, enabled, logToConsole]);
};

export default useRoutePerformance;