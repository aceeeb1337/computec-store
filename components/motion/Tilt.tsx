"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import type { ReactNode } from "react";

interface TiltProps {
  children: ReactNode;
  className?: string;
  /** Max tilt in degrees. */
  max?: number;
  /** Lift on hover, in px. */
  lift?: number;
  style?: React.CSSProperties;
}

/**
 * Wraps content in a perspective container and tilts it toward the cursor.
 * Used for product cards and the homepage tiles to add depth.
 */
export default function Tilt({ children, className, max = 9, lift = 6, style }: TiltProps) {
  const px = useMotionValue(0);
  const py = useMotionValue(0);

  const rotateX = useSpring(useTransform(py, [-0.5, 0.5], [max, -max]), { stiffness: 220, damping: 18 });
  const rotateY = useSpring(useTransform(px, [-0.5, 0.5], [-max, max]), { stiffness: 220, damping: 18 });
  const y = useSpring(useMotionValue(0), { stiffness: 260, damping: 20 });

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width - 0.5);
    py.set((e.clientY - r.top) / r.height - 0.5);
  };
  const reset = () => {
    px.set(0);
    py.set(0);
    y.set(0);
  };

  return (
    <div style={{ perspective: 900, ...style }} className={className}>
      <motion.div
        onMouseMove={handleMove}
        onMouseEnter={() => y.set(-lift)}
        onMouseLeave={reset}
        style={{ rotateX, rotateY, y, transformStyle: "preserve-3d", height: "100%" }}
      >
        {children}
      </motion.div>
    </div>
  );
}
