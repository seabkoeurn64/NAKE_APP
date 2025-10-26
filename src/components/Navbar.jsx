import React, { useState, useEffect, useCallback, memo, useMemo } from "react";
import { Menu, X } from "lucide-react";

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [activeSection, setActiveSection] = useState("Home");
    const [isMobile, setIsMobile] = useState(false);
    
    // Memoized nav items to prevent unnecessary re-renders
    const navItems = useMemo(() => [
        { href: "#Home", label: "Home" },
        { href: "#About", label: "About" },
        { href: "#Portofolio", label: "Portofolio" },
        { href: "#Contact", label: "Contact" },
    ], []);

    // Debounced mobile detection
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        
        checkMobile();
        
        const debouncedResize = debounce(checkMobile, 100);
        window.addEventListener('resize', debouncedResize);
        
        return () => window.removeEventListener('resize', debouncedResize);
    }, []);

    // FIXED: Enhanced scroll handling with proper section detection
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
            
            // Simple scroll-based section detection (more reliable)
            const scrollPosition = window.scrollY + 100;
            
            // Get all sections
            const sections = navItems.map(item => ({
                id: item.href.substring(1),
                element: document.getElementById(item.href.substring(1)),
                href: item.href
            })).filter(section => section.element);
            
            // Find current active section
            let currentActive = "Home";
            
            for (const section of sections) {
                const element = section.element;
                if (element) {
                    const offsetTop = element.offsetTop;
                    const offsetHeight = element.offsetHeight;
                    
                    if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
                        currentActive = section.id;
                        break;
                    }
                }
            }
            
            // Fallback: Find the section closest to the viewport
            if (currentActive === "Home") {
                let closestSection = "Home";
                let closestDistance = Infinity;
                
                for (const section of sections) {
                    const element = section.element;
                    if (element) {
                        const rect = element.getBoundingClientRect();
                        const distance = Math.abs(rect.top);
                        
                        if (distance < closestDistance) {
                            closestDistance = distance;
                            closestSection = section.id;
                        }
                    }
                }
                setActiveSection(closestSection);
            } else {
                setActiveSection(currentActive);
            }
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        handleScroll(); // Initial check
        
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, [navItems]);

    // Handle body overflow when menu is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            document.body.style.touchAction = 'none';
        } else {
            document.body.style.overflow = 'unset';
            document.body.style.touchAction = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
            document.body.style.touchAction = 'unset';
        };
    }, [isOpen]);

    // Enhanced scroll to section with offset calculation
    const scrollToSection = useCallback((e, href) => {
        e.preventDefault();
        const sectionId = href.substring(1);
        const section = document.getElementById(sectionId);
        
        if (section) {
            const headerHeight = isMobile ? 70 : 80;
            const sectionTop = section.offsetTop;
            const offsetPosition = sectionTop - headerHeight;

            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth"
            });
            
            // Update active section immediately
            setActiveSection(sectionId);
        }
        setIsOpen(false);
    }, [isMobile]);

    // Toggle mobile menu with animation
    const toggleMenu = useCallback(() => {
        setIsOpen(prev => !prev);
    }, []);

    // Close menu on escape key and outside click
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape' && isOpen) {
                setIsOpen(false);
            }
        };

        const handleClickOutside = (e) => {
            if (isOpen && !e.target.closest('nav') && !e.target.closest('button[aria-expanded]')) {
                setIsOpen(false);
            }
        };

        document.addEventListener('keydown', handleEscape);
        document.addEventListener('click', handleClickOutside);
        
        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.removeEventListener('click', handleClickOutside);
        };
    }, [isOpen]);

    // Memoized Desktop NavItem component
    const DesktopNavItem = memo(({ item, isActive }) => (
        <a
            href={item.href}
            onClick={(e) => scrollToSection(e, item.href)}
            className="group relative px-1 py-2 text-sm font-medium touch-manipulation transition-all duration-300 active:scale-95"
            aria-current={isActive ? "page" : undefined}
        >
            <span
                className={`relative z-10 transition-all duration-300 ${
                    isActive
                        ? "bg-gradient-to-r from-[#6366f1] to-[#a855f7] bg-clip-text text-transparent font-semibold"
                        : "text-[#e2d3fd] group-hover:text-white group-hover:scale-105"
                }`}
            >
                {item.label}
            </span>
            <span
                className={`absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-[#6366f1] to-[#a855f7] transform origin-left transition-all duration-300 ${
                    isActive
                        ? "scale-x-100 opacity-100"
                        : "scale-x-0 opacity-0 group-hover:scale-x-100 group-hover:opacity-100"
                }`}
            />
        </a>
    ));

    // Memoized Mobile NavItem component
    const MobileNavItem = memo(({ item, isActive, index, isOpen }) => (
        <a
            href={item.href}
            onClick={(e) => scrollToSection(e, item.href)}
            className={`block px-4 py-3 text-base font-medium transition-all duration-300 ease-out touch-manipulation active:scale-95 border-l-2 ${
                isActive
                    ? "bg-gradient-to-r from-[#6366f1] to-[#a855f7] bg-clip-text text-transparent font-semibold border-[#6366f1]"
                    : "text-[#e2d3fd] hover:text-white border-transparent hover:border-[#6366f1]/50"
            }`}
            style={{
                transitionDelay: isOpen ? `${index * 80}ms` : '0ms',
                transform: isOpen ? "translateX(0)" : "translateX(-20px)",
                opacity: isOpen ? 1 : 0,
            }}
            aria-current={isActive ? "page" : undefined}
        >
            {item.label}
        </a>
    ));

    // Debounce helper function
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

    return (
        <nav
            className={`fixed w-full top-0 z-50 transition-all duration-500 ${
                isOpen
                    ? "bg-[#030014] backdrop-blur-xl shadow-2xl"
                    : scrolled
                    ? "bg-[#030014]/90 backdrop-blur-xl shadow-lg"
                    : "bg-transparent"
            }`}
            role="navigation"
            aria-label="Main navigation"
        >
            <div className="mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <div className="flex-shrink-0">
                        <a
                            href="#Home"
                            onClick={(e) => scrollToSection(e, "#Home")}
                            className="text-xl font-bold bg-gradient-to-r from-[#a855f7] to-[#6366f1] bg-clip-text text-transparent touch-manipulation transition-all duration-300 hover:scale-105 active:scale-95"
                            aria-label="Go to homepage"
                        >
                            Portfolio
                        </a>
                    </div>
        
                    {/* Desktop Navigation */}
                    <div className="hidden md:block">
                        <div className="ml-8 flex items-center space-x-6 lg:space-x-8" role="menubar">
                            {navItems.map((item) => (
                                <DesktopNavItem 
                                    key={item.label} 
                                    item={item} 
                                    isActive={activeSection === item.href.substring(1)} 
                                />
                            ))}
                        </div>
                    </div>
        
                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <button
                            onClick={toggleMenu}
                            className={`relative p-2 rounded-lg text-[#e2d3fd] hover:text-white transition-all duration-300 ease-in-out touch-manipulation active:scale-95 ${
                                isOpen 
                                    ? "bg-[#6366f1]/10 rotate-90 scale-110" 
                                    : "bg-transparent rotate-0 scale-100 hover:bg-white/5"
                            }`}
                            aria-label={isOpen ? "Close menu" : "Open menu"}
                            aria-expanded={isOpen}
                            aria-controls="mobile-menu"
                        >
                            {isOpen ? (
                                <X className="w-5 h-5 transition-transform duration-300" />
                            ) : (
                                <Menu className="w-5 h-5 transition-transform duration-300" />
                            )}
                        </button>
                    </div>
                </div>
            </div>
        
            {/* Mobile Menu Overlay */}
            {isOpen && (
                <div 
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
                    onClick={() => setIsOpen(false)}
                    aria-hidden="true"
                />
            )}
        
            {/* Mobile Menu */}
            <div
                id="mobile-menu"
                className={`md:hidden fixed top-16 left-0 right-0 bg-[#030014]/95 backdrop-blur-xl border-t border-white/10 shadow-2xl transition-all duration-300 ease-out z-50 ${
                    isOpen
                        ? "max-h-screen opacity-100 translate-y-0"
                        : "max-h-0 opacity-0 -translate-y-4 pointer-events-none"
                }`}
                role="menu"
                aria-hidden={!isOpen}
            >
                <div className="px-2 py-3 space-y-1">
                    {navItems.map((item, index) => (
                        <MobileNavItem 
                            key={item.label} 
                            item={item} 
                            isActive={activeSection === item.href.substring(1)}
                            index={index}
                            isOpen={isOpen}
                        />
                    ))}
                </div>
            </div>
        </nav>
    );
};

export default memo(Navbar);