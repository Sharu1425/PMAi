"use client"

import type React from "react"
import { motion } from "framer-motion"
import { TrendingUp, TrendingDown, Minus, type LucideIcon } from "lucide-react"
import GlassCard from "./GlassCard"

interface StatsCardProps {
  title: string
  value: string | number
  change?: number
  trend?: "up" | "down" | "neutral"
  icon: LucideIcon
  color: "green" | "blue" | "purple" | "yellow" | "red"
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, change, trend = "neutral", icon: Icon, color }) => {
  const colors = {
    green: "from-green-500 to-emerald-500",
    blue: "from-blue-500 to-cyan-500",
    purple: "from-purple-500 to-violet-500",
    yellow: "from-yellow-500 to-orange-500",
    red: "from-red-500 to-rose-500",
  }

  const trendIcons = {
    up: TrendingUp,
    down: TrendingDown,
    neutral: Minus,
  }

  const trendColors = {
    up: "text-green-400",
    down: "text-red-400",
    neutral: "text-gray-400",
  }

  const TrendIcon = trendIcons[trend]

  return (
    <GlassCard hover>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-400 text-sm font-medium">{title}</p>
          <motion.p
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-2xl font-bold text-white mt-1"
          >
            {value}
          </motion.p>
          {change !== undefined && (
            <div className={`flex items-center mt-2 text-sm ${trendColors[trend]}`}>
              <TrendIcon className="w-4 h-4 mr-1" />
              <span>{Math.abs(change)}%</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-xl bg-gradient-to-br ${colors[color]} shadow-lg`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </GlassCard>
  )
}

export default StatsCard
