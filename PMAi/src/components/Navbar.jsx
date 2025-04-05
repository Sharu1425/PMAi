"use client"
import { Link, useNavigate } from "react-router-dom"
import { FaUserCircle, FaSignOutAlt, FaSignInAlt, FaUserPlus, FaHeartbeat } from "react-icons/fa"

const Navbar = () => {
    const navigate = useNavigate()
    const isAuthenticated = false // This should come from your auth context

    const handleLogout = () => {
        // Handle logout logic here
        navigate("/")
    }

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-indigo-900/90 to-blue-900/90 backdrop-blur-lg border-b border-indigo-500/20 shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo and Brand */}
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center space-x-2 group">
                            <FaHeartbeat className="w-8 h-8 text-indigo-400 group-hover:text-indigo-300 transition-colors duration-300" />
                            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 to-blue-300 group-hover:from-indigo-200 group-hover:to-blue-200 transition-all duration-300">
                                PMAi
                            </span>
                        </Link>
                    </div>

                    {/* Navigation Links */}
                    <div className="hidden md:flex items-center space-x-8">
                        {isAuthenticated ? (
                            <>
                                <Link
                                    to="/dashboard"
                                    className="text-blue-200 hover:text-white px-3 py-2 rounded-lg transition-all duration-300 hover:bg-indigo-500/20"
                                >
                                    Dashboard
                                </Link>
                                <Link
                                    to="/profile"
                                    className="text-blue-200 hover:text-white px-3 py-2 rounded-lg transition-all duration-300 hover:bg-indigo-500/20"
                                >
                                    Profile
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center space-x-2 text-blue-200 hover:text-white px-3 py-2 rounded-lg transition-all duration-300 hover:bg-indigo-500/20"
                                >
                                    <FaSignOutAlt className="w-4 h-4" />
                                    <span>Logout</span>
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className="flex items-center space-x-2 text-blue-200 hover:text-white px-3 py-2 rounded-lg transition-all duration-300 hover:bg-indigo-500/20"
                                >
                                    <FaSignInAlt className="w-4 h-4" />
                                    <span>Login</span>
                                </Link>
                                <Link
                                    to="/signup"
                                    className="flex items-center space-x-2 bg-gradient-to-r from-indigo-500 to-blue-500 text-white px-4 py-2 rounded-lg transition-all duration-300 hover:from-indigo-600 hover:to-blue-600 transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl"
                                >
                                    <FaUserPlus className="w-4 h-4" />
                                    <span>Sign Up</span>
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <button
                            type="button"
                            className="text-blue-200 hover:text-white focus:outline-none"
                            aria-label="Toggle menu"
                        >
                            <svg
                                className="h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 6h16M4 12h16M4 18h16"
                                />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <div className="md:hidden">
                <div className="px-2 pt-2 pb-3 space-y-1">
                    {isAuthenticated ? (
                        <>
                            <Link
                                to="/dashboard"
                                className="block text-blue-200 hover:text-white px-3 py-2 rounded-lg transition-all duration-300 hover:bg-indigo-500/20"
                            >
                                Dashboard
                            </Link>
                            <Link
                                to="/profile"
                                className="block text-blue-200 hover:text-white px-3 py-2 rounded-lg transition-all duration-300 hover:bg-indigo-500/20"
                            >
                                Profile
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="flex items-center space-x-2 text-blue-200 hover:text-white px-3 py-2 rounded-lg transition-all duration-300 hover:bg-indigo-500/20 w-full"
                            >
                                <FaSignOutAlt className="w-4 h-4" />
                                <span>Logout</span>
                            </button>
                        </>
                    ) : (
                        <>
                            <Link
                                to="/login"
                                className="flex items-center space-x-2 text-blue-200 hover:text-white px-3 py-2 rounded-lg transition-all duration-300 hover:bg-indigo-500/20"
                            >
                                <FaSignInAlt className="w-4 h-4" />
                                <span>Login</span>
                            </Link>
                            <Link
                                to="/signup"
                                className="flex items-center space-x-2 bg-gradient-to-r from-indigo-500 to-blue-500 text-white px-4 py-2 rounded-lg transition-all duration-300 hover:from-indigo-600 hover:to-blue-600 transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl"
                            >
                                <FaUserPlus className="w-4 h-4" />
                                <span>Sign Up</span>
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    )
}

export default Navbar 