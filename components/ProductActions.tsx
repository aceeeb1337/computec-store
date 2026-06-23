"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useCart } from "@/lib/cart-context";

export default function ProductActions({ productId }: { productId: string }) {
  const router = useRouter();
  const { addToCart } = useCart();

  return (
    <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
      <motion.button
        whileHover={{ scale: 1.03, y: -2 }}
        whileTap={{ scale: 0.97 }}
        transition={{ type: "spring", stiffness: 400, damping: 18 }}
        onClick={() => { addToCart(productId, 1); router.push("/cart"); }}
        style={{ flex: 1, textAlign: "center", background: "#ff6a1a", color: "#fff", fontFamily: "var(--font-archivo)", fontWeight: 800, fontSize: 15, padding: 15, borderRadius: 6, boxShadow: "0 8px 22px rgba(255,106,26,0.32)" }}
      >
        Buy now
      </motion.button>
      <motion.button
        whileHover={{ scale: 1.03, y: -2 }}
        whileTap={{ scale: 0.97 }}
        transition={{ type: "spring", stiffness: 400, damping: 18 }}
        onClick={() => addToCart(productId, 1)}
        style={{ flex: 1, textAlign: "center", background: "#1c1d21", color: "#fff", fontFamily: "var(--font-archivo)", fontWeight: 800, fontSize: 15, padding: 15, borderRadius: 6 }}
      >
        Add to cart
      </motion.button>
    </div>
  );
}
