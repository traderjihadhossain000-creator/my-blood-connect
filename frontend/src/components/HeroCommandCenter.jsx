import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

import HeroMap from "./HeroMap";
import MovingDonor from "./MovingDonor";
import RouteLayer from "./RouteLayer";
import MapOverlay from "./MapOverlay";

const INITIAL_DONORS = [
  {
    id: 1,
    x: 80,
    y: 110,
    distance: 1.8,
    blood: "A+",
  },
  {
    id: 2,
    x: 390,
    y: 120,
    distance: 2.4,
    blood: "O+",
  },
  {
    id: 3,
    x: 120,
    y: 240,
    distance: 1.5,
    blood: "B+",
  },
  {
    id: 4,
    x: 360,
    y: 270,
    distance: 3.1,
    blood: "AB+",
  },
  {
    id: 5,
    x: 150,
    y: 430,
    distance: 2.0,
    blood: "O-",
  },
  {
    id: 6,
    x: 330,
    y: 470,
    distance: 1.2,
    blood: "A-",
  },
  {
    id: 7,
    x: 230,
    y: 170,
    distance: 2.7,
    blood: "B-",
  },
  {
    id: 8,
    x: 260,
    y: 520,
    distance: 1.9,
    blood: "AB-",
  },
];

const USER = { x: 250, y: 310 };

export default function HeroCommandCenter() {

  const [donors, setDonors] =
    useState(INITIAL_DONORS);

    // ----------------------------
  // Random Movement Engine
  // ----------------------------

  useEffect(() => {

    const moveInterval = setInterval(() => {

      setDonors((prev) =>

        prev.map((donor) => {

          const randomX =
            donor.x + (Math.random() * 60 - 30);

          const randomY =
            donor.y + (Math.random() * 60 - 30);

          return {

            ...donor,

            x: Math.max(40, Math.min(460, randomX)),

            y: Math.max(60, Math.min(560, randomY)),

          };

        })

      );

    }, 3000);

    return () => clearInterval(moveInterval);

  }, []);

  // ----------------------------
  // Nearest Donor Detection
  // ----------------------------

  const activeDonor = useMemo(() => {

    const nearest = donors.reduce((closest, donor) => {

      const currentDistance = Math.sqrt(

        Math.pow(donor.x - USER.x, 2) +

        Math.pow(donor.y - USER.y, 2)

      );

      const closestDistance = Math.sqrt(

        Math.pow(closest.x - USER.x, 2) +

        Math.pow(closest.y - USER.y, 2)

      );

      return currentDistance < closestDistance

        ? donor

        : closest;

    }, donors[0]);

    return {
      ...nearest,
      distance:
        (
          Math.sqrt(
            Math.pow(nearest.x - USER.x, 2) +
            Math.pow(nearest.y - USER.y, 2)
          ) / 45
        ).toFixed(1),
    };
  }, [donors]);
    return (

    <motion.div

      initial={{
        opacity: 0,
        x: 60,
      }}

      animate={{
        opacity: 1,
        x: 0,
      }}

      transition={{
        duration: 0.8,
      }}

      className="
        relative
        w-[500px]
        h-[620px]
        rounded-[34px]
        overflow-hidden
        border
        border-white/10
        bg-slate-950/80
        backdrop-blur-3xl
        shadow-[0_30px_100px_rgba(0,0,0,.65)]
      "

    >

      {/* Background Map */}

      <HeroMap />

      {/* Route + Ambulance */}

      <RouteLayer

        user={USER}

        activeDonor={activeDonor}

      />

      {/* Moving Donors */}

      <MovingDonor

        donors={donors}

        activeDonor={activeDonor}

      />

      {/* Dashboard */}

      <MapOverlay

        activeDonor={activeDonor}

        onlineCount={248 + donors.length * 6}

      />
            {/* Glass Glow */}

      <div className="absolute -top-40 -left-40 w-80 h-80 rounded-full bg-red-500/15 blur-[120px] pointer-events-none" />

      <div className="absolute -bottom-40 -right-40 w-80 h-80 rounded-full bg-cyan-500/15 blur-[120px] pointer-events-none" />

      {/* Animated Border */}

      <motion.div
        className="absolute inset-0 rounded-[34px] border border-red-500/10 pointer-events-none"
        animate={{
          opacity: [0.2, 0.6, 0.2],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
        }}
      />

      {/* Donor Scan */}

      <motion.div
        className="absolute left-0 right-0 h-24 bg-gradient-to-b from-cyan-400/10 via-cyan-300/5 to-transparent pointer-events-none"
        animate={{
          top: ["-15%", "100%"],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "linear",
        }}
      />

    </motion.div>

  );

}
