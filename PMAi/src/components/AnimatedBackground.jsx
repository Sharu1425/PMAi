"use client"

import { useEffect, useRef } from "react"

const AnimatedBackground = () => {
    const canvasRef = useRef(null)

    useEffect(() => {
        const canvas = canvasRef.current
        const ctx = canvas.getContext("2d")
        let animationFrameId

        // Set canvas size
        const setCanvasSize = () => {
            canvas.width = window.innerWidth
            canvas.height = window.innerHeight
        }
        setCanvasSize()
        window.addEventListener("resize", setCanvasSize)

        // Medical theme colors
        const colors = [
            '#8b5cf6', // Purple
            '#3b82f6', // Blue
            '#06b6d4', // Cyan
            '#4f46e5', // Indigo
            '#ec4899'  // Pink
        ]

        // Particle class
        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width
                this.y = Math.random() * canvas.height
                this.size = Math.random() * 3 + 0.5
                this.speedX = Math.random() * 1 - 0.5
                this.speedY = Math.random() * 1 - 0.5
                this.color = colors[Math.floor(Math.random() * colors.length)]
                this.opacity = Math.random() * 0.5 + 0.5
                this.pulseSpeed = Math.random() * 0.02 + 0.01
                this.pulseDirection = 1
            }

            update() {
                this.x += this.speedX
                this.y += this.speedY

                if (this.x > canvas.width) this.x = 0
                else if (this.x < 0) this.x = canvas.width
                if (this.y > canvas.height) this.y = 0
                else if (this.y < 0) this.y = canvas.height

                // Pulse size effect
                this.size += this.pulseDirection * this.pulseSpeed
                if (this.size > 4) this.pulseDirection = -1
                if (this.size < 0.5) this.pulseDirection = 1
            }

            draw() {
                ctx.beginPath()
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
                ctx.fillStyle = this.color
                ctx.globalAlpha = this.opacity
                ctx.fill()
                ctx.globalAlpha = 1
            }
        }

        // Draw connecting lines between particles
        const connectParticles = (particles) => {
            for (let i = 0; i < particles.length; i++) {
                for (let j = i; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x
                    const dy = particles[i].y - particles[j].y
                    const distance = Math.sqrt(dx * dx + dy * dy)

                    if (distance < 150) {
                        ctx.beginPath()
                        ctx.strokeStyle = particles[i].color
                        ctx.globalAlpha = 0.2 * (1 - distance / 150)
                        ctx.lineWidth = 0.5
                        ctx.moveTo(particles[i].x, particles[i].y)
                        ctx.lineTo(particles[j].x, particles[j].y)
                        ctx.stroke()
                        ctx.globalAlpha = 1
                    }
                }
            }
        }

        // Create particle array
        const particles = Array.from({ length: 120 }, () => new Particle())

        // Animation loop
        const animate = () => {
            ctx.fillStyle = "rgba(0, 0, 0, 0.05)"
            ctx.fillRect(0, 0, canvas.width, canvas.height)

            // Add gradient overlay
            const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
            gradient.addColorStop(0, 'rgba(92, 46, 145, 0.15)')
            gradient.addColorStop(1, 'rgba(59, 130, 246, 0.15)')
            ctx.fillStyle = gradient
            ctx.fillRect(0, 0, canvas.width, canvas.height)

            particles.forEach((particle) => {
                particle.update()
                particle.draw()
            })

            connectParticles(particles)

            animationFrameId = requestAnimationFrame(animate)
        }

        animate()

        return () => {
            window.removeEventListener("resize", setCanvasSize)
            cancelAnimationFrame(animationFrameId)
        }
    }, [])

    return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full -z-10" />
}

export default AnimatedBackground

