"use client"
import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom"
import { FaUserCircle, FaSignOutAlt, FaSignInAlt, FaUserPlus, FaHeartbeat } from "react-icons/fa"
import axios from "axios";

const Navbar = ({ isAuthenticated, user, onLogout }) => {
    const navigate = useNavigate()
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setMenuOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = async () => {
        try {
            // Close the menu if it's open
            setMenuOpen(false);
            
            // Get the token and user from localStorage
            const token = localStorage.getItem('token');
            const userData = localStorage.getItem('user');
            
            // Call the backend logout endpoint
            if (token) {
                const parsedUser = userData ? JSON.parse(userData) : {};
                
                // Make the logout request to the backend
                await axios.post(
                    "http://localhost:5001/users/logout",
                    { userId: parsedUser.id },
                    { 
                        headers: { 
                            Authorization: `Bearer ${token}` 
                        } 
                    }
                );
            }
            
            // Call the parent's logout handler
            if (onLogout) {
                onLogout();
            }
            
            // Clear any local storage items
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            
            // Display success message (optional)
            console.log('Logout successful');
            
            // Navigate to login page
            navigate('/login', { replace: true });
        } catch (error) {
            console.error('Logout error:', error);
            
            // Even if there's an error on the server, we should still clean up locally
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            
            // Call the parent's logout handler even if there was an error
            if (onLogout) {
                onLogout();
            }
            
            // Still navigate to login page even if there's an error
            navigate('/login', { replace: true });
        }
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
                                    to="/symptoms"
                                    className="text-blue-200 hover:text-white px-3 py-2 rounded-lg transition-all duration-300 hover:bg-indigo-500/20"
                                >
                                    Symptoms
                                </Link>
                                <Link
                                    to="/diet"
                                    className="text-blue-200 hover:text-white px-3 py-2 rounded-lg transition-all duration-300 hover:bg-indigo-500/20"
                                >
                                    Diet
                                </Link>
                                <Link
                                    to="/reminders"
                                    className="text-blue-200 hover:text-white px-3 py-2 rounded-lg transition-all duration-300 hover:bg-indigo-500/20"
                                >
                                    Reminders
                                </Link>
                                <div className="relative" ref={menuRef}>
                                    <button
                                        onClick={() => setMenuOpen(!menuOpen)}
                                        className="flex items-center space-x-2 text-blue-200 hover:text-white px-3 py-2 rounded-lg transition-all duration-300 hover:bg-indigo-500/20"
                                    >
                                        {user?.profilePicture ? (
                                            <img
                                                src={user.profilePicture}
                                                alt="Profile"
                                                className="w-8 h-8 rounded-full border-2 border-indigo-500"
                                            />
                                        ) : (
                                            <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center">
                                                <FaUserCircle className="w-5 h-5 text-white" />
                                            </div>
                                        )}
                                        <span className="text-sm font-medium">{user?.username || 'Profile'}</span>
                                    </button>

                                    {menuOpen && (
                                        <div className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-xl shadow-lg z-50 animate-fade-in">
                                            <button
                                                className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 rounded-t-xl"
                                                onClick={() => navigate("/profile")}
                                            >
                                                View Profile
                                            </button>
                                            <button
                                                className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 rounded-b-xl"
                                                onClick={handleLogout}
                                            >
                                                Sign Out
                                            </button>
                                        </div>
                                    )}
                                </div>
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
                            onClick={() => setMenuOpen(!menuOpen)}
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
            {menuOpen && (
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
                                    to="/symptoms"
                                    className="block text-blue-200 hover:text-white px-3 py-2 rounded-lg transition-all duration-300 hover:bg-indigo-500/20"
                                >
                                    Symptoms
                                </Link>
                                <Link
                                    to="/diet"
                                    className="block text-blue-200 hover:text-white px-3 py-2 rounded-lg transition-all duration-300 hover:bg-indigo-500/20"
                                >
                                    Diet
                                </Link>
                                <Link
                                    to="/reminders"
                                    className="block text-blue-200 hover:text-white px-3 py-2 rounded-lg transition-all duration-300 hover:bg-indigo-500/20"
                                >
                                    Reminders
                                </Link>
                                <div className="relative">
                                    <button
                                        onClick={() => navigate("/profile")}
                                        className="flex items-center space-x-2 text-blue-200 hover:text-white px-3 py-2 rounded-lg transition-all duration-300 hover:bg-indigo-500/20 w-full"
                                    >
                                        {user?.profilePicture ? (
                                            <img
                                                src={user.profilePicture}
                                                alt="Profile"
                                                className="w-8 h-8 rounded-full border-2 border-indigo-500"
                                            />
                                        ) : (
                                            <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center">
                                                <FaUserCircle className="w-5 h-5 text-white" />
                                            </div>
                                        )}
                                        <span className="text-sm font-medium">{user?.username || 'Profile'}</span>
                                    </button>
                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center space-x-2 text-blue-200 hover:text-white px-3 py-2 rounded-lg transition-all duration-300 hover:bg-indigo-500/20 w-full"
                                    >
                                        <FaSignOutAlt className="w-4 h-4" />
                                        <span>Sign Out</span>
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className="block text-blue-200 hover:text-white px-3 py-2 rounded-lg transition-all duration-300 hover:bg-indigo-500/20"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/signup"
                                    className="block text-blue-200 hover:text-white px-3 py-2 rounded-lg transition-all duration-300 hover:bg-indigo-500/20"
                                >
                                    Sign Up
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar; 