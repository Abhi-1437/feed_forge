import { motion } from 'framer-motion'

const particles = Array.from({ length: 22 }, (_, index) => ({
  id: index,
  size: index % 3 === 0 ? 4 : 2,
  left: `${(index * 13) % 100}%`,
  top: `${(index * 17) % 100}%`,
  duration: 10 + (index % 5) * 2,
  delay: (index % 7) * 0.7,
}))

export default function AnimatedBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(68,68,68,0.78),rgba(57,57,57,1))]" />
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(57,57,57,0.92),rgba(47,47,47,0.72),rgba(57,57,57,0.96))]" />
      <motion.div
        className="absolute left-[-12%] top-[-18%] h-[52rem] w-[52rem] rounded-full opacity-55 blur-3xl"
        animate={{
          x: [0, 50, -20, 0],
          y: [0, 30, -10, 0],
          scale: [1, 1.12, 0.96, 1],
        }}
        transition={{ duration: 26, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          background:
            'radial-gradient(circle at 30% 30%, rgba(255,90,9,0.32), rgba(236,127,55,0.22) 45%, rgba(190,79,12,0.12) 72%, transparent 100%)',
        }}
      />
      <motion.div
        className="absolute bottom-[-20%] right-[-10%] h-[44rem] w-[44rem] rounded-full opacity-50 blur-3xl"
        animate={{
          x: [0, -30, 25, 0],
          y: [0, -15, 20, 0],
          scale: [1, 0.94, 1.06, 1],
        }}
        transition={{ duration: 24, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          background:
            'radial-gradient(circle at 40% 40%, rgba(236,127,55,0.24), rgba(255,90,9,0.18) 42%, rgba(190,79,12,0.12) 68%, transparent 100%)',
        }}
      />
      <motion.div
        className="absolute inset-0 opacity-55"
        animate={{
          backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
        }}
        transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
        style={{
          backgroundImage:
            'radial-gradient(circle at 18% 22%, rgba(255,90,9,0.2), transparent 22%), radial-gradient(circle at 82% 18%, rgba(236,127,55,0.18), transparent 24%), radial-gradient(circle at 52% 82%, rgba(190,79,12,0.14), transparent 24%), radial-gradient(circle at 72% 64%, rgba(255,90,9,0.1), transparent 18%)',
        }}
      />
      <div className="absolute inset-0 surface-grid opacity-[0.14]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_35%,rgba(0,0,0,0.18)_100%)]" />

      {particles.map((particle) => (
        <motion.span
          key={particle.id}
          className="absolute rounded-full bg-white/20"
          style={{
            width: particle.size,
            height: particle.size,
            left: particle.left,
            top: particle.top,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.05, 0.28, 0.05],
            scale: [1, 1.8, 1],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  )
}
