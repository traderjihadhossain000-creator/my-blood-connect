import { motion } from "framer-motion";
import {
  Building2,
  Hospital,
  HeartHandshake,
  Cross,
  ShieldPlus,
  Stethoscope,
} from "lucide-react";

const partners = [
  { name: "Square Hospital", icon: Hospital },
  { name: "Evercare Hospital", icon: Building2 },
  { name: "United Hospital", icon: Stethoscope },
  { name: "Dhaka Medical", icon: Cross },
  { name: "BSMMU", icon: ShieldPlus },
  { name: "Bangladesh Red Crescent", icon: HeartHandshake },
];

export default function TrustedLogos() {
  return (
    <section className="relative py-24 overflow-hidden">

      <div className="max-w-7xl mx-auto px-6">

        <div className="text-center mb-14">

          <span className="inline-block px-5 py-2 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 font-semibold tracking-wider uppercase text-sm">

            Trusted Healthcare Network

          </span>

          <h2 className="mt-6 text-5xl font-black">

            Connected With

            <span className="text-red-500"> Leading Healthcare</span>

          </h2>

          <p className="text-slate-400 mt-5 max-w-2xl mx-auto">

            Designed to integrate with hospitals, emergency services and blood
            donation organizations for faster response during critical situations.

          </p>

        </div>

        <div className="relative overflow-hidden">

          <motion.div
            animate={{
              x: ["0%", "-50%"],
            }}
            transition={{
              duration: 18,
              repeat: Infinity,
              ease: "linear",
            }}
            className="flex gap-7 w-max"
          >

            {[...partners, ...partners].map((partner, index) => {

              const Icon = partner.icon;

              return (

                <div
                  key={index}
                  className="w-72 h-32 rounded-3xl
                  bg-white/5
                  backdrop-blur-2xl
                  border border-white/10
                  hover:border-red-500/40
                  hover:-translate-y-2
                  transition-all duration-500
                  flex flex-col
                  items-center
                  justify-center"
                >

                  <div className="w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center mb-4">

                    <Icon className="w-8 h-8 text-red-500"/>

                  </div>

                  <h3 className="font-bold text-lg">

                    {partner.name}

                  </h3>

                </div>

              );

            })}

          </motion.div>

        </div>

      </div>

    </section>
  );
}