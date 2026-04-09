import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

export default function AuthCard({
  badge,
  title,
  description,
  footerPrompt,
  footerLink,
  footerLabel,
  children,
}) {
  return (
    <motion.section
      initial={{ opacity: 0, scale: 0.96, y: 18 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="gradient-border glass-card relative w-full max-w-md overflow-hidden rounded-[32px] p-8 shadow-glow sm:p-10"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-white/10 to-transparent" />
      <div className="relative">
        <div className="mb-8 space-y-4">
          <span className="inline-flex rounded-full border border-orange-400/20 bg-orange-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-orange-200">
            {badge}
          </span>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">{title}</h1>
            <p className="text-sm leading-7 text-slate-400">{description}</p>
          </div>
        </div>

        {children}

        <p className="mt-8 text-center text-sm text-slate-400">
          {footerPrompt}{' '}
          <Link to={footerLink} className="font-semibold text-white transition hover:text-orange-200">
            {footerLabel}
          </Link>
        </p>
      </div>
    </motion.section>
  )
}
