// ENHANCED Navbar.jsx - WITH NEW BACKGROUND DESIGN
import React, { useState, useEffect, useCallback, memo, useMemo, useRef } from "react";
import { Menu, X } from "lucide-react";

// ✅ Custom hook for scroll detection
const useScrollDetection = (threshold = 20) => {
  const [scrolled, setScrolled] = useState(false);
  const scrollTimeoutRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (scrollTimeoutRef.current) return;
      
      scrollTimeoutRef.current = setTimeout(() => {
        setScrolled(window.scrollY > threshold);
        scrollTimeoutRef.current = null;
      }, 10);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Initial check
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [threshold]);

  return scrolled;
};

// ✅ Custom hook for intersection observer
const useIntersectionObserver = (navItems, setActiveSection) => {
  const observerRef = useRef(null);

  useEffect(() => {
    const setupIntersectionObserver = () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }

      const options = {
        root: null,
        rootMargin: '-20% 0px -70% 0px',
        threshold: 0.1
      };

      observerRef.current = new IntersectionObserver((entries) => {
        let mostVisibleSection = null;
        let highestRatio = 0;

        entries.forEach(entry => {
          if (entry.isIntersecting && entry.intersectionRatio > highestRatio) {
            highestRatio = entry.intersectionRatio;
            mostVisibleSection = entry.target.id;
          }
        });

        if (mostVisibleSection) {
          setActiveSection(mostVisibleSection);
        }
      }, options);

      // Observe all sections with case-insensitive matching
      navItems.forEach(item => {
        const sectionId = item.href.substring(1);
        let section = document.getElementById(sectionId);
        
        // If not found, try lowercase
        if (!section) {
          section = document.getElementById(sectionId.toLowerCase());
        }
        
        // If still not found, try to find by data attribute
        if (!section) {
          section = document.querySelector(`[data-section="${sectionId}"]`);
        }
        
        if (section) {
          observerRef.current.observe(section);
        }
      });
    };

    // Small delay to ensure sections are rendered
    const timeoutId = setTimeout(setupIntersectionObserver, 100);
    
    return () => {
      clearTimeout(timeoutId);
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [navItems, setActiveSection]);
};

// ✅ Custom hook for mobile detection
const useMobileDetection = () => {
  const [isMobile, setIsMobile] = useState(false);

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

  return isMobile;
};

// ✅ NEW: Navbar Background Component
const NavbarBackground = memo(({ scrolled, isOpen }) => {
  return (
    <div className="absolute inset-0 overflow-hidden -z-10">
      {/* Main gradient background */}
      <div className={`absolute inset-0 transition-all duration-500 ${
        scrolled || isOpen 
          ? "bg-[#030014]/95 backdrop-blur-xl" 
          : "bg-transparent backdrop-blur-none"
      }`} />
      
      {/* Animated gradient overlay */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          background: 'linear-gradient(45deg, #6366f1, #8b5cf6, #a855f7, #ec4899)',
          backgroundSize: '400% 400%',
          animation: 'navbarGradient 8s ease infinite'
        }}
      />
      
      {/* Floating navigation elements */}
      <div className="absolute top-0 left-10 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl" 
           style={{ animation: 'navbarFloat 6s ease-in-out infinite' }} />
      <div className="absolute top-0 right-20 w-24 h-24 bg-pink-500/10 rounded-full blur-xl" 
           style={{ animation: 'navbarFloat 8s ease-in-out infinite 1s' }} />
      
      {/* Navigation line elements */}
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-500/20 to-transparent" />
      
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-5">
        <div 
          className="w-full h-full"
          style={{
            backgroundImage: 'linear-gradient(#6366f1 1px, transparent 1px), linear-gradient(90deg, #6366f1 1px, transparent 1px)',
            backgroundSize: '30px 30px',
            animation: 'navbarGridMove 20s linear infinite'
          }}
        />
      </div>
      
      {/* Sparkle effects */}
      <div className="absolute top-2 left-1/4 w-1 h-1 bg-white rounded-full opacity-60" 
           style={{ animation: 'navbarSparkle 3s ease-in-out infinite' }} />
      <div className="absolute top-3 right-1/3 w-0.5 h-0.5 bg-purple-300 rounded-full opacity-70" 
           style={{ animation: 'navbarSparkle 4s ease-in-out infinite 0.7s' }} />
    </div>
  );
});

NavbarBackground.displayName = 'NavbarBackground';

// ✅ Optimized Desktop NavItem Component
const DesktopNavItem = memo(({ item, activeSection, scrollToSection }) => {
  const sectionId = item.href.substring(1);
  const isActuallyActive = activeSection.toLowerCase() === sectionId.toLowerCase();
  
  const handleClick = useCallback((e) => {
    scrollToSection(e, item.href);
  }, [scrollToSection, item.href]);

  return (
    <a
      href={item.href}
      onClick={handleClick}
      className="group relative px-1 py-2 text-sm font-medium transition-all duration-300 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900 rounded-lg transform-gpu will-change-transform"
      aria-current={isActuallyActive ? "page" : undefined}
    >
      <span
        className={`relative z-10 transition-all duration-300 ${
          isActuallyActive
            ? "bg-gradient-to-r from-[#6366f1] to-[#a855f7] bg-clip-text text-transparent font-semibold"
            : "text-[#e2d3fd] group-hover:text-white group-hover:scale-105"
        }`}
      >
        {item.label}
      </span>
      <span
        className={`absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-[#6366f1] to-[#a855f7] transform origin-left transition-all duration-300 ${
          isActuallyActive
            ? "scale-x-100 opacity-100"
            : "scale-x-0 opacity-0 group-hover:scale-x-100 group-hover:opacity-100"
        }`}
      />
    </a>
  );
});

DesktopNavItem.displayName = 'DesktopNavItem';

// ✅ Optimized Mobile NavItem Component
const MobileNavItem = memo(({ item, activeSection, index, isOpen, scrollToSection }) => {
  const sectionId = item.href.substring(1);
  const isActuallyActive = activeSection.toLowerCase() === sectionId.toLowerCase();
  
  const handleClick = useCallback((e) => {
    scrollToSection(e, item.href);
  }, [scrollToSection, item.href]);

  return (
    <a
      href={item.href}
      onClick={handleClick}
      className={`block px-4 py-3 text-base font-medium transition-all duration-300 ease-out active:scale-95 border-l-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset rounded-r-lg transform-gpu will-change-transform ${
        isActuallyActive
          ? "bg-gradient-to-r from-[#6366f1]/10 to-[#a855f7]/10 text-white font-semibold border-[#6366f1]"
          : "text-[#e2d3fd] hover:text-white hover:bg-white/5 border-transparent"
      }`}
      style={{
        transitionDelay: isOpen ? `${index * 80}ms` : '0ms',
        transform: isOpen ? "translateX(0)" : "translateX(-20px)",
        opacity: isOpen ? 1 : 0,
      }}
      aria-current={isActuallyActive ? "page" : undefined}
      tabIndex={isOpen ? 0 : -1}
    >
      {item.label}
    </a>
  );
});

MobileNavItem.displayName = 'MobileNavItem';

// ✅ Main Navbar Component
const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [activeSection, setActiveSection] = useState("Home");
    
    // ✅ Custom hooks for optimized state management
    const scrolled = useScrollDetection(20);
    const isMobile = useMobileDetection();
    
    // ✅ Fixed nav items with original case
    const navItems = useMemo(() => [
        { href: "#Home", label: "Home" },
        { href: "#About", label: "About" },
        { href: "#Portfolio", label: "Portfolio" },
        { href: "#Contact", label: "Contact" },
    ], []);

    // ✅ Setup intersection observer
    useIntersectionObserver(navItems, setActiveSection);

    // ✅ Enhanced scroll to section with case-insensitive finding
    const scrollToSection = useCallback((e, href) => {
        e.preventDefault();
        const targetId = href.substring(1);
        
        // ✅ Try multiple ways to find the section
        let section = document.getElementById(targetId);
        
        // If not found, try lowercase
        if (!section) {
            section = document.getElementById(targetId.toLowerCase());
        }
        
        // If still not found, try by data attribute
        if (!section) {
            section = document.querySelector(`[data-section="${targetId}"]`);
        }
        
        // Last resort: try to find any element with similar ID
        if (!section) {
            const elements = document.querySelectorAll('[id]');
            for (let element of elements) {
                if (element.id.toLowerCase() === targetId.toLowerCase()) {
                    section = element;
                    break;
                }
            }
        }
        
        if (section) {
            const headerHeight = isMobile ? 70 : 80;
            const sectionTop = section.offsetTop;
            const offsetPosition = Math.max(0, sectionTop - headerHeight);

            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth"
            });
            
            // Update active section with the actual ID found
            setActiveSection(section.id);
        }
        
        setIsOpen(false);
    }, [isMobile]);

    // ✅ Enhanced body overflow management
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            document.body.style.touchAction = 'none';
            document.body.style.paddingRight = '0px'; // Prevent layout shift
        } else {
            document.body.style.overflow = '';
            document.body.style.touchAction = '';
            document.body.style.paddingRight = '';
        }

        return () => {
            document.body.style.overflow = '';
            document.body.style.touchAction = '';
            document.body.style.paddingRight = '';
        };
    }, [isOpen]);

    // ✅ Enhanced menu toggle with animation frame
    const toggleMenu = useCallback(() => {
        requestAnimationFrame(() => {
            setIsOpen(prev => !prev);
        });
    }, []);

    // ✅ Enhanced event listeners with passive events
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape' && isOpen) {
                setIsOpen(false);
            }
        };

        const handleClickOutside = (e) => {
            if (isOpen && 
                !e.target.closest('nav') && 
                !e.target.closest('button[aria-expanded]') &&
                !e.target.closest('#mobile-menu')) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.addEventListener('click', handleClickOutside, { passive: true });
        }
        
        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.removeEventListener('click', handleClickOutside);
        };
    }, [isOpen]);

    // ✅ Memoized desktop navigation
    const desktopNavigation = useMemo(() => (
        <div className="hidden md:block">
            <div className="ml-8 flex items-center space-x-6 lg:space-x-8" role="menubar">
                {navItems.map((item) => (
                    <DesktopNavItem 
                        key={item.label} 
                        item={item} 
                        activeSection={activeSection}
                        scrollToSection={scrollToSection}
                    />
                ))}
            </div>
        </div>
    ), [navItems, activeSection, scrollToSection]);

    // ✅ Memoized mobile navigation
    const mobileNavigation = useMemo(() => (
        <>
            {/* Mobile Menu Overlay */}
            {isOpen && (
                <div 
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300"
                    onClick={() => setIsOpen(false)}
                    aria-hidden="true"
                />
            )}
            
            {/* Enhanced Mobile Menu */}
            <div
                id="mobile-menu"
                className={`md:hidden fixed top-16 left-0 right-0 bg-[#030014]/95 backdrop-blur-xl border-t border-white/10 shadow-2xl transition-all duration-300 ease-in-out z-50 overflow-hidden transform-gpu ${
                    isOpen
                        ? "max-h-[80vh] opacity-100 translate-y-0"
                        : "max-h-0 opacity-0 -translate-y-4 pointer-events-none"
                }`}
                role="menu"
                aria-hidden={!isOpen}
            >
                {/* Mobile Menu Background */}
                <div className="absolute inset-0 overflow-hidden -z-10">
                  <div className="absolute inset-0 bg-[#030014]/95 backdrop-blur-xl" />
                  <div 
                    className="absolute inset-0 opacity-10"
                    style={{
                      background: 'linear-gradient(45deg, #6366f1, #8b5cf6, #a855f7, #ec4899)',
                      backgroundSize: '400% 400%',
                    }}
                  />
                </div>
                
                <div className="px-2 py-3 space-y-1 relative z-10">
                    {navItems.map((item, index) => (
                        <MobileNavItem 
                            key={item.label} 
                            item={item} 
                            activeSection={activeSection}
                            index={index}
                            isOpen={isOpen}
                            scrollToSection={scrollToSection}
                        />
                    ))}
                </div>
            </div>
        </>
    ), [isOpen, navItems, activeSection, scrollToSection]);

    return (
        <nav
            className={`fixed w-full top-0 z-50 transition-all duration-500 transform-gpu will-change-transform ${
                isOpen
                    ? "bg-[#030014] backdrop-blur-xl shadow-2xl"
                    : scrolled
                    ? "bg-[#030014]/90 backdrop-blur-xl shadow-lg"
                    : "bg-transparent"
            }`}
            role="navigation"
            aria-label="Main navigation"
        >
            {/* ✅ NEW: Enhanced Navbar Background */}
            <NavbarBackground scrolled={scrolled} isOpen={isOpen} />
            
            <div className="mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <div className="flex-shrink-0">
                        <a
                            href="#Home"
                            onClick={(e) => scrollToSection(e, "#Home")}
                            className="group relative text-xl font-bold transition-all duration-300 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900 rounded-lg px-2 py-1 transform-gpu will-change-transform"
                            aria-label="Go to homepage"
                        >
                            {/* Logo background effect */}
                            <div className="absolute -inset-2 bg-gradient-to-r from-[#6366f1] to-[#a855f7] rounded-lg blur opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
                            <span className="relative bg-gradient-to-r from-[#a855f7] to-[#6366f1] bg-clip-text text-transparent">
                                Portfolio
                            </span>
                        </a>
                    </div>
        
                    {/* Desktop Navigation */}
                    {desktopNavigation}
        
                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <button
                            onClick={toggleMenu}
                            className={`group relative p-2 rounded-lg transition-all duration-300 ease-in-out active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900 transform-gpu will-change-transform ${
                                isOpen 
                                    ? "bg-[#6366f1]/10 rotate-90 scale-110 text-white" 
                                    : "bg-transparent rotate-0 scale-100 text-[#e2d3fd] hover:text-white hover:bg-white/5"
                            }`}
                            aria-label={isOpen ? "Close menu" : "Open menu"}
                            aria-expanded={isOpen}
                            aria-controls="mobile-menu"
                        >
                            {/* Button background effect */}
                            <div className="absolute -inset-1 bg-gradient-to-r from-[#6366f1] to-[#a855f7] rounded-lg blur opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
                            
                            {isOpen ? (
                                <X className="w-5 h-5 transition-transform duration-300 relative z-10" />
                            ) : (
                                <Menu className="w-5 h-5 transition-transform duration-300 relative z-10" />
                            )}
                        </button>
                    </div>
                </div>
            </div>
        
            {/* Mobile Navigation */}
            {mobileNavigation}

            {/* ✅ NEW: CSS Animations */}
            <style>{`
                @keyframes navbarGradient {
                    0%, 100% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                }
                
                @keyframes navbarFloat {
                    0%, 100% { transform: translateY(0px) rotate(0deg) scale(1); opacity: 0.3; }
                    33% { transform: translateY(-10px) rotate(120deg) scale(1.05); opacity: 0.5; }
                    66% { transform: translateY(5px) rotate(240deg) scale(0.95); opacity: 0.4; }
                }
                
                @keyframes navbarGridMove {
                    0% { transform: translate(0, 0); }
                    100% { transform: translate(30px, 30px); }
                }
                
                @keyframes navbarSparkle {
                    0%, 100% { opacity: 0; transform: scale(0) rotate(0deg); }
                    50% { opacity: 1; transform: scale(1) rotate(180deg); }
                }

                /* Reduced motion support */
                @media (prefers-reduced-motion: reduce) {
                    .navbar-float-slow,
                    .navbar-gradient-slow,
                    .navbar-grid-move,
                    .navbar-sparkle {
                        animation: none !important;
                    }
                }
            `}</style>
        </nav>
    );
};

export default memo(Navbar);