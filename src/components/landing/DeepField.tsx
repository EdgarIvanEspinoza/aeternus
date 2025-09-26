'use client'

import React, { useEffect, useRef } from 'react';

/**
 * DeepField
 * Lightweight 2.5D animated background: layered parallax particle field + soft energy waves.
 * Goals:
 *  - Add depth below the fold (post-Hero) without overpowering text
 *  - Responsive performance (caps particles on mobile, throttled resize)
 *  - Respects prefers-reduced-motion
 */
type DeepFieldProps = {
  intensity?: number;            // scales particle count (clamped)
  variant?: 'calm' | 'energetic'; // energetic adds streaks + higher contrast
  speed?: number;                // global speed multiplier
  brightness?: number;           // post brightness factor (canvas filter)
  mode?: 'section' | 'fixed';    // fixed = covers whole viewport persistently
};

export const DeepField: React.FC<DeepFieldProps> = ({ intensity = 1, variant = 'calm', speed = 1, brightness = 1.05, mode = 'section' }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number>();
  const particlesRef = useRef<Particle[]>([]);
  const lastFrameRef = useRef<number>(0);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight * 1.2; // extend a bit downward

    const DPR = Math.min(2, window.devicePixelRatio || 1);
    canvas.width = width * DPR;
    canvas.height = height * DPR;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.scale(DPR, DPR);

  const MAX_PARTICLES_DESKTOP = variant === 'energetic' ? 240 : 160;
  const MAX_PARTICLES_MOBILE = variant === 'energetic' ? 110 : 70;
    const isMobile = window.innerWidth < 768;
  const safeIntensity = Math.min(5, Math.max(0.2, intensity));
  const targetCount = prefersReducedMotion ? 0 : (isMobile ? MAX_PARTICLES_MOBILE : MAX_PARTICLES_DESKTOP) * safeIntensity;

    particlesRef.current = initParticles(targetCount, width, height);

    const handleResize = throttle(() => {
      width = window.innerWidth;
      height = window.innerHeight * 1.2;
      canvas.width = width * DPR;
      canvas.height = height * DPR;
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
      ctx.reset();
      ctx.scale(DPR, DPR);
      particlesRef.current = initParticles(targetCount, width, height);
    }, 400);

    const handleMouse = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX / width;
      mouseRef.current.y = e.clientY / height;
    };
    window.addEventListener('mousemove', handleMouse);
    window.addEventListener('resize', handleResize);

    const animate = (t: number) => {
      rafRef.current = requestAnimationFrame(animate);
      if (prefersReducedMotion) return; // freeze
  const dt = Math.min(0.05, (t - lastFrameRef.current) / 1000 || 0.016) * speed;
      lastFrameRef.current = t;
      ctx.clearRect(0, 0, width, height);

      // Soft gradient wash
      const grad = ctx.createRadialGradient(
        width * 0.5,
        height * 0.2,
        40,
        width * 0.5,
        height * 0.6,
        Math.max(width, height) * 0.9
      );
      grad.addColorStop(0, 'rgba(139,92,246,0.12)');
      grad.addColorStop(0.4, 'rgba(88,28,135,0.08)');
      grad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Energy wave (simple noise-ish sine layering)
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      if (variant === 'energetic') {
        drawWave(ctx, width, height, t, 0.6, 'rgba(167,139,250,0.07)');
        drawWave(ctx, width, height, t + 900, 1.0, 'rgba(192,132,252,0.085)');
      } else {
        drawWave(ctx, width, height, t, 0.6, 'rgba(167,139,250,0.045)');
        drawWave(ctx, width, height, t + 1200, 0.9, 'rgba(192,132,252,0.05)');
      }
      ctx.restore();

      // Particles
      const mx = (mouseRef.current.x - 0.5) * 2;
      const my = (mouseRef.current.y - 0.5) * 2;
      for (const p of particlesRef.current) {
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.life += dt;
        if (p.x < -50 || p.x > width + 50 || p.y < -50 || p.y > height + 50) {
          resetParticle(p, width, height);
          continue;
        }
        // Parallax drift influenced by mouse
        const parallax = (p.depth * 0.6 + 0.4);
        const px = p.x + mx * 30 * (1 - p.depth);
        const py = p.y + my * 20 * (1 - p.depth);

        const o = Math.min(1, Math.max(0, 1 - p.life / p.maxLife));
        if (variant === 'energetic' && p.depth < 0.5 && Math.random() < 0.15) {
            // streak
            const len = 18 * (1 - p.depth) * (0.5 + Math.random());
            ctx.beginPath();
            ctx.strokeStyle = `rgba(210,180,255,${0.05 + 0.25 * o})`;
            ctx.lineWidth = (0.6 + p.size * 0.2) * parallax;
            ctx.moveTo(px, py);
            ctx.lineTo(px - p.vx * 0.35 * len, py - p.vy * 0.35 * len);
            ctx.stroke();
        } else {
          ctx.beginPath();
          const base = variant === 'energetic' ? 0.06 : 0.04;
          ctx.fillStyle = `rgba(209,178,255,${base * parallax + o * (variant === 'energetic' ? 0.22 : 0.15)})`;
          ctx.arc(px, py, p.size * parallax * (variant === 'energetic' ? 1.2 : 1), 0, Math.PI * 2);
          ctx.fill();
        }
      }
    };
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouse);
      window.removeEventListener('resize', handleResize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [intensity, prefersReducedMotion, variant, speed]);

  const containerClass = mode === 'fixed'
    ? 'pointer-events-none fixed inset-0 z-0 overflow-hidden'
    : 'pointer-events-none absolute inset-0 z-0 overflow-hidden [mask-image:linear-gradient(to_bottom,rgba(0,0,0,0.08),black_12%,black_85%,rgba(0,0,0,0))]';

  return (
    <div aria-hidden className={containerClass}>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ filter: `blur(0.3px) brightness(${brightness})` }}
      />
      <div className="absolute inset-0 mix-blend-screen opacity-[0.35] bg-[radial-gradient(circle_at_70%_30%,rgba(168,85,247,0.12),transparent_60%)]" />
    </div>
  );
};

// Particle types
interface Particle {
  x: number; y: number; vx: number; vy: number; size: number; depth: number; life: number; maxLife: number;
}

function initParticles(count: number, w: number, h: number): Particle[] {
  const arr: Particle[] = [];
  for (let i = 0; i < count; i++) arr.push(makeParticle(w, h));
  return arr;
}
function makeParticle(w: number, h: number): Particle {
  const depth = Math.random();
  return {
    x: Math.random() * w,
    y: Math.random() * h,
    vx: (Math.random() - 0.5) * (14 + depth * 10),
    vy: (Math.random() - 0.5) * (10 + depth * 6),
    size: 0.8 + Math.random() * 2.2,
    depth,
    life: 0,
    maxLife: 6 + Math.random() * 10
  };
}
function resetParticle(p: Particle, w: number, h: number) {
  const np = makeParticle(w, h);
  Object.assign(p, np);
}

// Simple wave renderer
function drawWave(ctx: CanvasRenderingContext2D, w: number, h: number, t: number, scale: number, color: string) {
  ctx.beginPath();
  const amp = 40 * scale;
  for (let x = 0; x <= w; x += 8) {
    const px = x / w;
    const y = Math.sin(px * 6 + t * 0.0004 * scale) + Math.sin(px * 11 + t * 0.00022 * (1.2 - scale));
    const ny = (y * 0.5) * amp + h * 0.55;
    if (x === 0) ctx.moveTo(x, ny); else ctx.lineTo(x, ny);
  }
  ctx.strokeStyle = color;
  ctx.lineWidth = 1.2 * scale;
  ctx.stroke();
}

// Utilities
function throttle<T extends (...args: unknown[]) => void>(fn: T, wait: number): T {
  let last = 0; let scheduled: ReturnType<typeof setTimeout> | null = null;
  return function(this: unknown, ...args: unknown[]) {
    const now = Date.now();
    const remaining = wait - (now - last);
    if (remaining <= 0) {
      last = now;
      fn.apply(this, args as unknown as Parameters<T>);
    } else if (!scheduled) {
      scheduled = setTimeout(() => {
        last = Date.now();
        scheduled = null;
        fn.apply(this, args as unknown as Parameters<T>);
      }, remaining);
    }
  } as T;
}

function usePrefersReducedMotion(): boolean {
  const [prefers, setPrefers] = React.useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefers(mq.matches);
    const handler = () => setPrefers(mq.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);
  return prefers;
}

export default DeepField;
