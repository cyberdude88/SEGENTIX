"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, useMemo } from "react";
import * as THREE from "three";

function ScrollDriver() {
  useFrame(() => {
    const doc = document.documentElement;
    const s = window.scrollY / window.innerHeight;
    doc.dataset.scroll = String(s);
  });
  return null;
}

function ParticleSparkles({ count = 600 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null!);
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 14;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 8;
      arr[i * 3 + 2] = Math.random() * 4 - 1;
    }
    return arr;
  }, [count]);

  useFrame((_, dt) => {
    if (!ref.current) return;
    ref.current.rotation.y += dt * 0.015;
    const scroll = Number(document.documentElement.dataset.scroll ?? 0);
    ref.current.position.z = scroll * 1.5;
    const mat = ref.current.material as THREE.PointsMaterial;
    mat.opacity = Math.max(0.1, 0.7 - scroll * 0.5);
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.02} color="#4cc9ff" transparent opacity={0.6} sizeAttenuation />
    </points>
  );
}

export default function Scene3D() {
  return (
    <Canvas
      gl={{ antialias: true, alpha: true, premultipliedAlpha: false }}
      camera={{ position: [0, 0, 6], fov: 50 }}
      dpr={[1, 2]}
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
    >
      <ScrollDriver />
      <ParticleSparkles />
    </Canvas>
  );
}
