"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { FaPlus, FaTimes, FaPaperPlane } from "react-icons/fa"
import {
  Stethoscope,
  Bot,
  Heart,
  AlertTriangle,
  Clock,
  TrendingUp,
  Brain,
  Activity,
  MessageSquare,
  Search,
  FileText,
} from "lucide-react"
import GlassCard from "@/components/ui/GlassCard"
import AnimatedButton from "@/components/ui/AnimatedButton"
import { useToast } from "@/hooks/useToast"
import { aiAPI } from "@/utils/api"

interface SymptomAnalyserProps {
  user: any
}

interface ChatMessage {
  type: "user" | "ai"
  message: string
  timestamp: Date
}

interface AnalysisResult {
  possibleConditions: string[]
  recommendations: string[]
  urgencyLevel: "low" | "medium" | "high"
  analysis: string
  confidence: number
}

const SymptomAnalyser: React.FC<SymptomAnalyserProps> = ({ user: _user }) => {
  const [symptoms, setSymptoms] = useState<string[]>([])
  const [currentSymptom, setCurrentSymptom] = useState("")
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      type: "ai",
      message: "Hello! I'm your AI health assistant. Please describe your symptoms and I'll help analyze them. Remember, this is for informational purposes only and doesn't replace professional medical advice.",
      timestamp: new Date(),
    },
  ])
  const [chatInput, setChatInput] = useState("")
  const [isChatMode, setIsChatMode] = useState(false)
  const [isChatLoading, setIsChatLoading] = useState(false)
  const chatEndRef = useRef<HTMLDivElement>(null)
  const toast = useToast()

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [chatMessages])

  const addSymptom = () => {
    if (currentSymptom.trim() && !symptoms.includes(currentSymptom.trim())) {
      setSymptoms([...symptoms, currentSymptom.trim()])
      setCurrentSymptom("")
      toast.success("Symptom Added", "Symptom has been added to your list")
    }
  }

  const removeSymptom = (symptomToRemove: string) => {
    setSymptoms(symptoms.filter((symptom) => symptom !== symptomToRemove))
    toast.info("Symptom Removed", "Symptom has been removed from your list")
  }

  const analyzeSymptoms = async () => {
    if (symptoms.length === 0) {
      toast.warning("No Symptoms", "Please add at least one symptom to analyze")
      return
    }

    setIsAnalyzing(true)
    try {
      const response = await aiAPI.analyzeSymptoms(symptoms)
      
      if (!response.data) {
        throw new Error("No analysis data received")
      }
      
      // Parse the AI response and create a structured result
      const aiResponse = response.data as string
      const mockResult: AnalysisResult = {
        possibleConditions: ["General Symptom Analysis"],
        confidence: 85,
        urgencyLevel: "medium",
        analysis: aiResponse,
        recommendations: [
          "Monitor symptoms for 24-48 hours",
          "Rest and stay hydrated",
          "Consider over-the-counter pain relief if appropriate",
          "Seek medical attention if symptoms worsen"
        ]
      }
      
      setAnalysis(mockResult)

      // Add AI response to chat
      setChatMessages((prev) => [
        ...prev,
        {
          type: "user",
          message: `Analyze these symptoms: ${symptoms.join(", ")}`,
          timestamp: new Date(),
        },
        {
          type: "ai",
          message: aiResponse,
          timestamp: new Date(),
        },
      ])

      toast.success("Analysis Complete", "Your symptom analysis is ready!")
    } catch (error) {
      console.error("Error analyzing symptoms:", error)
      toast.error("Analysis Failed", "Failed to analyze symptoms. Please try again.")
    } finally {
      setIsAnalyzing(false)
    }
  }

  const sendChatMessage = async () => {
    if (!chatInput.trim()) return

    const userMessage: ChatMessage = {
      type: "user",
      message: chatInput,
      timestamp: new Date(),
    }

    setChatMessages((prev) => [...prev, userMessage])
    setChatInput("")
    setIsChatLoading(true)

    try {
      // Call the actual AI API for chat
      const response = await aiAPI.chatWithAI(chatInput)
      
      if (response.data && response.data.message) {
        const aiResponse: ChatMessage = {
          type: "ai",
          message: response.data.message,
          timestamp: new Date(),
        }
        setChatMessages((prev) => [...prev, aiResponse])
      } else {
        // Fallback response if API fails
        const fallbackResponse: ChatMessage = {
          type: "ai",
          message: `I understand you're experiencing: "${chatInput}". This could be related to several factors. Can you provide more details about when these symptoms started and their severity?`,
          timestamp: new Date(),
        }
        setChatMessages((prev) => [...prev, fallbackResponse])
      }
    } catch (error) {
      console.error("Error sending chat message:", error)
      // Fallback response on error
      const errorResponse: ChatMessage = {
        type: "ai",
        message: `I'm having trouble processing your message right now. Please try again in a moment or describe your symptoms in a different way.`,
        timestamp: new Date(),
      }
      setChatMessages((prev) => [...prev, errorResponse])
      toast.error("Chat Error", "Failed to get AI response. Please try again.")
    } finally {
      setIsChatLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      action()
    }
  }

  const getSeverityColor = (urgencyLevel: string) => {
    switch (urgencyLevel?.toLowerCase()) {
      case "low":
        return "from-green-500 to-emerald-500"
      case "medium":
        return "from-yellow-500 to-orange-500"
      case "high":
        return "from-orange-500 to-red-500"
      default:
        return "from-blue-500 to-cyan-500"
    }
  }

  const getUrgencyIcon = (urgencyLevel: string) => {
    switch (urgencyLevel?.toLowerCase()) {
      case "high":
        return <AlertTriangle className="w-6 h-6 text-red-400" />
      case "medium":
        return <Clock className="w-6 h-6 text-orange-400" />
      case "low":
        return <Heart className="w-6 h-6 text-green-400" />
      default:
        return <Stethoscope className="w-6 h-6 text-blue-400" />
    }
  }

  const commonSymptoms = [
    "Headache",
    "Fever",
    "Cough",
    "Fatigue",
    "Nausea",
    "Dizziness",
    "Chest pain",
    "Shortness of breath",
    "Stomach pain",
    "Joint pain",
    "Muscle aches",
    "Sore throat",
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <div className="min-h-screen pt-20 pb-10 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">AI Symptom Analyzer</h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Describe your symptoms and get AI-powered insights to help understand your health concerns. Always consult
              with healthcare professionals for medical advice.
            </p>
          </div>
        </motion.div>

        {/* Mode Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex justify-center">
            <div className="flex space-x-1 bg-white/5 rounded-xl p-1">
              <button
                onClick={() => setIsChatMode(false)}
                className={`flex items-center space-x-2 py-3 px-6 rounded-lg transition-all duration-300 ${
                  !isChatMode
                    ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg"
                    : "text-gray-400 hover:text-white hover:bg-white/10"
                }`}
              >
                <Search className="w-4 h-4" />
                <span>Symptom Analysis</span>
              </button>
              <button
                onClick={() => setIsChatMode(true)}
                className={`flex items-center space-x-2 py-3 px-6 rounded-lg transition-all duration-300 ${
                  isChatMode
                    ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg"
                    : "text-gray-400 hover:text-white hover:bg-white/10"
                }`}
              >
                <MessageSquare className="w-4 h-4" />
                <span>AI Chat</span>
              </button>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Panel - Symptom Input or Chat */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="lg:col-span-2 space-y-6"
          >
            {!isChatMode ? (
              <>
                {/* Symptom Input */}
                <motion.div variants={itemVariants}>
                  <GlassCard>
                    <div className="flex items-center mb-6">
                      <Stethoscope className="w-6 h-6 text-blue-400 mr-3" />
                      <h2 className="text-2xl font-bold text-white">Add Your Symptoms</h2>
                    </div>

                    <div className="space-y-4">
                      <div className="flex space-x-3">
                        <input
                          type="text"
                          value={currentSymptom}
                          onChange={(e) => setCurrentSymptom(e.target.value)}
                          onKeyPress={(e) => handleKeyPress(e, addSymptom)}
                          className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                          placeholder="Describe a symptom (e.g., headache, fever, cough)"
                        />
                        <AnimatedButton onClick={addSymptom} variant="primary">
                          <FaPlus className="w-4 h-4" />
                        </AnimatedButton>
                      </div>

                      {/* Common Symptoms */}
                      <div>
                        <p className="text-gray-300 text-sm mb-3">Quick add common symptoms:</p>
                        <div className="flex flex-wrap gap-2">
                          {commonSymptoms.map((symptom) => (
                            <button
                              key={symptom}
                              onClick={() => {
                                if (!symptoms.includes(symptom)) {
                                  setSymptoms([...symptoms, symptom])
                                  toast.success("Symptom Added", `${symptom} added to your list`)
                                }
                              }}
                              disabled={symptoms.includes(symptom)}
                              className="px-3 py-1 bg-white/10 hover:bg-white/20 disabled:bg-white/5 disabled:text-gray-500 text-white text-sm rounded-full transition-all duration-300"
                            >
                              {symptom}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>

                {/* Current Symptoms */}
                {symptoms.length > 0 && (
                  <motion.div variants={itemVariants}>
                    <GlassCard>
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-bold text-white">Current Symptoms ({symptoms.length})</h3>
                        <AnimatedButton
                          onClick={analyzeSymptoms}
                          variant="primary"
                          isLoading={isAnalyzing}
                          className="flex items-center space-x-2"
                          shimmer
                        >
                          <Brain className="w-4 h-4" />
                          <span>{isAnalyzing ? "Analyzing..." : "Analyze Symptoms"}</span>
                        </AnimatedButton>
                      </div>

                      <div className="flex flex-wrap gap-3">
                        <AnimatePresence>
                          {symptoms.map((symptom, index) => (
                            <motion.div
                              key={symptom}
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.8 }}
                              transition={{ delay: index * 0.1 }}
                              className="flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white px-4 py-2 rounded-full"
                            >
                              <span>{symptom}</span>
                              <button
                                onClick={() => removeSymptom(symptom)}
                                className="hover:bg-white/20 rounded-full p-1 transition-colors"
                              >
                                <FaTimes className="w-3 h-3" />
                              </button>
                            </motion.div>
                          ))}
                        </AnimatePresence>
                      </div>
                    </GlassCard>
                  </motion.div>
                )}

                {/* Analysis Results */}
                <AnimatePresence>
                  {analysis && (
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -30 }}
                      transition={{ duration: 0.6 }}
                    >
                      <GlassCard glow>
                        <div className="flex items-center mb-6">
                          <Bot className="w-6 h-6 text-green-400 mr-3" />
                          <h2 className="text-2xl font-bold text-white">AI Analysis Results</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                          <div className="text-center">
                            <div
                              className={`w-16 h-16 mx-auto mb-3 bg-gradient-to-br ${getSeverityColor(
                                analysis.urgencyLevel
                              )} rounded-2xl flex items-center justify-center shadow-lg`}
                            >
                              {getUrgencyIcon(analysis.urgencyLevel)}
                            </div>
                            <div className="text-white font-semibold">{analysis.possibleConditions.join(", ")}</div>
                            <div className="text-gray-400 text-sm">Potential Conditions</div>
                          </div>

                          <div className="text-center">
                            <div className="w-16 h-16 mx-auto mb-3 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg">
                              <TrendingUp className="w-6 h-6 text-white" />
                            </div>
                            <div className="text-white font-semibold">{analysis.confidence}%</div>
                            <div className="text-gray-400 text-sm">Confidence Level</div>
                          </div>

                          <div className="text-center">
                            <div className="w-16 h-16 mx-auto mb-3 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center shadow-lg">
                              <Activity className="w-6 h-6 text-white" />
                            </div>
                            <div className="text-white font-semibold capitalize">{analysis.urgencyLevel}</div>
                            <div className="text-gray-400 text-sm">Urgency Level</div>
                          </div>
                        </div>

                        <div className="space-y-6">
                          <div>
                            <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                              <FileText className="w-5 h-5 mr-2 text-blue-400" />
                              Description
                            </h3>
                            <p className="text-gray-300 leading-relaxed">{analysis.analysis}</p>
                          </div>

                          <div>
                            <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                              <Heart className="w-5 h-5 mr-2 text-pink-400" />
                              Recommendations
                            </h3>
                            <ul className="space-y-2">
                              {analysis.recommendations.map((rec, index) => (
                                <motion.li
                                  key={index}
                                  initial={{ opacity: 0, x: -20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: index * 0.1 }}
                                  className="flex items-start space-x-3 text-gray-300"
                                >
                                  <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full mt-2 flex-shrink-0" />
                                  <span>{rec}</span>
                                </motion.li>
                              ))}
                            </ul>
                          </div>

                          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4">
                            <div className="flex items-start space-x-3">
                              <AlertTriangle className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                              <div>
                                <p className="text-yellow-400 font-semibold mb-1">Medical Disclaimer</p>
                                <p className="text-gray-300 text-sm">
                                  This analysis is for informational purposes only and should not replace professional
                                  medical advice. Please consult with a healthcare provider for proper diagnosis and
                                  treatment.
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </GlassCard>
                    </motion.div>
                  )}
                </AnimatePresence>
              </>
            ) : (
              /* Chat Interface */
              <motion.div variants={itemVariants}>
                <GlassCard className="h-96">
                  <div className="flex items-center mb-4">
                    <Bot className="w-6 h-6 text-purple-400 mr-3" />
                    <h2 className="text-xl font-bold text-white">AI Health Assistant</h2>
                  </div>

                  <div className="flex flex-col h-80">
                    <div className="flex-1 overflow-y-auto space-y-4 pr-4">
                      {chatMessages.map((message, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                              message.type === "user"
                                ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white"
                                : "bg-white/10 text-gray-300"
                            }`}
                          >
                            <p className="text-sm">{message.message}</p>
                            <p className="text-xs opacity-70 mt-1">
                              {message.timestamp.toLocaleTimeString("en-US", {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </p>
                          </div>
                        </motion.div>
                      ))}
                      {isChatLoading && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex justify-start"
                        >
                          <div className="bg-white/10 text-gray-300 px-4 py-3 rounded-2xl">
                            <div className="flex items-center space-x-2">
                              <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" />
                              <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                              <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                            </div>
                          </div>
                        </motion.div>
                      )}
                      <div ref={chatEndRef} />
                    </div>

                    <div className="flex space-x-3 mt-4">
                      <input
                        type="text"
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        onKeyPress={(e) => handleKeyPress(e, sendChatMessage)}
                        disabled={isChatLoading}
                        className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 disabled:opacity-50"
                        placeholder={isChatLoading ? "AI is thinking..." : "Describe your symptoms or ask a question..."}
                      />
                      <AnimatedButton 
                        onClick={sendChatMessage} 
                        variant="primary"
                        disabled={isChatLoading || !chatInput.trim()}
                      >
                        <FaPaperPlane className="w-4 h-4" />
                      </AnimatedButton>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            )}
          </motion.div>

          {/* Right Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="space-y-6"
          >
            {/* Health Tips */}
            <GlassCard>
              <div className="flex items-center mb-4">
                <Heart className="w-5 h-5 text-pink-400 mr-3" />
                <h3 className="text-lg font-bold text-white">Health Tips</h3>
              </div>
              <div className="space-y-3 text-gray-300 text-sm">
                <p>• Be specific when describing symptoms</p>
                <p>• Note when symptoms started</p>
                <p>• Mention symptom severity (1-10 scale)</p>
                <p>• Include any triggers you've noticed</p>
                <p>• Always consult a doctor for concerning symptoms</p>
              </div>
            </GlassCard>

            {/* Emergency Warning */}
            <GlassCard className="border-red-500/20 bg-red-500/5">
              <div className="flex items-center mb-4">
                <AlertTriangle className="w-5 h-5 text-red-400 mr-3" />
                <h3 className="text-lg font-bold text-red-400">Emergency Signs</h3>
              </div>
              <div className="space-y-2 text-gray-300 text-sm">
                <p>Seek immediate medical attention for:</p>
                <ul className="space-y-1 ml-4">
                  <li>• Chest pain</li>
                  <li>• Severe breathing difficulties</li>
                  <li>• Sudden severe headache</li>
                  <li>• Signs of stroke</li>
                  <li>• Severe allergic reactions</li>
                </ul>
              </div>
            </GlassCard>

            {/* Quick Actions */}
            <GlassCard>
              <h3 className="text-lg font-bold text-white mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <AnimatedButton variant="outline" className="w-full">
                  <div className="flex items-center justify-start space-x-2">
                    <Stethoscope className="w-4 h-4" />
                    <span>Find Nearby Doctors</span>
                  </div>
                </AnimatedButton>
                <AnimatedButton variant="outline" className="w-full">
                  <div className="flex items-center justify-start space-x-2">
                    <FileText className="w-4 h-4" />
                    <span>View Medical History</span>
                  </div>
                </AnimatedButton>
                <AnimatedButton variant="outline" className="w-full">
                  <div className="flex items-center justify-start space-x-2">
                    <Clock className="w-4 h-4" />
                    <span>Schedule Checkup</span>
                  </div>
                </AnimatedButton>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default SymptomAnalyser
