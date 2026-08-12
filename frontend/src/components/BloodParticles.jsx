import { motion } from 'framer-motion';

const particles = Array.from({ length: 18 }, (_, index) => ({
  id: index,
  size: 8 + ((index * 7) % 12),
  left: (index * 37) % 100,
  duration: 10 + ((index * 11) % 8),
  delay: (index * 13) % 5,
}));

export default function BloodParticles() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {particles.map(({ id, size, left, duration, delay }) => (
        <motion.div
          key={id}
          initial={{ y: '110vh', opacity: 0, x: `${left}vw`, scale: 0.8 }}
          animate={{ y: '-10vh', opacity: [0, 0.4, 0.2, 0], scale: [0.8, 1.1, 1] }}
          transition={{ repeat: Infinity, duration, delay, ease: 'linear' }}
          className="absolute rounded-full bg-red-500/25 blur-sm"
          style={{ width: size, height: size }}
        />
      ))}
    </div>
  );
}
