// ✅ USE THIS EXACT CODE - Copy and paste to replace your current useAOS hook
const useAOS = () => {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const initAOS = async () => {
      try {
        const AOS = (await import('aos')).default;
        await import('aos/dist/aos.css');
        
        // MINIMAL CONFIGURATION - NO PROBLEMATIC PROPERTIES
        AOS.init({
          duration: 600,
          once: true,
        });
      } catch (error) {
        // Silent fail - no console warnings
      }
    };

    initAOS();
  }, []);
};