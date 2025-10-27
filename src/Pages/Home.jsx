// src/Pages/Home.jsx
import React, { useState, useEffect, useCallback, memo, useMemo, useRef } from "react"
import { Github, Linkedin, Mail, ExternalLink, Instagram, Sparkles } from "lucide-react"
import { DotLottieReact } from '@lottiefiles/dotlottie-react'
import AOS from 'aos'
import 'aos/dist/aos.css'

// Constants
const ANIMATION_CONFIG = {
  TYPING_SPEED: 80,
  ERASING_SPEED: 40,
  PAUSE_DURATION: 1500,
  AOS_OFFSET: 50,
  AOS_DURATION: 400
};

const WORDS = [
  "Poster Design",
  "Logo Design", 
  "Banner Design",
  "Name Card Design",
  "Flyer Design",
  "Social Media Graphics",
  "Branding Materials"
];

const TECH_STACK = ["Figma", "Adobe XD", "Photoshop", "Illustrator", "Corel"];

const SOCIAL_LINKS = [
  { 
    icon: Github, 
    link: "https://github.com/seabkoeurn",
    label: "Visit GitHub profile" 
  },
  { 
    icon: Linkedin, 
    link: "https://www.linkedin.com/in/koeurn64",
    label: "Visit LinkedIn profile" 
  },
  { 
    icon: Instagram, 
    link: "https://www.instagram.com/koeurn.64._/?hl=id",
    label: "Visit Instagram profile" 
  }
];

// Enhanced media queries hook
const useMediaQueries = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [breakpoint, setBreakpoint] = useState('mobile');

  useEffect(() => {
    if (typeof window === 'undefined') return;

    let animationFrameId;

    const updateBreakpoint = () => {
      const width = window.innerWidth;
      const mobile = width < 768;
      const tablet = width >= 768 && width < 1024;
      
      setIsMobile(mobile);
      setIsTablet(tablet);
      
      if (mobile) setBreakpoint('mobile');
      else if (tablet) setBreakpoint('tablet');
      else setBreakpoint('desktop');
    };

    const checkReducedMotion = () => 
      setPrefersReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    
    const throttledResize = () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      animationFrameId = requestAnimationFrame(updateBreakpoint);
    };
    
    updateBreakpoint();
    checkReducedMotion();
    
    window.addEventListener('resize', throttledResize, { passive: true });
    
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    mediaQuery.addEventListener('change', checkReducedMotion);
    
    return () => {
      window.removeEventListener('resize', throttledResize);
      mediaQuery.removeEventListener('change', checkReducedMotion);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return { isMobile, isTablet, prefersReducedMotion, breakpoint };
};

// Fixed Typing effect hook
const useTypingEffect = (words, typingSpeed, erasingSpeed, pauseDuration) => {
  const [text, setText] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const [wordIndex, setWordIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const timeoutRef = useRef();

  useEffect(() => {
    const currentWord = words[wordIndex];
    
    if (isTyping) {
      if (charIndex < currentWord.length) {
        timeoutRef.current = setTimeout(() => {
          setText(currentWord.substring(0, charIndex + 1));
          setCharIndex(prev => prev + 1);
        }, typingSpeed);
      } else {
        // Finished typing - pause before erasing
        timeoutRef.current = setTimeout(() => {
          setIsTyping(false);
        }, pauseDuration);
      }
    } else {
      // Erasing
      if (charIndex > 0) {
        timeoutRef.current = setTimeout(() => {
          setText(currentWord.substring(0, charIndex - 1));
          setCharIndex(prev => prev - 1);
        }, erasingSpeed);
      } else {
        // Finished erasing - move to next word
        setWordIndex(prev => (prev + 1) % words.length);
        setIsTyping(true);
      }
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [charIndex, isTyping, wordIndex, words, typingSpeed, erasingSpeed, pauseDuration]);

  return text;
};

// Memoized Components
const StatusBadge = memo(() => (
  <div className="inline-block animate-float mx-auto lg:mx-0" data-aos="zoom-in" data-aos-delay="200">
    <div className="relative group">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-[#6366f1] to-[#a855f7] rounded-full blur opacity-20 group-hover:opacity-30 transition duration-500"></div>
      <div className="relative px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-black/40 backdrop-blur-xl border border-white/10">
        <span className="bg-gradient-to-r from-[#6366f1] to-[#a855f7] text-transparent bg-clip-text text-xs sm:text-sm font-medium flex items-center">
          <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 mr-2 text-blue-400" />
          Creative Designer
        </span>
      </div>
    </div>
  </div>
));

const MainTitle = memo(() => (
  <div className="space-y-2 text-center lg:text-left" data-aos="fade-up" data-aos-delay="300">
    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-6xl font-bold tracking-tight">
      <span className="relative inline-block">
        <span className="absolute -inset-1 bg-gradient-to-r from-[#6366f1] to-[#a855f7] blur-lg sm:blur-xl opacity-20"></span>
        <span className="relative bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent">
          Graphic
        </span>
      </span>
      <br />
      <span className="relative inline-block mt-1">
        <span className="absolute -inset-1 bg-gradient-to-r from-[#6366f1] to-[#a855f7] blur-lg sm:blur-xl opacity-20"></span>
        <span className="relative bg-gradient-to-r from-[#6366f1] to-[#a855f7] bg-clip-text text-transparent">
          Designer
        </span>
      </span>
    </h1>
  </div>
));

const TechStack = memo(({ tech }) => (
  <div className="px-2 py-1 sm:px-3 sm:py-1.5 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 text-xs text-gray-300 hover:bg-white/10 transition-colors mobile-touch active:scale-95">
    {tech}
  </div>
));

const CTAButton = memo(({ href, text, icon: Icon }) => (
  <a href={href} className="block">
    <button className="group relative w-[120px] sm:w-[140px] mobile-touch active:scale-95">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-[#4f52c9] to-[#8644c5] rounded-lg sm:rounded-xl opacity-40 blur group-hover:opacity-70 transition-all duration-500"></div>
      <div className="relative h-9 sm:h-10 bg-[#030014] backdrop-blur-xl rounded-lg border border-white/10 leading-none overflow-hidden">
        <div className="absolute inset-0 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300 bg-gradient-to-r from-[#4f52c9]/20 to-[#8644c5]/20"></div>
        <span className="absolute inset-0 flex items-center justify-center gap-1 sm:gap-1.5 text-xs group-hover:gap-1.5 sm:group-hover:gap-2 transition-all duration-200">
          <span className="bg-gradient-to-r from-gray-200 to-white bg-clip-text text-transparent font-medium z-10">
            {text}
          </span>
          <Icon className={`w-3 h-3 text-gray-200 ${text === 'Contact' ? 'group-hover:translate-x-0.5' : 'group-hover:rotate-45'} transform transition-all duration-200 z-10`} />
        </span>
      </div>
    </button>
  </a>
));

const SocialLink = memo(({ icon: Icon, link, label }) => (
  <a href={link} target="_blank" rel="noopener noreferrer" aria-label={label} className="block">
    <button className="group relative p-1.5 sm:p-2 mobile-touch active:scale-95">
      <div className="absolute inset-0 bg-gradient-to-r from-[#6366f1] to-[#a855f7] rounded-lg sm:rounded-xl blur opacity-15 group-hover:opacity-25 transition duration-200"></div>
      <div className="relative rounded-lg sm:rounded-xl bg-black/50 backdrop-blur-xl p-1.5 flex items-center justify-center border border-white/10 group-hover:border-white/20 transition-all duration-200">
        <Icon className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 group-hover:text-white transition-colors" />
      </div>
    </button>
  </a>
));

const MobileSocialLinks = memo(() => (
  <div className="flex sm:hidden gap-2 justify-center" data-aos="fade-up" data-aos-delay="800">
    {SOCIAL_LINKS.map((social, index) => (
      <SocialLink key={`mobile-social-${index}`} {...social} />
    ))}
  </div>
));

// Fixed Lottie Component with HIDDEN loading states
const LottieComponent = memo(({ 
  config, 
  className, 
  onLoad, 
  onError,
  isMobile,
  isTablet
}) => {
  const [lottieError, setLottieError] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const containerRef = useRef();

  const handleError = useCallback(() => {
    setLottieError(true);
    onError?.();
  }, [onError]);

  const handleLoad = useCallback(() => {
    onLoad?.();
  }, [onLoad]);

  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // No loading state - just show animation or error
  if (lottieError) {
    return (
      <div className="flex items-center justify-center w-full h-full">
        <div className="text-center text-gray-400">
          <Sparkles className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p className="text-sm">Creative Designs</p>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className={className}>
      {isInView && (
        <DotLottieReact
          {...config}
          onLoad={handleLoad}
          onError={handleError}
        />
      )}
    </div>
  );
});

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900">
          <div className="text-center text-white">
            <h2 className="text-xl mb-4">Something went wrong</h2>
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const Home = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [lottieLoaded, setLottieLoaded] = useState(false);
  const [lottieError, setLottieError] = useState(false);
  
  const { isMobile, isTablet, prefersReducedMotion, breakpoint } = useMediaQueries();
  
  const typedText = useTypingEffect(
    WORDS, 
    ANIMATION_CONFIG.TYPING_SPEED, 
    ANIMATION_CONFIG.ERASING_SPEED, 
    ANIMATION_CONFIG.PAUSE_DURATION
  );
  
  const shouldAnimate = !isMobile && !prefersReducedMotion;

  // AOS initialization with mobile optimizations
  useEffect(() => {
    if (prefersReducedMotion) return;

    let timeoutId;

    const initAOS = () => {
      AOS.init({
        once: true,
        offset: isMobile ? 10 : ANIMATION_CONFIG.AOS_OFFSET,
        duration: isMobile ? 300 : ANIMATION_CONFIG.AOS_DURATION,
        easing: 'ease-out',
        disable: isMobile ? false : 'mobile',
      });
    };

    timeoutId = setTimeout(initAOS, 50);
    
    return () => {
      clearTimeout(timeoutId);
      AOS.refresh();
    };
  }, [isMobile, prefersReducedMotion]);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Fixed Lottie configuration
  const lottieConfig = useMemo(() => ({
    src: "https://assets-v2.lottiefiles.com/a/a48f1c1e-1181-11ee-8323-1fd18ac98420/CefN62GDJc.lottie",
    autoplay: true,
    loop: true,
  }), []);

  const lottieClassName = useMemo(() => {
    const baseScale = isMobile ? "scale-110" : 
                     isTablet ? "scale-125" : "scale-135";
    
    const hoverScale = shouldAnimate ? "scale-[130%] sm:scale-[140%] md:scale-[130%] rotate-1" : baseScale;
    
    return `w-full h-full transition-all duration-300 ${
      isHovering ? hoverScale : baseScale
    }`;
  }, [isHovering, isMobile, isTablet, shouldAnimate]);

  const gradientClasses = useMemo(() => 
    `absolute inset-0 bg-gradient-to-r from-[#6366f1]/10 to-[#a855f7]/10 rounded-2xl sm:rounded-3xl blur-xl sm:blur-2xl transition-all duration-500 ease-in-out ${
      isHovering && shouldAnimate ? "opacity-40 scale-102" : "opacity-20 scale-100"
    }`,
    [isHovering, shouldAnimate]
  );

  const animationContainerClass = useMemo(() => 
    `relative lg:left-4 xl:left-6 z-10 w-full h-full opacity-90 transform transition-transform duration-300 ${
      isHovering && shouldAnimate ? "scale-102" : "scale-100"
    }`,
    [isHovering, shouldAnimate]
  );

  // Mobile-optimized animation container height
  const animationContainerHeight = useMemo(() => 
    isMobile ? "h-[180px] sm:h-[250px]" : 
    isTablet ? "h-[300px] lg:h-[400px]" : "h-[450px] xl:h-[500px]",
    [isMobile, isTablet]
  );

  // Pre-memoized arrays
  const renderedSocialLinks = useMemo(() => 
    SOCIAL_LINKS.map((social, index) => (
      <SocialLink key={`social-${index}`} {...social} />
    )),
    []
  );

  const renderedTechStack = useMemo(() => 
    TECH_STACK.map((tech, index) => (
      <TechStack key={`tech-${index}`} tech={tech} />
    )),
    []
  );

  const handleMouseEnter = useCallback(() => {
    if (shouldAnimate) setIsHovering(true);
  }, [shouldAnimate]);

  const handleMouseLeave = useCallback(() => {
    if (shouldAnimate) setIsHovering(false);
  }, [shouldAnimate]);

  const handleTouchStart = useCallback(() => {
    if (isMobile) setIsHovering(true);
  }, [isMobile]);

  const handleTouchEnd = useCallback(() => {
    if (isMobile) setIsHovering(false);
  }, [isMobile]);

  const handleLottieLoad = useCallback(() => {
    setLottieLoaded(true);
  }, []);

  const handleLottieError = useCallback(() => {
    setLottieError(true);
  }, []);

  // Optimized background elements for mobile
  const backgroundElements = useMemo(() => (
    <div className="absolute inset-0 overflow-hidden">
      {/* Reduced background elements on mobile */}
      {!isMobile && (
        <>
          <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-[#6366f1] rounded-full blur-3xl opacity-10 animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#a855f7] rounded-full blur-3xl opacity-5 animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 w-56 h-56 bg-[#8b5cf6] rounded-full blur-2xl opacity-5 animate-pulse delay-500"></div>
        </>
      )}
      
      {/* Simplified grid for mobile */}
      <div className="absolute inset-0 opacity-10">
        <div className="w-full h-full" style={{
          backgroundImage: `linear-gradient(#6366f1 1px, transparent 1px), linear-gradient(90deg, #6366f1 1px, transparent 1px)`,
          backgroundSize: isMobile ? '20px 20px' : '40px 40px',
          animation: shouldAnimate ? 'grid-move 20s linear infinite' : 'none'
        }}></div>
      </div>
    </div>
  ), [isMobile, shouldAnimate]);

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-[#030014] via-[#0f0a28] to-[#030014] overflow-hidden relative" id="Home">
        {backgroundElements}

        <div className={`relative z-10 transition-all duration-500 ${isLoaded ? "opacity-100" : "opacity-0"}`}>
          <div className="container mx-auto min-h-screen flex items-center justify-center px-4 sm:px-[5%] lg:px-[10%]">
            <div className={`flex flex-col lg:flex-row items-center justify-between w-full gap-4 sm:gap-8 lg:gap-16 py-8 sm:py-12 lg:py-0 ${
              isMobile ? 'pt-4' : ''
            }`}>
              
              {/* Left Column - Content */}
              <div 
                className="w-full lg:w-1/2 space-y-4 sm:space-y-6 text-center lg:text-left order-2 lg:order-1 mt-4 sm:mt-8 lg:mt-0"
                data-aos="fade-right"
                data-aos-duration={prefersReducedMotion ? 0 : 800}
                data-aos-delay="100"
              >
                <div className="space-y-3 sm:space-y-4">
                  <StatusBadge />
                  <MainTitle />

                  {/* Typing Effect */}
                  <div className={`flex items-center justify-center lg:justify-start ${
                    isMobile ? 'h-5' : 'h-6 sm:h-7'
                  }`} data-aos="fade-up" data-aos-duration={prefersReducedMotion ? 0 : 800} data-aos-delay="400">
                    <span className={`bg-gradient-to-r from-gray-100 to-gray-300 bg-clip-text text-transparent font-light ${
                      isMobile ? 'text-sm' : 'text-base sm:text-lg md:text-xl'
                    }`}>
                      {typedText}
                    </span>
                    <span className="w-[2px] h-4 sm:h-5 bg-gradient-to-t from-[#6366f1] to-[#a855f7] ml-1 animate-blink"></span>
                  </div>

                  {/* Description */}
                  <p 
                    className={`text-gray-300 max-w-xl leading-relaxed font-light mx-auto lg:mx-0 ${
                      isMobile ? 'text-xs leading-5' : 'text-sm sm:text-base'
                    }`}
                    data-aos="fade-up"
                    data-aos-duration={prefersReducedMotion ? 0 : 800}
                    data-aos-delay="500"
                  >
                    Creating visually compelling, intuitive, and user-centered graphic designs that solve real-world problems.
                  </p>

                  {/* Tech Stack */}
                  <div 
                    className="flex flex-wrap gap-1.5 sm:gap-2 justify-center lg:justify-start" 
                    data-aos="fade-up"
                    data-aos-duration={prefersReducedMotion ? 0 : 800}
                    data-aos-delay="600"
                  >
                    {renderedTechStack}
                  </div>

                  {/* CTA Buttons */}
                  <div 
                    className="flex flex-row gap-2 sm:gap-3 justify-center lg:justify-start" 
                    data-aos="fade-up"
                    data-aos-duration={prefersReducedMotion ? 0 : 800}
                    data-aos-delay="700"
                  >
                    <CTAButton href="#Portofolio" text="Projects" icon={ExternalLink} />
                    <CTAButton href="#Contact" text="Contact" icon={Mail} />
                  </div>

                  {/* Desktop Social Links */}
                  <div 
                    className="hidden sm:flex gap-3 justify-center lg:justify-start" 
                    data-aos="fade-up"
                    data-aos-duration={prefersReducedMotion ? 0 : 800}
                    data-aos-delay="800"
                  >
                    {renderedSocialLinks}
                  </div>

                  {/* Mobile Social Links */}
                  <MobileSocialLinks />
                </div>
              </div>

              {/* Right Column - Lottie Animation */}
              <div 
                className={`w-full lg:w-1/2 ${animationContainerHeight} relative flex items-center justify-center order-1 lg:order-2 performance-optimized ${
                  isMobile ? 'mb-2' : 'mb-4 sm:mb-0'
                }`}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
                data-aos="fade-left"
                data-aos-duration={prefersReducedMotion ? 0 : 800}
                data-aos-delay="200"
              >
                <div className="relative w-full h-full opacity-90">
                  <div className={gradientClasses} />
                  
                  <div className={animationContainerClass}>
                    {/* Lottie Animation with HIDDEN loading states */}
                    <div className="relative w-full h-full">
                      <div className={lottieClassName}>
                        <LottieComponent
                          config={lottieConfig}
                          className="w-full h-full"
                          onLoad={handleLottieLoad}
                          onError={handleLottieError}
                          isMobile={isMobile}
                          isTablet={isTablet}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Background glow - reduced on mobile */}
                  <div className={`absolute inset-0 pointer-events-none transition-all duration-500 ${
                    isHovering && shouldAnimate ? "opacity-40" : "opacity-20"
                  }`}>
                    <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ${
                      isMobile ? 'w-[120px] h-[120px]' :
                      isTablet ? 'w-[200px] h-[200px]' :
                      'w-[280px] h-[280px] lg:w-[320px] lg:h-[320px]'
                    } bg-gradient-to-br from-indigo-500/10 to-purple-500/10 blur-xl sm:blur-2xl ${
                      shouldAnimate ? 'animate-pulse-slow' : ''
                    } transition-all duration-500 ${
                      isHovering && shouldAnimate ? "scale-105" : "scale-100"
                    }`} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CSS animations */}
        <style>{`
          @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-15px) rotate(180deg); }
          }
          @keyframes grid-move {
            0% { transform: translate(0, 0); }
            100% { transform: translate(40px, 40px); }
          }
          @keyframes blink {
            0%, 100% { opacity: 1; }
            50% { opacity: 0; }
          }
          .scale-102 { transform: scale(1.02); }
          .scale-110 { transform: scale(1.1); }
          .scale-125 { transform: scale(1.25); }
          .scale-135 { transform: scale(1.35); }
          .animate-blink {
            animation: blink 1s infinite;
          }
          .animate-pulse-slow {
            animation: pulse 3s ease-in-out infinite;
          }
          .mobile-touch:active {
            transform: scale(0.95);
          }
          .performance-optimized {
            transform: translateZ(0);
            backface-visibility: hidden;
            perspective: 1000px;
          }
          
          @media (prefers-reduced-motion: reduce) {
            .animate-float,
            .animate-blink,
            .animate-pulse-slow,
            .animate-spin,
            .animate-pulse,
            .animate-bounce {
              animation: none !important;
            }
            * {
              animation-duration: 0.01ms !important;
              animation-iteration-count: 1 !important;
              transition-duration: 0.01ms !important;
            }
          }
        `}</style>
      </div>
    </ErrorBoundary>
  );
};

export default memo(Home);