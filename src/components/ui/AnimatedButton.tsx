"use client"

import type React from "react"
import { motion, type HTMLMotionProps } from "framer-motion"
import { cn } from "@/lib/utils"

interface AnimatedButtonProps extends HTMLMotionProps<"button"> {
  variant?: "primary" | "secondary" | "outline" | "ghost"
  size?: "sm" | "md" | "lg"
  isLoading?: boolean
  shimmer?: boolean
  children: React.ReactNode
}

const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  variant = "primary",
  size = "md",
  isLoading = false,
  shimmer = false,
  children,
  className,
  disabled,
  ...props
}) => {
  const baseClasses =
    "relative overflow-hidden font-semibold rounded-xl transition-all duration-300 focus-ring disabled:opacity-50 disabled:cursor-not-allowed"

  const variants = {
    primary: "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white",
    secondary: "bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-white/30",
    outline: "border-2 border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white",
    ghost: "hover:bg-white/10 text-white",
  }

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  }

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(baseClasses, variants[variant], sizes[size], shimmer && "shimmer", className)}
      disabled={disabled || isLoading}
      {...props}
    >
      {shimmer && (
        <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
      )}

      <span className="relative flex items-center justify-center">
        {isLoading && <div className="loading-spinner mr-2" />}
        {children}
      </span>
    </motion.button>
  )
}

export default AnimatedButton
