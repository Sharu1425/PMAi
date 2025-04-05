import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Navbar from './components/Navbar'
import AnimatedBackground from './components/AnimatedBackground'
import DashBoard from './pages/DashBoard'
import UserProfile from './pages/UserProfile'
//import Settings from './pages/Settings'
//import Logout from './pages/Logout'

function App() {
    const [user, setUser] = useState(null)
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [isAdmin, setIsAdmin] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)

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
        localStorage.removeItem('user')
        setUser(null)
        setIsAuthenticated(false)
    }
    
    return (
        <Router>
            <div className="min-h-screen relative">
                <AnimatedBackground />
                <div className="relative z-10">
                    <Navbar isAuthenticated={isAuthenticated} user={user} />
                    <div className="pt-16"> {/* Add padding to account for fixed navbar */}
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route 
                                path="/login" 
                                element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />} 
                            />
                            <Route 
                                path="/signup" 
                                element={isAuthenticated ? <Navigate to="/dashboard" /> : <Signup />} 
                            />
                            <Route 
                                path="/dashboard" 
                                element={isAuthenticated ? <DashBoard /> : <Navigate to="/login" />} 
                            />
                            <Route 
                                path="/profile" 
                                element={isAuthenticated ? <Profile /> : <Navigate to="/login" />} 
                            />
                            {/* <Route path="/settings" element={<Settings />} />
                            <Route path="/logout" element={<Logout />} /> */}
                        </Routes>
                    </div>
                </div>
            </div>
        </Router>
    )
}

export default App
