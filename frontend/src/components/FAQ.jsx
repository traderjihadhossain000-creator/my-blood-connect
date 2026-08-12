import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";

const faqs = [
  {
    question: "How does BloodConnect find nearby donors?",
    answer:
      "BloodConnect uses live GPS location together with blood group filtering to instantly identify the nearest eligible donors.",
  },
  {
    question: "Is my personal information secure?",
    answer:
      "Yes. Passwords are encrypted, JWT authentication protects your account, and only required information is shared.",
  },
  {
    question: "Can hospitals use BloodConnect?",
    answer:
      "Absolutely. Hospitals can publish emergency blood requests and instantly notify nearby donors.",
  },
  {
    question: "How often is my location updated?",
    answer:
      "Your location is updated automatically after login and can also be refreshed while using the platform.",
  },
];

export default function FAQ() {
  const [open, setOpen] = useState(0);

  return (
    <section className="py-28">

      <div className="max-w-5xl mx-auto px-6">

        <div className="text-center mb-16">

          <span className="uppercase tracking-[5px] text-red-400 text-sm font-bold">
            FAQ
          </span>

          <h2 className="text-5xl font-black mt-4">
            Frequently Asked Questions
          </h2>

          <p className="text-slate-400 mt-5">
            Everything you need to know about BloodConnect.
          </p>

        </div>

        <div className="space-y-5">

          {faqs.map((faq, index) => (

            <motion.div
              key={index}
              layout
              className="rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl overflow-hidden"
            >

              <button
                onClick={() => setOpen(open === index ? -1 : index)}
                className="w-full flex justify-between items-center p-7 text-left"
              >

                <h3 className="text-xl font-bold">
                  {faq.question}
                </h3>

                {open === index ? (
                  <Minus className="text-red-500"/>
                ) : (
                  <Plus className="text-red-500"/>
                )}

              </button>

              <AnimatePresence>

                {open === index && (

                  <motion.div
                    initial={{height:0,opacity:0}}
                    animate={{height:"auto",opacity:1}}
                    exit={{height:0,opacity:0}}
                    transition={{duration:.35}}
                  >

                    <p className="px-7 pb-7 text-slate-400 leading-8">

                      {faq.answer}

                    </p>

                  </motion.div>

                )}

              </AnimatePresence>

            </motion.div>

          ))}

        </div>

      </div>

    </section>
  );
}