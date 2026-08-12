import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Rahim Uddin",
    role: "Blood Recipient",
    review:
      "BloodConnect helped me find an O- donor within minutes. It literally saved my father's life.",
  },
  {
    name: "Nusrat Jahan",
    role: "Regular Donor",
    review:
      "The live location system makes donating blood much easier. I receive nearby emergency alerts instantly.",
  },
  {
    name: "Dr. Hasan Ahmed",
    role: "Emergency Physician",
    review:
      "This platform has the potential to significantly reduce emergency response time for critical patients.",
  },
];

export default function Testimonials() {
  return (
    <section className="relative py-28 overflow-hidden">

      <div className="max-w-7xl mx-auto px-6">

        <div className="text-center mb-16">

          <span className="uppercase tracking-[5px] text-red-400 text-sm font-bold">
            Success Stories
          </span>

          <h2 className="text-5xl font-black mt-4">
            Trusted By
            <span className="text-red-500"> Donors & Patients</span>
          </h2>

          <p className="text-slate-400 mt-5 max-w-2xl mx-auto">
            Thousands of lives have already been impacted through our
            intelligent emergency blood donation platform.
          </p>

        </div>

        <div className="grid lg:grid-cols-3 gap-8">

          {testimonials.map((item, index) => (

            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * .2 }}
              viewport={{ once: true }}
              whileHover={{
                y: -10,
                scale: 1.03,
              }}
              className="relative rounded-[32px]
              border border-white/10
              bg-white/5
              backdrop-blur-2xl
              p-8 overflow-hidden"
            >

              <Quote
                className="absolute top-8 right-8 text-red-500/20"
                size={70}
              />

              <div className="flex gap-1 text-yellow-400 mb-6">
                <Star fill="currentColor" size={18}/>
                <Star fill="currentColor" size={18}/>
                <Star fill="currentColor" size={18}/>
                <Star fill="currentColor" size={18}/>
                <Star fill="currentColor" size={18}/>
              </div>

              <p className="text-slate-300 leading-8">
                "{item.review}"
              </p>

              <div className="mt-10">

                <h3 className="font-bold text-xl">

                  {item.name}

                </h3>

                <p className="text-red-400">

                  {item.role}

                </p>

              </div>

            </motion.div>

          ))}

        </div>

      </div>

    </section>
  );
}