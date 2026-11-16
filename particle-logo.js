/**
 * particle-logo-canvas — Zero-dependency 2D Canvas logo particle runtime.
 * Full visual studio, 9 physics engines & Vue/React/GIF exports: https://particlelogo.com
 */

export function sampleSvgPath(svgPath, options = {}) {
  const size = options.size || 400;
  const viewBox = options.viewBox || 24;
  const step = options.step || 5;
  const pad = options.padding || 48;

  const off = document.createElement('canvas');
  off.width = size;
  off.height = size;
  const ctx = off.getContext('2d', { willReadFrequently: true });
  if (!ctx || typeof Path2D === 'undefined') return [];

  const scale = (size - pad * 2) / viewBox;
  ctx.translate(pad, pad);
  ctx.scale(scale, scale);
  ctx.fillStyle = '#ffffff';
  ctx.fill(new Path2D(svgPath));

  const data = ctx.getImageData(0, 0, size, size).data;
  const points = [];
  for (let y = 0; y < size; y += step) {
    for (let x = 0; x < size; x += step) {
      if (data[(y * size + x) * 4 + 3] > 110) {
        points.push([x, y]);
      }
    }
  }
  return points;
}

class Particle {
  constructor(tx, ty, w, h, color, index, size) {
    this.targetX = tx;
    this.targetY = ty;
    this.noiseX = Math.random() * w;
    this.noiseY = Math.random() * h;
    this.x = this.noiseX;
    this.y = this.noiseY;
    this.color = color;
    this.orderIndex = index;
    this.size = size;
    this.alpha = 1;
    this.impulseX = 0;
    this.impulseY = 0;
    const dx = tx - w * 0.5;
    const dy = ty - h * 0.5;
    this.angle = Math.atan2(dy, dx);
    this.distance = Math.sqrt(dx * dx + dy * dy);
  }

  update(progress, time, w, h, mouse, variant) {
    const cx = w * 0.5;
    const cy = h * 0.5;
    if (Math.abs(this.impulseX) > 0.05 || Math.abs(this.impulseY) > 0.05) {
      this.x += this.impulseX;
      this.y += this.impulseY;
      this.impulseX *= 0.88;
      this.impulseY *= 0.88;
    }

    const factor = Math.min(1, Math.max(0, progress / 100));
    if (variant === 'mobius-flow') {
      const pulse = Math.sin(time * 0.01 - this.orderIndex * 0.08);
      const offset = pulse * (1 - factor * 0.65) * 4.5;
      const dx = this.noiseX + (this.targetX - this.noiseX) * factor + Math.cos(this.angle) * offset;
      const dy = this.noiseY + (this.targetY - this.noiseY) * factor + Math.sin(this.angle) * offset;
      this.x += (dx - this.x) * 0.16;
      this.y += (dy - this.y) * 0.16;
      this.alpha = 0.35 + factor * 0.5 + (pulse > 0.6 ? 0.25 : 0);
    } else if (variant === 'vortex') {
      const angle = this.angle + (1 - factor) * Math.PI * 4.5 + time * 0.002;
      const dist = this.distance + (1 - factor) * Math.max(w, h) * 0.65;
      const vx = cx + Math.cos(angle) * dist;
      const vy = cy + Math.sin(angle) * dist;
      const dx = vx + (this.targetX - vx) * factor;
      const dy = vy + (this.targetY - vy) * factor;
      this.x += (dx - this.x) * 0.18;
      this.y += (dy - this.y) * 0.18;
      this.alpha = 0.3 + factor * 0.7;
    } else {
      const ease = factor < 0.8 ? factor / 0.8 : 1 + Math.sin((factor - 0.8) * Math.PI * 5) * 0.08 * (1 - factor);
      const dx = this.noiseX + (this.targetX - this.noiseX) * ease;
      const dy = this.noiseY + (this.targetY - this.noiseY) * ease;
      this.x += (dx - this.x) * 0.15;
      this.y += (dy - this.y) * 0.15;
      this.alpha = 0.35 + factor * 0.65;
    }

    if (mouse.active) {
      const mdx = this.x - mouse.x;
      const mdy = this.y - mouse.y;
      const distSq = mdx * mdx + mdy * mdy;
      if (distSq < 4900 && distSq > 0.01) {
        const dist = Math.sqrt(distSq);
        const force = (70 - dist) * 0.25;
        this.x += (mdx / dist) * force;
        this.y += (mdy / dist) * force;
      }
    }
  }

  draw(ctx) {
    ctx.globalAlpha = Math.max(0, Math.min(1, this.alpha));
    ctx.fillStyle = this.color;
    const half = this.size * 0.5;
    ctx.fillRect(this.x - half, this.y - half, this.size, this.size);
  }
}

export function createParticleLogo(container, options = {}) {
  const canvas = document.createElement('canvas');
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  canvas.style.display = 'block';
  container.innerHTML = '';
  container.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  const points = options.points || [];
  let variant = options.variant || 'condense';
  const duration = (options.duration || 2.8) * 1000;
  const colors = options.colors || ['#ffffff', '#e4e4e7', '#94a3b8'];
  const particleSize = options.particleSize || 2.0;

  let particles = [];
  let shockwaves = [];
  let width = 400;
  let height = 400;
  let startTime = performance.now();
  let lastProgress = 0;
  let rafId = 0;
  const mouse = { x: 0, y: 0, active: false };

  function init() {
    const rect = container.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = Math.max(120, Math.floor(rect.width) || 400);
    height = Math.max(120, Math.floor(rect.height) || 400);
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    for (const p of points) {
      if (p[0] < minX) minX = p[0];
      if (p[0] > maxX) maxX = p[0];
      if (p[1] < minY) minY = p[1];
      if (p[1] > maxY) maxY = p[1];
    }
    const bw = Math.max(1, maxX - minX);
    const bh = Math.max(1, maxY - minY);
    const cxPt = (minX + maxX) * 0.5;
    const cyPt = (minY + maxY) * 0.5;
    const scale = Math.min((width * 0.7) / bw, (height * 0.7) / bh);

    particles = points.map((p, idx) => {
      const tx = width * 0.5 + (p[0] - cxPt) * scale;
      const ty = height * 0.5 + (p[1] - cyPt) * scale;
      return new Particle(tx, ty, width, height, p[2] || colors[idx % colors.length], idx, particleSize);
    });
  }

  function frame(now) {
    ctx.clearRect(0, 0, width, height);
    const cycle = duration + 1200;
    const elapsed = (now - startTime) % cycle;
    const progress = elapsed < duration ? (elapsed / duration) * 100 : 100;

    if (progress < lastProgress && progress < 5) {
      for (const p of particles) {
        p.noiseX = Math.random() * width;
        p.noiseY = Math.random() * height;
      }
    }
    lastProgress = progress;

    for (let i = shockwaves.length - 1; i >= 0; i--) {
      const sw = shockwaves[i];
      sw.r += (120 - sw.r) * 0.14;
      sw.alpha *= 0.9;
      if (sw.alpha < 0.02) {
        shockwaves.splice(i, 1);
        continue;
      }
      ctx.save();
      ctx.strokeStyle = `rgba(255,255,255,${sw.alpha})`;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(sw.x, sw.y, sw.r, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    for (const p of particles) {
      p.update(progress, now, width, height, mouse, variant);
      p.draw(ctx);
    }
    ctx.globalAlpha = 1;
    rafId = requestAnimationFrame(frame);
  }

  canvas.addEventListener('mousemove', (e) => {
    const r = canvas.getBoundingClientRect();
    mouse.x = e.clientX - r.left;
    mouse.y = e.clientY - r.top;
    mouse.active = true;
  });
  canvas.addEventListener('mouseleave', () => {
    mouse.active = false;
  });
  canvas.addEventListener('click', (e) => {
    const r = canvas.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    shockwaves.push({ x, y, r: 0, alpha: 0.8 });
    for (const p of particles) {
      const dx = p.x - x;
      const dy = p.y - y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120 && dist > 0.1) {
        const force = (120 - dist) * 0.15;
        p.impulseX += (dx / dist) * force;
        p.impulseY += (dy / dist) * force;
      }
    }
  });

  const ro = new ResizeObserver(init);
  ro.observe(container);
  init();
  rafId = requestAnimationFrame(frame);

  return {
    setVariant(next) {
      variant = next;
      startTime = performance.now();
    },
    replay() {
      startTime = performance.now();
    },
    destroy() {
      cancelAnimationFrame(rafId);
      ro.disconnect();
    }
  };
}
