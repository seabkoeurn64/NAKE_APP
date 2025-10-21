import React, { useState, useEffect, useCallback, memo } from "react";
import { Menu, X } from "lucide-react";

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [activeSection, setActiveSection] = useState("Home");
    const [isMobile, setIsMobile] = useState(false);
    
    const navItems = [
        { href: "#Home", label: "Home" },
        { href: "#About", label: "About" },
        { href: "#Portofolio", label: "Portofolio" },
        { href: "#Contact", label: "Contact" },
    ];

    // Check mobile device
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        
        checkMobile();
        window.addEventListener('resize', checkMobile);
        
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
            
            const sections = navItems.map(item => {
                const section = document.querySelector(item.href);
                if (section) {
                    return {
                        id: item.href.replace("#", ""),
                        offset: section.offsetTop - (isMobile ? 400 : 550),
                        height: section.offsetHeight
                    };
                }
                return null;
            }).filter(Boolean);

            const currentPosition = window.scrollY;
            const active = sections.find(section => 
                currentPosition >= section.offset && 
                currentPosition < section.offset + section.height
            );

            if (active) {
                setActiveSection(active.id);
            }
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        handleScroll();
        
        return () => window.removeEventListener("scroll", handleScroll);
    }, [isMobile]);

    // Handle body overflow when menu is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    // Scroll to section with callback
    const scrollToSection = useCallback((e, href) => {
        e.preventDefault();
        const section = document.querySelector(href);
        if (section) {
            const top = section.offsetTop - (isMobile ? 80 : 100);
            window.scrollTo({
                top: top,
                behavior: "smooth"
            });
        }
        setIsOpen(false);
    }, [isMobile]);

    // Toggle mobile menu
    const toggleMenu = useCallback(() => {
        setIsOpen(prev => !prev);
    }, []);

    // Close menu on escape key
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape' && isOpen) {
                setIsOpen(false);
            }
        };

        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen]);

    // Memoized NavItem component for desktop
    const DesktopNavItem = memo(({ item, isActive }) => (
        <a
            href={item.href}
            onClick={(e) => scrollToSection(e, item.href)}
            className="group relative px-1 py-2 text-sm font-medium touch-manipulation"
        >
            <span
                className={`relative z-10 transition-colors duration-300 ${
                    isActive
                        ? "bg-gradient-to-r from-[#6366f1] to-[#a855f7] bg-clip-text text-transparent font-semibold"
                        : "text-[#e2d3fd] group-hover:text-white"
                }`}
            >
                {item.label}
            </span>
            <span
                className={`absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-[#6366f1] to-[#a855f7] transform origin-left transition-transform duration-300 ${
                    isActive
                        ? "scale-x-100"
                        : "scale-x-0 group-hover:scale-x-100"
                }`}
            />
        </a>
    ));

    // Memoized Mobile NavItem component
    const MobileNavItem = memo(({ item, isActive, index, isOpen }) => (
        <a
            href={item.href}
            onClick={(e) => scrollToSection(e, item.href)}
            className={`block px-4 py-3 text-base font-medium transition-all duration-300 ease-in-out touch-manipulation active:scale-95 ${
                isActive
                    ? "bg-gradient-to-r from-[#6366f1] to-[#a855f7] bg-clip-text text-transparent font-semibold"
                    : "text-[#e2d3fd] hover:text-white"
            }`}
            style={{
                transitionDelay: isOpen ? `${index * 100}ms` : '0ms',
                transform: isOpen ? "translateX(0)" : "translateX(50px)",
                opacity: isOpen ? 1 : 0,
            }}
        >
            {item.label}
        </a>
    ));

    return (
        <nav
            className={`fixed w-full top-0 z-50 transition-all duration-500 ${
                isOpen
                    ? "bg-[#030014] backdrop-blur-xl"
                    : scrolled
                    ? "bg-[#030014]/80 backdrop-blur-xl"
                    : "bg-transparent"
            }`}
        >
            <div className="mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <div className="flex-shrink-0">
                        <a
                            href="#Home"
                            onClick={(e) => scrollToSection(e, "#Home")}
                            className="text-xl font-bold bg-gradient-to-r from-[#a855f7] to-[#6366f1] bg-clip-text text-transparent touch-manipulation"
                        >
                            EZA
                        </a>
                    </div>
        
                    {/* Desktop Navigation */}
                    <div className="hidden md:block">
                        <div className="ml-8 flex items-center space-x-6 lg:space-x-8">
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
                            className={`relative p-2 text-[#e2d3fd] hover:text-white transition-all duration-300 ease-in-out touch-manipulation active:scale-95 ${
                                isOpen ? "rotate-90 scale-110" : "rotate-0 scale-100"
                            }`}
                            aria-label={isOpen ? "Close menu" : "Open menu"}
                            aria-expanded={isOpen}
                        >
                            {isOpen ? (
                                <X className="w-5 h-5" />
                            ) : (
                                <Menu className="w-5 h-5" />
                            )}
                        </button>
                    </div>
                </div>
            </div>
        
            {/* Mobile Menu Overlay */}
            {isOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}
        
            {/* Mobile Menu */}
            <div
                className={`md:hidden fixed top-16 left-0 right-0 bg-[#030014] backdrop-blur-xl border-t border-white/10 transition-all duration-300 ease-in-out z-50 ${
                    isOpen
                        ? "max-h-screen opacity-100 translate-y-0"
                        : "max-h-0 opacity-0 -translate-y-4"
                }`}
            >
                <div className="px-4 py-4 space-y-1">
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