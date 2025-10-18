import React, { useEffect, useRef } from "react"

const AnimatedBackground = () => {
	const blobRefs = useRef([])
	const mousePos = useRef({ x: 0, y: 0 })
	const animationFrame = useRef(null)
	
	const initialPositions = [
		{ x: -4, y: 0, scale: 1, color: "purple" },
		{ x: -4, y: 0, scale: 1.2, color: "cyan" },
		{ x: 20, y: -8, scale: 0.8, color: "blue" },
		{ x: 20, y: -8, scale: 1.1, color: "indigo" },
	]

	useEffect(() => {
		const handleMouseMove = (e) => {
			mousePos.current = {
				x: (e.clientX / window.innerWidth - 0.5) * 40,
				y: (e.clientY / window.innerHeight - 0.5) * 40
			}
		}

		let currentScroll = 0
		let time = 0

		const animate = () => {
			const newScroll = window.pageYOffset
			const scrollDelta = newScroll - currentScroll
			currentScroll = newScroll
			time += 0.01

			blobRefs.current.forEach((blob, index) => {
				if (!blob) return
				
				const initialPos = initialPositions[index]
				const speed = 0.5 + index * 0.2
				
				// Parallax scroll effect
				const scrollFactor = 1 + index * 0.3
				const xOffset = Math.sin(time * speed + index) * (300 + index * 20)
				const yOffset = Math.cos(time * speed + index * 0.7) * (60 + index * 10)
				
				// Mouse follow effect (subtle)
				const mouseX = mousePos.current.x * (0.3 + index * 0.1)
				const mouseY = mousePos.current.y * (0.3 + index * 0.1)
				
				// Pulse animation
				const pulse = Math.sin(time * 0.5 + index) * 0.1 + 1
				
				const x = initialPos.x + xOffset + mouseX
				const y = initialPos.y + yOffset + mouseY + (newScroll * 0.1 * scrollFactor)
				const scale = initialPos.scale * pulse

				// Smooth transformation
				blob.style.transform = `translate(${x}px, ${y}px) scale(${scale})`
				blob.style.transition = "transform 1.8s cubic-bezier(0.22, 0.61, 0.36, 1)"
				
				// Dynamic opacity based on scroll and position
				const opacityBase = index === 3 ? 0.1 : 0.2
				const opacityVariation = Math.sin(time * 0.3 + index) * 0.05
				blob.style.opacity = (opacityBase + opacityVariation) * (1 - newScroll / 5000)
			})

			animationFrame.current = requestAnimationFrame(animate)
		}

		window.addEventListener("scroll", animate)
		window.addEventListener("mousemove", handleMouseMove)
		animate()

		return () => {
			window.removeEventListener("scroll", animate)
			window.removeEventListener("mousemove", handleMouseMove)
			if (animationFrame.current) {
				cancelAnimationFrame(animationFrame.current)
			}
		}
	}, [])

	return (
		<div className="fixed inset-0 overflow-hidden pointer-events-none">
			{/* Animated Gradient Overlay */}
			<div className="absolute inset-0 bg-gradient-to-br from-[#6366f1]/5 via-transparent to-[#a855f7]/5 opacity-60 animate-gradient-x"></div>
			
			{/* Main Blobs Container */}
			<div className="absolute inset-0">
				{/* Purple Blob */}
				<div
					ref={(ref) => (blobRefs.current[0] = ref)}
					className="absolute top-0 -left-4 md:w-96 md:h-96 w-72 h-72 bg-gradient-to-br from-[#a855f7] to-[#6366f1] rounded-full mix-blend-soft-light filter blur-[140px] opacity-20 md:opacity-30 animate-pulse-slow"
					style={{ animationDelay: '0s' }}
				></div>
				
				{/* Cyan Blob */}
				<div
					ref={(ref) => (blobRefs.current[1] = ref)}
					className="absolute top-0 -right-4 w-96 h-96 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full mix-blend-soft-light filter blur-[140px] opacity-30 md:opacity-25 hidden sm:block animate-pulse-slow"
					style={{ animationDelay: '1s' }}
				></div>
				
				{/* Blue Blob */}
				<div
					ref={(ref) => (blobRefs.current[2] = ref)}
					className="absolute -bottom-8 left-[-40%] md:left-20 w-96 h-96 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full mix-blend-soft-light filter blur-[140px] opacity-25 md:opacity-20 animate-pulse-slow"
					style={{ animationDelay: '2s' }}
				></div>
				
				{/* Indigo Blob */}
				<div
					ref={(ref) => (blobRefs.current[3] = ref)}
					className="absolute -bottom-10 right-20 w-96 h-96 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full mix-blend-soft-light filter blur-[140px] opacity-20 md:opacity-15 hidden sm:block animate-pulse-slow"
					style={{ animationDelay: '3s' }}
				></div>
			</div>

			{/* Grid Pattern */}
			<div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f08_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f08_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]"></div>
			
			{/* Subtle Noise Texture */}
			<div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iLjc1IiBzdGl0Y2hUaWxlcz0ic3RpdGNoIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiBmaWx0ZXI9InVybCgjYSkiIG9wYWNpdHk9Ii4wMyIvPjwvc3ZnPg==')] opacity-20"></div>
			
			{/* Animated Orbs */}
			<div className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-400 rounded-full blur-sm opacity-40 animate-float">
				<div className="absolute inset-0 bg-blue-400 rounded-full animate-ping"></div>
			</div>
			<div className="absolute top-3/4 right-1/3 w-1 h-1 bg-purple-400 rounded-full blur-sm opacity-30 animate-float" style={{ animationDelay: '2s' }}>
				<div className="absolute inset-0 bg-purple-400 rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>
			</div>
			<div className="absolute bottom-1/4 left-2/3 w-1.5 h-1.5 bg-cyan-400 rounded-full blur-sm opacity-50 animate-float" style={{ animationDelay: '4s' }}>
				<div className="absolute inset-0 bg-cyan-400 rounded-full animate-ping" style={{ animationDelay: '2s' }}></div>
			</div>
		</div>
	)
}

export default AnimatedBackground