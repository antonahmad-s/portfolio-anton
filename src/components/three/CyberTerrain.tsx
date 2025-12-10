import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { COLORS } from '@/lib/constants';

/* ========================================
   RAW GLSL SHADER - BRUTALIST DIGITAL LOOK
   ======================================== */

// Vertex: Pseudo-random noise for jagged, glitchy terrain displacement
const vertexShader = `
  uniform float uTime;
  uniform vec2 uMouse;
  varying vec2 vUv;
  varying float vElevation;

  // Pseudo-random noise for "digital grain" look
  float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
  }

  // Value noise
  float noise(vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(a, b, u.x) + (c - a)* u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
  }

  void main() {
    vUv = uv;
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    
    // Base rolling noise terrain
    float elevation = noise(modelPosition.xy * 2.0 + uTime * 0.2) * 0.5;
    
    // Mouse interaction: localized distortion spike
    float dist = distance(uv, uMouse);
    float influence = smoothstep(0.4, 0.0, dist);
    elevation += sin(modelPosition.x * 10.0 + uTime * 2.0) * 0.5 * influence;
    
    // Digital "Glitch" spikes
    float glitch = step(0.9, random(vec2(uTime * 0.5, modelPosition.y)));
    modelPosition.z += elevation + (glitch * 0.2);

    vElevation = modelPosition.z;

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;
    
    gl_Position = projectedPosition;
  }
`;

// Fragment: High-contrast, pulsing grid with scanlines
const fragmentShader = `
  uniform float uTime;
  uniform vec3 uColor;
  uniform vec3 uGridColor;
  varying vec2 vUv;
  varying float vElevation;

  void main() {
    // Sharp grid pattern
    float gridX = step(0.98, mod(vUv.x * 30.0, 1.0));
    float gridY = step(0.98, mod(vUv.y * 30.0, 1.0));
    float grid = max(gridX, gridY);

    // Color mixing: Acid green on peaks, dark grid in valleys
    vec3 color = mix(uGridColor, uColor, grid + vElevation);
    
    // Vignette / Depth falloff
    float alpha = 1.0 - smoothstep(0.0, 0.5, distance(vUv, vec2(0.5)));
    
    // Scanline effect (moving horizontal bands)
    float scanline = step(0.5, sin(vUv.y * 100.0 + uTime * 2.0));
    if (scanline < 0.5 && grid < 0.5) discard; // Transparency for scanlines

    gl_FragColor = vec4(color, alpha * (grid > 0.5 ? 1.0 : 0.3));
  }
`;

/* ========================================
   CYBER TERRAIN COMPONENT
   ======================================== */

interface CyberTerrainProps {
  mousePos: React.MutableRefObject<{ x: number; y: number }>;
  reducedMotionRef: React.MutableRefObject<boolean>;
}

const CyberTerrain: React.FC<CyberTerrainProps> = ({
  mousePos,
  reducedMotionRef,
}) => {
  const meshRef = useRef<THREE.Mesh>(null);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uColor: { value: new THREE.Color(COLORS.acid) },
      uGridColor: { value: new THREE.Color(COLORS.grid) },
    }),
    []
  );

  useFrame((state) => {
    if (reducedMotionRef.current || !meshRef.current) return;

    const { clock, camera } = state;
    const time = clock.getElapsedTime();

    // Update shader uniforms
    (meshRef.current.material as THREE.ShaderMaterial).uniforms.uTime.value =
      time;

    const currentMouse = (meshRef.current.material as THREE.ShaderMaterial)
      .uniforms.uMouse.value;
    // Lerp mouse for smooth uniform updates
    currentMouse.x += (mousePos.current.x * 0.5 + 0.5 - currentMouse.x) * 0.1;
    currentMouse.y += (mousePos.current.y * 0.5 + 0.5 - currentMouse.y) * 0.1;

    // Camera Parallax: Move camera slightly opposite to mouse
    camera.position.x += (mousePos.current.x * 0.5 - camera.position.x) * 0.05;
    camera.position.y +=
      (mousePos.current.y * 0.5 + 2 - camera.position.y) * 0.05; // +2 offset to keep angle
    camera.lookAt(0, 0, 0);
  });

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
        wireframe={false} // Simulate wireframe in shader for better control
        side={THREE.DoubleSide}
        depthWrite={false} // Helps with transparency blending
      />
    </mesh>
  );
};

export default CyberTerrain;
