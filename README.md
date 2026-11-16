# particle-logo-canvas

**English** · [简体中文](./README_zh-CN.md)

Zero-dependency HTML5 2D Canvas logo particle animation micro-runtime (~3 KB minified). Samples any SVG path or `[x, y]` point list directly in the browser into 60FPS interactive particles with hover repulsion and click shockwaves.

Need the full visual studio, PNG/SVG/JPG/WebP tight-bounds sampling, all **9 physics engines**, **3,400+ searchable brand icons**, or 1-click **Vue 3 / React / GIF / 4K Video** export?
👉 **[Open Particle Logo Workbench](https://particlelogo.com/workbench)** · **[Browse 24 Live Tech Brand Templates](https://particlelogo.com/templates)**

![Particle Logo 2D Canvas Demo](./assets/demo.gif)

## Features

- **Zero runtime dependencies**: Plain 2D Canvas + `requestAnimationFrame` (~3 KB minified), with no Three.js, GSAP, or WebGL shaders required.
- **Built-in SVG path sampler**: `sampleSvgPath()` rasterizes SVG `d` paths on an offscreen canvas with configurable grid `step`.
- **Three physics presets included**: `condense` (quantum condense), `mobius-flow` (Möbius traveling wave), and `vortex` (rotational singularity vortex).
- **Cursor interaction & click shockwaves**: Hovering repels nearby particles; clicking triggers a radial shockwave impulse.
- **HiDPI responsive**: Uses `ResizeObserver` and clamps `devicePixelRatio` up to `2`.

## Why 2D Canvas instead of Lottie or Three.js?

| Approach | Typical Runtime + Asset Size | Interactive Physics (Hover/Click) | Setup |
| :--- | :--- | :--- | :--- |
| Lottie (`lottie-web`) | ~250 KB+ player + JSON | Static keyframe playback | After Effects / Bodymovin |
| Three.js WebGL | ~500 KB+ bundle | Custom shaders needed | Scene, camera, buffers |
| **Particle Logo Canvas** | **~3–13 KB gzipped total** | **Built-in repulsion & shockwaves** | **Drop in 1 script or component** |

## Quick Start

Serve this directory locally (`npx serve .`) and open `index.html`, or import `createParticleLogo` as an ES module:

```html
<div id="logo-stage" style="width: 420px; height: 420px;"></div>
<script type="module">
  import { createParticleLogo, sampleSvgPath } from './particle-logo.js';

  // Sample any SVG path (24x24 viewBox) or pass your own [x, y, color?] coordinates
  const points = sampleSvgPath('m12 1.608 12 20.784H0Z', {
    size: 400,
    step: 5
  });

  const instance = createParticleLogo(document.getElementById('logo-stage'), {
    points,
    variant: 'condense', // 'condense' | 'mobius-flow' | 'vortex'
    duration: 2.8,
    colors: ['#ffffff', '#e4e4e7', '#94a3b8'],
    particleSize: 2.0
  });
</script>
```

## API Reference

- `sampleSvgPath(svgPath, options?)`: `{ size = 400, viewBox = 24, step = 5, padding = 48 }` → returns `Array<[x, y]>`.
- `createParticleLogo(container, options?)`: `{ points, variant = 'condense', duration = 2.8, colors, particleSize = 2.0 }` → returns `{ setVariant(next), replay(), destroy() }`.

## Full Visual Generator & All 9 Physics Engines

This open-source micro-runtime includes 3 core physics presets (`condense`, `mobius-flow`, `vortex`). For the complete toolkit—including smart PNG/SVG/JPG/WebP sampling, mask debugging, **9 physics laws** (`Diffusion Denoise`, `Hologram Raster Scan`, `Superconducting Flux Wave`, `Autonomous Swarm Assembly`, `Slingshot Time Reversal`, `Cymatics Resonance`), **3,400+ built-in brand icons**, and **GIF / 4K Video / Vue 3 / React / Framer** exports—use the browser studio:

- Studio Workbench: https://particlelogo.com/workbench
- Particle Text Generator: https://particlelogo.com/typography
- 24 Interactive Tech Stack Templates: https://particlelogo.com/templates
- Integration Guides (Next.js, Vue 3, Astro, Nuxt, GitHub README): https://particlelogo.com/guides

## Changelog & License

- See [CHANGELOG.md](./CHANGELOG.md)
- MIT © [Particle Logo Studio](https://particlelogo.com)
