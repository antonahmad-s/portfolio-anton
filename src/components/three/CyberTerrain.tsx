import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { COLORS } from '@/lib/constants';

/* ========================================
   OPTIMIZED GLSL SHADERS
   ======================================== */

// Vertex: Reduced calculations, added displacement control
const vertexShader = `
  uniform float uTime;
  uniform vec2 uMouse;
  uniform float uIntensity; // Animation intensity control
  varying vec2 vUv;
  varying float vElevation;

  // Optimized hash function (faster than sin-based)
  float hash(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }

  // Value noise with reduced iterations
  float noise(vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);
    
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    
    vec2 u = f * f * (3.0 - 2.0 * f); // Smoothstep
    return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
  }

  void main() {
    vUv = uv;
    vec3 pos = position;
    
    // Base terrain with intensity control
    float elevation = noise(uv * 2.0 + uTime * 0.2) * 0.5 * uIntensity;
    
    // Mouse interaction (optimized distance calc)
    vec2 mouseOffset = uv - uMouse;
    float dist = dot(mouseOffset, mouseOffset); // Faster than distance()
    float influence = smoothstep(0.16, 0.0, dist); // 0.4^2 = 0.16
    elevation += sin(pos.x * 10.0 + uTime * 2.0) * 0.5 * influence * uIntensity;
    
    // Glitch spikes (reduced frequency)
    float glitchSeed = floor(uTime * 2.0); // Update every 0.5s instead of every frame
    float glitch = step(0.95, hash(vec2(glitchSeed, pos.y))); // Less frequent
    pos.z += elevation + (glitch * 0.2 * uIntensity);

    vElevation = pos.z;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

// Fragment: Optimized grid with transparency fix
const fragmentShader = `
  uniform float uTime;
  uniform vec3 uColor;
  uniform vec3 uGridColor;
  uniform float uOpacity; // Global opacity control
  varying vec2 vUv;
  varying float vElevation;

  void main() {
    // Sharp grid (reduced calculations)
    vec2 grid = step(0.98, fract(vUv * 30.0));
    float gridMask = max(grid.x, grid.y);

    // Color mixing
    vec3 color = mix(uGridColor, uColor, gridMask + vElevation * 0.5);
    
    // Depth-based alpha (prevents far clipping artifacts)
    float depthAlpha = 1.0 - smoothstep(0.0, 0.7, distance(vUv, vec2(0.5)));
    
    // Scanline (optimized)
    float scanline = step(0.5, sin(vUv.y * 100.0 + uTime * 2.0));
    
    // Discard invisible fragments early (GPU optimization)
    if (scanline < 0.5 && gridMask < 0.5) discard;

    float finalAlpha = depthAlpha * (gridMask > 0.5 ? uOpacity : uOpacity * 0.3);
    gl_FragColor = vec4(color, finalAlpha);
  }
`;

/* ========================================
   TYPES
   ======================================== */
interface CyberTerrainProps {
  mousePos: { x: number; y: number }; // Reactive state, not ref
  prefersReducedMotion: boolean;
  intensity?: number; // 0-1 scale for displacement
}

/* ========================================
   MAIN COMPONENT
   ======================================== */
const CyberTerrain: React.FC<CyberTerrainProps> = ({
  mousePos,
  prefersReducedMotion,
  intensity = 1.0,
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const { invalidate, camera } = useThree(); // For on-demand rendering

  // Camera target for smooth parallax
  const cameraTargetRef = useRef({ x: 0, y: 2 });

  /* ========================================
     SHADER UNIFORMS (MEMOIZED)
     ======================================== */
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uIntensity: { value: prefersReducedMotion ? 0.3 : intensity },
      uOpacity: { value: 1.0 },
      uColor: { value: new THREE.Color(COLORS.acid) },
      uGridColor: { value: new THREE.Color(COLORS.grid) },
    }),
    // Only recreate if colors change (prevents shader recompile)
    [COLORS.acid, COLORS.grid]
  );

  /* ========================================
     UPDATE INTENSITY ON MOTION PREFERENCE CHANGE
     ======================================== */
  useEffect(() => {
    if (meshRef.current) {
      const material = meshRef.current.material as THREE.ShaderMaterial;
      material.uniforms.uIntensity.value = prefersReducedMotion
        ? 0.3
        : intensity;
      invalidate(); // Trigger re-render in demand mode
    }
  }, [prefersReducedMotion, intensity, invalidate]);

  /* ========================================
     ANIMATION LOOP (OPTIMIZED)
     ======================================== */
  useFrame((state, delta) => {
    if (!meshRef.current) return;

    const material = meshRef.current.material as THREE.ShaderMaterial;

    // Update time uniform (delta ensures frame-rate independence)
    material.uniforms.uTime.value += delta;

    // Smooth mouse tracking (lerp with delta compensation)
    const lerpFactor = 1.0 - Math.pow(0.001, delta); // Frame-rate independent lerp
    const currentMouse = material.uniforms.uMouse.value;
    const targetX = mousePos.x * 0.5 + 0.5;
    const targetY = mousePos.y * 0.5 + 0.5;

    currentMouse.x += (targetX - currentMouse.x) * lerpFactor;
    currentMouse.y += (targetY - currentMouse.y) * lerpFactor;

    // Camera parallax (smooth, no direct mutation)
    if (!prefersReducedMotion) {
      cameraTargetRef.current.x +=
        (mousePos.x * 0.5 - cameraTargetRef.current.x) * lerpFactor;
      cameraTargetRef.current.y +=
        (mousePos.y * 0.5 + 2 - cameraTargetRef.current.y) * lerpFactor;

      // Apply to camera (still mutation, but smoother)
      camera.position.x = cameraTargetRef.current.x;
      camera.position.y = cameraTargetRef.current.y;
      camera.lookAt(0, 0, 0);
    }

    // Trigger re-render for on-demand mode
    invalidate();
  });

  /* ========================================
     CLEANUP (CRITICAL FOR MEMORY MANAGEMENT)
     ======================================== */
  useEffect(() => {
    return () => {
      if (meshRef.current) {
        const mesh = meshRef.current;

        // Dispose geometry
        if (mesh.geometry) {
          mesh.geometry.dispose();
        }

        // Dispose shader material
        if (mesh.material) {
          const material = mesh.material as THREE.ShaderMaterial;
          material.dispose();
        }

        console.info('[CyberTerrain] Resources cleaned');
      }
    };
  }, []);

  /* ========================================
     STATIC FALLBACK FOR REDUCED MOTION
     ======================================== */
  if (prefersReducedMotion) {
    return (
      <mesh rotation={[-Math.PI / 2.2, 0, 0]} position={[0, -0.5, 0]}>
        <planeGeometry args={[24, 24, 64, 64]} />
        <meshBasicMaterial
          color={COLORS.grid}
          wireframe={true}
          transparent={true}
          opacity={0.3}
        />
      </mesh>
    );
  }

  /* ========================================
     RENDER
     ======================================== */
  return (
    <mesh
      ref={meshRef}
      rotation={[-Math.PI / 2.2, 0, 0]}
      position={[0, -0.5, 0]}
    >
      <planeGeometry args={[24, 24, 128, 128]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent={true}
        side={THREE.DoubleSide}
        depthWrite={false}
        blending={THREE.AdditiveBlending} // Better transparency handling
      />
    </mesh>
  );
};

export default React.memo(CyberTerrain);
