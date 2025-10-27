// src/Pages/Portofolio.jsx
import React, { useEffect, useState, useCallback, memo, useMemo, Suspense } from "react";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import { X } from "lucide-react";
import AOS from "aos";
import "aos/dist/aos.css";

import CardProject from "../components/CardProject";
import PortfolioLoading from "../components/LoadingScreen";
import { PortfolioErrorBoundary, ToggleButton } from "../components/PortfolioComponents";
import { useProjects } from "../hooks/usePreload";

// ✅ Safe TabPanel Component
function TabPanel({ children, value, index, ...other }) {
  if (typeof value === "undefined" || typeof index === "undefined") return null;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`portfolio-tabpanel-${index}`}
      aria-labelledby={`portfolio-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

// ✅ Modal Component (Safe)
const ImageModal = memo(({ image, title, isOpen, onClose }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setTimeout(() => setVisible(true), 50);
    } else {
      setVisible(false);
      document.body.style.overflow = "auto";
    }
  }, [isOpen]);

  if (!isOpen || !image) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 transition-all duration-500 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
      onClick={onClose}
    >
      <div
        className={`relative max-w-5xl w-full transform transition-all duration-500 ${
          visible ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute -top-16 right-0 z-10 p-3 text-white/80 hover:text-white rounded-xl bg-black/50 backdrop-blur-sm border border-white/20 transition-all duration-300 hover:scale-110"
          aria-label="Close modal"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="relative bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-slate-700/50">
          <img
            src={image}
            alt={title}
            className="w-full h-auto max-h-[80vh] object-contain transition-transform duration-700 hover:scale-105"
            draggable={false}
          />
          {title && (
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-4">
              <h3 className="text-2xl font-bold text-white animate-pulse">{title}</h3>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});
ImageModal.displayName = "ImageModal";

const Portfolio = memo(() => {
  const theme = useTheme();
  const [value, setValue] = useState(0);
  const [showAll, setShowAll] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [selectedImage, setSelectedImage] = useState(null);

  const { projects, loading, error } = useProjects();

  // ✅ Detect resize safely
  useEffect(() => {
    const resizeHandler = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", resizeHandler);
    return () => window.removeEventListener("resize", resizeHandler);
  }, []);

  // ✅ Safe AOS init
  useEffect(() => {
    try {
      AOS.init({
        once: true,
        duration: 800,
        easing: "ease-out-cubic",
      });
    } catch (e) {
      console.warn("AOS init error:", e);
    }
  }, []);

  const initialItems = useMemo(() => (isMobile ? 4 : 6), [isMobile]);
  const displayedProjects = useMemo(
    () => (showAll ? projects : projects.slice(0, initialItems)),
    [showAll, projects, initialItems]
  );

  const handleImageClick = useCallback((img, title) => {
    setSelectedImage({ image: img, title });
  }, []);

  if (loading) return <PortfolioLoading />;
  if (error)
    return (
      <div className="flex items-center justify-center h-screen text-center">
        <div>
          <h2 className="text-white text-2xl mb-3">⚠ Failed to Load Projects</h2>
          <p className="text-gray-400 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all duration-300"
          >
            Retry
          </button>
        </div>
      </div>
    );

  return (
    <PortfolioErrorBoundary>
      <div
        className="min-h-screen py-12 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden"
        id="portfolio"
      >
        {/* ✅ Header */}
        <div className="text-center mb-12" data-aos="fade-down">
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
            Design Portfolio
          </h2>
          <p className="text-slate-300 text-lg">
            Explore my creative works — crafted with attention to detail.
          </p>
        </div>

        {/* ✅ Projects Grid */}
        <TabPanel value={value} index={0} dir={theme.direction}>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 px-6">
            {displayedProjects.map((p, index) => (
              <div
                key={p.id}
                data-aos="fade-up"
                data-aos-delay={index * 100}
                className="transition-transform duration-500 hover:-translate-y-2"
              >
                <CardProject {...p} onImageClick={handleImageClick} />
              </div>
            ))}
          </div>

          {projects.length > initialItems && (
            <div className="flex justify-center mt-12" data-aos="fade-up">
              <ToggleButton onClick={() => setShowAll((prev) => !prev)} isShowingMore={showAll} />
            </div>
          )}
        </TabPanel>

        {/* ✅ Image Modal */}
        <ImageModal
          image={selectedImage?.image}
          title={selectedImage?.title}
          isOpen={!!selectedImage}
          onClose={() => setSelectedImage(null)}
        />
      </div>
    </PortfolioErrorBoundary>
  );
});
Portfolio.displayName = "Portfolio";

export default Portfolio;
