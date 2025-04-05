"use client"
import { Link } from "react-router-dom"
import { useNavigate } from "react-router-dom"

const Navbar = ({ isAuthenticated, onLogout }) => {
    const navigate = useNavigate()

    const handleLogout = () => {
        onLogout()
        navigate('/')
    }

    return (
        <nav className="bg-gradient-to-r from-indigo-900/80 to-blue-900/80 backdrop-blur-lg border-b border-indigo-500/20 fixed w-full top-0 left-0 z-50 shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex-shrink-0">
                        <Link to="/" className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 to-blue-300">
                            PMAi
                        </Link>
                    </div>
                    <div className="flex items-center space-x-4">
                        {isAuthenticated ? (
                            <>
                                <Link to="/dashboard" className="text-blue-200 hover:text-white transition-colors">
                                    Dashboard
                                </Link>
                                <Link to="/profile" className="text-blue-200 hover:text-white transition-colors">
                                    Profile
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="text-blue-200 hover:text-white transition-colors"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="text-blue-200 hover:text-white transition-colors">
                                    Login
                                </Link>
                                <Link
                                    to="/signup"
                                    className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white px-4 py-2 rounded-lg hover:from-indigo-600 hover:to-blue-600 transition-all duration-300 transform hover:-translate-y-0.5 shadow-md"
                                >
                                    Sign Up
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Navbar 