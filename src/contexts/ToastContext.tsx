"use client"

import type React from "react"
import { createContext, useContext, useState, useCallback } from "react"
import type { Toast, ToastContextType } from "@/types"
import { generateId } from "@/lib/utils"

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export const useToast = () => {
  const context = useContext(ToastContext)
  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider")
  }
  return context
}

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = useCallback((toast: Omit<Toast, "id">) => {
    const id = generateId()
    setToasts((prev) => [...prev, { ...toast, id }])
  }, [])

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  const success = useCallback(
    (title: string, message = "", duration = 4000) => {
      addToast({ type: "success", title, message, duration })
    },
    [addToast],
  )

  const error = useCallback(
    (title: string, message = "", duration = 6000) => {
      addToast({ type: "error", title, message, duration })
    },
    [addToast],
  )

  const warning = useCallback(
    (title: string, message = "", duration = 5000) => {
      addToast({ type: "warning", title, message, duration })
    },
    [addToast],
  )

  const info = useCallback(
    (title: string, message = "", duration = 4000) => {
      addToast({ type: "info", title, message, duration })
    },
    [addToast],
  )

  const value: ToastContextType = {
    toasts,
    addToast,
    removeToast,
    success,
    error,
    warning,
    info,
  }

  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>
}
