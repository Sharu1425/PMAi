"use client"
import React from 'react';
import { Link } from 'react-router-dom';
import { FaHeartbeat, FaStethoscope, FaChartLine, FaBell } from 'react-icons/fa';
import AnimatedBackground from '../components/AnimatedBackground'

const Home = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
            <AnimatedBackground />
            
            {/* Hero Section */}
            <div className="container mx-auto px-4 py-20">
                <div className="text-center">
                    <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-blue-400">
                        Your Personal Health Assistant
                    </h1>
                    <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
                        Experience personalized healthcare with AI-powered symptom analysis, diet planning, and health tracking.
                    </p>
                    <div className="flex justify-center gap-4">
                        <Link
                            to="/login"
                            className="px-8 py-3 bg-gradient-to-r from-indigo-500 to-blue-500 text-white rounded-lg hover:from-indigo-600 hover:to-blue-600 transform hover:-translate-y-0.5 transition-all duration-300 shadow-lg hover:shadow-xl"
                        >
                            Get Started
                        </Link>
                        <Link
                            to="/signup"
                            className="px-8 py-3 border border-indigo-500 text-indigo-400 rounded-lg hover:bg-indigo-500/10 transform hover:-translate-y-0.5 transition-all duration-300"
                        >
                            Sign Up
                        </Link>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div className="container mx-auto px-4 py-20">
                <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700 hover:border-indigo-500 transition-all duration-300">
                        <FaStethoscope className="w-12 h-12 text-indigo-400 mb-4" />
                        <h3 className="text-xl font-semibold mb-2">Symptom Analysis</h3>
                        <p className="text-gray-400">Get instant AI-powered analysis of your symptoms and potential conditions.</p>
                    </div>
                    <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700 hover:border-indigo-500 transition-all duration-300">
                        <FaChartLine className="w-12 h-12 text-indigo-400 mb-4" />
                        <h3 className="text-xl font-semibold mb-2">Health Tracking</h3>
                        <p className="text-gray-400">Monitor your health metrics and track your progress over time.</p>
                    </div>
                    <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700 hover:border-indigo-500 transition-all duration-300">
                        <FaHeartbeat className="w-12 h-12 text-indigo-400 mb-4" />
                        <h3 className="text-xl font-semibold mb-2">Diet Planning</h3>
                        <p className="text-gray-400">Receive personalized diet recommendations based on your health goals.</p>
                    </div>
                    <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700 hover:border-indigo-500 transition-all duration-300">
                        <FaBell className="w-12 h-12 text-indigo-400 mb-4" />
                        <h3 className="text-xl font-semibold mb-2">Medical Reminders</h3>
                        <p className="text-gray-400">Never miss a medication or appointment with smart reminders.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home

