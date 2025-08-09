"use client"

import type React from "react"
import { AnimatePresence } from "framer-motion"
import { useToast } from "@/contexts/ToastContext"
import Toast from "./Toast"

const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToast()

  return (
    <div className="fixed top-20 right-4 z-50 space-y-3 max-w-sm w-full">
      <AnimatePresence>
        {toasts.map((toast) => (
          <Toast key={toast.id} {...toast} onClose={removeToast} />
        ))}
      </AnimatePresence>
    </div>
  )
}

export default ToastContainer
