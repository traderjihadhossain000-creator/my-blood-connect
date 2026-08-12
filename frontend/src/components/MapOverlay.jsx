import { motion } from "framer-motion";
import {
  Wifi,
  ShieldCheck,
  Heart,
  Navigation,
  Activity,
} from "lucide-react";

export default function MapOverlay({
  activeDonor,
  onlineCount,
}) {
  return (
    <>
      {/* Header */}

      <div className="absolute top-5 left-5 right-5 z-40 flex justify-between items-center">

        <div className="rounded-2xl border border-white/10 bg-slate-900/70 backdrop-blur-xl px-4 py-3">

          <p className="text-[10px] tracking-[3px] text-red-400 uppercase font-bold">
            DONOR COMMAND CENTER
          </p>

          <h2 className="text-white font-black text-xl mt-1">
            Blood Network
          </h2>

        </div>

        <motion.div
          animate={{
            opacity: [1, .4, 1],
          }}
          transition={{
            repeat: Infinity,
            duration: 1.5,
          }}
          className="flex items-center gap-2 rounded-full bg-emerald-500/10 border border-emerald-400/20 px-4 py-2"
        >

          <div className="w-2 h-2 rounded-full bg-emerald-400" />

          <span className="text-emerald-300 text-xs font-semibold">
            SYSTEM ONLINE
          </span>

        </motion.div>

      </div>

      {/* Left Status */}

      <div className="absolute left-5 top-28 z-40 space-y-3">

        <StatusCard
          icon={<Wifi size={16} />}
          title="NETWORK"
          value="99%"
          color="cyan"
        />

        <StatusCard
          icon={<Navigation size={16} />}
          title="GPS"
          value="LOCKED"
          color="emerald"
        />

        <StatusCard
          icon={<ShieldCheck size={16} />}
          title="SECURITY"
          value="ACTIVE"
          color="violet"
        />

      </div>

      {/* Bottom Panel */}

      <div className="absolute bottom-5 left-5 right-5 z-40">

        <div className="grid grid-cols-2 gap-4">

          <GlassCard>

            <Activity className="text-emerald-400 mb-2" />

            <h2 className="text-3xl font-black text-white">
              {onlineCount}
            </h2>

            <p className="text-slate-400 text-sm">
              Online Donors
            </p>

          </GlassCard>

          <GlassCard>

            <Navigation className="text-cyan-400 mb-2" />

            <h2 className="text-3xl font-black text-white">
              {activeDonor?.distance} km
            </h2>

            <p className="text-slate-400 text-sm">
              Nearest Match
            </p>

          </GlassCard>

        </div>

        <div className="mt-4 rounded-2xl bg-red-500/10 border border-red-500/20 p-4 flex justify-between items-center backdrop-blur-xl">

          <div>

            <p className="text-red-300 text-sm">
              Matching Accuracy
            </p>

            <h2 className="text-4xl font-black text-red-500">
              98.7%
            </h2>

          </div>

          <motion.div
            animate={{
              scale: [1, 1.15, 1],
            }}
            transition={{
              repeat: Infinity,
              duration: 1.5,
            }}
          >

            <Heart
              size={44}
              className="fill-red-500 text-red-500"
            />

          </motion.div>

        </div>

      </div>
    </>
  );
}

function GlassCard({ children }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-900/70 backdrop-blur-xl p-4">
      {children}
    </div>
  );
}

function StatusCard({
  icon,
  title,
  value,
  color,
}) {
  const colors = {
    cyan: "text-cyan-400",
    emerald: "text-emerald-400",
    violet: "text-violet-400",
  };

  return (
    <div className="w-36 rounded-xl border border-white/10 bg-slate-900/70 backdrop-blur-xl px-3 py-2">

      <div className={`mb-2 ${colors[color]}`}>
        {icon}
      </div>

      <p className="text-[10px] tracking-[2px] text-slate-500">
        {title}
      </p>

      <h3 className="text-sm font-bold text-white">
        {value}
      </h3>

    </div>
  );
}
