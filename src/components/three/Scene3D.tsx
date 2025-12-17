'use client';

import React, {
  useRef,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from 'react';
import { Canvas } from '@react-three/fiber';
import { ErrorBoundary } from 'react-error-boundary';
import CyberTerrain from './CyberTerrain';

/* ========================================
   TYPES
   ======================================== */
interface Scene3DProps {
  className?: string;
  enableOnDemand?: boolean; // MVP: false, Scaling: true
  maxFPS?: number; // Frame limiter for low-end devices
}

interface MousePosition {
  x: number;
  y: number;
}

/* ========================================
   FALLBACK COMPONENTS
   ======================================== */
const SceneFallback: React.FC = () => null;

const SceneError: React.FC<{
  error: Error;
  resetErrorBoundary: () => void;
}> = ({ error, resetErrorBoundary }) => (
  <div
    className="absolute inset-0 flex items-center justify-center bg-slate-900 text-white"
    role="alert"
  >
    <div className="max-w-md p-6 text-center">
      <h2 className="mb-2 text-xl font-semibold">3D Scene Error</h2>
      <p className="mb-4 text-sm text-slate-400">
        {process.env.NODE_ENV === 'development'
          ? error.message
          : 'Failed to load 3D scene'}
      </p>
      <button
        onClick={resetErrorBoundary}
        className="rounded bg-cyan-600 px-4 py-2 transition-colors hover:bg-cyan-700"
        type="button"
      >
        Reload Scene
      </button>
    </div>
  </div>
);

/* ========================================
   PERFORMANCE MONITOR (QA LENS)
   ======================================== */
const usePerformanceMonitor = (enabled: boolean) => {
  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return;

    let frameCount = 0;
    let lastTime = performance.now();
    let rafId: number;

    const monitor = () => {
      frameCount++;
      const now = performance.now();

      if (now >= lastTime + 1000) {
        const fps = Math.round((frameCount * 1000) / (now - lastTime));

        // Log performance warnings
        if (fps < 30) {
          console.warn(`[Scene3D] Low FPS detected: ${fps}`);
        }

        frameCount = 0;
        lastTime = now;
      }

      rafId = requestAnimationFrame(monitor);
    };

    rafId = requestAnimationFrame(monitor);
    return () => cancelAnimationFrame(rafId);
  }, [enabled]);
};

/* ========================================
   MAIN COMPONENT
   ======================================== */
const Scene3D: React.FC<Scene3DProps> = ({
  className = '',
  enableOnDemand = false, // Always render for animations by default
  maxFPS = 60,
}) => {
  // Reactive state instead of refs for props
  const [mousePos, setMousePos] = useState<MousePosition>({ x: 0, y: 0 });
  const lastFrameTime = useRef(0);

  /* ========================================
     PERFORMANCE MONITORING
     ======================================== */
  usePerformanceMonitor(process.env.NODE_ENV === 'development');

  /* ========================================
     MOUSE TRACKING (DEBOUNCED)
     ======================================== */
  useEffect(() => {
    const frameInterval = 1000 / maxFPS;

    const handleMouseMove = (e: MouseEvent) => {
      const now = performance.now();

      // Frame throttling
      if (now - lastFrameTime.current < frameInterval) return;
      lastFrameTime.current = now;

      setMousePos({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1,
      });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [maxFPS]);

  /* ========================================
     REDUCED MOTION DETECTION (A11Y)
     ======================================== */
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
    return false;
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  /* ========================================
     ERROR RESET HANDLER
     ======================================== */
  const handleErrorReset = useCallback(() => {
    // Optional: Log to analytics
    console.info('[Scene3D] Error boundary reset');
  }, []);

  /* ========================================
     CANVAS CONFIG (MEMOIZED)
     ======================================== */
  const canvasConfig = useMemo(
    () => ({
      camera: {
        position: [0, 2, 8] as [number, number, number],
        fov: 50,
        near: 0.1,
        far: 100,
      },
      dpr: [1, 2] as [number, number],
      gl: {
        antialias: false,
        alpha: true,
        powerPreference: 'high-performance' as const,
        stencil: false, // Disable if not using stencil ops
        depth: true,
      },
      // On-demand rendering config
      frameloop: enableOnDemand ? ('demand' as const) : ('always' as const),
    }),
    [enableOnDemand]
  );

  return (
    <ErrorBoundary
      FallbackComponent={SceneError}
      onReset={handleErrorReset}
      resetKeys={[mousePos, prefersReducedMotion]} // Reset on state change
    >
      <div
        className={`${className} pointer-events-none select-none`}
        role="img"
        aria-label="Interactive 3D cyberpunk terrain visualization"
      >
        {/* Skip link for keyboard users (WCAG AA) */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:bg-cyan-600 focus:px-4 focus:py-2 focus:text-white"
        >
          Skip 3D scene
        </a>

        <Canvas {...canvasConfig}>
          {/* Lighting */}
          <ambientLight intensity={0.3} />
          <directionalLight position={[5, 5, 5]} intensity={0.5} />

          {/* Terrain with proper fallback */}
          <React.Suspense fallback={<SceneFallback />}>
            <CyberTerrain
              mousePos={mousePos}
              prefersReducedMotion={prefersReducedMotion}
            />
          </React.Suspense>
        </Canvas>
      </div>
    </ErrorBoundary>
  );
};

export default Scene3D;
