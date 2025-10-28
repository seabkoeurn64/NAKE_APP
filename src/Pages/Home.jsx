import React, { useState, useEffect, useRef, useCallback, memo } from "react";
import LottieAnimationInteractive from "../components/LottieAnimationInteractive";
import { Github, Linkedin, Instagram, Mail, ExternalLink, ArrowRight } from "lucide-react";

// Typing effect words
const WORDS = [
  "Poster Design",
  "Logo Design",
  "Banner Design",
  "Name Card Design",
  "Flyer Design",
  "Social Media Graphics",
  "Branding Materials"
];

const TECH_STACK = ["Figma", "Adobe XD", "Photoshop", "Illustrator", "CorelDraw"];

const SOCIAL_LINKS = [
  { icon: Github, link: "https://github.com/seabkoeurn", label: "GitHub" },
  { icon: Linkedin, link: "https://www.linkedin.com/in/koeurn64", label: "LinkedIn" },
  { icon: Instagram, link: "https://www.instagram.com/koeurn.64._/?hl=id", label: "Instagram" },
  { icon: Mail, link: "mailto:your.email@example.com", label: "Email" }, // Proactive Contact
];

// --- Custom Components for better modularity and micro-interactions ---

/**
 * Custom component for displaying a single tech stack badge with hover effect.
 * Implements Micro-Interaction trend.
 */
const TechBadge = memo(({ tech }) => (
  <span 
    key={tech} 
    className="px-3 py-1 rounded-lg bg-white/5 text-purple-300 text-xs font-semibold whitespace-nowrap 
                transition duration-300 hover:bg-white/10 hover:text-white transform hover:-translate-y-0.5 
                shadow-md hover:shadow-purple-500/30" // Subtle lift and glow
    aria-label={`Skill: ${tech}`}
  >
    {tech}
  </span>
));

/**
 * Custom component for a single social link.
 */
const SocialLink = memo(({ social }) => (
  <a 
    key={social.label} 
    href={social.link} 
    target="_blank" 
    rel="noopener noreferrer" 
    className="text-gray-400 hover:text-purple-400 transition duration-300 transform hover:scale-125" // Bolder icon hover
    aria-label={`Link to ${social.label}`}
  >
    <social.icon className="w-6 h-6"/>
  </a>
));

// --- Typing effect hook (remains the same) ---
const useTypingEffect = (words, speed = 80, pause = 1500) => {
  const [text, setText] = useState("");
  const [index, setIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [typing, setTyping] = useState(true);
  const timeout = useRef();

  useEffect(() => {
    const currentWord = words[index];

    if (typing) {
      if (charIndex < currentWord.length) {
        timeout.current = setTimeout(() => {
          setText(currentWord.substring(0, charIndex + 1));
          setCharIndex(charIndex + 1);
        }, speed);
      } else {
        timeout.current = setTimeout(() => setTyping(false), pause);
      }
    } else {
      if (charIndex > 0) {
        timeout.current = setTimeout(() => {
          setText(currentWord.substring(0, charIndex - 1));
          setCharIndex(charIndex - 1);
        }, speed / 2);
      } else {
        setTyping(true);
        setIndex((prev) => (prev + 1) % words.length);
      }
    }

    return () => clearTimeout(timeout.current);
  }, [charIndex, typing, index, words, speed, pause]);

  return text;
};

// Error boundary (remains the same)
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[50vh] flex items-center justify-center">
          <p className="text-white">Something went wrong. Reload page.</p>
        </div>
      );
    }
    return this.props.children;
  }
}
// --- End Error boundary ---


// Main Home component
const Home = () => {
  const [hover, setHover] = useState(false);
  const typedText = useTypingEffect(WORDS);

  const handleMouseEnter = useCallback(() => setHover(true), []);
  const handleMouseLeave = useCallback(() => setHover(false), []);

  return (
    <ErrorBoundary>
      {/* The 'noise' class adds a subtle grain/texture to the background for a modern 2025 aesthetic */}
      <section 
        id="home" 
        className="min-h-screen flex flex-col lg:flex-row items-center justify-center 
                  bg-gradient-to-br from-[#030014] via-[#0f0a28] to-[#1a1039] 
                  p-6 gap-12 sm:gap-16 relative overflow-hidden noise" 
      >
        {/* Note: The 'noise' class should be defined in your global CSS (e.g., index.css) 
            to apply the textured grain effect commonly used in 2025 UI design:
            
            .noise::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-image: url('/path/to/noise-texture.png'); 
                opacity: 0.05; // Very subtle
                pointer-events: none;
                z-index: 1; 
            }
        */}

        {/* Left Column - Content */}
        <div className="flex-1 max-w-xl flex flex-col gap-4 text-center lg:text-left z-10">
          
          <p className="text-xl font-semibold tracking-wider text-purple-400">Hello, I'm Koeurn!</p>
          
          {/* Bold Minimalism: Emphasizing the H1 with an aggressive gradient and size */}
          <h1 className="text-6xl sm:text-7xl font-extrabold leading-tight text-transparent bg-clip-text bg-gradient-to-r from-[#805ad5] to-[#f6ad55]">
            Graphic Designer
          </h1>
          
          {/* Typing Effect: Using a bold color for emphasis */}
          <p className="text-gray-300 text-xl sm:text-2xl min-h-[3rem] font-sans font-medium">
            Specializing in: <strong className="text-purple-300">{typedText}</strong><span className="animate-blink font-light text-white">|</span>
          </p>

          <p className="text-gray-400 max-w-lg mt-2 text-lg">
            I craft **visually compelling** and user-centered designs that solve real-world problems and amplify brand narratives.
          </p>

          {/* Tech Stack */}
          <div className="mt-4">
            <h3 className="text-sm font-semibold uppercase tracking-widest text-purple-300/80 mb-3">My Design Toolkit</h3>
            <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
              {TECH_STACK.map((tech) => (
                <TechBadge key={tech} tech={tech} />
              ))}
            </div>
          </div>


          {/* CTA Buttons: Conversational/Proactive UI */}
          <div className="flex flex-col sm:flex-row gap-4 mt-6 justify-center lg:justify-start">
            <a 
              href="#portfolio" 
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl 
                        transition duration-300 transform hover:scale-[1.02] font-semibold 
                        shadow-2xl shadow-purple-900/60 flex items-center justify-center gap-2 group"
            >
              View Featured Projects
                <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1"/>
            </a>
            <a 
              href="#contact" 
              className="px-6 py-3 border border-purple-600 text-purple-400 hover:bg-purple-600 
                        hover:text-white rounded-xl transition duration-300 transform hover:scale-[1.02] 
                        font-semibold"
            >
              Start a Project Conversation
            </a>
          </div>

          {/* Social Links */}
          <div className="flex gap-6 mt-6 justify-center lg:justify-start">
            {SOCIAL_LINKS.map((social) => (
              <SocialLink key={social.label} social={social} />
            ))}
          </div>
        </div>

        {/* Right Column - Lottie Animation (Immersive Interaction) */}
        <div 
          className="flex-1 max-w-md h-auto aspect-square relative z-10" 
          onMouseEnter={handleMouseEnter} 
          onMouseLeave={handleMouseLeave}
          role="img" 
          aria-label="Interactive abstract graphic design concept animation"
        >
          <LottieAnimationInteractive
            src="/animations/myAnimation.json"
            autoplay
            loop
            className={`w-full h-full transition-transform duration-500 ${hover ? "scale-105 opacity-100 drop-shadow-2xl drop-shadow-purple-500/50" : "scale-100 opacity-90"}`}
          />
        </div>
      </section>
    </ErrorBoundary>
  );
};

export default memo(Home);