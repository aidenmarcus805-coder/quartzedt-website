'use client';

import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import Image from 'next/image';
import Link from 'next/link';
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
function MonitorModel({
  scrollProgressRef,
  groupRef,
  videoElement,
  mousePositionRef,
  hasUserScrolledRef,
  lowPowerMode,
  variant,
}: {
  scrollProgressRef: React.MutableRefObject<number>;
  groupRef: React.RefObject<THREE.Group | null>;
  videoElement: HTMLVideoElement | null;
  mousePositionRef: React.MutableRefObject<{ x: number; y: number }>;
  hasUserScrolledRef: React.MutableRefObject<boolean>;
  lowPowerMode: boolean;
  variant: 'full' | 'gallery';
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
  const lowPowerBasicMat = useMemo(
    () => new THREE.MeshBasicMaterial({ color: '#111111' }),
    []
  );

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

            // Bezel / display housing: dark, slightly satin (less "flat grey").
            child.material = new THREE.MeshPhysicalMaterial({
              map: textures.baseColor,
              normalMap: textures.baseNormal,
              normalScale: new THREE.Vector2(0.35, 0.35),
              color: new THREE.Color('#141416'),
              metalness: 0.15,
              roughness: 0.55,
              clearcoat: 0.08,
              clearcoatRoughness: 0.85,
              envMapIntensity: 0.25,
              side: THREE.FrontSide,
            });
          }

          // Apply materials based on mesh name
          if (name === 'macpro_monitor_001-material') {
            // Stand: textured black plastic (not metallic).
            child.material = new THREE.MeshPhysicalMaterial({
              map: textures.baseColor,
              normalMap: textures.baseNormal,
              normalScale: new THREE.Vector2(0.45, 0.45),
              color: new THREE.Color('#101011'),
              metalness: 0.02,
              roughness: 0.86,
              clearcoat: 0.04,
              clearcoatRoughness: 0.92,
              side: THREE.FrontSide,
              envMapIntensity: 0.18,
            });
          }

          // Cache the "high quality" material so we can restore after low-power mode.
          if (!child.userData.__hiMaterial) {
            child.userData.__hiMaterial = child.material;
          }

          child.castShadow = false; // Disable for performance
          child.receiveShadow = true;
          child.frustumCulled = true; // Enable frustum culling
        }
      });
    }
  }, [obj, textures]);

  // Low power mode: unlit, no textures/material complexity. Restores automatically when you scroll back up.
  useEffect(() => {
    if (!obj) return;

    obj.traverse((child) => {
      if (!(child instanceof THREE.Mesh)) return;

      if (!child.userData.__hiMaterial) {
        child.userData.__hiMaterial = child.material;
      }

      if (lowPowerMode) {
        child.material = lowPowerBasicMat;
      } else if (child.userData.__hiMaterial) {
        child.material = child.userData.__hiMaterial as THREE.Material | THREE.Material[];
      }
    });
  }, [obj, lowPowerMode, lowPowerBasicMat]);

  const smoothMouseRef = useRef({ x: 0, y: 0 });

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
    if (lowPowerMode) return;

    const scrollEase = scrollProgressRef.current;
    const time = performance.now() * 0.001; // Use performance.now() - faster than Date.now()
    const isInteractive = hasUserScrolledRef.current;

    const allowFloat = variant === 'full';
    // Simplified floating animation (disabled in gallery mode so we can render on-demand)
    const floatY = allowFloat ? Math.sin(time * 0.5) * 0.02 : 0;
    const floatX = allowFloat ? Math.cos(time * 0.3) * 0.01 : 0;
    const floatRot = allowFloat && isInteractive ? Math.sin(time * 0.4) * 0.003 : 0;

    // Mouse parallax effect (disabled until first scroll)
    const mouseInfluence = isInteractive ? 1 - scrollEase * 0.5 : 0;
    // Smooth mouse locally to avoid React re-renders.
    const rawMouse = mousePositionRef.current;
    smoothMouseRef.current.x += (rawMouse.x - smoothMouseRef.current.x) * 0.08;
    smoothMouseRef.current.y += (rawMouse.y - smoothMouseRef.current.y) * 0.08;
    const mouseRotY = smoothMouseRef.current.x * 0.02 * mouseInfluence;
    const mouseRotX = smoothMouseRef.current.y * 0.014 * mouseInfluence;

    // Scale (slightly larger overall per request)
    const startScale = 6.3;
    const endScale = 3.45;
    const currentScale = startScale + (endScale - startScale) * scrollEase; // Inline lerp
    groupRef.current.scale.setScalar(currentScale);


    groupRef.current.position.x = -0.01 + floatX;
    // Drop the whole monitor slightly at the end of the scroll (scrollEase=1)
    // Nudge down a touch (~20px perceived) to give the hero typography more breathing room.
    groupRef.current.position.y = -5.45 + (3.35) * scrollEase - 0.4 * scrollEase + floatY;

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
function Scene({ scrollProgressRef, videoElement, mousePositionRef, hasUserScrolledRef, lowPowerMode, variant }: {
  scrollProgressRef: React.MutableRefObject<number>;
  videoElement: HTMLVideoElement | null;
  mousePositionRef: React.MutableRefObject<{ x: number; y: number }>;
  hasUserScrolledRef: React.MutableRefObject<boolean>;
  lowPowerMode: boolean;
  variant?: 'full' | 'gallery';
}) {
  const monitorGroupRef = useRef<THREE.Group>(null);

  return (
    <group position={[0, 0, 0]}>
      {/* Environment for reflections */}
      {!lowPowerMode && <Environment preset="studio" environmentIntensity={0.28} />}
      {!lowPowerMode && <Lighting />}
      <MonitorModel
        scrollProgressRef={scrollProgressRef}
        groupRef={monitorGroupRef}
        videoElement={videoElement}
        mousePositionRef={mousePositionRef}
        hasUserScrolledRef={hasUserScrolledRef}
        lowPowerMode={lowPowerMode}
        variant={variant ?? 'full'}
      />
    </group>
  );
}

function InvalidateBridge({
  invalidateRef,
}: {
  invalidateRef: React.MutableRefObject<(() => void) | null>;
}) {
  const invalidate = useThree((s) => s.invalidate);
  useEffect(() => {
    invalidateRef.current = invalidate;
    return () => {
      invalidateRef.current = null;
    };
  }, [invalidate, invalidateRef]);
  return null;
}

// Scene lighting for monitor - Clean studio lighting
function Lighting() {
  return (
    <>
      {/* Soft ambient for visibility */}
      <ambientLight intensity={0.12} color="#ffffff" />

      {/* KEY LIGHT - Main illumination from top-right */}
      <directionalLight
        position={[6, 6, 7]}
        intensity={1.15}
        color="#fff4ee"
      />

      {/* RIM LIGHT - Subtle edge definition from back-left */}
      <directionalLight
        position={[-6, 4, -4]}
        intensity={0.35}
        color="#ffffff"
      />

      {/* FILL LIGHT - Soft from left side */}
      <directionalLight
        position={[-6, 2, 6]}
        intensity={0.45}
        color="#eef2ff"
      />

      {/* TOP LIGHT - Even from above */}
      <directionalLight
        position={[0, 8, 2]}
        intensity={0.25}
        color="#ffffff"
      />

      {/* FRONT ACCENT - Subtle face illumination */}
      <pointLight
        position={[0, 1.2, 10]}
        intensity={0.9}
        color="#ffffff"
        distance={26}
        decay={2}
      />

      {/* (Removed extra point lights to avoid harsh spec/hotspots) */}

      {/* Soft gradient environment */}
      <hemisphereLight args={['#ffffff', '#0b0b0c', 0.25]} />
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
export default function CameraScene({
  lowPowerMode = false,
  variant = 'full',
  className,
}: {
  lowPowerMode?: boolean;
  variant?: 'full' | 'gallery';
  className?: string;
}) {
  const showHeroOverlays = variant === 'full';
  // In "gallery" mode we don't run the intro scroll hijack. We start at a framed pose where the monitor is visible.
  const GALLERY_PROGRESS = 1.0;
  const initialProgress = variant === 'gallery' ? GALLERY_PROGRESS : 0;

  const [isAnimationComplete, setIsAnimationComplete] = useState(variant === 'gallery');
  const [videoElement, setVideoElement] = useState<HTMLVideoElement | null>(null);
  const mousePositionRef = useRef({ x: 0, y: 0 });
  const invalidateRef = useRef<(() => void) | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const targetProgress = useRef(initialProgress);
  const progressRef = useRef(initialProgress);
  const domIntroRef = useRef<HTMLDivElement | null>(null);
  const domTitleWrapRef = useRef<HTMLDivElement | null>(null);
  const domTitleH1Ref = useRef<HTMLHeadingElement | null>(null);
  const isCompleteRef = useRef(variant === 'gallery'); // Ref for immediate checking
  const hasUserScrolledRef = useRef(false);
  const lowPowerModeRef = useRef(lowPowerMode);

  // Ensure we never leave scroll locked if switching variants (or during hot reload).
  useEffect(() => {
    if (variant !== 'full') {
      hasUserScrolledRef.current = true; // enable cursor parallax in gallery
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
      const navbar = document.querySelector('nav');
      if (navbar && navbar instanceof HTMLElement) {
        navbar.style.paddingRight = '';
      }
      // Keep internal refs coherent without triggering render loops.
      isCompleteRef.current = true;
      targetProgress.current = GALLERY_PROGRESS;
      progressRef.current = GALLERY_PROGRESS;
    }
  }, [variant]);

  useEffect(() => {
    lowPowerModeRef.current = lowPowerMode;
  }, [lowPowerMode]);

  const handleVideoRef = useCallback((element: HTMLVideoElement | null) => {
    videoRef.current = element;
    if (element) {
      element.load();
      element.addEventListener('loadeddata', () => {
        setVideoElement(element);
        element.play().catch(console.error);
      });
      element.play().catch(() => { });
      setVideoElement(element);
    }
  }, []);

  // Mouse tracking for parallax effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (lowPowerModeRef.current) return;
      // Normalize mouse position to -1 to 1 range
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = (e.clientY / window.innerHeight) * 2 - 1;
      mousePositionRef.current.x = x;
      mousePositionRef.current.y = y;
      // Gallery mode renders on-demand; poke a frame when the cursor moves.
      if (variant === 'gallery') {
        invalidateRef.current?.();
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [variant]);

  const applyProgressToDom = useCallback((p: number) => {
    // Intro (Cutline) overlay fades out and nudges down.
    const intro = domIntroRef.current;
    if (intro) {
      const opacity = Math.max(0, 1 - p * 2.8);
      const y = p * 30;
      intro.style.opacity = `${opacity}`;
      intro.style.transform = `translate3d(0, ${y}px, 0)`;
    }

    // Title overlay fades in after halfway.
    const titleWrap = domTitleWrapRef.current;
    if (titleWrap) {
      const opacity = p > 0.5 ? Math.min((p - 0.5) * 2, 1) : 0;
      titleWrap.style.opacity = `${opacity}`;
    }

    // Title line slides up (garage-door typography feel).
    const h1 = domTitleH1Ref.current;
    if (h1) {
      const t = p > 0.6 ? Math.min((p - 0.6) * 3, 1) : 0;
      const pct = (1 - t) * 100;
      h1.style.transform = `translate3d(0, ${pct}%, 0)`;
    }
  }, []);

  // Smooth animation loop with easing (paused in low-power mode).
  // IMPORTANT: keep progress in refs + mutate DOM styles directly so React does NOT re-render every frame.
  useEffect(() => {
    if (lowPowerMode) return;
    if (variant !== 'full') return;
    let animationFrame: number;

    const animate = () => {
      const prev = progressRef.current;
      const diff = targetProgress.current - prev;
      const next = Math.abs(diff) < 0.001 ? targetProgress.current : prev + diff * 0.18;
      progressRef.current = next;
      applyProgressToDom(next);
      animationFrame = requestAnimationFrame(animate);
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [applyProgressToDom, lowPowerMode, variant]);

  // Apply initial progress to DOM once overlays exist.
  useEffect(() => {
    applyProgressToDom(progressRef.current);
  }, [applyProgressToDom]);

  // Pause the hero video when you're far down the page (saves CPU decode).
  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;

    if (lowPowerMode) {
      vid.pause();
      return;
    }

    // Muted autoplay should be allowed; ignore any transient errors.
    vid.play().catch(() => { });
  }, [lowPowerMode, videoElement]);

  // Wheel, Touch, and Keyboard event handlers
  useEffect(() => {
    if (variant !== 'full') return;
    let touchStartY = 0;

    const handleWheel = (e: WheelEvent) => {
      hasUserScrolledRef.current = true;
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
          progressRef.current = 1;
          applyProgressToDom(1);
          progressRef.current = 1;
          applyProgressToDom(1);
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
      hasUserScrolledRef.current = true;
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
          progressRef.current = 1;
          applyProgressToDom(1);
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

        switch (e.key) {
          case 'ArrowDown':
          case 'PageDown':
          case ' ': // Space bar
            delta = 0.05; // Move forward
            hasUserScrolledRef.current = true;
            break;
          case 'ArrowUp':
          case 'PageUp':
            delta = -0.05; // Move backward
            hasUserScrolledRef.current = true;
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
          progressRef.current = 1;
          applyProgressToDom(1);
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
        // Keep refs coherent with the reset path.
        progressRef.current = targetProgress.current;
        applyProgressToDom(progressRef.current);
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
  }, [applyProgressToDom, variant]);

  // Lock scroll during animation - prevent scrollbar jitter
  useEffect(() => {
    if (variant !== 'full') return;
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
  }, [isAnimationComplete, variant]);

  return (
    <>
      {/* Monitor Scene with hero overlay - pure black background */}
      <div
        className={`w-full bg-black overflow-hidden ${variant === 'full' ? 'h-screen' : 'h-full'} ${className ?? ''}`}
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
          camera={{ position: [0, 0, variant === 'gallery' ? 6 : 5], fov: variant === 'gallery' ? 45 : 50 }}
          gl={{
            antialias: true,
            alpha: true,
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: variant === 'gallery' ? 0.9 : 1.0,
            powerPreference: 'high-performance',
            outputColorSpace: THREE.SRGBColorSpace,
            stencil: false,
            depth: true,
          }}
          dpr={lowPowerMode ? 1 : variant === 'gallery' ? 1.25 : [1, 2]}
          frameloop={lowPowerMode || variant === 'gallery' ? 'demand' : 'always'}
          shadows={!lowPowerMode}
          performance={{ min: lowPowerMode ? 0.3 : 0.5 }}
          style={{ background: 'transparent' }}
        >
          <InvalidateBridge invalidateRef={invalidateRef} />
          <Suspense fallback={<LoadingFallback />}>
            <Scene
              scrollProgressRef={progressRef}
              videoElement={videoElement}
              mousePositionRef={mousePositionRef}
              hasUserScrolledRef={hasUserScrolledRef}
              lowPowerMode={lowPowerMode}
              variant={variant}
            />
          </Suspense>
        </Canvas>

        {showHeroOverlays && (
          <>
            {/* Initial hero text (bottom anchored) - CUTLINE (fades out as you scroll) */}
            <div
              ref={domIntroRef}
              className="absolute inset-0 flex flex-col justify-end items-center text-center pointer-events-none z-10"
              style={{
                paddingBottom: '10vh',
                willChange: 'opacity, transform',
              }}
            >
              {/* Dark gradient for legibility (bottom anchored hero style) */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: 'linear-gradient(to top, rgba(0,0,0,0.70) 0%, rgba(0,0,0,0.30) 30%, transparent 62%)',
                }}
              />

              <div className="relative z-10">
                <div className="flex justify-center pl-[26px] pr-0">
                  <Image
                    src="/logo.png?v=20251223"
                    alt="Quartz"
                    width={1200}
                    height={305}
                    priority
                    unoptimized
                    className="h-[clamp(72px,10vw,140px)] w-auto"
                  />
                </div>
                <p className="mt-10 max-w-lg px-6 text-[15px] md:text-[17px] leading-[1.7] text-white/45 font-light mx-auto">
                  Precise edits. Made automatically.
                </p>

                {/* Minimal CTA */}
                <div className="mt-12 pointer-events-auto flex justify-center">
                  <Link href="/pricing" className="group inline-flex items-center gap-3 px-10 py-4 rounded-full text-[10px] tracking-[0.4em] text-white border border-white/20 hover:bg-paper hover:text-black transition-all duration-300 font-light">
                    <span
                      className="w-2 h-2 rounded-full bg-accent opacity-0 scale-50 group-hover:opacity-100 group-hover:scale-100 group-focus-visible:opacity-100 group-focus-visible:scale-100 transition-all duration-200"
                      aria-hidden="true"
                    />
                    START FREE TRIAL
                  </Link>
                </div>
              </div>
            </div>

            {/* Hero text overlay - Bottom anchored (reference-style) */}
            <div
              ref={domTitleWrapRef}
              className="absolute inset-0 flex items-end pointer-events-none z-10"
              style={{
                paddingBottom: '10vh',
                opacity: 0,
                willChange: 'opacity',
              }}
            >
              {/* Text with subtle dark gradient for legibility */}
              <div className="absolute inset-0 pointer-events-none" style={{
                background: 'linear-gradient(to top, rgba(0,0,0,0.70) 0%, rgba(0,0,0,0.25) 34%, transparent 66%)',
              }} />

              {/* Content aligned to grid */}
              <div className="max-w-[1600px] mx-auto px-8 md:px-12 lg:px-16 w-full relative z-10">
                <div className="mx-auto text-center w-full">
                  {/* Main title */}
                  <div className="overflow-hidden">
                    <h1
                      ref={domTitleH1Ref}
                      className="text-[clamp(56px,10vw,140px)] font-extralight leading-[0.9] tracking-[-0.05em] text-white md:whitespace-nowrap"
                      style={{
                        transform: 'translate3d(0, 100%, 0)',
                        textShadow: '0 2px 40px rgba(0,0,0,0.3)',
                        willChange: 'transform',
                      }}
                    >
                      From Weeks to{' '}
                      <span className="text-white/60">Hours.</span>
                    </h1>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}