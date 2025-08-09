"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import type { ThemeContextType } from "@/types"

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setMode] = useState<"casual" | "professional">("casual")
  const [colorScheme, setColorScheme] = useState<"dark" | "light">("dark")

  useEffect(() => {
    const savedMode = localStorage.getItem("theme-mode") as "casual" | "professional"
    const savedColorScheme = localStorage.getItem("color-scheme") as "dark" | "light"

    if (savedMode) setMode(savedMode)
    if (savedColorScheme) setColorScheme(savedColorScheme)
  }, [])

  const handleSetMode = (newMode: "casual" | "professional") => {
    setMode(newMode)
    localStorage.setItem("theme-mode", newMode)
  }

  const handleSetColorScheme = (newScheme: "dark" | "light") => {
    setColorScheme(newScheme)
    localStorage.setItem("color-scheme", newScheme)

    if (newScheme === "dark") {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }

  const value: ThemeContextType = {
    mode,
    colorScheme,
    setMode: handleSetMode,
    setColorScheme: handleSetColorScheme,
  }

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
