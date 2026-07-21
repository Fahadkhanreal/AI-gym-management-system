"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Mesh, MeshStandardMaterial } from "three";
import { useMousePosition } from "@/hooks/useMousePosition";

export default function FloatingOrb() {
  const meshRef = useRef<Mesh>(null);
  const mouse = useMousePosition();

  const material = useMemo(
    () =>
      new MeshStandardMaterial({
        color: "#00f5ff",
        emissive: "#00f5ff",
        emissiveIntensity: 0.4,
        metalness: 0.8,
        roughness: 0.1,
        transparent: true,
        opacity: 0.9,
      }),
    [],
  );

  useFrame((_, delta) => {
    if (!meshRef.current) return;

    // Smoothly follow mouse
    const targetRotX = (mouse.normalizedY - 0.5) * 1.2;
    const targetRotY = (mouse.normalizedX - 0.5) * 1.2;

    meshRef.current.rotation.x += (targetRotX - meshRef.current.rotation.x) * delta * 3;
    meshRef.current.rotation.y += (targetRotY - meshRef.current.rotation.y) * delta * 3;

    // Pulse emissive intensity
    material.emissiveIntensity = 0.3 + Math.sin(Date.now() * 0.002) * 0.2;
  });

  return (
    <mesh ref={meshRef} material={material}>
      <icosahedronGeometry args={[1.2, 2]} />
    </mesh>
  );
}
