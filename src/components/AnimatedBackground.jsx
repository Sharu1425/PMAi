"use client"

import React, { useEffect, useRef } from 'react';

class MedicalParticle {
  constructor(canvas, x, y) {
    this.canvas = canvas;
    this.x = x;
    this.y = y;
    this.size = Math.random() * 3 + 1;
    this.baseSize = this.size;
    this.speedX = (Math.random() - 0.5) * 1.5;
    this.speedY = (Math.random() - 0.5) * 1.5;
    this.opacity = 0.4 + Math.random() * 0.4;
    this.type = Math.floor(Math.random() * 4); // 0: circle, 1: cross, 2: heart, 3: pulse
    this.color = this.generateColor();
    this.angle = 0;
    this.pulseOffset = Math.random() * Math.PI * 2;
    this.lastPulseTime = Date.now();
    this.pulseInterval = 1000 + Math.random() * 500; // Random pulse interval
  }

  generateColor() {
    const colors = [
      '59, 130, 246',   // Blue
      '236, 72, 153',   // Pink
      '16, 185, 129',   // Emerald
      '99, 102, 241',   // Indigo
      '239, 68, 68',    // Red
      '168, 85, 247'    // Purple
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  update(time) {
    this.x += this.speedX;
    this.y += this.speedY;
    this.angle += 0.02;

    // Boundary check with smooth transition
    if (this.x < 0 || this.x > this.canvas.width) {
      this.speedX *= -1;
    }
    if (this.y < 0 || this.y > this.canvas.height) {
      this.speedY *= -1;
    }

    // Pulse size effect
    const now = Date.now();
    if (now - this.lastPulseTime > this.pulseInterval) {
      this.lastPulseTime = now;
    }
    const timeSinceLastPulse = now - this.lastPulseTime;
    const pulseFactor = Math.sin(timeSinceLastPulse / this.pulseInterval * Math.PI);
    this.size = this.baseSize * (1 + pulseFactor * 0.3);
  }

  draw(ctx, time) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);
    ctx.globalAlpha = this.opacity;

    switch(this.type) {
      case 0: // Circle (representing cells/molecules)
        ctx.beginPath();
        ctx.arc(0, 0, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${this.color}, ${this.opacity})`;
        ctx.fill();
        break;

      case 1: // Medical Cross
        ctx.beginPath();
        const crossSize = this.size * 2;
        ctx.fillStyle = `rgba(${this.color}, ${this.opacity})`;
        // Vertical bar
        ctx.fillRect(-crossSize/6, -crossSize, crossSize/3, crossSize * 2);
        // Horizontal bar
        ctx.fillRect(-crossSize, -crossSize/6, crossSize * 2, crossSize/3);
        break;

      case 2: // Heart
        const heartSize = this.size * 1.5;
        ctx.beginPath();
        ctx.fillStyle = `rgba(${this.color}, ${this.opacity})`;
        ctx.moveTo(0, heartSize);
        // Left curve
        ctx.bezierCurveTo(
          -heartSize, 0,
          -heartSize, -heartSize,
          0, -heartSize
        );
        // Right curve
        ctx.bezierCurveTo(
          heartSize, -heartSize,
          heartSize, 0,
          0, heartSize
        );
        ctx.fill();
        break;

      case 3: // Pulse wave
        ctx.beginPath();
        ctx.strokeStyle = `rgba(${this.color}, ${this.opacity})`;
        ctx.lineWidth = this.size / 2;
        
        // Draw ECG-like pulse
        ctx.moveTo(-this.size * 4, 0);
        ctx.lineTo(-this.size * 2, 0);
        ctx.lineTo(-this.size, -this.size * 2);
        ctx.lineTo(0, this.size * 3);
        ctx.lineTo(this.size, -this.size * 2);
        ctx.lineTo(this.size * 2, 0);
        ctx.lineTo(this.size * 4, 0);
        
        ctx.stroke();
        break;
    }
    
    ctx.restore();
  }
}

const AnimatedBackground = () => {
  const canvasRef = useRef(null);
  const particles = useRef([]);
  const animationFrameId = useRef(null);
  const mousePosition = useRef({ x: null, y: null });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.scale(dpr, dpr);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
    };

    const initializeParticles = () => {
      particles.current = [];
      const particleCount = Math.min(80, Math.floor((window.innerWidth * window.innerHeight) / 15000));
      
      for (let i = 0; i < particleCount; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        particles.current.push(new MedicalParticle(canvas, x, y));
      }
    };

    const drawConnections = (time) => {
      particles.current.forEach((particle, index) => {
        for (let j = index + 1; j < particles.current.length; j++) {
          const dx = particles.current[j].x - particle.x;
          const dy = particles.current[j].y - particle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const maxDistance = 150;

          if (distance < maxDistance) {
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(particles.current[j].x, particles.current[j].y);
            
            // Pulse effect along the connection lines
            const pulseTime = time * 0.001;
            const pulseIntensity = (Math.sin(pulseTime + distance * 0.05) + 1) * 0.5;
            const opacity = (1 - distance / maxDistance) * 0.3 * pulseIntensity;
            
            ctx.strokeStyle = `rgba(${particle.color}, ${opacity})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }

        // Connect to mouse with medical-themed interaction
        if (mousePosition.current.x !== null && mousePosition.current.y !== null) {
          const dx = mousePosition.current.x - particle.x;
          const dy = mousePosition.current.y - particle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const maxDistance = 200;

          if (distance < maxDistance) {
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(mousePosition.current.x, mousePosition.current.y);
            
            const pulseTime = time * 0.001;
            const pulseIntensity = (Math.sin(pulseTime + distance * 0.05) + 1) * 0.5;
            const opacity = (1 - distance / maxDistance) * 0.5 * pulseIntensity;
            
            ctx.strokeStyle = `rgba(${particle.color}, ${opacity})`;
            ctx.lineWidth = 1.5;
            ctx.stroke();
          }
        }
      });
    };

    const animate = (time) => {
      // Create a gradient background
      const gradient = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, 0,
        canvas.width / 2, canvas.height / 2, canvas.width / 2
      );
      gradient.addColorStop(0, 'rgba(17, 24, 39, 0.95)');
      gradient.addColorStop(1, 'rgba(10, 15, 25, 0.98)');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update and draw particles
      particles.current.forEach(particle => {
        particle.update(time);
        particle.draw(ctx, time);
      });

      // Draw connections with pulse effect
      drawConnections(time);

      animationFrameId.current = requestAnimationFrame(animate);
    };

    const handleMouseMove = (event) => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      mousePosition.current = {
        x: (event.clientX - rect.left) * dpr,
        y: (event.clientY - rect.top) * dpr
      };
    };

    const handleMouseLeave = () => {
      mousePosition.current = { x: null, y: null };
    };

    resizeCanvas();
    initializeParticles();
    animate(0);

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('resize', () => {
      resizeCanvas();
      initializeParticles();
    });

    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('resize', resizeCanvas);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
        background: '#111827'
      }}
    />
  );
};

export default AnimatedBackground;

