import { useState, useEffect } from 'react';
import { usePreload } from './usePreload';

// Mock projects data - replace with your actual data
const mockProjects = [
  {
    id: 1,
    Img: "/src/assets/projects.jpg",
    Title: "Modern UI Design",
    Description: "A beautiful design project showcasing modern UI principles with smooth animations and responsive layout.",
    technologies: ["React", "Figma", "Tailwind", "GSAP"],
    scrollTargetId: "project-1"
  },
  {
    id: 2,
    Img: "/src/assets/project4.jpg",
    Title: "E-commerce Platform",
    Description: "Interactive e-commerce experience with optimized performance and engaging user interactions.",
    technologies: ["Vue", "SASS", "Node.js", "MongoDB"],
    scrollTargetId: "project-2"
  },
  {
    id: 3,
    Img: "/src/assets/project5.jpg",
    Title: "Mobile App Design",
    Description: "Cross-platform mobile application with intuitive UX and beautiful visual design.",
    technologies: ["React Native", "Figma", "Firebase", "TypeScript"],
    scrollTargetId: "project-3"
  },
  {
    id: 4,
    Img: "/src/assets/project6.jpg",
    Title: "Brand Identity",
    Description: "Complete brand identity system including logo, typography, and visual guidelines.",
    technologies: ["Illustrator", "Photoshop", "InDesign"],
    scrollTargetId: "project-4"
  },
  {
    id: 5,
    Img: "/src/assets/Cover.png",
    Title: "Portfolio Website",
    Description: "Personal portfolio website with modern design trends and optimized performance.",
    technologies: ["React", "Three.js", "Framer Motion", "CSS3"],
    scrollTargetId: "project-5"
  },
  {
    id: 6,
    Img: "/src/assets/react.svg",
    Title: "Component Library",
    Description: "Reusable component library with comprehensive documentation and design system.",
    technologies: ["Storybook", "React", "Styled Components", "Jest"],
    scrollTargetId: "project-6"
  }
];

export const useProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Use the preload hook for project images
  const { preloadAll, isPreloaded } = usePreload();

  useEffect(() => {
    const loadProjects = async () => {
      try {
        setLoading(true);
        setError(null);

        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Preload all project images
        const imageUrls = mockProjects.map(project => project.Img).filter(Boolean);
        await preloadAll(imageUrls);

        // Verify images loaded successfully
        const failedImages = imageUrls.filter(url => !isPreloaded(url));
        if (failedImages.length > 0) {
          console.warn('Some project images failed to load:', failedImages);
        }

        setProjects(mockProjects);
        
      } catch (err) {
        setError('Failed to load projects. Please try again later.');
        console.error('Error loading projects:', err);
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, [preloadAll, isPreloaded]);

  return { 
    projects, 
    loading, 
    error,
    refetch: () => {
      setLoading(true);
      setTimeout(() => {
        setProjects(mockProjects);
        setLoading(false);
      }, 1000);
    }
  };
};

export default useProjects;