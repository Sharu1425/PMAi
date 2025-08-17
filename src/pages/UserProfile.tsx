"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { FaEdit, FaSave, FaTimes } from "react-icons/fa"
import { User, Mail, Phone, Calendar, Weight, Ruler, Heart, Pill, AlertCircle, Camera, Shield } from "lucide-react"
import GlassCard from "@/components/ui/GlassCard"
import AnimatedButton from "@/components/ui/AnimatedButton"
import FaceRegistration from "@/components/FaceRegistration"
import { useToast } from "@/hooks/useToast"
import { userAPI, authAPI } from "@/utils/api"

interface UserProfileProps {
  user: any
}

interface ProfileData {
  name: string
  email: string
  username: string
  age: string
  gender: string
  height: string
  weight: string
  phone: string
  medicalHistory: string
  allergies: string
  medications: string
}

interface BaseField {
  key: string
  label: string
  icon: any
  type: string
}

interface TextField extends BaseField {
  type: "text" | "email" | "tel" | "number" | "textarea"
  required?: boolean
}

interface SelectField extends BaseField {
  type: "select"
  options: string[]
  required?: boolean
}

type Field = TextField | SelectField

const UserProfile: React.FC<UserProfileProps> = ({ user }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showFaceRegistration, setShowFaceRegistration] = useState(false)
  const [hasFaceRegistered, setHasFaceRegistered] = useState(false)
  const [checkingFaceStatus, setCheckingFaceStatus] = useState(true)
  const [profileData, setProfileData] = useState<ProfileData>({
    name: user?.name || "",
    email: user?.email || "",
    username: user?.username || "",
    age: user?.age || "",
    gender: user?.gender || "",
    height: user?.height || "",
    weight: user?.weight || "",
    phone: user?.phone || "",
    medicalHistory: user?.medicalHistory?.join(", ") || "",
    allergies: user?.allergies?.join(", ") || "",
    medications: user?.medications?.join(", ") || "",
  })
  const toast = useToast()

  useEffect(() => {
    checkFaceRegistrationStatus()
  }, [user?.id])

  const checkFaceRegistrationStatus = async () => {
    if (!user?.id) return
    
    try {
      setCheckingFaceStatus(true)
      const response = await authAPI.checkFaceStatus(user.id)
      setHasFaceRegistered(response.data?.hasFaceRegistered || false)
    } catch (error) {
      console.error("Error checking face status:", error)
    } finally {
      setCheckingFaceStatus(false)
    }
  }

  const handleFaceRegistrationSuccess = () => {
    setHasFaceRegistered(true)
    setShowFaceRegistration(false)
    toast.success("Face Registration Complete", "Your face has been successfully registered for secure login!")
  }

  const handleFaceRegistrationCancel = () => {
    setShowFaceRegistration(false)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSave = async () => {
    setIsLoading(true)
    try {
      const updateData = {
        ...profileData,
        age: profileData.age ? Number.parseInt(profileData.age) : undefined,
        height: profileData.height ? Number.parseFloat(profileData.height) : undefined,
        weight: profileData.weight ? Number.parseFloat(profileData.weight) : undefined,
        gender: profileData.gender as "Male" | "Female" | "Other" | undefined,
        medicalHistory: profileData.medicalHistory
          ? profileData.medicalHistory.split(",").map((item) => item.trim())
          : [],
        allergies: profileData.allergies ? profileData.allergies.split(",").map((item) => item.trim()) : [],
        medications: profileData.medications ? profileData.medications.split(",").map((item) => item.trim()) : [],
      }

      await userAPI.updateProfile(updateData)
      setIsEditing(false)
      toast.success("Profile Updated", "Your profile has been successfully updated")
    } catch (error) {
      console.error("Error updating profile:", error)
      toast.error("Update Failed", "Failed to update profile. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    setProfileData({
      name: user?.name || "",
      email: user?.email || "",
      username: user?.username || "",
      age: user?.age || "",
      gender: user?.gender || "",
      height: user?.height || "",
      weight: user?.weight || "",
      phone: user?.phone || "",
      medicalHistory: user?.medicalHistory?.join(", ") || "",
      allergies: user?.allergies?.join(", ") || "",
      medications: user?.medications?.join(", ") || "",
    })
    setIsEditing(false)
  }

  const profileSections: { title: string; icon: any; fields: Field[] }[] = [
    {
      title: "Personal Information",
      icon: User,
      fields: [
        { key: "name", label: "Full Name", icon: User, type: "text", required: true } as TextField,
        { key: "email", label: "Email", icon: Mail, type: "email", required: true } as TextField,
        { key: "username", label: "Username", icon: User, type: "text" } as TextField,
        { key: "phone", label: "Phone Number", icon: Phone, type: "tel" } as TextField,
      ],
    },
    {
      title: "Health Information",
      icon: Heart,
      fields: [
        { key: "age", label: "Age", icon: Calendar, type: "number" } as TextField,
        { key: "gender", label: "Gender", icon: User, type: "select", options: ["", "Male", "Female", "Other"] } as SelectField,
        { key: "height", label: "Height (cm)", icon: Ruler, type: "number" } as TextField,
        { key: "weight", label: "Weight (kg)", icon: Weight, type: "number" } as TextField,
      ],
    },
    {
      title: "Medical Details",
      icon: Pill,
      fields: [
        { key: "medicalHistory", label: "Medical History", icon: Heart, type: "textarea" } as TextField,
        { key: "allergies", label: "Allergies", icon: AlertCircle, type: "textarea" } as TextField,
        { key: "medications", label: "Current Medications", icon: Pill, type: "textarea" } as TextField,
      ],
    },
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
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="text-center md:text-left">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">User Profile</h1>
              <p className="text-xl text-gray-300">Manage your personal and health information</p>
            </div>
            <div className="mt-6 md:mt-0">
              <AnimatePresence mode="wait">
                {isEditing ? (
                  <motion.div
                    key="editing"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="flex space-x-3"
                  >
                    <AnimatedButton
                      onClick={handleSave}
                      variant="primary"
                      isLoading={isLoading}
                      className="flex items-center space-x-2"
                      shimmer
                    >
                      <FaSave className="w-4 h-4" />
                      <span>Save Changes</span>
                    </AnimatedButton>
                    <AnimatedButton onClick={handleCancel} variant="outline" className="flex items-center space-x-2">
                      <FaTimes className="w-4 h-4" />
                      <span>Cancel</span>
                    </AnimatedButton>
                  </motion.div>
                ) : (
                  <motion.div
                    key="not-editing"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                  >
                    <AnimatedButton
                      onClick={() => setIsEditing(true)}
                      variant="primary"
                      className="flex items-center space-x-2"
                      shimmer
                    >
                      <FaEdit className="w-4 h-4" />
                      <span>Edit Profile</span>
                    </AnimatedButton>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

        {/* Security Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mb-8"
        >
          <GlassCard hover glow>
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mr-4">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white">Security & Authentication</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
                  <div className="flex items-center space-x-3">
                    <Camera className="w-5 h-5 text-blue-400" />
                    <div>
                      <h3 className="text-white font-medium">Face Recognition</h3>
                      <p className="text-gray-400 text-sm">
                        {checkingFaceStatus ? "Checking..." : hasFaceRegistered ? "Registered and active" : "Not registered"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {hasFaceRegistered ? (
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    ) : (
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    )}
                  </div>
                </div>
                
                {!hasFaceRegistered && !showFaceRegistration && (
                  <AnimatedButton
                    onClick={() => setShowFaceRegistration(true)}
                    variant="primary"
                    className="w-full flex items-center justify-center space-x-2"
                    shimmer
                  >
                    <Camera className="w-4 h-4" />
                    <span>Register Face for Login</span>
                  </AnimatedButton>
                )}
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                  <h4 className="text-blue-400 font-medium mb-2">Why Register Your Face?</h4>
                  <ul className="text-gray-300 text-sm space-y-1">
                    <li>• Quick and secure login</li>
                    <li>• No need to remember passwords</li>
                    <li>• Enhanced account security</li>
                    <li>• Convenient access on trusted devices</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Face Registration Component */}
            <AnimatePresence>
              {showFaceRegistration && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mt-6 overflow-hidden"
                >
                  <div className="border-t border-white/10 pt-6">
                    <FaceRegistration
                      userId={user?.id || ""}
                      onSuccess={handleFaceRegistrationSuccess}
                      onCancel={handleFaceRegistrationCancel}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </GlassCard>
        </motion.div>

        {/* Profile Sections */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          {profileSections.map((section, sectionIndex) => {
            const SectionIcon = section.icon
            return (
              <motion.div key={section.title} variants={itemVariants}>
                <GlassCard hover glow>
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center mr-4">
                      <SectionIcon className="w-6 h-6 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-white">{section.title}</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {section.fields.map((field, fieldIndex) => {
                      const FieldIcon = field.icon
                      return (
                        <motion.div
                          key={field.key}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: sectionIndex * 0.1 + fieldIndex * 0.05 }}
                          className={field.type === "textarea" ? "md:col-span-2" : ""}
                        >
                          <label className="block text-sm font-semibold text-gray-300 mb-3">
                            {field.label} {('required' in field && field.required) && <span className="text-red-400">*</span>}
                          </label>
                          <div className="relative">
                            <FieldIcon className="absolute left-4 top-4 text-gray-400 w-5 h-5" />
                            {field.type === "select" ? (
                              <select
                                name={field.key}
                                value={profileData[field.key as keyof ProfileData]}
                                onChange={handleInputChange}
                                disabled={!isEditing}
                                className="w-full pl-12 pr-4 py-4 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/10 custom-select"
                              >
                                {(field as SelectField).options.map((option: string) => (
                                  <option key={option} value={option} className="bg-gray-800">
                                    {option || "Select..."}
                                  </option>
                                ))}
                              </select>
                            ) : field.type === "textarea" ? (
                              <textarea
                                name={field.key}
                                value={profileData[field.key as keyof ProfileData]}
                                onChange={handleInputChange}
                                disabled={!isEditing}
                                rows={3}
                                className="w-full pl-12 pr-4 py-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed resize-none hover:bg-white/10"
                                placeholder={`Enter ${field.label.toLowerCase()}...`}
                              />
                            ) : (
                              <input
                                type={field.type}
                                name={field.key}
                                value={profileData[field.key as keyof ProfileData]}
                                onChange={handleInputChange}
                                disabled={!isEditing}
                                required={('required' in field && field.required) || false}
                                className="w-full pl-12 pr-4 py-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/10"
                                placeholder={`Enter ${field.label.toLowerCase()}...`}
                              />
                            )}
                          </div>
                          {field.key === "medicalHistory" && (
                            <p className="text-xs text-gray-400 mt-2">Separate multiple entries with commas</p>
                          )}
                          {field.key === "allergies" && (
                            <p className="text-xs text-gray-400 mt-2">List any known allergies, separated by commas</p>
                          )}
                          {field.key === "medications" && (
                            <p className="text-xs text-gray-400 mt-2">List current medications, separated by commas</p>
                          )}
                        </motion.div>
                      )
                    })}
                  </div>
                </GlassCard>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Profile Completion Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mt-8"
        >
          <GlassCard>
            <div className="text-center">
              <h3 className="text-xl font-bold text-white mb-4">Profile Completion</h3>
              <div className="w-full bg-white/10 rounded-full h-3 mb-4">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "85%" }}
                  transition={{ delay: 0.8, duration: 1 }}
                  className="bg-gradient-to-r from-purple-500 to-blue-500 h-3 rounded-full"
                />
              </div>
              <p className="text-gray-300">
                Your profile is <span className="text-purple-400 font-semibold">85% complete</span>. Complete your
                profile for better personalized recommendations.
              </p>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  )
}

export default UserProfile
