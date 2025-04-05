"use client"
import { Link } from "react-router-dom"
import { FaStethoscope, FaBrain, FaChartLine, FaUserMd } from 'react-icons/fa'

const Home = () => {
    return (
        <div className="min-h-screen">
            {/* Hero Section with Animated Background */}
            <div className="relative overflow-hidden pt-16">
                <div className="absolute inset-0 animated-gradient" />
                <div className="relative z-10">
                    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                        <div className="text-center">
                            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6">
                                Your Personal Medical AI Assistant
                            </h1>
                            <p className="text-xl text-white/90 max-w-2xl mx-auto mb-8">
                                Experience the future of healthcare with our AI-powered medical assistant. Get personalized health insights, track your wellness, and make informed decisions about your health.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link to="/signup" className="btn btn-primary">
                                    Get Started
                                </Link>
                                <Link to="/login" className="btn btn-secondary">
                                    Sign In
                                </Link>
                            </div>
                        </div>
                    </main>
                </div>
            </div>

            {/* Features Section */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <div className="p-6 rounded-xl bg-white shadow-lg hover:shadow-xl transition-shadow">
                            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-4">
                                <FaStethoscope className="w-8 h-8 text-primary-600" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">AI-Powered Diagnosis</h3>
                            <p className="text-gray-600">Get instant preliminary health assessments based on your symptoms and medical history.</p>
                        </div>
                        <div className="p-6 rounded-xl bg-white shadow-lg hover:shadow-xl transition-shadow">
                            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-4">
                                <FaBrain className="w-8 h-8 text-primary-600" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Smart Health Tracking</h3>
                            <p className="text-gray-600">Monitor your health metrics and receive personalized insights and recommendations.</p>
                        </div>
                        <div className="p-6 rounded-xl bg-white shadow-lg hover:shadow-xl transition-shadow">
                            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-4">
                                <FaChartLine className="w-8 h-8 text-primary-600" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Health Analytics</h3>
                            <p className="text-gray-600">Visualize your health data and track progress over time with detailed analytics.</p>
                        </div>
                        <div className="p-6 rounded-xl bg-white shadow-lg hover:shadow-xl transition-shadow">
                            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-4">
                                <FaUserMd className="w-8 h-8 text-primary-600" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">24/7 Medical Support</h3>
                            <p className="text-gray-600">Access medical guidance and support whenever you need it, day or night.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-primary-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-bold mb-6">Ready to Take Control of Your Health?</h2>
                    <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                        Join thousands of users who are already experiencing the benefits of AI-powered healthcare.
                    </p>
                    <Link to="/signup" className="btn btn-primary">
                        Start Your Journey Today
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default Home

