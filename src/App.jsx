import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Navbar from './components/Navbar'
import AnimatedBackground from './components/AnimatedBackground'
import Dashboard from './pages/DashBoard'
import UserProfile from './pages/UserProfile'
import SymptomAnalyser from './pages/SymptomAnalyser'
import DietRecom from './pages/DietRecom'
import MedsReminder from './pages/MedsReminder'
import { Toaster } from 'react-hot-toast'
//import Settings from './pages/Settings'
//import Logout from './pages/Logout'

function App() {
    const [user, setUser] = useState(null)
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const token = localStorage.getItem('token')
        const userData = localStorage.getItem('user')
        if (token && userData) {
            setIsAuthenticated(true)
            setUser(JSON.parse(userData))
        }
        setIsLoading(false)
    }, [])
    
    const handleLogout = () => {
        // Clean up authentication state
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        
        // Reset user and authentication state
        setUser(null);
        setIsAuthenticated(false);
        
        console.log('User logged out successfully');
    }

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-900">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
        )
    }
    
    return (
        <Router>
            <div className="min-h-screen relative">
                <AnimatedBackground />
                <div className="relative z-10">
                    <Navbar isAuthenticated={isAuthenticated} user={user} onLogout={handleLogout} />
                    <div className="pt-16"> {/* Add padding to account for fixed navbar */}
                        <Routes>
                            {/* Public Routes */}
                            <Route path="/" element={<Home />} />
                            <Route 
                                path="/login" 
                                element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login setUser={setUser} setIsAuthenticated={setIsAuthenticated} />} 
                            />
                            <Route 
                                path="/signup" 
                                element={isAuthenticated ? <Navigate to="/dashboard" /> : <Signup setUser={setUser} setIsAuthenticated={setIsAuthenticated} />} 
                            />

                            {/* Protected Routes */}
                            <Route 
                                path="/dashboard" 
                                element={isAuthenticated ? <Dashboard user={user} /> : <Navigate to="/login" />} 
                            />
                            <Route 
                                path="/profile" 
                                element={isAuthenticated ? <UserProfile user={user} /> : <Navigate to="/login" />} 
                            />
                            <Route 
                                path="/userprofile" 
                                element={isAuthenticated ? <UserProfile user={user} /> : <Navigate to="/login" />} 
                            />
                            <Route 
                                path="/symptoms" 
                                element={isAuthenticated ? <SymptomAnalyser user={user} /> : <Navigate to="/login" />} 
                            />
                            <Route 
                                path="/diet" 
                                element={isAuthenticated ? <DietRecom user={user} /> : <Navigate to="/login" />} 
                            />
                            <Route 
                                path="/reminders" 
                                element={isAuthenticated ? <MedsReminder user={user} /> : <Navigate to="/login" />} 
                            />

                            {/* Catch all route */}
                            <Route path="*" element={<Navigate to="/" />} />
                        </Routes>
                    </div>
                </div>
                
                {/* Toast notifications */}
                <Toaster 
                    position="top-right"
                    toastOptions={{
                        duration: 3000,
                        style: {
                            background: '#333',
                            color: '#fff',
                        },
                        success: {
                            iconTheme: {
                                primary: '#4caf50',
                                secondary: '#fff',
                            },
                        },
                        error: {
                            iconTheme: {
                                primary: '#f44336',
                                secondary: '#fff',
                            },
                        },
                    }}
                />
            </div>
        </Router>
    )
}

export default App
