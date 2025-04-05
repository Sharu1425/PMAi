"use client"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import AnimatedBackground from "../components/AnimatedBackground"

function Home() {
    return (
        <>
            <AnimatedBackground />
            <div className="min-h-screen relative overflow-hidden">
                {/* Hero Section */}
                <div className="relative z-10">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 md:pt-32 md:pb-24">
                        <div className="text-center">
                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8 }}
                                className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6"
                            >
                                Your Personal <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Medical AI</span> Assistant
                            </motion.h1>
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.2 }}
                                className="text-lg md:text-xl text-purple-200 max-w-3xl mx-auto mb-12"
                            >
                                Experience the future of healthcare with AI-powered medical assistance, personalized health insights, and real-time wellness tracking.
                            </motion.p>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.4 }}
                                className="flex flex-col sm:flex-row gap-4 justify-center"
                            >
                                <Link
                                    to="/signup"
                                    className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-lg font-semibold rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                                >
                                    Get Started
                                </Link>
                                <Link
                                    to="/login"
                                    className="px-8 py-4 bg-white/10 text-white text-lg font-semibold rounded-lg hover:bg-white/20 transition-all duration-300 backdrop-blur-sm"
                                >
                                    Sign In
                                </Link>
                            </motion.div>
                        </div>
                    </div>
                </div>

                {/* Features Section */}
                <div className="relative z-10 py-16 md:py-24 bg-gradient-to-b from-transparent to-purple-900/20">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            viewport={{ once: true }}
                            className="text-center mb-16"
                        >
                            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Why Choose PMAi?</h2>
                            <p className="text-lg text-purple-200 max-w-2xl mx-auto">
                                Experience healthcare like never before with our cutting-edge AI technology
                            </p>
                        </motion.div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {features.map((feature, index) => (
                                <motion.div
                                    key={feature.title}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.2 }}
                                    viewport={{ once: true }}
                                    className="glass-card p-8 rounded-2xl border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300"
                                >
                                    <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-6">
                                        {feature.icon}
                                    </div>
                                    <h3 className="text-xl font-semibold text-white mb-4">{feature.title}</h3>
                                    <p className="text-purple-200 leading-relaxed">{feature.description}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* CTA Section */}
                <div className="relative z-10 py-16 md:py-24">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            viewport={{ once: true }}
                            className="glass-card p-8 md:p-12 rounded-2xl border border-purple-500/20"
                        >
                            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                                Ready to Transform Your Healthcare Experience?
                            </h2>
                            <p className="text-lg text-purple-200 mb-8">
                                Join thousands of users who are already experiencing the future of healthcare with PMAi.
                            </p>
                            <Link
                                to="/signup"
                                className="inline-block px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-lg font-semibold rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                            >
                                Start Your Journey Today
                            </Link>
                        </motion.div>
                    </div>
                </div>
            </div>
        </>
    );
}

const features = [
    {
        title: "AI-Powered Health Analysis",
        description: "Get instant, accurate health insights powered by advanced AI algorithms that analyze your symptoms and medical history.",
        icon: (
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
        ),
    },
    {
        title: "Personalized Care Plans",
        description: "Receive customized health recommendations and treatment plans tailored to your unique medical needs and lifestyle.",
        icon: (
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
        ),
    },
    {
        title: "Real-time Health Tracking",
        description: "Monitor your health metrics, medication schedules, and wellness progress with our intuitive tracking system.",
        icon: (
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
        ),
    },
]

export default Home

