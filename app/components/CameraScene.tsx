'use client';

import { useRef, useEffect, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useGLTF, Environment, Float, MeshTransmissionMaterial } from '@react-three/drei';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import * as THREE from 'three';

gsap.registerPlugin(ScrollTrigger);

// Camera 3D Model Component
function CameraModel({ scrollProgress }: { scrollProgress: React.MutableRefObject<number> }) {
  const groupRef = useRef<THREE.Group>(null);
  const sdCardRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF('/scene.gltf');
  
  // Clone the scene to avoid mutation issues
  const clonedScene = scene.clone();
  
  // Animate based on scroll
  useFrame(() => {
    if (!groupRef.current) return;
    
    const progress = scrollProgress.current;
    
    // Camera rotation and position based on scroll
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      -0.3,
      -0.8,
      Math.min(progress * 2, 1)
    );
    
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      0.1,
      0.3,
      Math.min(progress * 2, 1)
    );
    
    groupRef.current.position.y = THREE.MathUtils.lerp(
      0,
      -2,
      progress
    );
    
    groupRef.current.position.x = THREE.MathUtils.lerp(
      0,
      -1,
      progress
    );

    // SD Card ejection animation
    if (sdCardRef.current) {
      const sdProgress = Math.max(0, (progress - 0.2) * 2);
      sdCardRef.current.position.z = THREE.MathUtils.lerp(0, 2, Math.min(sdProgress, 1));
      sdCardRef.current.position.y = THREE.MathUtils.lerp(0, -1, Math.min(sdProgress, 1));
      sdCardRef.current.rotation.x = THREE.MathUtils.lerp(0, 0.5, Math.min(sdProgress, 1));
    }
  });

  return (
    <group ref={groupRef} scale={2.5} position={[0, 0, 0]}>
      <primitive object={clonedScene} />
      
      {/* SD Card - simplified geometry */}
      <group ref={sdCardRef} position={[0.3, -0.2, 0.5]}>
        <mesh>
          <boxGeometry args={[0.3, 0.02, 0.25]} />
          <meshStandardMaterial color="#1a1a1a" metalness={0.8} roughness={0.2} />
        </mesh>
        {/* Gold contacts */}
        <mesh position={[0, -0.012, 0.05]}>
          <boxGeometry args={[0.2, 0.005, 0.1]} />
          <meshStandardMaterial color="#d4af37" metalness={1} roughness={0.3} />
        </mesh>
      </group>
    </group>
  );
}

// Floating particles for atmosphere
function Particles() {
  const particlesRef = useRef<THREE.Points>(null);
  const count = 100;
  
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count * 3; i += 3) {
    positions[i] = (Math.random() - 0.5) * 20;
    positions[i + 1] = (Math.random() - 0.5) * 20;
    positions[i + 2] = (Math.random() - 0.5) * 20;
  }

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.02;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.02} color="#ffffff" transparent opacity={0.4} />
    </points>
  );
}

// Main Scene Component
function Scene({ scrollProgress }: { scrollProgress: React.MutableRefObject<number> }) {
  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 5, 5]} intensity={1} castShadow />
      <directionalLight position={[-5, 3, -5]} intensity={0.5} color="#4a9eff" />
      <spotLight position={[0, 10, 0]} intensity={0.5} angle={0.3} penumbra={1} />
      
      <Suspense fallback={null}>
        <Float speed={1} rotationIntensity={0.1} floatIntensity={0.3}>
          <CameraModel scrollProgress={scrollProgress} />
        </Float>
        <Environment preset="city" />
      </Suspense>
      
      <Particles />
    </>
  );
}

// Exported Component
export default function CameraScene() {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollProgress = useRef(0);

  useEffect(() => {
    if (!containerRef.current) return;

    // Create scroll trigger
    const trigger = ScrollTrigger.create({
      trigger: containerRef.current,
      start: 'top top',
      end: 'bottom top',
      scrub: 1,
      onUpdate: (self) => {
        scrollProgress.current = self.progress;
      },
    });

    return () => {
      trigger.kill();
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className="absolute inset-0 z-0"
      style={{ pointerEvents: 'none' }}
    >
      <Canvas
        camera={{ position: [0, 0, 8], fov: 45 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <Scene scrollProgress={scrollProgress} />
      </Canvas>
    </div>
  );
}

// Preload the model
useGLTF.preload('/scene.gltf');

