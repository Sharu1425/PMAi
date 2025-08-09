"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { FaCheck, FaExclamationTriangle, FaInfo, FaTimes } from "react-icons/fa"

interface NotificationToastProps {
  id: string
  type: "success" | "error" | "warning" | "info"
  title: string
  message: string
  duration?: number
  onClose: (id: string) => void
}

const NotificationToast: React.FC<NotificationToastProps> = ({
  id,
  type,
  title,
  message,
  duration = 5000,
  onClose,
}) => {
  const [progress, setProgress] = useState(100)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev - 100 / (duration / 100)
        if (newProgress <= 0) {
          onClose(id)
          return 0
        }
        return newProgress
      })
    }, 100)

    return () => clearInterval(interval)
  }, [duration, id, onClose])

  const icons = {
    success: FaCheck,
    error: FaTimes,
    warning: FaExclamationTriangle,
    info: FaInfo,
  }

  const colors = {
    success: "from-green-500 to-green-600 border-green-500/30",
    error: "from-red-500 to-red-600 border-red-500/30",
    warning: "from-yellow-500 to-yellow-600 border-yellow-500/30",
    info: "from-blue-500 to-blue-600 border-blue-500/30",
  }

  const progressColors = {
    success: "bg-green-400",
    error: "bg-red-400",
    warning: "bg-yellow-400",
    info: "bg-blue-400",
  }

  const Icon = icons[type]

  return (
    <motion.div
      initial={{ opacity: 0, x: 300, scale: 0.8 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 300, scale: 0.8 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`relative backdrop-blur-xl bg-white/10 border rounded-xl shadow-2xl overflow-hidden ${colors[type]}`}
    >
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div
            className={`p-2 rounded-lg bg-gradient-to-br ${colors[type].split(" ")[0]} ${colors[type].split(" ")[1]} shadow-lg`}
          >
            <Icon className="w-4 h-4 text-white" />
          </div>

          <div className="flex-1 min-w-0">
            <h4 className="text-white font-semibold text-sm">{title}</h4>
            <p className="text-gray-300 text-xs mt-1">{message}</p>
          </div>

          <button onClick={() => onClose(id)} className="text-gray-400 hover:text-white transition-colors p-1">
            <FaTimes className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-white/10">
        <motion.div
          className={`h-full ${progressColors[type]}`}
          initial={{ width: "100%" }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.1, ease: "linear" }}
        />
      </div>
    </motion.div>
  )
}

export default NotificationToast
