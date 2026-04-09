import { motion } from 'framer-motion'

const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
    },
  },
}

const item = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0 },
}

export default function DashboardStats({ stats = [] }) {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
    >
      {stats.map((stat) => (
        <motion.div
          key={stat.label}
          variants={item}
          whileHover={{ y: -6, scale: 1.015 }}
          className="gradient-border glass-card relative overflow-hidden rounded-[28px] p-5"
        >
          <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-white/10 to-transparent" />
          <div className="relative flex items-start justify-between gap-4">
            <div>
              <p className="text-sm text-slate-400">{stat.label}</p>
              <p className="mt-3 text-3xl font-bold text-white">{stat.value}</p>
              <p className="mt-2 text-xs uppercase tracking-[0.24em] text-slate-500">{stat.caption}</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-xl">
              {stat.icon}
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  )
}
