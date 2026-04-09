import { motion } from 'framer-motion'

const variants = {
  primary:
    'gradient-shimmer bg-gradient-to-r from-[#FF5A09] via-[#EC7F37] to-[#BE4F0C] text-white shadow-[0_0_20px_rgba(255,90,9,0.4)] hover:shadow-[0_10px_30px_rgba(236,127,55,0.3)]',
  secondary:
    'border border-white/12 bg-white/5 text-slate-100 hover:bg-white/10 hover:shadow-[0_0_18px_rgba(255,90,9,0.18)]',
  ghost:
    'bg-transparent text-slate-300 hover:bg-white/5 hover:text-white',
}

export default function Button({
  children,
  variant = 'primary',
  className = '',
  disabled = false,
  ...props
}) {
  return (
    <motion.button
      whileHover={disabled ? undefined : { scale: 1.02, y: -1 }}
      whileTap={disabled ? undefined : { scale: 0.95 }}
      transition={{ duration: 0.18, ease: 'easeOut' }}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold transition duration-200 disabled:cursor-not-allowed disabled:opacity-60 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  )
}
