# SceneBackground Removal — Cleanup Report

**Date:** 2026-05-23  
**Scope:** Full-page WebGL `SceneBackground` removed; CSS cinematic backdrop + modular effects scaffold added.

---

## Phase 1 — Removed Dead Background Logic

### Deleted files

| File | Reason |
|------|--------|
| `frontend/src/components/webgl/SceneBackground.tsx` | Full-page WebGL canvas |
| `frontend/src/lib/webgl/particles.ts` | Particle helpers only used by SceneBackground |
| `frontend/src/hooks/useScrollProgress.ts` | Scroll-driven camera rig for SceneBackground |
| `frontend/src/hooks/useMediaQuery.ts` | Only consumer was SceneBackground |

### Removed from `PageShell`

- Dynamic import of `SceneBackground`
- Duplicate `noise-overlay` div (noise merged into `CinematicBackground`)

### Retained (About section)

| Asset | Status |
|-------|--------|
| `AboutVisual.tsx` | **Kept** — CSS-only (no WebGL) |
| `AboutScene.tsx` | Already removed in prior pass |
| About visual CSS (`.about-visual-*`) | **Kept** — optimized (radial gradients vs `filter: blur`) |

### `theme.ts`

- Removed `NEON_PALETTE` (only used by deleted particle utils)
- Kept `THEME` tokens for JS/CSS parity

---

## Phase 2 — Dependency Cleanup

### Removed packages

| Package | Role |
|---------|------|
| `three` | WebGL math/rendering |
| `@react-three/fiber` | React renderer |
| `@react-three/drei` | R3F helpers (Stars, Float, etc.) |
| `@types/three` | Type definitions |

### Retained packages

| Package | Role |
|---------|------|
| `framer-motion` | Section reveals, service cards, form |
| `lenis` | Smooth scroll (disabled when `prefers-reduced-motion`) |
| `next`, `react`, `react-dom` | Core framework |

### Bundle size estimate

| Metric | Before (approx.) | After (approx.) |
|--------|------------------|-----------------|
| Client JS from Three/R3F chunk | ~250–400 KB gzip | **0** |
| `node_modules` install size | +~45 MB (three ecosystem) | **removed** |
| Main thread RAF loops | Canvas `useFrame` + scroll listener | **0** from background |
| GPU | Continuous WebGL draw | CSS compositor only |

*Run `npm run build` and compare `.next/static/chunks` before/after for exact numbers in your environment.*

---

## Phase 3 — CSS Cinematic Background

### New component

`frontend/src/components/effects/CinematicBackground.tsx`

### Features

- Solid fallback: `background-color: #020408` on root layer
- Layered radial gradients (cyan / purple / magenta) at low opacity
- Vignette for depth and text readability
- Ultra-light SVG noise tile (`opacity: 0.028`)
- `cinematic-drift` animation via `transform` only (GPU-friendly)
- **Mobile:** static gradients, fewer glow layers, smaller noise tile
- **`prefers-reduced-motion`:** all drift animations disabled

### About visual optimization

- Replaced `filter: blur(40px)` on orbs with radial-gradient falloff (cheaper on mobile GPUs)

---

## Phase 4 — Performance Validation Checklist

| Check | Status |
|-------|--------|
| No imports to deleted modules | ✅ Verified via grep |
| No WebGL folder remaining | ✅ `frontend/src/components/webgl/` empty/removed |
| Hero orbs gated on mobile (`useEffectCapabilities`) | ✅ |
| Reduced-motion respected | ✅ CSS + hooks |
| No layout shift from background | ✅ `position: fixed`, `contain: strict` |
| Build passes | Run `npm install && npm run build` |

---

## Phase 5 — Future Effects Architecture

| Path | Purpose |
|------|---------|
| `frontend/src/lib/effects/types.ts` | `EffectDefinition` + `EffectContext` |
| `frontend/src/lib/effects/registry.ts` | Register lazy-loadable effects |
| `frontend/src/hooks/useEffectCapabilities.ts` | `reducedMotion`, `coarsePointer`, `lowPower` gates |

**Rules for future effects:**

1. Register in `effectRegistry` with `load: () => import(...)`
2. Gate with `enabled(ctx)` — never assume desktop/mouse
3. No full-page Canvas / WebGL
4. Prefer CSS; use JS animation only when necessary

---

## Migration Notes

1. Run `npm install` to prune lockfile after dependency removal.
2. No env changes required for background.
3. Visual identity preserved: same palette, depth, and dark luxury feel without WebGL.
