"use client"

import type React from "react"
import { motion } from "framer-motion"
import { Heart, Activity, Stethoscope } from "lucide-react"

const LoadingScreen: React.FC = () => {
  const icons = [Heart, Activity, Stethoscope]

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 flex items-center justify-center z-50">
      <div className="text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-2xl">
            <span className="text-3xl font-bold text-white">PM</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">PMAi</h1>
          <p className="text-gray-300">Personal Medical Assistant</p>
        </motion.div>

        <div className="flex justify-center space-x-4 mb-8">
          {icons.map((Icon, index) => (
            <motion.div
              key={index}
              animate={{
                y: [0, -10, 0],
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                delay: index * 0.2,
              }}
              className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-sm border border-white/20"
            >
              <Icon className="w-6 h-6 text-purple-400" />
            </motion.div>
          ))}
        </div>

        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full mx-auto"
        />

        <motion.p
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
          className="text-gray-400 mt-4"
        >
          Loading your health dashboard...
        </motion.p>
      </div>
    </div>
  )
}

export default LoadingScreen
