import { motion } from "framer-motion";

export default function StepCard({
  number,
  icon,
  title,
  description,
}) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 50,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      viewport={{ once: true }}
      transition={{
        duration: 0.6,
      }}
      whileHover={{
        y: -10,
        scale: 1.03,
      }}
      className="
        relative
        group
        overflow-hidden
        rounded-3xl
        border
        border-white/10
        bg-white/[0.04]
        backdrop-blur-2xl
        p-8
        transition-all
        duration-500
      "
    >

      {/* Glow */}

      <div
        className="
          absolute
          inset-0
          opacity-0
          group-hover:opacity-100
          transition
          duration-500
          bg-gradient-to-br
          from-red-500/10
          via-transparent
          to-cyan-400/10
        "
      />

      {/* Step Number */}

      <div
        className="
          absolute
          top-5
          right-5
          text-5xl
          font-black
          text-white/5
        "
      >
        {number}
      </div>

      {/* Icon */}

      <motion.div
        whileHover={{
          rotate: 10,
          scale: 1.1,
        }}
        className="
          relative
          w-16
          h-16
          rounded-2xl
          flex
          items-center
          justify-center
          bg-gradient-to-br
          from-red-500
          to-pink-500
          shadow-[0_0_30px_rgba(239,68,68,.45)]
          mb-6
        "
      >
        {icon}
      </motion.div>

      {/* Title */}

      <h3
        className="
          text-2xl
          font-bold
          text-white
          mb-3
        "
      >
        {title}
      </h3>

      {/* Description */}

      <p
        className="
          text-slate-400
          leading-8
        "
      >
        {description}
      </p>

    </motion.div>
  );
}