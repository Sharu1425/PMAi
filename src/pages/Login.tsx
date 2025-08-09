"use client"

import type React from "react"
import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { FaEye, FaEyeSlash, FaGoogle, FaUserSecret, FaArrowLeft } from "react-icons/fa"
import { authAPI } from "@/utils/api"
import GlassCard from "@/components/ui/GlassCard"
import AnimatedButton from "@/components/ui/AnimatedButton"
import FaceLogin from "@/components/FaceLogin"
import { useToast } from "@/hooks/useToast"

interface LoginProps {
  setUser: (user: any) => void
  setIsAuthenticated: (auth: boolean) => void
}

const Login: React.FC<LoginProps> = ({ setUser, setIsAuthenticated }) => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showFaceLogin, setShowFaceLogin] = useState(false)
  const navigate = useNavigate()
  const toast = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (!email || !password) {
        toast.error("Validation Error", "Please enter both email and password")
        return
      }

      const response = await authAPI.login(email, password)

      if ((response as any).error) {
        toast.error("Login Failed", (response as any).message || (response as any).error)
        return
      }

      const { token, user } = response as any

      if (!token || !user) {
        toast.error("Login Failed", "Invalid response from server")
        return
      }

      localStorage.setItem("token", token)
      localStorage.setItem("user", JSON.stringify(user))
      setUser(user)
      setIsAuthenticated(true)
      toast.success("Login Successful", "Welcome back!")
      navigate("/dashboard")
    } catch (err: any) {
      console.error("Login error:", err)
      const errorMessage = err.response?.data?.message || err.response?.data?.error || "Authentication failed"
      toast.error("Login Failed", errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    try {
      if (!window.google || !window.google.accounts) {
        toast.error("Google Login Error", "Google OAuth not loaded. Please refresh the page.")
        return
      }

      const client = window.google.accounts.oauth2.initTokenClient({
        client_id: (import.meta as any).env.VITE_GOOGLE_CLIENT_ID || "",
        scope: "email profile",
        callback: async (response: any) => {
          if (response.error) {
            console.error("Google OAuth error:", response.error)
            toast.error("Google Login Failed", "Google authentication failed")
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
              toast.success("Google Login Successful", "Welcome back!")
              navigate("/dashboard")
            } else {
              throw new Error("Invalid response from server")
            }
          } catch (err: any) {
            console.error("Backend authentication error:", err)
            const errorMsg = err.response?.data?.message || "Error with Google authentication"
            toast.error("Google Login Failed", errorMsg)
          }
        },
      })

      client.requestAccessToken()
    } catch (err: any) {
      console.error("Google OAuth initialization error:", err)
      toast.error("Google Login Error", "Error initializing Google authentication")
    }
  }

  const handleFaceLoginSuccess = (user: any) => {
    setUser(user)
    setIsAuthenticated(true)
    toast.success("Face Login Successful", "Welcome back!")
    navigate("/dashboard")
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 pt-20">
      <div className="w-full max-w-md">
        <AnimatePresence mode="wait">
          {showFaceLogin ? (
            <motion.div
              key="face-login"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              <GlassCard>
                <div className="mb-6">
                  <button
                    onClick={() => setShowFaceLogin(false)}
                    className="flex items-center text-gray-400 hover:text-white transition-colors mb-4"
                  >
                    <FaArrowLeft className="w-4 h-4 mr-2" />
                    Back to Login
                  </button>
                  <h2 className="text-2xl font-bold text-white">Face Recognition Login</h2>
                  <p className="text-gray-300 mt-2">Position your face in the camera view</p>
                </div>
                <FaceLogin onSuccess={handleFaceLoginSuccess} onCancel={() => setShowFaceLogin(false)} />
              </GlassCard>
            </motion.div>
          ) : (
            <motion.div
              key="regular-login"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.3 }}
            >
              <GlassCard glow>
                <motion.div
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="text-center mb-8"
                >
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-2xl">
                    <span className="text-2xl font-bold text-white">PM</span>
                  </div>
                  <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
                  <p className="text-gray-300">Sign in to your PMAi account</p>
                </motion.div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                  >
                    <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                      placeholder="Enter your email"
                    />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                  >
                    <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full px-4 py-3 pr-12 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                        placeholder="Enter your password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                      >
                        {showPassword ? <FaEyeSlash className="w-5 h-5" /> : <FaEye className="w-5 h-5" />}
                      </button>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                    className="space-y-4"
                  >
                    <AnimatedButton type="submit" variant="primary" className="w-full" isLoading={isLoading} shimmer>
                      {isLoading ? "Signing In..." : "Sign In"}
                    </AnimatedButton>

                    <AnimatedButton
                      type="button"
                      onClick={() => setShowFaceLogin(true)}
                      variant="outline"
                      className="w-full"
                    >
                      <div className="flex items-center justify-center space-x-2">
                        <FaUserSecret className="w-5 h-5" />
                        <span>Face Recognition Login</span>
                      </div>
                    </AnimatedButton>

                    <div className="relative my-6">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-white/10"></div>
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-gray-900 text-gray-400">Or continue with</span>
                      </div>
                    </div>

                    <AnimatedButton
                      type="button"
                      onClick={handleGoogleLogin}
                      variant="ghost"
                      className="w-full bg-white hover:bg-gray-100 text-gray-700 border border-gray-300"
                    >
                      <div className="flex items-center justify-center space-x-2">
                        <FaGoogle className="w-5 h-5 text-red-500" />
                        <span>Continue with Google</span>
                      </div>
                    </AnimatedButton>
                  </motion.div>
                </form>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                  className="mt-6 text-center"
                >
                  <p className="text-gray-300">
                    Don't have an account?{" "}
                    <Link to="/signup" className="text-purple-400 hover:text-purple-300 transition-colors font-medium">
                      Sign up
                    </Link>
                  </p>
                </motion.div>
              </GlassCard>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default Login
