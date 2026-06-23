"use client";

// Procedural 3D models for the homepage hero, built entirely from Three.js
// primitives (no external assets). Each is a self-contained <group>. Hero3D
// picks one at random on every page load.
import { useRef, type FC } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import type { Group, Mesh, MeshStandardMaterial } from "three";

const DARK = "#23262c";
const INK = "#1c1d21";
const DARKER = "#16181c";
const METAL = "#c9ccd2";
const GOLD = "#d9a441";
const ORANGE = "#ff6a1a";

/* ---------- shared spinning fan blades ---------- */
function Blades({ scale = 1, blades = 9 }: { scale?: number; blades?: number }) {
  const ref = useRef<Group>(null);
  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.z += dt * 5;
  });
  return (
    <group ref={ref} scale={scale}>
      {Array.from({ length: blades }).map((_, i) => (
        <mesh key={i} rotation={[0, 0, (i / blades) * Math.PI * 2]}>
          <boxGeometry args={[0.33, 0.08, 0.012]} />
          <meshStandardMaterial color="#3b3e46" metalness={0.3} roughness={0.6} />
        </mesh>
      ))}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 0.06, 24]} />
        <meshStandardMaterial color={INK} metalness={0.6} roughness={0.3} />
      </mesh>
    </group>
  );
}

function Fan({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh>
        <torusGeometry args={[0.4, 0.05, 16, 48]} />
        <meshStandardMaterial color={ORANGE} metalness={0.4} roughness={0.35} />
      </mesh>
      <group position={[0, 0, 0.015]}>
        <Blades />
      </group>
    </group>
  );
}

/* ---------- 1. Graphics card ---------- */
const GraphicsCard: FC = () => (
  <group rotation={[0.1, -0.35, 0]}>
    <RoundedBox args={[3.5, 1.55, 0.22]} radius={0.06} smoothness={4}>
      <meshStandardMaterial color={DARK} metalness={0.55} roughness={0.35} />
    </RoundedBox>
    <RoundedBox args={[3.45, 1.5, 0.06]} radius={0.05} smoothness={3} position={[0, 0, -0.16]}>
      <meshStandardMaterial color={DARKER} metalness={0.6} roughness={0.4} />
    </RoundedBox>
    <mesh position={[0, 0.84, 0.02]}>
      <boxGeometry args={[3.5, 0.12, 0.24]} />
      <meshStandardMaterial color={ORANGE} emissive={ORANGE} emissiveIntensity={0.35} />
    </mesh>
    <mesh position={[-1.92, -0.2, 0]}>
      <boxGeometry args={[0.14, 1.9, 0.5]} />
      <meshStandardMaterial color={METAL} metalness={0.85} roughness={0.25} />
    </mesh>
    <mesh position={[0.4, -0.86, 0]}>
      <boxGeometry args={[1.5, 0.16, 0.18]} />
      <meshStandardMaterial color={GOLD} metalness={0.9} roughness={0.3} />
    </mesh>
    <Fan position={[-0.82, 0.04, 0.12]} />
    <Fan position={[0.82, 0.04, 0.12]} />
  </group>
);

/* ---------- 2. Gaming mouse ---------- */
const Mouse: FC = () => {
  const wheel = useRef<Mesh>(null);
  useFrame((_, dt) => {
    if (wheel.current) wheel.current.rotation.x += dt * 0.8;
  });
  return (
    <group rotation={[0.25, -0.5, 0]} scale={1.2}>
      <mesh scale={[0.85, 0.62, 1.5]}>
        <sphereGeometry args={[1.05, 48, 36]} />
        <meshStandardMaterial color={DARK} metalness={0.4} roughness={0.4} />
      </mesh>
      {/* button split */}
      <mesh position={[0, 0.5, 0.5]} rotation={[0.32, 0, 0]}>
        <boxGeometry args={[0.03, 0.5, 1.0]} />
        <meshStandardMaterial color="#0e0f12" />
      </mesh>
      {/* scroll wheel */}
      <mesh ref={wheel} position={[0, 0.6, 0.72]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.13, 0.13, 0.16, 24]} />
        <meshStandardMaterial color={ORANGE} emissive={ORANGE} emissiveIntensity={0.5} toneMapped={false} />
      </mesh>
      {/* side glow strip */}
      <mesh position={[0, -0.2, -0.1]} scale={[0.87, 0.5, 1.45]}>
        <sphereGeometry args={[1.04, 40, 28]} />
        <meshStandardMaterial color={ORANGE} emissive={ORANGE} emissiveIntensity={0.25} transparent opacity={0.18} />
      </mesh>
    </group>
  );
};

/* ---------- 3. Mechanical keyboard ---------- */
const Keyboard: FC = () => {
  const cols = 14;
  const rows = 5;
  const sx = 0.3;
  const accents = new Set(["2-2", "2-3", "2-4", "1-3", "4-6", "4-7"]);
  return (
    <group rotation={[0.55, -0.25, 0]} scale={0.8}>
      <RoundedBox args={[cols * sx + 0.3, 0.36, rows * sx + 0.3]} radius={0.08} smoothness={4}>
        <meshStandardMaterial color={INK} metalness={0.4} roughness={0.5} />
      </RoundedBox>
      {/* underglow */}
      <mesh position={[0, -0.22, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[cols * sx + 1.1, rows * sx + 1.1]} />
        <meshStandardMaterial color={ORANGE} emissive={ORANGE} emissiveIntensity={0.5} transparent opacity={0.35} toneMapped={false} />
      </mesh>
      {Array.from({ length: rows }).map((_, r) =>
        Array.from({ length: cols }).map((_, c) => {
          const accent = accents.has(`${r}-${c}`);
          return (
            <RoundedBox
              key={`${r}-${c}`}
              args={[0.24, 0.14, 0.24]}
              radius={0.03}
              smoothness={2}
              position={[(c - (cols - 1) / 2) * sx, 0.24, (r - (rows - 1) / 2) * sx]}
            >
              <meshStandardMaterial color={accent ? ORANGE : "#2c2f36"} emissive={accent ? ORANGE : "#000"} emissiveIntensity={accent ? 0.35 : 0} />
            </RoundedBox>
          );
        }),
      )}
    </group>
  );
};

/* ---------- 4. RGB LED strip ---------- */
function LedSeg({ i, total, position }: { i: number; total: number; position: [number, number, number] }) {
  const mat = useRef<MeshStandardMaterial>(null);
  useFrame((s) => {
    if (mat.current) {
      const h = (s.clock.elapsedTime * 0.12 + i / total) % 1;
      mat.current.color.setHSL(h, 0.95, 0.55);
      mat.current.emissive.setHSL(h, 0.95, 0.5);
    }
  });
  return (
    <mesh position={position}>
      <boxGeometry args={[0.2, 0.09, 0.34]} />
      <meshStandardMaterial ref={mat} emissiveIntensity={1.1} toneMapped={false} />
    </mesh>
  );
}

const LedStrip: FC = () => {
  const total = 20;
  return (
    <group rotation={[0.2, -0.25, 0]}>
      {Array.from({ length: total }).map((_, i) => {
        const x = -2.3 + (i / (total - 1)) * 4.6;
        const z = Math.sin((i / (total - 1)) * Math.PI * 2) * 0.5;
        const y = Math.cos((i / (total - 1)) * Math.PI) * 0.25;
        return (
          <group key={i} position={[x, y, z]}>
            {/* backing */}
            <mesh position={[0, -0.07, 0]}>
              <boxGeometry args={[0.24, 0.05, 0.4]} />
              <meshStandardMaterial color={DARKER} metalness={0.3} roughness={0.7} />
            </mesh>
            <LedSeg i={i} total={total} position={[0, 0, 0]} />
          </group>
        );
      })}
    </group>
  );
};

/* ---------- 5. Headphones ---------- */
const Headphones: FC = () => (
  <group rotation={[0.1, -0.2, 0]} scale={1.1}>
    {/* headband arc */}
    <mesh>
      <torusGeometry args={[1.3, 0.12, 16, 64, Math.PI]} />
      <meshStandardMaterial color={DARK} metalness={0.5} roughness={0.4} />
    </mesh>
    {[-1.3, 1.3].map((x, i) => (
      <group key={i} position={[x, -0.1, 0]}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.55, 0.62, 0.5, 36]} />
          <meshStandardMaterial color={INK} metalness={0.4} roughness={0.5} />
        </mesh>
        <mesh position={[x < 0 ? -0.26 : 0.26, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[0.45, 0.05, 16, 40]} />
          <meshStandardMaterial color={ORANGE} emissive={ORANGE} emissiveIntensity={0.35} toneMapped={false} />
        </mesh>
      </group>
    ))}
  </group>
);

/* ---------- 6. RAM module ---------- */
const RamStick: FC = () => (
  <group rotation={[0.1, -0.3, 0]}>
    <RoundedBox args={[3.4, 1.1, 0.06]} radius={0.03}>
      <meshStandardMaterial color="#1d6b46" metalness={0.3} roughness={0.5} />
    </RoundedBox>
    <RoundedBox args={[3.2, 0.95, 0.12]} radius={0.04} position={[0, 0.05, 0.06]}>
      <meshStandardMaterial color={DARK} metalness={0.6} roughness={0.35} />
    </RoundedBox>
    <RoundedBox args={[3.2, 0.95, 0.12]} radius={0.04} position={[0, 0.05, -0.06]}>
      <meshStandardMaterial color={DARK} metalness={0.6} roughness={0.35} />
    </RoundedBox>
    {Array.from({ length: 9 }).map((_, i) => (
      <mesh key={i} position={[-1.4 + i * 0.35, 0.6, 0]}>
        <boxGeometry args={[0.18, 0.18, 0.16]} />
        <meshStandardMaterial color={ORANGE} emissive={ORANGE} emissiveIntensity={0.25} />
      </mesh>
    ))}
    <mesh position={[0, -0.62, 0]}>
      <boxGeometry args={[3.0, 0.18, 0.07]} />
      <meshStandardMaterial color={GOLD} metalness={0.9} roughness={0.3} />
    </mesh>
    <mesh position={[0.4, -0.62, 0]}>
      <boxGeometry args={[0.1, 0.22, 0.12]} />
      <meshStandardMaterial color="#1d6b46" />
    </mesh>
  </group>
);

/* ---------- 7. Processor ---------- */
const Processor: FC = () => (
  <group rotation={[0.5, -0.4, 0]} scale={1.25}>
    <RoundedBox args={[1.7, 0.16, 1.7]} radius={0.04}>
      <meshStandardMaterial color="#14151a" metalness={0.4} roughness={0.5} />
    </RoundedBox>
    <RoundedBox args={[1.2, 0.13, 1.2]} radius={0.05} position={[0, 0.14, 0]}>
      <meshStandardMaterial color={METAL} metalness={0.85} roughness={0.25} />
    </RoundedBox>
    <mesh position={[0, 0.21, 0]}>
      <boxGeometry args={[1.0, 0.006, 0.05]} />
      <meshStandardMaterial color={ORANGE} emissive={ORANGE} emissiveIntensity={0.6} toneMapped={false} />
    </mesh>
    <mesh position={[-0.66, 0.18, 0.66]} rotation={[Math.PI / 2, 0, 0]}>
      <cylinderGeometry args={[0.07, 0.07, 0.02, 3]} />
      <meshStandardMaterial color={ORANGE} emissive={ORANGE} emissiveIntensity={0.4} />
    </mesh>
    {/* gold pads underside */}
    <mesh position={[0, -0.1, 0]}>
      <boxGeometry args={[1.5, 0.04, 1.5]} />
      <meshStandardMaterial color={GOLD} metalness={0.9} roughness={0.35} />
    </mesh>
  </group>
);

/* ---------- 8. Power supply ---------- */
const PowerSupply: FC = () => (
  <group rotation={[0.18, -0.5, 0]} scale={0.95}>
    <RoundedBox args={[2.6, 1.5, 2.1]} radius={0.07} smoothness={4}>
      <meshStandardMaterial color={INK} metalness={0.5} roughness={0.45} />
    </RoundedBox>
    {/* top fan grille */}
    <group position={[0, 0.76, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <mesh>
        <torusGeometry args={[0.8, 0.05, 16, 48]} />
        <meshStandardMaterial color={ORANGE} emissive={ORANGE} emissiveIntensity={0.25} />
      </mesh>
      <Blades scale={1.6} />
      {Array.from({ length: 7 }).map((_, i) => (
        <mesh key={i} position={[-0.7 + i * 0.23, 0, 0.06]}>
          <boxGeometry args={[0.025, 1.5, 0.02]} />
          <meshStandardMaterial color="#3b3e46" />
        </mesh>
      ))}
    </group>
    {/* honeycomb face hint */}
    <mesh position={[0, -0.1, 1.06]}>
      <boxGeometry args={[2.0, 1.0, 0.02]} />
      <meshStandardMaterial color="#0e0f12" metalness={0.3} roughness={0.7} />
    </mesh>
    {/* socket */}
    <mesh position={[-0.8, -0.42, 1.07]}>
      <boxGeometry args={[0.42, 0.36, 0.06]} />
      <meshStandardMaterial color="#2a2c31" />
    </mesh>
  </group>
);

/* ---------- 9. NVMe SSD ---------- */
const NvmeDrive: FC = () => (
  <group rotation={[0.32, -0.3, 0]}>
    <RoundedBox args={[3.3, 0.8, 0.08]} radius={0.03}>
      <meshStandardMaterial color="#1d4a6b" metalness={0.3} roughness={0.5} />
    </RoundedBox>
    {[-0.7, 0.3, 1.15].map((x, i) => (
      <RoundedBox key={i} args={[0.7, 0.5, 0.06]} radius={0.02} position={[x, 0, 0.07]}>
        <meshStandardMaterial color={DARK} metalness={0.5} roughness={0.4} />
      </RoundedBox>
    ))}
    <mesh position={[-1.45, 0, 0.075]}>
      <boxGeometry args={[0.7, 0.55, 0.01]} />
      <meshStandardMaterial color={ORANGE} emissive={ORANGE} emissiveIntensity={0.18} />
    </mesh>
    {/* gold connector + notch */}
    <mesh position={[1.78, -0.18, 0.02]}>
      <boxGeometry args={[0.36, 0.32, 0.07]} />
      <meshStandardMaterial color={GOLD} metalness={0.9} roughness={0.3} />
    </mesh>
  </group>
);

/* ---------- 10. Webcam ---------- */
const Webcam: FC = () => (
  <group rotation={[0.1, -0.2, 0]} scale={1.15}>
    <mesh>
      <sphereGeometry args={[0.9, 48, 36]} />
      <meshStandardMaterial color={INK} metalness={0.4} roughness={0.5} />
    </mesh>
    <mesh position={[0, 0, 0.78]} rotation={[Math.PI / 2, 0, 0]}>
      <cylinderGeometry args={[0.42, 0.5, 0.32, 40]} />
      <meshStandardMaterial color="#0e0f12" metalness={0.6} roughness={0.3} />
    </mesh>
    <mesh position={[0, 0, 0.95]} rotation={[Math.PI / 2, 0, 0]}>
      <cylinderGeometry args={[0.3, 0.3, 0.06, 40]} />
      <meshStandardMaterial color="#14202a" metalness={0.8} roughness={0.1} />
    </mesh>
    <mesh position={[0, 0, 0.9]} rotation={[Math.PI / 2, 0, 0]}>
      <torusGeometry args={[0.42, 0.04, 16, 40]} />
      <meshStandardMaterial color={ORANGE} emissive={ORANGE} emissiveIntensity={0.4} toneMapped={false} />
    </mesh>
    <mesh position={[0.55, 0.32, 0.7]}>
      <sphereGeometry args={[0.06, 16, 16]} />
      <meshStandardMaterial color="#1f8a4c" emissive="#1f8a4c" emissiveIntensity={1.2} toneMapped={false} />
    </mesh>
    <mesh position={[0, -0.95, 0.1]} rotation={[0.35, 0, 0]}>
      <boxGeometry args={[1.0, 0.16, 0.5]} />
      <meshStandardMaterial color={DARK} metalness={0.4} roughness={0.5} />
    </mesh>
    <mesh position={[0, -1.25, -0.3]} rotation={[-0.5, 0, 0]}>
      <boxGeometry args={[1.0, 0.16, 0.5]} />
      <meshStandardMaterial color={DARK} metalness={0.4} roughness={0.5} />
    </mesh>
  </group>
);

/* ---------- 11. Smartphone ---------- */
const Phone: FC = () => (
  <group rotation={[0.15, -0.4, 0]} scale={0.92}>
    <RoundedBox args={[1.7, 3.4, 0.18]} radius={0.18} smoothness={6}>
      <meshStandardMaterial color={INK} metalness={0.5} roughness={0.35} />
    </RoundedBox>
    {/* screen */}
    <mesh position={[0, 0.05, 0.1]}>
      <boxGeometry args={[1.5, 3.1, 0.02]} />
      <meshStandardMaterial color="#0a0c10" metalness={0.6} roughness={0.1} emissive="#0a1d3a" emissiveIntensity={0.5} />
    </mesh>
    {/* front camera dot */}
    <mesh position={[0, 1.4, 0.11]} rotation={[Math.PI / 2, 0, 0]}>
      <cylinderGeometry args={[0.05, 0.05, 0.02, 20]} />
      <meshStandardMaterial color="#0e0f12" metalness={0.8} roughness={0.1} />
    </mesh>
    {/* back camera bump */}
    <group position={[-0.45, 1.0, -0.11]}>
      <RoundedBox args={[0.72, 0.72, 0.1]} radius={0.12} smoothness={4}>
        <meshStandardMaterial color="#15161a" metalness={0.5} roughness={0.4} />
      </RoundedBox>
      {[[-0.16, 0.16], [0.16, 0.16], [0, -0.16]].map(([x, y], i) => (
        <mesh key={i} position={[x, y, -0.07]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.12, 0.12, 0.06, 24]} />
          <meshStandardMaterial color="#0a0c10" metalness={0.85} roughness={0.1} />
        </mesh>
      ))}
    </group>
    {/* power button */}
    <mesh position={[0.86, 0.45, 0]}>
      <boxGeometry args={[0.05, 0.5, 0.1]} />
      <meshStandardMaterial color={ORANGE} emissive={ORANGE} emissiveIntensity={0.35} />
    </mesh>
  </group>
);

export interface HeroModel {
  name: string;
  Component: FC;
}

export const HERO_MODELS: HeroModel[] = [
  { name: "Graphics Card", Component: GraphicsCard },
  { name: "Gaming Mouse", Component: Mouse },
  { name: "Mechanical Keyboard", Component: Keyboard },
  { name: "RGB LED Strip", Component: LedStrip },
  { name: "Headphones", Component: Headphones },
  { name: "RAM Module", Component: RamStick },
  { name: "Processor", Component: Processor },
  { name: "Power Supply", Component: PowerSupply },
  { name: "NVMe SSD", Component: NvmeDrive },
  { name: "Webcam", Component: Webcam },
  { name: "Smartphone", Component: Phone },
];
