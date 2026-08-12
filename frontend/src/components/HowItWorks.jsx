import { motion } from "framer-motion";
import {
  Droplets,
  Radar,
  Navigation,
  HeartHandshake,
} from "lucide-react";

import StepCard from "./StepCard";

export default function HowItWorks() {
  return (
    <section className="relative py-32 overflow-hidden">

      {/* Background */}

      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900 to-black" />

      {/* Glow */}

      <div className="absolute -top-44 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full bg-red-500/10 blur-[180px]" />

      <div className="absolute bottom-0 left-0 w-[350px] h-[350px] rounded-full bg-cyan-500/10 blur-[140px]" />

      <div className="absolute top-20 right-0 w-[300px] h-[300px] rounded-full bg-emerald-500/10 blur-[140px]" />

      {/* Grid */}

      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,.08) 1px,transparent 1px),
            linear-gradient(90deg,rgba(255,255,255,.08) 1px,transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6">

        {/* Heading */}

        <motion.div
          initial={{
            opacity: 0,
            y: 40,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{ once: true }}
          transition={{
            duration: 0.8,
          }}
          className="text-center mb-20"
        >

          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-semibold">

            Fast Emergency Process

          </span>

          <h2 className="mt-6 text-5xl md:text-6xl font-black text-white leading-tight">

            How Blood Connect <br />

            <span className="text-red-500">

              Saves Lives

            </span>

          </h2>

          <p className="mt-6 text-slate-400 max-w-2xl mx-auto text-lg leading-8">

            From emergency request to donor arrival,
            every step is optimized with
            live tracking and instant communication.

          </p>

        </motion.div>
                {/* Steps */}

        <div className="relative">

          {/* Connection Line (Desktop) */}

          <div
            className="
              hidden
              lg:block
              absolute
              left-0
              right-0
              top-20
              h-[2px]
              bg-gradient-to-r
              from-transparent
              via-red-500/30
              to-transparent
            "
          />

          <div
            className="
              grid
              grid-cols-1
              md:grid-cols-2
              xl:grid-cols-4
              gap-8
            "
          >

            <StepCard
              number="01"
              icon={<Droplets size={30} className="text-white" />}
              title="Request Blood"
              description="Submit an emergency blood request with the required blood group and location."
            />

            <StepCard
              number="02"
              icon={<Radar size={30} className="text-white" />}
              title="Find Nearby Donors"
              description="The platform instantly searches nearby eligible donors and ranks the best matches."
            />

            <StepCard
              number="03"
              icon={<Navigation size={30} className="text-white" />}
              title="Live Tracking"
              description="Track donor confirmation and estimated arrival in real time."
            />

            <StepCard
              number="04"
              icon={<HeartHandshake size={30} className="text-white" />}
              title="Save a Life"
              description="The donor reaches the patient quickly, helping save lives during emergencies."
            />

          </div>

        </div>
              </div>

    </section>
  );
}
