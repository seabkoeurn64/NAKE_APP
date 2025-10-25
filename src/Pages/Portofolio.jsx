import React, { useEffect, useState, useCallback } from "react";
import PropTypes from "prop-types";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

import { useTheme } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

import { Palette, ArrowRight, Eye, Sparkles, Figma, Image, X, ExternalLink } from "lucide-react";
import AOS from "aos";
import "aos/dist/aos.css";

// CardProject Component with Improved Mobile Modal
const CardProject = React.memo(({ 
  Img, 
  Title, 
  Description, 
  id, 
  technologies = [], 
  prototypeLink, 
  behanceLink 
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [showFullImage, setShowFullImage] = useState(false);

  // Close modal on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        setShowFullImage(false);
      }
    };

    if (showFullImage) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [showFullImage]);

  const handleImageLoad = useCallback(() => {
    setImageLoaded(true);
  }, []);

  const handleImageError = useCallback(() => {
    setImageError(true);
    setImageLoaded(true);
  }, []);

  const stopPropagation = useCallback((e) => {
    e.stopPropagation();
  }, []);

  const handleViewFullImage = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowFullImage(true);
  }, []);

  const handleCloseFullImage = useCallback((e) => {
    if (e) {
      e.stopPropagation();
    }
    setShowFullImage(false);
  }, []);

  const handleBackdropClick = useCallback((e) => {
    if (e.target === e.currentTarget) {
      setShowFullImage(false);
    }
  }, []);

  return (
    <>
      {/* Improved Full Image Modal for Mobile */}
      {showFullImage && Img && (
        <div 
          className="fixed inset-0 bg-black/98 backdrop-blur-lg z-50 flex items-center justify-center p-2 sm:p-4"
          onClick={handleBackdropClick}
        >
          {/* Main Container with Image and Close Button */}
          <div className="relative w-full h-full max-w-6xl max-h-[95vh] flex flex-col items-center justify-center">
            
            {/* Close Button - Positioned on top of image for mobile */}
            <div className="relative w-full max-w-4xl flex justify-end mb-2 sm:mb-4 z-30">
              <button 
                className="p-3 bg-black/90 hover:bg-red-500/90 rounded-full text-white transition-all duration-300 border border-white/20 shadow-2xl hover:scale-110 hover:shadow-red-500/25 flex items-center justify-center"
                onClick={handleCloseFullImage}
                aria-label="Close preview"
              >
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>
            
            {/* Image Container */}
            <div className="relative w-full max-w-4xl flex-1 flex items-center justify-center">
              <div className="relative w-full h-full flex items-center justify-center">
                <img
                  src={Img}
                  alt={Title}
                  className="max-w-full max-h-full object-contain rounded-xl sm:rounded-2xl shadow-2xl"
                  onClick={stopPropagation}
                  style={{ 
                    width: 'auto', 
                    height: 'auto',
                    maxWidth: '95vw',
                    maxHeight: '70vh'
                  }}
                />
                
                {/* Loading indicator for large images */}
                {!imageLoaded && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-900/50 rounded-xl sm:rounded-2xl">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-500"></div>
                  </div>
                )}
              </div>
            </div>

            {/* Image Info - Simplified for mobile */}
            <div className="relative w-full max-w-4xl mt-3 sm:mt-4 z-20">
              <div className="bg-black/80 backdrop-blur-xl rounded-xl p-3 sm:p-4 border border-white/20 text-center">
                <p className="text-white text-base sm:text-lg font-bold mb-1">{Title}</p>
                <p className="text-gray-300 text-xs sm:text-sm">Tap anywhere outside to close</p>
              </div>
            </div>

            {/* Enhanced Mobile Close Area - Full width tap zone */}
            <div 
              className="absolute inset-0 z-10 sm:hidden"
              onClick={handleCloseFullImage}
            >
              {/* Invisible tap zone - only for mobile */}
            </div>
          </div>

          {/* Alternative Close Method - Bottom Sheet for Mobile */}
          <div 
            className="fixed bottom-0 left-0 right-0 sm:hidden z-40"
            onClick={handleCloseFullImage}
          >
            <div className="bg-gradient-to-t from-black/95 to-transparent pt-8 pb-4 flex justify-center">
              <div className="text-white text-sm bg-black/70 px-6 py-3 rounded-full border border-white/30 shadow-lg">
                👆 Tap to close
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Rest of the Card Design remains the same */}
      <div className="group relative w-full cursor-pointer transform transition-all duration-500 hover:scale-[1.02]">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-900/50 to-gray-800/30 shadow-2xl transition-all duration-500 hover:shadow-purple-500/20 border border-white/10 backdrop-blur-sm">
          
          {/* Enhanced Image Section */}
          <div className="relative overflow-hidden rounded-t-3xl bg-gray-900/20 aspect-[4/3]">
            {/* Skeleton Loader with Animation */}
            <div className={`absolute inset-0 transition-all duration-500 ${imageLoaded ? 'opacity-0 scale-105' : 'opacity-100 scale-100'}`}>
              <div className="skeleton w-full h-full rounded-t-3xl bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 animate-pulse" />
            </div>
            
            {/* Optimized Image */}
            {!imageError && Img && (
              <img
                src={Img}
                alt={Title}
                loading="lazy"
                decoding="async"
                className={`w-full h-full object-cover transform transition-all duration-700 ${
                  imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-110'
                } group-hover:scale-110`}
                onLoad={handleImageLoad}
                onError={handleImageError}
              />
            )}
            
            {/* Enhanced Error State */}
            {imageError && (
              <div className="w-full h-full flex flex-col items-center justify-center bg-gray-800/40 rounded-t-3xl">
                <Image className="w-12 h-12 text-gray-500 mb-2" />
                <span className="text-gray-400 text-sm">Image not available</span>
              </div>
            )}
            
            {/* Enhanced Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-500 rounded-t-3xl" />
            
            {/* Enhanced Hover Overlay */}
            <div className="absolute inset-0 bg-purple-500/0 group-hover:bg-purple-500/10 transition-all duration-500 rounded-t-3xl" />

            {/* Enhanced Badge */}
            <div className="absolute top-3 left-3 z-20">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-black/90 backdrop-blur-md rounded-full border border-purple-500/30 text-sm font-medium shadow-lg">
                <Sparkles className="w-3 h-3 text-purple-400 animate-pulse" />
                <span className="text-white/95">Poster Design</span>
              </div>
            </div>

            {/* Enhanced Action Icons */}
            <div className="absolute top-3 right-3 z-20 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-500">
              <div className="flex gap-2">
                {/* Enhanced View Full Image Button */}
                <button
                  onClick={handleViewFullImage}
                  className="p-2.5 bg-black/90 backdrop-blur-md rounded-xl border border-white/20 text-white hover:bg-purple-600 hover:scale-110 hover:border-purple-400 transition-all duration-300 shadow-lg"
                  title="View full poster"
                >
                  <Eye className="w-4 h-4" />
                </button>
                
                {prototypeLink && (
                  <a
                    href={prototypeLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 bg-black/90 backdrop-blur-md rounded-xl border border-white/20 text-white hover:bg-blue-600 hover:scale-110 hover:border-blue-400 transition-all duration-300 shadow-lg"
                    onClick={stopPropagation}
                    title="Open prototype"
                  >
                    <Figma className="w-4 h-4" />
                  </a>
                )}

                {behanceLink && (
                  <a
                    href={behanceLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 bg-black/90 backdrop-blur-md rounded-xl border border-white/20 text-white hover:bg-blue-500 hover:scale-110 hover:border-blue-300 transition-all duration-300 shadow-lg"
                    onClick={stopPropagation}
                    title="View on Behance"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>

            {/* Enhanced Technology Tags on Image */}
            {technologies.length > 0 && (
              <div className="absolute bottom-3 left-3 right-3 z-20 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-500 delay-100">
                <div className="flex flex-wrap gap-2 justify-start">
                  {technologies.slice(0, 3).map((tech, index) => (
                    <span
                      key={index}
                      className="px-3 py-1.5 bg-black/80 backdrop-blur-lg rounded-full text-xs text-white/90 border border-white/10 font-medium shadow-lg"
                    >
                      {tech}
                    </span>
                  ))}
                  {technologies.length > 3 && (
                    <span className="px-3 py-1.5 bg-black/80 backdrop-blur-lg rounded-full text-xs text-white/70 border border-white/10 font-medium shadow-lg">
                      +{technologies.length - 3}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
          
          {/* Enhanced Content Section */}
          <div className="p-5 space-y-4">
            {/* Enhanced Title & Description */}
            <div className="space-y-3">
              <h3 className="text-xl font-bold text-white leading-tight line-clamp-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-pink-400 transition-all duration-500">
                {Title}
              </h3>
              
              <p className="text-gray-300/90 text-sm leading-relaxed line-clamp-3">
                {Description}
              </p>
            </div>

            {/* Enhanced Technology Tags */}
            {technologies.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {technologies.slice(0, 4).map((tech, index) => (
                  <span
                    key={index}
                    className="px-3 py-1.5 bg-white/5 rounded-full text-xs text-gray-300 border border-white/5 hover:bg-white/10 hover:border-white/10 hover:text-white transition-all duration-300 font-medium"
                  >
                    {tech}
                  </span>
                ))}
                {technologies.length > 4 && (
                  <span className="px-3 py-1.5 bg-white/5 rounded-full text-xs text-gray-400 border border-white/5">
                    +{technologies.length - 4}
                  </span>
                )}
              </div>
            )}
            
            {/* Enhanced Action Buttons */}
            <div className="flex items-center justify-between pt-2">
              {/* Enhanced External Links */}
              <div className="flex items-center gap-2">
                {behanceLink && (
                  <a
                    href={behanceLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 bg-white/5 rounded-xl border border-white/10 text-gray-400 hover:bg-blue-500 hover:text-white hover:scale-110 hover:border-blue-400 transition-all duration-300"
                    onClick={stopPropagation}
                    title="Behance"
                  >
                    <Palette className="w-4 h-4" />
                  </a>
                )}
              </div>
              
              {/* Enhanced View Poster Button */}
              <div className="flex-1 flex justify-end">
                {id ? (
                  <button
                    onClick={handleViewFullImage}
                    className="inline-flex items-center justify-center space-x-3 px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-600/20 to-pink-600/20 hover:from-purple-600/40 hover:to-pink-600/40 border border-purple-500/30 hover:border-purple-400/50 text-white/95 hover:text-white transition-all duration-500 group/button text-sm font-semibold backdrop-blur-sm hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25"
                  >
                    <span className="truncate">View Poster</span>
                    <ArrowRight className="w-4 h-4 flex-shrink-0 transform group-hover/button:translate-x-1 transition-transform duration-300" />
                  </button>
                ) : (
                  <div className="inline-flex items-center justify-center space-x-3 px-6 py-3 rounded-2xl bg-gray-500/10 border border-gray-500/20 text-gray-500 cursor-not-allowed text-sm font-semibold">
                    <span className="truncate">Coming Soon</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
});

// ... Rest of the code remains the same (ToggleButton, TabPanel, sampleProjects, Main Component)

// Enhanced ToggleButton Component
const ToggleButton = ({ onClick, isShowingMore }) => (
  <button
    onClick={onClick}
    className="px-8 py-4 text-white text-base font-semibold transition-all duration-500 ease-out flex items-center gap-3 bg-gradient-to-r from-purple-600/20 to-pink-600/20 hover:from-purple-600/40 hover:to-pink-600/40 rounded-2xl border border-purple-500/30 hover:border-purple-400/50 backdrop-blur-sm hover:scale-105 hover:shadow-xl hover:shadow-purple-500/20 group relative overflow-hidden"
  >
    <span className="relative z-10 flex items-center gap-3">
      {isShowingMore ? "Show Less" : "Show More Projects"}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`transition-all duration-500 ${isShowingMore ? "rotate-180 group-hover:-translate-y-1" : "group-hover:translate-y-1"}`}
      >
        <polyline points={isShowingMore ? "18 15 12 9 6 15" : "6 9 12 15 18 9"}></polyline>
      </svg>
    </span>
    <span className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-pink-600/10 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left rounded-2xl"></span>
  </button>
);

// TabPanel Component (unchanged)
function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: { xs: 2, sm: 3 } }}>
          <Typography component="div">{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`,
  };
}

// Sample Data (unchanged)
const sampleProjects = [
  {
    id: 1,
    Img: "/images/project1.png",
    Title: "Creative Poster Design",
    Description: "Modern and intuitive poster design with user-centered approach",
    technologies: ["Photoshop"]
  },
  {
    id: 2,
    Img: "/images/project2.png",
    Title: "Website Redesign",
    Description: "Complete website redesign with improved user experience and modern aesthetics",
    technologies: ["Photoshop"]
  },
  {
    id: 3,
    Img: "/images/project3.jpg",
    Title: "Brand Identity",
    Description: "Comprehensive brand identity design including logo and visual guidelines",
    technologies: ["Photoshop"]
  },
  {
    id: 4,
    Img: "/images/project4.jpg",
    Title: "poster  Design",
    Description: "Clean and functional admin dashboard interface with data visualization",
    technologies: ["Photoshop"]
  },
  {
    id: 5,
    Img: "/images/project5.jpg",
    Title: "logo Design",
    Description: "Seamless shopping experience with intuitive navigation and checkout flow",
    technologies: ["Photoshop"]
  },
  {
    id: 6,
    Img: "/images/project6.jpg",
    Title: "Post product",
    Description: "Creative portfolio design showcasing design work and case studies",
    technologies: ["Illustrator"]
  }
];

// Main Component (unchanged structure, just using enhanced components)
export default function FullWidthTabs() {
  const theme = useTheme();
  const [value, setValue] = useState(0);
  const [projects, setProjects] = useState([]);
  const [showAllProjects, setShowAllProjects] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  const initialItems = isMobile ? 4 : 6;

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    const checkReducedMotion = () => setPrefersReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);

    checkMobile();
    checkReducedMotion();
    window.addEventListener('resize', checkMobile);
    
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    mediaQuery.addEventListener('change', checkReducedMotion);

    return () => {
      window.removeEventListener('resize', checkMobile);
      mediaQuery.removeEventListener('change', checkReducedMotion);
    };
  }, []);

  useEffect(() => {
    AOS.init({
      once: true,
      offset: isMobile ? 30 : 50,
      duration: isMobile ? 600 : 800,
      easing: 'ease-out-cubic',
      disable: isMobile || prefersReducedMotion
    });

    return () => AOS.refresh();
  }, [isMobile, prefersReducedMotion]);

  const loadData = useCallback(() => {
    localStorage.setItem("projects", JSON.stringify(sampleProjects));
    setProjects(sampleProjects);
    
    const cachedProjects = localStorage.getItem("projects");
    if (cachedProjects) {
      try {
        const parsedProjects = JSON.parse(cachedProjects);
        setProjects(parsedProjects);
      } catch (e) {
        console.error("Error parsing cached projects:", e);
      }
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleChange = (event, newValue) => setValue(newValue);
  const toggleShowMore = useCallback(() => setShowAllProjects(prev => !prev), []);
  const displayedProjects = showAllProjects ? projects : projects.slice(0, initialItems);

  const getAnimationDelay = useCallback((index) => {
    if (prefersReducedMotion) return 0;
    return 100 + (index * 100);
  }, [prefersReducedMotion]);

  const getAnimationType = useCallback((index) => {
    if (prefersReducedMotion) return "fade-up";
    const types = ["fade-up-right", "fade-up", "fade-up-left"];
    return types[index % 3];
  }, [prefersReducedMotion]);

  return (
    <div className="md:px-[5%] px-[4%] w-full sm:mt-0 mt-[2rem] bg-[#030014] overflow-hidden" id="Portofolio">
      <div className="text-center pb-8" data-aos="fade-up" data-aos-duration="1000">
        <h2 className="inline-block text-3xl md:text-5xl font-bold text-center mx-auto text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-purple-600 mb-4">
          Design Portfolio
        </h2>
        <p className="text-slate-300 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
          Explore my design journey through carefully crafted UI/UX projects. Each project showcases my passion for creating beautiful and functional digital experiences.
        </p>
      </div>

      <Box sx={{ width: "100%" }}>
        <AppBar
          position="static"
          elevation={0}
          sx={{
            bgcolor: "transparent",
            border: "1px solid rgba(255, 255, 255, 0.15)",
            borderRadius: "24px",
            position: "relative",
            overflow: "hidden",
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "linear-gradient(135deg, rgba(139, 92, 246, 0.08) 0%, rgba(236, 72, 153, 0.08) 100%)",
              backdropFilter: isMobile ? "blur(8px)" : "blur(12px)",
              zIndex: 0,
            },
          }}
          className="md:px-4"
        >
          <Tabs
            value={value}
            onChange={handleChange}
            textColor="secondary"
            indicatorColor="secondary"
            variant="fullWidth"
            sx={{
              minHeight: "70px",
              "& .MuiTab-root": {
                fontSize: { xs: "0.9rem", md: "1rem" },
                fontWeight: "700",
                color: "#cbd5e1",
                textTransform: "none",
                transition: prefersReducedMotion ? "none" : "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
                padding: "20px 0",
                zIndex: 1,
                margin: "8px",
                borderRadius: "16px",
                "&:hover": prefersReducedMotion ? {} : { 
                  color: "#fff", 
                  backgroundColor: "rgba(139, 92, 246, 0.15)", 
                  transform: "translateY(-3px)",
                  boxShadow: "0 10px 30px rgba(139, 92, 246, 0.2)"
                },
                "&.Mui-selected": { 
                  color: "#fff", 
                  background: "linear-gradient(135deg, rgba(139, 92, 246, 0.3), rgba(236, 72, 153, 0.3))",
                  boxShadow: "0 8px 25px rgba(139, 92, 246, 0.3)"
                },
              },
              "& .MuiTabs-indicator": { height: 0 },
              "& .MuiTabs-flexContainer": { gap: "8px" },
            }}
          >
            <Tab 
              icon={<Palette className="mb-1 w-5 h-5 transition-all duration-500" />}
              label="Design Projects" 
              {...a11yProps(0)} 
            />
          </Tabs>
        </AppBar>

        <Swiper
          slidesPerView={1}
          onSlideChange={(swiper) => setValue(swiper.activeIndex)}
          initialSlide={value}
          speed={prefersReducedMotion ? 0 : 500}
        >
          <SwiperSlide>
            <TabPanel value={value} index={0} dir={theme.direction}>
              <div className="container mx-auto flex justify-center items-center overflow-hidden">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 md:gap-8">
                  {displayedProjects.map((project, index) => (
                    <div 
                      key={project.id || index} 
                      data-aos={getAnimationType(index)}
                      data-aos-duration={prefersReducedMotion ? 0 : 800}
                      data-aos-delay={getAnimationDelay(index)}
                      className="flex justify-center"
                    >
                      <CardProject 
                        Img={project.Img} 
                        Title={project.Title} 
                        Description={project.Description} 
                        id={project.id}
                        technologies={project.technologies}
                      />
                    </div>
                  ))}
                </div>
              </div>
              {projects.length > initialItems && (
                <div 
                  className="flex justify-center mt-12"
                  data-aos="fade-up"
                  data-aos-delay="300"
                  data-aos-duration={prefersReducedMotion ? 0 : 800}
                >
                  <ToggleButton onClick={toggleShowMore} isShowingMore={showAllProjects} />
                </div>
              )}
            </TabPanel>
          </SwiperSlide>
        </Swiper>
      </Box>
    </div>
  );
}