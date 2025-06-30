"use client"

import React, { useEffect, useRef } from 'react';

class DNAStrand {
  constructor(canvas, x, color1, color2) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.x = x;
    this.baseX = x;
    this.offset = Math.random() * 1000; // Random starting point for the wave
    this.speed = 0.5 + Math.random() * 0.5;
    this.amplitude = 70 + Math.random() * 30; // How wide the helix is
    this.segmentCount = 15 + Math.floor(Math.random() * 10);
    this.segmentSpacing = canvas.height / this.segmentCount;
    this.color1 = color1;
    this.color2 = color2;
    this.thickness = 2 + Math.random() * 2;
    this.direction = Math.random() > 0.5 ? 1 : -1; // Direction of movement
    this.nucleobases = [];
    this.crossConnections = [];
    this.initialize();
  }

  initialize() {
    // Create nucleobases (dots) along the DNA strands
    for (let i = 0; i < this.segmentCount; i++) {
      const y = i * this.segmentSpacing;
      
      // First strand base
      this.nucleobases.push({
        strand: 1,
        y: y,
        size: 3 + Math.random() * 2,
        originalSize: 3 + Math.random() * 2,
        opacity: 0.6 + Math.random() * 0.4,
        hue: Math.random() > 0.5 ? 10 : 190, // Randomly choose between red-ish and blue-ish
        type: Math.floor(Math.random() * 4) // DNA base type (A, T, G, C)
      });
      
      // Second strand base (complementary)
      this.nucleobases.push({
        strand: 2,
        y: y,
        size: 3 + Math.random() * 2,
        originalSize: 3 + Math.random() * 2,
        opacity: 0.6 + Math.random() * 0.4,
        hue: Math.random() > 0.5 ? 130 : 280, // Randomly choose between green-ish and purple-ish
        type: 3 - Math.floor(Math.random() * 4) // Complementary base
      });
      
      // Create cross connections between bases (if not at the end)
      if (i > 0 && i < this.segmentCount - 1 && Math.random() > 0.3) {
        this.crossConnections.push({
          y: y,
          opacity: 0.3 + Math.random() * 0.3,
          width: 1 + Math.random()
        });
      }
    }
  }

  update(time) {
    // Make strand wave and move slightly
    this.offset += this.speed * 0.01 * this.direction;
    this.x = this.baseX + Math.sin(time * 0.001 + this.offset) * 20;
    
    // Animate nucleobases
    this.nucleobases.forEach(base => {
      // Pulse the size of nucleobases
      const pulseFactor = Math.sin(time * 0.002 + base.y * 0.1) * 0.2 + 0.8;
      base.size = base.originalSize * pulseFactor;
      
      // Slight vertical movement to add more life
      base.y += Math.sin(time * 0.001 + base.y * 0.05) * 0.2;
      
      // Reset if moved out of bounds
      if (base.y > this.canvas.height) {
        base.y = 0;
      } else if (base.y < 0) {
        base.y = this.canvas.height;
      }
    });
  }

  draw(time) {
    const ctx = this.ctx;
    
    // Draw the two helical strands
    for (let strand = 1; strand <= 2; strand++) {
      ctx.beginPath();
      
      const points = [];
      for (let i = 0; i < this.segmentCount; i++) {
        const y = i * this.segmentSpacing;
        const wavePos = (time * 0.002 + i * 0.2 + this.offset);
        const xOffset = Math.sin(wavePos) * this.amplitude;
        const x = strand === 1 ? this.x + xOffset : this.x - xOffset;
        points.push({ x, y });
      }
      
      // Create a smooth curve through the points
      ctx.moveTo(points[0].x, points[0].y);
      for (let i = 0; i < points.length - 1; i++) {
        const xc = (points[i].x + points[i + 1].x) / 2;
        const yc = (points[i].y + points[i + 1].y) / 2;
        ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
      }
      
      // Set strand styles
      const gradient = ctx.createLinearGradient(
        this.x - this.amplitude, 0, 
        this.x + this.amplitude, this.canvas.height
      );
      
      if (strand === 1) {
        gradient.addColorStop(0, `rgba(${this.color1}, 0.7)`);
        gradient.addColorStop(1, `rgba(${this.color2}, 0.7)`);
      } else {
        gradient.addColorStop(0, `rgba(${this.color2}, 0.7)`);
        gradient.addColorStop(1, `rgba(${this.color1}, 0.7)`);
      }
      
      ctx.strokeStyle = gradient;
      ctx.lineWidth = this.thickness;
      ctx.stroke();
    }
    
    // Draw cross connections (hydrogen bonds)
    this.crossConnections.forEach(conn => {
      const wavePos = time * 0.002 + conn.y * 0.1 + this.offset;
      const x1 = this.x + Math.sin(wavePos) * this.amplitude;
      const x2 = this.x - Math.sin(wavePos) * this.amplitude;
      
      ctx.beginPath();
      ctx.moveTo(x1, conn.y);
      ctx.lineTo(x2, conn.y);
      ctx.strokeStyle = `rgba(255, 255, 255, ${conn.opacity})`;
      ctx.lineWidth = conn.width;
      ctx.stroke();
    });
    
    // Draw nucleobases (the colored dots)
    this.nucleobases.forEach(base => {
      // Position the base on the right strand
      const wavePos = time * 0.002 + base.y * 0.1 + this.offset;
      const xOffset = Math.sin(wavePos) * this.amplitude;
      const x = base.strand === 1 ? this.x + xOffset : this.x - xOffset;
      
      // Draw the base
      ctx.beginPath();
      ctx.arc(x, base.y, base.size, 0, Math.PI * 2);
      
      // Color based on type (A, T, G, C)
      let baseColor;
      switch(base.type) {
        case 0: baseColor = `hsla(${10 + time * 0.01 % 20}, 100%, 70%, ${base.opacity})`; break; // Adenine (red)
        case 1: baseColor = `hsla(${200 + time * 0.01 % 20}, 100%, 70%, ${base.opacity})`; break; // Thymine (blue)
        case 2: baseColor = `hsla(${130 + time * 0.01 % 20}, 100%, 70%, ${base.opacity})`; break; // Guanine (green)
        case 3: baseColor = `hsla(${280 + time * 0.01 % 20}, 100%, 70%, ${base.opacity})`; break; // Cytosine (purple)
      }
      
      ctx.fillStyle = baseColor;
      ctx.fill();
    });
  }
}

const AnimatedBackground = () => {
  const canvasRef = useRef(null);
  const strands = useRef([]);
  const animationFrameId = useRef(null);
  const startTime = useRef(Date.now());

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // Define color palettes for DNA strands
    const colorPalettes = [
      ["59, 130, 246", "99, 102, 241"], // Blue - Indigo 
      ["139, 92, 246", "219, 39, 119"], // Purple - Pink
      ["6, 182, 212", "16, 185, 129"],  // Cyan - Emerald
      ["99, 102, 241", "236, 72, 153"]  // Indigo - Pink
    ];

    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.scale(dpr, dpr);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
    };

    const initializeStrands = () => {
      strands.current = [];
      // Create fewer, but more detailed strands
      const strandCount = Math.max(3, Math.floor(window.innerWidth / 350));
      
      for (let i = 0; i < strandCount; i++) {
        const palette = colorPalettes[Math.floor(Math.random() * colorPalettes.length)];
        const x = (i + 0.5) * (window.innerWidth / strandCount);
        strands.current.push(new DNAStrand(canvas, x, palette[0], palette[1]));
      }
    };

    const animate = () => {
      const currentTime = Date.now() - startTime.current;
      
      // Partially clear the canvas with a semi-transparent black rectangle for trail effect
      ctx.fillStyle = 'rgba(17, 24, 39, 0.1)'; // Dark background with opacity for trails
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw gradient background
      const bgGradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      bgGradient.addColorStop(0, 'rgba(17, 24, 39, 0.01)');   // Gray-900
      bgGradient.addColorStop(0.5, 'rgba(31, 41, 55, 0.01)'); // Gray-800
      bgGradient.addColorStop(1, 'rgba(17, 24, 39, 0.01)');   // Gray-900
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Update and draw strands
      strands.current.forEach(strand => {
        strand.update(currentTime);
        strand.draw(currentTime);
      });
      
      animationFrameId.current = requestAnimationFrame(animate);
    };

    resizeCanvas();
    initializeStrands();
    animate();

    window.addEventListener('resize', () => {
      resizeCanvas();
      initializeStrands();
    });

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full -z-10"
      style={{ 
        background: 'linear-gradient(to bottom right, #111827, #1e3a8a)' // Dark blue gradient
      }}
    />
  );
};

export default AnimatedBackground;

