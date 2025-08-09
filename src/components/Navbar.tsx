"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import {
  Heart,
  LogOut,
  LogIn,
  UserPlus,
  Menu,
  Sun,
  Moon,
} from "lucide-react"
import { useToast } from "@/hooks/useToast"
import GlassCard from "./ui/GlassCard"
import AnimatedButton from "./ui/AnimatedButton"
import { useTheme } from "@/contexts/ThemeContext"

interface NavbarProps {
  isAuthenticated: boolean
  user: any
  onLogout: () => void
  onToggleSidebar: () => void
}

const Navbar: React.FC<NavbarProps> = ({ isAuthenticated, user, onLogout, onToggleSidebar }) => {
  const navigate = useNavigate()
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const userMenuRef = useRef<HTMLDivElement>(null)
  const toast = useToast()
  const { colorScheme, setColorScheme } = useTheme()

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // close user menu on route change handled at parent if needed

  const handleLogout = async () => {
    try {
      onLogout()
      toast.success("Logged Out", "You have been successfully logged out")
      navigate("/login")
    } catch (error) {
      toast.error("Logout Failed", "An error occurred while logging out")
    }
  }

  // navigation moved to Sidebar

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: hamburger + logo */}
          <div className="flex items-center space-x-3">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={onToggleSidebar}
              className="p-2 rounded-xl text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
            >
              <Menu className="w-6 h-6" />
            </motion.button>
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
              <Link to="/" className="flex items-center space-x-3 group">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-purple-500/25 transition-all duration-300">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold text-gradient">PMAi</span>
              </Link>
            </motion.div>
          </div>

          {/* Right: theme toggle + auth buttons/user */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setColorScheme(colorScheme === "dark" ? "light" : "dark")}
              className="p-2 rounded-xl text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Toggle theme"
              title="Toggle theme"
            >
              {colorScheme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            {isAuthenticated ? (
              <div className="relative" ref={userMenuRef}>
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4, duration: 0.3 }}
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center space-x-2 p-2 rounded-xl hover:bg-white/10 transition-all duration-300"
                  >
                    {user?.profilePicture ? (
                      <img
                        src={user.profilePicture || "/placeholder.svg"}
                        alt="Profile"
                        className="w-8 h-8 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                        <span className="text-white text-sm font-semibold">{user?.name?.charAt(0) || "U"}</span>
                      </div>
                    )}
                  <span className="text-white font-medium hidden lg:block">{user?.name || "User"}</span>
                  </motion.button>

                {userMenuOpen && (
              <div className="absolute right-0 mt-2 w-64">
                <GlassCard className="py-2 bg-gray-900/90 border-white/20 shadow-xl">
                  <div className="px-4 py-2 border-b border-white/10">
                    <p className="text-white font-medium truncate" title={user?.name}>{user?.name}</p>
                    <p className="text-gray-400 text-sm truncate" title={user?.email}>{user?.email}</p>
                      </div>
                      <button
                        onClick={handleLogout}
                        className="flex items-center space-x-3 w-full px-4 py-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </GlassCard>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link to="/login">
                  <AnimatedButton variant="ghost">
                    <div className="flex items-center space-x-2">
                      <LogIn className="w-4 h-4" />
                      <span>Sign In</span>
                    </div>
                  </AnimatedButton>
                </Link>
                <Link to="/signup">
                  <AnimatedButton variant="primary" shimmer>
                    <div className="flex items-center space-x-2">
                      <UserPlus className="w-4 h-4" />
                      <span>Sign Up</span>
                    </div>
                  </AnimatedButton>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
