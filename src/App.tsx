"use client"

import React, { useState, useEffect, Suspense } from "react"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { AnimatePresence } from "framer-motion"

// Components
import Navbar from "@/components/Navbar"
import Sidebar from "@/components/Sidebar"
import LoadingScreen from "@/components/ui/LoadingScreen"
import PageTransition from "@/components/ui/PageTransition"
import FloatingParticles from "@/components/ui/FloatingParticles"
import { ThemeProvider } from "@/contexts/ThemeContext"
import { ToastProvider } from "@/contexts/ToastContext"
import ToastContainer from "@/components/ui/ToastContainer"

// Types
import type { User } from "@/types"

// Lazy load pages for better performance
const Home = React.lazy(() => import("@/pages/Home"))
const Login = React.lazy(() => import("@/pages/Login"))
const Dashboard = React.lazy(() => import("@/pages/Dashboard"))
const Signup = React.lazy(() => import("@/pages/Signup"))
const Profile = React.lazy(() => import("@/pages/UserProfile"))
const Symptoms = React.lazy(() => import("@/pages/SymptomAnalyser"))
const Diet = React.lazy(() => import("@/pages/DietRecom"))
const Medications = React.lazy(() => import("@/pages/MedsReminder"))
const Settings = React.lazy(() => import("@/pages/Settings"))

// Protected Route Component
const ProtectedRoute: React.FC<{
  isAuthenticated: boolean
  children: React.ReactNode
}> = ({ isAuthenticated, children }) => {
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }
  return <>{children}</>
}

function App() {
  const [user, setUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    const initializeApp = async () => {
      try {
        const token = localStorage.getItem("token")
        const userData = localStorage.getItem("user")

        if (token && userData) {
          const parsedUser = JSON.parse(userData)
          setIsAuthenticated(true)
          setUser(parsedUser)
        }
      } catch (error) {
        console.error("Error initializing app:", error)
        localStorage.removeItem("token")
        localStorage.removeItem("user")
      } finally {
        setTimeout(() => {
          setIsLoading(false)
        }, 2000)
      }
    }

    initializeApp()
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    setUser(null)
    setIsAuthenticated(false)
  }

  if (isLoading) {
    return <LoadingScreen />
  }

  return (
    <ThemeProvider>
      <ToastProvider>
        <Router future={{ 
          v7_startTransition: true,
          v7_relativeSplatPath: true 
        }}>
          <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/10 to-gray-900 relative overflow-hidden">
            <FloatingParticles />
            <Navbar
              isAuthenticated={isAuthenticated}
              user={user}
              onLogout={handleLogout}
              onToggleSidebar={() => setSidebarOpen(true)}
            />
            <Sidebar
              isOpen={sidebarOpen}
              onClose={() => setSidebarOpen(false)}
              isAuthenticated={isAuthenticated}
              user={user}
              onLogout={handleLogout}
            />

            <main className="relative z-10">
              <Suspense fallback={<LoadingScreen />}>
                <AnimatePresence mode="wait">
                  <Routes>
                    {/* Public Routes */}
                    <Route
                      path="/"
                      element={
                        <PageTransition>
                          <Home />
                        </PageTransition>
                      }
                    />
                    <Route
                      path="/login"
                      element={
                        isAuthenticated ? (
                          <Navigate to="/dashboard" />
                        ) : (
                          <PageTransition>
                            <Login setUser={setUser} setIsAuthenticated={setIsAuthenticated} />
                          </PageTransition>
                        )
                      }
                    />
                    <Route
                      path="/signup"
                      element={
                        isAuthenticated ? (
                          <Navigate to="/dashboard" />
                        ) : (
                          <PageTransition>
                            <Signup setUser={setUser} setIsAuthenticated={setIsAuthenticated} />
                          </PageTransition>
                        )
                      }
                    />

                    {/* Protected Routes */}
                    <Route
                      path="/dashboard"
                      element={
                        <ProtectedRoute isAuthenticated={isAuthenticated}>
                          <PageTransition>
                            <Dashboard />
                          </PageTransition>
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/profile"
                      element={
                        <ProtectedRoute isAuthenticated={isAuthenticated}>
                          <PageTransition>
                            <Profile user={user} />
                          </PageTransition>
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/symptoms"
                      element={
                        <ProtectedRoute isAuthenticated={isAuthenticated}>
                          <PageTransition>
                            <Symptoms user={user} />
                          </PageTransition>
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/diet"
                      element={
                        <ProtectedRoute isAuthenticated={isAuthenticated}>
                          <PageTransition>
                            <Diet user={user} />
                          </PageTransition>
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/medications"
                      element={
                        <ProtectedRoute isAuthenticated={isAuthenticated}>
                          <PageTransition>
                            <Medications user={user} />
                          </PageTransition>
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/settings"
                      element={
                        <ProtectedRoute isAuthenticated={isAuthenticated}>
                          <PageTransition>
                            <Settings user={user} />
                          </PageTransition>
                        </ProtectedRoute>
                      }
                    />

                    {/* Catch all route */}
                    <Route path="*" element={<Navigate to="/" />} />
                  </Routes>
                </AnimatePresence>
              </Suspense>
            </main>

            <ToastContainer />
          </div>
        </Router>
      </ToastProvider>
    </ThemeProvider>
  )
}

export default App


