"use client"

import type React from "react"
import { useRef, useEffect, useState, useCallback } from "react"

interface FaceRegistrationProps {
  userId: string
  onSuccess: () => void
  onCancel: () => void
}

const FaceRegistration: React.FC<FaceRegistrationProps> = ({ userId, onSuccess, onCancel }) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isCameraLoading, setIsCameraLoading] = useState(true)
  const [error, setError] = useState("")
  const [capturedImages, setCapturedImages] = useState<string[]>([])

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

  const handleSuccess = useCallback(() => {
    stopCamera()
    onSuccess()
  }, [stopCamera, onSuccess])

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

  const captureImage = () => {
    if (!videoRef.current || !canvasRef.current || !streamRef.current) {
      setError("Camera not ready. Please wait for camera to load.")
      return
    }

    const canvas = canvasRef.current
    const video = videoRef.current
    const context = canvas.getContext("2d")

    if (!context) {
      setError("Unable to capture image. Please try again.")
      return
    }

    // Ensure video is ready
    if (video.readyState !== video.HAVE_ENOUGH_DATA) {
      setError("Video not ready. Please wait a moment and try again.")
      return
    }

    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    context.drawImage(video, 0, 0)

    const imageData = canvas.toDataURL("image/jpeg", 0.8)
    setCapturedImages((prev) => [...prev, imageData])
    setError("") // Clear any previous errors
  }

  const registerFace = async () => {
    if (capturedImages.length < 3) {
      setError("Please capture at least 3 images for better recognition")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      const apiUrl = (window as any).__API_URL__ || (import.meta as any).env.VITE_API_BASE_URL || ""
      const response = await fetch(`${apiUrl || ""}/users/register-face`.replace(/\/$\//, "/"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          images: capturedImages,
        }),
      })

      const data = await response.json()

      if (data.success) {
        handleSuccess()
      } else {
        setError(data.message || "Face registration failed")
      }
    } catch (err: any) {
      console.error('Face registration error:', err)
      setError("Face registration failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const getProgressMessage = () => {
    const remaining = Math.max(0, 3 - capturedImages.length)
    if (remaining === 0) {
      return "Ready to register! You can capture up to 2 more images for better accuracy."
    }
    return `Capture ${remaining} more image${remaining === 1 ? '' : 's'} for face recognition`
  }

  return (
    <div className="space-y-4">
      <div className="text-center mb-4">
        <h3 className="text-lg font-semibold text-white mb-2">Register Your Face</h3>
        <p className="text-gray-400 text-sm">{getProgressMessage()}</p>
      </div>

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
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto mb-2"></div>
              <p className="text-gray-300 text-sm">Starting camera...</p>
            </div>
          </div>
        )}

        {/* Face detection overlay */}
        {!isCameraLoading && (
          <div className="absolute inset-4 border-2 border-green-500 rounded-lg opacity-50 pointer-events-none">
            <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-green-400"></div>
            <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-green-400"></div>
            <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-green-400"></div>
            <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-green-400"></div>
          </div>
        )}
      </div>

      {/* Captured images preview */}
      {capturedImages.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm text-gray-400">Captured images ({capturedImages.length}/5):</p>
          <div className="flex space-x-2 overflow-x-auto pb-2">
            {capturedImages.map((image, index) => (
              <div key={index} className="relative flex-shrink-0">
                <img
                  src={image}
                  alt={`Captured ${index + 1}`}
                  className="w-16 h-16 object-cover rounded border-2 border-green-500"
                />
                <button
                  onClick={() => setCapturedImages(prev => prev.filter((_, i) => i !== index))}
                  className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full text-xs hover:bg-red-600 transition-colors"
                  title="Remove image"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
          {error}
          {error.includes("Camera access denied") && (
            <button
              onClick={startCamera}
              className="ml-2 text-green-400 hover:text-green-300 underline"
            >
              Retry
            </button>
          )}
        </div>
      )}

      <div className="flex space-x-3">
        {capturedImages.length < 5 && (
          <button
            onClick={captureImage}
            disabled={isCameraLoading || !!error}
            className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 px-4 rounded-lg font-medium hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 transition-all duration-200"
          >
            Capture Image ({capturedImages.length}/5)
          </button>
        )}

        {capturedImages.length >= 3 && (
          <button
            onClick={registerFace}
            disabled={isLoading}
            className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 transition-all duration-200"
          >
            {isLoading ? "Registering..." : "Register Face"}
          </button>
        )}

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

export default FaceRegistration
