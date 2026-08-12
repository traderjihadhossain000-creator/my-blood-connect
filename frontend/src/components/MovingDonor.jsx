import { motion } from "framer-motion";
import { Heart } from "lucide-react";

export default function MovingDonor({
  donors,
  activeDonor,
}) {
  return (
    <>
      {donors.map((donor) => {
        const active = donor.id === activeDonor.id;

        return (
          <motion.div
            key={donor.id}
            className="absolute z-30"
            initial={false}
            animate={{
              left: donor.x,
              top: donor.y,
              scale: active ? 1.25 : 0.95,
            }}
            transition={{
              duration: 3,
              ease: "easeInOut",
            }}
          >
                        {/* Active Pulse */}

            {active && (
              <motion.div
                className="absolute -inset-5 rounded-full bg-red-500/20"

                animate={{
                  scale: [1, 2.4],
                  opacity: [0.7, 0],
                }}

                transition={{
                  duration: 1.8,
                  repeat: Infinity,
                  ease: "easeOut",
                }}
              />
            )}
                        {/* Donor Heart */}

            <motion.div
              className="relative"

              animate={{
                scale: active
                  ? [1, 1.18, 1]
                  : [1, 1.05, 1],
              }}

              transition={{
                duration: active ? 1.2 : 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >

              {/* Glow */}

              {active && (
                <motion.div
                  className="absolute inset-0 rounded-full bg-red-500/30 blur-xl"

                  animate={{
                    scale: [1, 1.8],
                    opacity: [0.8, 0],
                  }}

                  transition={{
                    duration: 1.6,
                    repeat: Infinity,
                  }}
                />
              )}

              <Heart
                size={active ? 32 : 26}
                className={
                  active
                    ? "relative fill-red-500 text-red-500 drop-shadow-[0_0_18px_#ef4444]"
                    : "relative fill-red-400 text-red-400 opacity-80"
                }
              />

            </motion.div>
                        {/* Blood Group Badge */}

            <motion.div
              initial={{
                opacity: 0,
                y: -8,
              }}

              animate={{
                opacity: 1,
                y: 0,
              }}

              transition={{
                duration: 0.4,
              }}

              className="
                absolute
                -top-8
                left-1/2
                -translate-x-1/2
                whitespace-nowrap
              "
            >

              <div
                className={`
                  px-2.5
                  py-1
                  rounded-full
                  text-[10px]
                  font-bold
                  border
                  backdrop-blur-xl
                  transition-all
                  ${
                    active
                      ? "bg-red-500 text-white border-red-300 shadow-[0_0_18px_rgba(239,68,68,.65)]"
                      : "bg-slate-900/90 text-red-300 border-red-500/30"
                  }
                `}
              >

                {donor.blood}

              </div>

            </motion.div>
                        {/* Active Tracking Label */}

            {active && (

              <motion.div
                initial={{
                  opacity: 0,
                  y: 4,
                }}

                animate={{
                  opacity: [0.6, 1, 0.6],
                  y: [4, 0, 4],
                }}

                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                }}

                className="
                  absolute
                  top-10
                  left-1/2
                  -translate-x-1/2
                  whitespace-nowrap
                "
              >

                <div
                  className="
                    px-3
                    py-1
                    rounded-full
                    bg-cyan-500/15
                    border
                    border-cyan-400/40
                    text-cyan-300
                    text-[10px]
                    font-semibold
                    backdrop-blur-xl
                  "
                >

                  TRACKING

                </div>

              </motion.div>

            )}
                      </motion.div>
        );
      })}
    </>
  );
}