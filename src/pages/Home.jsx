"use client"
import React from 'react';
import { Link } from 'react-router-dom';
import { FaHeartbeat, FaBrain, FaChartLine, FaCalendarAlt, FaUserMd } from 'react-icons/fa';
import AnimatedBackground from '@/components/AnimatedBackground'

function Home() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 relative overflow-hidden">
            <AnimatedBackground />
            
            {/* Hero Section */}
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="text-center">
                    <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 drop-shadow-lg">
                        Your Personal Health
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-blue-400 drop-shadow-lg">
                            {" "}Companion
                        </span>
                    </h1>
                    <p className="text-xl text-gray-100 mb-8 max-w-3xl mx-auto drop-shadow">
                        PMAi helps you track your health, manage medications, and get personalized diet recommendations - all in one place.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            to="/login"
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl text-lg font-semibold transition-all duration-300 transform hover:-translate-y-0.5"
                        >
                            Get Started
                        </Link>
                        <Link
                            to="/signup"
                            className="bg-gray-700 hover:bg-gray-600 text-white px-8 py-3 rounded-xl text-lg font-semibold transition-all duration-300 transform hover:-translate-y-0.5"
                        >
                            Sign Up
                        </Link>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div className="relative z-10 bg-gray-800/50 backdrop-blur-lg py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-white text-center mb-12 drop-shadow-lg">
                        Key Features
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {/* Symptom Analysis */}
                        <div className="bg-gray-700/30 rounded-2xl p-6 border border-gray-600/30 hover:border-indigo-500/50 transition-all duration-300 transform hover:-translate-y-1">
                            <div className="w-12 h-12 bg-indigo-500 rounded-xl flex items-center justify-center mb-4">
                                <FaBrain className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="text-xl font-semibold text-white mb-2 drop-shadow">Symptom Analysis</h3>
                            <p className="text-gray-300">
                                Get instant analysis of your symptoms and receive personalized health recommendations.
                            </p>
                        </div>

                        {/* Health Tracking */}
                        <div className="bg-gray-700/30 rounded-2xl p-6 border border-gray-600/30 hover:border-indigo-500/50 transition-all duration-300 transform hover:-translate-y-1">
                            <div className="w-12 h-12 bg-indigo-500 rounded-xl flex items-center justify-center mb-4">
                                <FaChartLine className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="text-xl font-semibold text-white mb-2 drop-shadow">Health Tracking</h3>
                            <p className="text-gray-300">
                                Monitor your health metrics and track your progress over time.
                            </p>
                        </div>

                        {/* Diet Planning */}
                        <div className="bg-gray-700/30 rounded-2xl p-6 border border-gray-600/30 hover:border-indigo-500/50 transition-all duration-300 transform hover:-translate-y-1">
                            <div className="w-12 h-12 bg-indigo-500 rounded-xl flex items-center justify-center mb-4">
                                <FaHeartbeat className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="text-xl font-semibold text-white mb-2 drop-shadow">Diet Planning</h3>
                            <p className="text-gray-300">
                                Receive personalized diet recommendations based on your health goals.
                            </p>
                        </div>

                        {/* Medication Reminders */}
                        <div className="bg-gray-700/30 rounded-2xl p-6 border border-gray-600/30 hover:border-indigo-500/50 transition-all duration-300 transform hover:-translate-y-1">
                            <div className="w-12 h-12 bg-indigo-500 rounded-xl flex items-center justify-center mb-4">
                                <FaCalendarAlt className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="text-xl font-semibold text-white mb-2 drop-shadow">Medication Reminders</h3>
                            <p className="text-gray-300">
                                Never miss a dose with our smart medication reminder system.
                            </p>
                        </div>

                        {/* Virtual Consultation */}
                        <div className="bg-gray-700/30 rounded-2xl p-6 border border-gray-600/30 hover:border-indigo-500/50 transition-all duration-300 transform hover:-translate-y-1">
                            <div className="w-12 h-12 bg-indigo-500 rounded-xl flex items-center justify-center mb-4">
                                <FaUserMd className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="text-xl font-semibold text-white mb-2 drop-shadow">Virtual Consultation</h3>
                            <p className="text-gray-300">
                                Connect with healthcare professionals for virtual consultations.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="relative z-10 bg-gray-900/50 backdrop-blur-lg py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center text-gray-400">
                        <p>© 2024 PMAi. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default Home

