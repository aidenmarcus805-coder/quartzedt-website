'use client';

import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useRef, Suspense, useEffect, useState, useMemo, useCallback } from 'react';
import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js';
import { Syne } from 'next/font/google';

const syneFont = Syne({ subsets: ['latin'], weight: ['500', '600', '800'] });

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
  const objRaw = useLoader(OBJLoader, '/monitor1.obj', (loader) => {
    materials.preload();
    loader.setMaterials(materials);
  });

  // Clone the object to prevent mutation of the cached loader instance (fixes compounding offset bug)
  const obj = useMemo(() => objRaw.clone(), [objRaw]);

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
    // Reset refs on mount to prevent tilt accumulation across navigations
    displayBaseQuatRef.current = null;
    displayFitRef.current = null;
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

            // Bezel / display housing: Pure Matte Void. Removes all "plastic/tech" reflections.
            child.material = new THREE.MeshPhysicalMaterial({
              map: textures.baseColor,
              normalMap: textures.baseNormal,
              normalScale: new THREE.Vector2(0.1, 0.1), // Flatten bumps further
              color: new THREE.Color('#030303'), // Deepest black
              metalness: 0.0, // Zero metal
              roughness: 1.0, // Fully diffuse/matte
              clearcoat: 0.0, // No glass layer
              clearcoatRoughness: 1.0,
              envMapIntensity: 0.0, // Catches zero HDR reflections
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

            // Shift ONLY the stand mesh up by ~20% of the screen height (0.192 units)
            if (!child.userData.standHeightAdjusted) {
              child.position.y += 0.162;
              child.userData.standHeightAdjusted = true;
            }
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
    const endScale = 3.25;
    const currentScale = startScale + (endScale - startScale) * scrollEase; // Inline lerp
    groupRef.current.scale.setScalar(currentScale);


    groupRef.current.position.x = -0.01 + floatX;
    // Drop the whole monitor slightly at the end of the scroll (scrollEase=1)
    // Nudge down a touch (~20px perceived) to give the hero typography more breathing room.
    // Raised globally by ~8% (+0.6 units)
    groupRef.current.position.y = -5.55 + (3.35) * scrollEase - 0.4 * scrollEase + floatY;

    // Rotation
    groupRef.current.rotation.y = -Math.PI / 2 + floatRot + mouseRotY;
    // No base tilt at scroll=0
    groupRef.current.rotation.x = mouseRotX;

    // Tilt screens up based on scroll
    // NOTE: The model has a baked-in ~2.5° upward tilt from Blender; we cancel it at scroll=0.
    const blenderBaseTilt = THREE.MathUtils.degToRad(2.5);
    const endTilt = 0; // No extra tilt at end of scroll
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
        <meshPhysicalMaterial
          transparent={true}
          opacity={0.015} // Dimmer base opacity
          roughness={0.1}
          metalness={0.05} // Toned down metalness
          clearcoat={0.6} // Subtler clearcoat
          clearcoatRoughness={0.2}
          envMapIntensity={0.15}
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
      {!lowPowerMode && <Lighting scrollProgressRef={scrollProgressRef} />}
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
function Lighting({ scrollProgressRef }: { scrollProgressRef: React.MutableRefObject<number> }) {
  const animatedLightRef = useRef<THREE.PointLight>(null);

  // State to track the single-shot animation timing
  const sweepStatus = useRef({
    triggered: false,
    startTime: 0,
    completed: false
  });

  useFrame((state) => {
    if (!animatedLightRef.current) return;

    const progress = scrollProgressRef.current;

    // Reset if user scrolls back up
    if (progress < 0.30) {
      sweepStatus.current.triggered = false;
      sweepStatus.current.completed = false;
      animatedLightRef.current.intensity = 0;
      return;
    }

    // Trigger the sweep exactly once when they reach 40% down
    if (progress >= 0.40 && !sweepStatus.current.triggered && !sweepStatus.current.completed) {
      sweepStatus.current.triggered = true;
      sweepStatus.current.startTime = state.clock.getElapsedTime();
    }

    // If waiting or finished, ensure light is off
    if (!sweepStatus.current.triggered || sweepStatus.current.completed) {
      animatedLightRef.current.intensity = 0;
      return;
    }

    const timeSinceTrigger = state.clock.getElapsedTime() - sweepStatus.current.startTime;
    const animationDuration = 1.2; // Speeded up from 2.5s for more 'zip'

    if (timeSinceTrigger > animationDuration) {
      sweepStatus.current.completed = true;
      animatedLightRef.current.intensity = 0;
      return;
    }

    // Calculate normalized progress (0 to 1)
    const animP = timeSinceTrigger / animationDuration;

    // Sweep X linearly from -12 to +12 across the duration
    const sweepX = -12 + (animP * 24);

    // Point light anchors exactly to the monitor's final computed resting Y position (-2.1)
    animatedLightRef.current.position.set(sweepX, -2.1, 4.5);

    // Fade in at the start of the sweep, fade out at the end, peak in the middle
    let intensityFactor = 1.0;
    if (animP < 0.2) intensityFactor = animP / 0.2;
    if (animP > 0.8) intensityFactor = (1 - animP) / 0.2;

    const centerBoost = 1 - Math.abs(sweepX) / 12;

    // Extremely high intensity required for physical PBR clearcoat to reflect as a bright hot-spot
    // Reduced from 500 equivalent to 200 equivalent since reflection is softer.
    const baseLight = 80;
    const boostLight = 120;
    animatedLightRef.current.intensity = (baseLight + centerBoost * boostLight) * intensityFactor;
  });

  return (
    <>
      {/* Soft ambient for visibility */}
      <ambientLight intensity={0.05} color="#ffffff" />

      {/* KEY LIGHT - Main illumination from top-right */}
      <directionalLight
        position={[6, 6, 7]}
        intensity={0.8}
        color="#fff4ee"
      />

      {/* RIM LIGHT - Subtle edge definition from back-left */}
      <directionalLight
        position={[-6, 4, -4]}
        intensity={0.2}
        color="#ffffff"
      />

      {/* FILL LIGHT - Soft from left side */}
      <directionalLight
        position={[-6, 2, 6]}
        intensity={0.2}
        color="#f5f5f5"
      />

      {/* TOP LIGHT - Even from above */}
      <directionalLight
        position={[0, 8, 2]}
        intensity={0.15}
        color="#ffffff"
      />

      {/* SWEEPING CINEMATIC LIGHT - Animated highlight on the bezel glass */}
      <pointLight
        ref={animatedLightRef}
        position={[0, -2.1, 4.5]}
        intensity={0}
        color="#ffffff"
        distance={25}
        decay={1.8}
      />

      {/* Soft gradient environment */}
      <hemisphereLight args={['#ffffff', '#0b0b0c', 0.15]} />
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
function PremiumWriteTo({ variant = 'dark' }: { variant?: 'dark' | 'light' }) {
  const isLight = variant === 'light';
  return (
    <span
      className={`inline-block lowercase text-[1.1em] tracking-normal pt-1 mx-2 select-none ${isLight ? 'text-black/30' : 'text-[#333333]'}`}
      style={{ fontFamily: 'var(--font-script)' }}
    >
      <span
        id="premium-to-text"
        className="inline-block"
        style={{
          clipPath: 'polygon(0 0, 0% 0, -20% 100%, 0 100%)',
          transition: 'clip-path 1.2s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        to
      </span>
    </span>
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
  const domContainerRef = useRef<HTMLDivElement | null>(null);
  const isCompleteRef = useRef(variant === 'gallery'); // Ref for immediate checking
  const hasUserScrolledRef = useRef(false);
  const lowPowerModeRef = useRef(lowPowerMode);
  const hasTriggeredWriteRef = useRef(false);

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

    // Handwriting sequence triggers distinctly when text is mostly revealed
    const toText = document.getElementById('premium-to-text');
    if (toText) {
      if (p > 0.75) {
        toText.style.clipPath = 'polygon(0 0, 120% 0, 100% 100%, 0 100%)';
      } else {
        toText.style.clipPath = 'polygon(0 0, 0% 0, -20% 100%, 0 100%)';
      }
    }

    // Dynamic Background Transition: Black (0%) -> Light Gray (100%)
    const container = domContainerRef.current;
    if (container) {
      // Color interpolation: Black (#151515, #000000) to Light Gray (#f7f7f9, #e2e2e7)
      // Quick fade in the first 30% of scroll
      const bgProgress = Math.min(1, p * 3.33);

      const r1 = Math.round(21 + (247 - 21) * bgProgress); // 15 to f7
      const g1 = Math.round(21 + (247 - 21) * bgProgress);
      const b1 = Math.round(21 + (247 - 21) * bgProgress); // neutral gray

      const r2 = Math.round(0 + (226 - 0) * bgProgress); // 00 to e2
      const g2 = Math.round(0 + (226 - 0) * bgProgress);
      const b2 = Math.round(0 + (226 - 0) * bgProgress); // neutral gray

      container.style.background = `radial-gradient(circle at 50% 50%, rgb(${r1}, ${g1}, ${b1}) 0%, rgb(${r2}, ${g2}, ${b2}) 80%)`;
      // We also need to invert the text as the background gets bright
      container.style.color = bgProgress > 0.5 ? 'black' : 'white';
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
      // Balanced lerp factor (0.10) - smooth but not too floaty
      const next = Math.abs(diff) < 0.00001 ? targetProgress.current : prev + diff * 0.10;
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
          // progressRef.current = 1; // Removed for smooth settling
          // applyProgressToDom(1);   // Removed for smooth settling

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
          // progressRef.current = 1; // Removed for smooth settling
          // applyProgressToDom(1);   // Removed for smooth settling

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
          // progressRef.current = 1; // Removed for smooth settling
          // applyProgressToDom(1);   // Removed for smooth settling

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
      {/* Monitor Scene with hero overlay - Bright Minimalist Background */}
      <div
        ref={domContainerRef}
        className={`w-full overflow-hidden ${variant === 'full' ? 'h-screen' : 'h-full'} ${className ?? ''}`}
        style={{
          position: 'relative',
          zIndex: 10,
          background: 'radial-gradient(circle at 50% 50%, #151515 0%, #000000 80%)', // Starts dark
          color: 'white', // Starts with white text
          transition: 'color 0.5s ease',
        }}
      >
        {/* SVG animated noise texture layer - very subtle on light bg */}
        <div
          className="absolute inset-0 pointer-events-none z-[1] opacity-[0.04]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'repeat',
            mixBlendMode: 'multiply',
          }}
        />

        {/* Minimal vignette for depth - soft gray shadow */}
        <div
          className="absolute inset-0 pointer-events-none z-[5]"
          style={{
            background: 'radial-gradient(ellipse 70% 70% at 50% 50%, transparent 0%, rgba(0,0,0,0.06) 100%)',
          }}
        />

        {/* Subtle ground anchor - suggests monitor has weight */}
        <div
          className="absolute bottom-0 left-0 right-0 h-[40vh] pointer-events-none z-[4]"
          style={{
            background: 'radial-gradient(ellipse 50% 60% at 50% 100%, rgba(0,0,0,0.1) 0%, transparent 60%)',
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
          className="relative z-[5]"
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
            {/* Initial hero text (bottom anchored) - fades out as you scroll) */}
            <div
              ref={domIntroRef}
              className="absolute inset-0 flex flex-col justify-end items-center text-center pointer-events-none z-10"
              style={{
                paddingBottom: '10vh',
                willChange: 'opacity, transform',
              }}
            >
              {/* Initial black anchor gradient for legibility over bright video frames */}
              <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black via-black/60 to-transparent pointer-events-none z-0" />

              {/* Clean Typography Intro */}
              <div className="relative z-10 flex flex-col items-center pb-2">
                <div className="flex justify-center pl-[26px] pr-0 pb-4">
                  <Image
                    src="/logo.png?v=20251223"
                    alt="Quartz"
                    width={1200}
                    height={305}
                    priority
                    unoptimized
                    className="h-[clamp(52px,8vw,120px)] w-auto"
                  />
                </div>

                <p className="max-w-md px-6 text-[16px] md:text-[18px] leading-[1.6] opacity-40 font-light mx-auto mb-10 transition-colors duration-500">
                  The first fully autonomous AI video editor.
                </p>

                {/* Minimal CTA */}
                <div className="pointer-events-auto flex justify-center">
                  <Link href="#waitlist" className="group relative inline-flex items-center gap-3 px-7 py-3.5 bg-Current hover:bg-black font-medium text-current hover:text-white border border-current/20 hover:border-black rounded-full transition-all duration-300">
                    <span className="relative z-10 text-[12px] md:text-[13px] tracking-widest uppercase opacity-80 group-hover:opacity-100">Join the Waitlist</span>
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
              {/* Very soft gradient for legibility - completely dialed back, just a hint of gray instead of white */}
              <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#e2e2e7]/60 to-transparent pointer-events-none z-0" />

              {/* Content aligned to grid */}
              <div className="max-w-[1800px] mx-auto px-8 md:px-12 lg:px-16 w-full relative z-10">
                <div className="mx-auto text-center w-full">
                  {/* Main title */}
                  <div className="overflow-hidden pb-4">
                    <h1
                      ref={domTitleH1Ref}
                      className={`${syneFont.className} text-[clamp(44px,7.5vw,110px)] font-medium leading-[0.9] tracking-[-0.045em] text-current md:whitespace-nowrap transition-colors duration-500 font-syne`}
                      style={{
                        transform: 'translate3d(0, 100%, 0)',
                        willChange: 'transform',
                      }}
                    >
                      <span className="opacity-40">From Weeks</span> <PremiumWriteTo /> <span>Hours.</span>
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