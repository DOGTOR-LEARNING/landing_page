'use client'

import { motion } from 'framer-motion'
import {
  BarChart3,
  BookOpen,
  XCircle,
  Lightbulb,
  Target,
  Bot,
  MessageCircle,
  Smartphone,
  PartyPopper,
  BatteryCharging,
  Database,
  FileEdit,
  ShieldCheck,
  LineChart,
  Sparkles,
  Camera,
} from 'lucide-react'

const iconMap = {
  BarChart3,
  BookOpen,
  XCircle,
  Lightbulb,
  Target,
  Bot,
  MessageCircle,
  Smartphone,
  PartyPopper,
  BatteryCharging,
  Database,
  FileEdit,
  ShieldCheck,
  LineChart,
  Sparkles,
  Camera,
}

/**
 * AnimatedIcon — drop-in replacement for native emoji
 *
 * variants:
 *   "entrance"  — spring scale-in (for inline section title icons)
 *   "float"     — slide-up entrance + spring hover scale+rotate (for feature cards)
 *   "bounce"    — spring drop-in with overshoot (for success screens)
 *   "shake"     — looping phone-ring shake (for error/warning screens)
 */
import './animated-icons.css'

export default function AnimatedIcon({
  name,
  size = 20,
  color = 'currentColor',
  strokeWidth = 1.8,
  variant = 'entrance',
  delay = 0,
  className = '',
}) {
  const Icon = iconMap[name]
  if (!Icon) return null

  if (variant === 'entrance') {
    return (
      <motion.span
        className={className}
        initial={{ opacity: 0, scale: 0.4 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 420, damping: 18, delay }}
        style={{ display: 'inline-flex', alignItems: 'center', flexShrink: 0 }}
      >
        <Icon size={size} color={color} strokeWidth={strokeWidth} />
      </motion.span>
    )
  }

  if (variant === 'float') {
    return (
      <motion.div
        className={`icon-auto-float ${className}`.trim()}
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 22, delay }}
        whileHover={{
          scale: 1.22,
          rotate: 8,
          transition: { type: 'spring', stiffness: 420, damping: 10 },
        }}
        style={{ display: 'inline-flex', alignItems: 'center' }}
      >
        <Icon size={size} color={color} strokeWidth={strokeWidth} />
      </motion.div>
    )
  }

  if (variant === 'bounce') {
    return (
      <motion.div
        className={`icon-auto-bounce ${className}`.trim()}
        initial={{ scale: 0, rotate: -25 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 11, delay }}
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <Icon size={size} color={color} strokeWidth={strokeWidth} />
      </motion.div>
    )
  }

  if (variant === 'shake') {
    return (
      <motion.div
        className={className}
        animate={{ rotate: [0, -12, 12, -12, 12, 0] }}
        transition={{
          duration: 1.4,
          ease: 'easeInOut',
          repeat: Infinity,
          repeatDelay: 2.5,
        }}
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <Icon size={size} color={color} strokeWidth={strokeWidth} />
      </motion.div>
    )
  }

  return (
    <span className={className} style={{ display: 'inline-flex', alignItems: 'center' }}>
      <Icon size={size} color={color} strokeWidth={strokeWidth} />
    </span>
  )
}
