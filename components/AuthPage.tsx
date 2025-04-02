"use client"

import type React from "react"

import { useState } from "react"
import { Mail, Lock, User, ArrowRight, X, Eye, EyeOff, AlertCircle } from "lucide-react"
import Image from "next/image"

interface AuthPageProps {
  onLogin: (userData: { email: string; name: string }, isNewUser?: boolean) => void
  onCancel: () => void
  themeColors?: {
    bg: string
    card: string
    text: string
    highlight: string
    secondaryBg: string
    border: string
    buttonPrimary: string
    buttonSecondary: string
    buttonText: string
    secondaryText: string
  }
}

export function AuthPage({ onLogin, onCancel, themeColors }: AuthPageProps) {
  const [mode, setMode] = useState<"login" | "register">("login")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")

  const colors = themeColors || {
    bg: "bg-[#f8f7f4]",
    card: "bg-white",
    text: "text-[#2d2d2d]",
    highlight: "text-[#e67e5a]",
    secondaryBg: "bg-[#f0f0eb]",
    border: "border-[#e8e8e3]",
    buttonPrimary: "bg-[#e67e5a]",
    buttonSecondary: "bg-[#e1f0ed]",
    buttonText: "text-white",
    secondaryText: "text-[#6b6b6b]",
  }

  // Add a new function to handle Google OAuth
  const initiateGoogleAuth = () => {
    // In a real implementation, this would redirect to Google's OAuth endpoint
    const googleAuthUrl = "https://accounts.google.com/o/oauth2/v2/auth"
    const redirectUri = typeof window !== "undefined" ? `${window.location.origin}/api/auth/google/callback` : ""

    // These parameters would be configured in your Google Cloud Console
    const params = new URLSearchParams({
      client_id: "YOUR_GOOGLE_CLIENT_ID", // Replace with your actual client ID in production
      redirect_uri: redirectUri,
      response_type: "code",
      scope: "openid email profile",
      prompt: "select_account",
    })

    // In a real app, this would redirect the user to Google's sign-in page
    // For demo purposes, we'll just log the URL and simulate the flow
    console.log(`Would redirect to: ${googleAuthUrl}?${params.toString()}`)

    // Simulate the OAuth flow for demonstration
    return new Promise((resolve) => {
      // Show a message to the user
      alert(
        "In a real app, you would now be redirected to Google's sign-in page. For this demo, we'll simulate a successful Google login.",
      )

      // Simulate a successful login after a short delay
      setTimeout(() => {
        resolve({
          email: "user@gmail.com",
          name: "Google User",
          picture: "https://lh3.googleusercontent.com/a/default-user",
        })
      }, 1000)
    })
  }

  // Update the handleSubmit function to properly handle firstName and lastName
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)
    console.log("Form submitted, mode:", mode)

    try {
      // Validate form
      if (!email || !password) {
        throw new Error("Please fill in all required fields")
      }

      if (mode === "register") {
        console.log("Processing registration...")
        // Check firstName and lastName instead of name
        if (!firstName || !lastName) {
          throw new Error("Please enter your first and last name")
        }
        if (password !== confirmPassword) {
          throw new Error("Passwords do not match")
        }
        if (password.length < 8) {
          throw new Error("Password must be at least 8 characters long")
        }

        // Combine firstName and lastName into full name
        const fullName = `${firstName} ${lastName}`

        // In a real app, this would create a new user account in the database
        // For demo purposes, we'll simulate storing credentials in localStorage
        const userData = { email, name: fullName, password }

        // Simulate API call with timeout
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Store user data (in a real app, only store tokens, not passwords)
        if (typeof window !== "undefined") {
          localStorage.setItem("rideOptimizer_user", JSON.stringify({ email, name: fullName }))
        }

        console.log("Account created successfully:", userData)

        // Automatically log in after registration
        console.log("Calling onLogin after registration with isNewUser=true")
        onLogin({ email, name: fullName }, true) // Explicitly pass true for isNewUser
        return // Add explicit return to ensure the function exits here
      }

      // Login flow
      console.log("Processing login...")
      // In a real app, this would validate credentials against a database
      // For demo purposes, we'll simulate a successful login after a short delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // In a real app, you would check if the user exists and validate password
      // For demo purposes, we'll just log them in

      // Store login status (in a real app, store auth tokens)
      if (typeof window !== "undefined") {
        localStorage.setItem("rideOptimizer_user", JSON.stringify({ email, name: name || email.split("@")[0] }))
      }

      // Simulate successful login
      console.log("Calling onLogin after login with isNewUser=false")
      onLogin({ email, name: name || email.split("@")[0] }, false) // Explicitly pass false for isNewUser
    } catch (err) {
      console.error("Authentication error:", err)
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  // Update the handleGoogleLogin function to use the new OAuth function
  const handleGoogleLogin = async () => {
    setError(null)
    setIsLoading(true)

    try {
      // In a real app, this would redirect to Google and then handle the callback
      const userData = await initiateGoogleAuth()

      // Store user data (in a real app, you would store tokens, not the full user data)
      if (typeof window !== "undefined") {
        localStorage.setItem("rideOptimizer_user", JSON.stringify(userData))
      }

      // Call the onLogin callback with the user data
      // For Google login, we'll assume it's an existing user (not a new registration)
      onLogin(
        {
          email: userData.email,
          name: userData.name,
        },
        false,
      ) // Explicitly pass false for isNewUser
    } catch (err) {
      setError("Google authentication failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div
        className={`${colors.card} w-full max-w-md rounded-xl shadow-xl overflow-hidden relative border border-gray-100`}
      >
        {/* Close button */}
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          <X className="h-5 w-5 text-gray-500" />
        </button>

        <div className="p-10">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-[#e67e5a] flex items-center justify-center shadow-md mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polygon points="3 11 22 2 13 21 11 13 3 11"></polygon>
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-[#2d2d2d] mb-2">
                {mode === "login" ? "Welcome Back" : "Create Account"}
              </h2>
              <p className={`${colors.secondaryText} text-sm max-w-xs mx-auto`}>
                {mode === "login"
                  ? "Sign in to continue to RideOptimizer"
                  : "Join RideOptimizer to maximize your earnings"}
              </p>
            </div>
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm flex items-start">
              <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {mode === "register" && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="pl-10 w-full h-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#e67e5a] focus:border-[#e67e5a] transition-colors shadow-sm"
                      placeholder="Enter your first name"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="pl-10 w-full h-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#e67e5a] focus:border-[#e67e5a] transition-colors shadow-sm"
                      placeholder="Enter your last name"
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 w-full h-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#e67e5a] focus:border-[#e67e5a] transition-colors shadow-sm"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 w-full h-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#e67e5a] focus:border-[#e67e5a] transition-colors shadow-sm"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            {mode === "register" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-10 w-full h-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#e67e5a] focus:border-[#e67e5a] transition-colors shadow-sm"
                    placeholder="Confirm your password"
                    required
                  />
                </div>
              </div>
            )}

            {mode === "login" && (
              <div className="flex justify-end">
                <button type="button" className="text-sm text-[#e67e5a] hover:underline">
                  Forgot password?
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full h-12 ${colors.buttonPrimary} ${colors.buttonText} rounded-full font-medium flex items-center justify-center transition-all duration-300 hover:bg-[#e06a43] disabled:opacity-70 disabled:cursor-not-allowed shadow-sm`}
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <>
                  {mode === "login" ? "Sign In" : "Create Account"}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center my-8">
            <div className="flex-grow border-t border-gray-200"></div>
            <span className="px-4 text-sm text-gray-500 font-medium">OR</span>
            <div className="flex-grow border-t border-gray-200"></div>
          </div>

          {/* Social login */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full h-12 bg-white border border-gray-300 rounded-full font-medium flex items-center justify-center transition-all duration-300 hover:bg-gray-50 disabled:opacity-70 disabled:cursor-not-allowed shadow-sm"
          >
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot_2025-03-29_at_6.25.40_PM-removebg-preview-uY4e1CcJjAAuJJtuXGDJmCaxXOZS1Z.png"
              alt="Google"
              width={20}
              height={20}
              className="mr-2"
            />
            Continue with Google
          </button>

          {/* Toggle between login and register */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              {mode === "login" ? "Don't have an account?" : "Already have an account?"}
              <button
                type="button"
                onClick={() => setMode(mode === "login" ? "register" : "login")}
                className="ml-2 text-[#e67e5a] hover:underline font-medium"
              >
                {mode === "login" ? "Sign up" : "Sign in"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

