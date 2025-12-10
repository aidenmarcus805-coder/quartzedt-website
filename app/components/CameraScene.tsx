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
function MonitorModel({ scrollProgress, groupRef, videoElement, mousePosition }: { 
  scrollProgress: number; 
  groupRef: React.RefObject<THREE.Group | null>;
  videoElement: HTMLVideoElement | null;
  mousePosition: { x: number; y: number };
}) {
  // Load OBJ
  const obj = useLoader(OBJLoader, '/monitor1.obj');
  
  const screenMaterialRef = useRef<THREE.MeshBasicMaterial>(null);
  const videoTextureRef = useRef<THREE.VideoTexture | null>(null);
  const displayMeshRef = useRef<THREE.Mesh | null>(null);
  const videoScreenRef = useRef<THREE.Mesh>(null);
  const glossScreenRef = useRef<THREE.Mesh>(null);
  
  // Screen geometry for Pro Display XDR (16:9 aspect ratio) - sized to fit display area
  const screenGeometry = useMemo(() => createRoundedRectGeometry(1.8, 1.0, 0.01), []);

  // Load shared textures (both display and stand use the same)
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
      // Shared textures for both display and stand
      baseColor: loadColor('/TEX/basecolor.png'),
      baseNormal: loadData('/TEX/basenormal.png'),
    };
  }, []);

  useEffect(() => {
    if (obj && textures) {
      obj.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          if (child.geometry) {
            child.geometry.computeVertexNormals();
          }
          
          const name = child.name;
          
          // Store reference to display mesh
          if (name.includes('material.001')) {
            displayMeshRef.current = child;
          }
          
          // Apply PBR materials based on mesh name
          if (name.includes('material.001')) {
            // Display - matte aluminum with shared textures
            child.material = new THREE.MeshStandardMaterial({
              map: textures.baseColor,
              normalMap: textures.baseNormal,
              normalScale: new THREE.Vector2(1, 1),
              metalness: 0.9,
              roughness: 0.55,
              side: THREE.DoubleSide,
              envMapIntensity: 0.6,
              wireframe: false,
            });
          } else if (name.includes('macpro_monitor_001-material')) {
            // Stand - brushed aluminum with shared textures
            child.material = new THREE.MeshStandardMaterial({
              map: textures.baseColor,
              normalMap: textures.baseNormal,
              normalScale: new THREE.Vector2(1, 1),
              metalness: 0.95,
              roughness: 0.45,
              side: THREE.DoubleSide,
              envMapIntensity: 0.8,
              wireframe: false,
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
    
    // Direct linear scroll progress - no smoothing
    const scrollEase = scrollProgress; // Linear interpolation
    
    if (groupRef.current) {
      const time = Date.now() * 0.001;
      
      // Enhanced floating animation
      const floatY = Math.sin(time * 0.5) * 0.02;
      const floatX = Math.cos(time * 0.3) * 0.01;
      const floatRot = Math.sin(time * 0.4) * 0.003;
      
      // Mouse parallax effect (subtle tilt toward cursor)
      const mouseInfluence = 1 - scrollEase * 0.5; // Reduce effect as we scroll
      const mouseRotY = mousePosition.x * 0.03 * mouseInfluence; // Reduced for slower movement
      const mouseRotX = mousePosition.y * 0.02 * mouseInfluence; // Reduced for slower movement
      
      // Scale for Pro Display XDR - Golden ratio progression
      // Start: Dramatic and immersive | End: Prominent at golden ratio
      const startScale = 5.72;
      const endScale = 3.0;
      const currentScale = THREE.MathUtils.lerp(startScale, endScale, scrollEase);
      groupRef.current.scale.setScalar(currentScale);
      
      // Position X - centered with floating (direct assignment)
      groupRef.current.position.x = THREE.MathUtils.lerp(0.05, 0.05, scrollEase) + floatX;
      
      // Position Y - Golden ratio vertical placement (adjusted lower)
      // Start: Centered lower | End: Upper half with breathing room for text
      groupRef.current.position.y = THREE.MathUtils.lerp(-5.85, -2.5, scrollEase) + floatY;
      
      // Rotation - base + floating + mouse parallax (direct assignment)
      const baseRotY = -Math.PI / 2;
      groupRef.current.rotation.y = baseRotY + floatRot + mouseRotY;
      groupRef.current.rotation.x = 0.02 + scrollEase * 0.03 + mouseRotX;
      
      groupRef.current.updateMatrixWorld();
    }
    
    // Tilt screens up based on scroll
    const displayTilt = THREE.MathUtils.lerp(0, 0, scrollEase);
    
    // Display mesh (Cube.001) - tilt on Z axis
    if (displayMeshRef.current) {
      displayMeshRef.current.rotation.z = displayTilt;
    }
    
    // Video screen - use ZYX rotation order so tilt applies correctly
    if (videoScreenRef.current) {
      videoScreenRef.current.rotation.order = 'ZYX';
      videoScreenRef.current.rotation.set(displayTilt, Math.PI / 2, 0);
    }
    
    // Gloss overlay - same rotation
    if (glossScreenRef.current) {
      glossScreenRef.current.rotation.order = 'ZYX';
      glossScreenRef.current.rotation.set(displayTilt, Math.PI / 2, 0);
    }
  });

  // Glossy overlay geometry - same size as screen
  const glossGeometry = useMemo(() => createRoundedRectGeometry(1.8, 1.0, 0.01), []);
  
  return (
    <group ref={groupRef} position={[0, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
      <primitive object={obj} />
      
      {/* Video screen - positioned on the Pro Display XDR panel */}
      <mesh 
        ref={videoScreenRef}
        position={[-0.099, 1, 0.008]}
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
      
      {/* Glossy screen overlay - subtle glass effect */}
      <mesh 
        ref={glossScreenRef}
        position={[-0.0988, 1, 0.008]}
        rotation={[0, Math.PI / 2, 0]}
        renderOrder={1000}
        geometry={glossGeometry}
      >
        <meshPhysicalMaterial 
          transparent={true}
          opacity={0.04}
          roughness={0.05}
          metalness={0.0}
          clearcoat={0.5}
          clearcoatRoughness={0.1}
          reflectivity={0.5}
          envMapIntensity={0.3}
          color="#ffffff"
        />
      </mesh>
    </group>
  );
}

// Scene
function Scene({ scrollProgress, videoElement, mousePosition }: { 
  scrollProgress: number; 
  videoElement: HTMLVideoElement | null;
  mousePosition: { x: number; y: number };
}) {
  const monitorGroupRef = useRef<THREE.Group>(null);
  
  return (
    <group position={[0, 0, 0]}>
      {/* Environment for reflections */}
      <Environment preset="city" environmentIntensity={0.5} />
      <Lighting />
      <MonitorModel 
        scrollProgress={scrollProgress} 
        groupRef={monitorGroupRef} 
        videoElement={videoElement}
        mousePosition={mousePosition}
      />
    </group>
  );
}

// Scene lighting for monitor - Clean studio lighting
function Lighting() {
  return (
    <>
      {/* Soft ambient for visibility */}
      <ambientLight intensity={0.1} color="#ffffff" />
      
      {/* KEY LIGHT - Main illumination from top-right */}
      <directionalLight 
        position={[5, 6, 6]} 
        intensity={1.5}
        color="#ffffff"
        castShadow
        shadow-mapSize={[2048, 2048]}
      />
      
      {/* RIM LIGHT - Subtle edge definition from back-left */}
      <directionalLight 
        position={[-6, 3, -3]} 
        intensity={0.8}
        color="#ffffff"
      />
      
      {/* FILL LIGHT - Soft from left side */}
      <directionalLight 
        position={[-5, 2, 4]} 
        intensity={0.5} 
        color="#f0f0f0"
      />
      
      {/* TOP LIGHT - Even from above */}
      <directionalLight
        position={[0, 8, 2]}
        intensity={0.6}
        color="#ffffff"
      />
      
      {/* FRONT ACCENT - Subtle face illumination */}
      <pointLight 
        position={[0, 1, 8]} 
        intensity={20} 
        color="#ffffff" 
        distance={15}
        decay={2}
      />
      
      {/* Soft gradient environment */}
      <hemisphereLight args={['#ffffff', '#1a1a1a', 0.3]} />
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
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [smoothMousePosition, setSmoothMousePosition] = useState({ x: 0, y: 0 });
  const videoRef = useRef<HTMLVideoElement>(null);
  const targetProgress = useRef(0);
  const isCompleteRef = useRef(false); // Ref for immediate checking

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
  
  // Mouse tracking for parallax effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Normalize mouse position to -1 to 1 range
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = (e.clientY / window.innerHeight) * 2 - 1;
      setMousePosition({ x, y });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Smooth animation loop with easing
  useEffect(() => {
    let animationFrame: number;
    
    const animate = () => {
      setAnimationProgress(prev => {
        const diff = targetProgress.current - prev;
        if (Math.abs(diff) < 0.001) return targetProgress.current;
        // Very fast interpolation - snappy response
        return prev + diff * 0.35;
      });
      
      // Smooth mouse position with slower, non-linear easing
      setSmoothMousePosition(prev => {
        const diffX = mousePosition.x - prev.x;
        const diffY = mousePosition.y - prev.y;
        
        // Apply easing function for non-linear smoothing
        const easedDiffX = diffX * 0.05; // Slower interpolation
        const easedDiffY = diffY * 0.05;
        
        return {
          x: prev.x + easedDiffX,
          y: prev.y + easedDiffY
        };
      });
      
      animationFrame = requestAnimationFrame(animate);
    };
    
    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [mousePosition]);

  // Wheel event handler
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      // Check ref instead of state for immediate response
      if (!isCompleteRef.current) {
        // Scroll sensitivity - slightly more scrolling required
        const delta = e.deltaY * 0.0009;
        targetProgress.current = Math.max(0, Math.min(1, targetProgress.current + delta));
        
        // Complete when close to end (avoid floating point issues)
        if (targetProgress.current >= 0.9999) {
          isCompleteRef.current = true; // Set ref immediately
          setIsAnimationComplete(true);
          targetProgress.current = 1;
          setAnimationProgress(1);
          // Immediately release scroll lock and remove padding
          document.body.style.overflow = '';
          document.body.style.paddingRight = '';
          const navbar = document.querySelector('nav');
          if (navbar && navbar instanceof HTMLElement) {
            navbar.style.paddingRight = '';
          }
          // Don't prevent this event - it continues to page scroll
          return;
        }
        
        e.preventDefault();
      }
    };

    const handleScroll = () => {
      if (isCompleteRef.current && window.scrollY <= 10) {
        isCompleteRef.current = false;
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

  // Lock scroll during animation - prevent scrollbar jitter
  useEffect(() => {
    const navbar = document.querySelector('nav');
    
    if (!isCompleteRef.current) {
      // Calculate scrollbar width to prevent layout shift
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = `${scrollbarWidth}px`;
      
      // Also compensate fixed navbar
      if (navbar && navbar instanceof HTMLElement) {
        navbar.style.paddingRight = `${scrollbarWidth}px`;
      }
    } else {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
      
      // Reset navbar padding
      if (navbar && navbar instanceof HTMLElement) {
        navbar.style.paddingRight = '';
      }
    }
    
    return () => {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
      if (navbar && navbar instanceof HTMLElement) {
        navbar.style.paddingRight = '';
      }
    };
  }, [isAnimationComplete]);

  return (
    <>
      {/* Monitor Scene with hero overlay - pure black background */}
      <div 
        className="w-full h-screen bg-black overflow-hidden"
        style={{ 
          position: 'relative',
          zIndex: 10,
        }}
      >
        {/* Minimal vignette for depth */}
        <div 
          className="absolute inset-0 pointer-events-none z-[5]"
          style={{
            background: 'radial-gradient(ellipse 70% 70% at 50% 50%, transparent 0%, rgba(0,0,0,0.4) 100%)',
          }}
        />
        
        {/* Subtle ground anchor - suggests monitor has weight */}
        <div 
          className="absolute bottom-0 left-0 right-0 h-[40vh] pointer-events-none z-[4]"
          style={{
            background: 'radial-gradient(ellipse 50% 60% at 50% 100%, rgba(0,0,0,0.3) 0%, transparent 60%)',
          }}
        />

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
            <Scene scrollProgress={animationProgress} videoElement={videoElement} mousePosition={smoothMousePosition} />
          </Suspense>
        </Canvas>

        {/* Initial centered text - VELLUM (fades out as you scroll) */}
        <div 
          className="absolute inset-0 flex flex-col justify-center items-center text-center pointer-events-none z-10"
          style={{ 
            opacity: Math.max(0, 1 - animationProgress * 2.8),
            transform: `translateY(${animationProgress * 30}px)`,
            transition: 'opacity 0.3s ease-out, transform 0.3s ease-out',
          }}
        >
          <span className="text-[10px] tracking-[0.5em] mb-8 text-white/30 font-light">
            AI VIDEO EDITOR
          </span>
          <h1 className="text-[clamp(64px,16vw,200px)] font-extralight leading-[0.85] tracking-[-0.05em] text-white">
            VELLUM
          </h1>
          <p className="mt-10 max-w-lg px-6 text-[15px] md:text-[17px] leading-[1.7] text-white/40 font-light">
            Precise edits. Made automatically.
          </p>
          
          {/* Minimal CTA */}
          <div 
            className="mt-12 pointer-events-auto"
          >
            <button className="px-10 py-4 text-[10px] tracking-[0.4em] text-white border border-white/20 hover:bg-white hover:text-black transition-all duration-300 font-light">
              START FREE TRIAL
            </button>
          </div>
        </div>

        {/* Hero text overlay - Lower third positioning */}
        <div 
          className="absolute inset-0 flex items-end pointer-events-none z-10"
          style={{ 
            opacity: animationProgress > 0.5 ? Math.min((animationProgress - 0.5) * 2, 1) : 0,
            paddingBottom: '18vh', // Lower third, balanced with monitor
          }}
        >
          {/* Text with subtle dark gradient for legibility */}
          <div className="absolute inset-0 pointer-events-none" style={{
            background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 50%)',
          }} />
          
          {/* Content aligned to grid */}
          <div className="max-w-[1600px] mx-auto px-8 md:px-12 lg:px-16 w-full relative z-10">
            <div className="max-w-4xl">
              {/* Main title */}
              <div className="overflow-hidden">
                <h1 
                  className="text-[clamp(56px,10vw,140px)] font-extralight leading-[0.9] tracking-[-0.05em] text-white"
                  style={{
                    transform: `translateY(${(1 - (animationProgress > 0.6 ? Math.min((animationProgress - 0.6) * 3, 1) : 0)) * 100}%)`,
                    textShadow: '0 2px 40px rgba(0,0,0,0.3)',
                  }}
                >
                  Weeks to<br />
                  <span className="text-white/60">Hours.</span>
                </h1>
              </div>
              
              {/* Tagline */}
              <div 
                className="mt-10 flex items-center gap-6"
                style={{
                  opacity: animationProgress > 0.8 ? Math.min((animationProgress - 0.8) * 4, 1) : 0,
                }}
              >
                <div 
                  className="h-[1px] bg-white/30"
                  style={{
                    width: `${(animationProgress > 0.85 ? Math.min((animationProgress - 0.85) * 5, 1) : 0) * 80}px`,
                  }}
                />
                <p className="text-[11px] tracking-[0.5em] text-white/50 font-light">
                  AI WEDDING EDITING
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
