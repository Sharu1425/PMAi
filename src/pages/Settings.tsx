"use client"

import type React from "react"
import { useState } from "react"
import { motion } from "framer-motion"
import { 
  Settings as SettingsIcon, 
  Bell, 
  Shield, 
  Moon, 
  Globe, 
  Database, 
  User, 
  Smartphone,
  Eye,
  Trash2,
  Save,
  RefreshCw
} from "lucide-react"
import GlassCard from "@/components/ui/GlassCard"
import AnimatedButton from "@/components/ui/AnimatedButton"
import { useToast } from "@/hooks/useToast"

interface SettingsProps {
  user: any
}

const Settings: React.FC<SettingsProps> = ({ user }) => {
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      push: true,
      sms: false,
      reminders: true,
    },
    privacy: {
      profileVisibility: "private",
      dataSharing: false,
      analytics: true,
    },
    appearance: {
      theme: "dark",
      language: "en",
      timezone: "auto",
    },
    security: {
      twoFactor: false,
      loginAlerts: true,
      sessionTimeout: "30",
    }
  })
  
  const [isLoading, setIsLoading] = useState(false)
  const toast = useToast()

  const handleSettingChange = (category: string, setting: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [setting]: value
      }
    }))
  }

  const handleSaveSettings = async () => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast.success("Settings Saved", "Your preferences have been updated successfully")
    } catch (error) {
      toast.error("Save Failed", "Failed to save settings. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleResetSettings = () => {
    setSettings({
      notifications: {
        email: true,
        push: true,
        sms: false,
        reminders: true,
      },
      privacy: {
        profileVisibility: "private",
        dataSharing: false,
        analytics: true,
      },
      appearance: {
        theme: "dark",
        language: "en",
        timezone: "auto",
      },
      security: {
        twoFactor: false,
        loginAlerts: true,
        sessionTimeout: "30",
      }
    })
    toast.info("Settings Reset", "All settings have been reset to defaults")
  }

  const settingsCategories = [
    {
      title: "Notifications",
      icon: Bell,
      settings: [
        { key: "email", label: "Email notifications", type: "toggle", value: settings.notifications.email },
        { key: "push", label: "Push notifications", type: "toggle", value: settings.notifications.push },
        { key: "sms", label: "SMS notifications", type: "toggle", value: settings.notifications.sms },
        { key: "reminders", label: "Medication reminders", type: "toggle", value: settings.notifications.reminders },
      ]
    },
    {
      title: "Privacy & Data",
      icon: Shield,
      settings: [
        { 
          key: "profileVisibility", 
          label: "Profile visibility", 
          type: "select", 
          value: settings.privacy.profileVisibility,
          options: [
            { value: "public", label: "Public" },
            { value: "private", label: "Private" },
            { value: "friends", label: "Friends only" }
          ]
        },
        { key: "dataSharing", label: "Share data for research", type: "toggle", value: settings.privacy.dataSharing },
        { key: "analytics", label: "Usage analytics", type: "toggle", value: settings.privacy.analytics },
      ]
    },
    {
      title: "Appearance",
      icon: Moon,
      settings: [
        { 
          key: "theme", 
          label: "Theme", 
          type: "select", 
          value: settings.appearance.theme,
          options: [
            { value: "dark", label: "Dark" },
            { value: "light", label: "Light" },
            { value: "auto", label: "System" }
          ]
        },
        { 
          key: "language", 
          label: "Language", 
          type: "select", 
          value: settings.appearance.language,
          options: [
            { value: "en", label: "English" },
            { value: "es", label: "Spanish" },
            { value: "fr", label: "French" },
            { value: "de", label: "German" }
          ]
        },
        { 
          key: "timezone", 
          label: "Timezone", 
          type: "select", 
          value: settings.appearance.timezone,
          options: [
            { value: "auto", label: "Auto-detect" },
            { value: "utc", label: "UTC" },
            { value: "est", label: "EST" },
            { value: "pst", label: "PST" }
          ]
        },
      ]
    },
    {
      title: "Security",
      icon: User,
      settings: [
        { key: "twoFactor", label: "Two-factor authentication", type: "toggle", value: settings.security.twoFactor },
        { key: "loginAlerts", label: "Login alerts", type: "toggle", value: settings.security.loginAlerts },
        { 
          key: "sessionTimeout", 
          label: "Session timeout (minutes)", 
          type: "select", 
          value: settings.security.sessionTimeout,
          options: [
            { value: "15", label: "15 minutes" },
            { value: "30", label: "30 minutes" },
            { value: "60", label: "1 hour" },
            { value: "never", label: "Never" }
          ]
        },
      ]
    }
  ]

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

  return (
    <div className="min-h-screen pt-20 pb-10 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="text-center md:text-left">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Settings</h1>
              <p className="text-xl text-gray-300">Customize your PMAi experience</p>
            </div>
            <div className="mt-6 md:mt-0 flex space-x-3">
              <AnimatedButton
                onClick={handleResetSettings}
                variant="outline"
                className="flex items-center space-x-2"
              >
                <div className="flex items-center space-x-2">
                  <RefreshCw className="w-4 h-4" />
                  <span>Reset</span>
                </div>
              </AnimatedButton>
              <AnimatedButton
                onClick={handleSaveSettings}
                variant="primary"
                isLoading={isLoading}
                className="flex items-center space-x-2"
                shimmer
              >
                <div className="flex items-center space-x-2">
                  <Save className="w-4 h-4" />
                  <span>Save Changes</span>
                </div>
              </AnimatedButton>
            </div>
          </div>
        </motion.div>

        {/* Settings Categories */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          {settingsCategories.map((category, categoryIndex) => {
            const CategoryIcon = category.icon
            return (
              <motion.div key={category.title} variants={itemVariants}>
                <GlassCard hover glow>
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center mr-4">
                      <CategoryIcon className="w-6 h-6 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-white">{category.title}</h2>
                  </div>

                  <div className="space-y-6">
                    {category.settings.map((setting, settingIndex) => (
                      <motion.div
                        key={setting.key}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: categoryIndex * 0.1 + settingIndex * 0.05 }}
                        className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-300"
                      >
                        <div>
                          <h3 className="text-white font-medium">{setting.label}</h3>
                        </div>
                        
                        {setting.type === "toggle" ? (
                          <button
                            onClick={() => handleSettingChange(
                              category.title.toLowerCase().replace(" & ", "").replace(" ", ""), 
                              setting.key, 
                              !setting.value
                            )}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                              setting.value ? "bg-purple-600" : "bg-gray-600"
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                setting.value ? "translate-x-6" : "translate-x-1"
                              }`}
                            />
                          </button>
                        ) : (
                          <select
                            value={setting.value}
                            onChange={(e) => handleSettingChange(
                              category.title.toLowerCase().replace(" & ", "").replace(" ", ""), 
                              setting.key, 
                              e.target.value
                            )}
                            className="px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
                          >
                            {setting.options?.map((option) => (
                              <option key={option.value} value={option.value} className="bg-gray-800">
                                {option.label}
                              </option>
                            ))}
                          </select>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </GlassCard>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Danger Zone */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="mt-8"
        >
          <GlassCard className="border-red-500/20 bg-red-500/5">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-500 rounded-xl flex items-center justify-center mr-4">
                <Trash2 className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-red-400">Danger Zone</h2>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-red-500/10 rounded-xl border border-red-500/20">
                <div>
                  <h3 className="text-red-400 font-medium">Delete Account</h3>
                  <p className="text-gray-400 text-sm">Permanently delete your account and all data</p>
                </div>
                <AnimatedButton variant="outline" className="border-red-500 text-red-400 hover:bg-red-500 hover:text-white">
                  <div className="flex items-center space-x-2">
                    <Trash2 className="w-4 h-4" />
                    <span>Delete</span>
                  </div>
                </AnimatedButton>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  )
}

export default Settings
