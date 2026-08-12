
import { motion } from "framer-motion";
import {
  MapPin,
  Building2,
  HeartPulse,
} from "lucide-react";

export default function HeroMap() {

  return (

    <div className="absolute inset-0 overflow-hidden">

      {/* Background */}

      <div className="absolute inset-0 bg-gradient-to-br
      from-slate-950
      via-slate-900
      to-black"/>

      {/* Main Glow */}

      <div className="absolute -left-44 top-20 w-[420px] h-[420px]
      rounded-full bg-cyan-500/10 blur-[140px]" />

      <div className="absolute -right-44 bottom-10 w-[420px] h-[420px]
      rounded-full bg-red-500/10 blur-[140px]" />

      {/* Grid */}

      <div

        className="absolute inset-0 opacity-[0.08]"

        style={{

          backgroundImage:`

linear-gradient(rgba(255,255,255,.12) 1px,transparent 1px),

linear-gradient(90deg,rgba(255,255,255,.12) 1px,transparent 1px)

`,

          backgroundSize:"40px 40px"

        }}

      />

      {/* Radar */}

      <div className="absolute inset-0 flex items-center justify-center">

        {[1,2,3,4,5,6].map((r)=>(

          <motion.div

            key={r}

            className="absolute rounded-full border border-cyan-400/20"

            style={{

              width:r*120,

              height:r*120

            }}

            animate={{

              scale:[1,1.08,1],

              opacity:[0.45,.12,.45]

            }}

            transition={{

              repeat:Infinity,

              duration:4+r,

              ease:"linear"

            }}

          />

        ))}

      </div>
            {/* Radar Scanner */}

      <motion.div

        className="absolute left-1/2 top-1/2 origin-left"

        style={{
          width: 250,
          height: 3,
          background:
            "linear-gradient(to right,#22d3ee,transparent)",
        }}

        animate={{
          rotate: 360,
        }}

        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "linear",
        }}

      />

      {/* Roads */}

      <svg
        className="absolute inset-0 w-full h-full opacity-60"
        viewBox="0 0 500 620"
      >

        {/* Road 1 */}

        <motion.path
          d="M30 120 C120 170 220 70 470 120"
          stroke="#334155"
          strokeWidth="5"
          fill="none"
        />

        {/* Road 2 */}

        <motion.path
          d="M20 300 C120 230 260 350 480 280"
          stroke="#334155"
          strokeWidth="5"
          fill="none"
        />

        {/* Road 3 */}

        <motion.path
          d="M60 500 C180 420 300 560 470 480"
          stroke="#334155"
          strokeWidth="5"
          fill="none"
        />

        {/* Vertical */}

        <motion.path
          d="M140 40 L160 580"
          stroke="#334155"
          strokeWidth="4"
          fill="none"
        />

        <motion.path
          d="M330 30 L350 590"
          stroke="#334155"
          strokeWidth="4"
          fill="none"
        />
<motion.path
  d="M140 40 L160 580"
  stroke="#22d3ee"
  strokeWidth="2"
  fill="none"
  strokeDasharray="10 10"
  animate={{
    pathLength: [1, 0],
  }}
  transition={{
    duration: 4,
    repeat: Infinity,
  }}
/>

<motion.path
  d="M330 30 L350 590"
  stroke="#22d3ee"
  strokeWidth="2"
  fill="none"
  strokeDasharray="10 10"
  animate={{
    pathLength: [0, 1],
  }}
  transition={{
    duration: 3.5,
    repeat: Infinity,
  }}
/>
        {/* Traffic */}

        <motion.path

          d="M30 120 C120 170 220 70 470 120"

          stroke="#22d3ee"

          strokeWidth="2"

          fill="none"

          strokeDasharray="10 10"

          animate={{

            pathLength:[0,1]

          }}

          transition={{

            duration:3,

            repeat:Infinity

          }}

        />

        <motion.path

          d="M20 300 C120 230 260 350 480 280"

          stroke="#22d3ee"

          strokeWidth="2"

          fill="none"

          strokeDasharray="10 10"

          animate={{

            pathLength:[1,0]

          }}

          transition={{

            duration:4,

            repeat:Infinity

          }}

        />

        <motion.path
  d="M60 500 C180 420 300 560 470 480"
  stroke="#22d3ee"
  strokeWidth="2"
  fill="none"
  strokeDasharray="10 10"
  animate={{
    pathLength: [0, 1],
  }}
  transition={{
    duration: 3.8,
    repeat: Infinity,
  }}
/>

      </svg>

      {/* Network Nodes */}

      {[
        {x:70,y:150},
        {x:180,y:100},
        {x:420,y:130},
        {x:130,y:310},
        {x:390,y:280},
        {x:210,y:470},
        {x:350,y:520},
        {x:440,y:430},
      ].map((node,index)=>(

        <motion.div

          key={index}

          className="absolute w-3 h-3 rounded-full bg-cyan-400"

          style={{
            left:node.x,
            top:node.y
          }}

          animate={{
            scale:[1,2,1],
            opacity:[.3,1,.3]
          }}

          transition={{
            repeat:Infinity,
            duration:2,
            delay:index*.3
          }}

        />

      ))}
            {/* Patient Location */}

      <motion.div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-30"
        animate={{
          scale: [1, 1.12, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
        }}
      >

        <motion.div
          className="absolute inset-0 rounded-full bg-cyan-400/30"
          animate={{
            scale: [1, 2.6],
            opacity: [0.8, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
        />

        <MapPin
          size={42}
          className="text-cyan-400 fill-cyan-400 drop-shadow-[0_0_20px_#22d3ee]"
        />

      </motion.div>

      {/* Hospital */}

      <motion.div
        className="absolute right-20 bottom-36 z-20"
        animate={{
          y: [0, -6, 0],
        }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
        }}
      >

        <div className="relative">

          <motion.div
            className="absolute -inset-4 rounded-full bg-emerald-400/20"
            animate={{
              scale: [1, 1.8],
              opacity: [0.7, 0],
            }}
            transition={{
              duration: 2.4,
              repeat: Infinity,
            }}
          />

          <Building2
            size={34}
            className="relative text-emerald-400 drop-shadow-[0_0_15px_#34d399]"
          />
<motion.div
  className="absolute left-1/2 top-1/2 w-2 h-2 rounded-full bg-emerald-400"
  animate={{
    scale: [1, 3],
    opacity: [1, 0],
  }}
  transition={{
    duration: 2,
    repeat: Infinity,
  }}
/>


        </div>

      </motion.div>

      {/* Emergency Zone */}

      <motion.div
        className="absolute left-20 top-28 z-20"
        animate={{
          scale: [1, 1.08, 1],
        }}
        transition={{
          duration: 1.8,
          repeat: Infinity,
        }}
      >
<motion.div
  className="absolute -inset-4 rounded-full bg-red-500/20"
  animate={{
    scale: [1, 2],
    opacity: [0.7, 0],
  }}
  transition={{
    duration: 1.6,
    repeat: Infinity,
  }}
/>
        <HeartPulse
          size={28}
          className="text-red-500 drop-shadow-[0_0_15px_#ef4444]"
        />

      </motion.div>

      {/* City Buildings */}

      {[

        { left: 70, top: 80 },

        { left: 420, top: 80 },

        { left: 55, top: 500 },

        { left: 410, top: 500 },

        { left: 250, top: 70 },

      ].map((item, index) => (

        <motion.div

          key={index}

          className="absolute opacity-20"

          style={{
            left: item.left,
            top: item.top,
          }}

          animate={{
            opacity: [0.15, 0.35, 0.15],
          }}

          transition={{
            duration: 3,
            repeat: Infinity,
            delay: index * 0.5,
          }}

        >

          <Building2
            size={18}
            className="text-slate-400"
          />

        </motion.div>

      ))}
            {/* Scan Glow */}

      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{
          opacity: [0.08, 0.22, 0.08],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <div
          className="absolute left-1/2 top-1/2
          -translate-x-1/2 -translate-y-1/2
          w-[520px] h-[520px]
          rounded-full
          bg-cyan-400/5
          blur-[100px]"
        />
      </motion.div>

      {/* Corner Glow */}

      <div className="absolute top-0 left-0 w-40 h-40 bg-cyan-500/5 blur-[90px] rounded-full" />

      <div className="absolute top-0 right-0 w-40 h-40 bg-red-500/5 blur-[90px] rounded-full" />

      <div className="absolute bottom-0 left-0 w-40 h-40 bg-emerald-500/5 blur-[90px] rounded-full" />

      <div className="absolute bottom-0 right-0 w-40 h-40 bg-cyan-500/5 blur-[90px] rounded-full" />

      {/* Vignette */}

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at center, transparent 45%, rgba(2,6,23,.55) 100%)",
        }}
      />

    </div>

  );

}
