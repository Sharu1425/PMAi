"use client"

import type React from "react"
import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { motion } from "framer-motion"
import { FaEye, FaEyeSlash, FaGoogle } from "react-icons/fa"
import { User, Mail, Lock, Zap } from "lucide-react"
import { authAPI } from "@/utils/api"
import GlassCard from "@/components/ui/GlassCard"
import AnimatedButton from "@/components/ui/AnimatedButton"
import { useToast } from "@/hooks/useToast"

interface SignupProps {
  setUser: (user: any) => void
  setIsAuthenticated: (auth: boolean) => void
}

interface FormData {
  name: string
  email: string
  password: string
  confirmPassword: string
  username: string
}

const Signup: React.FC<SignupProps> = ({ setUser, setIsAuthenticated }) => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    username: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const toast = useToast()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Enhanced validation
      if (!formData.name || !formData.email || !formData.password) {
        toast.error("Validation Error", "Please fill in all required fields")
        return
      }

      if (formData.password !== formData.confirmPassword) {
        toast.error("Validation Error", "Passwords do not match")
        return
      }

      if (formData.password.length < 8) {
        toast.error("Validation Error", "Password must be at least 8 characters long")
        return
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(formData.email)) {
        toast.error("Validation Error", "Please enter a valid email address")
        return
      }

      const response = await authAPI.signup({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        username: formData.username,
      })

      if ((response as any).error) {
        toast.error("Registration Failed", (response as any).message || (response as any).error)
        return
      }

      const { token, user } = response as any

      if (!token || !user) {
        toast.error("Registration Failed", "Invalid response from server")
        return
      }

      localStorage.setItem("token", token)
      localStorage.setItem("user", JSON.stringify(user))
      setUser(user)
      setIsAuthenticated(true)
      toast.success("Registration Successful", "Welcome to PMAi!")
      navigate("/dashboard")
    } catch (err: any) {
      console.error("Registration error:", err)
      const errorMessage = err.response?.data?.message || err.response?.data?.error || "Registration failed"
      toast.error("Registration Failed", errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignup = async () => {
    try {
      if (!window.google || !window.google.accounts) {
        toast.error("Google Signup Error", "Google OAuth not loaded. Please refresh the page.")
        return
      }

      const client = window.google.accounts.oauth2.initTokenClient({
        client_id: (import.meta as any).env.VITE_GOOGLE_CLIENT_ID || "",
        scope: "email profile",
        callback: async (response: any) => {
          if (response.error) {
            console.error("Google OAuth error:", response.error)
            toast.error("Google Signup Failed", "Google authentication failed")
            return
          }

          try {
            const authResponse = await authAPI.googleAuth(response.access_token)
            const { token, user } = authResponse as any

            if (token && user) {
              localStorage.setItem("token", token)
              localStorage.setItem("user", JSON.stringify(user))
              setUser(user)
              setIsAuthenticated(true)
              toast.success("Google Signup Successful", "Welcome to PMAi!")
              navigate("/dashboard")
            } else {
              throw new Error("Invalid response from server")
            }
          } catch (err: any) {
            console.error("Backend authentication error:", err)
            const errorMsg = err.response?.data?.message || "Error with Google authentication"
            toast.error("Google Signup Failed", errorMsg)
          }
        },
      })

      client.requestAccessToken()
    } catch (err: any) {
      console.error("Google OAuth initialization error:", err)
      toast.error("Google Signup Error", "Error initializing Google authentication")
    }
  }

  const inputVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 pt-20">
      <div className="w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <GlassCard glow hover>
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-center mb-8"
            >
              <motion.div
                animate={{
                  scale: [1, 1.05, 1],
                  rotate: [0, 1, -1, 0],
                }}
                transition={{
                  duration: 6,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
                className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-purple-500 via-violet-500 to-blue-500 rounded-3xl flex items-center justify-center shadow-2xl glow-purple"
              >
                <span className="text-3xl font-bold text-white">PM</span>
              </motion.div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">Create Account</h1>
              <p className="text-xl text-gray-300">Join PMAi and start your health journey</p>
            </motion.div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <motion.div
                variants={inputVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                <label htmlFor="name" className="block text-sm font-semibold text-gray-300 mb-3">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full pl-12 pr-4 py-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 hover:bg-white/10"
                    placeholder="Enter your full name"
                  />
                </div>
              </motion.div>

              <motion.div
                variants={inputVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                <label htmlFor="email" className="block text-sm font-semibold text-gray-300 mb-3">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full pl-12 pr-4 py-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 hover:bg-white/10"
                    placeholder="Enter your email"
                  />
                </div>
              </motion.div>

              <motion.div
                variants={inputVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.5, duration: 0.6 }}
              >
                <label htmlFor="username" className="block text-sm font-semibold text-gray-300 mb-3">
                  Username (Optional)
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 hover:bg-white/10"
                    placeholder="Choose a username"
                  />
                </div>
              </motion.div>

              <motion.div
                variants={inputVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.6, duration: 0.6 }}
              >
                <label htmlFor="password" className="block text-sm font-semibold text-gray-300 mb-3">
                  Password *
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full pl-12 pr-12 py-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 hover:bg-white/10"
                    placeholder="Create a secure password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  >
                    {showPassword ? <FaEyeSlash className="w-5 h-5" /> : <FaEye className="w-5 h-5" />}
                  </button>
                </div>
                <p className="text-xs text-gray-400 mt-2">Minimum 8 characters</p>
              </motion.div>

              <motion.div
                variants={inputVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.7, duration: 0.6 }}
              >
                <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-300 mb-3">
                  Confirm Password *
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    className="w-full pl-12 pr-12 py-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 hover:bg-white/10"
                    placeholder="Confirm your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  >
                    {showConfirmPassword ? <FaEyeSlash className="w-5 h-5" /> : <FaEye className="w-5 h-5" />}
                  </button>
                </div>
              </motion.div>

              <motion.div
                variants={inputVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.8, duration: 0.6 }}
                className="space-y-4 pt-4"
              >
                <AnimatedButton type="submit" variant="primary" className="w-full" isLoading={isLoading} shimmer>
                  <div className="flex items-center space-x-2">
                    <Zap className="w-5 h-5" />
                    <span>{isLoading ? "Creating Account..." : "Create Account"}</span>
                  </div>
                </AnimatedButton>

                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/20"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-gray-900 text-gray-400 font-medium">Or continue with</span>
                  </div>
                </div>

                <AnimatedButton
                  type="button"
                  onClick={handleGoogleSignup}
                  variant="ghost"
                  className="w-full bg-white hover:bg-gray-100 text-gray-700 border border-gray-300 flex items-center justify-center space-x-3"
                >
                  <FaGoogle className="w-5 h-5 text-red-500" />
                  <span>Continue with Google</span>
                </AnimatedButton>
              </motion.div>
            </form>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.6 }}
              className="mt-8 text-center"
            >
              <p className="text-gray-300 text-lg">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-gradient font-semibold hover:text-purple-300 transition-colors duration-300"
                >
                  Sign in
                </Link>
              </p>
            </motion.div>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  )
}

export default Signup
