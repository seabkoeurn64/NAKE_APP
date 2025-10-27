// hooks/usePreload.js
import { useState, useEffect } from 'react';

// Use paths relative to public folder
const mockProjects = [
  {
    id: 1,
    Img: '/images/projects.jpg',
    Title: "Modern UI Design",
    Description: "A beautiful design project showcasing modern UI principles.",
    technologies: ["React", "Figma", "Tailwind", "GSAP"],
    behanceLink: "https://behance.net/project1",
    status: "completed"
  },
  {
    id: 2,
    Img: '/images/project4.jpg',
    Title: "E-commerce Platform", 
    Description: "Interactive e-commerce experience with optimized performance.",
    technologies: ["Vue", "SASS", "Node.js", "MongoDB"],
    prototypeLink: "https://figma.com/project2",
    status: "completed"
  },
  {
    id: 3,
    Img: '/images/project5.jpg',
    Title: "Mobile App Design",
    Description: "Cross-platform mobile application with intuitive UX.",
    technologies: ["React Native", "Figma", "Firebase", "TypeScript"],
    behanceLink: "https://behance.net/project3", 
    status: "in-progress"
  },
  {
    id: 4,
    Img: '/images/project6.jpg',
    Title: "Brand Identity",
    Description: "Complete brand identity system.",
    technologies: ["Illustrator", "Photoshop", "InDesign"],
    behanceLink: "https://behance.net/project4",
    status: "completed"
  },
  {
    id: 5,
    Img: '/images/Cover.png',
    Title: "Portfolio Website", 
    Description: "Personal portfolio website with modern design.",
    technologies: ["React", "Three.js", "Framer Motion", "CSS3"],
    behanceLink: "https://behance.net/project5",
    status: "completed"
  },
  {
    id: 6,
    Img: '/images/project1.png',
    Title: "Component Library",
    Description: "Reusable component library with documentation.",
    technologies: ["Storybook", "React", "Styled Components", "Jest"],
    status: "planned"
  }
];

export const useProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        setLoading(true);
        
        // Simulate API call with timeout
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        setProjects(mockProjects);
        setError(null);
      } catch (err) {
        setError('Failed to load projects');
        console.error('Error loading projects:', err);
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, []);

  return { 
    projects, 
    loading, 
    error 
  };
};