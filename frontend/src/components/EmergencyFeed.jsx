import { motion } from "framer-motion";
import {
  AlertTriangle,
  MapPin,
  Clock3,
  CheckCircle2,
  Search,
} from "lucide-react";

const alerts = [
  {
    patient: "Rahim Uddin",
    blood: "A+",
    hospital: "Dhaka Medical College",
    time: "1 min ago",
    status: "Searching",
    color: "bg-orange-500",
    icon: Search,
  },
  {
    patient: "Sadia Islam",
    blood: "O-",
    hospital: "Square Hospital",
    time: "3 min ago",
    status: "Donor Found",
    color: "bg-emerald-500",
    icon: CheckCircle2,
  },
  {
    patient: "Mehedi Hasan",
    blood: "B+",
    hospital: "Evercare Hospital",
    time: "6 min ago",
    status: "Searching",
    color: "bg-orange-500",
    icon: Search,
  },
];

export default function EmergencyFeed() {
  return (
    <section className="relative py-24">

      <div className="max-w-7xl mx-auto px-6">

        <div className="text-center mb-16">

          <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 font-semibold">

            <motion.div
              animate={{ scale: [1, 1.5, 1] }}
              transition={{ repeat: Infinity, duration: 1 }}
              className="w-2.5 h-2.5 rounded-full bg-red-500"
            />

            LIVE EMERGENCY BOARD

          </span>

          <h2 className="text-5xl font-black mt-6">
            Active Emergency Requests
          </h2>

          <p className="text-slate-400 mt-5 max-w-2xl mx-auto">
            Live blood requests are continuously synchronized and
            sent to nearby eligible donors.
          </p>

        </div>

        <div className="space-y-7">

          {alerts.map((item, index) => {

            const StatusIcon = item.icon;

            return (

              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * .15 }}
                viewport={{ once: true }}
                whileHover={{
                  y: -5,
                  scale: 1.01,
                }}
                className="relative overflow-hidden
                rounded-3xl
                border border-white/10
                bg-white/5
                backdrop-blur-2xl"
              >

                <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-500" />

                <div className="p-8 flex flex-col lg:flex-row justify-between gap-8">

                  {/* Left */}

                  <div>

                    <div className="flex items-center gap-4">

                      <div className="w-14 h-14 rounded-2xl bg-red-500/10 flex items-center justify-center">

                        <AlertTriangle className="text-red-500" />

                      </div>

                      <div>

                        <h3 className="text-2xl font-bold">

                          {item.patient}

                        </h3>

                        <p className="text-slate-400">

                          Emergency Blood Request

                        </p>

                      </div>

                    </div>

                    <div className="flex flex-wrap gap-6 mt-8">

                      <div className="flex items-center gap-2">

                        <span className="px-4 py-2 rounded-full bg-red-500 text-white font-bold">

                          {item.blood}

                        </span>

                      </div>

                      <div className="flex items-center gap-2 text-slate-300">

                        <MapPin size={18} />

                        {item.hospital}

                      </div>

                      <div className="flex items-center gap-2 text-slate-400">

                        <Clock3 size={18} />

                        {item.time}

                      </div>

                    </div>

                  </div>

                  {/* Right */}

                  <div className="flex items-center">

                    <div
                      className={`flex items-center gap-3 px-6 py-4 rounded-2xl ${item.color}`}
                    >

                      <StatusIcon className="w-5 h-5" />

                      <span className="font-bold">

                        {item.status}

                      </span>

                    </div>

                  </div>

                </div>

              </motion.div>

            );

          })}

        </div>

      </div>

    </section>
  );
}
