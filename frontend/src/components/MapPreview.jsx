import { motion } from "framer-motion";
import {
  Heart,
  Hospital,
  Navigation,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function MapPreview() {
  return (
    <section className="relative py-28">

      <div className="max-w-7xl mx-auto px-6">

        {/* Heading */}

        <div className="text-center mb-16">

          <span className="text-red-400 uppercase tracking-[5px] font-bold text-sm">

            Live GPS System

          </span>

          <h2 className="text-5xl font-black mt-4">

            Explore Nearby
            <span className="text-red-500"> Blood Donors</span>

          </h2>

          <p className="text-slate-400 mt-5 max-w-2xl mx-auto">

            The platform continuously scans donor locations and hospitals
            to connect patients with the fastest possible blood donor.

          </p>

        </div>

        {/* Card */}

        <motion.div

          whileHover={{ scale: 1.01 }}

          className="relative h-[600px]
          rounded-[40px]
          overflow-hidden
          border border-white/10
          bg-gradient-to-br
          from-slate-900
          via-slate-950
          to-black"

        >

          {/* Grid */}

          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,.2) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.2) 1px,transparent 1px)",
              backgroundSize: "50px 50px",
            }}
          />

          {/* Hospital */}

          <motion.div

            animate={{
              y:[0,-10,0]
            }}

            transition={{
              repeat:Infinity,
              duration:2
            }}

            className="absolute top-24 left-28"

          >

            <Hospital
              className="text-emerald-400"
              size={48}
            />

          </motion.div>

          {/* Donor */}

          <motion.div

            animate={{
              scale:[1,1.2,1]
            }}

            transition={{
              repeat:Infinity,
              duration:2
            }}

            className="absolute top-56 left-[45%]"

          >

            <Heart
              className="text-red-500 fill-red-500"
              size={44}
            />

          </motion.div>

          {/* User */}

          <motion.div

            animate={{
              scale:[1,1.15,1]
            }}

            transition={{
              repeat:Infinity,
              duration:1.5
            }}

            className="absolute bottom-32 right-44"

          >

            <Navigation
              className="text-cyan-400"
              size={46}
            />

          </motion.div>

          {/* Hospital 2 */}

          <Hospital
            className="absolute bottom-20 left-44 text-emerald-400"
            size={44}
          />

          {/* Donor */}

          <Heart
            className="absolute right-40 top-28 text-red-500 fill-red-500"
            size={40}
          />

          <Heart
            className="absolute left-60 bottom-44 text-red-500 fill-red-500"
            size={36}
          />

          {/* Lines */}

          <svg className="absolute inset-0 w-full h-full">

            <line
              x1="220"
              y1="120"
              x2="520"
              y2="250"
              stroke="#ef4444"
              strokeDasharray="10"
            />

            <line
              x1="520"
              y1="250"
              x2="760"
              y2="430"
              stroke="#06b6d4"
              strokeDasharray="10"
            />

            <line
              x1="520"
              y1="250"
              x2="260"
              y2="500"
              stroke="#10b981"
              strokeDasharray="10"
            />

          </svg>

          {/* Bottom */}

          <div className="absolute bottom-8 left-8 right-8">

            <div className="rounded-3xl bg-black/40 backdrop-blur-xl border border-white/10 p-8 flex justify-between items-center">

              <div>

                <h3 className="text-3xl font-black">

                  Live Donor Map

                </h3>

                <p className="text-slate-400 mt-2">

                  The platform continuously monitors nearby blood donors.

                </p>

              </div>

              <Link

                to="/search"

                className="px-8 py-4 rounded-2xl
                bg-red-600 hover:bg-red-700
                flex items-center gap-3
                font-bold"

              >

                Open Live Map

                <ArrowRight size={20}/>

              </Link>

            </div>

          </div>

        </motion.div>

      </div>

    </section>
  );
}
