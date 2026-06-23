"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05, delayChildren: 0.04 } },
};
const item = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
};

/** Grid/container whose direct StaggerItem children animate in sequence on scroll. */
export function StaggerGrid({ children, style, className }: { children: ReactNode; style?: React.CSSProperties; className?: string }) {
  return (
    <motion.div
      className={className}
      style={style}
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-50px" }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, style }: { children: ReactNode; style?: React.CSSProperties }) {
  return (
    <motion.div variants={item} style={style}>
      {children}
    </motion.div>
  );
}
