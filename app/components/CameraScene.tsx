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
  const obj = useLoader(OBJLoader, '/ProDisplayXDR41.mtl.obj');
  
  const screenMaterialRef = useRef<THREE.MeshBasicMaterial>(null);
  const videoTextureRef = useRef<THREE.VideoTexture | null>(null);
  const displayMeshRef = useRef<THREE.Mesh | null>(null);
  const videoScreenRef = useRef<THREE.Mesh>(null);
  const glossScreenRef = useRef<THREE.Mesh>(null);
  
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
          
          // Store reference to display mesh (Cube.001)
          if (child.name === 'Cube.001' || child.name === 'Cube001') {
            displayMeshRef.current = child;
          }
          
          // Apply PBR materials based on mesh name
          if (name.includes('cube.017')) {
            // Cube.017 - matte plastic black
            child.material = new THREE.MeshStandardMaterial({
              color: '#2a2a2a',
              metalness: 0.0,
              roughness: 0.85,
              side: THREE.DoubleSide,
              envMapIntensity: 0.05,
            });
          } else if (name.includes('cylinder')) {
            // Stand/base parts - brushed aluminum
            child.material = new THREE.MeshStandardMaterial({
              map: textures.standBase,
              normalMap: textures.standNormal,
              roughnessMap: textures.standRoughness,
              metalnessMap: textures.standMetallic,
              normalScale: new THREE.Vector2(1, 1),
              metalness: 0.95,
              roughness: 0.45,
              side: THREE.DoubleSide,
              envMapIntensity: 0.8,
            });
          } else {
            // Display/monitor body parts - matte aluminum
            child.material = new THREE.MeshStandardMaterial({
              map: textures.displayBase,
              normalMap: textures.displayNormal,
              roughnessMap: textures.displayRoughness,
              metalnessMap: textures.displayMetallic,
              normalScale: new THREE.Vector2(1, 1),
              metalness: 0.9,
              roughness: 0.55,
              side: THREE.DoubleSide,
              envMapIntensity: 0.6,
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
      
      // Scale for Pro Display XDR - direct linear interpolation
      const startScale = 5.72;
      const endScale = 2.5;
      const currentScale = THREE.MathUtils.lerp(startScale, endScale, scrollEase);
      groupRef.current.scale.setScalar(currentScale);
      
      // Position X - centered with floating (direct assignment)
      groupRef.current.position.x = THREE.MathUtils.lerp(0.05, 0.05, scrollEase) + floatX;
      
      // Position Y - centered on screen with floating (direct assignment)
      groupRef.current.position.y = THREE.MathUtils.lerp(-5.85, -2.2, scrollEase) + floatY;
      
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
      {/* Monitor Scene with hero overlay - always relative, no layout shift */}
      <div 
        className="w-full h-screen bg-[#030303] overflow-hidden"
        style={{ 
          position: 'relative',
          zIndex: 10,
        }}
      >
        {/* Atmospheric depth layers - dramatic gradients */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 120% 80% at 80% 20%, rgba(40,20,60,0.4) 0%, transparent 50%)',
          }}
        />
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 100% 100% at 20% 80%, rgba(20,30,50,0.5) 0%, transparent 50%)',
          }}
        />
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 80% 60% at 50% 100%, rgba(30,20,40,0.6) 0%, transparent 60%)',
          }}
        />
        
        {/* Animated glow orb */}
        <div 
          className="absolute pointer-events-none"
          style={{
            width: '60vw',
            height: '60vw',
            top: '10%',
            right: '-10%',
            background: 'radial-gradient(circle, rgba(80,60,120,0.15) 0%, transparent 60%)',
            filter: 'blur(60px)',
            animation: 'pulse 8s ease-in-out infinite',
          }}
        />
        <div 
          className="absolute pointer-events-none"
          style={{
            width: '50vw',
            height: '50vw',
            bottom: '0%',
            left: '-10%',
            background: 'radial-gradient(circle, rgba(40,60,100,0.12) 0%, transparent 60%)',
            filter: 'blur(80px)',
            animation: 'pulse 10s ease-in-out infinite reverse',
          }}
        />
        
        {/* Strong vignette */}
        <div 
          className="absolute inset-0 pointer-events-none z-[5]"
          style={{
            background: 'radial-gradient(ellipse 60% 60% at 50% 50%, transparent 0%, rgba(0,0,0,0.7) 100%)',
          }}
        />
        
        {/* Top edge light bloom */}
        <div 
          className="absolute top-0 left-0 right-0 h-[30vh] pointer-events-none"
          style={{
            background: 'linear-gradient(to bottom, rgba(60,50,80,0.1) 0%, transparent 100%)',
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
            opacity: Math.max(0, 1 - animationProgress * 2.5),
            transform: `translateY(${animationProgress * 20}px)`,
            transition: 'opacity 0.4s ease-out, transform 0.4s ease-out',
            mixBlendMode: 'exclusion',
          }}
        >
          <span className="text-[11px] tracking-[0.4em] mb-5 text-white/70 font-light">
            AI VIDEO EDITOR
          </span>
          <h1 className="text-[clamp(52px,14vw,180px)] font-extralight leading-[0.9] tracking-[-0.04em] text-white">
            VELLUM
          </h1>
          <p className="mt-8 max-w-md px-4 text-[15px] leading-[1.8] text-white/60 font-light">
            Precise edits. Made automatically.
          </p>
          
          {/* CTA Buttons - Glassmorphism */}
          <div 
            className="mt-10 flex gap-4 pointer-events-auto"
            style={{ mixBlendMode: 'normal' }}
          >
            <a 
              href="#capabilities" 
              className="px-7 py-3.5 text-[10px] tracking-[0.2em] text-white/90 backdrop-blur-xl bg-white/[0.08] border border-white/[0.15] hover:bg-white/[0.15] hover:border-white/25 transition-all duration-500 rounded"
            >
              LEARN MORE
            </a>
            <a 
              href="/pricing" 
              className="px-7 py-3.5 text-[10px] tracking-[0.2em] text-black/90 bg-white hover:bg-white/90 transition-all duration-500 rounded font-medium"
            >
              PRICING
            </a>
          </div>
        </div>

        {/* Hero text overlay - OVERSIZED typography with strong motion */}
        <div 
          className="absolute inset-0 flex items-end justify-center pb-24 pointer-events-none z-10"
          style={{ 
            opacity: animationProgress > 0.4 ? Math.min((animationProgress - 0.4) * 2.5, 1) : 0,
          }}
        >
          <div className="flex flex-col items-center text-center">
            {/* Main title line 1 */}
            <div className="overflow-hidden">
              <h1 
                className="text-[clamp(72px,12vw,180px)] font-light leading-[0.85] tracking-[-0.04em] text-white"
                style={{
                  transform: `translateY(${(1 - (animationProgress > 0.5 ? Math.min((animationProgress - 0.5) * 4, 1) : 0)) * 100}%)`,
                }}
              >
                Cinematic.
              </h1>
            </div>
            
            {/* Main title line 2 - gradient fade */}
            <div className="overflow-hidden mt-[-0.1em]">
              <h1 
                className="text-[clamp(72px,12vw,180px)] font-light leading-[0.85] tracking-[-0.04em]"
                style={{
                  transform: `translateY(${(1 - (animationProgress > 0.6 ? Math.min((animationProgress - 0.6) * 4, 1) : 0)) * 100}%)`,
                  background: 'linear-gradient(180deg, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0.2) 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Automatic.
              </h1>
            </div>
            
            {/* Tagline with line animation */}
            <div 
              className="mt-12 flex flex-col items-center gap-6"
              style={{
                opacity: animationProgress > 0.75 ? Math.min((animationProgress - 0.75) * 5, 1) : 0,
                transform: `translateY(${(1 - (animationProgress > 0.75 ? Math.min((animationProgress - 0.75) * 5, 1) : 0)) * 30}px)`,
              }}
            >
              {/* Animated line */}
              <div 
                className="h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent"
                style={{
                  width: `${(animationProgress > 0.8 ? Math.min((animationProgress - 0.8) * 6, 1) : 0) * 120}px`,
                }}
              />
              
              <p className="text-[14px] tracking-[0.15em] text-white/50 font-light uppercase">
                Precise edits · Made automatically
              </p>
              
              {/* CTA */}
              <a 
                href="#features" 
                className="group mt-4 text-[11px] tracking-[0.3em] text-white/60 hover:text-white transition-all duration-500 flex items-center gap-4 pointer-events-auto"
              >
                <span className="w-8 h-[1px] bg-white/30 group-hover:w-12 group-hover:bg-white/60 transition-all duration-500" />
                EXPLORE
                <span className="w-8 h-[1px] bg-white/30 group-hover:w-12 group-hover:bg-white/60 transition-all duration-500" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
