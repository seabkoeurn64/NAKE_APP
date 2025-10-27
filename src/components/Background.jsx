import React, { useEffect, useRef, useCallback, memo, useState } from "react"

const AnimatedBackground = memo(({ 
  intensity = 1, 
  performanceMode = 'auto',
  enableMouseInteraction = true,
  enableScrollEffects = true,
  blurIntensity = 140,
  baseOpacity = 0.25
}) => {
  const blobRefs = useRef([])
  const orbRefs = useRef([])
  const mousePos = useRef({ x: 0, y: 0 })
  const animationFrame = useRef(null)
  const timeRef = useRef(0)
  const scrollRef = useRef(0)
  const [reducedMotion, setReducedMotion] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const resizeTimeout = useRef(null)
  
  // Performance configuration based on mode
  const performanceConfig = {
    high: { fps: 60, blur: blurIntensity, particles: 4 },
    medium: { fps: 30, blur: blurIntensity * 0.8, particles: 3 },
    low: { fps: 20, blur: blurIntensity * 0.6, particles: 2 },
    auto: { fps: 60, blur: blurIntensity, particles: 4 } // Will be adjusted
  }

  const [config, setConfig] = useState(performanceConfig[performanceMode])

  // Detect reduced motion preference and device capabilities
  useEffect(() => {
    // Check for reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mediaQuery.matches)
    
    const handleReducedMotionChange = (e) => {
      setReducedMotion(e.matches)
    }
    
    mediaQuery.addEventListener('change', handleReducedMotionChange)

    // Check for mobile device
    const checkMobile = () => {
      const mobile = window.innerWidth < 768 || 
                    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
      setIsMobile(mobile)
      
      // Auto-adjust performance for mobile
      if (performanceMode === 'auto' && mobile) {
        setConfig(performanceConfig.medium)
      } else {
        setConfig(performanceConfig[performanceMode])
      }
    }
    
    checkMobile()

    return () => {
      mediaQuery.removeEventListener('change', handleReducedMotionChange)
    }
  }, [performanceMode])

  // Memoized initial positions with intensity scaling
  const initialPositions = useRef([
    { 
      x: -4, y: 0, scale: 1, 
      color: "purple", speed: 0.5,
      size: { w: 384, h: 384 }
    },
    { 
      x: -4, y: 0, scale: 1.2, 
      color: "cyan", speed: 0.7,
      size: { w: 384, h: 384 }
    },
    { 
      x: 20, y: -8, scale: 0.8, 
      color: "blue", speed: 0.9,
      size: { w: 384, h: 384 }
    },
    { 
      x: 20, y: -8, scale: 1.1, 
      color: "indigo", speed: 1.1,
      size: { w: 384, h: 384 }
    },
  ]).current

  // Orb configurations
  const orbConfigs = useRef([
    { x: '25%', y: '25%', color: 'blue', size: 2, delay: 0 },
    { x: '66%', y: '75%', color: 'purple', size: 1, delay: 2 },
    { x: '66%', y: '25%', color: 'cyan', size: 1.5, delay: 4 },
  ]).current

  // Optimized animation function with performance controls
  const animate = useCallback(() => {
    if (reducedMotion) return

    const currentTime = performance.now() * 0.001
    const deltaTime = currentTime - timeRef.current
    timeRef.current = currentTime

    const newScroll = window.pageYOffset
    const scrollDelta = newScroll - scrollRef.current
    scrollRef.current = newScroll

    // Apply intensity scaling
    const intensityScale = Math.min(Math.max(intensity, 0.1), 2)

    blobRefs.current.forEach((blob, index) => {
      if (!blob || index >= config.particles) return
      
      const initialPos = initialPositions[index]
      const speed = initialPos.speed * intensityScale
      
      // Parallax scroll effect
      const scrollFactor = enableScrollEffects ? (1 + index * 0.3) : 0
      const xOffset = Math.sin(timeRef.current * speed + index) * (300 * intensityScale + index * 20)
      const yOffset = Math.cos(timeRef.current * speed + index * 0.7) * (60 * intensityScale + index * 10)
      
      // Mouse follow effect
      let mouseX = 0, mouseY = 0
      if (enableMouseInteraction && !isMobile) {
        const mouseInfluence = (0.3 + index * 0.1) * intensityScale
        mouseX = mousePos.current.x * mouseInfluence
        mouseY = mousePos.current.y * mouseInfluence
      }
      
      // Gentle pulse animation
      const pulse = Math.sin(timeRef.current * 0.5 + index) * 0.1 * intensityScale + 1
      
      const x = initialPos.x + xOffset + mouseX
      const y = initialPos.y + yOffset + mouseY + (newScroll * 0.1 * scrollFactor * intensityScale)
      const scale = initialPos.scale * pulse

      // Apply transformations
      blob.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${scale})`
      
      // Dynamic opacity with scroll fade
      const opacityBase = (index === 3 ? 0.1 : baseOpacity) * intensityScale
      const opacityVariation = Math.sin(timeRef.current * 0.3 + index) * 0.05 * intensityScale
      const scrollFade = enableScrollEffects ? Math.max(0.3, 1 - newScroll / 3000) : 1
      blob.style.opacity = Math.min((opacityBase + opacityVariation) * scrollFade, 0.8)
      
      // Adjust blur based on performance
      blob.style.filter = `blur(${config.blur}px)`
    })

    // Animate orbs
    orbRefs.current.forEach((orb, index) => {
      if (!orb || reducedMotion) return
      
      const orbConfig = orbConfigs[index]
      const orbTime = timeRef.current + orbConfig.delay
      
      const floatX = Math.sin(orbTime * 0.3) * 20 * intensityScale
      const floatY = Math.cos(orbTime * 0.5) * 15 * intensityScale
      const pulse = Math.sin(orbTime * 2) * 0.5 + 1
      
      orb.style.transform = `translate(${floatX}px, ${floatY}px) scale(${pulse})`
    })

    // Control frame rate for performance
    const nextFrameDelay = 1000 / config.fps - (performance.now() - currentTime * 1000)
    animationFrame.current = setTimeout(() => {
      animationFrame.current = requestAnimationFrame(animate)
    }, Math.max(0, nextFrameDelay))
  }, [
    reducedMotion, 
    intensity, 
    config, 
    enableMouseInteraction, 
    enableScrollEffects, 
    isMobile,
    baseOpacity
  ])

  // Throttled mouse move handler
  const handleMouseMove = useCallback((e) => {
    if (!enableMouseInteraction || isMobile || reducedMotion) return

    mousePos.current = {
      x: (e.clientX / window.innerWidth - 0.5) * 40 * intensity,
      y: (e.clientY / window.innerHeight - 0.5) * 40 * intensity
    }
  }, [enableMouseInteraction, isMobile, reducedMotion, intensity])

  // Throttled scroll handler
  const handleScroll = useCallback(() => {
    if (!animationFrame.current && !reducedMotion) {
      animationFrame.current = requestAnimationFrame(animate)
    }
  }, [animate, reducedMotion])

  // Optimized resize handler
  const handleResize = useCallback(() => {
    clearTimeout(resizeTimeout.current)
    resizeTimeout.current = setTimeout(() => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
      
      // Re-adjust performance on resize
      if (performanceMode === 'auto') {
        setConfig(mobile ? performanceConfig.medium : performanceConfig.high)
      }
      
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current)
        animationFrame.current = requestAnimationFrame(animate)
      }
    }, 150)
  }, [animate, performanceMode])

  // Battery-conscious animation (slower when on battery)
  const getBatteryAwareConfig = useCallback(async () => {
    if ('getBattery' in navigator) {
      try {
        const battery = await navigator.getBattery()
        if (!battery.charging) {
          setConfig(prev => ({ ...prev, fps: Math.min(prev.fps, 30) }))
        }
      } catch (error) {
        // Battery API not supported, continue with current config
      }
    }
  }, [])

  useEffect(() => {
    getBatteryAwareConfig()

    // Start animation if not reduced motion
    if (!reducedMotion) {
      animationFrame.current = requestAnimationFrame(animate)
    }

    // Event listeners with passive where possible
    const passiveOptions = { passive: true }
    const captureOptions = { passive: true, capture: true }
    
    window.addEventListener("scroll", handleScroll, passiveOptions)
    window.addEventListener("mousemove", handleMouseMove, passiveOptions)
    window.addEventListener("resize", handleResize, passiveOptions)

    // Initialize time reference
    timeRef.current = performance.now() * 0.001

    return () => {
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("resize", handleResize)
      
      clearTimeout(resizeTimeout.current)
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current)
        clearTimeout(animationFrame.current)
      }
    }
  }, [animate, handleScroll, handleMouseMove, handleResize, reducedMotion, getBatteryAwareConfig])

  // Memoized blob components
  const Blob = memo(({ index, className, style, size }) => (
    <div
      ref={(ref) => (blobRefs.current[index] = ref)}
      className={className}
      style={{
        ...style,
        width: size.w,
        height: size.h,
        display: index < config.particles ? 'block' : 'none'
      }}
      aria-hidden="true"
    />
  ))

  // Memoized orb components
  const Orb = memo(({ index, config }) => (
    <div
      ref={(ref) => (orbRefs.current[index] = ref)}
      className={`absolute w-${config.size} h-${config.size} bg-${config.color}-400 rounded-full blur-sm opacity-40`}
      style={{
        left: config.x,
        top: config.y,
        animation: reducedMotion ? 'none' : `orbFloat 8s ease-in-out infinite ${config.delay}s, orbPulse 3s ease-in-out infinite ${config.delay + 1}s`
      }}
      aria-hidden="true"
    />
  ))

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none select-none -z-10">
      {/* Enhanced Gradient Overlay */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-[#6366f1]/5 via-transparent to-[#a855f7]/5 opacity-60"
        style={{
          animation: reducedMotion ? 'none' : 'gradientShift 15s ease-in-out infinite'
        }}
      />
      
      {/* Main Blobs Container */}
      <div className="absolute inset-0 will-change-transform">
        {initialPositions.map((pos, index) => (
          <Blob
            key={index}
            index={index}
            size={pos.size}
            className={`absolute rounded-full mix-blend-soft-light filter blur-[${config.blur}px] ${
              index === 0 ? 'top-0 -left-4 bg-gradient-to-br from-[#a855f7] to-[#6366f1]' :
              index === 1 ? 'top-0 -right-4 bg-gradient-to-br from-cyan-400 to-blue-500 hidden sm:block' :
              index === 2 ? '-bottom-8 left-[-40%] md:left-20 bg-gradient-to-br from-blue-500 to-indigo-600' :
              '-bottom-10 right-20 bg-gradient-to-br from-indigo-500 to-purple-600 hidden sm:block'
            }`}
          />
        ))}
      </div>

      {/* Enhanced Grid Pattern */}
      <div 
        className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f08_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f08_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]"
        style={{
          animation: reducedMotion ? 'none' : 'gridMove 20s linear infinite'
        }}
      />
      
      {/* Optimized Noise Texture */}
      <div 
        className="absolute inset-0 opacity-[0.15]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.1'/%3E%3C/svg%3E")`,
          animation: reducedMotion ? 'none' : 'noiseAnim 2s steps(10) infinite'
        }}
      />
      
      {/* Floating Orbs */}
      <div className="absolute inset-0">
        {orbConfigs.map((orbConfig, index) => (
          <Orb key={index} index={index} config={orbConfig} />
        ))}
      </div>

      {/* Performance Monitor (Development only) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="absolute top-4 left-4 bg-black/50 text-white text-xs p-2 rounded opacity-0 hover:opacity-100 transition-opacity">
          FPS: {config.fps} | Particles: {config.particles} | Reduced: {reducedMotion.toString()}
        </div>
      )}

      {/* Inline styles for better performance */}
      <style jsx>{`
        @keyframes gradientShift {
          0%, 100% {
            background: linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, transparent 50%, rgba(168, 85, 247, 0.05) 100%);
          }
          50% {
            background: linear-gradient(135deg, rgba(168, 85, 247, 0.05) 0%, transparent 50%, rgba(99, 102, 241, 0.05) 100%);
          }
        }

        @keyframes gridMove {
          0% {
            transform: translate(0, 0);
          }
          100% {
            transform: translate(64px, 64px);
          }
        }

        @keyframes noiseAnim {
          0%, 100% { transform: translate(0, 0); }
          10% { transform: translate(-5%, -5%); }
          20% { transform: translate(-10%, 5%); }
          30% { transform: translate(5%, -10%); }
          40% { transform: translate(-5%, 15%); }
          50% { transform: translate(-10%, 5%); }
          60% { transform: translate(15%, 0); }
          70% { transform: translate(0, 10%); }
          80% { transform: translate(-15%, 0); }
          90% { transform: translate(10%, 5%); }
        }

        @keyframes orbFloat {
          0%, 100% {
            transform: translate(0, 0) scale(1);
            opacity: 0.4;
          }
          25% {
            transform: translate(20px, -15px) scale(1.1);
            opacity: 0.6;
          }
          50% {
            transform: translate(-10px, 10px) scale(0.9);
            opacity: 0.3;
          }
          75% {
            transform: translate(15px, 5px) scale(1.05);
            opacity: 0.5;
          }
        }

        @keyframes orbPulse {
          0%, 100% {
            transform: scale(1);
            opacity: 0.4;
          }
          50% {
            transform: scale(2);
            opacity: 0;
          }
        }

        /* Performance optimizations */
        .will-change-transform {
          will-change: transform;
        }

        /* Reduced motion support */
        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
          
          .will-change-transform {
            will-change: auto;
          }
        }

        /* Mobile optimizations */
        @media (max-width: 768px) {
          .blob-mobile {
            opacity: 0.7 !important;
          }
        }
      `}</style>
    </div>
  )
})

AnimatedBackground.displayName = 'AnimatedBackground'

AnimatedBackground.defaultProps = {
  intensity: 1,
  performanceMode: 'auto',
  enableMouseInteraction: true,
  enableScrollEffects: true,
  blurIntensity: 140,
  baseOpacity: 0.25
}

export default AnimatedBackground