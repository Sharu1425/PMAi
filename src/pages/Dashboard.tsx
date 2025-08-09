"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import {
  FaUtensils,
  FaPills,
  FaUser,
  FaChartLine,
  FaClock,
  FaPlus,
} from "react-icons/fa"
import { Stethoscope, Heart, Calendar, Pill } from "lucide-react"
import GlassCard from "@/components/ui/GlassCard"
import StatsCard from "@/components/ui/StatsCard"
import AnimatedButton from "@/components/ui/AnimatedButton"

const Dashboard: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const quickActions = [
    {
      title: "Analyze Symptoms",
      description: "Get AI-powered insights about your symptoms",
      icon: Stethoscope,
      path: "/symptoms",
      color: "from-blue-500 to-cyan-500",
    },
    {
      title: "Diet Recommendations",
      description: "Get personalized nutrition advice",
      icon: FaUtensils,
      path: "/diet",
      color: "from-green-500 to-emerald-500",
    },
    {
      title: "Medication Reminders",
      description: "Manage your medication schedule",
      icon: FaPills,
      path: "/reminders",
      color: "from-purple-500 to-violet-500",
    },
    {
      title: "Update Profile",
      description: "Keep your health information current",
      icon: FaUser,
      path: "/profile",
      color: "from-orange-500 to-red-500",
    },
  ]

  const recentActivity = [
    { action: "Symptom Analysis", time: "2 hours ago", status: "completed" },
    { action: "Diet Plan Updated", time: "1 day ago", status: "completed" },
    { action: "Medication Reminder", time: "3 days ago", status: "pending" },
    { action: "Profile Updated", time: "1 week ago", status: "completed" },
  ]

  const upcomingReminders = [
    { medication: "Vitamin D", time: "2:00 PM", dosage: "1000 IU" },
    { medication: "Omega-3", time: "6:00 PM", dosage: "500mg" },
    { medication: "Multivitamin", time: "8:00 AM", dosage: "1 tablet" },
  ]

  return (
    <div className="min-h-screen pt-20 pb-10 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Welcome back! 👋</h1>
              <p className="text-gray-300 text-lg">
                {currentTime.toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <div className="text-right">
                <div className="text-2xl font-bold text-white">
                  {currentTime.toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
                <div className="text-gray-400 text-sm">Current Time</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <StatsCard title="Health Score" value="85%" change={5} trend="up" icon={Heart} color="green" />
          <StatsCard title="Consultations" value="12" change={2} trend="up" icon={Stethoscope} color="blue" />
          <StatsCard title="Medications" value="3" change={0} trend="neutral" icon={Pill} color="purple" />
          <StatsCard title="Days Active" value="28" change={12} trend="up" icon={Calendar} color="yellow" />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <GlassCard>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Quick Actions</h2>
                <FaPlus className="w-5 h-5 text-gray-400" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {quickActions.map((action, index) => {
                  const Icon = action.icon
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                    >
                      <Link to={action.path}>
                        <GlassCard hover className="h-full">
                          <div className="flex items-start space-x-4">
                            <div className={`p-3 rounded-xl bg-gradient-to-br ${action.color} shadow-lg`}>
                              <Icon className="w-6 h-6 text-white" />
                            </div>
                            <div className="flex-1">
                              <h3 className="text-lg font-semibold text-white mb-2">{action.title}</h3>
                              <p className="text-gray-300 text-sm">{action.description}</p>
                            </div>
                          </div>
                        </GlassCard>
                      </Link>
                    </motion.div>
                  )
                })}
              </div>
            </GlassCard>
          </motion.div>

          {/* Upcoming Reminders */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <GlassCard>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">Today's Reminders</h2>
                <FaClock className="w-5 h-5 text-gray-400" />
              </div>

              <div className="space-y-4">
                {upcomingReminders.map((reminder, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                    className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10"
                  >
                    <div>
                      <div className="text-white font-medium">{reminder.medication}</div>
                      <div className="text-gray-400 text-sm">{reminder.dosage}</div>
                    </div>
                    <div className="text-purple-400 font-medium">{reminder.time}</div>
                  </motion.div>
                ))}
              </div>

              <Link to="/reminders" className="block mt-4">
                <AnimatedButton variant="outline" className="w-full">
                  View All Reminders
                </AnimatedButton>
              </Link>
            </GlassCard>
          </motion.div>
        </div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-8"
        >
          <GlassCard>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Recent Activity</h2>
              <FaChartLine className="w-5 h-5 text-gray-400" />
            </div>

            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                  className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10"
                >
                  <div className="flex items-center space-x-4">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        activity.status === "completed" ? "bg-green-400" : "bg-yellow-400"
                      }`}
                    />
                    <div>
                      <div className="text-white font-medium">{activity.action}</div>
                      <div className="text-gray-400 text-sm">{activity.time}</div>
                    </div>
                  </div>
                  <div
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      activity.status === "completed"
                        ? "bg-green-500/20 text-green-400"
                        : "bg-yellow-500/20 text-yellow-400"
                    }`}
                  >
                    {activity.status}
                  </div>
                </motion.div>
              ))}
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  )
}

export default Dashboard
