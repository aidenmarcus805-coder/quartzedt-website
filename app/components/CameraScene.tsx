'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { useScroll, motion } from 'framer-motion';
import { useRef, Suspense, useEffect, useState, useCallback } from 'react';
import * as THREE from 'three';

// Stylized 3D Camera component
function Camera({ scrollProgress, videoElement }: { scrollProgress: number; videoElement: HTMLVideoElement | null }) {
  const groupRef = useRef<THREE.Group>(null);
  const sdCardRef = useRef<THREE.Mesh>(null);
  const textureRef = useRef<THREE.VideoTexture | null>(null);
  const materialRef = useRef<THREE.MeshBasicMaterial>(null);
  
  // Create and update video texture using useFrame (not in effect)
  useFrame(() => {
    // Initialize texture if we have video element but no texture yet
    if (videoElement && !textureRef.current) {
      const texture = new THREE.VideoTexture(videoElement);
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;
      textureRef.current = texture;
      
      // Apply texture to material
      if (materialRef.current) {
        materialRef.current.map = texture;
        materialRef.current.needsUpdate = true;
      }
    }
    
    // Update texture if it exists
    if (textureRef.current) {
      textureRef.current.needsUpdate = true;
    }
    
    if (groupRef.current) {
      // Gentle idle animation
      const time = Date.now() * 0.001;
      const idleY = Math.sin(time * 0.5) * 0.03;
      const idleX = Math.cos(time * 0.3) * 0.02;
      
      // Camera rotation based on scroll
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        -0.4 + scrollProgress * 0.6 + idleY,
        0.05
      );
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        0.15 - scrollProgress * 0.2 + idleX,
        0.05
      );
      
      // Camera moves down as user scrolls
      groupRef.current.position.y = THREE.MathUtils.lerp(
        groupRef.current.position.y,
        0.3 - scrollProgress * 3,
        0.05
      );
      
      // Camera moves forward (towards viewer) slightly
      groupRef.current.position.z = THREE.MathUtils.lerp(
        groupRef.current.position.z,
        0 + scrollProgress * 1,
        0.05
      );
    }
    
    if (sdCardRef.current) {
      // SD card animation - starts at scroll 0.4, fully out at 0.7
      const sdProgress = Math.max(0, Math.min(1, (scrollProgress - 0.4) / 0.3));
      
      // SD card slides out and moves
      sdCardRef.current.position.x = THREE.MathUtils.lerp(
        sdCardRef.current.position.x,
        0.8 + sdProgress * 2,
        0.08
      );
      
      // SD card rotates and drops
      if (sdProgress > 0) {
        sdCardRef.current.position.y = -0.3 - sdProgress * 2.5;
        sdCardRef.current.rotation.z = sdProgress * Math.PI * 0.3;
        sdCardRef.current.rotation.x = sdProgress * Math.PI * 0.2;
      }
    }
  });
  
  // Cleanup texture on unmount
  useEffect(() => {
    return () => {
      if (textureRef.current) {
        textureRef.current.dispose();
      }
    };
  }, []);

  return (
    <group ref={groupRef} position={[0.5, 0.3, 0]} scale={1.1}>
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
      <mesh position={[0, 0, 0.41]}>
        <planeGeometry args={[1.6, 1.1]} />
        <meshBasicMaterial ref={materialRef} color="#222222" />
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
        <meshStandardMaterial color="#2563eb" metalness={0.6} roughness={0.3} emissive="#2563eb" emissiveIntensity={0.2} />
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
      
      {/* Record Button with glow */}
      <mesh position={[0.7, 0.5, 0.35]}>
        <sphereGeometry args={[0.06, 16, 16]} />
        <meshStandardMaterial color="#ff0000" emissive="#ff0000" emissiveIntensity={0.8} />
      </mesh>
      
      {/* Record button glow ring */}
      <mesh position={[0.7, 0.5, 0.34]}>
        <ringGeometry args={[0.08, 0.1, 32]} />
        <meshBasicMaterial color="#ff0000" transparent opacity={0.3} />
      </mesh>
    </group>
  );
}

// Scene lighting
function Lighting() {
  return (
    <>
      <ambientLight intensity={0.4} />
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
      <spotLight 
        position={[0, -3, 5]} 
        angle={0.6} 
        penumbra={0.8} 
        intensity={0.5}
        color="#ffffff"
      />
      <pointLight position={[3, 0, 3]} intensity={0.4} color="#ffffff" />
    </>
  );
}

// Main exported component
export default function CameraScene() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [videoElement, setVideoElement] = useState<HTMLVideoElement | null>(null);
  
  const { scrollYProgress } = useScroll();

  // Use callback ref to get video element without triggering re-render in effect
  const handleVideoRef = useCallback((element: HTMLVideoElement | null) => {
    videoRef.current = element;
    if (element) {
      setVideoElement(element);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = scrollYProgress.on('change', (v) => {
      setScrollProgress(v);
    });
    return () => unsubscribe();
  }, [scrollYProgress]);

  // Calculate glow intensity for the features section
  const glowIntensity = Math.max(0, Math.min(1, (scrollProgress - 0.5) / 0.2));

  return (
    <div className="relative w-full h-full">
      {/* Hidden video element for texture */}
      <video
        ref={handleVideoRef}
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
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={null}>
          <Lighting />
          <Camera scrollProgress={scrollProgress} videoElement={videoElement} />
        </Suspense>
      </Canvas>
      
      {/* Subtle gradient overlay at bottom connecting to next section */}
      <motion.div 
        className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none"
        style={{
          background: `linear-gradient(to bottom, transparent, rgba(5,5,5,${0.3 + glowIntensity * 0.7}))`,
        }}
      />
    </div>
  );
}
