# 🎨 3D Hero Background - Quick Reference

## Component Tree

```
Hero.tsx
└── Scene3D (Lazy Loaded)
    └── Canvas (R3F)
        ├── Lights
        │   ├── ambientLight (0.3)
        │   └── directionalLight (0.5)
        └── CyberTerrain
            └── ShaderMaterial
                ├── Vertex Shader (terrain deformation)
                └── Fragment Shader (grid + scanlines)
```

## Color Mapping

```typescript
CSS Variables          →  Three.js Shaders
--color-accent         →  COLORS.acid (#d4ff00)
--color-paper-dark     →  COLORS.grid (#0a0a0a)
--color-ink-dark       →  COLORS.phosphor (#e0e0e0)
```

## Performance Stack

```
Layer 1: Lazy Loading (Code Splitting)
         ↓
Layer 2: Canvas dpr={[1,2]} (Pixel Density Cap)
         ↓
Layer 3: antialias: false (Raw Look + Speed)
         ↓
Layer 4: GPU Shaders (Math-based, not texture-based)
         ↓
Layer 5: will-change: transform (CSS Optimization)
```

## Accessibility Flow

```
User Setting: prefers-reduced-motion
         ↓
MediaQuery Listener
         ↓
reducedMotion State
         ↓
CyberTerrain receives prop
         ↓
useFrame skips animation
```

## File Structure

```
src/
├── components/
│   ├── sections/
│   │   └── Hero.tsx           [3D Background Integration]
│   └── three/
│       ├── Scene3D.tsx        [R3F Canvas + Mouse Tracking]
│       └── CyberTerrain.tsx   [GLSL Shaders + Geometry]
├── lib/
│   └── constants.ts           [COLORS for shaders]
└── app/
    └── globals.css            [Mix-blend utilities]
```

## Usage Example

```tsx
// In Hero.tsx
<Suspense fallback={<div className="w-full h-full bg-paper" />}>
  <Scene3D className="w-full h-full" />
</Suspense>

// Title with auto-contrast
<h1 className="mix-blend-difference">ANTON AHMAD SUSILO</h1>
```

## Browser DevTools Tips

1. **Check FPS**: Enable "FPS meter" in Chrome DevTools
2. **Verify WebGL**: Visit `chrome://gpu` to check WebGL2 support
3. **Inspect Uniforms**: Use Three.js DevTools extension
4. **Profile Shaders**: Use Chrome's WebGL Inspector

## Common Issues & Fixes

| Issue                | Fix                                      |
| -------------------- | ---------------------------------------- |
| Black screen         | Check WebGL2 support in browser          |
| Low FPS              | Verify `dpr={[1,2]}` is set              |
| Jittery mouse        | Increase lerp factor in useFrame         |
| Text not contrasting | Ensure `mix-blend-difference` is applied |
| Scene not loading    | Check Suspense fallback component        |
