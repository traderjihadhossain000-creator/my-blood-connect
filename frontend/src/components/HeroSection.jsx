import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  MapPinned,
  HeartPulse
} from "lucide-react";

import HeroCommandCenter from "./HeroCommandCenter";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden">

      <div className="max-w-7xl mx-auto px-6 pt-24 pb-20">

        <div className="grid lg:grid-cols-2 gap-20 items-center">

          {/* LEFT */}

          <motion.div
            initial={{ opacity: 0, x: -60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: .8 }}
          >

            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 font-semibold mb-8">

              <Sparkles className="w-4 h-4"/>

              Emergency Blood Donation Platform

            </div>

            <h1 className="text-5xl md:text-7xl font-black leading-tight">

              Save Lives

              <br/>

              <span className="bg-gradient-to-r from-red-500 via-rose-500 to-orange-400 bg-clip-text text-transparent">

                Faster Than Ever

              </span>

            </h1>

            <p className="mt-8 text-slate-400 text-lg leading-8 max-w-xl">

              Instantly connect patients with nearby eligible blood donors
              using blood-group matching, real-time GPS tracking and emergency alerts.

            </p>

            <div className="flex flex-wrap gap-5 mt-10">

              <Link
                to="/search"
                className="group px-8 py-4 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 font-bold flex items-center gap-3 hover:scale-105 transition"
              >

                Find Donors

                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition"/>

              </Link>

              <Link
                to="/requests"
                className="px-8 py-4 rounded-2xl border border-slate-700 bg-slate-900 hover:border-red-500 transition"
              >

                Emergency Board

              </Link>

            </div>

            {/* MINI FEATURES */}

            <div className="grid grid-cols-3 gap-5 mt-14">

              <div className="rounded-2xl bg-white/5 border border-white/10 p-5">

                <ShieldCheck className="text-emerald-400 mb-3"/>

                <h3 className="font-bold">

                  Secure

                </h3>

                <p className="text-slate-400 text-sm mt-2">

                  JWT Protected

                </p>

              </div>

              <div className="rounded-2xl bg-white/5 border border-white/10 p-5">

                <MapPinned className="text-cyan-400 mb-3"/>

                <h3 className="font-bold">

                  Live GPS

                </h3>

                <p className="text-slate-400 text-sm mt-2">

                  Auto Location

                </p>

              </div>

              <div className="rounded-2xl bg-white/5 border border-white/10 p-5">

                <HeartPulse className="text-red-500 mb-3"/>

                <h3 className="font-bold">

                  Donor Match

                </h3>

                <p className="text-slate-400 text-sm mt-2">

                  Smart Search

                </p>

              </div>

            </div>

          </motion.div>

          {/* RIGHT */}

          <motion.div
            initial={{ opacity:0, x:60 }}
            animate={{ opacity:1, x:0 }}
            transition={{ duration:.8, delay:.3 }}
            className="flex justify-center"
          >

            <HeroCommandCenter/>

          </motion.div>

        </div>

      </div>

    </section>
  );
}
