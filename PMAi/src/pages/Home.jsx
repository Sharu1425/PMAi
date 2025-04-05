"use client"
import { Link } from "react-router-dom"
import { FaStethoscope, FaBrain, FaChartLine, FaUserMd } from 'react-icons/fa'

const Home = () => {
    return (
        <div className="min-h-screen">
            {/* Hero Section with Animated Background */}
            <div className="relative overflow-hidden">
                <div className="absolute inset-0 animated-gradient" />
                <div className="relative z-10">
                    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                        <div className="text-center">
                            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-purple-300">
                                Your Personal Medical AI Assistant
                            </h1>
                            <p className="text-xl text-blue-200 max-w-2xl mx-auto mb-8">
                                Experience the future of healthcare with our AI-powered medical assistant. Get personalized health insights, track your wellness, and make informed decisions about your health.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link to="/signup" className="px-6 py-3 rounded-lg font-medium transition-all duration-200 bg-gradient-to-r from-indigo-500 to-blue-500 text-white hover:from-indigo-600 hover:to-blue-600 transform hover:-translate-y-0.5 shadow-lg">
                                    Get Started
                                </Link>
                                <Link to="/login" className="px-6 py-3 rounded-lg font-medium transition-all duration-200 border border-indigo-400 text-indigo-200 hover:bg-indigo-500/20">
                                    Sign In
                                </Link>
                            </div>
                        </div>
                    </main>
                </div>
            </div>

            {/* Features Section */}
            <section className="py-20 bg-gradient-to-b from-gray-900 to-indigo-950">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-center mb-12 text-indigo-200">Key Features</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <div className="p-6 rounded-xl glass-card shadow-lg hover:shadow-xl transition-shadow border border-indigo-500/20">
                            <div className="w-16 h-16 bg-indigo-500/20 rounded-full flex items-center justify-center mb-4">
                                <FaStethoscope className="w-8 h-8 text-indigo-400" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2 text-white">AI-Powered Diagnosis</h3>
                            <p className="text-indigo-200">Get instant preliminary health assessments based on your symptoms and medical history.</p>
                        </div>
                        <div className="p-6 rounded-xl glass-card shadow-lg hover:shadow-xl transition-shadow border border-blue-500/20">
                            <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mb-4">
                                <FaBrain className="w-8 h-8 text-blue-400" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2 text-white">Smart Health Tracking</h3>
                            <p className="text-blue-200">Monitor your health metrics and receive personalized insights and recommendations.</p>
                        </div>
                        <div className="p-6 rounded-xl glass-card shadow-lg hover:shadow-xl transition-shadow border border-purple-500/20">
                            <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mb-4">
                                <FaChartLine className="w-8 h-8 text-purple-400" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2 text-white">Health Analytics</h3>
                            <p className="text-purple-200">Visualize your health data and track progress over time with detailed analytics.</p>
                        </div>
                        <div className="p-6 rounded-xl glass-card shadow-lg hover:shadow-xl transition-shadow border border-cyan-500/20">
                            <div className="w-16 h-16 bg-cyan-500/20 rounded-full flex items-center justify-center mb-4">
                                <FaUserMd className="w-8 h-8 text-cyan-400" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2 text-white">24/7 Medical Support</h3>
                            <p className="text-cyan-200">Access medical guidance and support whenever you need it, day or night.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-b from-indigo-950 to-gray-900">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-bold mb-6 text-white">Ready to Take Control of Your Health?</h2>
                    <p className="text-xl text-indigo-200 mb-8 max-w-2xl mx-auto">
                        Join thousands of users who are already experiencing the benefits of AI-powered healthcare.
                    </p>
                    <Link to="/signup" className="px-6 py-3 rounded-lg font-medium transition-all duration-200 bg-gradient-to-r from-indigo-500 to-blue-500 text-white hover:from-indigo-600 hover:to-blue-600 transform hover:-translate-y-0.5 shadow-lg">
                        Start Your Journey Today
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default Home

