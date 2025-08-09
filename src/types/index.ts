export interface User {
  id: string
  name: string
  email: string
  username?: string
  profilePicture?: string
  age?: number
  gender?: "Male" | "Female" | "Other"
  height?: number
  weight?: number
  phone?: string
  medicalHistory?: string[]
  allergies?: string[]
  medications?: string[]
  isAdmin?: boolean
  createdAt?: string
  updatedAt?: string
  lastLogin?: string
  hasFaceRegistered?: boolean
}

export interface AuthResponse {
  success: boolean
  message: string
  token?: string
  user?: User
  error?: string
}

export interface ApiResponse<T = any> {
  success: boolean
  message: string
  data?: T
  error?: string
}

export interface Toast {
  id: string
  type: "success" | "error" | "warning" | "info"
  title: string
  message?: string
  duration?: number
}

export interface Medication {
  id: string
  name: string
  dosage: string
  frequency: string
  time: string
  startDate: string
  endDate?: string
  instructions?: string
  reminders: boolean
  taken: boolean
  createdAt: string
}

export interface Symptom {
  id: string
  name: string
  severity: number
  duration: string
  description?: string
  createdAt: string
}

export interface DietPlan {
  id: string
  goal: string
  dietType: string
  targetCalories: number
  macros: {
    protein: number
    carbs: number
    fat: number
  }
  meals: Meal[]
  createdAt: string
}

export interface Meal {
  id: string
  type: "breakfast" | "lunch" | "dinner" | "snack"
  name: string
  calories: number
  protein: number
  carbs: number
  fat: number
  ingredients: string[]
  instructions?: string
}

export interface AnalysisResult {
  possibleConditions: string[]
  recommendations: string[]
  urgencyLevel: "low" | "medium" | "high"
  analysis: string
  confidence: number
}

export interface ChatMessage {
  id: string
  type: "user" | "ai"
  message: string
  timestamp: Date
  context?: any
}

export interface ThemeContextType {
  mode: "casual" | "professional"
  colorScheme: "dark" | "light"
  setMode: (mode: "casual" | "professional") => void
  setColorScheme: (scheme: "dark" | "light") => void
}

export interface ToastContextType {
  toasts: Toast[]
  addToast: (toast: Omit<Toast, "id">) => void
  removeToast: (id: string) => void
  success: (title: string, message?: string, duration?: number) => void
  error: (title: string, message?: string, duration?: number) => void
  warning: (title: string, message?: string, duration?: number) => void
  info: (title: string, message?: string, duration?: number) => void
}
