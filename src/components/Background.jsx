import React, { useEffect, useRef, useCallback, memo } from "react"

const AnimatedBackground = memo(() => {
	const blobRefs = useRef([])
	const mousePos = useRef({ x: 0, y: 0 })
	const animationFrame = useRef(null)
	const timeRef = useRef(0)
	const scrollRef = useRef(0)
	
	// Memoized initial positions
	const initialPositions = useRef([
		{ x: -4, y: 0, scale: 1, color: "purple", speed: 0.5 },
		{ x: -4, y: 0, scale: 1.2, color: "cyan", speed: 0.7 },
		{ x: 20, y: -8, scale: 0.8, color: "blue", speed: 0.9 },
		{ x: 20, y: -8, scale: 1.1, color: "indigo", speed: 1.1 },
	]).current

	// Debounced mouse move handler
	const handleMouseMove = useCallback((e) => {
		mousePos.current = {
			x: (e.clientX / window.innerWidth - 0.5) * 40,
			y: (e.clientY / window.innerHeight - 0.5) * 40
		}
	}, [])

	// Optimized animation function
	const animate = useCallback(() => {
		const currentTime = performance.now() * 0.001 // Convert to seconds
		const deltaTime = currentTime - timeRef.current
		timeRef.current = currentTime

		const newScroll = window.pageYOffset
		const scrollDelta = newScroll - scrollRef.current
		scrollRef.current = newScroll

		blobRefs.current.forEach((blob, index) => {
			if (!blob) return
			
			const initialPos = initialPositions[index]
			const speed = initialPos.speed
			
			// Parallax scroll effect with optimized calculations
			const scrollFactor = 1 + index * 0.3
			const xOffset = Math.sin(timeRef.current * speed + index) * (300 + index * 20)
			const yOffset = Math.cos(timeRef.current * speed + index * 0.7) * (60 + index * 10)
			
			// Subtle mouse follow effect
			const mouseInfluence = 0.3 + index * 0.1
			const mouseX = mousePos.current.x * mouseInfluence
			const mouseY = mousePos.current.y * mouseInfluence
			
			// Gentle pulse animation
			const pulse = Math.sin(timeRef.current * 0.5 + index) * 0.1 + 1
			
			const x = initialPos.x + xOffset + mouseX
			const y = initialPos.y + yOffset + mouseY + (newScroll * 0.1 * scrollFactor)
			const scale = initialPos.scale * pulse

			// Apply transformations
			blob.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${scale})`
			
			// Dynamic opacity with scroll fade
			const opacityBase = index === 3 ? 0.1 : 0.2
			const opacityVariation = Math.sin(timeRef.current * 0.3 + index) * 0.05
			const scrollFade = Math.max(0.3, 1 - newScroll / 3000) // Less aggressive fade
			blob.style.opacity = (opacityBase + opacityVariation) * scrollFade
		})

		animationFrame.current = requestAnimationFrame(animate)
	}, [initialPositions])

	// Throttled scroll handler
	const handleScroll = useCallback(() => {
		if (!animationFrame.current) {
			animationFrame.current = requestAnimationFrame(animate)
		}
	}, [animate])

	// Performance-optimized resize handler
	const handleResize = useCallback(() => {
		// Recalculate positions on resize for better responsiveness
		if (animationFrame.current) {
			cancelAnimationFrame(animationFrame.current)
			animationFrame.current = requestAnimationFrame(animate)
		}
	}, [animate])

	useEffect(() => {
		let resizeTimeout
		
		const throttledResize = () => {
			clearTimeout(resizeTimeout)
			resizeTimeout = setTimeout(handleResize, 100)
		}

		// Start animation
		animationFrame.current = requestAnimationFrame(animate)

		// Event listeners with passive where possible
		window.addEventListener("scroll", handleScroll, { passive: true })
		window.addEventListener("mousemove", handleMouseMove, { passive: true })
		window.addEventListener("resize", throttledResize, { passive: true })

		// Initialize time reference
		timeRef.current = performance.now() * 0.001

		return () => {
			window.removeEventListener("scroll", handleScroll)
			window.removeEventListener("mousemove", handleMouseMove)
			window.removeEventListener("resize", throttledResize)
			clearTimeout(resizeTimeout)
			
			if (animationFrame.current) {
				cancelAnimationFrame(animationFrame.current)
			}
		}
	}, [animate, handleScroll, handleMouseMove, handleResize])

	// Memoized blob components for better performance
	const Blob = memo(({ index, className, style }) => (
		<div
			ref={(ref) => (blobRefs.current[index] = ref)}
			className={className}
			style={style}
			aria-hidden="true"
		/>
	))

	return (
		<div className="fixed inset-0 overflow-hidden pointer-events-none select-none -z-10">
			{/* Enhanced Gradient Overlay */}
			<div 
				className="absolute inset-0 bg-gradient-to-br from-[#6366f1]/5 via-transparent to-[#a855f7]/5 opacity-60"
				style={{
					animation: 'gradientShift 15s ease-in-out infinite'
				}}
			/>
			
			{/* Main Blobs Container */}
			<div className="absolute inset-0 will-change-transform">
				<Blob
					index={0}
					className="absolute top-0 -left-4 md:w-96 md:h-96 w-72 h-72 bg-gradient-to-br from-[#a855f7] to-[#6366f1] rounded-full mix-blend-soft-light filter blur-[140px] opacity-20 md:opacity-30"
					style={{ animationDelay: '0s' }}
				/>
				
				<Blob
					index={1}
					className="absolute top-0 -right-4 w-96 h-96 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full mix-blend-soft-light filter blur-[140px] opacity-30 md:opacity-25 hidden sm:block"
					style={{ animationDelay: '1s' }}
				/>
				
				<Blob
					index={2}
					className="absolute -bottom-8 left-[-40%] md:left-20 w-96 h-96 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full mix-blend-soft-light filter blur-[140px] opacity-25 md:opacity-20"
					style={{ animationDelay: '2s' }}
				/>
				
				<Blob
					index={3}
					className="absolute -bottom-10 right-20 w-96 h-96 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full mix-blend-soft-light filter blur-[140px] opacity-20 md:opacity-15 hidden sm:block"
					style={{ animationDelay: '3s' }}
				/>
			</div>

			{/* Enhanced Grid Pattern */}
			<div 
				className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f08_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f08_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]"
				style={{
					animation: 'gridMove 20s linear infinite'
				}}
			/>
			
			{/* Optimized Noise Texture */}
			<div 
				className="absolute inset-0 opacity-20"
				style={{
					backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.1'/%3E%3C/svg%3E")`,
					animation: 'noiseAnim 2s steps(10) infinite'
				}}
			/>
			
			{/* Optimized Floating Orbs */}
			<div className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-400 rounded-full blur-sm opacity-40">
				<div 
					className="absolute inset-0 bg-blue-400 rounded-full"
					style={{
						animation: 'orbPulse 3s ease-in-out infinite, orbFloat 8s ease-in-out infinite'
					}}
				/>
			</div>
			
			<div 
				className="absolute top-3/4 right-1/3 w-1 h-1 bg-purple-400 rounded-full blur-sm opacity-30"
				style={{
					animation: 'orbFloat 12s ease-in-out infinite 2s, orbPulse 4s ease-in-out infinite 1s'
				}}
			/>
			
			<div 
				className="absolute bottom-1/4 left-2/3 w-1.5 h-1.5 bg-cyan-400 rounded-full blur-sm opacity-50"
				style={{
					animation: 'orbFloat 10s ease-in-out infinite 4s, orbPulse 3.5s ease-in-out infinite 2s'
				}}
			/>

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
			`}</style>
		</div>
	)
})

AnimatedBackground.displayName = 'AnimatedBackground'

export default AnimatedBackground