"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { FaEdit, FaTrash, FaCheck, FaTimes, FaPlus } from "react-icons/fa"
import {
  Pill,
  Clock,
  Calendar,
  Bell,
  CheckCircle,
  Timer,
  Activity,
  Heart,
  Zap,
} from "lucide-react"
import GlassCard from "@/components/ui/GlassCard"
import AnimatedButton from "@/components/ui/AnimatedButton"
import { useToast } from "@/hooks/useToast"

interface MedsReminderProps {
  user: any
}

interface Medication {
  id: number
  name: string
  dosage: string
  frequency: string
  time: string
  startDate: string
  endDate: string
  instructions?: string
  reminders: boolean
  taken: boolean
  category?: string
  color?: string
}

interface NewMedication {
  name: string
  dosage: string
  frequency: string
  time: string
  startDate: string
  endDate: string
  instructions: string
  reminders: boolean
  category: string
}

const MedsReminder: React.FC<MedsReminderProps> = ({ user: _user }) => {
  const [medications, setMedications] = useState<Medication[]>([
    {
      id: 1,
      name: "Vitamin D",
      dosage: "1000 IU",
      frequency: "Once daily",
      time: "08:00",
      startDate: "2024-01-01",
      endDate: "2024-12-31",
      reminders: true,
      taken: false,
      category: "Vitamin",
      color: "from-yellow-500 to-orange-500",
    },
    {
      id: 2,
      name: "Omega-3",
      dosage: "500mg",
      frequency: "Twice daily",
      time: "08:00,20:00",
      startDate: "2024-01-01",
      endDate: "2024-06-30",
      reminders: true,
      taken: true,
      category: "Supplement",
      color: "from-blue-500 to-cyan-500",
    },
    {
      id: 3,
      name: "Metformin",
      dosage: "500mg",
      frequency: "Twice daily",
      time: "07:00,19:00",
      startDate: "2024-01-01",
      endDate: "2024-12-31",
      reminders: true,
      taken: false,
      category: "Prescription",
      color: "from-purple-500 to-violet-500",
    },
  ])

  const [showAddForm, setShowAddForm] = useState(false)
  
  const [newMedication, setNewMedication] = useState<NewMedication>({
    name: "",
    dosage: "",
    frequency: "",
    time: "",
    startDate: "",
    endDate: "",
    instructions: "",
    reminders: true,
    category: "",
  })
  const [currentTime, setCurrentTime] = useState(new Date())
  const [activeTab, setActiveTab] = useState<"today" | "all" | "history">("today")
  const toast = useToast()

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000) // Update every minute

    return () => clearInterval(timer)
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked
    setNewMedication((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const addMedication = () => {
    if (!newMedication.name || !newMedication.dosage || !newMedication.time) {
      toast.warning("Missing Information", "Please fill in all required fields")
      return
    }

    const medication: Medication = {
      ...newMedication,
      id: Date.now(),
      taken: false,
      color: getRandomColor(),
    }

    setMedications((prev) => [...prev, medication])
    setNewMedication({
      name: "",
      dosage: "",
      frequency: "",
      time: "",
      startDate: "",
      endDate: "",
      instructions: "",
      reminders: true,
      category: "",
    })
    setShowAddForm(false)
    toast.success("Medication Added", "Your medication has been added successfully!")
  }

  const getRandomColor = () => {
    const colors = [
      "from-blue-500 to-cyan-500",
      "from-purple-500 to-violet-500",
      "from-green-500 to-emerald-500",
      "from-yellow-500 to-orange-500",
      "from-pink-500 to-rose-500",
      "from-indigo-500 to-blue-500",
    ]
    return colors[Math.floor(Math.random() * colors.length)]
  }

  const deleteMedication = (id: number) => {
    setMedications((prev) => prev.filter((med) => med.id !== id))
    toast.success("Medication Deleted", "Medication has been removed from your list")
  }

  const toggleTaken = (id: number) => {
    setMedications((prev) =>
      prev.map((med) => {
        if (med.id === id) {
          const newTaken = !med.taken
          if (newTaken) {
            toast.success("Medication Taken", `${med.name} marked as taken`)
          }
          return { ...med, taken: newTaken }
        }
        return med
      })
    )
  }

  const getTodaysMedications = () => {
    const today = new Date().toISOString().split("T")[0]
    return medications.filter((med) => {
      const startDate = new Date(med.startDate)
      const endDate = new Date(med.endDate)
      const todayDate = new Date(today)
      return todayDate >= startDate && todayDate <= endDate
    })
  }

  const getUpcomingReminders = () => {
    const now = new Date()
    const currentHour = now.getHours()
    const currentMinute = now.getMinutes()
    const currentTimeInMinutes = currentHour * 60 + currentMinute

    return getTodaysMedications()
      .filter((med) => med.reminders && !med.taken)
      .map((med) => {
        const times = med.time.split(",").map((t) => {
          const [hour, minute] = t.split(":").map(Number)
          return hour * 60 + minute
        })
        const nextTime = times.find((time) => time > currentTimeInMinutes)
        return nextTime ? { ...med, nextTimeInMinutes: nextTime } : null
      })
      .filter(Boolean)
      .sort((a, b) => a!.nextTimeInMinutes - b!.nextTimeInMinutes)
  }

  const formatTime = (timeString: string) => {
    return timeString
      .split(",")
      .map((time) => {
        const [hour, minute] = time.split(":")
        const date = new Date()
        date.setHours(Number.parseInt(hour), Number.parseInt(minute))
        return date.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        })
      })
      .join(", ")
  }

  const getCompletionRate = () => {
    const todaysMeds = getTodaysMedications()
    if (todaysMeds.length === 0) return 0
    const takenCount = todaysMeds.filter((med) => med.taken).length
    return Math.round((takenCount / todaysMeds.length) * 100)
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  const tabVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
  }

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
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="text-center lg:text-left">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Medication Reminders</h1>
              <p className="text-xl text-gray-300">Stay on top of your medication schedule</p>
            </div>
            <div className="mt-6 lg:mt-0 flex justify-center lg:justify-end">
              <AnimatedButton
                onClick={() => setShowAddForm(true)}
                variant="primary"
                className="flex items-center space-x-2"
                shimmer
              >
                <FaPlus className="w-4 h-4" />
                <span>Add Medication</span>
              </AnimatedButton>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <motion.div variants={itemVariants}>
            <GlassCard hover className="text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div className="text-3xl font-bold text-white mb-2">{getCompletionRate()}%</div>
              <div className="text-gray-300 text-sm">Today's Progress</div>
            </GlassCard>
          </motion.div>

          <motion.div variants={itemVariants}>
            <GlassCard hover className="text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Pill className="w-6 h-6 text-white" />
              </div>
              <div className="text-3xl font-bold text-white mb-2">{medications.length}</div>
              <div className="text-gray-300 text-sm">Total Medications</div>
            </GlassCard>
          </motion.div>

          <motion.div variants={itemVariants}>
            <GlassCard hover className="text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-violet-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <div className="text-3xl font-bold text-white mb-2">{getUpcomingReminders().length}</div>
              <div className="text-gray-300 text-sm">Upcoming Today</div>
            </GlassCard>
          </motion.div>

          <motion.div variants={itemVariants}>
            <GlassCard hover className="text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Timer className="w-6 h-6 text-white" />
              </div>
              <div className="text-3xl font-bold text-white mb-2">
                {currentTime.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
              </div>
              <div className="text-gray-300 text-sm">Current Time</div>
            </GlassCard>
          </motion.div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Medications List */}
          <div className="lg:col-span-2">
            {/* Tab Navigation */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="mb-6"
            >
              <div className="flex space-x-1 bg-white/5 rounded-xl p-1">
                {[
                  { key: "today", label: "Today", icon: Calendar },
                  { key: "all", label: "All Medications", icon: Pill },
                  { key: "history", label: "History", icon: Activity },
                ].map((tab) => {
                  const Icon = tab.icon
                  return (
                    <button
                      key={tab.key}
                      onClick={() => setActiveTab(tab.key as "today" | "all" | "history")}
                      className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg transition-all duration-300 ${
                        activeTab === tab.key
                          ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg"
                          : "text-gray-400 hover:text-white hover:bg-white/10"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="font-medium">{tab.label}</span>
                    </button>
                  )
                })}
              </div>
            </motion.div>

            {/* Medications Grid */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                variants={tabVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                {(activeTab === "today" ? getTodaysMedications() : medications).map((medication, index) => (
                  <motion.div
                    key={medication.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                  >
                    <GlassCard hover className="relative overflow-hidden">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 flex-1">
                          <div
                            className={`w-16 h-16 bg-gradient-to-br ${
                              medication.color || "from-purple-500 to-blue-500"
                            } rounded-2xl flex items-center justify-center shadow-lg`}
                          >
                            <Pill className="w-8 h-8 text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h3 className="text-xl font-bold text-white">{medication.name}</h3>
                              {medication.category && (
                                <span className="px-2 py-1 bg-white/10 rounded-full text-xs text-gray-300">
                                  {medication.category}
                                </span>
                              )}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-gray-300">
                              <div className="flex items-center space-x-2">
                                <Pill className="w-4 h-4 text-gray-400" />
                                <span>{medication.dosage}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Clock className="w-4 h-4 text-gray-400" />
                                <span>{formatTime(medication.time)}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Calendar className="w-4 h-4 text-gray-400" />
                                <span>{medication.frequency}</span>
                              </div>
                            </div>
                            {medication.instructions && (
                              <p className="text-gray-400 text-sm mt-2">{medication.instructions}</p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <AnimatedButton
                            onClick={() => toggleTaken(medication.id)}
                            variant={medication.taken ? "outline" : "primary"}
                            size="sm"
                            className={medication.taken ? "bg-green-500 border-green-500 text-white" : ""}
                          >
                            <FaCheck className="w-4 h-4" />
                          </AnimatedButton>
                          <AnimatedButton
                            onClick={() => toast.info("Coming Soon", "Edit medication is not implemented yet")}
                            variant="ghost"
                            size="sm"
                            className="text-gray-400 hover:text-white"
                          >
                            <FaEdit className="w-4 h-4" />
                          </AnimatedButton>
                          <AnimatedButton
                            onClick={() => deleteMedication(medication.id)}
                            variant="ghost"
                            size="sm"
                            className="text-red-400 hover:text-red-300"
                          >
                            <FaTrash className="w-4 h-4" />
                          </AnimatedButton>
                        </div>
                      </div>
                      {medication.taken && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="absolute top-4 right-4 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium"
                        >
                          ✓ Taken
                        </motion.div>
                      )}
                    </GlassCard>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Upcoming Reminders Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <GlassCard>
              <div className="flex items-center mb-6">
                <Bell className="w-6 h-6 text-purple-400 mr-3" />
                <h2 className="text-xl font-bold text-white">Upcoming Reminders</h2>
              </div>

              <div className="space-y-4">
                {getUpcomingReminders().length > 0 ? (
                  getUpcomingReminders().map((reminder, index) => (
                    <motion.div
                      key={reminder!.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                      className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10"
                    >
                      <div>
                        <div className="text-white font-medium">{reminder!.name}</div>
                        <div className="text-gray-400 text-sm">{reminder!.dosage}</div>
                      </div>
                      <div className="text-purple-400 font-medium">
                        {formatTime(reminder!.time.split(",")[0])}
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <CheckCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-400">All medications taken for today!</p>
                  </div>
                )}
              </div>
            </GlassCard>

            {/* Health Insights */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="mt-6"
            >
              <GlassCard>
                <div className="flex items-center mb-4">
                  <Heart className="w-6 h-6 text-pink-400 mr-3" />
                  <h3 className="text-lg font-bold text-white">Health Insights</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Adherence Rate</span>
                    <span className="text-green-400 font-semibold">{getCompletionRate()}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Streak</span>
                    <span className="text-blue-400 font-semibold">5 days</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Active Meds</span>
                    <span className="text-purple-400 font-semibold">{medications.length}</span>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          </motion.div>
        </div>

        {/* Add Medication Modal */}
        <AnimatePresence>
          {showAddForm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
              onClick={() => setShowAddForm(false)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-2xl"
              >
                <GlassCard glow>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-white">Add New Medication</h2>
                    <button
                      onClick={() => setShowAddForm(false)}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      <FaTimes className="w-6 h-6" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Medication Name *</label>
                      <input
                        type="text"
                        name="name"
                        value={newMedication.name}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                        placeholder="Enter medication name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Dosage *</label>
                      <input
                        type="text"
                        name="dosage"
                        value={newMedication.dosage}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                        placeholder="e.g., 500mg, 1 tablet"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Frequency</label>
                      <select
                        name="frequency"
                        value={newMedication.frequency}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 custom-select"
                      >
                        <option value="">Select frequency</option>
                        <option value="Once daily">Once daily</option>
                        <option value="Twice daily">Twice daily</option>
                        <option value="Three times daily">Three times daily</option>
                        <option value="Four times daily">Four times daily</option>
                        <option value="As needed">As needed</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Time(s) *</label>
                      <input
                        type="text"
                        name="time"
                        value={newMedication.time}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                        placeholder="e.g., 08:00 or 08:00,20:00"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
                      <select
                        name="category"
                        value={newMedication.category}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 custom-select"
                      >
                        <option value="">Select category</option>
                        <option value="Prescription">Prescription</option>
                        <option value="Over-the-counter">Over-the-counter</option>
                        <option value="Vitamin">Vitamin</option>
                        <option value="Supplement">Supplement</option>
                        <option value="Herbal">Herbal</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Start Date</label>
                      <input
                        type="date"
                        name="startDate"
                        value={newMedication.startDate}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-300 mb-2">Instructions</label>
                      <textarea
                        name="instructions"
                        value={newMedication.instructions}
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 resize-none"
                        placeholder="Special instructions or notes..."
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-8">
                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        name="reminders"
                        checked={newMedication.reminders}
                        onChange={handleInputChange}
                        className="w-5 h-5 rounded border-white/10 bg-white/5 text-purple-500 focus:ring-2 focus:ring-purple-500"
                      />
                      <span className="text-white">Enable reminders</span>
                    </label>

                    <div className="flex space-x-3">
                      <AnimatedButton onClick={() => setShowAddForm(false)} variant="outline">
                        Cancel
                      </AnimatedButton>
                      <AnimatedButton onClick={addMedication} variant="primary" shimmer>
                        <div className="flex items-center space-x-2">
                          <Zap className="w-4 h-4" />
                          <span>Add Medication</span>
                        </div>
                      </AnimatedButton>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default MedsReminder
