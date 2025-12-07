'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useScroll, useTransform, motion } from 'framer-motion';
import { useRef, useMemo, Suspense, useEffect, useState } from 'react';
import * as THREE from 'three';

// Stylized 3D Camera component
function Camera({ scrollProgress, videoRef }: { scrollProgress: number; videoRef: React.RefObject<HTMLVideoElement | null> }) {
  const groupRef = useRef<THREE.Group>(null);
  const sdCardRef = useRef<THREE.Mesh>(null);
  const screenRef = useRef<THREE.Mesh>(null);
  
  // Video texture
  const videoTexture = useMemo(() => {
    if (videoRef.current) {
      const texture = new THREE.VideoTexture(videoRef.current);
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;
      return texture;
    }
    return null;
  }, [videoRef]);

  // Animate based on scroll
  useFrame(() => {
    if (groupRef.current) {
      // Camera rotation based on scroll
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        -0.3 + scrollProgress * 0.8,
        0.05
      );
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        0.1 - scrollProgress * 0.3,
        0.05
      );
      
      // Camera moves down and scales as user scrolls
      groupRef.current.position.y = THREE.MathUtils.lerp(
        groupRef.current.position.y,
        -scrollProgress * 2,
        0.05
      );
    }
    
    if (sdCardRef.current) {
      // SD card animation - starts at scroll 0.3, fully out at 0.6
      const sdProgress = Math.max(0, Math.min(1, (scrollProgress - 0.3) / 0.3));
      
      // SD card slides out
      sdCardRef.current.position.x = THREE.MathUtils.lerp(
        sdCardRef.current.position.x,
        0.8 + sdProgress * 1.5,
        0.08
      );
      
      // SD card rotates and moves around
      if (sdProgress > 0.5) {
        const arcProgress = (sdProgress - 0.5) / 0.5;
        sdCardRef.current.position.y = -Math.sin(arcProgress * Math.PI) * 1.5 - arcProgress * 3;
        sdCardRef.current.rotation.z = arcProgress * Math.PI * 0.5;
      }
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Camera Body */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[2, 1.4, 0.8]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.8} roughness={0.2} />
      </mesh>
      
      {/* Camera Top (viewfinder area) */}
      <mesh position={[0, 0.85, -0.1]}>
        <boxGeometry args={[0.8, 0.3, 0.5]} />
        <meshStandardMaterial color="#0d0d0d" metalness={0.9} roughness={0.1} />
      </mesh>
      
      {/* Viewfinder */}
      <mesh position={[0, 0.85, -0.35]}>
        <boxGeometry args={[0.3, 0.2, 0.15]} />
        <meshStandardMaterial color="#000000" metalness={0.5} roughness={0.3} />
      </mesh>
      
      {/* Lens Mount */}
      <mesh position={[-1.1, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.5, 0.55, 0.3, 32]} />
        <meshStandardMaterial color="#1f1f1f" metalness={0.9} roughness={0.15} />
      </mesh>
      
      {/* Lens Body */}
      <mesh position={[-1.5, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.45, 0.5, 0.6, 32]} />
        <meshStandardMaterial color="#0a0a0a" metalness={0.7} roughness={0.2} />
      </mesh>
      
      {/* Lens Glass */}
      <mesh position={[-1.85, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.35, 0.4, 0.15, 32]} />
        <meshStandardMaterial 
          color="#1a3050" 
          metalness={0.3} 
          roughness={0.1}
          transparent
          opacity={0.9}
        />
      </mesh>
      
      {/* Screen (back of camera) */}
      <mesh ref={screenRef} position={[0, 0, 0.41]}>
        <planeGeometry args={[1.6, 1.1]} />
        {videoTexture ? (
          <meshBasicMaterial map={videoTexture} />
        ) : (
          <meshBasicMaterial color="#111111" />
        )}
      </mesh>
      
      {/* Screen Border */}
      <mesh position={[0, 0, 0.405]}>
        <boxGeometry args={[1.7, 1.2, 0.02]} />
        <meshStandardMaterial color="#0a0a0a" metalness={0.8} roughness={0.2} />
      </mesh>
      
      {/* SD Card Slot */}
      <mesh position={[0.85, -0.3, 0]}>
        <boxGeometry args={[0.15, 0.4, 0.3]} />
        <meshStandardMaterial color="#0d0d0d" metalness={0.5} roughness={0.4} />
      </mesh>
      
      {/* SD Card */}
      <mesh ref={sdCardRef} position={[0.8, -0.3, 0]}>
        <boxGeometry args={[0.12, 0.35, 0.05]} />
        <meshStandardMaterial color="#2563eb" metalness={0.6} roughness={0.3} />
      </mesh>
      
      {/* Control Dials */}
      <mesh position={[0.6, 0.85, 0.1]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.12, 0.12, 0.15, 24]} />
        <meshStandardMaterial color="#2a2a2a" metalness={0.9} roughness={0.15} />
      </mesh>
      
      <mesh position={[0.3, 0.85, 0.1]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 0.1, 24]} />
        <meshStandardMaterial color="#333333" metalness={0.9} roughness={0.15} />
      </mesh>
      
      {/* Record Button */}
      <mesh position={[0.7, 0.5, 0.35]}>
        <sphereGeometry args={[0.06, 16, 16]} />
        <meshStandardMaterial color="#ff0000" emissive="#ff0000" emissiveIntensity={0.5} />
      </mesh>
    </group>
  );
}

// Scene lighting
function Lighting() {
  return (
    <>
      <ambientLight intensity={0.3} />
      <spotLight 
        position={[5, 5, 5]} 
        angle={0.4} 
        penumbra={0.5} 
        intensity={1.5}
        castShadow
      />
      <spotLight 
        position={[-5, 3, 5]} 
        angle={0.4} 
        penumbra={0.5} 
        intensity={0.8}
        color="#4060ff"
      />
      <pointLight position={[0, -3, 2]} intensity={0.3} color="#ffffff" />
    </>
  );
}

// Main exported component
export default function CameraScene() {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start']
  });

  useEffect(() => {
    const unsubscribe = scrollYProgress.on('change', (v) => {
      setScrollProgress(v);
    });
    return () => unsubscribe();
  }, [scrollYProgress]);

  // Calculate glow intensity for the features section
  const glowIntensity = Math.max(0, Math.min(1, (scrollProgress - 0.6) / 0.2));

  return (
    <div ref={containerRef} className="relative h-[200vh]">
      {/* Hidden video element for texture */}
      <video
        ref={videoRef}
        className="hidden"
        autoPlay
        muted
        loop
        playsInline
        crossOrigin="anonymous"
      >
        {/* Add your video source here */}
        {/* <source src="/demo-video.mp4" type="video/mp4" /> */}
      </video>
      
      {/* 3D Canvas */}
      <div className="sticky top-0 h-screen w-full">
        <Canvas
          camera={{ position: [0, 0, 5], fov: 45 }}
          gl={{ antialias: true, alpha: true }}
          style={{ background: 'transparent' }}
        >
          <Suspense fallback={null}>
            <Lighting />
            <Camera scrollProgress={scrollProgress} videoRef={videoRef} />
          </Suspense>
        </Canvas>
        
        {/* Energy/Connection Line */}
        <motion.div 
          className="absolute left-1/2 bottom-0 w-[2px] -translate-x-1/2 origin-top"
          style={{
            height: `${Math.max(0, (scrollProgress - 0.5) * 200)}%`,
            background: `linear-gradient(to bottom, transparent, rgba(255,255,255,${glowIntensity}), rgba(59, 130, 246, ${glowIntensity}))`,
            boxShadow: glowIntensity > 0 ? `0 0 20px rgba(59, 130, 246, ${glowIntensity}), 0 0 40px rgba(255,255,255, ${glowIntensity * 0.5})` : 'none',
          }}
        />
        
        {/* Glow overlay at bottom */}
        <motion.div 
          className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse at center bottom, rgba(255,255,255,${glowIntensity * 0.15}) 0%, transparent 70%)`,
          }}
        />
      </div>
    </div>
  );
}

