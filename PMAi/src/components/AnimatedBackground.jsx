"use client"

import { useEffect, useRef } from "react"

const AnimatedBackground = () => {
    const canvasRef = useRef(null)

    useEffect(() => {
        const canvas = canvasRef.current
        const ctx = canvas.getContext("2d")
        let animationFrameId

        // Set canvas size
        const resizeCanvas = () => {
            canvas.width = window.innerWidth
            canvas.height = window.innerHeight
        }
        resizeCanvas()
        window.addEventListener("resize", resizeCanvas)

        // DNA strand class
        class DNAStrand {
            constructor(x, y, width, height) {
                this.x = x
                this.y = y
                this.width = width
                this.height = height
                this.particles = []
                this.angle = 0
                this.speed = 0.01
                this.particleCount = 20
                this.initializeParticles()
            }

            initializeParticles() {
                for (let i = 0; i < this.particleCount; i++) {
                    this.particles.push({
                        x: this.x + (i / this.particleCount) * this.width,
                        y: this.y + Math.sin(i * 0.5) * this.height,
                        size: 2,
                        color: 'rgba(99, 102, 241, 0.3)' // indigo-500 with low opacity
                    })
                }
            }

            update() {
                this.angle += this.speed
                this.particles.forEach((particle, i) => {
                    particle.y = this.y + Math.sin(i * 0.5 + this.angle) * this.height
                })
            }

            draw(ctx) {
                ctx.beginPath()
                ctx.moveTo(this.particles[0].x, this.particles[0].y)
                
                // Draw the DNA strand
                for (let i = 1; i < this.particles.length; i++) {
                    const particle = this.particles[i]
                    ctx.lineTo(particle.x, particle.y)
                }
                
                ctx.strokeStyle = 'rgba(99, 102, 241, 0.2)' // indigo-500 with low opacity
                ctx.lineWidth = 1
                ctx.stroke()

                // Draw particles
                this.particles.forEach(particle => {
                    ctx.beginPath()
                    ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
                    ctx.fillStyle = particle.color
                    ctx.fill()
                })
            }
        }

        // Create DNA strands
        const strands = [
            new DNAStrand(canvas.width * 0.2, canvas.height * 0.5, 100, 100),
            new DNAStrand(canvas.width * 0.8, canvas.height * 0.5, 100, 100),
            new DNAStrand(canvas.width * 0.5, canvas.height * 0.3, 100, 100)
        ]

        // Animation loop
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height)
            
            // Draw background gradient
            const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
            gradient.addColorStop(0, 'rgba(15, 23, 42, 0.95)') // slate-900
            gradient.addColorStop(1, 'rgba(30, 41, 59, 0.95)') // slate-800
            ctx.fillStyle = gradient
            ctx.fillRect(0, 0, canvas.width, canvas.height)

            // Draw DNA strands
            strands.forEach(strand => {
                strand.update()
                strand.draw(ctx)
            })

            animationFrameId = requestAnimationFrame(animate)
        }

        animate()

        // Cleanup
        return () => {
            window.removeEventListener("resize", resizeCanvas)
            cancelAnimationFrame(animationFrameId)
        }
    }, [])

    return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full -z-10" />
}

export default AnimatedBackground

