'use client';

import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import { useRef, Suspense, useEffect, useState, useMemo, useCallback } from 'react';
import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';

// Create rounded rectangle geometry with proper UVs
function createRoundedRectGeometry(width: number, height: number, radius: number) {
  const shape = new THREE.Shape();
  const x = -width / 2;
  const y = -height / 2;
  
  shape.moveTo(x + radius, y);
  shape.lineTo(x + width - radius, y);
  shape.quadraticCurveTo(x + width, y, x + width, y + radius);
  shape.lineTo(x + width, y + height - radius);
  shape.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  shape.lineTo(x + radius, y + height);
  shape.quadraticCurveTo(x, y + height, x, y + height - radius);
  shape.lineTo(x, y + radius);
  shape.quadraticCurveTo(x, y, x + radius, y);
  
  const geometry = new THREE.ShapeGeometry(shape);
  
  // Compute proper UVs for texture mapping
  const pos = geometry.attributes.position;
  const uvs = new Float32Array(pos.count * 2);
  
  for (let i = 0; i < pos.count; i++) {
    const px = pos.getX(i);
    const py = pos.getY(i);
    // Map position to 0-1 UV range
    uvs[i * 2] = (px + width / 2) / width;
    uvs[i * 2 + 1] = (py + height / 2) / height;
  }
  
  geometry.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
  
  return geometry;
}

// 3D Monitor Model component with attached video screen
function MonitorModel({ scrollProgress, groupRef, videoElement }: { 
  scrollProgress: number; 
  groupRef: React.RefObject<THREE.Group | null>;
  videoElement: HTMLVideoElement | null;
}) {
  // Load OBJ
  const obj = useLoader(OBJLoader, '/ProDisplayXDR41.mtl.obj');
  
  const smoothProgress = useRef(0);
  const screenMaterialRef = useRef<THREE.MeshBasicMaterial>(null);
  const videoTextureRef = useRef<THREE.VideoTexture | null>(null);
  
  // Screen geometry for Pro Display XDR (16:9 aspect ratio) - sized to fit display area
  const screenGeometry = useMemo(() => createRoundedRectGeometry(1.8, 1.0, 0.01), []);

  // Load all PBR textures
  const textures = useMemo(() => {
    const loader = new THREE.TextureLoader();
    
    const loadColor = (path: string) => {
      const tex = loader.load(path);
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.flipY = true;
      tex.wrapS = THREE.RepeatWrapping;
      tex.wrapT = THREE.RepeatWrapping;
      return tex;
    };
    
    const loadData = (path: string) => {
      const tex = loader.load(path);
      tex.colorSpace = THREE.LinearSRGBColorSpace;
      tex.flipY = true;
      tex.wrapS = THREE.RepeatWrapping;
      tex.wrapT = THREE.RepeatWrapping;
      return tex;
    };
    
    return {
      // Display textures
      displayBase: loadColor('/TEX/Display_BaseColor.png'),
      displayNormal: loadData('/TEX/Display_Normal.png'),
      displayRoughness: loadData('/TEX/Display_Roughness.png'),
      displayMetallic: loadData('/TEX/Display_Metallic.png'),
      // Stand textures
      standBase: loadColor('/TEX/Stand_BaseColor.png'),
      standNormal: loadData('/TEX/Stand_Normal.png'),
      standRoughness: loadData('/TEX/Stand_Roughness.png'),
      standMetallic: loadData('/TEX/Stand_Metallic.png'),
    };
  }, []);

  useEffect(() => {
    if (obj && textures) {
      obj.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          if (child.geometry) {
            child.geometry.computeVertexNormals();
          }
          
          const name = child.name.toLowerCase();
          
          // Apply PBR materials based on mesh name
          if (name.includes('cylinder') || name.includes('cube.017')) {
            // Stand/base parts - polished aluminum
            child.material = new THREE.MeshPhysicalMaterial({
              map: textures.standBase,
              normalMap: textures.standNormal,
              roughnessMap: textures.standRoughness,
              metalnessMap: textures.standMetallic,
              normalScale: new THREE.Vector2(1.2, 1.2),
              metalness: 1.0,
              roughness: 0.15,
              side: THREE.DoubleSide,
              envMapIntensity: 2.0,
              clearcoat: 0.1,
              clearcoatRoughness: 0.4,
            });
          } else {
            // Display/monitor body parts - matte aluminum with subtle sheen
            child.material = new THREE.MeshPhysicalMaterial({
              map: textures.displayBase,
              normalMap: textures.displayNormal,
              roughnessMap: textures.displayRoughness,
              metalnessMap: textures.displayMetallic,
              normalScale: new THREE.Vector2(1.2, 1.2),
              metalness: 1.0,
              roughness: 0.35,
              side: THREE.DoubleSide,
              envMapIntensity: 1.8,
              clearcoat: 0.05,
              clearcoatRoughness: 0.5,
            });
          }
          
          child.castShadow = true;
          child.receiveShadow = true;
          child.frustumCulled = false;
        }
      });
    }
  }, [obj, textures]);

  useFrame(() => {
    // Create video texture when video is ready
    if (videoElement && !videoTextureRef.current && videoElement.readyState >= 2) {
      const texture = new THREE.VideoTexture(videoElement);
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.generateMipmaps = false;
      texture.anisotropy = 16;
      videoTextureRef.current = texture;
      
      if (screenMaterialRef.current) {
        screenMaterialRef.current.map = texture;
        screenMaterialRef.current.color = new THREE.Color(0xffffff);
        screenMaterialRef.current.needsUpdate = true;
      }
    }
    
    // Update video texture
    if (videoTextureRef.current) {
      videoTextureRef.current.needsUpdate = true;
    }
    
    // Smooth the scroll progress
    smoothProgress.current += (scrollProgress - smoothProgress.current) * 0.18;
    const progress = smoothProgress.current;
    
    if (groupRef.current) {
      const time = Date.now() * 0.001;
      const idleY = Math.sin(time * 0.3) * 0.002;
      
      const scrollEase = Math.min(progress * 2, 1);
      
      // Scale for Pro Display XDR
      const startScale = 5.72;
      const endScale = 1.9;
      const currentScale = THREE.MathUtils.lerp(startScale, endScale, scrollEase);
      groupRef.current.scale.setScalar(currentScale);
      
      // Position X - centered then slight right movement  
      const targetX = THREE.MathUtils.lerp(0.05, 1.0, scrollEase);
      groupRef.current.position.x = THREE.MathUtils.lerp(
        groupRef.current.position.x,
        targetX,
        0.15
      );
      
      // Position Y - centered on screen
      const targetY = THREE.MathUtils.lerp(-5.85, -1.3, scrollEase);
      groupRef.current.position.y = THREE.MathUtils.lerp(
        groupRef.current.position.y,
        targetY,
        0.15
      );
      
      // Rotation - keep -90 degree base + slight animation on scroll
      const baseRotY = -Math.PI / 2; // -90 degrees to face viewer
      const targetRotY = baseRotY + THREE.MathUtils.lerp(0, -0.3, scrollEase) + idleY;
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        targetRotY,
        0.12
      );
      
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        0.02 + scrollEase * 0.03,
        0.12
      );
      
      groupRef.current.updateMatrixWorld();
    }
  });

  // Glossy overlay geometry - same size as screen
  const glossGeometry = useMemo(() => createRoundedRectGeometry(1.8, 1.0, 0.01), []);
  
  return (
    <group ref={groupRef} position={[0, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
      <primitive object={obj} />
      
      {/* Video screen - positioned on the Pro Display XDR panel */}
      <mesh 
        position={[-0.0998, 1, 0.008]}
        rotation={[0, Math.PI / 2, 0]}
        renderOrder={999}
        geometry={screenGeometry}
      >
        <meshBasicMaterial 
          ref={screenMaterialRef}
          color="#111111"
          toneMapped={false}
        />
      </mesh>
      
      {/* Glossy screen overlay - Pro Display XDR glass effect */}
      <mesh 
        position={[-0.0988, 1, 0.008]}
        rotation={[0, Math.PI / 2, 0]}
        renderOrder={1000}
        geometry={glossGeometry}
      >
        <meshPhysicalMaterial 
          transparent={true}
          opacity={0.06}
          roughness={0.02}
          metalness={0.0}
          clearcoat={1.0}
          clearcoatRoughness={0.02}
          reflectivity={0.98}
          envMapIntensity={0.4}
          color="#ffffff"
        />
      </mesh>
    </group>
  );
}

// Scene
function Scene({ scrollProgress, videoElement }: { scrollProgress: number; videoElement: HTMLVideoElement | null }) {
  const monitorGroupRef = useRef<THREE.Group>(null);
  
  return (
    <group position={[0, 0, 0]}>
      {/* Premium studio environment for rich reflections */}
      <Environment preset="studio" environmentIntensity={0.6} />
      <Lighting />
      <MonitorModel 
        scrollProgress={scrollProgress} 
        groupRef={monitorGroupRef} 
        videoElement={videoElement}
      />
    </group>
  );
}

// Scene lighting for monitor - Premium studio lighting
function Lighting() {
  return (
    <>
      {/* Very subtle ambient for deep blacks */}
      <ambientLight intensity={0.03} color="#0a0a12" />
      
      {/* HERO KEY LIGHT - Strong from top-right, warm white */}
      <spotLight 
        position={[6, 8, 8]} 
        intensity={80}
        angle={0.5}
        penumbra={0.8}
        color="#fff8f0"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0001}
      />
      
      {/* DRAMATIC RIM LIGHT - Back-left edge, creates aluminum glow */}
      <spotLight 
        position={[-8, 4, -4]} 
        intensity={120}
        angle={0.4}
        penumbra={1}
        color="#ffffff"
        target-position={[0, 0, 0]}
      />
      
      {/* SECONDARY RIM - Back-right for symmetry */}
      <spotLight 
        position={[8, 3, -5]} 
        intensity={60}
        angle={0.5}
        penumbra={0.9}
        color="#e8f0ff"
      />
      
      {/* FILL LIGHT - Cool blue from left, subtle */}
      <directionalLight 
        position={[-6, 2, 5]} 
        intensity={0.4} 
        color="#b8d4ff"
      />
      
      {/* TOP SOFTBOX - Even illumination from above */}
      <rectAreaLight
        position={[0, 10, 3]}
        width={12}
        height={12}
        intensity={2}
        color="#ffffff"
        rotation={[-Math.PI / 2, 0, 0]}
      />
      
      {/* BOTTOM BOUNCE - Subtle reflection from below (like studio floor) */}
      <rectAreaLight
        position={[0, -4, 2]}
        width={10}
        height={6}
        intensity={0.3}
        color="#1a1a20"
        rotation={[Math.PI / 2, 0, 0]}
      />
      
      {/* ACCENT LIGHT - Subtle warm glow on stand */}
      <pointLight 
        position={[0, -1, 4]} 
        intensity={15} 
        color="#ffede0" 
        distance={8}
        decay={2}
      />
      
      {/* FRONT FACE LIGHT - Very subtle to see screen bezel */}
      <pointLight 
        position={[0, 2, 10]} 
        intensity={8} 
        color="#ffffff" 
        distance={20}
        decay={2}
      />
      
      {/* Environment gradient */}
      <hemisphereLight args={['#1a1a2e', '#050508', 0.15]} />
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
    <mesh ref={meshRef}>
      <boxGeometry args={[2, 1.4, 0.8]} />
      <meshStandardMaterial color="#333333" metalness={0.5} roughness={0.5} />
    </mesh>
  );
}

// Main component with scroll hijacking
export default function CameraScene() {
  const [animationProgress, setAnimationProgress] = useState(0);
  const [isAnimationComplete, setIsAnimationComplete] = useState(false);
  const [videoElement, setVideoElement] = useState<HTMLVideoElement | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const targetProgress = useRef(0);

  const handleVideoRef = useCallback((element: HTMLVideoElement | null) => {
    videoRef.current = element;
    if (element) {
      element.load();
      element.addEventListener('loadeddata', () => {
        setVideoElement(element);
        element.play().catch(console.error);
      });
      element.play().catch(() => {});
      setVideoElement(element);
    }
  }, []);

  // Smooth animation loop
  useEffect(() => {
    let animationFrame: number;
    
    const animate = () => {
      setAnimationProgress(prev => {
        const diff = targetProgress.current - prev;
        if (Math.abs(diff) < 0.001) return targetProgress.current;
        return prev + diff * 0.1;
      });
      animationFrame = requestAnimationFrame(animate);
    };
    
    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, []);

  // Wheel event handler
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (!isAnimationComplete) {
        e.preventDefault();
        
        const delta = e.deltaY * 0.0004;
        targetProgress.current = Math.max(0, Math.min(1, targetProgress.current + delta));
        
        if (targetProgress.current >= 0.99) {
          setIsAnimationComplete(true);
          targetProgress.current = 1;
          setAnimationProgress(1);
        }
      }
    };

    const handleScroll = () => {
      if (isAnimationComplete && window.scrollY <= 10) {
        setIsAnimationComplete(false);
        targetProgress.current = 0.99;
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isAnimationComplete]);

  // Lock scroll during animation
  useEffect(() => {
    if (!isAnimationComplete) {
      document.body.style.overflow = 'hidden';
      document.body.style.height = '100vh';
    } else {
      document.body.style.overflow = '';
      document.body.style.height = '';
    }
    
    return () => {
      document.body.style.overflow = '';
      document.body.style.height = '';
    };
  }, [isAnimationComplete]);

  return (
    <>
      {/* Monitor Scene with hero overlay */}
      <div 
        className="w-full h-screen bg-[#050505]"
        style={{ 
          position: isAnimationComplete ? 'relative' : 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: isAnimationComplete ? 1 : 50,
        }}
      >
        <video
          ref={handleVideoRef}
          className="hidden"
          autoPlay
          muted
          loop
          playsInline
        >
          <source src="/videoplayback1.mp4" type="video/mp4" />
        </video>

        {/* 3D Canvas with high quality settings */}
        <Canvas
          camera={{ position: [0, 0, 5], fov: 50 }}
          gl={{ 
            antialias: true, 
            alpha: true,
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 1.0,
            powerPreference: 'high-performance',
            outputColorSpace: THREE.SRGBColorSpace,
          }}
          dpr={[2, 3]}
          shadows="soft"
          style={{ background: 'transparent' }}
        >
          <Suspense fallback={<LoadingFallback />}>
            <Scene scrollProgress={animationProgress} videoElement={videoElement} />
          </Suspense>
        </Canvas>

        {/* Initial centered text - VELLUM (fades out as you scroll) */}
        <div 
          className="absolute inset-0 flex flex-col justify-center items-center text-center pointer-events-none z-10"
          style={{ 
            opacity: Math.max(0, 1 - animationProgress * 2.5),
            transition: 'opacity 0.3s ease',
            mixBlendMode: 'exclusion',
          }}
        >
          <span className="text-[10px] tracking-[0.3em] mb-4 text-white">
            AI VIDEO EDITOR
          </span>
          <h1 className="text-[clamp(48px,12vw,160px)] font-light leading-[0.95] tracking-[-0.03em] text-white">
            VELLUM
          </h1>
          <p className="mt-6 max-w-md px-4 text-[15px] leading-[1.7] text-white">
            AI-powered precision editing that transforms hours of wedding footage into cinematic stories.
          </p>
          
          {/* CTA Buttons - Glassmorphism */}
          <div 
            className="mt-8 flex gap-4 pointer-events-auto"
            style={{ mixBlendMode: 'normal' }}
          >
            <a 
              href="#capabilities" 
              className="px-6 py-3 text-[11px] tracking-[0.15em] text-white backdrop-blur-md bg-white/10 border border-white/30 hover:bg-white/20 transition-all duration-300 rounded-sm"
            >
              LEARN MORE
            </a>
            <a 
              href="/pricing" 
              className="px-6 py-3 text-[11px] tracking-[0.15em] text-black backdrop-blur-md bg-white/90 border border-white/50 hover:bg-white transition-all duration-300 rounded-sm"
            >
              PRICING
            </a>
          </div>
        </div>

        {/* Hero text overlay - "Edit less, Create more" layout (fades in as you scroll) */}
        <div 
          className="absolute inset-0 flex items-end pb-16 px-12 pointer-events-none z-10"
          style={{ 
            opacity: animationProgress > 0.5 ? Math.min((animationProgress - 0.5) * 2, 1) : 0,
            transition: 'opacity 0.5s ease'
          }}
        >
          <div className="flex justify-between items-end w-full">
            {/* Left side - Large text */}
            <div className="flex flex-col">
              <h1 
                className="text-[clamp(60px,10vw,140px)] font-light leading-[0.95] tracking-[-0.02em] text-white"
                style={{
                  transform: animationProgress > 0.6 ? 'translateY(0)' : 'translateY(40px)',
                  opacity: animationProgress > 0.6 ? 1 : 0,
                  transition: 'transform 0.8s ease, opacity 0.8s ease'
                }}
              >
                Edit less
              </h1>
              <h1 
                className="text-[clamp(60px,10vw,140px)] font-light leading-[0.95] tracking-[-0.02em] text-white/30"
                style={{
                  transform: animationProgress > 0.7 ? 'translateY(0)' : 'translateY(40px)',
                  opacity: animationProgress > 0.7 ? 1 : 0,
                  transition: 'transform 0.8s ease, opacity 0.8s ease',
                  transitionDelay: '0.1s'
                }}
              >
                Create more
              </h1>
            </div>
            
            {/* Right side - Description and CTA */}
            <div 
              className="flex flex-col items-end text-right max-w-sm pointer-events-auto"
              style={{
                opacity: animationProgress > 0.8 ? 1 : 0,
                transform: animationProgress > 0.8 ? 'translateY(0)' : 'translateY(20px)',
                transition: 'transform 0.8s ease, opacity 0.8s ease',
                transitionDelay: '0.2s'
              }}
            >
              <p className="text-[14px] leading-[1.7] text-white/50 mb-6">
                AI-powered precision editing that transforms hours of wedding footage into cinematic stories.
              </p>
              <a 
                href="#features" 
                className="text-[11px] tracking-[0.2em] text-white/70 hover:text-white transition-colors flex items-center gap-2"
              >
                LEARN MORE
                <span className="text-lg">→</span>
              </a>
            </div>
          </div>
        </div>
        
        {/* Progress indicator */}
        {!isAnimationComplete && (
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-20">
            <div className="w-20 h-1 bg-white/10 rounded-full overflow-hidden">
              <div 
                className="h-full bg-white/50 rounded-full transition-all duration-100"
                style={{ width: `${animationProgress * 100}%` }}
              />
            </div>
            <span className="text-[9px] tracking-[0.2em] text-white/30">SCROLL</span>
          </div>
        )}
      </div>
    </>
  );
}
