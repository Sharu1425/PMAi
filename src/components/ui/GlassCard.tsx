"use client"

import type React from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface GlassCardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
  glow?: boolean
  onClick?: () => void
}

const GlassCard: React.FC<GlassCardProps> = ({ children, className, hover = false, glow = false, onClick }) => {
  return (
    <motion.div
      whileHover={hover ? { y: -2, scale: 1.02 } : undefined}
      whileTap={onClick ? { scale: 0.98 } : undefined}
      className={cn("glass-card p-6", hover && "glass-card-hover cursor-pointer", glow && "glow-purple", className)}
      onClick={onClick}
    >
      {children}
    </motion.div>
  )
}

export default GlassCard
