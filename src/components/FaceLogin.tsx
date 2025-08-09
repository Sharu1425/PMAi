"use client"

import type React from "react"
import { useRef, useEffect, useState, useCallback } from "react"

interface FaceLoginProps {
  onSuccess: (user: any) => void
  onCancel: () => void
}

const FaceLogin: React.FC<FaceLoginProps> = ({ onSuccess, onCancel }) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isCameraLoading, setIsCameraLoading] = useState(true)
  const [error, setError] = useState("")

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
  }, [])

  const handleCancel = useCallback(() => {
    stopCamera()
    onCancel()
  }, [stopCamera, onCancel])

  useEffect(() => {
    startCamera()
    return stopCamera
  }, [stopCamera])

  const startCamera = async () => {
    try {
      setIsCameraLoading(true)
      setError("")
      
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { 
          width: { ideal: 640 }, 
          height: { ideal: 480 },
          facingMode: "user"
        },
      })
      
      streamRef.current = mediaStream
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
        // Wait for video to load
        await new Promise((resolve) => {
          if (videoRef.current) {
            videoRef.current.onloadedmetadata = () => resolve(void 0)
          }
        })
      }
    } catch (err: any) {
      console.error('Camera error:', err)
      if (err.name === 'NotAllowedError') {
        setError("Camera access denied. Please allow camera access and try again.")
      } else if (err.name === 'NotFoundError') {
        setError("No camera found. Please connect a camera and try again.")
      } else {
        setError("Failed to access camera. Please try again.")
      }
    } finally {
      setIsCameraLoading(false)
    }
  }

  const captureAndLogin = async () => {
    if (!videoRef.current || !canvasRef.current || !streamRef.current) {
      setError("Camera not ready. Please wait for camera to load.")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      const canvas = canvasRef.current
      const video = videoRef.current
      const context = canvas.getContext("2d")

      if (!context) {
        throw new Error("Unable to get canvas context")
      }

      // Ensure video is ready
      if (video.readyState !== video.HAVE_ENOUGH_DATA) {
        throw new Error("Video not ready. Please wait a moment and try again.")
      }

      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      context.drawImage(video, 0, 0)

      const imageData = canvas.toDataURL("image/jpeg", 0.8)

      // Use authAPI instead of direct axios
      const response = await fetch("http://localhost:5001/users/face-login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ image: imageData }),
      })

      const data = await response.json()

      if (data.success) {
        const { token, user } = data
        localStorage.setItem("token", token)
        localStorage.setItem("user", JSON.stringify(user))
        stopCamera() // Clean up camera before success
        onSuccess(user)
      } else {
        setError(data.message || "Face recognition failed")
      }
    } catch (err: any) {
      console.error('Face login error:', err)
      setError(err.message || "Face login failed")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <video 
          ref={videoRef} 
          autoPlay 
          playsInline 
          muted
          className="w-full h-64 bg-gray-800 rounded-lg object-cover" 
        />
        <canvas ref={canvasRef} className="hidden" />

        {/* Loading overlay */}
        {isCameraLoading && (
          <div className="absolute inset-0 bg-gray-800 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto mb-2"></div>
              <p className="text-gray-300 text-sm">Starting camera...</p>
            </div>
          </div>
        )}

        {/* Face detection overlay */}
        {!isCameraLoading && (
          <div className="absolute inset-4 border-2 border-purple-500 rounded-lg opacity-50 pointer-events-none">
            <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-purple-400"></div>
            <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-purple-400"></div>
            <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-purple-400"></div>
            <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-purple-400"></div>
          </div>
        )}
      </div>

      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
          {error}
          {error.includes("Camera access denied") && (
            <button
              onClick={startCamera}
              className="ml-2 text-purple-400 hover:text-purple-300 underline"
            >
              Retry
            </button>
          )}
        </div>
      )}

      <div className="flex space-x-3">
        <button
          onClick={captureAndLogin}
          disabled={isLoading || isCameraLoading || !!error}
          className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 transition-all duration-200"
        >
          {isLoading ? "Authenticating..." : "Login with Face"}
        </button>
        <button
          onClick={handleCancel}
          className="px-4 py-3 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 transition-all duration-200"
        >
          Cancel
        </button>
      </div>
    </div>
  )
}

export default FaceLogin
