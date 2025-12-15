'use client';

import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import { useRef, Suspense, useEffect, useState, useMemo, useCallback } from 'react';
import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js';

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
  // Load MTL first, then OBJ with materials
  const materials = useLoader(MTLLoader, '/monitor1.mtl');
  const obj = useLoader(OBJLoader, '/monitor1.obj', (loader) => {
    materials.preload();
    loader.setMaterials(materials);
  });
  
  const screenMaterialRef = useRef<THREE.MeshBasicMaterial>(null);
  const videoTextureRef = useRef<THREE.VideoTexture | null>(null);
  const displayMeshRef = useRef<THREE.Mesh | null>(null);
  const videoScreenRef = useRef<THREE.Mesh>(null);
  const glossScreenRef = useRef<THREE.Mesh>(null);
  const displayBaseQuatRef = useRef<THREE.Quaternion | null>(null);
  const displayFitRef = useRef<{
    min: THREE.Vector3;
    max: THREE.Vector3;
    center: THREE.Vector3;
    size: THREE.Vector3;
    thicknessAxis: 0 | 1 | 2;
    widthAxis: 0 | 1 | 2;
    heightAxis: 0 | 1 | 2;
    planeNormalPlus: THREE.Vector3;
    planeCenterPlus: THREE.Vector3;
    planeNormalMinus: THREE.Vector3;
    planeCenterMinus: THREE.Vector3;
  } | null>(null);
  const tmp = useMemo(() => ({
    qDisplayWorld: new THREE.Quaternion(),
    qGroupWorld: new THREE.Quaternion(),
    qTilt: new THREE.Quaternion(),
    qWorld: new THREE.Quaternion(),
    qLocal: new THREE.Quaternion(),
    mBasis: new THREE.Matrix4(),
    vDisplayWorldPos: new THREE.Vector3(),
    vToCam: new THREE.Vector3(),
    vAxisLocal: new THREE.Vector3(),
    vAxisWorld: new THREE.Vector3(),
    vRightLocal: new THREE.Vector3(),
    vUpLocal: new THREE.Vector3(),
    vNormalWorld: new THREE.Vector3(),
    vRightWorld: new THREE.Vector3(),
    vUpWorld: new THREE.Vector3(),
    vAnchorLocal: new THREE.Vector3(),
    vAnchorWorld: new THREE.Vector3(),
    vAnchorGroup: new THREE.Vector3(),
    vCross: new THREE.Vector3(),
    vNormalPlus: new THREE.Vector3(),
    vNormalMinus: new THREE.Vector3(),
  }), []);
  
  // Screen geometry - sized to match monitor1.obj display dimensions (1% smaller)
  const screenGeometry = useMemo(() => createRoundedRectGeometry(1.68, 0.96, 0.01), []);

  // Load textures for manual material application
  const textures = useMemo(() => {
    const loader = new THREE.TextureLoader();
    
    const baseColor = loader.load('/TEX/basecolor.png');
    baseColor.colorSpace = THREE.SRGBColorSpace;
    baseColor.flipY = false;
    
    const baseNormal = loader.load('/TEX/basenormal.png');
    baseNormal.colorSpace = THREE.LinearSRGBColorSpace;
    baseNormal.flipY = false;
    
    return { baseColor, baseNormal };
  }, []);

  useEffect(() => {
    if (obj && textures) {
      obj.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          if (child.geometry) {
            child.geometry.computeVertexNormals();
          }
          
          const name = child.name;
          
          // Store reference to display mesh and set rotation order once
          if (name.includes('material.001')) {
            displayMeshRef.current = child;
            if (!displayBaseQuatRef.current) {
              displayBaseQuatRef.current = child.quaternion.clone();
            }

            const geom = child.geometry as THREE.BufferGeometry;
            geom.computeBoundingBox();
            const bb = geom.boundingBox;
            if (bb && !displayFitRef.current) {
              const size = new THREE.Vector3();
              bb.getSize(size);
              const center = new THREE.Vector3();
              bb.getCenter(center);

              let thicknessAxis: 0 | 1 | 2 = 0;
              if (size.y <= size.x && size.y <= size.z) thicknessAxis = 1;
              else if (size.z <= size.x && size.z <= size.y) thicknessAxis = 2;

              const remaining: Array<0 | 1 | 2> = [0, 1, 2].filter((a) => a !== thicknessAxis) as Array<0 | 1 | 2>;
              let widthAxis = remaining[0];
              let heightAxis = remaining[1];
              if (size.getComponent(widthAxis) < size.getComponent(heightAxis)) {
                const t = widthAxis;
                widthAxis = heightAxis;
                heightAxis = t;
              }

              // Approximate the actual front/back display plane by averaging the triangles
              // whose normals align with the "thickness" axis. This makes the video plane
              // match the real screen face even if the mesh is slightly slanted.
              const thicknessAxisVec = new THREE.Vector3(0, 0, 0);
              thicknessAxisVec.setComponent(thicknessAxis, 1);

              const posAttr = geom.getAttribute('position') as THREE.BufferAttribute;
              const idxAttr = geom.index;
              const idxArray = idxAttr ? (idxAttr.array as ArrayLike<number>) : null;

              const a = new THREE.Vector3();
              const b = new THREE.Vector3();
              const c = new THREE.Vector3();
              const ab = new THREE.Vector3();
              const ac = new THREE.Vector3();
              const cross = new THREE.Vector3();
              const centroidTri = new THREE.Vector3();

              const sumNPlus = new THREE.Vector3();
              const sumCPlus = new THREE.Vector3();
              let areaPlus = 0;
              const sumNMinus = new THREE.Vector3();
              const sumCMinus = new THREE.Vector3();
              let areaMinus = 0;

              const getV = (i: number, out: THREE.Vector3) => {
                out.fromBufferAttribute(posAttr, i);
                return out;
              };

              const triCount = idxArray ? idxArray.length / 3 : Math.floor(posAttr.count / 3);
              for (let tIdx = 0; tIdx < triCount; tIdx++) {
                const ia = idxArray ? Number(idxArray[tIdx * 3]) : tIdx * 3;
                const ib = idxArray ? Number(idxArray[tIdx * 3 + 1]) : tIdx * 3 + 1;
                const ic = idxArray ? Number(idxArray[tIdx * 3 + 2]) : tIdx * 3 + 2;

                getV(ia, a);
                getV(ib, b);
                getV(ic, c);

                ab.copy(b).sub(a);
                ac.copy(c).sub(a);
                cross.copy(ab).cross(ac);
                const crossLen = cross.length();
                if (crossLen < 1e-10) continue;

                const area = crossLen * 0.5;
                const normal = cross.multiplyScalar(1 / crossLen); // normalized
                const dot = normal.dot(thicknessAxisVec);
                const absDot = Math.abs(dot);
                if (absDot < 0.8) continue;

                centroidTri.copy(a).add(b).add(c).multiplyScalar(1 / 3);

                if (dot >= 0) {
                  sumNPlus.addScaledVector(normal, area);
                  sumCPlus.addScaledVector(centroidTri, area);
                  areaPlus += area;
                } else {
                  sumNMinus.addScaledVector(normal, area);
                  sumCMinus.addScaledVector(centroidTri, area);
                  areaMinus += area;
                }
              }

              const planeNormalPlus = areaPlus > 0 ? sumNPlus.normalize() : thicknessAxisVec.clone();
              const planeCenterPlus = areaPlus > 0 ? sumCPlus.multiplyScalar(1 / areaPlus) : center.clone();
              const planeNormalMinus = areaMinus > 0 ? sumNMinus.normalize() : thicknessAxisVec.clone().multiplyScalar(-1);
              const planeCenterMinus = areaMinus > 0 ? sumCMinus.multiplyScalar(1 / areaMinus) : center.clone();

              displayFitRef.current = {
                min: bb.min.clone(),
                max: bb.max.clone(),
                center,
                size,
                thicknessAxis,
                widthAxis,
                heightAxis,
                planeNormalPlus,
                planeCenterPlus,
                planeNormalMinus,
                planeCenterMinus,
              };
            }
          }
          
          // Apply materials based on mesh name
          if (name === 'macpro_monitor_001-material') {
            child.material = new THREE.MeshStandardMaterial({
              map: textures.baseColor,
              normalMap: textures.baseNormal,
              normalScale: new THREE.Vector2(1, 1),
              metalness: 0.95,
              roughness: 0.45,
              side: THREE.DoubleSide,
              envMapIntensity: 0.8,
            });
          }
          
          child.castShadow = false; // Disable for performance
          child.receiveShadow = true;
          child.frustumCulled = true; // Enable frustum culling
        }
      });
    }
  }, [obj, textures]);

  useFrame((state) => {
    // Create video texture when video is ready (only once)
    if (videoElement && !videoTextureRef.current && videoElement.readyState >= 2) {
      const texture = new THREE.VideoTexture(videoElement);
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.generateMipmaps = false;
      texture.anisotropy = 4; // Reduced from 16 for performance
      videoTextureRef.current = texture;
      
      if (screenMaterialRef.current) {
        screenMaterialRef.current.map = texture;
        screenMaterialRef.current.color.setHex(0xffffff);
        screenMaterialRef.current.needsUpdate = true;
      }
    }
    
    // Skip heavy calculations if not needed
    if (!groupRef.current) return;
    
    const scrollEase = scrollProgress;
    const time = performance.now() * 0.001; // Use performance.now() - faster than Date.now()
    
    // Simplified floating animation
    const floatY = Math.sin(time * 0.5) * 0.02;
    const floatX = Math.cos(time * 0.3) * 0.01;
    const floatRot = Math.sin(time * 0.4) * 0.003;
    
    // Mouse parallax effect
    const mouseInfluence = 1 - scrollEase * 0.5;
    const mouseRotY = mousePosition.x * 0.03 * mouseInfluence;
    const mouseRotX = mousePosition.y * 0.02 * mouseInfluence;
    
    // Scale
    const currentScale = 5.92 + (3.35 - 5.92) * scrollEase; // Inline lerp
    groupRef.current.scale.setScalar(currentScale);
    
    // Position
    groupRef.current.position.x = -0.05 + floatX;
    // Drop the whole monitor slightly at the end of the scroll (scrollEase=1)
    groupRef.current.position.y = -5.2 + (3.35) * scrollEase - 0.3 * scrollEase + floatY;
    
    // Rotation
    groupRef.current.rotation.y = -Math.PI / 2 + floatRot + mouseRotY;
    // No base tilt at scroll=0
    groupRef.current.rotation.x = scrollEase * 0.03 + mouseRotX;
    
    // Tilt screens up based on scroll
    // NOTE: The model has a baked-in ~2.5° upward tilt from Blender; we cancel it at scroll=0.
    const blenderBaseTilt = THREE.MathUtils.degToRad(2.5);
    const endTilt = 0.09; // ~5° at scroll=1
    const displayTilt = -blenderBaseTilt + (blenderBaseTilt + endTilt) * scrollEase;

    // If we have the display mesh + its bounds, drive screen placement from it (no more guessed numbers)
    const display = displayMeshRef.current;
    const fit = displayFitRef.current;
    const baseQuat = displayBaseQuatRef.current;
    const videoMesh = videoScreenRef.current;
    const glossMesh = glossScreenRef.current;

    if (!display || !fit || !baseQuat || !videoMesh || !glossMesh) return;

    // Ensure matrices are current before we do world/local conversions
    groupRef.current.updateWorldMatrix(true, true);

    // Reset to base orientation, then apply tilt around the display "width" axis (horizontal)
    display.quaternion.copy(baseQuat);
    groupRef.current.updateWorldMatrix(true, true);

    // Compute world axes at base orientation
    display.getWorldQuaternion(tmp.qDisplayWorld);
    display.getWorldPosition(tmp.vDisplayWorldPos);
    tmp.vToCam.copy(state.camera.position).sub(tmp.vDisplayWorldPos).normalize();

    // Pick the display plane (plus/minus) that faces the camera
    tmp.vNormalPlus.copy(fit.planeNormalPlus).applyQuaternion(tmp.qDisplayWorld).normalize();
    tmp.vNormalMinus.copy(fit.planeNormalMinus).applyQuaternion(tmp.qDisplayWorld).normalize();
    const usePlus = tmp.vNormalPlus.dot(tmp.vToCam) >= tmp.vNormalMinus.dot(tmp.vToCam);
    const planeNormalLocal = usePlus ? fit.planeNormalPlus : fit.planeNormalMinus;
    tmp.vNormalWorld.copy(usePlus ? tmp.vNormalPlus : tmp.vNormalMinus).normalize();

    // Build a stable local basis on the screen plane:
    // upCandidate = local "height axis" projected onto the plane
    tmp.vAxisLocal.set(0, 0, 0);
    tmp.vAxisLocal.setComponent(fit.heightAxis, 1);
    tmp.vUpLocal.copy(tmp.vAxisLocal).addScaledVector(planeNormalLocal, -tmp.vAxisLocal.dot(planeNormalLocal));
    if (tmp.vUpLocal.lengthSq() < 1e-8) {
      tmp.vAxisLocal.set(0, 0, 0);
      tmp.vAxisLocal.setComponent(fit.widthAxis, 1);
      tmp.vUpLocal.copy(tmp.vAxisLocal).addScaledVector(planeNormalLocal, -tmp.vAxisLocal.dot(planeNormalLocal));
    }
    tmp.vUpLocal.normalize();
    tmp.vRightLocal.copy(tmp.vUpLocal).cross(planeNormalLocal).normalize();
    tmp.vUpLocal.copy(planeNormalLocal).cross(tmp.vRightLocal).normalize();

    // World basis vectors (right/up/normal)
    tmp.vRightWorld.copy(tmp.vRightLocal).applyQuaternion(tmp.qDisplayWorld).normalize();
    tmp.vUpWorld.copy(tmp.vUpLocal).applyQuaternion(tmp.qDisplayWorld).normalize();

    // Choose tilt direction so the screen leans "back" (normal gains positive component along the up axis)
    tmp.qTilt.setFromAxisAngle(tmp.vRightWorld, 0.01);
    tmp.vNormalPlus.copy(tmp.vNormalWorld).applyQuaternion(tmp.qTilt);
    tmp.qTilt.setFromAxisAngle(tmp.vRightWorld, -0.01);
    tmp.vNormalMinus.copy(tmp.vNormalWorld).applyQuaternion(tmp.qTilt);
    const tiltSign = tmp.vNormalPlus.dot(tmp.vUpWorld) >= tmp.vNormalMinus.dot(tmp.vUpWorld) ? 1 : -1;

    // Apply tilt in DISPLAY-LOCAL space about the screen's right axis
    tmp.qTilt.setFromAxisAngle(tmp.vRightLocal, tiltSign * displayTilt);
    display.quaternion.copy(baseQuat).multiply(tmp.qTilt);

    // Update matrices after tilt
    groupRef.current.updateWorldMatrix(true, true);

    // Recompute world basis vectors after tilt
    display.getWorldQuaternion(tmp.qDisplayWorld);
    display.getWorldPosition(tmp.vDisplayWorldPos);
    tmp.vToCam.copy(state.camera.position).sub(tmp.vDisplayWorldPos).normalize();

    tmp.vNormalPlus.copy(fit.planeNormalPlus).applyQuaternion(tmp.qDisplayWorld).normalize();
    tmp.vNormalMinus.copy(fit.planeNormalMinus).applyQuaternion(tmp.qDisplayWorld).normalize();
    const usePlusAfter = tmp.vNormalPlus.dot(tmp.vToCam) >= tmp.vNormalMinus.dot(tmp.vToCam);
    const planeNormalLocalAfter = usePlusAfter ? fit.planeNormalPlus : fit.planeNormalMinus;
    const planeCenterLocalAfter = usePlusAfter ? fit.planeCenterPlus : fit.planeCenterMinus;
    tmp.vNormalWorld.copy(usePlusAfter ? tmp.vNormalPlus : tmp.vNormalMinus).normalize();

    // Rebuild local basis after tilt using the chosen plane normal
    tmp.vAxisLocal.set(0, 0, 0);
    tmp.vAxisLocal.setComponent(fit.heightAxis, 1);
    tmp.vUpLocal.copy(tmp.vAxisLocal).addScaledVector(planeNormalLocalAfter, -tmp.vAxisLocal.dot(planeNormalLocalAfter));
    if (tmp.vUpLocal.lengthSq() < 1e-8) {
      tmp.vAxisLocal.set(0, 0, 0);
      tmp.vAxisLocal.setComponent(fit.widthAxis, 1);
      tmp.vUpLocal.copy(tmp.vAxisLocal).addScaledVector(planeNormalLocalAfter, -tmp.vAxisLocal.dot(planeNormalLocalAfter));
    }
    tmp.vUpLocal.normalize();
    tmp.vRightLocal.copy(tmp.vUpLocal).cross(planeNormalLocalAfter).normalize();
    tmp.vUpLocal.copy(planeNormalLocalAfter).cross(tmp.vRightLocal).normalize();

    tmp.vRightWorld.copy(tmp.vRightLocal).applyQuaternion(tmp.qDisplayWorld).normalize();
    tmp.vUpWorld.copy(tmp.vUpLocal).applyQuaternion(tmp.qDisplayWorld).normalize();

    // Ensure basis is right-handed (avoid accidental mirroring)
    tmp.vCross.copy(tmp.vRightWorld).cross(tmp.vUpWorld).normalize();
    if (tmp.vCross.dot(tmp.vNormalWorld) < 0) {
      tmp.vRightWorld.multiplyScalar(-1);
    }

    // World quaternion for the screen plane (XY plane -> right/up, +Z -> outward normal)
    tmp.mBasis.makeBasis(tmp.vRightWorld, tmp.vUpWorld, tmp.vNormalWorld);
    tmp.qWorld.setFromRotationMatrix(tmp.mBasis);

    // Convert world quaternion into group-local quaternion
    groupRef.current.getWorldQuaternion(tmp.qGroupWorld);
    tmp.qLocal.copy(tmp.qGroupWorld).invert().multiply(tmp.qWorld);

    // Place the screen on the real display plane (tiny offset to sit in front)
    const videoEps = 0.0018;
    const glossEps = 0.0024;

    tmp.vAnchorLocal.copy(planeCenterLocalAfter).addScaledVector(planeNormalLocalAfter, videoEps);
    tmp.vAnchorWorld.copy(tmp.vAnchorLocal);
    display.localToWorld(tmp.vAnchorWorld);
    tmp.vAnchorGroup.copy(tmp.vAnchorWorld);
    groupRef.current.worldToLocal(tmp.vAnchorGroup);

    videoMesh.position.copy(tmp.vAnchorGroup);
    videoMesh.quaternion.copy(tmp.qLocal);

    tmp.vAnchorLocal.copy(planeCenterLocalAfter).addScaledVector(planeNormalLocalAfter, glossEps);
    tmp.vAnchorWorld.copy(tmp.vAnchorLocal);
    display.localToWorld(tmp.vAnchorWorld);
    tmp.vAnchorGroup.copy(tmp.vAnchorWorld);
    groupRef.current.worldToLocal(tmp.vAnchorGroup);

    glossMesh.position.copy(tmp.vAnchorGroup);
    glossMesh.quaternion.copy(tmp.qLocal);
  });

  // Glossy overlay geometry - same size as screen
  const glossGeometry = useMemo(() => createRoundedRectGeometry(1.68, 0.96, 0.01), []);
  
  return (
    <group ref={groupRef} position={[0, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
      <primitive object={obj} />
      
      {/* Video screen - positioned on the Pro Display XDR panel */}
      <mesh 
        ref={videoScreenRef}
        position={[0, 0, 0]}
        rotation={[0, 0, 0]}
        renderOrder={999}
        geometry={screenGeometry}
      >
        <meshBasicMaterial 
          ref={screenMaterialRef}
          color="#111111"
          toneMapped={false}
        />
      </mesh>
      
      {/* Glossy screen overlay - subtle glass effect (optimized) */}
      <mesh 
        ref={glossScreenRef}
        position={[0, 0, 0]}
        rotation={[0, 0, 0]}
        renderOrder={1000}
        geometry={glossGeometry}
      >
        <meshStandardMaterial 
          transparent={true}
          opacity={0.03}
          roughness={0.1}
          metalness={0.0}
          envMapIntensity={0.2}
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
      <ambientLight intensity={0.15} color="#ffffff" />
      
      {/* KEY LIGHT - Main illumination from top-right */}
      <directionalLight 
        position={[5, 6, 6]} 
        intensity={2.0}
        color="#ffffff"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0001}
      />
      
      {/* RIM LIGHT - Subtle edge definition from back-left */}
      <directionalLight 
        position={[-6, 3, -3]} 
        intensity={1.0}
        color="#ffffff"
      />
      
      {/* FILL LIGHT - Soft from left side */}
      <directionalLight 
        position={[-5, 2, 4]} 
        intensity={0.8} 
        color="#f0f0f0"
      />
      
      {/* TOP LIGHT - Even from above */}
      <directionalLight
        position={[0, 8, 2]}
        intensity={0.9}
        color="#ffffff"
      />
      
      {/* FRONT ACCENT - Subtle face illumination */}
      <pointLight 
        position={[0, 1, 8]} 
        intensity={25} 
        color="#ffffff" 
        distance={15}
        decay={2}
      />
      
      {/* SUBTLE SURROUNDING ACCENT LIGHTS */}
      
      {/* Bottom left - warm subtle glow */}
      <pointLight 
        position={[-4, -1, 3]} 
        intensity={6} 
        color="#fff8f0" 
        distance={12}
        decay={2}
      />
      
      {/* Bottom right - cool subtle glow */}
      <pointLight 
        position={[4, -1, 3]} 
        intensity={6} 
        color="#f0f4ff" 
        distance={12}
        decay={2}
      />
      
      {/* Left side - soft accent */}
      <pointLight 
        position={[-6, 2, 0]} 
        intensity={8} 
        color="#ffffff" 
        distance={14}
        decay={2}
      />
      
      {/* Right side - soft accent */}
      <pointLight 
        position={[6, 2, 0]} 
        intensity={8} 
        color="#ffffff" 
        distance={14}
        decay={2}
      />
      
      {/* Back subtle rim - top */}
      <pointLight 
        position={[0, 5, -4]} 
        intensity={5} 
        color="#e8e8ff" 
        distance={10}
        decay={2}
      />
      
      {/* Soft gradient environment */}
      <hemisphereLight args={['#ffffff', '#1a1a1a', 0.25]} />
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

  // Wheel, Touch, and Keyboard event handlers
  useEffect(() => {
    let touchStartY = 0;
    
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

    const handleTouchStart = (e: TouchEvent) => {
      if (!isCompleteRef.current) {
        touchStartY = e.touches[0].clientY;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isCompleteRef.current) {
        const touchY = e.touches[0].clientY;
        const deltaY = touchStartY - touchY;
        const delta = deltaY * 0.002; // Touch sensitivity
        
        targetProgress.current = Math.max(0, Math.min(1, targetProgress.current + delta));
        touchStartY = touchY;
        
        // Complete when close to end
        if (targetProgress.current >= 0.9999) {
          isCompleteRef.current = true;
          setIsAnimationComplete(true);
          targetProgress.current = 1;
          setAnimationProgress(1);
          document.body.style.overflow = '';
          document.body.style.paddingRight = '';
          const navbar = document.querySelector('nav');
          if (navbar && navbar instanceof HTMLElement) {
            navbar.style.paddingRight = '';
          }
          return;
        }
        
        e.preventDefault();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isCompleteRef.current) {
        let delta = 0;
        
        switch(e.key) {
          case 'ArrowDown':
          case 'PageDown':
          case ' ': // Space bar
            delta = 0.05; // Move forward
            break;
          case 'ArrowUp':
          case 'PageUp':
            delta = -0.05; // Move backward
            break;
          default:
            return; // Don't prevent default for other keys
        }
        
        targetProgress.current = Math.max(0, Math.min(1, targetProgress.current + delta));
        
        // Complete when close to end
        if (targetProgress.current >= 0.9999) {
          isCompleteRef.current = true;
          setIsAnimationComplete(true);
          targetProgress.current = 1;
          setAnimationProgress(1);
          document.body.style.overflow = '';
          document.body.style.paddingRight = '';
          const navbar = document.querySelector('nav');
          if (navbar && navbar instanceof HTMLElement) {
            navbar.style.paddingRight = '';
          }
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
    window.addEventListener('touchstart', handleTouchStart, { passive: false });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('keydown', handleKeyDown, { passive: false });
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('keydown', handleKeyDown);
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

        {/* 3D Canvas with optimized settings */}
        <Canvas
          camera={{ position: [0, 0, 5], fov: 50 }}
          gl={{ 
            antialias: true, 
            alpha: true,
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 1.0,
            powerPreference: 'high-performance',
            outputColorSpace: THREE.SRGBColorSpace,
            stencil: false,
            depth: true,
          }}
          dpr={[1, 2]}
          shadows
          performance={{ min: 0.5 }}
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
