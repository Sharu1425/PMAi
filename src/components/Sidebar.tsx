"use client"

import type React from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Link, useLocation } from "react-router-dom"
import {
  X,
  LayoutDashboard,
  Stethoscope,
  Apple,
  Pill,
  User,
  Settings as SettingsIcon,
  LogOut,
} from "lucide-react"

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
  isAuthenticated: boolean
  user: any
  onLogout: () => void
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, isAuthenticated, user, onLogout }) => {
  const location = useLocation()

  const navItems = [
    { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { path: "/symptoms", label: "Symptoms", icon: Stethoscope },
    { path: "/diet", label: "Diet", icon: Apple },
    { path: "/medications", label: "Medications", icon: Pill },
  ]
  const bottomItems = [
    { path: "/profile", label: "Profile", icon: User },
    { path: "/settings", label: "Settings", icon: SettingsIcon },
  ]

  const isActive = (path: string) => location.pathname === path

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/50 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Panel */}
          <motion.aside
            className="fixed left-0 top-0 bottom-0 w-72 z-50 backdrop-blur-xl bg-gradient-to-b from-gray-900/95 to-gray-900/80 border-r border-white/10 shadow-2xl flex flex-col"
            initial={{ x: -320 }}
            animate={{ x: 0 }}
            exit={{ x: -320 }}
            transition={{ type: "spring", stiffness: 280, damping: 30 }}
          >
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <Link to="/" onClick={onClose} className="flex items-center space-x-3 group">
                <div className="w-9 h-9 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center shadow">
                  <span className="text-white font-bold">PM</span>
                </div>
                <span className="text-white font-semibold group-hover:text-white/90">PMAi</span>
              </Link>
              <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/10 text-gray-300 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {isAuthenticated && (
              <div className="px-4 py-3 border-b border-white/10">
                <p className="text-sm text-gray-400">Signed in as</p>
                <p className="text-white font-medium truncate">{user?.name || "User"}</p>
              </div>
            )}

            <div className="flex-1 overflow-y-auto">
              {isAuthenticated ? (
                <nav className="p-3 space-y-1">
                  {navItems.map((item) => {
                    const Icon = item.icon
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={onClose}
                        className={`group flex items-center space-x-3 px-3 py-2 rounded-lg transition-all ${
                          isActive(item.path)
                            ? "bg-purple-500/20 text-white border border-purple-500/30 shadow"
                            : "text-gray-300 hover:text-white hover:bg-white/10 hover:translate-x-0.5"
                        }`}
                      >
                        <Icon className="w-5 h-5 transition-transform group-hover:scale-110" />
                        <span className="font-medium">{item.label}</span>
                      </Link>
                    )
                  })}
                </nav>
              ) : (
                <div className="p-4 text-gray-300">
                  <p className="text-sm">Sign in to use PMAi</p>
                  <Link
                    to="/login"
                    onClick={onClose}
                    className="mt-3 inline-flex items-center justify-center px-3 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700"
                  >
                    Go to Sign In
                  </Link>
                </div>
              )}
            </div>

            <div className="p-3 border-t border-white/10 space-y-1">
              {isAuthenticated && (
                <>
                  {bottomItems.map((item) => {
                    const Icon = item.icon
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={onClose}
                        className={`group flex items-center space-x-3 px-3 py-2 rounded-lg transition-all ${
                          isActive(item.path)
                            ? "bg-purple-500/20 text-white border border-purple-500/30 shadow"
                            : "text-gray-300 hover:text-white hover:bg-white/10 hover:translate-x-0.5"
                        }`}
                      >
                        <Icon className="w-5 h-5 transition-transform group-hover:scale-110" />
                        <span className="font-medium">{item.label}</span>
                      </Link>
                    )
                  })}
                  <button
                    onClick={() => {
                      onClose()
                      onLogout()
                    }}
                    className="w-full flex items-center justify-center space-x-2 px-3 py-2 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </>
              )}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}

export default Sidebar


