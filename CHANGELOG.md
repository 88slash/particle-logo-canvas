# Changelog

All notable changes to `particle-logo-canvas` are documented in this file.

## [1.0.0] - 2026-11-16

### Added
- Zero-dependency ESM 2D Canvas runtime (`particle-logo.js`) with automatic `ResizeObserver` HiDPI scaling (`dpr` capped at `2`).
- Synchronous `Path2D` SVG path pixel sampler (`sampleSvgPath`) with configurable grid `step`, `size`, `viewBox`, and `padding`.
- Three built-in physics presets (`condense`, `mobius-flow`, `vortex`) plus interactive hover repulsion and radial click shockwave impulses.
- Instance lifecycle controls: `setVariant(next)`, `replay()`, and `destroy()`.
- Browser demo (`index.html`), animated preview GIF (`assets/demo.gif`), and bilingual documentation (`README.md` / `README_zh-CN.md`).
