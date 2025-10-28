// useAOS.js - Custom React Hook for Animate On Scroll
import { useEffect, useRef, useCallback } from 'react';

// Default configuration
const defaultConfig = {
  offset: 120,
  delay: 0,
  duration: 600,
  easing: 'ease-out',
  once: true,
  mirror: false,
  anchorPlacement: 'top-bottom',
  disable: false,
  startEvent: 'DOMContentLoaded',
  throttleDelay: 99,
  debounceDelay: 50
};

// Easing functions
const easingFunctions = {
  ease: [0.25, 0.1, 0.25, 1.0],
  linear: [0.0, 0.0, 1.0, 1.0],
  'ease-in': [0.42, 0.0, 1.0, 1.0],
  'ease-out': [0.0, 0.0, 0.58, 1.0],
  'ease-in-out': [0.42, 0.0, 0.58, 1.0],
  'ease-in-back': [0.6, -0.28, 0.735, 0.045],
  'ease-out-back': [0.175, 0.885, 0.32, 1.275],
  'ease-in-out-back': [0.68, -0.55, 0.265, 1.55],
  'ease-in-sine': [0.47, 0, 0.745, 0.715],
  'ease-out-sine': [0.39, 0.575, 0.565, 1],
  'ease-in-out-sine': [0.445, 0.05, 0.55, 0.95],
  'ease-in-quad': [0.55, 0.085, 0.68, 0.53],
  'ease-out-quad': [0.25, 0.46, 0.45, 0.94],
  'ease-in-out-quad': [0.455, 0.03, 0.515, 0.955]
};

// Utility functions
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

// Calculate progress based on easing
const calculateProgress = (progress, easing) => {
  const ease = easingFunctions[easing] || easingFunctions['ease-out'];
  return progress < 0.5 
    ? 4 * progress * progress * progress 
    : (progress - 1) * (2 * progress - 2) * (2 * progress - 2) + 1;
};

// Animation presets
const animationPresets = {
  fade: {
    from: { opacity: 0 },
    to: { opacity: 1 }
  },
  'fade-up': {
    from: { opacity: 0, transform: 'translate3d(0, 100px, 0)' },
    to: { opacity: 1, transform: 'translate3d(0, 0, 0)' }
  },
  'fade-down': {
    from: { opacity: 0, transform: 'translate3d(0, -100px, 0)' },
    to: { opacity: 1, transform: 'translate3d(0, 0, 0)' }
  },
  'fade-left': {
    from: { opacity: 0, transform: 'translate3d(100px, 0, 0)' },
    to: { opacity: 1, transform: 'translate3d(0, 0, 0)' }
  },
  'fade-right': {
    from: { opacity: 0, transform: 'translate3d(-100px, 0, 0)' },
    to: { opacity: 1, transform: 'translate3d(0, 0, 0)' }
  },
  'zoom-in': {
    from: { opacity: 0, transform: 'scale3d(0.3, 0.3, 0.3)' },
    to: { opacity: 1, transform: 'scale3d(1, 1, 1)' }
  },
  'zoom-out': {
    from: { opacity: 0, transform: 'scale3d(1.3, 1.3, 1.3)' },
    to: { opacity: 1, transform: 'scale3d(1, 1, 1)' }
  },
  'flip-left': {
    from: { 
      opacity: 0, 
      transform: 'perspective(2500px) rotateY(-100deg)'
    },
    to: { 
      opacity: 1, 
      transform: 'perspective(2500px) rotateY(0)'
    }
  },
  'flip-right': {
    from: { 
      opacity: 0, 
      transform: 'perspective(2500px) rotateY(100deg)'
    },
    to: { 
      opacity: 1, 
      transform: 'perspective(2500px) rotateY(0)'
    }
  },
  'slide-up': {
    from: { transform: 'translate3d(0, 100%, 0)' },
    to: { transform: 'translate3d(0, 0, 0)' }
  },
  'slide-down': {
    from: { transform: 'translate3d(0, -100%, 0)' },
    to: { transform: 'translate3d(0, 0, 0)' }
  }
};

// Main hook
const useAOS = (userConfig = {}) => {
  const elementsRef = useRef(new Map());
  const configRef = useRef({ ...defaultConfig, ...userConfig });
  const animationFrameRef = useRef(null);
  const observerRef = useRef(null);

  // Initialize element styles
  const initElement = useCallback((element, animation) => {
    const preset = animationPresets[animation] || animationPresets.fade;
    
    Object.keys(preset.from).forEach(property => {
      element.style[property] = preset.from[property];
    });
    
    element.style.willChange = 'transform, opacity';
    element.style.backfaceVisibility = 'hidden';
  }, []);

  // Animate element
  const animateElement = useCallback((element, animation, duration, easing, delay = 0) => {
    return new Promise((resolve) => {
      const preset = animationPresets[animation] || animationPresets.fade;
      const startTime = Date.now() + delay;

      const animate = () => {
        const currentTime = Date.now();
        const elapsed = currentTime - startTime;

        if (elapsed < 0) {
          animationFrameRef.current = requestAnimationFrame(animate);
          return;
        }

        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = calculateProgress(progress, easing);

        Object.keys(preset.to).forEach(property => {
          if (property === 'transform' || property === 'opacity') {
            const fromValue = preset.from[property];
            const toValue = preset.to[property];
            
            if (property === 'opacity') {
              const currentOpacity = parseFloat(fromValue) + (parseFloat(toValue) - parseFloat(fromValue)) * easedProgress;
              element.style[property] = currentOpacity;
            } else if (property === 'transform') {
              element.style[property] = toValue;
            }
          }
        });

        if (progress < 1) {
          animationFrameRef.current = requestAnimationFrame(animate);
        } else {
          element.style.willChange = 'auto';
          resolve();
        }
      };

      setTimeout(() => {
        animationFrameRef.current = requestAnimationFrame(animate);
      }, delay);
    });
  }, []);

  // Check if element is in viewport
  const isInViewport = useCallback((element, offset = 0) => {
    const rect = element.getBoundingClientRect();
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;
    
    return (
      rect.top <= windowHeight - offset &&
      rect.bottom >= offset
    );
  }, []);

  // Handle scroll and resize events
  const handleScroll = useCallback(() => {
    elementsRef.current.forEach((data, element) => {
      const { animation, animated, once, offset } = data;
      
      if (animated && once) return;

      if (isInViewport(element, offset)) {
        if (!data.animated) {
          data.animated = true;
          initElement(element, animation);
          
          animateElement(
            element, 
            animation, 
            data.duration, 
            data.easing, 
            data.delay
          ).then(() => {
            if (once) {
              elementsRef.current.delete(element);
            }
          });
        }
      } else if (!once && data.animated && configRef.current.mirror) {
        data.animated = false;
        initElement(element, animation);
      }
    });
  }, [initElement, animateElement, isInViewport]);

  // Throttled scroll handler
  const throttledScrollHandler = useCallback(
    throttle(handleScroll, configRef.current.throttleDelay),
    [handleScroll]
  );

  // Initialize AOS
  const init = useCallback(() => {
    if (configRef.current.disable) return;

    // Set up Intersection Observer as primary method
    if ('IntersectionObserver' in window) {
      observerRef.current = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const element = entry.target;
              const data = elementsRef.current.get(element);
              
              if (data && !data.animated) {
                data.animated = true;
                initElement(element, data.animation);
                
                animateElement(
                  element, 
                  data.animation, 
                  data.duration, 
                  data.easing, 
                  data.delay
                ).then(() => {
                  if (data.once) {
                    elementsRef.current.delete(element);
                    observerRef.current.unobserve(element);
                  }
                });
              }
            } else if (configRef.current.mirror) {
              const element = entry.target;
              const data = elementsRef.current.get(element);
              
              if (data && data.animated) {
                data.animated = false;
                initElement(element, data.animation);
              }
            }
          });
        },
        {
          rootMargin: `-${configRef.current.offset}px 0px -${configRef.current.offset}px 0px`,
          threshold: 0
        }
      );

      elementsRef.current.forEach((_, element) => {
        observerRef.current.observe(element);
      });
    } else {
      // Fallback to scroll event for older browsers
      window.addEventListener('scroll', throttledScrollHandler, { passive: true });
      window.addEventListener('resize', throttledScrollHandler, { passive: true });
      handleScroll(); // Initial check
    }

    // Handle dynamic content
    const handleMutation = debounce((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === 1 && node.hasAttribute && node.hasAttribute('data-aos')) {
            refresh(); // Refresh when new elements are added
          }
        });
      });
    }, configRef.current.debounceDelay);

    const observer = new MutationObserver(handleMutation);
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    return () => observer.disconnect();
  }, [throttledScrollHandler, handleScroll, initElement, animateElement]);

  // Refresh AOS - re-initialize all elements
  const refresh = useCallback(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    // Cancel any ongoing animations
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    // Re-initialize elements
    const elements = document.querySelectorAll('[data-aos]');
    elementsRef.current.clear();

    elements.forEach(element => {
      const animation = element.getAttribute('data-aos');
      const delay = parseInt(element.getAttribute('data-aos-delay')) || configRef.current.delay;
      const duration = parseInt(element.getAttribute('data-aos-duration')) || configRef.current.duration;
      const easing = element.getAttribute('data-aos-easing') || configRef.current.easing;
      const once = element.getAttribute('data-aos-once') !== 'false' ? configRef.current.once : false;
      const offset = parseInt(element.getAttribute('data-aos-offset')) || configRef.current.offset;

      elementsRef.current.set(element, {
        animation,
        delay,
        duration,
        easing,
        once,
        offset,
        animated: false
      });
    });

    init();
  }, [init]);

  // Add individual element to AOS
  const addElement = useCallback((element, options = {}) => {
    if (!element) return;

    const animation = options.animation || 'fade';
    const delay = options.delay || configRef.current.delay;
    const duration = options.duration || configRef.current.duration;
    const easing = options.easing || configRef.current.easing;
    const once = options.once !== undefined ? options.once : configRef.current.once;
    const offset = options.offset || configRef.current.offset;

    elementsRef.current.set(element, {
      animation,
      delay,
      duration,
      easing,
      once,
      offset,
      animated: false
    });

    // Set data attributes for consistency
    element.setAttribute('data-aos', animation);
    element.setAttribute('data-aos-delay', delay);
    element.setAttribute('data-aos-duration', duration);
    element.setAttribute('data-aos-easing', easing);
    element.setAttribute('data-aos-once', once);
    element.setAttribute('data-aos-offset', offset);

    if (observerRef.current) {
      observerRef.current.observe(element);
    }
  }, []);

  // Remove element from AOS
  const removeElement = useCallback((element) => {
    if (elementsRef.current.has(element)) {
      elementsRef.current.delete(element);
      
      if (observerRef.current) {
        observerRef.current.unobserve(element);
      }

      // Remove data attributes
      ['data-aos', 'data-aos-delay', 'data-aos-duration', 'data-aos-easing', 'data-aos-once', 'data-aos-offset']
        .forEach(attr => element.removeAttribute(attr));
    }
  }, []);

  // Update configuration
  const updateConfig = useCallback((newConfig) => {
    configRef.current = { ...configRef.current, ...newConfig };
    refresh();
  }, [refresh]);

  // Get current configuration
  const getConfig = useCallback(() => {
    return { ...configRef.current };
  }, []);

  // Get all animated elements
  const getElements = useCallback(() => {
    return Array.from(elementsRef.current.keys());
  }, []);

  // Cleanup
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
      window.removeEventListener('scroll', throttledScrollHandler);
      window.removeEventListener('resize', throttledScrollHandler);
    };
  }, [throttledScrollHandler]);

  return {
    init,
    refresh,
    addElement,
    removeElement,
    updateConfig,
    getConfig,
    getElements,
    animationPresets: Object.keys(animationPresets)
  };
};

export default useAOS;

// Usage examples:
/*
// 1. Basic usage in component:
function MyComponent() {
  const { init, refresh } = useAOS();

  useEffect(() => {
    init();
  }, [init]);

  return (
    <div data-aos="fade-up">Animated element</div>
  );
}

// 2. With custom config:
function MyComponent() {
  const { init, addElement } = useAOS({
    offset: 100,
    duration: 1000,
    once: false
  });

  const elementRef = useRef();

  useEffect(() => {
    init();
    if (elementRef.current) {
      addElement(elementRef.current, {
        animation: 'zoom-in',
        delay: 200
      });
    }
  }, [init, addElement]);

  return <div ref={elementRef}>Custom animated</div>;
}

// 3. Programmatic control:
function MyComponent() {
  const { addElement, removeElement, refresh } = useAOS();

  const handleAddAnimation = (element) => {
    addElement(element, { animation: 'fade-left', duration: 800 });
  };

  return (
    <div>
      <button onClick={refresh}>Refresh Animations</button>
      <div ref={handleAddAnimation}>Dynamic element</div>
    </div>
  );
}
*/