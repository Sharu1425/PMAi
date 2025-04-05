"use client"

import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { motion } from "framer-motion"
import AnimatedBackground from "../components/AnimatedBackground"
import axios from "axios"
import { Link } from "react-router-dom"

function Signup({ setUser, setIsAuthenticated }) {
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [error, setError] = useState("")
    const navigate = useNavigate()
    const location = useLocation()

    useEffect(() => {
        // Check if user is already authenticated
        const checkAuth = async () => {
            try {
                const response = await axios.get("http://localhost:5001/auth/status", { withCredentials: true })
                if (response.data.isAuthenticated) {
                    setUser(response.data.user)
                    setIsAuthenticated(true)
                    navigate("/dashboard")
                }
            } catch (err) {
                console.error("Auth check failed:", err)
            }
        }
        checkAuth()
    }, [navigate, setUser, setIsAuthenticated])

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (password !== confirmPassword) {
            setError("Passwords don't match")
            return
        }
        try {
            const response = await axios.post("http://localhost:5001/db/users/register", 
                { username, email, password },
                { withCredentials: true }
            )
            setUser(response.data.user)
            setIsAuthenticated(true)
            navigate("/dashboard")
        } catch (err) {
            const errorMessage = err.response?.data?.error || "An error occurred"
            setError(errorMessage)
            console.error(errorMessage)
        }
    }

    const handleGoogleLogin = () => {
        window.location.href = "http://localhost:5001/auth/google"
    }

    return (
        <>
            <AnimatedBackground />
            <div className="min-h-screen flex items-center justify-center px-4 py-16">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="w-full max-w-md"
                >
                    <div className="glass-card p-8 rounded-2xl neon-border shadow-xl backdrop-blur-xl border-1 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-blue-500/10"></div>
                        <motion.div
                            initial={{ y: -20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2, duration: 0.5 }}
                            className="text-center mb-8 relative"
                        >
                            <h2 className="text-4xl font-bold gradient-text mb-2 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-blue-400">Create Account</h2>
                            <p className="text-blue-200 text-lg">Access your Gen AI powered Personal Medical Assistant</p>
                        </motion.div>

                        <form onSubmit={handleSubmit} className="space-y-6 relative">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
                                    <label htmlFor="username" className="block text-sm font-medium text-blue-200 mb-2">
                                        Username
                                    </label>
                                    <input
                                        type="text"
                                        id="username"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        required
                                        className="w-full px-4 py-3 rounded-lg bg-indigo-900/20 border border-indigo-500/30 text-white placeholder-indigo-300/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300 hover:border-indigo-400"
                                        placeholder="Choose a username"
                                    />
                                </motion.div>

                                <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.4 }}>
                                    <label htmlFor="email" className="block text-sm font-medium text-blue-200 mb-2">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className="w-full px-4 py-3 rounded-lg bg-indigo-900/20 border border-indigo-500/30 text-white placeholder-indigo-300/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300 hover:border-indigo-400"
                                        placeholder="Enter your email"
                                    />
                                </motion.div>

                                <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.5 }}>
                                    <label htmlFor="password" className="block text-sm font-medium text-blue-200 mb-2">
                                        Password
                                    </label>
                                    <input
                                        type="password"
                                        id="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        className="w-full px-4 py-3 rounded-lg bg-indigo-900/20 border border-indigo-500/30 text-white placeholder-indigo-300/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300 hover:border-indigo-400"
                                        placeholder="Create a password"
                                    />
                                </motion.div>

                                <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.6 }}>
                                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-blue-200 mb-2">
                                        Confirm Password
                                    </label>
                                    <input
                                        type="password"
                                        id="confirmPassword"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                        className="w-full px-4 py-3 rounded-lg bg-indigo-900/20 border border-indigo-500/30 text-white placeholder-indigo-300/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300 hover:border-indigo-400"
                                        placeholder="Confirm your password"
                                    />
                                </motion.div>
                            </motion.div>

                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.7 }}
                                className="space-y-4"
                            >
                                <button 
                                    type="submit" 
                                    className="w-full bg-gradient-to-r from-indigo-500 to-blue-500 text-white py-4 text-lg font-medium rounded-lg hover:from-indigo-600 hover:to-blue-600 transition duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                                >
                                    Sign Up
                                </button>
                                {error && (
                                    <motion.p 
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="text-center text-red-400 bg-red-500/10 py-2 rounded-lg"
                                    >
                                        Error: {error}
                                    </motion.p>
                                )}
                                <div className="relative my-6">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-indigo-500/30"></div>
                                    </div>
                                    <div className="relative flex justify-center text-sm">
                                        <span className="px-2 bg-indigo-900/50 text-blue-300">Or continue with</span>
                                    </div>
                                </div>
                                <div className="flex flex-col space-y-3">
                                    <button
                                        type="button"
                                        onClick={handleGoogleLogin}
                                        className="w-full bg-white text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-50 transition duration-300 shadow-md hover:shadow-lg flex items-center justify-center space-x-3 border border-gray-200"
                                    >
                                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                                            <path
                                                fill="#4285F4"
                                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                            />
                                            <path
                                                fill="#34A853"
                                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                            />
                                            <path
                                                fill="#FBBC05"
                                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                            />
                                            <path
                                                fill="#EA4335"
                                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                            />
                                        </svg>
                                        <span className="font-medium">Google</span>
                                    </button>
                                </div>
                                <p className="text-center text-blue-200">
                                    Already have an account?{" "}
                                    <Link 
                                        to="/login" 
                                        className="text-indigo-400 hover:text-indigo-300 transition-colors duration-300 font-medium hover:underline"
                                    >
                                        Login
                                    </Link>
                                </p>
                            </motion.div>
                        </form>
                    </div>
                </motion.div>
            </div>
        </>
    )
}

export default Signup

