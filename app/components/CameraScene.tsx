'use client';

import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { useScroll, motion } from 'framer-motion';
import { useRef, Suspense, useEffect, useState, useMemo } from 'react';
import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';

// 3D Camera Model component
function CameraModel({ scrollProgress }: { scrollProgress: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const obj = useLoader(OBJLoader, '/DSLR.obj');
  
  // Load textures
  const textures = useMemo(() => {
    const textureLoader = new THREE.TextureLoader();
    return {
      diffuse: textureLoader.load('/TEX/DSLR_DSLR_Diffuse.png'),
      normal: textureLoader.load('/TEX/DSLR_DSLR_Normal.png'),
      specular: textureLoader.load('/TEX/DSLR_DSLR_Specular.png'),
      glossiness: textureLoader.load('/TEX/DSLR_DSLR_Glossiness.png'),
    };
  }, []);

  // Apply textures to the model
  useEffect(() => {
    if (obj) {
      obj.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.material = new THREE.MeshStandardMaterial({
            map: textures.diffuse,
            normalMap: textures.normal,
            roughnessMap: textures.glossiness,
            metalnessMap: textures.specular,
            metalness: 0.3,
            roughness: 0.4,
            envMapIntensity: 1,
          });
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
    }
  }, [obj, textures]);
  
  useFrame(() => {
    if (groupRef.current) {
      // Gentle idle animation
      const time = Date.now() * 0.001;
      const idleY = Math.sin(time * 0.5) * 0.02;
      const idleX = Math.cos(time * 0.3) * 0.015;
      
      // Camera rotation based on scroll
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        -0.5 + scrollProgress * 0.8 + idleY,
        0.05
      );
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        0.1 - scrollProgress * 0.15 + idleX,
        0.05
      );
      
      // Camera moves down as user scrolls
      groupRef.current.position.y = THREE.MathUtils.lerp(
        groupRef.current.position.y,
        0 - scrollProgress * 4,
        0.05
      );
      
      // Camera moves closer as you scroll
      groupRef.current.position.z = THREE.MathUtils.lerp(
        groupRef.current.position.z,
        0 + scrollProgress * 2,
        0.05
      );
    }
  });

  return (
    <group ref={groupRef} position={[0, -0.5, 0]} scale={0.03} rotation={[0, -0.5, 0]}>
      <primitive object={obj} />
    </group>
  );
}

// SD Card that ejects from camera
function SDCard({ scrollProgress }: { scrollProgress: number }) {
  const sdCardRef = useRef<THREE.Mesh>(null);
  
  useFrame(() => {
    if (sdCardRef.current) {
      // SD card animation - starts at scroll 0.3, fully out at 0.6
      const sdProgress = Math.max(0, Math.min(1, (scrollProgress - 0.3) / 0.3));
      
      // Start position near the camera
      const startX = 1.5;
      const startY = -0.5;
      const startZ = 0;
      
      // SD card slides out and arcs down
      sdCardRef.current.position.x = startX + sdProgress * 2.5;
      sdCardRef.current.position.y = startY - sdProgress * 4 + Math.sin(sdProgress * Math.PI) * 1;
      sdCardRef.current.position.z = startZ + sdProgress * 1;
      
      // Rotation
      sdCardRef.current.rotation.z = sdProgress * Math.PI * 0.4;
      sdCardRef.current.rotation.x = sdProgress * Math.PI * 0.2;
      
      // Scale and opacity based on progress
      const scale = 1 + sdProgress * 0.5;
      sdCardRef.current.scale.set(scale, scale, scale);
    }
  });

  return (
    <mesh ref={sdCardRef} position={[1.5, -0.5, 0]}>
      <boxGeometry args={[0.4, 0.5, 0.08]} />
      <meshStandardMaterial 
        color="#2563eb" 
        metalness={0.7} 
        roughness={0.3} 
        emissive="#2563eb" 
        emissiveIntensity={0.3} 
      />
    </mesh>
  );
}

// Scene lighting - Strong lighting for visibility
function Lighting() {
  return (
    <>
      {/* Hemisphere light - sky and ground colors */}
      <hemisphereLight args={['#ffffff', '#444444', 2]} />
      
      {/* Strong ambient light for base visibility */}
      <ambientLight intensity={1.5} />
      
      {/* Main key light - front right */}
      <directionalLight 
        position={[5, 5, 5]} 
        intensity={4}
        color="#ffffff"
      />
      
      {/* Fill light - front left */}
      <directionalLight 
        position={[-5, 3, 5]} 
        intensity={3}
        color="#ffffff"
      />
      
      {/* Top light */}
      <directionalLight 
        position={[0, 10, 2]} 
        intensity={2}
        color="#ffffff"
      />
      
      {/* Back rim light for edge definition */}
      <directionalLight 
        position={[0, 2, -5]} 
        intensity={1.5}
        color="#8090ff"
      />
      
      {/* Front facing point light */}
      <pointLight position={[0, 0, 10]} intensity={3} color="#ffffff" />
      
      {/* Side accent lights */}
      <pointLight position={[10, 0, 2]} intensity={2} color="#ffffff" />
      <pointLight position={[-10, 0, 2]} intensity={2} color="#ffffff" />
      
      {/* Bottom fill to prevent dark underside */}
      <pointLight position={[0, -5, 5]} intensity={1} color="#ffffff" />
    </>
  );
}

// Loading fallback
function LoadingFallback() {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01;
    }
  });

  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[1, 0.7, 0.5]} />
      <meshStandardMaterial color="#333333" wireframe />
    </mesh>
  );
}

// Main exported component
export default function CameraScene() {
  const [scrollProgress, setScrollProgress] = useState(0);
  
  const { scrollYProgress } = useScroll();

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
      {/* 3D Canvas */}
      <Canvas
        camera={{ position: [0, 0, 6], fov: 45 }}
        gl={{ 
          antialias: true, 
          alpha: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.5,
        }}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={<LoadingFallback />}>
          <Lighting />
          <CameraModel scrollProgress={scrollProgress} />
          <SDCard scrollProgress={scrollProgress} />
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
