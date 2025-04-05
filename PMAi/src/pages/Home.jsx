"use client"
import { Link } from "react-router-dom"
import { FaStethoscope, FaBrain, FaChartLine, FaUserMd, FaDna, FaHeartbeat, FaMicroscope, FaClinicMedical } from 'react-icons/fa'
import AnimatedBackground from '../components/AnimatedBackground'

const Home = () => {
    return (
        <div className="min-h-screen relative overflow-hidden">
            <AnimatedBackground />
            
            {/* Hero Section */}
            <div className="relative z-10">
                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                    <div className="text-center">
                        <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-blue-400 to-cyan-400">
                            Your Personal Medical AI Assistant
                        </h1>
                        <p className="text-xl text-blue-200 max-w-2xl mx-auto mb-8">
                            Experience the future of healthcare with our AI-powered medical assistant. Get personalized health insights, track your wellness, and make informed decisions about your health.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link 
                                to="/signup" 
                                className="px-8 py-4 rounded-xl font-medium transition-all duration-200 bg-gradient-to-r from-indigo-500 to-blue-500 text-white hover:from-indigo-600 hover:to-blue-600 transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl"
                            >
                                Get Started
                            </Link>
                            <Link 
                                to="/login" 
                                className="px-8 py-4 rounded-xl font-medium transition-all duration-200 border-2 border-indigo-400 text-indigo-200 hover:bg-indigo-500/20 hover:border-indigo-300"
                            >
                                Sign In
                            </Link>
                        </div>
                    </div>
                </main>
            </div>

            {/* Features Section */}
            <section className="relative z-10 py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-4xl font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-blue-400">
                        Key Features
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <div className="p-8 rounded-2xl glass-card shadow-xl hover:shadow-2xl transition-all duration-300 border border-indigo-500/20 hover:border-indigo-400/40">
                            <div className="w-20 h-20 bg-indigo-500/20 rounded-2xl flex items-center justify-center mb-6">
                                <FaDna className="w-10 h-10 text-indigo-400" />
                            </div>
                            <h3 className="text-2xl font-semibold mb-4 text-white">AI-Powered Diagnosis</h3>
                            <p className="text-indigo-200">Get instant preliminary health assessments based on your symptoms and medical history.</p>
                        </div>
                        <div className="p-8 rounded-2xl glass-card shadow-xl hover:shadow-2xl transition-all duration-300 border border-blue-500/20 hover:border-blue-400/40">
                            <div className="w-20 h-20 bg-blue-500/20 rounded-2xl flex items-center justify-center mb-6">
                                <FaHeartbeat className="w-10 h-10 text-blue-400" />
                            </div>
                            <h3 className="text-2xl font-semibold mb-4 text-white">Smart Health Tracking</h3>
                            <p className="text-blue-200">Monitor your health metrics and receive personalized insights and recommendations.</p>
                        </div>
                        <div className="p-8 rounded-2xl glass-card shadow-xl hover:shadow-2xl transition-all duration-300 border border-purple-500/20 hover:border-purple-400/40">
                            <div className="w-20 h-20 bg-purple-500/20 rounded-2xl flex items-center justify-center mb-6">
                                <FaMicroscope className="w-10 h-10 text-purple-400" />
                            </div>
                            <h3 className="text-2xl font-semibold mb-4 text-white">Health Analytics</h3>
                            <p className="text-purple-200">Visualize your health data and track progress over time with detailed analytics.</p>
                        </div>
                        <div className="p-8 rounded-2xl glass-card shadow-xl hover:shadow-2xl transition-all duration-300 border border-cyan-500/20 hover:border-cyan-400/40">
                            <div className="w-20 h-20 bg-cyan-500/20 rounded-2xl flex items-center justify-center mb-6">
                                <FaClinicMedical className="w-10 h-10 text-cyan-400" />
                            </div>
                            <h3 className="text-2xl font-semibold mb-4 text-white">24/7 Medical Support</h3>
                            <p className="text-cyan-200">Access medical guidance and support whenever you need it, day or night.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="relative z-10 py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-blue-400">
                        Ready to Take Control of Your Health?
                    </h2>
                    <p className="text-xl text-indigo-200 mb-8 max-w-2xl mx-auto">
                        Join thousands of users who are already experiencing the benefits of AI-powered healthcare.
                    </p>
                    <Link 
                        to="/signup" 
                        className="inline-block px-8 py-4 rounded-xl font-medium transition-all duration-200 bg-gradient-to-r from-indigo-500 to-blue-500 text-white hover:from-indigo-600 hover:to-blue-600 transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl"
                    >
                        Start Your Journey Today
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default Home

