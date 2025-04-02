"use client"

import { useEffect, useState } from "react"

interface TutorialPointerProps {
  onDismiss: () => void
}

export function TutorialPointer({ onDismiss }: TutorialPointerProps) {
  const [isVisible, setIsVisible] = useState(true)

  // Add a slight delay before showing the pointer for better UX
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  // Auto-dismiss after 15 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      handleDismiss()
    }, 15000)

    return () => clearTimeout(timer)
  }, [onDismiss])

  // Create a handler function to ensure the onDismiss callback is called
  const handleDismiss = () => {
    console.log("Dismissing tutorial pointer")
    setIsVisible(false)
    // Ensure the parent component is notified
    onDismiss()
  }

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center" onClick={handleDismiss}>
      <div className="absolute top-[120px] right-[70px] transform translate-x-1/2 -translate-y-1/2 animate-bounce">
        <img
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot_2025-03-30_at_12.19.43_PM-removebg-preview-7RSIC9iywg4EoMBGfuRIXqXkNnzYFR.png"
          alt="Pointing finger"
          width="70"
          height="70"
        />
      </div>
      <div className="fixed bottom-10 left-1/2 transform -translate-x-1/2 bg-white px-6 py-3 rounded-lg shadow-lg">
        <p className="text-center text-lg font-medium">Check out the tutorial to learn how to use RideOptimizer!</p>
        <p className="text-center text-sm text-gray-500 mt-1">Click anywhere to dismiss</p>
      </div>
    </div>
  )
}

