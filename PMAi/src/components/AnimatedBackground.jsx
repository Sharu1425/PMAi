"use client"

import React, { useEffect, useRef } from 'react';

class DNAStrand {
  constructor(canvas, x) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.x = x;
    this.particles = [];
    this.particleCount = 20;
    this.initialize();
  }

  initialize() {
    for (let i = 0; i < this.particleCount; i++) {
      this.particles.push({
        y: (this.canvas.height / this.particleCount) * i,
        speed: Math.random() * 2 + 1,
        size: Math.random() * 3 + 2,
        opacity: Math.random() * 0.5 + 0.2
      });
    }
  }

  update() {
    this.particles.forEach(particle => {
      particle.y += particle.speed;
      if (particle.y > this.canvas.height) {
        particle.y = 0;
      }
    });
  }

  draw() {
    this.ctx.beginPath();
    this.ctx.strokeStyle = `rgba(99, 102, 241, ${this.particles[0].opacity})`;
    this.ctx.lineWidth = 1;

    this.particles.forEach((particle, i) => {
      if (i === 0) {
        this.ctx.moveTo(this.x, particle.y);
      } else {
        const prevParticle = this.particles[i - 1];
        const cp1x = this.x + 50;
        const cp1y = prevParticle.y;
        const cp2x = this.x - 50;
        const cp2y = particle.y;
        this.ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, this.x, particle.y);
      }
    });

    this.ctx.stroke();

    this.particles.forEach(particle => {
      this.ctx.beginPath();
      this.ctx.arc(this.x, particle.y, particle.size, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(99, 102, 241, ${particle.opacity})`;
      this.ctx.fill();
    });
  }
}

const AnimatedBackground = () => {
  const canvasRef = useRef(null);
  const strands = useRef([]);
  const animationFrameId = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const initializeStrands = () => {
      strands.current = [];
      const strandCount = Math.floor(canvas.width / 200);
      for (let i = 0; i < strandCount; i++) {
        strands.current.push(new DNAStrand(canvas, (i + 1) * (canvas.width / (strandCount + 1))));
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      strands.current.forEach(strand => {
        strand.update();
        strand.draw();
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
      style={{ background: 'linear-gradient(to bottom right, #1a1a1a, #2d2d2d)' }}
    />
  );
};

export default AnimatedBackground;

