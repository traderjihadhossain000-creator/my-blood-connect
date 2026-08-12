import { motion } from "framer-motion";
import { Ambulance } from "lucide-react";

export default function RouteLayer({
  user,
  activeDonor,
}) {
  if (!activeDonor || !user) return null;

  return (
    <>
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none z-20"
        viewBox="0 0 500 620"
        preserveAspectRatio="none"
      >
        {/* Main Route */}

        <motion.line
          x1={user.x}
          y1={user.y}
          x2={activeDonor.x}
          y2={activeDonor.y}
          stroke="#22d3ee"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray="12 10"
          initial={{
            pathLength: 0,
          }}
          animate={{
            pathLength: 1,
          }}
          transition={{
            duration: 1,
          }}
        />

        {/* Glow Route */}

        <motion.line
          x1={user.x}
          y1={user.y}
          x2={activeDonor.x}
          y2={activeDonor.y}
          stroke="#06b6d4"
          strokeWidth="10"
          opacity={0.15}
          strokeLinecap="round"
        />
      </svg>

      {/* Ambulance */}

      <motion.div
        className="absolute z-30"

        initial={{
          left: user.x,
          top: user.y,
        }}

        animate={{
          left: activeDonor.x,
          top: activeDonor.y,
        }}

        transition={{
          duration: 3,
          ease: "linear",
          repeat: Infinity,
          repeatType: "reverse",
        }}
      >
        <Ambulance
          size={24}
          className="text-emerald-400 drop-shadow-[0_0_12px_#34d399]"
        />
      </motion.div>

      {/* Destination Pulse */}

      <motion.div
        className="absolute rounded-full bg-cyan-400/20"

        style={{
          left: activeDonor.x - 10,
          top: activeDonor.y - 10,
          width: 30,
          height: 30,
        }}

        animate={{
          scale: [1, 2.5],
          opacity: [0.6, 0],
        }}

        transition={{
          duration: 1.8,
          repeat: Infinity,
        }}
      />
    </>
  );
}