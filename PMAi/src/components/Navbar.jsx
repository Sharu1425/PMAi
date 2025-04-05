"use client"
import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom"
import { FaUserCircle, FaSignOutAlt, FaSignInAlt, FaUserPlus, FaHeartbeat, FaChevronDown } from "react-icons/fa"
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

const Navbar = ({ isAuthenticated, user, onLogout }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [menuOpen, setMenuOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const menuRef = useRef(null);
    const profileRef = useRef(null);

    // Close menus when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setMenuOpen(false);
            }
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                setProfileOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Close menus when route changes
    useEffect(() => {
        setMenuOpen(false);
        setProfileOpen(false);
    }, [location]);

    const handleLogout = async () => {
        try {
            // Close the menu if it's open
            setProfileOpen(false);
            
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

    // Check if a nav link is active
    const isActive = (path) => {
        return location.pathname === path;
    };

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-lg border-b border-indigo-500/20 shadow-lg">
            <div className="glass-card">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo and Brand */}
                        <motion.div 
                            className="flex items-center"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <Link to="/" className="flex items-center space-x-2 group">
                                <FaHeartbeat className="w-8 h-8 text-indigo-400 group-hover:text-indigo-300 transition-colors duration-300" />
                                <span className="text-2xl font-bold gradient-text">
                                    PMAi
                                </span>
                            </Link>
                        </motion.div>

                        {/* Navigation Links - Desktop */}
                        <div className="hidden md:flex items-center space-x-4">
                            {isAuthenticated ? (
                                <>
                                    <NavLink to="/dashboard" active={isActive("/dashboard")}>
                                        Dashboard
                                    </NavLink>
                                    <NavLink to="/symptoms" active={isActive("/symptoms")}>
                                        Symptoms
                                    </NavLink>
                                    <NavLink to="/diet" active={isActive("/diet")}>
                                        Diet
                                    </NavLink>
                                    <NavLink to="/reminders" active={isActive("/reminders")}>
                                        Reminders
                                    </NavLink>
                                    <div className="relative" ref={profileRef}>
                                        <button
                                            onClick={() => setProfileOpen(!profileOpen)}
                                            className={`flex items-center space-x-2 px-3 py-2 rounded-xl transition-all duration-300 ${
                                                profileOpen 
                                                    ? "bg-indigo-500/30 text-white" 
                                                    : "text-blue-200 hover:text-white hover:bg-indigo-500/20"
                                            }`}
                                        >
                                            {user?.profilePicture ? (
                                                <motion.img
                                                    src={user.profilePicture}
                                                    alt="Profile"
                                                    className="w-8 h-8 rounded-full border-2 border-indigo-500"
                                                    whileHover={{ scale: 1.1 }}
                                                />
                                            ) : (
                                                <motion.div 
                                                    className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center"
                                                    whileHover={{ scale: 1.1 }}
                                                >
                                                    <FaUserCircle className="w-5 h-5 text-white" />
                                                </motion.div>
                                            )}
                                            <span className="text-sm font-medium">{user?.username || 'Profile'}</span>
                                            <FaChevronDown className={`w-3 h-3 transition-transform duration-300 ${profileOpen ? 'rotate-180' : ''}`} />
                                        </button>

                                        <AnimatePresence>
                                            {profileOpen && (
                                                <motion.div 
                                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                    transition={{ duration: 0.2 }}
                                                    className="absolute right-0 mt-2 w-48 glass-card rounded-xl shadow-lg z-50 overflow-hidden"
                                                >
                                                    <div className="py-1">
                                                        <button
                                                            className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-indigo-500/30 hover:text-white transition-colors duration-200"
                                                            onClick={() => navigate("/profile")}
                                                        >
                                                            View Profile
                                                        </button>
                                                        <button
                                                            className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-indigo-500/30 hover:text-white transition-colors duration-200"
                                                            onClick={handleLogout}
                                                        >
                                                            <div className="flex items-center space-x-2">
                                                                <FaSignOutAlt className="w-4 h-4" />
                                                                <span>Sign Out</span>
                                                            </div>
                                                        </button>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <Link
                                        to="/login"
                                        className="flex items-center space-x-2 text-blue-200 hover:text-white px-3 py-2 rounded-xl transition-all duration-300 hover:bg-indigo-500/20"
                                    >
                                        <FaSignInAlt className="w-4 h-4" />
                                        <span>Login</span>
                                    </Link>
                                    <Link
                                        to="/signup"
                                        className="flex items-center space-x-2 bg-gradient-to-r from-indigo-500 to-blue-500 text-white px-4 py-2 rounded-xl transition-all duration-300 hover:from-indigo-600 hover:to-blue-600 transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl"
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
                                className="text-blue-200 hover:text-white p-2 rounded-lg focus:outline-none"
                                aria-label="Toggle menu"
                                onClick={() => setMenuOpen(!menuOpen)}
                            >
                                <div className="w-6 h-6 relative flex flex-col justify-center items-center">
                                    <span className={`block w-5 h-0.5 bg-current rounded-full transition-all duration-300 ease-in-out ${menuOpen ? 'absolute rotate-45' : 'mb-1.5'}`}></span>
                                    <span className={`block w-5 h-0.5 bg-current rounded-full transition-all duration-300 ease-in-out ${menuOpen ? 'opacity-0' : 'mb-1.5'}`}></span>
                                    <span className={`block w-5 h-0.5 bg-current rounded-full transition-all duration-300 ease-in-out ${menuOpen ? 'absolute -rotate-45' : ''}`}></span>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {menuOpen && (
                        <motion.div 
                            className="md:hidden"
                            ref={menuRef}
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className="px-4 pt-2 pb-4 space-y-2">
                                {isAuthenticated ? (
                                    <>
                                        <MobileNavLink to="/dashboard" active={isActive("/dashboard")}>
                                            Dashboard
                                        </MobileNavLink>
                                        <MobileNavLink to="/symptoms" active={isActive("/symptoms")}>
                                            Symptoms
                                        </MobileNavLink>
                                        <MobileNavLink to="/diet" active={isActive("/diet")}>
                                            Diet
                                        </MobileNavLink>
                                        <MobileNavLink to="/reminders" active={isActive("/reminders")}>
                                            Reminders
                                        </MobileNavLink>
                                        <MobileNavLink to="/profile" active={isActive("/profile")}>
                                            Profile
                                        </MobileNavLink>
                                        <div 
                                            onClick={handleLogout}
                                            className="flex items-center justify-between w-full px-3 py-2 text-left rounded-xl text-red-300 hover:bg-red-500/20 transition-all duration-300"
                                        >
                                            <span>Sign Out</span>
                                            <FaSignOutAlt className="w-4 h-4" />
                                        </div>
                                    </>
                                ) : (
                                    <div className="flex flex-col space-y-2">
                                        <Link
                                            to="/login"
                                            className="flex items-center justify-center space-x-2 text-blue-200 hover:text-white px-3 py-2 rounded-xl transition-all duration-300 hover:bg-indigo-500/20"
                                        >
                                            <FaSignInAlt className="w-4 h-4" />
                                            <span>Login</span>
                                        </Link>
                                        <Link
                                            to="/signup"
                                            className="flex items-center justify-center space-x-2 bg-gradient-to-r from-indigo-500 to-blue-500 text-white px-4 py-2 rounded-xl transition-all duration-300 hover:from-indigo-600 hover:to-blue-600"
                                        >
                                            <FaUserPlus className="w-4 h-4" />
                                            <span>Sign Up</span>
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </nav>
    );
}

// Desktop Navigation Link Component
const NavLink = ({ to, active, children }) => (
    <Link
        to={to}
        className={`relative px-3 py-2 rounded-xl transition-all duration-300 ${
            active 
                ? "text-white" 
                : "text-blue-200 hover:text-white hover:bg-indigo-500/20"
        }`}
    >
        <span>{children}</span>
        {active && (
            <motion.div
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500 rounded-full"
                layoutId="activeNavIndicator"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
            />
        )}
    </Link>
);

// Mobile Navigation Link Component
const MobileNavLink = ({ to, active, children }) => (
    <Link
        to={to}
        className={`block px-3 py-2 rounded-xl transition-all duration-300 ${
            active 
                ? "bg-indigo-500/30 text-white" 
                : "text-blue-200 hover:text-white hover:bg-indigo-500/20"
        }`}
    >
        {children}
        {active && (
            <motion.div
                className="h-0.5 bg-indigo-500 rounded-full mt-1"
                layoutId="activeMobileNavIndicator"
                initial={{ opacity: 0, width: "0%" }}
                animate={{ opacity: 1, width: "100%" }}
                transition={{ duration: 0.3 }}
            />
        )}
    </Link>
);

export default Navbar; 