import { useEffect } from 'react';
import { getLCP, getFID, getCLS } from 'web-vitals';

export const usePerformance = () => {
  useEffect(() => {
    getCLS(console.log);
    getFID(console.log);
    getLCP(console.log);
  }, []);
};