import { motion } from "framer-motion";
import { useState } from "react";

export default function GlowCard({ children, className = "" }) {
  const [position, setPosition] = useState({
    x: 0,
    y: 0,
  });

  function handleMouseMove(e) {
    const rect = e.currentTarget.getBoundingClientRect();

    setPosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  }

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      whileHover={{ scale: 1.01 }}
      transition={{
        duration: 0.25,
      }}
      className={`relative overflow-hidden rounded-3xl group ${className}`}
    >
      {/* Mouse Glow */}

      <motion.div
        animate={{
          x: position.x - 150,
          y: position.y - 150,
        }}
        transition={{
          type: "tween",
          ease: "linear",
          duration: 0.08,
        }}
        className="absolute w-[300px] h-[300px] rounded-full pointer-events-none opacity-0 group-hover:opacity-100 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(239,68,68,.20), transparent 70%)",
        }}
      />

      {/* Border Glow */}

      <div className="absolute inset-0 rounded-3xl border border-white/10 group-hover:border-red-500/40 transition-all duration-500" />

      {/* Glass */}

      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/[0.04] to-white/[0.01]" />

      {/* Content */}

      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
}