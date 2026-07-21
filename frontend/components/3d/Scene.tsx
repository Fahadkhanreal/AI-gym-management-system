"use client";

import { Canvas } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import { type ReactNode } from "react";

interface SceneProps {
  children: ReactNode;
  className?: string;
}

export default function Scene({ children, className }: SceneProps) {
  return (
    <div className={className}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true, outputColorSpace: "srgb" }}
        style={{ background: "transparent", width: "100%", height: "100%" }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0);
        }}
      >
        {/* Transparent background via setClearColor above */}
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <pointLight position={[-5, -5, -5]} intensity={0.5} color="#00f5ff" />
        <Float speed={2} rotationIntensity={0.3} floatIntensity={1.5}>
          {children}
        </Float>
      </Canvas>
    </div>
  );
}
