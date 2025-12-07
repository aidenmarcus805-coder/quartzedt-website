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
  
  // Load textures with high quality settings
  const textures = useMemo(() => {
    const textureLoader = new THREE.TextureLoader();
    
    const loadTexture = (path: string) => {
      const tex = textureLoader.load(path);
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.minFilter = THREE.LinearMipmapLinearFilter;
      tex.magFilter = THREE.LinearFilter;
      tex.anisotropy = 16;
      tex.generateMipmaps = true;
      return tex;
    };
    
    return {
      diffuse: loadTexture('/TEX/DSLR_DSLR_Diffuse.png'),
      normal: loadTexture('/TEX/DSLR_DSLR_Normal.png'),
      specular: loadTexture('/TEX/DSLR_DSLR_Specular.png'),
      glossiness: loadTexture('/TEX/DSLR_DSLR_Glossiness.png'),
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
            metalness: 0.5,
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
    // Create video texture when video element is ready
    if (videoElement && !videoTextureRef.current && videoElement.readyState >= 2) {
      const texture = new THREE.VideoTexture(videoElement);
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.flipY = true;
      videoTextureRef.current = texture;
      
      // Apply to screen material
      if (screenMaterialRef.current) {
        screenMaterialRef.current.map = texture;
        screenMaterialRef.current.color = new THREE.Color(0xffffff);
        screenMaterialRef.current.needsUpdate = true;
      }
    }
    
    // Keep updating the video texture
    if (videoTextureRef.current && videoElement && !videoElement.paused) {
      videoTextureRef.current.needsUpdate = true;
    }

    if (groupRef.current) {
      // Gentle idle animation
      const time = Date.now() * 0.001;
      const idleY = Math.sin(time * 0.3) * 0.008;
      
      // SCROLL ANIMATION
      // Progress 0 = zoomed in on screen, Progress 0.5+ = zoomed out showing full camera
      const scrollEase = Math.min(scrollProgress * 2, 1);
      
      // Scale: Start large (zoomed in), shrink to normal size
      const startScale = 0.055;
      const endScale = 0.022;
      const currentScale = THREE.MathUtils.lerp(startScale, endScale, scrollEase);
      groupRef.current.scale.setScalar(currentScale);
      
      // Position Y: Move up as we zoom out
      const targetY = THREE.MathUtils.lerp(-0.5, 0.3, scrollEase);
      groupRef.current.position.y = THREE.MathUtils.lerp(
        groupRef.current.position.y,
        targetY,
        0.08
      );
      
      // Rotation: Start showing screen (back), rotate slightly to show angle
      // No rotation = back of camera, rotate towards Math.PI = front/lens
      const targetRotY = THREE.MathUtils.lerp(0, 0.4, scrollEase) + idleY;
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        targetRotY,
        0.06
      );
      
      // Slight tilt
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        0.05 + scrollEase * 0.1,
        0.06
      );
      
      // After 60% scroll, camera moves down and away
      if (scrollProgress > 0.6) {
        const exitProgress = (scrollProgress - 0.6) * 2.5;
        groupRef.current.position.y -= exitProgress * 3;
      }
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]} rotation={[0, 0, 0]}>
      <primitive object={obj} />
      
      {/* Camera LCD screen with video - positioned on the back LCD area */}
      {/* Adjusted position to match the actual LCD screen location */}
      <mesh position={[-8, 12, 24]} rotation={[0, 0, 0]}>
        <planeGeometry args={[58, 42]} />
        <meshBasicMaterial ref={screenMaterialRef} color="#000000" toneMapped={false} />
      </mesh>
    </group>
  );
}

// Scene lighting - Cinematic studio lighting
function Lighting() {
  return (
    <>
      {/* Hemisphere light */}
      <hemisphereLight args={['#ffffff', '#222222', 2]} />
      
      {/* Ambient */}
      <ambientLight intensity={1.5} />
      
      {/* Key light - front */}
      <directionalLight position={[0, 5, 10]} intensity={3} color="#ffffff" />
      
      {/* Fill lights */}
      <directionalLight position={[-5, 3, 5]} intensity={2} color="#ffffff" />
      <directionalLight position={[5, 3, 5]} intensity={2} color="#ffffff" />
      
      {/* Top light */}
      <directionalLight position={[0, 10, 0]} intensity={1.5} color="#ffffff" />
      
      {/* Rim light */}
      <directionalLight position={[0, 2, -10]} intensity={1} color="#4060ff" />
      
      {/* Point lights for detail */}
      <pointLight position={[0, 0, 8]} intensity={2} color="#ffffff" />
      <pointLight position={[-6, 0, 4]} intensity={1} color="#ffffff" />
      <pointLight position={[6, 0, 4]} intensity={1} color="#ffffff" />
    </>
  );
}

// Loading fallback
function LoadingFallback() {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.02;
    }
  });

  return (
    <group>
      <mesh ref={meshRef}>
        <boxGeometry args={[2, 1.4, 0.8]} />
        <meshStandardMaterial color="#333333" metalness={0.5} roughness={0.5} />
      </mesh>
    </group>
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

  // Set video element after mount and ensure it plays
  const handleVideoRef = useCallback((element: HTMLVideoElement | null) => {
    videoRef.current = element;
    if (element) {
      // Ensure video is ready to play
      element.load();
      element.addEventListener('loadeddata', () => {
        setVideoElement(element);
        element.play().catch(console.error);
      });
      // Also try to play immediately
      element.play().catch(() => {
        // Autoplay might be blocked, will play when user interacts
      });
      setVideoElement(element);
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
      {/* Video element for texture */}
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
      <div className="sticky top-0 w-full h-screen flex items-center justify-center">
        <Canvas
          camera={{ position: [0, 0, 4], fov: 55 }}
          gl={{ 
            antialias: true, 
            alpha: true,
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 1.2,
            powerPreference: 'high-performance',
          }}
          dpr={[1, 2]}
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
