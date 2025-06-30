"use client"

import React, { useEffect, useRef } from 'react';

// Utility for random float
const rand = (a, b) => Math.random() * (b - a) + a;

// Medical icons for floating layer
const floatingIcons = [
  {
    draw: (ctx, size) => { // Stethoscope
      ctx.save();
      ctx.beginPath();
      ctx.arc(0, 0, size * 0.5, Math.PI, 2 * Math.PI);
      ctx.moveTo(-size * 0.5, 0);
      ctx.lineTo(-size * 0.5, size * 0.7);
      ctx.moveTo(size * 0.5, 0);
      ctx.lineTo(size * 0.5, size * 0.7);
      ctx.moveTo(-size * 0.5, size * 0.7);
      ctx.arc(0, size * 0.7, size * 0.5, Math.PI, 0);
      ctx.strokeStyle = 'rgba(59,130,246,0.7)';
      ctx.lineWidth = size * 0.12;
      ctx.stroke();
      ctx.restore();
    },
  },
  {
    draw: (ctx, size) => { // Pill
      ctx.save();
      ctx.rotate(Math.PI / 4);
      ctx.beginPath();
      ctx.ellipse(0, 0, size * 0.6, size * 0.25, 0, 0, 2 * Math.PI);
      ctx.fillStyle = 'rgba(236,72,153,0.5)';
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(-size * 0.6, 0);
      ctx.lineTo(size * 0.6, 0);
      ctx.strokeStyle = 'rgba(255,255,255,0.5)';
      ctx.lineWidth = size * 0.08;
      ctx.stroke();
      ctx.restore();
    },
  },
  {
    draw: (ctx, size) => { // Heartbeat
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(-size * 0.6, 0);
      ctx.lineTo(-size * 0.3, 0);
      ctx.lineTo(-size * 0.15, -size * 0.3);
      ctx.lineTo(0, size * 0.3);
      ctx.lineTo(size * 0.15, -size * 0.3);
      ctx.lineTo(size * 0.3, 0);
      ctx.lineTo(size * 0.6, 0);
      ctx.strokeStyle = 'rgba(16,185,129,0.7)';
      ctx.lineWidth = size * 0.12;
      ctx.stroke();
      ctx.restore();
    },
  },
];

class MedicalParticle {
  constructor(canvas, x, y, layer = 1) {
    this.canvas = canvas;
    this.x = x;
    this.y = y;
    this.size = rand(1, 4) * (layer === 1 ? 1 : 2.5);
    this.baseSize = this.size;
    this.speedX = (rand(-0.5, 0.5)) * (layer === 1 ? 1 : 0.4);
    this.speedY = (rand(-0.5, 0.5)) * (layer === 1 ? 1 : 0.4);
    this.opacity = layer === 1 ? rand(0.4, 0.8) : rand(0.08, 0.18);
    this.type = Math.floor(rand(0, 4)); // 0: circle, 1: cross, 2: heart, 3: pulse
    this.color = this.generateColor();
    this.angle = 0;
    this.pulseOffset = rand(0, Math.PI * 2);
    this.lastPulseTime = Date.now();
    this.pulseInterval = 1000 + rand(0, 500);
    this.layer = layer;
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
    return colors[Math.floor(rand(0, colors.length))];
  }

  update(time) {
    this.x += this.speedX;
    this.y += this.speedY;
    this.angle += 0.01 * (this.layer === 1 ? 1 : 0.5);
    // Parallax: wrap around
    if (this.x < 0) this.x = this.canvas.width;
    if (this.x > this.canvas.width) this.x = 0;
    if (this.y < 0) this.y = this.canvas.height;
    if (this.y > this.canvas.height) this.y = 0;
    // Pulse
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
    // Glow effect
    ctx.shadowColor = `rgba(${this.color},0.7)`;
    ctx.shadowBlur = this.layer === 1 ? 12 : 24;
    switch(this.type) {
      case 0: // Circle
        ctx.beginPath();
        ctx.arc(0, 0, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${this.color}, ${this.opacity})`;
        ctx.fill();
        break;
      case 1: // Medical Cross
        ctx.beginPath();
        const crossSize = this.size * 2;
        ctx.fillStyle = `rgba(${this.color}, ${this.opacity})`;
        ctx.fillRect(-crossSize/6, -crossSize, crossSize/3, crossSize * 2);
        ctx.fillRect(-crossSize, -crossSize/6, crossSize * 2, crossSize/3);
        break;
      case 2: // Heart
        const heartSize = this.size * 1.5;
        ctx.beginPath();
        ctx.fillStyle = `rgba(${this.color}, ${this.opacity})`;
        ctx.moveTo(0, heartSize);
        ctx.bezierCurveTo(-heartSize, 0, -heartSize, -heartSize, 0, -heartSize);
        ctx.bezierCurveTo(heartSize, -heartSize, heartSize, 0, 0, heartSize);
        ctx.fill();
        break;
      case 3: // Pulse wave
        ctx.beginPath();
        ctx.strokeStyle = `rgba(${this.color}, ${this.opacity})`;
        ctx.lineWidth = this.size / 2;
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

// Sparkle class
class Sparkle {
  constructor(canvas) {
    this.canvas = canvas;
    this.x = rand(0, canvas.width);
    this.y = rand(0, canvas.height);
    this.size = rand(0.8, 2.5);
    this.opacity = 0;
    this.life = rand(600, 1800);
    this.birth = Date.now();
    this.fadeIn = rand(0.2, 0.5);
    this.fadeOut = rand(0.2, 0.5);
    this.color = `255,255,255`;
  }
  update() {
    const age = Date.now() - this.birth;
    if (age < this.life * this.fadeIn) {
      this.opacity = age / (this.life * this.fadeIn);
    } else if (age > this.life * (1 - this.fadeOut)) {
      this.opacity = 1 - (age - this.life * (1 - this.fadeOut)) / (this.life * this.fadeOut);
    } else {
      this.opacity = 1;
    }
  }
  draw(ctx) {
    ctx.save();
    ctx.globalAlpha = this.opacity;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${this.color},0.8)`;
    ctx.shadowColor = `rgba(${this.color},0.8)`;
    ctx.shadowBlur = 8;
    ctx.fill();
    ctx.restore();
  }
  isAlive() {
    return Date.now() - this.birth < this.life;
  }
}

// Floating medical icons
class FloatingIcon {
  constructor(canvas) {
    this.canvas = canvas;
    this.icon = floatingIcons[Math.floor(rand(0, floatingIcons.length))];
    this.x = rand(0, canvas.width);
    this.y = rand(0, canvas.height);
    this.size = rand(40, 90);
    this.opacity = 0;
    this.birth = Date.now();
    this.life = rand(4000, 9000);
    this.fadeIn = rand(0.15, 0.3);
    this.fadeOut = rand(0.15, 0.3);
    this.angle = rand(0, Math.PI * 2);
    this.spin = rand(-0.002, 0.002);
  }
  update() {
    const age = Date.now() - this.birth;
    if (age < this.life * this.fadeIn) {
      this.opacity = age / (this.life * this.fadeIn) * 0.25;
    } else if (age > this.life * (1 - this.fadeOut)) {
      this.opacity = 0.25 - (age - this.life * (1 - this.fadeOut)) / (this.life * this.fadeOut) * 0.25;
    } else {
      this.opacity = 0.25;
    }
    this.angle += this.spin;
    this.y += 0.04 * Math.sin(this.angle * 2);
    this.x += 0.04 * Math.cos(this.angle * 2);
  }
  draw(ctx) {
    ctx.save();
    ctx.globalAlpha = this.opacity;
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);
    this.icon.draw(ctx, this.size);
    ctx.restore();
  }
  isAlive() {
    return Date.now() - this.birth < this.life;
  }
}

const AnimatedBackground = () => {
  const canvasRef = useRef(null);
  const particles = useRef([]);
  const parallaxParticles = useRef([]);
  const sparkles = useRef([]);
  const floatingIconsRef = useRef([]);
  const animationFrameId = useRef(null);
  const mousePosition = useRef({ x: null, y: null });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
    };

    const initializeParticles = () => {
      particles.current = [];
      parallaxParticles.current = [];
      const particleCount = Math.min(60, Math.floor((window.innerWidth * window.innerHeight) / 14000));
      const parallaxCount = Math.min(18, Math.floor((window.innerWidth * window.innerHeight) / 60000));
      for (let i = 0; i < particleCount; i++) {
        const x = rand(0, canvas.width);
        const y = rand(0, canvas.height);
        particles.current.push(new MedicalParticle(canvas, x, y, 1));
      }
      for (let i = 0; i < parallaxCount; i++) {
        const x = rand(0, canvas.width);
        const y = rand(0, canvas.height);
        parallaxParticles.current.push(new MedicalParticle(canvas, x, y, 2));
      }
    };

    const drawConnections = (time) => {
      particles.current.forEach((particle, index) => {
        for (let j = index + 1; j < particles.current.length; j++) {
          const dx = particles.current[j].x - particle.x;
          const dy = particles.current[j].y - particle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const maxDistance = 140;
          if (distance < maxDistance) {
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(particles.current[j].x, particles.current[j].y);
            // Glow effect
            ctx.shadowColor = `rgba(${particle.color},0.7)`;
            ctx.shadowBlur = 10;
            // Pulse effect
            const pulseTime = time * 0.001;
            const pulseIntensity = (Math.sin(pulseTime + distance * 0.05) + 1) * 0.5;
            const opacity = (1 - distance / maxDistance) * 0.32 * pulseIntensity;
            ctx.strokeStyle = `rgba(${particle.color}, ${opacity})`;
            ctx.lineWidth = 1.2;
            ctx.stroke();
            ctx.restore();
          }
        }
        // Connect to mouse
        if (mousePosition.current.x !== null && mousePosition.current.y !== null) {
          const dx = mousePosition.current.x - particle.x;
          const dy = mousePosition.current.y - particle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const maxDistance = 180;
          if (distance < maxDistance) {
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(mousePosition.current.x, mousePosition.current.y);
            ctx.shadowColor = `rgba(${particle.color},0.7)`;
            ctx.shadowBlur = 12;
            const pulseTime = time * 0.001;
            const pulseIntensity = (Math.sin(pulseTime + distance * 0.05) + 1) * 0.5;
            const opacity = (1 - distance / maxDistance) * 0.5 * pulseIntensity;
            ctx.strokeStyle = `rgba(${particle.color}, ${opacity})`;
            ctx.lineWidth = 1.7;
            ctx.stroke();
            ctx.restore();
          }
        }
      });
    };

    const animate = (time) => {
      // Multi-color gradient background
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, 'rgba(17,24,39,0.98)');
      gradient.addColorStop(0.3, 'rgba(59,130,246,0.10)');
      gradient.addColorStop(0.6, 'rgba(236,72,153,0.10)');
      gradient.addColorStop(1, 'rgba(17,24,39,0.98)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Parallax layer (blurred, large, slow)
      parallaxParticles.current.forEach(p => {
        p.update(time);
        p.draw(ctx, time);
      });

      // Main particles
      particles.current.forEach(p => {
        p.update(time);
        p.draw(ctx, time);
      });

      // Connections
      drawConnections(time);

      // Sparkles
      if (Math.random() < 0.07 && sparkles.current.length < 30) {
        sparkles.current.push(new Sparkle(canvas));
      }
      sparkles.current = sparkles.current.filter(s => s.isAlive());
      sparkles.current.forEach(s => {
        s.update();
        s.draw(ctx);
      });

      // Floating medical icons
      if (Math.random() < 0.012 && floatingIconsRef.current.length < 4) {
        floatingIconsRef.current.push(new FloatingIcon(canvas));
      }
      floatingIconsRef.current = floatingIconsRef.current.filter(i => i.isAlive());
      floatingIconsRef.current.forEach(i => {
        i.update();
        i.draw(ctx);
      });

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

