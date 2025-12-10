'use client';

import React, { useRef, useEffect, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import CyberTerrain from './CyberTerrain';

/* ========================================
   SCENE3D WRAPPER - R3F OPTIMIZATION
   ======================================== */

interface Scene3DProps {
  className?: string;
}

const Scene3D: React.FC<Scene3DProps> = ({ className = '' }) => {
  const mousePos = useRef({ x: 0, y: 0 });
  const reducedMotionRef = useRef(false);

  /* ========================================
     MOUSE TRACKING
     ======================================== */
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Normalize to -1 to 1
      mousePos.current = {
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1,
      };
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  /* ========================================
     REDUCED MOTION DETECTION
     ======================================== */
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    reducedMotionRef.current = mediaQuery.matches;

    const handleChange = (e: MediaQueryListEvent) => {
      reducedMotionRef.current = e.matches;
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return (
    <div className={`${className} pointer-events-none select-none`}>
      <Canvas
        camera={{
          position: [0, 2, 8],
          fov: 50,
          near: 0.1,
          far: 100,
        }}
        dpr={[1, 2]} // Prevent 4K render on retina - PERFORMANCE OPTIMIZATION
        gl={{
          antialias: false, // Raw/pixelated look + performance boost
          alpha: true,
          powerPreference: 'high-performance',
        }}
      >
        {/* Ambient Lighting */}
        <ambientLight intensity={0.3} />
        <directionalLight position={[5, 5, 5]} intensity={0.5} />

        {/* Terrain with Suspense Fallback */}
        <Suspense fallback={null}>
          <CyberTerrain
            mousePos={mousePos}
            reducedMotionRef={reducedMotionRef}
          />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default Scene3D;
