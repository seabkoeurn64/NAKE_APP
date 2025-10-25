import React, { useState, useEffect, useCallback, memo, useMemo } from "react"
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

// Custom hook for media queries
const useMediaQueries = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [breakpoint, setBreakpoint] = useState('mobile');

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const checkBreakpoint = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      
      if (width < 768) setBreakpoint('mobile');
      else if (width < 1024) setBreakpoint('tablet');
      else setBreakpoint('desktop');
    };

    const checkReducedMotion = () => 
      setPrefersReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    
    checkBreakpoint();
    checkReducedMotion();
    
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
    
    const debouncedResize = debounce(checkBreakpoint, 100);
    window.addEventListener('resize', debouncedResize);
    
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    mediaQuery.addEventListener('change', checkReducedMotion);
    
    return () => {
      window.removeEventListener('resize', debouncedResize);
      mediaQuery.removeEventListener('change', checkReducedMotion);
    };
  }, []);

  return { isMobile, prefersReducedMotion, breakpoint };
};

// Custom hook for typing effect
const useTypingEffect = (words, typingSpeed, erasingSpeed, pauseDuration) => {
  const [text, setText] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const [wordIndex, setWordIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);

  const handleTyping = useCallback(() => {
    if (isTyping) {
      if (charIndex < words[wordIndex].length) {
        setText(prev => prev + words[wordIndex][charIndex]);
        setCharIndex(prev => prev + 1);
      } else {
        setTimeout(() => setIsTyping(false), pauseDuration);
      }
    } else {
      if (charIndex > 0) {
        setText(prev => prev.slice(0, -1));
        setCharIndex(prev => prev - 1);
      } else {
        setWordIndex(prev => (prev + 1) % words.length);
        setIsTyping(true);
      }
    }
  }, [charIndex, isTyping, wordIndex, words, pauseDuration]);

  useEffect(() => {
    const timeout = setTimeout(
      handleTyping,
      isTyping ? typingSpeed : erasingSpeed
    );
    return () => clearTimeout(timeout);
  }, [handleTyping, isTyping, typingSpeed, erasingSpeed]);

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

// Mobile Social Links
const MobileSocialLinks = memo(() => (
  <div className="flex sm:hidden gap-2 justify-center" data-aos="fade-up" data-aos-delay="800">
    {SOCIAL_LINKS.map((social, index) => (
      <SocialLink key={`mobile-social-${index}`} {...social} />
    ))}
  </div>
));

// Lottie Component with Error Boundary
const LottieComponent = memo(({ 
  config, 
  className, 
  onLoad, 
  onError 
}) => {
  const [lottieError, setLottieError] = useState(false);

  const handleError = useCallback(() => {
    setLottieError(true);
    onError?.();
  }, [onError]);

  if (lottieError) {
    return (
      <div className="flex items-center justify-center w-full h-full">
        <div className="text-center text-gray-400">
          <Sparkles className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p className="text-sm">Animation unavailable</p>
        </div>
      </div>
    );
  }

  return (
    <DotLottieReact
      {...config}
      className={className}
      onLoad={onLoad}
      onError={handleError}
    />
  );
});

const Home = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [lottieLoaded, setLottieLoaded] = useState(false);
  const [lottieError, setLottieError] = useState(false);
  
  const { isMobile, prefersReducedMotion, breakpoint } = useMediaQueries();
  
  const typedText = useTypingEffect(
    WORDS, 
    ANIMATION_CONFIG.TYPING_SPEED, 
    ANIMATION_CONFIG.ERASING_SPEED, 
    ANIMATION_CONFIG.PAUSE_DURATION
  );
  
  const shouldAnimate = !isMobile && !prefersReducedMotion;

  // Optimized AOS initialization
  useEffect(() => {
    if (prefersReducedMotion) return;

    const initAOS = () => {
      AOS.init({
        once: true,
        offset: isMobile ? 20 : ANIMATION_CONFIG.AOS_OFFSET,
        duration: ANIMATION_CONFIG.AOS_DURATION,
        easing: 'ease-out',
        disable: isMobile ? false : 'mobile',
      });
    };

    const timer = setTimeout(initAOS, 50);
    return () => {
      clearTimeout(timer);
      AOS.refreshHard();
    };
  }, [isMobile, prefersReducedMotion]);

  useEffect(() => {
    setIsLoaded(true);
    return () => setIsLoaded(false);
  }, []);

  // Memoized configurations
  const lottieConfig = useMemo(() => ({
    src: "https://assets-v2.lottiefiles.com/a/a48f1c1e-1181-11ee-8323-1fd18ac98420/CefN62GDJc.lottie",
    autoplay: true,
    loop: true,
  }), []);

  const lottieClassName = useMemo(() => {
    const baseScale = breakpoint === 'mobile' ? "scale-110" : 
                     breakpoint === 'tablet' ? "scale-135" : "scale-125";
    
    const hoverScale = shouldAnimate ? "scale-[130%] sm:scale-[140%] md:scale-[130%] rotate-1" : baseScale;
    
    return `w-full h-full transition-all duration-300 ${
      isHovering ? hoverScale : baseScale
    }`;
  }, [isHovering, breakpoint, shouldAnimate]);

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

  const handleLottieError = useCallback(() => {
    setLottieError(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#030014] via-[#0f0a28] to-[#030014] overflow-hidden relative" id="Home">
      {/* Enhanced background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-[#6366f1] rounded-full blur-3xl opacity-10 animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#a855f7] rounded-full blur-3xl opacity-5 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-56 h-56 bg-[#8b5cf6] rounded-full blur-2xl opacity-5 animate-pulse delay-500"></div>
        
        {/* Animated grid background */}
        <div className="absolute inset-0 opacity-10">
          <div className="w-full h-full" style={{
            backgroundImage: `linear-gradient(#6366f1 1px, transparent 1px), linear-gradient(90deg, #6366f1 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
            animation: shouldAnimate ? 'grid-move 20s linear infinite' : 'none'
          }}></div>
        </div>
      </div>

      <div className={`relative z-10 transition-all duration-500 ${isLoaded ? "opacity-100" : "opacity-0"}`}>
        <div className="container mx-auto min-h-screen flex items-center justify-center px-4 sm:px-[5%] lg:px-[10%]">
          <div className="flex flex-col lg:flex-row items-center justify-between w-full gap-8 sm:gap-8 lg:gap-16 py-12 sm:py-0">
            
            {/* Left Column - Content */}
            <div 
              className="w-full lg:w-1/2 space-y-4 sm:space-y-6 text-center lg:text-left order-2 lg:order-1 mt-8 sm:mt-0"
              data-aos="fade-right"
              data-aos-duration={prefersReducedMotion ? 0 : 800}
              data-aos-delay="100"
            >
              <div className="space-y-3 sm:space-y-4">
                <StatusBadge />
                <MainTitle />

                {/* Typing Effect */}
                <div className="h-6 sm:h-7 flex items-center justify-center lg:justify-start" data-aos="fade-up" data-aos-duration={prefersReducedMotion ? 0 : 800} data-aos-delay="400">
                  <span className="text-base sm:text-lg md:text-xl bg-gradient-to-r from-gray-100 to-gray-300 bg-clip-text text-transparent font-light">
                    {typedText}
                  </span>
                  <span className="w-[2px] h-4 sm:h-5 bg-gradient-to-t from-[#6366f1] to-[#a855f7] ml-1 animate-blink"></span>
                </div>

                {/* Description */}
                <p 
                  className="text-xs sm:text-sm md:text-base text-gray-300 max-w-xl leading-relaxed font-light mx-auto lg:mx-0"
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
                  <CTAButton href="#Portfolio" text="Projects" icon={ExternalLink} />
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
              className="w-full lg:w-1/2 h-[220px] sm:h-[350px] lg:h-[450px] xl:h-[500px] relative flex items-center justify-center order-1 lg:order-2 performance-optimized mb-4 sm:mb-0"
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
                  {/* Lottie Animation with Loading State */}
                  <div className="relative w-full h-full">
                    {!lottieLoaded && !lottieError && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                      </div>
                    )}
                    <div className={lottieClassName}>
                      <LottieComponent
                        config={lottieConfig}
                        className="w-full h-full"
                        onLoad={() => setLottieLoaded(true)}
                        onError={handleLottieError}
                      />
                    </div>
                  </div>
                </div>

                {/* Background glow */}
                <div className={`absolute inset-0 pointer-events-none transition-all duration-500 ${
                  isHovering && shouldAnimate ? "opacity-40" : "opacity-20"
                }`}>
                  <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[180px] h-[180px] sm:w-[280px] sm:h-[280px] lg:w-[320px] lg:h-[320px] bg-gradient-to-br from-indigo-500/10 to-purple-500/10 blur-xl sm:blur-2xl ${
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

      {/* Add CSS animations */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-15px) rotate(180deg); }
          }
          @keyframes gradient-x {
            0%, 100% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
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
        `
      }} />
    </div>
  );
};

export default memo(Home);