import { useEffect, useRef } from 'react';

export const usePreload = (dependencies = []) => {
  const preloadedRef = useRef(new Set());

  useEffect(() => {
    dependencies.forEach(dep => {
      if (!preloadedRef.current.has(dep)) {
        // Preload logic here
        preloadedRef.current.add(dep);
      }
    });
  }, [dependencies]);

  return preloadedRef.current;
};