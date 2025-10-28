import React, { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [activeSection, setActiveSection] = useState("home");
    
    // ✅ FIXED: Use correct section IDs that match your actual page sections
    const navItems = [
        { href: "#home", label: "Home" },
        { href: "#about", label: "About" },
        { href: "#portfolio", label: "Portfolio" }, // ✅ FIXED: Changed from "Portofolio" to "portfolio"
        { href: "#contact", label: "Contact" },
    ];

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
            
            // ✅ IMPROVED: Better active section detection
            const sections = navItems.map(item => {
                const id = item.href.substring(1);
                const section = document.getElementById(id);
                if (section) {
                    const rect = section.getBoundingClientRect();
                    return {
                        id: id,
                        top: rect.top,
                        bottom: rect.bottom,
                        height: rect.height
                    };
                }
                return null;
            }).filter(Boolean);

            // Find which section is currently in view
            const currentPosition = window.scrollY + 100;
            
            let active = "home"; // default
            
            sections.forEach(section => {
                const sectionElement = document.getElementById(section.id);
                if (sectionElement) {
                    const offsetTop = sectionElement.offsetTop;
                    const offsetHeight = sectionElement.offsetHeight;
                    
                    if (currentPosition >= offsetTop - 100 && 
                        currentPosition < offsetTop + offsetHeight - 100) {
                        active = section.id;
                    }
                }
            });

            setActiveSection(active);
        };

        window.addEventListener("scroll", handleScroll);
        // Initial check
        setTimeout(handleScroll, 100);
        
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // ✅ SIMPLE FIX: Body scroll lock
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

    const scrollToSection = (e, href) => {
        e.preventDefault();
        const targetId = href.substring(1);
        const section = document.getElementById(targetId);
        
        if (section) {
            // ✅ IMPROVED: Better scroll calculation
            const navbarHeight = 80;
            const elementPosition = section.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - navbarHeight;

            window.scrollTo({
                top: Math.max(0, offsetPosition),
                behavior: "smooth"
            });
            
            setActiveSection(targetId);
        } else {
            console.warn(`Section with ID '${targetId}' not found`);
            // Fallback: scroll to top for home
            if (targetId === "home") {
                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });
            }
        }
        setIsOpen(false);
    };

    // ✅ ADD: Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (isOpen && !e.target.closest('nav') && !e.target.closest('button')) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('click', handleClickOutside);
        }
        
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [isOpen]);

    return (
        <>
            <nav
                className={`fixed w-full top-0 z-50 transition-all duration-500 ${
                    isOpen
                        ? "bg-[#030014] backdrop-blur-xl"
                        : scrolled
                        ? "bg-[#030014]/90 backdrop-blur-xl"
                        : "bg-transparent"
                }`}
            >
                <div className="mx-auto px-[5%] sm:px-[5%] lg:px-[10%]">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <div className="flex-shrink-0">
                            <a
                                href="#home"
                                onClick={(e) => scrollToSection(e, "#home")}
                                className="text-xl font-bold bg-gradient-to-r from-[#a855f7] to-[#6366f1] bg-clip-text text-transparent hover:scale-105 transition-transform duration-300"
                            >
                                Portfolio
                            </a>
                        </div>
            
                        {/* Desktop Navigation */}
                        <div className="hidden md:block">
                            <div className="ml-8 flex items-center space-x-8">
                                {navItems.map((item) => {
                                    const sectionId = item.href.substring(1);
                                    const isActive = activeSection === sectionId;
                                    
                                    return (
                                        <a
                                            key={item.label}
                                            href={item.href}
                                            onClick={(e) => scrollToSection(e, item.href)}
                                            className="group relative px-1 py-2 text-sm font-medium transition-all duration-300"
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
                                    );
                                })}
                            </div>
                        </div>
            
                        {/* Mobile Menu Button */}
                        <div className="md:hidden">
                            <button
                                onClick={() => setIsOpen(!isOpen)}
                                className={`relative p-2 rounded-lg transition-all duration-300 ease-in-out ${
                                    isOpen 
                                        ? "bg-[#6366f1]/10 text-white rotate-90 scale-110" 
                                        : "text-[#e2d3fd] hover:text-white hover:bg-white/5 rotate-0 scale-100"
                                }`}
                            >
                                {isOpen ? (
                                    <X className="w-6 h-6" />
                                ) : (
                                    <Menu className="w-6 h-6" />
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            
                {/* Mobile Menu */}
                <div
                    className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden ${
                        isOpen
                            ? "max-h-96 opacity-100"
                            : "max-h-0 opacity-0"
                    }`}
                >
                    <div className="px-4 py-6 space-y-4 bg-[#030014]/95 backdrop-blur-xl border-t border-white/10">
                        {navItems.map((item, index) => {
                            const sectionId = item.href.substring(1);
                            const isActive = activeSection === sectionId;
                            
                            return (
                                <a
                                    key={item.label}
                                    href={item.href}
                                    onClick={(e) => scrollToSection(e, item.href)}
                                    className={`block px-4 py-3 text-lg font-medium transition-all duration-300 ease-out border-l-2 rounded-r-lg ${
                                        isActive
                                            ? "bg-gradient-to-r from-[#6366f1]/10 to-[#a855f7]/10 text-white font-semibold border-[#6366f1]"
                                            : "text-[#e2d3fd] hover:text-white hover:bg-white/5 border-transparent"
                                    }`}
                                    style={{
                                        transitionDelay: isOpen ? `${index * 100}ms` : '0ms',
                                        transform: isOpen ? "translateX(0)" : "translateX(-20px)",
                                        opacity: isOpen ? 1 : 0,
                                    }}
                                >
                                    {item.label}
                                </a>
                            );
                        })}
                    </div>
                </div>
            </nav>
            
            {/* Spacer */}
            <div className="h-16"></div>
        </>
    );
};

export default Navbar;