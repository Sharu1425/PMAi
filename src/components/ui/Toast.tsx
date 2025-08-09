"use client"

import { cn } from "@/lib/utils"

import type React from "react"
import { useEffect } from "react"
import { motion } from "framer-motion"
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from "lucide-react"
import type { Toast as ToastType } from "@/types"

interface ToastProps extends ToastType {
  onClose: (id: string) => void
}

const Toast: React.FC<ToastProps> = ({ id, type, title, message, duration = 4000, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id)
    }, duration)

    return () => clearTimeout(timer)
  }, [id, duration, onClose])

  const icons = {
    success: CheckCircle,
    error: AlertCircle,
    warning: AlertTriangle,
    info: Info,
  }

  const colors = {
    success: "from-green-500/20 to-emerald-500/20 border-green-500/30 text-green-100",
    error: "from-red-500/20 to-rose-500/20 border-red-500/30 text-red-100",
    warning: "from-yellow-500/20 to-orange-500/20 border-yellow-500/30 text-yellow-100",
    info: "from-blue-500/20 to-cyan-500/20 border-blue-500/30 text-blue-100",
  }

  const iconColors = {
    success: "text-green-400",
    error: "text-red-400",
    warning: "text-yellow-400",
    info: "text-blue-400",
  }

  const Icon = icons[type]

  return (
    <motion.div
      initial={{ opacity: 0, y: -50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -50, scale: 0.9 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className={cn("glass-card max-w-sm w-full bg-gradient-to-r border shadow-2xl", colors[type])}
    >
      <div className="flex items-start space-x-3">
        <Icon className={cn("w-6 h-6 mt-0.5 flex-shrink-0", iconColors[type])} />
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-sm">{title}</h4>
          {message && <p className="mt-1 text-sm opacity-90">{message}</p>}
        </div>
        <button
          onClick={() => onClose(id)}
          className="flex-shrink-0 ml-4 opacity-70 hover:opacity-100 transition-opacity"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Progress bar */}
      <motion.div
        className="mt-3 h-1 bg-current opacity-30 rounded-full overflow-hidden"
        initial={{ width: "100%" }}
        animate={{ width: "0%" }}
        transition={{ duration: duration / 1000, ease: "linear" }}
      />
    </motion.div>
  )
}

export default Toast
