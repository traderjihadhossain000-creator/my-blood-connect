import { motion } from "framer-motion";
import {
  Search,
  MapPinned,
  BellRing,
  ShieldCheck,
  HeartHandshake,
  Activity,
  ArrowRight,
} from "lucide-react";

const features = [
  {
    title: "Donor Matching",
    description:
      "Automatically finds the nearest eligible blood donor using blood group and distance.",
    icon: Search,
    color: "from-red-500 to-pink-500",
  },
  {
    title: "Live GPS Tracking",
    description:
      "Real-time donor location updates help patients find the closest available donor instantly.",
    icon: MapPinned,
    color: "from-cyan-500 to-blue-500",
  },
  {
    title: "Emergency Request",
    description:
      "Emergency blood requests are instantly delivered to nearby donors.",
    icon: BellRing,
    color: "from-orange-500 to-red-500",
  },
  {
    title: "Protected Privacy",
    description:
      "JWT authentication and secure encryption keep donor information protected.",
    icon: ShieldCheck,
    color: "from-emerald-500 to-green-500",
  },
  {
    title: "Verified Donors",
    description:
      "Only verified and eligible donors are shown during emergency searches.",
    icon: HeartHandshake,
    color: "from-pink-500 to-rose-500",
  },
  {
    title: "Live Health Status",
    description:
      "Availability and donor activity are continuously synchronized.",
    icon: Activity,
    color: "from-violet-500 to-indigo-500",
  },
];

export default function FeaturesSection() {
  return (
    <section className="relative py-24">

      <div className="max-w-7xl mx-auto px-6">

        <div className="text-center mb-16">

          <span className="text-red-400 uppercase tracking-[5px] text-sm font-bold">
            Platform Features
          </span>

          <h2 className="mt-4 text-5xl font-black">
            Everything Needed During
            <span className="text-red-500"> Blood Emergencies</span>
          </h2>

          <p className="text-slate-400 max-w-3xl mx-auto mt-6">
            Designed with live GPS, emergency requests,
            secure authentication and nearby donor discovery.
          </p>

        </div>

        <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-8">

          {features.map((feature, index) => {

            const Icon = feature.icon;

            return (

              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * .12 }}
                viewport={{ once: true }}
                whileHover={{
                  y: -10,
                  scale: 1.02,
                }}
                className="group relative rounded-[30px]
                border border-white/10
                bg-white/5
                backdrop-blur-2xl
                overflow-hidden"
              >

                <div
                  className={`absolute inset-0 opacity-0 group-hover:opacity-20 transition duration-500 bg-gradient-to-br ${feature.color}`}
                />

                <div className="relative p-8">

                  <div
                    className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color}
                    flex items-center justify-center shadow-lg`}
                  >
                    <Icon className="w-8 h-8 text-white" />
                  </div>

                  <h3 className="mt-8 text-2xl font-bold">
                    {feature.title}
                  </h3>

                  <p className="mt-4 text-slate-400 leading-7">
                    {feature.description}
                  </p>

                  <motion.div
                    whileHover={{ x: 6 }}
                    className="mt-8 flex items-center gap-2 text-red-400 font-semibold cursor-pointer"
                  >
                    Learn More
                    <ArrowRight size={18} />
                  </motion.div>

                </div>

              </motion.div>

            );

          })}

        </div>

      </div>

    </section>
  );
}
