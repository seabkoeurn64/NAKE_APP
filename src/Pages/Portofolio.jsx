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

import CardProject from "../components/CardProject";

import { Palette } from "lucide-react";
import AOS from "aos";
import "aos/dist/aos.css";

const ToggleButton = ({ onClick, isShowingMore }) => (
  <button
    onClick={onClick}
    className="px-3 py-1.5 text-slate-300 hover:text-white text-sm font-medium transition-all duration-300 ease-in-out flex items-center gap-2 bg-white/5 hover:bg-white/10 rounded-md border border-white/10 hover:border-white/20 backdrop-blur-sm group relative overflow-hidden"
  >
    <span className="relative z-10 flex items-center gap-2">
      {isShowingMore ? "See Less" : "See More"}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`transition-transform duration-300 ${isShowingMore ? "group-hover:-translate-y-0.5" : "group-hover:translate-y-0.5"}`}
      >
        <polyline points={isShowingMore ? "18 15 12 9 6 15" : "6 9 12 15 18 9"}></polyline>
      </svg>
    </span>
    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-purple-500/50 transition-all duration-300 group-hover:w-full"></span>
  </button>
);

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
        <Box sx={{ p: { xs: 1, sm: 3 } }}>
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

// Clean sample data for poster projects only
const sampleProjects = [
  {
    id: 1,
    Img: "/images/project1.png",
    Title: "Creative Poster Design",
    Description: "Modern and intuitive poster design with user-centered approach"
  },
  {
    id: 2,
    Img: "/images/project2.png",
    Title: "Website Redesign",
    Description: "Complete website redesign with improved user experience and modern aesthetics"
  },
  {
    id: 3,
    Img: "/images/project3.jpg",
    Title: "Brand Identity",
    Description: "Comprehensive brand identity design including logo and visual guidelines"
  },
  {
    id: 4,
    Img: "/images/project4.jpg",
    Title: "Dashboard Design",
    Description: "Clean and functional admin dashboard interface with data visualization"
  },
  {
    id: 5,
    Img: "/images/project5.jpg",
    Title: "E-commerce App",
    Description: "Seamless shopping experience with intuitive navigation and checkout flow"
  },
  {
    id: 6,
    Img: "/images/project6.jpg",
    Title: "Portfolio Website",
    Description: "Creative portfolio design showcasing design work and case studies"
  }
];

export default function FullWidthTabs() {
  const theme = useTheme();
  const [value, setValue] = useState(0);
  const [projects, setProjects] = useState([]);
  const [showAllProjects, setShowAllProjects] = useState(false);
  const isMobile = window.innerWidth < 768;
  const initialItems = isMobile ? 4 : 6;

  useEffect(() => {
    AOS.init({ once: false });
  }, []);

  // Simple data loading with localStorage save
  const loadData = useCallback(() => {
    // Save sample projects to localStorage first
    localStorage.setItem("projects", JSON.stringify(sampleProjects));
    
    // Then set the state
    setProjects(sampleProjects);
    
    // Also try to load from localStorage if available
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

  const toggleShowMore = useCallback(() => {
    setShowAllProjects(prev => !prev);
  }, []);

  const displayedProjects = showAllProjects ? projects : projects.slice(0, initialItems);

  return (
    <div className="md:px-[10%] px-[5%] w-full sm:mt-0 mt-[3rem] bg-[#030014] overflow-hidden" id="Portofolio">
      <div className="text-center pb-10" data-aos="fade-up" data-aos-duration="1000">
        <h2 className="inline-block text-3xl md:text-5xl font-bold text-center mx-auto text-transparent bg-clip-text bg-gradient-to-r from-[#6366f1] to-[#a855f7]">
          Design Portfolio
        </h2>
        <p className="text-slate-400 max-w-2xl mx-auto text-sm md:text-base mt-2">
          Explore my design journey through carefully crafted UI/UX projects. Each project showcases my passion for creating beautiful and functional digital experiences.
        </p>
      </div>

      <Box sx={{ width: "100%" }}>
        <AppBar
          position="static"
          elevation={0}
          sx={{
            bgcolor: "transparent",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: "20px",
            position: "relative",
            overflow: "hidden",
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "linear-gradient(180deg, rgba(139, 92, 246, 0.03) 0%, rgba(59, 130, 246, 0.03) 100%)",
              backdropFilter: "blur(10px)",
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
                fontWeight: "600",
                color: "#94a3b8",
                textTransform: "none",
                transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                padding: "20px 0",
                zIndex: 1,
                margin: "8px",
                borderRadius: "12px",
                "&:hover": { color: "#fff", backgroundColor: "rgba(139, 92, 246, 0.1)", transform: "translateY(-2px)" },
                "&.Mui-selected": { color: "#fff", background: "linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(59, 130, 246, 0.2))" },
              },
              "& .MuiTabs-indicator": { height: 0 },
              "& .MuiTabs-flexContainer": { gap: "8px" },
            }}
          >
            <Tab icon={<Palette className="mb-2 w-5 h-5 transition-all duration-300" />} label="Design Projects" {...a11yProps(0)} />
          </Tabs>
        </AppBar>

        <Swiper
          slidesPerView={1}
          onSlideChange={(swiper) => setValue(swiper.activeIndex)}
          initialSlide={value}
        >
          <SwiperSlide>
            <TabPanel value={value} index={0} dir={theme.direction}>
              <div className="container mx-auto flex justify-center items-center overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 2xl:grid-cols-3 gap-5">
                  {displayedProjects.map((project, index) => (
                    <div key={project.id || index} data-aos={index % 3 === 0 ? "fade-up-right" : index % 3 === 1 ? "fade-up" : "fade-up-left"} data-aos-duration={1000 + index * 100}>
                      <CardProject 
                        Img={project.Img} 
                        Title={project.Title} 
                        Description={project.Description} 
                        id={project.id}
                      />
                    </div>
                  ))}
                </div>
              </div>
              {projects.length > initialItems && (
                <div className="flex justify-center mt-8">
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