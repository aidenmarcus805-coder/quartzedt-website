'use client';

import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { useScroll, motion } from 'framer-motion';
import { useRef, Suspense, useEffect, useState, useMemo, useCallback } from 'react';
import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';

// 3D Camera Model component with scroll-based zoom
function CameraModel({ scrollProgress, videoElement }: { scrollProgress: number; videoElement: HTMLVideoElement | null }) {
  const groupRef = useRef<THREE.Group>(null);
  const screenMaterialRef = useRef<THREE.MeshBasicMaterial>(null);
  const obj = useLoader(OBJLoader, '/DSLR.obj');
  const videoTextureRef = useRef<THREE.VideoTexture | null>(null);
  
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
            metalness: 0.4,
            roughness: 0.3,
            envMapIntensity: 1.5,
          });
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
    }
  }, [obj, textures]);

  // Create and apply video texture for camera screen
  useFrame(() => {
    if (videoElement && !videoTextureRef.current) {
      const texture = new THREE.VideoTexture(videoElement);
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;
      texture.colorSpace = THREE.SRGBColorSpace;
      videoTextureRef.current = texture;
      
      // Apply to screen material
      if (screenMaterialRef.current) {
        screenMaterialRef.current.map = texture;
        screenMaterialRef.current.needsUpdate = true;
      }
    }
    
    if (videoTextureRef.current) {
      videoTextureRef.current.needsUpdate = true;
    }

    if (groupRef.current) {
      // Gentle idle animation
      const time = Date.now() * 0.001;
      const idleY = Math.sin(time * 0.3) * 0.01;
      const idleX = Math.cos(time * 0.2) * 0.005;
      
      // SCROLL ANIMATION: Start zoomed in, zoom out to reveal camera
      // Progress 0 = zoomed in on screen, Progress 0.5+ = zoomed out showing full camera
      
      // Scale: Start large (zoomed in), shrink to normal size
      const startScale = 0.12; // Zoomed in - camera fills more of screen
      const endScale = 0.04;   // Zoomed out - see full camera
      const currentScale = THREE.MathUtils.lerp(startScale, endScale, Math.min(scrollProgress * 2, 1));
      groupRef.current.scale.setScalar(currentScale);
      
      // Position: Start centered on screen area, move to show full camera
      const startY = -0.3;
      const endY = 0.5;
      const startZ = 1;
      const endZ = 0;
      
      groupRef.current.position.y = THREE.MathUtils.lerp(
        groupRef.current.position.y,
        THREE.MathUtils.lerp(startY, endY, Math.min(scrollProgress * 2, 1)),
        0.08
      );
      
      groupRef.current.position.z = THREE.MathUtils.lerp(
        groupRef.current.position.z,
        THREE.MathUtils.lerp(startZ, endZ, Math.min(scrollProgress * 2, 1)),
        0.08
      );
      
      // Rotation: Subtle rotation as you scroll
      const startRotY = -0.1; // Start showing screen
      const endRotY = -0.4;   // Rotate to show more of the side
      
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        THREE.MathUtils.lerp(startRotY, endRotY, Math.min(scrollProgress * 1.5, 1)) + idleY,
        0.05
      );
      
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        0.1 + scrollProgress * 0.15 + idleX,
        0.05
      );
      
      // After 50% scroll, camera starts moving down and away
      if (scrollProgress > 0.5) {
        const exitProgress = (scrollProgress - 0.5) * 2;
        groupRef.current.position.y -= exitProgress * 2;
        groupRef.current.rotation.x += exitProgress * 0.3;
      }
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]} scale={0.08} rotation={[0.1, -0.2, 0]}>
      <primitive object={obj} />
      
      {/* Camera screen showing video - positioned on back LCD */}
      <mesh position={[0, 8, 23]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[52, 36]} />
        <meshBasicMaterial ref={screenMaterialRef} color="#000000" toneMapped={false} />
      </mesh>
    </group>
  );
}

// Scene lighting - Cinematic studio lighting
function Lighting() {
  return (
    <>
      {/* Hemisphere light - sky and ground colors */}
      <hemisphereLight args={['#ffffff', '#333333', 1.5]} />
      
      {/* Strong ambient light for base visibility */}
      <ambientLight intensity={1} />
      
      {/* Main key light - front right */}
      <directionalLight 
        position={[5, 5, 8]} 
        intensity={3}
        color="#ffffff"
      />
      
      {/* Fill light - front left */}
      <directionalLight 
        position={[-5, 3, 8]} 
        intensity={2}
        color="#ffffff"
      />
      
      {/* Top light */}
      <directionalLight 
        position={[0, 10, 5]} 
        intensity={2}
        color="#ffffff"
      />
      
      {/* Back rim light for edge definition */}
      <directionalLight 
        position={[0, 3, -5]} 
        intensity={1.5}
        color="#6080ff"
      />
      
      {/* Front facing light - illuminates the screen area */}
      <pointLight position={[0, 0, 12]} intensity={2} color="#ffffff" />
      
      {/* Side accent lights */}
      <pointLight position={[8, 0, 4]} intensity={1.5} color="#ffffff" />
      <pointLight position={[-8, 0, 4]} intensity={1.5} color="#ffffff" />
      
      {/* Subtle light on screen */}
      <spotLight 
        position={[0, 2, 8]}
        angle={0.5}
        penumbra={0.5}
        intensity={2}
        color="#ffffff"
        target-position={[0, 0, 0]}
      />
    </>
  );
}

// Loading fallback - spinning camera silhouette
function LoadingFallback() {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01;
    }
  });

  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[2, 1.4, 0.8]} />
      <meshStandardMaterial color="#222222" />
    </mesh>
  );
}

// Main exported component
export default function CameraScene() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [videoElement, setVideoElement] = useState<HTMLVideoElement | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start']
  });

  // Set video element after mount using callback ref
  const handleVideoRef = useCallback((element: HTMLVideoElement | null) => {
    videoRef.current = element;
    if (element) {
      setVideoElement(element);
      // Ensure video plays
      element.play().catch(() => {});
    }
  }, []);

  useEffect(() => {
    const unsubscribe = scrollYProgress.on('change', (v) => {
      setScrollProgress(v);
    });
    return () => unsubscribe();
  }, [scrollYProgress]);

  return (
    <div ref={containerRef} className="relative w-full h-[200vh]">
      {/* Hidden video element for texture */}
      <video
        ref={handleVideoRef}
        className="hidden"
        autoPlay
        muted
        loop
        playsInline
      >
        <source src="/videoplayback.mp4" type="video/mp4" />
      </video>

      {/* Sticky 3D Canvas */}
      <div className="sticky top-0 w-full h-screen">
        <Canvas
          camera={{ position: [0, 0, 5], fov: 50 }}
          gl={{ 
            antialias: true, 
            alpha: true,
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 1.2,
          }}
          style={{ background: 'transparent' }}
        >
          <Suspense fallback={<LoadingFallback />}>
            <Lighting />
            <CameraModel scrollProgress={scrollProgress} videoElement={videoElement} />
          </Suspense>
        </Canvas>
      </div>
    </div>
  );
}
