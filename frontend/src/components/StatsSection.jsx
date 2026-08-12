import GlowCard from "./GlowCard";
import AnimatedCounter from "./AnimatedCounter";
import { motion } from "framer-motion";
import {
  Users,
  HeartPulse,
  Building2,
  Clock3,
} from "lucide-react";

const stats = [
  {
    icon: Users,
    value: 5000,
    suffix: "+",
    title: "Registered Donors",
    iconBg: "bg-red-500/10",
    iconColor: "text-red-500",
    border: "hover:border-red-500/40",
    number: "text-red-500",
  },
  {
    icon: HeartPulse,
    value: 1200,
    suffix: "+",
    title: "Lives Saved",
    iconBg: "bg-emerald-500/10",
    iconColor: "text-emerald-400",
    border: "hover:border-emerald-500/40",
    number: "text-emerald-400",
  },
  {
    icon: Building2,
    value: 64,
    suffix: "+",
    title: "Partner Hospitals",
    iconBg: "bg-cyan-500/10",
    iconColor: "text-cyan-400",
    border: "hover:border-cyan-500/40",
    number: "text-cyan-400",
  },
  {
    icon: Clock3,
    value: 24,
    suffix: "/7",
    title: "Emergency Support",
    iconBg: "bg-amber-500/10",
    iconColor: "text-amber-400",
    border: "hover:border-amber-500/40",
    number: "text-amber-400",
  },
];

export default function StatsSection() {
  return (
    <section className="relative py-24 overflow-hidden">

      <div className="absolute inset-0 pointer-events-none">

        <div className="absolute left-1/2 top-0 -translate-x-1/2 w-[700px] h-[700px] rounded-full bg-red-500/10 blur-[180px]" />

      </div>

      <div className="relative max-w-7xl mx-auto px-6">

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: .8 }}
          className="text-center mb-16"
        >

          <span className="uppercase tracking-[6px] text-red-400 font-bold text-sm">
            LIVE STATISTICS
          </span>

          <h2 className="mt-5 text-5xl lg:text-6xl font-black text-white">
            BloodConnect
            <span className="text-red-500">
              {" "}In Numbers
            </span>
          </h2>

          <p className="text-slate-400 mt-6 max-w-2xl mx-auto">
            Thousands of successful donations are happening every day.
          </p>

        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((item, index) => {

  const Icon = item.icon;

  return (

    <GlowCard
      key={index}
      className="rounded-3xl"
    >

      <motion.div

        initial={{
          opacity: 0,
          y: 60,
          scale: .95,
        }}

        whileInView={{
          opacity: 1,
          y: 0,
          scale: 1,
        }}

        viewport={{
          once: true,
          amount: .4,
        }}

        transition={{
          duration: .6,
          delay: index * .15,
        }}

        whileHover={{
          y: -10,
          scale: 1.03,
        }}

        className={`relative
        h-full
        rounded-3xl
        border
        border-white/10
        bg-white/5
        backdrop-blur-xl
        p-8
        text-center
        transition-all
        duration-500
        ${item.border}`}

      >

        <motion.div

          initial={{
            scale: 0,
            rotate: -180,
          }}

          whileInView={{
            scale: 1,
            rotate: 0,
          }}

          viewport={{
            once: true,
          }}

          transition={{
            delay: .2 + index * .1,
            duration: .6,
            type: "spring",
          }}

          className={`w-16
          h-16
          mx-auto
          rounded-2xl
          flex
          items-center
          justify-center
          mb-6
          ${item.iconBg}`}

        >

          <Icon
            className={`${item.iconColor}`}
            size={32}
          />

        </motion.div>

        <motion.h3

          initial={{
            opacity: 0,
            scale: .5,
          }}

          whileInView={{
            opacity: 1,
            scale: 1,
          }}

          viewport={{
            once: true,
          }}

          transition={{
            delay: .4 + index * .1,
          }}

          className={`text-5xl font-black ${item.number}`}

        >

          <AnimatedCounter
            end={item.value}
            suffix={item.suffix}
          />

        </motion.h3>

        <p className="mt-4 text-slate-400 uppercase tracking-wider text-sm">

          {item.title}

        </p>
              </motion.div>

    </GlowCard>

  );

})}

        </div>

      </div>

    </section>
  );
}