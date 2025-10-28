// src/hooks/usePortfolioData.js
import { useState, useEffect } from 'react';

export const usePortfolioData = () => {
  const [projects, setProjects] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load data from localStorage
  useEffect(() => {
    const loadData = () => {
      try {
        const storedProjects = JSON.parse(localStorage.getItem("projects") || "[]");
        const storedCertificates = JSON.parse(localStorage.getItem("certificates") || "[]");
        
        setProjects(storedProjects);
        setCertificates(storedCertificates);
      } catch (error) {
        console.error("Error loading portfolio data:", error);
        setProjects([]);
        setCertificates([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();

    // Listen for storage changes
    const handleStorageChange = () => {
      loadData();
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Also check for changes periodically (every second)
    const interval = setInterval(loadData, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  // Calculate counts
  const projectsCount = projects.filter(project => 
    project && typeof project === 'object' && !project._isPlaceholder
  ).length;

  const certificatesCount = certificates.filter(cert => 
    cert && typeof cert === 'object'
  ).length;

  return {
    projects,
    certificates,
    isLoading,
    projectsCount,
    certificatesCount
  };
};