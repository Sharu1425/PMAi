import axios from "axios"
import type { ApiResponse, AuthResponse, User, Medication, Symptom, DietPlan } from "@/types"

const inferBaseUrl = () => {
  const envUrl = (import.meta as any)?.env?.VITE_API_BASE_URL as string | undefined
  if (envUrl) return envUrl.replace(/\/$/, "")

  // Allow overriding at runtime if injected on the window
  const runtimeUrl = (globalThis as any)?.__API_URL__ as string | undefined
  if (runtimeUrl) return runtimeUrl.replace(/\/$/, "")

  // Sensible defaults per environment
  const isProd = typeof window !== "undefined" && location.hostname !== "localhost"
  return isProd ? "https://pmai-3rq4.onrender.com" : "http://localhost:5001"
}

const API_BASE_URL = inferBaseUrl()

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
})

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token")
      localStorage.removeItem("user")
      window.location.href = "/login"
    }
    return Promise.reject(error)
  },
)

// Auth API
export const authAPI = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await api.post("/users/login", { email, password })
    return response.data
  },

  signup: async (userData: {
    name: string
    email: string
    password: string
    username?: string
  }): Promise<AuthResponse> => {
    const response = await api.post("/users/register", userData)
    return response.data
  },

  googleAuth: async (accessToken: string): Promise<AuthResponse> => {
    const response = await api.post("/auth/google", { access_token: accessToken })
    return response.data
  },

  faceLogin: async (userId: string, faceDescriptor: number[]): Promise<AuthResponse> => {
    const response = await api.post("/auth/login-face", { userId, faceDescriptor })
    return response.data
  },

  faceRegister: async (userId: string, faceDescriptor: number[]): Promise<ApiResponse> => {
    const response = await api.post("/auth/register-face", { userId, faceDescriptor })
    return response.data
  },

  identifyFace: async (faceDescriptor: number[]): Promise<AuthResponse> => {
    const response = await api.post("/auth/identify-face", { faceDescriptor })
    return response.data
  },

  checkFaceStatus: async (userId: string): Promise<ApiResponse<{ hasFaceRegistered: boolean }>> => {
    const response = await api.get(`/auth/face-status?userId=${userId}`)
    return response.data
  },

  logout: async (): Promise<ApiResponse> => {
    const response = await api.post("/auth/logout")
    return response.data
  },
}

// User API
export const userAPI = {
  getProfile: async (): Promise<ApiResponse<User>> => {
    const response = await api.get("/users/profile")
    return response.data
  },

  updateProfile: async (userData: Partial<User>): Promise<ApiResponse<User>> => {
    const response = await api.put("/users/profile", userData)
    return response.data
  },

  uploadProfilePicture: async (file: File): Promise<ApiResponse<{ profilePicture: string }>> => {
    const formData = new FormData()
    formData.append("profilePicture", file)
    const response = await api.post("/users/upload-avatar", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    return response.data
  },

  deleteAccount: async (): Promise<ApiResponse> => {
    const response = await api.delete("/users/account")
    return response.data
  },
}

// AI API
export const aiAPI = {
  analyzeSymptoms: async (symptoms: string[]): Promise<ApiResponse<string>> => {
    const response = await api.post("/api/ai/analyze-symptoms", { symptoms })
    return response.data
  },

  getDietRecommendations: async (preferences: {
    goal: string
    dietType: string
    allergies?: string
    activityLevel: string
    targetCalories?: number
  }): Promise<ApiResponse<DietPlan>> => {
    const response = await api.post("/api/ai/diet-recommendations", preferences)
    return response.data
  },



  // New history endpoints
  getSymptomHistory: async (): Promise<ApiResponse<Symptom[]>> => {
    const response = await api.get("/api/ai/symptoms/history")
    return response.data
  },

  getDietPlanHistory: async (): Promise<ApiResponse<DietPlan[]>> => {
    const response = await api.get("/api/ai/diet-plans/history")
    return response.data
  },
}

// Medication API
export const medicationAPI = {
  getMedications: async (): Promise<ApiResponse<Medication[]>> => {
    const response = await api.get("/api/medications")
    return response.data
  },

  addMedication: async (medication: Omit<Medication, "id" | "createdAt">): Promise<ApiResponse<Medication>> => {
    const response = await api.post("/api/medications", medication)
    return response.data
  },

  updateMedication: async (id: string, medication: Partial<Medication>): Promise<ApiResponse<Medication>> => {
    const response = await api.put(`/api/medications/${id}`, medication)
    return response.data
  },

  deleteMedication: async (id: string): Promise<ApiResponse> => {
    const response = await api.delete(`/api/medications/${id}`)
    return response.data
  },

  markAsTaken: async (id: string, taken: boolean): Promise<ApiResponse> => {
    const response = await api.patch(`/api/medications/${id}/taken`, { taken })
    return response.data
  },

  // New history endpoint
  getMedicationHistory: async (): Promise<ApiResponse<Medication[]>> => {
    const response = await api.get("/api/medications/history")
    return response.data
  },
}

// Health API
export const healthAPI = {
  getSymptoms: async (): Promise<ApiResponse<Symptom[]>> => {
    const response = await api.get("/api/health/symptoms")
    return response.data
  },

  addSymptom: async (symptom: Omit<Symptom, "id" | "createdAt">): Promise<ApiResponse<Symptom>> => {
    const response = await api.post("/api/health/symptoms", symptom)
    return response.data
  },

  getHealthStats: async (): Promise<
    ApiResponse<{
      totalSymptoms: number
      totalMedications: number
      healthScore: number
      lastCheckup: string
    }>
  > => {
    const response = await api.get("/api/health/stats")
    return response.data
  },

  getDietPlans: async (): Promise<ApiResponse<DietPlan[]>> => {
    const response = await api.get("/api/health/diet-plans")
    return response.data
  },

  saveDietPlan: async (dietPlan: Omit<DietPlan, "id" | "createdAt">): Promise<ApiResponse<DietPlan>> => {
    const response = await api.post("/api/health/diet-plans", dietPlan)
    return response.data
  },
}

export default api
