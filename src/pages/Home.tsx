"use client"

import type React from "react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { Stethoscope, Apple, Pill, TrendingUp, Bot, Shield, Clock, Heart, Star, Users, Award, Zap } from "lucide-react"
import GlassCard from "@/components/ui/GlassCard"
import AnimatedButton from "@/components/ui/AnimatedButton"

const Home: React.FC = () => {
  const features = [
    {
      icon: Stethoscope,
      title: "AI Symptom Analysis",
      description: "Get instant insights about your symptoms with our advanced AI-powered analysis system.",
      color: "from-blue-500 to-cyan-500",
      delay: 0.1,
    },
    {
      icon: Apple,
      title: "Personalized Diet Plans",
      description: "Receive customized nutrition recommendations based on your health goals and preferences.",
      color: "from-green-500 to-emerald-500",
      delay: 0.2,
    },
    {
      icon: Pill,
      title: "Smart Medication Reminders",
      description: "Never miss a dose with intelligent medication tracking and reminder notifications.",
      color: "from-purple-500 to-violet-500",
      delay: 0.3,
    },
    {
      icon: TrendingUp,
      title: "Health Analytics",
      description: "Track your health progress with comprehensive analytics and visual insights.",
      color: "from-orange-500 to-red-500",
      delay: 0.4,
    },
  ]

  const stats = [
    { number: "10K+", label: "Active Users", icon: Users },
    { number: "50K+", label: "Consultations", icon: Stethoscope },
    { number: "99.9%", label: "Uptime", icon: Shield },
    { number: "24/7", label: "Support", icon: Clock },
  ]

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Patient",
      content: "PMAi has revolutionized how I manage my health. The AI insights are incredibly accurate!",
      rating: 5,
    },
    {
      name: "Dr. Michael Chen",
      role: "Healthcare Professional",
      content: "An excellent tool for patient engagement and health monitoring. Highly recommended.",
      rating: 5,
    },
    {
      name: "Emily Rodriguez",
      role: "Wellness Enthusiast",
      content: "The personalized diet recommendations have helped me achieve my health goals faster.",
      rating: 5,
    },
  ]

  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="mb-8"
            >
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
                Your Personal
                <span className="block text-gradient">Medical Assistant</span>
              </h1>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                Experience the future of healthcare with AI-powered symptom analysis, personalized diet recommendations,
                and intelligent medication management.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
            >
              <Link to="/signup">
                <AnimatedButton variant="primary" size="lg" shimmer>
                  <div className="flex items-center space-x-2">
                    <Zap className="w-5 h-5" />
                    <span>Get Started Free</span>
                  </div>
                </AnimatedButton>
              </Link>
              <Link to="/login">
                <AnimatedButton variant="outline" size="lg">
                  Sign In
                </AnimatedButton>
              </Link>
            </motion.div>

            {/* Hero Animation */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
              className="relative max-w-4xl mx-auto"
            >
              <div className="relative">
                <GlassCard className="p-12 text-center">
                  <motion.div
                    animate={{
                      rotate: [0, 360],
                      scale: [1, 1.1, 1],
                    }}
                    transition={{
                      rotate: { duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" },
                      scale: { duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" },
                    }}
                    className="w-32 h-32 mx-auto bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center shadow-2xl glow-purple"
                  >
                    <Bot className="w-16 h-16 text-white" />
                  </motion.div>
                </GlassCard>

                {/* Floating elements */}
                {[Heart, Shield, Clock].map((Icon, index) => (
                  <motion.div
                    key={index}
                    className="absolute w-16 h-16 glass-card flex items-center justify-center"
                    style={{
                      top: `${20 + index * 25}%`,
                      left: index % 2 === 0 ? "10%" : "85%",
                    }}
                    animate={{
                      y: [0, -20, 0],
                      rotate: [0, 10, -10, 0],
                    }}
                    transition={{
                      duration: 3 + index,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "easeInOut",
                      delay: index * 0.5,
                    }}
                  >
                    <Icon className="w-8 h-8 text-purple-400" />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Powerful Features for Your Health</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Discover how our AI-powered platform can transform your healthcare experience
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: feature.delay }}
                  viewport={{ once: true }}
                >
                  <GlassCard hover glow className="h-full">
                    <div className="text-center">
                      <div
                        className={`w-16 h-16 mx-auto mb-6 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center shadow-2xl`}
                      >
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-white mb-4">{feature.title}</h3>
                      <p className="text-gray-300 leading-relaxed">{feature.description}</p>
                    </div>
                  </GlassCard>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <GlassCard className="p-12">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {stats.map((stat, index) => {
                  const Icon = stat.icon
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.8, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      className="text-center"
                    >
                      <Icon className="w-8 h-8 text-purple-400 mx-auto mb-3" />
                      <div className="text-3xl md:text-4xl font-bold text-white mb-2">{stat.number}</div>
                      <div className="text-gray-300 font-medium">{stat.label}</div>
                    </motion.div>
                  )
                })}
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">What Our Users Say</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Join thousands of satisfied users who trust PMAi for their healthcare needs
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <GlassCard hover className="h-full">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-300 mb-6 leading-relaxed">"{testimonial.content}"</p>
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center mr-4">
                      <span className="text-white font-semibold">{testimonial.name.charAt(0)}</span>
                    </div>
                    <div>
                      <h4 className="text-white font-semibold">{testimonial.name}</h4>
                      <p className="text-gray-400 text-sm">{testimonial.role}</p>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <GlassCard className="p-12 text-center" glow>
              <Award className="w-16 h-16 text-purple-400 mx-auto mb-6" />
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to Transform Your Health?</h2>
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                Join thousands of users who trust PMAi for their healthcare needs. Start your journey to better health
                today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/signup">
                  <AnimatedButton variant="primary" size="lg" shimmer>
                    <div className="flex items-center space-x-2">
                      <Zap className="w-5 h-5" />
                      <span>Start Free Trial</span>
                    </div>
                  </AnimatedButton>
                </Link>
                <AnimatedButton variant="outline" size="lg">
                  Learn More
                </AnimatedButton>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default Home
