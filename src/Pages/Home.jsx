import React, { useState, useEffect, useCallback, memo, useMemo } from "react"
import { Github, Linkedin, Mail, ExternalLink, Instagram, Sparkles } from "lucide-react"
import { DotLottieReact } from '@lottiefiles/dotlottie-react'
import AOS from 'aos'
import 'aos/dist/aos.css'

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
          UI/UX
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
  <div className="px-2 py-1 sm:px-3 sm:py-1.5 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 text-xs text-gray-300 hover:bg-white/10 transition-colors mobile-touch">
    {tech}
  </div>
));

const CTAButton = memo(({ href, text, icon: Icon }) => (
  <a href={href} className="block">
    <button className="group relative w-[120px] sm:w-[140px] mobile-touch">
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

const SocialLink = memo(({ icon: Icon, link }) => (
  <a href={link} target="_blank" rel="noopener noreferrer" className="block">
    <button className="group relative p-1.5 sm:p-2 mobile-touch">
      <div className="absolute inset-0 bg-gradient-to-r from-[#6366f1] to-[#a855f7] rounded-lg sm:rounded-xl blur opacity-15 group-hover:opacity-25 transition duration-200"></div>
      <div className="relative rounded-lg sm:rounded-xl bg-black/50 backdrop-blur-xl p-1.5 flex items-center justify-center border border-white/10 group-hover:border-white/20 transition-all duration-200">
        <Icon className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 group-hover:text-white transition-colors" />
      </div>
    </button>
  </a>
));

// Mobile Social Links (Horizontal)
const MobileSocialLinks = memo(() => (
  <div className="flex sm:hidden gap-2 justify-center" data-aos="fade-up" data-aos-delay="800">
    {SOCIAL_LINKS.map((social, index) => (
      <SocialLink key={`mobile-social-${index}`} {...social} />
    ))}
  </div>
));

// Constants
const TYPING_SPEED = 80;
const ERASING_SPEED = 40;
const PAUSE_DURATION = 1500;
const WORDS = ["UI/UX Designer", "Product Designer", "Creative Thinker"];
const TECH_STACK = ["Figma", "Adobe XD", "Photoshop", "Illustrator"];
const SOCIAL_LINKS = [
  { icon: Github, link: "https://github.com/seabkoeurn" },
  { icon: Linkedin, link: "https://www.linkedin.com/in/koeurn64" },
  { icon: Instagram, link: "https://www.instagram.com/koeurn.64._/?hl=id" }
];

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

const Home = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const typedText = useTypingEffect(WORDS, TYPING_SPEED, ERASING_SPEED, PAUSE_DURATION);

  // Check mobile device - optimized
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    
    let resizeTimeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(checkMobile, 100);
    };
    
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimeout);
    };
  }, []);

  // Optimized AOS initialization
  useEffect(() => {
    let aosInitialized = false;

    const initAOS = () => {
      if (!aosInitialized) {
        AOS.init({
          once: true,
          offset: 50,
          duration: 600,
          easing: 'ease-out',
          disable: isMobile ? false : 'mobile',
          startEvent: 'DOMContentLoaded',
          throttleDelay: 99,
        });
        aosInitialized = true;
      }
    };

    const timer = setTimeout(initAOS, 50);
    
    return () => {
      clearTimeout(timer);
    };
  }, [isMobile]);

  useEffect(() => {
    setIsLoaded(true);
    return () => setIsLoaded(false);
  }, []);

  // FIXED: Better Lottie configuration for mobile to prevent overlap
  const lottieOptions = useMemo(() => ({
    src: "https://assets-v2.lottiefiles.com/a/a48f1c1e-1181-11ee-8323-1fd18ac98420/CefN62GDJc.lottie",
    autoplay: true,
    loop: true,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
      progressiveLoad: true,
    },
    style: { 
      width: "100%", 
      height: "100%",
      transition: "all 0.3s ease-in-out"
    },
    // FIXED: Reduced scaling on mobile to prevent overlap
    className: `w-full h-full transition-all duration-300 ${
      isHovering && !isMobile
        ? "scale-[130%] sm:scale-[140%] md:scale-[130%] rotate-1" 
        : "scale-[120%] sm:scale-[135%] md:scale-[125%]"
    }`
  }), [isHovering, isMobile]);

  // Memoized gradient background classes
  const gradientClasses = useMemo(() => 
    `absolute inset-0 bg-gradient-to-r from-[#6366f1]/10 to-[#a855f7]/10 rounded-2xl sm:rounded-3xl blur-xl sm:blur-2xl transition-all duration-500 ease-in-out ${
      isHovering && !isMobile ? "opacity-40 scale-102" : "opacity-20 scale-100"
    }`,
    [isHovering, isMobile]
  );

  // Memoized social links render
  const renderedSocialLinks = useMemo(() => 
    SOCIAL_LINKS.map((social, index) => (
      <SocialLink key={`social-${index}`} {...social} />
    )),
    []
  );

  // Memoized tech stack render
  const renderedTechStack = useMemo(() => 
    TECH_STACK.map((tech, index) => (
      <TechStack key={`tech-${index}`} tech={tech} />
    )),
    []
  );

  // Throttled hover handlers for mobile
  const handleMouseEnter = useCallback(() => {
    if (!isMobile) setIsHovering(true);
  }, [isMobile]);

  const handleMouseLeave = useCallback(() => {
    if (!isMobile) setIsHovering(false);
  }, [isMobile]);

  return (
    <div className="min-h-screen bg-[#030014] overflow-hidden px-4 sm:px-[5%] lg:px-[10%]" id="Home">
      <div className={`relative z-10 transition-all duration-500 ${isLoaded ? "opacity-100" : "opacity-0"}`}>
        <div className="container mx-auto min-h-screen flex items-center justify-center">
          {/* FIXED: Added more vertical spacing on mobile and adjusted gap */}
          <div className="flex flex-col lg:flex-row items-center justify-between w-full gap-8 sm:gap-8 lg:gap-16 py-12 sm:py-0">
            
            {/* Left Column - Content */}
            {/* FIXED: Added margin-top on mobile to prevent overlap */}
            <div 
              className="w-full lg:w-1/2 space-y-4 sm:space-y-6 text-center lg:text-left order-2 lg:order-1 mt-8 sm:mt-0"
              data-aos="fade-right"
              data-aos-delay="100"
            >
              <div className="space-y-3 sm:space-y-4">
                <StatusBadge />
                <MainTitle />

                {/* Typing Effect */}
                <div className="h-6 sm:h-7 flex items-center justify-center lg:justify-start" data-aos="fade-up" data-aos-delay="400">
                  <span className="text-base sm:text-lg md:text-xl bg-gradient-to-r from-gray-100 to-gray-300 bg-clip-text text-transparent font-light">
                    {typedText}
                  </span>
                  <span className="w-[2px] h-4 sm:h-5 bg-gradient-to-t from-[#6366f1] to-[#a855f7] ml-1 animate-blink"></span>
                </div>

                {/* Description */}
                <p 
                  className="text-xs sm:text-sm md:text-base text-gray-400 max-w-xl leading-relaxed font-light mx-auto lg:mx-0"
                  data-aos="fade-up"
                  data-aos-delay="500"
                >
                  Creating beautiful, intuitive, and user-centered digital experiences that solve real problems.
                </p>

                {/* Tech Stack */}
                <div 
                  className="flex flex-wrap gap-1.5 sm:gap-2 justify-center lg:justify-start" 
                  data-aos="fade-up" 
                  data-aos-delay="600"
                >
                  {renderedTechStack}
                </div>

                {/* CTA Buttons */}
                <div 
                  className="flex flex-row gap-2 sm:gap-3 justify-center lg:justify-start" 
                  data-aos="fade-up" 
                  data-aos-delay="700"
                >
                  <CTAButton href="#Portofolio" text="Projects" icon={ExternalLink} />
                  <CTAButton href="#Contact" text="Contact" icon={Mail} />
                </div>

                {/* Desktop Social Links */}
                <div 
                  className="hidden sm:flex gap-3 justify-center lg:justify-start" 
                  data-aos="fade-up" 
                  data-aos-delay="800"
                >
                  {renderedSocialLinks}
                </div>

                {/* Mobile Social Links */}
                <MobileSocialLinks />
              </div>
            </div>

            {/* Right Column - Lottie Animation */}
            {/* FIXED: Reduced height and added margin on mobile */}
            <div 
              className="w-full lg:w-1/2 h-[220px] sm:h-[350px] lg:h-[450px] xl:h-[500px] relative flex items-center justify-center order-1 lg:order-2 performance-optimized mb-4 sm:mb-0"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              data-aos="fade-left"
              data-aos-delay="200"
            >
              <div className="relative w-full h-full opacity-90">
                <div className={gradientClasses} />
                
                {/* FIXED: Reduced left positioning on all screens */}
                <div className={`relative lg:left-4 xl:left-6 z-10 w-full h-full opacity-90 transform transition-transform duration-300 ${
                  isHovering && !isMobile ? "scale-102" : "scale-100"
                }`}>
                  <DotLottieReact {...lottieOptions} />
                </div>

                <div className={`absolute inset-0 pointer-events-none transition-all duration-500 ${
                  isHovering && !isMobile ? "opacity-40" : "opacity-20"
                }`}>
                  {/* FIXED: Reduced background glow size for mobile */}
                  <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[180px] h-[180px] sm:w-[280px] sm:h-[280px] lg:w-[320px] lg:h-[320px] bg-gradient-to-br from-indigo-500/10 to-purple-500/10 blur-xl sm:blur-2xl animate-[pulse_4s_cubic-bezier(0.4,0,0.6,1)_infinite] transition-all duration-500 ${
                    isHovering && !isMobile ? "scale-105" : "scale-100"
                  }`} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(Home);