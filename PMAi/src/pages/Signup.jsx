"use client"

import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { motion } from "framer-motion"
import AnimatedBackground from "../components/AnimatedBackground"
import axios from "axios"

const Signup = ({ setUser, setIsAuthenticated }) => {
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [error, setError] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsLoading(true)
        setError("")
        
        try {
            if (password !== confirmPassword) {
                setError("Passwords do not match")
                setIsLoading(false)
                return
            }
            
            console.log("Registering user:", { username, email, password })
            const response = await axios.post("http://localhost:5001/users/register", {
                username,
                email,
                password
            })
            
            console.log("Registration response:", response.data)
            
            if (response.data.error) {
                setError(response.data.error)
                setIsLoading(false)
                return
            }
            
            const { token, user } = response.data
            localStorage.setItem("token", token)
            localStorage.setItem("user", JSON.stringify(user))
            setUser(user)
            setIsAuthenticated(true)
            navigate("/dashboard")
        } catch (err) {
            console.error("Registration error:", err)
            setError(err.response?.data?.error || err.response?.data?.message || "An error occurred during registration")
        } finally {
            setIsLoading(false)
        }
    }

    const handleGoogleLogin = async () => {
        try {
            // Initialize Google OAuth client
            const client = window.google.accounts.oauth2.initTokenClient({
                client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
                scope: 'email profile',
                callback: async (response) => {
                    if (response.error) {
                        setError("Google authentication failed")
                        return
                    }

                    try {
                        const authResponse = await axios.post("http://localhost:5001/auth/google", {
                            tokenId: response.access_token
                        })

                        const { token, user } = authResponse.data
                        localStorage.setItem("token", token)
                        localStorage.setItem("user", JSON.stringify(user))
                        setUser(user)
                        setIsAuthenticated(true)
                        navigate("/dashboard")
                    } catch (err) {
                        setError(err.response?.data?.message || "Error with Google authentication")
                    }
                }
            })

            client.requestAccessToken()
        } catch (err) {
            setError("Error initializing Google authentication")
        }
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center p-4">
            <AnimatedBackground />
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="w-full max-w-md"
            >
                <motion.div 
                    className="glass-card p-8 rounded-2xl neon-border shadow-xl backdrop-blur-xl border-1 relative overflow-hidden"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                >
                    <motion.div 
                        className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-blue-500/10"
                        animate={{
                            background: [
                                'linear-gradient(45deg, rgba(99, 102, 241, 0.1), rgba(59, 130, 246, 0.1))',
                                'linear-gradient(45deg, rgba(59, 130, 246, 0.1), rgba(99, 102, 241, 0.1))',
                            ]
                        }}
                        transition={{ duration: 5, repeat: Infinity, repeatType: "reverse" }}
                    />
                    <motion.div
                        className="relative z-10"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                    >
                        <h2 className="text-3xl font-bold text-center mb-6 text-white">Create Account</h2>
                        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Username</label>
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full px-4 py-2 rounded-lg bg-white/10 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-4 py-2 rounded-lg bg-white/10 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Password</label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-4 py-2 rounded-lg bg-white/10 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Confirm Password</label>
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full px-4 py-2 rounded-lg bg-white/10 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className={`w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition duration-200 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                {isLoading ? 'Signing up...' : 'Sign Up'}
                            </button>
                        </form>
                        <div className="mt-4 text-center">
                            <p className="text-gray-300">
                                Already have an account?{" "}
                                <Link to="/login" className="text-blue-400 hover:text-blue-300">
                                    Login
                                </Link>
                            </p>
                        </div>
                        <div className="mt-4">
                            <button
                                onClick={handleGoogleLogin}
                                className="w-full py-2 px-4 bg-white hover:bg-gray-100 text-gray-700 font-semibold rounded-lg transition duration-200 flex items-center justify-center"
                            >
                                <img
                                    src="https://www.google.com/favicon.ico"
                                    alt="Google"
                                    className="w-5 h-5 mr-2"
                                />
                                Sign up with Google
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            </motion.div>
        </div>
    )
}

export default Signup

