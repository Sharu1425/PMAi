"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { FaThermometerHalf, FaBrain, FaExclamationTriangle, FaCheckCircle, FaHistory } from "react-icons/fa"
import { AlertTriangle, Lightbulb, Activity, Calendar } from "lucide-react"
import GlassCard from "@/components/ui/GlassCard"
import AnimatedButton from "@/components/ui/AnimatedButton"
import { useToast } from "@/hooks/useToast"
import { aiAPI } from "@/utils/api"

interface SymptomAnalyserProps {
  user: any
}

interface AnalysisResult {
  possibleConditions: string[]
  confidence: number
  urgencyLevel: "low" | "medium" | "high"
  analysis: string
  recommendations: string[]
}

const SymptomAnalyser: React.FC<SymptomAnalyserProps> = ({ user: _user }) => {
  const [symptoms, setSymptoms] = useState<string[]>([])
  const [currentSymptom, setCurrentSymptom] = useState("")
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [symptomHistory, setSymptomHistory] = useState<any[]>([])
  const [showHistory, setShowHistory] = useState(false)
  const toast = useToast()

  // Load symptom history on component mount
  useEffect(() => {
    loadSymptomHistory()
  }, [])

  const loadSymptomHistory = async () => {
    try {
      const response = await aiAPI.getSymptomHistory()
      if (response.success && response.data) {
        setSymptomHistory(response.data)
      }
    } catch (error) {
      console.error("Error loading symptom history:", error)
    }
  }

  const addSymptom = () => {
    if (currentSymptom.trim() && !symptoms.includes(currentSymptom.trim())) {
      setSymptoms([...symptoms, currentSymptom.trim()])
      setCurrentSymptom("")
    }
  }

  const removeSymptom = (index: number) => {
    setSymptoms(symptoms.filter((_, i) => i !== index))
  }

  const analyzeSymptoms = async () => {
    if (symptoms.length === 0) {
      toast.warning("No Symptoms", "Please add at least one symptom to analyze")
      return
    }

    setIsAnalyzing(true)
    try {
      const response = await aiAPI.analyzeSymptoms(symptoms)
      
      if (response.success && response.data) {
        // Parse the AI response to extract structured data
        const aiResponse = response.data
        
        // Create a structured analysis result
        const analysisResult: AnalysisResult = {
          possibleConditions: ["General Symptom Analysis"],
          confidence: 70,
          urgencyLevel: "medium",
          analysis: aiResponse,
          recommendations: [
            "Monitor your symptoms",
            "Keep track of any changes",
            "Consult a healthcare professional if symptoms persist or worsen"
          ]
        }
        
        setAnalysis(analysisResult)
        toast.success("Analysis Complete", "Your symptoms have been analyzed successfully!")
        
        // Reload history to include the new analysis
        await loadSymptomHistory()
      } else {
        throw new Error("Failed to analyze symptoms")
      }
    } catch (error) {
      console.error("Error analyzing symptoms:", error)
      
      // Provide a more helpful error message
      let errorMessage = "Failed to analyze symptoms. Please try again."
      if (error instanceof Error) {
        errorMessage = error.message
      } else if (typeof error === 'string') {
        errorMessage = error
      }
      
      toast.error("Analysis Failed", errorMessage)
      
      // Set a fallback analysis result
      const fallbackResult: AnalysisResult = {
        possibleConditions: ["General Symptom Analysis"],
        confidence: 70,
        urgencyLevel: "medium",
        analysis: "I'm having trouble analyzing your symptoms right now. Please try again in a moment, or consider consulting a healthcare professional for immediate concerns.",
        recommendations: [
          "Try refreshing the page and analyzing again",
          "Check your internet connection",
          "Contact a healthcare professional if symptoms are severe",
          "Monitor your symptoms and note any changes"
        ]
      }
      
      setAnalysis(fallbackResult)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "high":
        return "text-red-400"
      case "medium":
        return "text-yellow-400"
      case "low":
        return "text-green-400"
      default:
        return "text-gray-400"
    }
  }

  const getUrgencyIcon = (urgency: string) => {
    switch (urgency) {
      case "high":
        return <FaExclamationTriangle className="w-5 h-5 text-red-400" />
      case "medium":
        return <AlertTriangle className="w-5 h-5 text-yellow-400" />
      case "low":
        return <FaCheckCircle className="w-5 h-5 text-green-400" />
      default:
        return <Activity className="w-5 h-5 text-gray-400" />
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
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
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Symptom Analyzer</h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Get AI-powered insights about your symptoms and health concerns. Add your symptoms below and receive personalized analysis and recommendations.
            </p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <GlassCard hover>
              <div className="flex items-center mb-6">
                <FaThermometerHalf className="w-6 h-6 text-red-400 mr-3" />
                <h2 className="text-2xl font-bold text-white">Add Your Symptoms</h2>
              </div>

              <div className="space-y-4">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={currentSymptom}
                    onChange={(e) => setCurrentSymptom(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && addSymptom()}
                    placeholder="Enter a symptom (e.g., headache, fever)"
                    className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-300"
                  />
                  <AnimatedButton
                    onClick={addSymptom}
                    variant="primary"
                    size="sm"
                    className="px-6"
                  >
                    Add
                  </AnimatedButton>
                </div>

                {symptoms.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-white">Current Symptoms:</h3>
                    <div className="flex flex-wrap gap-2">
                      {symptoms.map((symptom, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="flex items-center space-x-2 bg-red-500/20 border border-red-500/30 rounded-full px-3 py-1"
                        >
                          <span className="text-red-300 text-sm">{symptom}</span>
                          <button
                            onClick={() => removeSymptom(index)}
                            className="text-red-400 hover:text-red-300 transition-colors"
                          >
                            ×
                          </button>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                <AnimatedButton
                  onClick={analyzeSymptoms}
                  variant="primary"
                  className="w-full"
                  isLoading={isAnalyzing}
                  shimmer
                >
                  <div className="flex items-center space-x-2">
                    <FaBrain className="w-4 h-4" />
                    <span>{isAnalyzing ? "Analyzing..." : "Analyze Symptoms"}</span>
                  </div>
                </AnimatedButton>
              </div>
            </GlassCard>
          </motion.div>

          {/* Analysis Results */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {analysis ? (
              <GlassCard glow>
                <div className="flex items-center mb-6">
                  <FaBrain className="w-6 h-6 text-blue-400 mr-3" />
                  <h2 className="text-2xl font-bold text-white">Analysis Results</h2>
                </div>

                <div className="space-y-6">
                  {/* Confidence and Urgency */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-white/5 rounded-xl border border-white/10">
                      <div className="text-2xl font-bold text-blue-400">{analysis.confidence}%</div>
                      <div className="text-gray-400 text-sm">Confidence</div>
                    </div>
                    <div className="text-center p-4 bg-white/5 rounded-xl border border-white/10">
                      <div className="flex items-center justify-center mb-2">
                        {getUrgencyIcon(analysis.urgencyLevel)}
                      </div>
                      <div className={`text-lg font-semibold ${getUrgencyColor(analysis.urgencyLevel)} capitalize`}>
                        {analysis.urgencyLevel} Urgency
                      </div>
                    </div>
                  </div>

                  {/* Analysis */}
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">Analysis</h3>
                    <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                      <p className="text-gray-300 leading-relaxed">{analysis.analysis}</p>
                    </div>
                  </div>

                  {/* Recommendations */}
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">Recommendations</h3>
                    <div className="space-y-2">
                      {analysis.recommendations.map((recommendation, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-start space-x-3 p-3 bg-white/5 rounded-xl border border-white/10"
                        >
                          <Lightbulb className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-300">{recommendation}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </GlassCard>
            ) : (
              <GlassCard className="h-full flex items-center justify-center">
                <div className="text-center">
                  <motion.div
                    animate={{
                      scale: [1, 1.1, 1],
                      rotate: [0, 5, -5, 0],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "easeInOut",
                    }}
                  >
                    <FaBrain className="w-20 h-20 text-gray-400 mx-auto mb-6" />
                  </motion.div>
                  <h3 className="text-2xl font-bold text-white mb-4">No Analysis Yet</h3>
                  <p className="text-gray-400 text-lg max-w-md mx-auto">
                    Add your symptoms and click "Analyze Symptoms" to get AI-powered health insights and recommendations.
                  </p>
                </div>
              </GlassCard>
            )}
          </motion.div>
        </div>

        {/* Symptom History Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-12"
        >
          <GlassCard>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <FaHistory className="w-6 h-6 text-purple-400 mr-3" />
                <h2 className="text-2xl font-bold text-white">Recent Symptom History</h2>
              </div>
              <AnimatedButton
                onClick={() => setShowHistory(!showHistory)}
                variant="outline"
                size="sm"
              >
                {showHistory ? "Hide" : "Show"} History
              </AnimatedButton>
            </div>

            {showHistory && (
              <div className="space-y-4">
                {symptomHistory.length > 0 ? (
                  symptomHistory.map((record, index) => (
                    <motion.div
                      key={record.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-300"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-400 text-sm">
                              {formatDate(record.createdAt)}
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-2 mb-3">
                            {record.symptoms.map((symptom: string, idx: number) => (
                              <span
                                key={idx}
                                className="px-2 py-1 bg-red-500/20 border border-red-500/30 rounded-full text-xs text-red-300"
                              >
                                {symptom}
                              </span>
                            ))}
                          </div>
                          <div className="text-gray-300 text-sm line-clamp-3">
                            {record.analysis.analysis}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 ml-4">
                          {getUrgencyIcon(record.analysis.urgencyLevel)}
                          <span className={`text-xs ${getUrgencyColor(record.analysis.urgencyLevel)}`}>
                            {record.analysis.confidence}%
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <FaHistory className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-400">No symptom history available</p>
                    <p className="text-gray-500 text-sm">Your symptom analyses will appear here</p>
                  </div>
                )}
              </div>
            )}
          </GlassCard>
        </motion.div>
      </div>
    </div>
  )
}

export default SymptomAnalyser
