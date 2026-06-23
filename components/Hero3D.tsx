"use client";

import { Canvas } from "@react-three/fiber";
import { Float, OrbitControls, ContactShadows } from "@react-three/drei";
import { useEffect, useState } from "react";
import { HERO_MODELS } from "./hero-models";

export default function Hero3D({ onPick }: { onPick?: (name: string) => void }) {
  // Pick a random product once per mount — i.e. once per page load.
  const [idx] = useState(() => Math.floor(Math.random() * HERO_MODELS.length));
  const { name, Component: Model } = HERO_MODELS[idx];

  useEffect(() => {
    onPick?.(name);
  }, [name, onPick]);

  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ position: [0, 0.3, 6], fov: 40 }}
      gl={{ alpha: true, antialias: true }}
      style={{ background: "transparent" }}
    >
      <ambientLight intensity={0.7} />
      <directionalLight position={[4, 5, 4]} intensity={1.4} />
      <pointLight position={[-4, 1, 3]} intensity={2.2} color="#ff8a45" decay={0} />
      <pointLight position={[3, -2, 2]} intensity={1.2} color="#5b8cff" decay={0} />

      <Float speed={1.6} rotationIntensity={0.5} floatIntensity={0.7}>
        <Model />
      </Float>

      <ContactShadows position={[0, -1.6, 0]} opacity={0.35} scale={9} blur={2.6} far={4} />

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate
        autoRotateSpeed={1.1}
        minPolarAngle={Math.PI / 2.6}
        maxPolarAngle={Math.PI / 1.8}
      />
    </Canvas>
  );
}
