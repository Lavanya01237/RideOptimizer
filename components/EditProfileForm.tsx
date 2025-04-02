"use client"

import type React from "react"

import { useState } from "react"
import { User, Mail, Phone, Calendar, X, Camera, Check, Loader2 } from "lucide-react"

interface EditProfileFormProps {
  onClose: () => void
  userData: {
    name: string
    email: string
    phone: string
    joinDate: string
    profileImage: string
    [key: string]: any
  }
  themeColors: {
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
  darkMode?: boolean
}

export function EditProfileForm({ onClose, userData, themeColors, darkMode = false }: EditProfileFormProps) {
  const [name, setName] = useState(userData.name)
  const [email, setEmail] = useState(userData.email)
  const [phone, setPhone] = useState(userData.phone)
  const [profileImage, setProfileImage] = useState(userData.profileImage)
  const [isUploading, setIsUploading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [errors, setErrors] = useState<{
    name?: string
    email?: string
    phone?: string
  }>({})

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form
    const newErrors: {
      name?: string
      email?: string
      phone?: string
    } = {}

    if (!name.trim()) {
      newErrors.name = "Name is required"
    }

    if (!email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email is invalid"
    }

    if (!phone.trim()) {
      newErrors.phone = "Phone number is required"
    } else if (!/^\+?[0-9\s$$$$-]{10,20}$/.test(phone)) {
      newErrors.phone = "Phone number is invalid"
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    // Clear errors
    setErrors({})

    // Simulate saving
    setIsSaving(true)

    try {
      // In a real app, you would send the updated data to your backend
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Close the form after successful save
      onClose()
    } catch (error) {
      console.error("Error saving profile:", error)
    } finally {
      setIsSaving(false)
    }
  }

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)

    // Simulate upload delay
    setTimeout(() => {
      // In a real app, you would upload the file to your storage service
      // and get back a URL to the uploaded image

      // For demo purposes, we'll use a placeholder
      const reader = new FileReader()
      reader.onload = (event) => {
        if (event.target?.result) {
          setProfileImage(event.target.result as string)
        }
      }
      reader.readAsDataURL(file)

      setIsUploading(false)
    }, 1500)
  }

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black bg-opacity-50 animate-fadeIn">
      <div className={`${themeColors.card} w-full max-w-lg rounded-xl shadow-xl overflow-hidden animate-scaleIn`}>
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className={`text-xl font-semibold ${themeColors.text}`}>Edit Profile</h2>
          <button
            onClick={onClose}
            className={`p-2 rounded-full hover:${darkMode ? "bg-gray-700" : "bg-gray-100"} transition-colors`}
          >
            <X className={`h-5 w-5 ${themeColors.text}`} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {/* Profile Image */}
          <div className="flex flex-col items-center mb-8">
            <div className="relative">
              <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 mb-3">
                <img
                  src={profileImage || "/placeholder.svg?height=100&width=100"}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
                {isUploading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full">
                    <Loader2 className="h-8 w-8 text-white animate-spin" />
                  </div>
                )}
              </div>
              <label
                htmlFor="profile-image"
                className={`absolute bottom-0 right-0 p-2 rounded-full ${themeColors.buttonPrimary} ${themeColors.buttonText} cursor-pointer`}
              >
                <Camera className="h-4 w-4" />
              </label>
              <input
                type="file"
                id="profile-image"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
                disabled={isUploading}
              />
            </div>
            <p className={`text-sm ${themeColors.secondaryText}`}>
              Click the camera icon to change your profile picture
            </p>
          </div>

          {/* Form Fields */}
          <div className="space-y-6">
            <div>
              <label htmlFor="name" className={`block text-sm font-medium ${themeColors.secondaryText} mb-1`}>
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className={`h-5 w-5 ${themeColors.highlight}`} />
                </div>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`pl-10 w-full rounded-lg h-12 border ${errors.name ? "border-red-500" : themeColors.border} ${darkMode ? "bg-gray-800" : "bg-white"} ${themeColors.text} px-4 focus:ring-2 focus:ring-${themeColors.highlight} focus:border-${themeColors.highlight} transition-colors`}
                  placeholder="Enter your full name"
                />
              </div>
              {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
            </div>

            <div>
              <label htmlFor="email" className={`block text-sm font-medium ${themeColors.secondaryText} mb-1`}>
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className={`h-5 w-5 ${themeColors.highlight}`} />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`pl-10 w-full rounded-lg h-12 border ${errors.email ? "border-red-500" : themeColors.border} ${darkMode ? "bg-gray-800" : "bg-white"} ${themeColors.text} px-4 focus:ring-2 focus:ring-${themeColors.highlight} focus:border-${themeColors.highlight} transition-colors`}
                  placeholder="Enter your email address"
                />
              </div>
              {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
            </div>

            <div>
              <label htmlFor="phone" className={`block text-sm font-medium ${themeColors.secondaryText} mb-1`}>
                Phone Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className={`h-5 w-5 ${themeColors.highlight}`} />
                </div>
                <input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className={`pl-10 w-full rounded-lg h-12 border ${errors.phone ? "border-red-500" : themeColors.border} ${darkMode ? "bg-gray-800" : "bg-white"} ${themeColors.text} px-4 focus:ring-2 focus:ring-${themeColors.highlight} focus:border-${themeColors.highlight} transition-colors`}
                  placeholder="Enter your phone number"
                />
              </div>
              {errors.phone && <p className="mt-1 text-sm text-red-500">{errors.phone}</p>}
            </div>

            <div>
              <label htmlFor="join-date" className={`block text-sm font-medium ${themeColors.secondaryText} mb-1`}>
                Member Since
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar className={`h-5 w-5 ${themeColors.highlight}`} />
                </div>
                <input
                  id="join-date"
                  type="text"
                  value={userData.joinDate}
                  disabled
                  className={`pl-10 w-full rounded-lg h-12 border ${themeColors.border} ${darkMode ? "bg-gray-700" : "bg-gray-100"} ${themeColors.secondaryText} px-4 cursor-not-allowed`}
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">Join date cannot be changed</p>
            </div>
          </div>

          {/* Form Actions */}
          <div className="mt-8 flex space-x-4">
            <button
              type="button"
              onClick={onClose}
              className={`flex-1 py-3 px-4 rounded-lg border ${themeColors.border} ${themeColors.text} hover:${darkMode ? "bg-gray-700" : "bg-gray-50"} transition-colors`}
              disabled={isSaving}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className={`flex-1 py-3 px-4 rounded-lg ${themeColors.buttonPrimary} ${themeColors.buttonText} hover:opacity-90 transition-colors flex items-center justify-center`}
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

