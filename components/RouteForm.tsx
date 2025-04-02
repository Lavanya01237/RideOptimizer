"use client"

import type React from "react"
import { useState, useEffect, useRef, useCallback } from "react"
import {
  Clock,
  MapPin,
  Locate,
  Calendar,
  Settings,
  Coffee,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  Info,
  CheckCircle,
  TrendingUp,
  Trash2,
  PlusCircle,
  AlertCircle,
  Star,
  X,
} from "lucide-react"
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip"

interface RouteFormProps {
  onSubmit: (data: {
    lat: number
    lng: number
    startTime: number
    endTime: number
    algorithm: "reinforcement" | "greedy"
    breakTimes: { startHour: number; endHour: number }[]
  }) => void
  isLoading?: boolean
  darkMode?: boolean
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

export default function RouteForm({ onSubmit, isLoading, darkMode = false, themeColors }: RouteFormProps) {
  const [lat, setLat] = useState<number>(1.3521)
  const [lng, setLng] = useState<number>(103.8198)
  const [startTime, setStartTime] = useState<number>(6) // Changed default to 6 AM
  const [endTime, setEndTime] = useState<number>(25) // Default end time to 1 AM next day (25)
  const [algorithm, setAlgorithm] = useState<"reinforcement" | "greedy">("reinforcement")
  const [isGettingLocation, setIsGettingLocation] = useState(false)
  const [expanded, setExpanded] = useState<boolean>(true)
  const [breakTimeExpanded, setBreakTimeExpanded] = useState<boolean>(false)
  // Replace the single break time state variables with an array of break times
  const [breakTimes, setBreakTimes] = useState<{ startHour: number; endHour: number }[]>([
    { startHour: 12, endHour: 13 }, // Default lunch break
  ])
  const [customBreak, setCustomBreak] = useState<boolean>(false)
  const [activeStep, setActiveStep] = useState<number>(1)
  const [locationName, setLocationName] = useState<string>("")
  const [locationError, setLocationError] = useState<string>("")
  const formRef = useRef<HTMLFormElement>(null)

  // Add a new state for managing the favorites modal visibility
  const [showManageFavorites, setShowManageFavorites] = useState(false)
  // Add a state to store favorite locations (instead of hardcoding them)
  const [favoriteLocations, setFavoriteLocations] = useState([
    { name: "Home", lat: 1.3644, lng: 103.9915, isFavorite: true, address: "Changi, Singapore" },
    { name: "Office", lat: 1.2789, lng: 103.8536, isFavorite: true, address: "Downtown Core, Singapore" },
    { name: "Shopping Mall", lat: 1.3006, lng: 103.8368, isFavorite: true, address: "Orchard Road, Singapore" },
    { name: "Gym", lat: 1.3162, lng: 103.7649, isFavorite: true, address: "Jurong East, Singapore" },
  ])
  // Add a state for the new favorite location being added
  const [newFavorite, setNewFavorite] = useState({ name: "", address: "", lat: 0, lng: 0 })
  // Add a state for tracking which favorite is being edited
  const [editingIndex, setEditingIndex] = useState<number | null>(null)

  // Add these new states for address search functionality
  const [addressSuggestions, setAddressSuggestions] = useState<
    Array<{
      place_id: number
      display_name: string
      lat: string
      lon: string
    }>
  >([])
  const [isSearching, setIsSearching] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)

  // Add this debounce function for search
  const debounce = (func: Function, delay: number) => {
    let timeoutId: NodeJS.Timeout
    return (...args: any[]) => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => {
        func.apply(null, args)
      }, delay)
    }
  }

  // Add this function to search for addresses
  const searchAddress = async (query: string) => {
    if (!query || query.length < 3) {
      setAddressSuggestions([])
      return
    }

    setIsSearching(true)
    try {
      // Check if the query is a Singapore postal code (6 digits)
      const isPostalCode = /^\d{6}$/.test(query.trim())

      let searchUrl = ""
      if (isPostalCode) {
        // If it's a postal code, use it directly with Singapore country code
        searchUrl = `https://nominatim.openstreetmap.org/search?format=json&postalcode=${encodeURIComponent(query.trim())}&countrycodes=sg&limit=5`
      } else {
        // Otherwise use the regular search with Singapore bounds
        searchUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&viewbox=103.6,1.2,104.1,1.5&bounded=1&countrycodes=sg`
      }

      const response = await fetch(searchUrl, {
        headers: {
          "Accept-Language": "en-US,en;q=0.9",
          "User-Agent": "RideOptimizer/1.0",
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch address suggestions")
      }

      const data = await response.json()
      setAddressSuggestions(data)
      setShowSuggestions(true)
    } catch (error) {
      console.error("Error searching for addresses:", error)
    } finally {
      setIsSearching(false)
    }
  }

  // Create a debounced search function
  const debouncedSearch = useCallback(
    debounce((query: string) => {
      searchAddress(query)
    }, 500),
    [],
  )

  // Add this function to handle address selection from suggestions
  const handleAddressSuggestionSelect = (suggestion: {
    place_id: number
    display_name: string
    lat: string
    lon: string
  }) => {
    setNewFavorite({
      ...newFavorite,
      address: suggestion.display_name,
      lat: Number.parseFloat(suggestion.lat),
      lng: Number.parseFloat(suggestion.lon),
    })
    setShowSuggestions(false)
  }

  // Effect to ensure break time is within shift hours
  useEffect(() => {
    breakTimes.forEach((breakTime, index) => {
      if (breakTime.startHour < startTime) {
        updateBreakTime(index, "startHour", startTime)
      }
      if (breakTime.endHour > endTime) {
        updateBreakTime(index, "endHour", endTime)
      }
      if (breakTime.startHour >= breakTime.endHour) {
        updateBreakTime(index, "endHour", breakTime.startHour + 1)
      }
    })
  }, [startTime, endTime, breakTimes])

  // Update the handleSubmit function to include all break times
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      lat,
      lng,
      startTime,
      endTime,
      algorithm,
      breakTimes, // Pass the entire array of break times
    })
  }

  const getCurrentLocation = () => {
    // Clear any previous errors
    setLocationError("")

    // Check if geolocation is supported
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser")
      return
    }

    setIsGettingLocation(true)

    try {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLat(position.coords.latitude)
          setLng(position.coords.longitude)
          setLocationName("Current Location")
          setIsGettingLocation(false)
        },
        (error) => {
          console.error("Error getting location:", error)

          // Handle specific error types
          let errorMessage = "Unable to retrieve your location"

          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = "Location access was denied. Please enter your location manually."
              break
            case error.POSITION_UNAVAILABLE:
              errorMessage = "Location information is unavailable. Please enter your location manually."
              break
            case error.TIMEOUT:
              errorMessage = "Location request timed out. Please try again or enter your location manually."
              break
          }

          setLocationError(errorMessage)
          setIsGettingLocation(false)
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        },
      )
    } catch (err) {
      console.error("Geolocation error:", err)
      setLocationError("Location service error. Please enter your location manually.")
      setIsGettingLocation(false)
    }
  }

  // Default break times
  const defaultBreakOptions = [
    { label: "Lunch (12 PM - 1 PM)", startTime: 12, endTime: 13 },
    { label: "Early Lunch (11 AM - 12 PM)", startTime: 11, endTime: 12 },
    { label: "Late Lunch (1 PM - 2 PM)", startTime: 13, endTime: 14 },
    { label: "Dinner (6 PM - 7 PM)", startTime: 18, endTime: 19 },
  ]

  // Popular Singapore locations
  const popularLocations = [
    { name: "Downtown Core", lat: 1.2789, lng: 103.8536 },
    { name: "Orchard", lat: 1.3006, lng: 103.8368 },
    { name: "Changi Airport", lat: 1.3644, lng: 103.9915 },
    { name: "Jurong East", lat: 1.3162, lng: 103.7649 },
    { name: "Woodlands", lat: 1.4019, lng: 103.7855 },
  ]

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

  // Helper function to format time
  const formatTimeDisplay = (hour: number): string => {
    if (hour === 12) return "12 PM"
    if (hour === 24) return "12 AM (next day)"
    if (hour === 0) return "12 AM"
    if (hour > 24) return `${hour - 24} AM (next day)`
    if (hour > 12) return `${hour - 12} PM`
    return `${hour} AM`
  }

  // Function to handle next step
  const goToNextStep = () => {
    if (activeStep < 3) {
      setActiveStep(activeStep + 1)
      // Scroll to top of form
      if (formRef.current) {
        formRef.current.scrollIntoView({ behavior: "smooth" })
      }
    } else {
      handleSubmit(new Event("submit") as any)
    }
  }

  // Function to handle previous step
  const goToPreviousStep = () => {
    if (activeStep > 1) {
      setActiveStep(activeStep - 1)
      // Scroll to top of form
      if (formRef.current) {
        formRef.current.scrollIntoView({ behavior: "smooth" })
      }
    }
  }

  // Add a function to add a new break time
  const addBreakTime = () => {
    // Add a new break time 2 hours after the last break or after start time
    const lastBreakEnd = breakTimes.length > 0 ? breakTimes[breakTimes.length - 1].endHour : startTime + 2

    setBreakTimes([
      ...breakTimes,
      {
        startHour: lastBreakEnd + 1,
        endHour: lastBreakEnd + 2,
      },
    ])
  }

  // Add a function to remove a break time
  const removeBreakTime = (index: number) => {
    const newBreakTimes = [...breakTimes]
    newBreakTimes.splice(index, 1)
    setBreakTimes(newBreakTimes)
  }

  // Add a function to update a break time
  const updateBreakTime = (index: number, field: "startHour" | "endHour", value: number) => {
    const newBreakTimes = [...breakTimes]
    newBreakTimes[index][field] = value
    setBreakTimes(newBreakTimes)
  }

  // Update the estimated earnings calculation to account for all break times
  const calculateEstimatedEarnings = (): string => {
    const totalBreakTime = breakTimes.reduce((acc, curr) => acc + (curr.endHour - curr.startHour), 0)
    const hours = endTime - startTime - totalBreakTime
    const baseRate = algorithm === "reinforcement" ? 25 : 20
    const estimatedEarnings = hours * baseRate

    // Return a range
    const min = Math.floor(estimatedEarnings * 0.8)
    const max = Math.ceil(estimatedEarnings * 1.2)

    return `$${min} - $${max}`
  }

  // Add these functions to handle favorite locations management
  const addFavoriteLocation = () => {
    if (!newFavorite.name || !newFavorite.address) return

    setFavoriteLocations([
      ...favoriteLocations,
      {
        name: newFavorite.name,
        lat: newFavorite.lat,
        lng: newFavorite.lng,
        isFavorite: true,
        address: newFavorite.address,
      },
    ])

    setNewFavorite({ name: "", address: "", lat: 0, lng: 0 })
  }

  const removeFavoriteLocation = (index: number) => {
    const updatedFavorites = [...favoriteLocations]
    updatedFavorites.splice(index, 1)
    setFavoriteLocations(updatedFavorites)
  }

  const startEditingFavorite = (index: number) => {
    setEditingIndex(index)
    const location = favoriteLocations[index]
    setNewFavorite({
      name: location.name,
      address: location.address || "",
      lat: location.lat,
      lng: location.lng,
    })
  }

  const saveEditedFavorite = () => {
    if (editingIndex === null) return
    if (!newFavorite.name || !newFavorite.address) return

    const updatedFavorites = [...favoriteLocations]
    updatedFavorites[editingIndex] = {
      name: newFavorite.name,
      lat: newFavorite.lat,
      lng: newFavorite.lng,
      isFavorite: true,
      address: newFavorite.address,
    }

    setFavoriteLocations(updatedFavorites)
    setEditingIndex(null)
    setNewFavorite({ name: "", address: "", lat: 0, lng: 0 })
  }

  const cancelEditing = () => {
    setEditingIndex(null)
    setNewFavorite({ name: "", address: "", lat: 0, lng: 0 })
  }

  return (
    <div className={`rounded-xl overflow-hidden transition-all duration-300 ${colors.card} shadow-lg`}>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');
        
        .modern-form {
          font-family: -apple-system, BlinkMacSystemFont, 'Inter', 'SF Pro Text', 'SF Pro Display', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
        }
        
        .modern-form h2 {
          font-weight: 600;
          letter-spacing: -0.01em;
        }
        
        .modern-form label {
          font-weight: 500;
          color: #4b5563;
          font-size: 0.875rem;
        }
        
        .modern-form input, 
        .modern-form select, 
        .modern-form button {
          font-weight: 400;
        }
        
        .modern-form button {
          font-weight: 500;
        }
        
        .modern-form .section-title {
          font-weight: 600;
          letter-spacing: -0.01em;
        }

        /* Animations */
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }

        .step-content {
          animation: fadeIn 0.4s ease-out forwards;
        }

        /* Progress bar animation */
        @keyframes progressGrow {
          from { width: 0%; }
          to { width: var(--target-width); }
        }

        .progress-bar {
          animation: progressGrow 0.5s ease-out forwards;
        }

        /* Tooltip styles */
        .tooltip {
          position: relative;
          display: inline-block;
        }

        .tooltip .tooltip-text {
          visibility: hidden;
          width: 200px;
          background-color: #333;
          color: #fff;
          text-align: center;
          border-radius: 6px;
          padding: 8px;
          position: absolute;
          z-index: 1;
          bottom: 125%;
          left: 50%;
          margin-left: -100px;
          opacity: 0;
          transition: opacity 0.3s;
        }

        .tooltip:hover .tooltip-text {
          visibility: visible;
          opacity: 1;
        }
      `}</style>

      <div className="modern-form" ref={formRef}>
        <div
          className={`px-6 py-5 flex justify-between items-center ${expanded ? "border-b" : ""} ${colors.border} cursor-pointer bg-[#f9f9f9]`}
          onClick={() => setExpanded(!expanded)}
        >
          <h2 className={`text-xl ${colors.text} flex items-center`}>
            <MapPin className={`mr-3 h-5 w-5 ${colors.highlight}`} />
            Plan Your Route
          </h2>
          <div className={`transform transition-transform ${expanded ? "rotate-180" : ""}`}>
            {expanded ? (
              <ChevronUp className={`h-5 w-5 ${colors.text}`} />
            ) : (
              <ChevronDown className={`h-5 w-5 ${colors.text}`} />
            )}
          </div>
        </div>

        {expanded && (
          <form onSubmit={handleSubmit} className="px-6 py-5 space-y-6">
            {/* Progress bar */}
            <div className="mb-6">
              <div className="flex justify-between mb-2">
                <div className="flex items-center">
                  <span className={`text-sm font-medium ${colors.text}`}>
                    Step {activeStep} of 3:
                    {activeStep === 1 && " Location"}
                    {activeStep === 2 && " Schedule"}
                    {activeStep === 3 && " Optimization"}
                  </span>
                </div>
                <span className={`text-sm ${colors.secondaryText}`}>
                  {Math.round((activeStep / 3) * 100)}% Complete
                </span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full ${colors.buttonPrimary} progress-bar`}
                  style={{ "--target-width": `${(activeStep / 3) * 100}%` } as React.CSSProperties}
                ></div>
              </div>
            </div>

            {/* Step 1: Location */}
            {activeStep === 1 && (
              <div className="step-content space-y-5">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className={`block ${colors.secondaryText}`}>Starting Location</label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button type="button" className="text-gray-400 hover:text-gray-600">
                            <HelpCircle size={16} />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent side="top">
                          <p className="text-xs max-w-xs">
                            This is where your route will begin. You can use your current location or select a popular
                            location.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <div className="relative">
                    <div className={`absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none`}>
                      <MapPin className={`h-5 w-5 text-[#e67e5a]`} />
                    </div>
                    <input
                      id="startLocationInput"
                      type="text"
                      placeholder={locationName || "Enter location or coordinates"}
                      className={`pl-12 w-full rounded-lg h-12 border ${colors.border} bg-white text-[#2d2d2d] placeholder-gray-400 px-4 focus:ring-1 focus:ring-[#e67e5a] focus:border-[#e67e5a] focus:outline-none transition-all duration-200 text-base`}
                      value={locationName || `${lat.toFixed(4)}, ${lng.toFixed(4)}`}
                      onChange={(e) => {
                        setLocationName(e.target.value)
                        const parts = e.target.value.split(",")
                        if (parts.length === 2) {
                          const newLat = Number.parseFloat(parts[0].trim())
                          const newLng = Number.parseFloat(parts[1].trim())
                          if (!isNaN(newLat) && !isNaN(newLng)) {
                            setLat(newLat)
                            setLng(newLng)
                          }
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={getCurrentLocation}
                      disabled={isGettingLocation}
                      className={`absolute inset-y-0 right-0 flex items-center pr-4 ${
                        isGettingLocation ? "opacity-50" : "hover:text-[#e67e5a]"
                      } transition-colors duration-200`}
                      title="Use my current location"
                    >
                      <Locate size={18} className={`text-[#e67e5a] ${isGettingLocation ? "animate-pulse" : ""}`} />
                    </button>
                  </div>

                  {/* Location error message */}
                  {locationError && (
                    <div className="mt-2 p-3 rounded-lg bg-red-50 border border-red-100 text-red-700 text-sm flex items-start">
                      <AlertCircle size={16} className="text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>{locationError}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className={`block mb-2 ${colors.secondaryText}`}>Popular Locations</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {popularLocations.map((location, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => {
                          setLat(location.lat)
                          setLng(location.lng)
                          setLocationName(location.name)
                          setLocationError("") // Clear any error when selecting a location
                        }}
                        className={`text-sm py-2 px-3 rounded-lg border transition-all duration-200 flex items-center justify-center ${
                          locationName === location.name
                            ? `${colors.buttonSecondary} border-[#e67e5a] text-[#e67e5a]`
                            : `bg-[#f0f0f0] border-transparent text-[#2d2d2d] hover:bg-[#e8e8e8]`
                        }`}
                      >
                        {locationName === location.name && <CheckCircle size={14} className="mr-1.5" />}
                        {location.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className={`block ${colors.secondaryText}`}>Favorite Locations</label>
                    <button
                      type="button"
                      className="text-xs text-blue-500 hover:underline"
                      title="Manage favorites"
                      onClick={(e) => {
                        e.preventDefault()
                        setShowManageFavorites(true)
                      }}
                    >
                      Manage
                    </button>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {favoriteLocations.map((location, index) => (
                      <button
                        key={`favorite-${index}`}
                        type="button"
                        onClick={() => {
                          setLat(location.lat)
                          setLng(location.lng)
                          setLocationName(location.name)
                          setLocationError("") // Clear any error when selecting a location
                        }}
                        className={`text-sm py-2 px-3 rounded-lg border transition-all duration-200 flex items-center justify-center ${
                          locationName === location.name
                            ? `${colors.buttonSecondary} border-[#e67e5a] text-[#e67e5a]`
                            : `bg-[#f0f0f0] border-transparent text-[#2d2d2d] hover:bg-[#e8e8e8]`
                        }`}
                      >
                        {locationName === location.name && <CheckCircle size={14} className="mr-1.5" />}
                        <Star
                          size={14}
                          className={`mr-1.5 ${location.isFavorite ? "fill-yellow-400 text-yellow-400" : "text-gray-400"}`}
                        />
                        {location.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div className={`p-4 rounded-lg bg-blue-50 border border-blue-100 mt-4`}>
                  <div className="flex">
                    <Info size={18} className="text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-blue-700">
                        Select your starting location to begin planning your route. You can use your current location or
                        choose from popular destinations.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Schedule */}
            {activeStep === 2 && (
              <div className="step-content space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className={`block ${colors.secondaryText}`}>Start Time</label>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button type="button" className="text-gray-400 hover:text-gray-600">
                              <HelpCircle size={16} />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent side="top">
                            <p className="text-xs max-w-xs">
                              When do you want to start your shift? This helps us plan your route efficiently.
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <div className="relative">
                      <div className={`absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none`}>
                        <Clock className={`h-4 w-4 text-[#e67e5a]`} />
                      </div>
                      <select
                        value={startTime}
                        onChange={(e) => {
                          const newStartTime = Number.parseInt(e.target.value, 10)
                          setStartTime(newStartTime)
                          // Ensure end time is always later than start time
                          if (newStartTime >= endTime) {
                            setEndTime(newStartTime + 8 > 24 ? 24 : newStartTime + 8)
                          }
                        }}
                        className={`pl-9 w-full rounded-lg h-12 border ${colors.border} bg-white text-[#2d2d2d] px-3 focus:ring-1 focus:ring-[#e67e5a] focus:border-[#e67e5a] focus:outline-none transition-all duration-200 appearance-none text-base`}
                      >
                        {Array.from({ length: 19 }, (_, i) => i + 6).map((hour) => (
                          <option key={hour} value={hour}>
                            {hour === 12 ? "12 PM" : hour > 12 ? `${hour - 12} PM` : `${hour} AM`}
                          </option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <ChevronDown className="h-4 w-4 text-gray-400" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className={`block ${colors.secondaryText}`}>End Time</label>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button type="button" className="text-gray-400 hover:text-gray-600">
                              <HelpCircle size={16} />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent side="top">
                            <p className="text-xs max-w-xs">
                              When do you want to end your shift? We'll optimize your route to finish by this time.
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <div className="relative">
                      <div className={`absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none`}>
                        <Clock className={`h-4 w-4 text-[#e67e5a]`} />
                      </div>
                      <select
                        value={endTime}
                        onChange={(e) => setEndTime(Number.parseInt(e.target.value, 10))}
                        className={`pl-9 w-full rounded-lg h-12 border ${colors.border} bg-white text-[#2d2d2d] px-3 focus:ring-1 focus:ring-[#e67e5a] focus:border-[#e67e5a] focus:outline-none transition-all duration-200 appearance-none text-base`}
                      >
                        {Array.from({ length: 25 - startTime }, (_, i) => i + startTime + 1).map((hour) => {
                          // For hours 24+ (next day), convert to proper display
                          const displayHour = hour >= 24 ? hour - 24 : hour
                          const nextDay = hour >= 24
                          return (
                            <option key={hour} value={hour}>
                              {displayHour === 12
                                ? "12 PM"
                                : displayHour > 12
                                  ? `${displayHour - 12} PM${nextDay ? " (next day)" : ""}`
                                  : `${displayHour} AM${nextDay ? " (next day)" : ""}`}
                            </option>
                          )
                        })}
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <ChevronDown className="h-4 w-4 text-gray-400" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Break Time Section */}
                <div className={`rounded-lg p-4 bg-[#f9f9f9] border ${colors.border} mt-1`}>
                  <div
                    className="flex justify-between items-center cursor-pointer"
                    onClick={() => setBreakTimeExpanded(!breakTimeExpanded)}
                  >
                    <div className="flex items-center">
                      <Coffee className={`h-4 w-4 mr-2 ${colors.highlight}`} />
                      <span className={`section-title text-base ${colors.text}`}>Break Times</span>
                    </div>
                    {breakTimeExpanded ? (
                      <ChevronUp className={`h-4 w-4 text-gray-400`} />
                    ) : (
                      <ChevronDown className={`h-4 w-4 text-gray-400`} />
                    )}
                  </div>

                  {breakTimeExpanded && (
                    <div className="mt-4 space-y-4 animate-fadeIn">
                      {breakTimes.length > 0 ? (
                        <div className="space-y-3">
                          {breakTimes.map((breakTime, index) => (
                            <div
                              key={index}
                              className="flex items-center space-x-2 p-3 rounded-lg bg-[#f9f9f8] border border-[#e8e8e3]"
                            >
                              <div className="flex-1">
                                <div className="grid grid-cols-2 gap-3">
                                  <div>
                                    <label className="text-xs text-[#6b6b6b] mb-1 block">Start</label>
                                    <select
                                      value={breakTime.startHour}
                                      onChange={(e) =>
                                        updateBreakTime(index, "startHour", Number.parseInt(e.target.value))
                                      }
                                      className="w-full p-2 text-sm rounded-md border border-[#e8e8e3]"
                                    >
                                      {Array.from({ length: 24 }, (_, i) => (
                                        <option key={i} value={i}>
                                          {i === 0 ? "12 AM" : i === 12 ? "12 PM" : i < 12 ? `${i} AM` : `${i - 12} PM`}
                                        </option>
                                      ))}
                                    </select>
                                  </div>
                                  <div>
                                    <label className="text-xs text-[#6b6b6b] mb-1 block">End</label>
                                    <select
                                      value={breakTime.endHour}
                                      onChange={(e) =>
                                        updateBreakTime(index, "endHour", Number.parseInt(e.target.value))
                                      }
                                      className="w-full p-2 text-sm rounded-md border border-[#e8e8e3]"
                                    >
                                      {Array.from({ length: 24 }, (_, i) => (
                                        <option key={i} value={i}>
                                          {i === 0 ? "12 AM" : i === 12 ? "12 PM" : i < 12 ? `${i} AM` : `${i - 12} PM`}
                                        </option>
                                      ))}
                                    </select>
                                  </div>
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={() => removeBreakTime(index)}
                                className="p-1.5 rounded-full hover:bg-[#f0f0eb]"
                              >
                                <Trash2 className="h-4 w-4 text-[#6b6b6b]" />
                              </button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-4 text-[#6b6b6b] bg-[#f9f9f8] rounded-lg border border-dashed border-[#e8e8e3]">
                          <p className="text-sm">No breaks scheduled</p>
                          <button
                            type="button"
                            onClick={addBreakTime}
                            className="mt-2 text-[#e67e5a] text-sm font-medium"
                          >
                            Add your first break
                          </button>
                        </div>
                      )}

                      <button
                        type="button"
                        onClick={addBreakTime}
                        className="flex items-center space-x-1 text-sm py-1 px-2 rounded-md bg-[#e1f0ed] text-[#2d2d2d]"
                      >
                        <PlusCircle className="h-3.5 w-3.5 mr-1" />
                        <span>Add Break</span>
                      </button>

                      <div className={`text-sm p-3 rounded-lg bg-white ${colors.text} mt-1`}>
                        <span className="font-medium">Current breaks:</span>{" "}
                        <span>
                          {breakTimes.map((breakTime, index) => (
                            <span key={index}>
                              {formatTimeDisplay(breakTime.startHour)} - {formatTimeDisplay(breakTime.endHour)}
                              {index < breakTimes.length - 1 ? ", " : ""}
                            </span>
                          ))}
                        </span>
                        <p className={`mt-1.5 ${colors.secondaryText} text-sm`}>
                          No routes will be scheduled during these periods.
                        </p>
                      </div>
                    </div>
                  )}

                  {!breakTimeExpanded && (
                    <div className={`mt-2.5 text-sm ${colors.text}`}>
                      <span className="font-medium">Current breaks:</span>{" "}
                      <span>
                        {breakTimes.map((breakTime, index) => (
                          <span key={index}>
                            {formatTimeDisplay(breakTime.startHour)} - {formatTimeDisplay(breakTime.endHour)}
                            {index < breakTimes.length - 1 ? ", " : ""}
                          </span>
                        ))}
                      </span>
                    </div>
                  )}
                </div>

                <div className={`p-4 rounded-lg bg-[#e1f0ed] border border-[#c5e0db] mt-2`}>
                  <div className="flex">
                    <Info size={18} className="text-[#2d7a68] mr-2 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-[#2d7a68]">
                        Your shift is scheduled for <span className="font-medium">{endTime - startTime} hours</span>{" "}
                        with a{" "}
                        <span className="font-medium">
                          {breakTimes.reduce((acc, curr) => acc + (curr.endHour - curr.startHour), 0)} hour break
                        </span>
                        . We'll optimize your route to maximize earnings during your working hours.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Optimization */}
            {activeStep === 3 && (
              <div className="step-content space-y-5">
                <div className="mt-1">
                  <div className="flex items-center justify-between mb-2">
                    <label className={`block ${colors.secondaryText}`}>Optimization Algorithm</label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button type="button" className="text-gray-400 hover:text-gray-600">
                            <HelpCircle size={16} />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent side="top">
                          <p className="text-xs max-w-xs">
                            AI Optimized uses advanced machine learning to maximize your earnings. Standard uses
                            traditional route planning.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setAlgorithm("reinforcement")}
                      className={`h-16 flex flex-col items-center justify-center space-y-1 rounded-lg border ${
                        algorithm === "reinforcement"
                          ? "bg-[#e67e5a] border-[#e67e5a] text-white"
                          : "bg-white border-[#e8e8e3] text-[#2d2d2d] hover:bg-[#f9f9f9]"
                      } transition-all duration-200`}
                    >
                      <Settings className="h-5 w-5" />
                      <span className="text-sm font-medium">AI Optimized</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setAlgorithm("greedy")}
                      className={`h-16 flex flex-col items-center justify-center space-y-1 rounded-lg border ${
                        algorithm === "greedy"
                          ? "bg-[#e67e5a] border-[#e67e5a] text-white"
                          : "bg-white border-[#e8e8e3] text-[#2d2d2d] hover:bg-[#f9f9f9]"
                      } transition-all duration-200`}
                    >
                      <Calendar className="h-5 w-5" />
                      <span className="text-sm font-medium">Standard</span>
                    </button>
                  </div>
                </div>

                <div
                  className={`p-4 rounded-lg ${algorithm === "reinforcement" ? "bg-[#e1f0ed] border-[#c5e0db]" : "bg-[#f0f0eb] border-[#e8e8e3]"} border mt-2`}
                >
                  <div className="flex items-start">
                    {algorithm === "reinforcement" ? (
                      <TrendingUp className="h-5 w-5 text-[#2d7a68] mr-2 mt-0.5" />
                    ) : (
                      <Info className="h-5 w-5 text-[#6b6b6b] mr-2 mt-0.5" />
                    )}
                    <div>
                      <p
                        className={`text-sm font-medium ${algorithm === "reinforcement" ? "text-[#2d7a68]" : "text-[#2d2d2d]"}`}
                      >
                        {algorithm === "reinforcement" ? "AI Optimization Enabled" : "Standard Optimization"}
                      </p>
                      <p
                        className={`text-sm mt-1 ${algorithm === "reinforcement" ? "text-[#2d7a68]" : "text-[#6b6b6b]"}`}
                      >
                        {algorithm === "reinforcement"
                          ? "Our AI algorithm analyzes historical data and real-time conditions to maximize your earnings potential."
                          : "Traditional route planning based on distance and time efficiency."}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 p-5 bg-[#f9f9f9] rounded-lg border border-[#e8e8e3]">
                  <h3 className="text-base font-medium mb-3">Route Summary</h3>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="flex flex-col">
                      <span className="text-sm text-[#6b6b6b]">Working Hours</span>
                      <span className="text-base font-medium">
                        {endTime -
                          startTime -
                          breakTimes.reduce((acc, curr) => acc + (curr.endHour - curr.startHour), 0)}{" "}
                        hours
                      </span>
                    </div>
                    {/* Update the route summary to show all break times */}
                    <div className="flex flex-col">
                      <span className="text-sm text-[#6b6b6b]">Break Times</span>
                      <span className="text-base font-medium">
                        {breakTimes.map((breakTime, index) => (
                          <span key={index}>
                            {formatTimeDisplay(breakTime.startHour)} - {formatTimeDisplay(breakTime.endHour)}
                            {index < breakTimes.length - 1 ? ", " : ""}
                          </span>
                        ))}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm text-[#6b6b6b]">Starting Location</span>
                      <span className="text-base font-medium truncate">
                        {locationName
                          ? `${locationName} (${lat.toFixed(4)}, ${lng.toFixed(4)})`
                          : `${lat.toFixed(4)}, ${lng.toFixed(4)}`}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm text-[#6b6b6b]">Estimated Earnings</span>
                      <span className="text-base font-medium text-[#4caf50]">{calculateEstimatedEarnings()}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation buttons */}
            <div className="flex justify-between mt-6">
              {activeStep > 1 ? (
                <button
                  type="button"
                  onClick={goToPreviousStep}
                  className={`py-2 px-4 rounded-lg border ${colors.border} ${colors.text} hover:bg-gray-50 transition-colors duration-200`}
                >
                  Back
                </button>
              ) : (
                <div></div> // Empty div to maintain layout
              )}

              <button
                type={activeStep === 3 ? "submit" : "button"}
                onClick={activeStep < 3 ? goToNextStep : undefined}
                disabled={isLoading}
                className={`py-3 px-6 rounded-lg flex items-center justify-center transition-all duration-300 ${
                  isLoading ? "bg-[#e8a48c]" : "bg-[#e67e5a] hover:bg-[#e06a43]"
                } text-white focus:outline-none focus:ring-2 focus:ring-[#e67e5a] focus:ring-offset-2 disabled:opacity-50 text-base`}
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-3"></div>
                    Optimizing Route...
                  </>
                ) : activeStep < 3 ? (
                  <>
                    Continue
                    <ChevronDown className="ml-2 h-4 w-4 rotate-270" style={{ transform: "rotate(-90deg)" }} />
                  </>
                ) : (
                  "Generate Optimized Route"
                )}
              </button>
            </div>
          </form>
        )}
      </div>
      {showManageFavorites && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black bg-opacity-50 animate-fadeIn">
          <div className={`${colors.card} w-full max-w-md rounded-xl shadow-xl overflow-hidden animate-scaleIn`}>
            <div className="flex justify-between items-center p-4 border-b border-gray-200">
              <h2 className={`text-lg font-semibold ${colors.text}`}>Manage Favorite Locations</h2>
              <button
                onClick={() => setShowManageFavorites(false)}
                className={`p-2 rounded-full hover:${darkMode ? "bg-gray-700" : "bg-gray-100"} transition-colors`}
              >
                <X className={`h-5 w-5 ${colors.text}`} />
              </button>
            </div>

            <div className="p-4 max-h-[60vh] overflow-y-auto">
              {/* Add new favorite form */}
              <div className={`p-4 rounded-lg ${colors.secondaryBg} mb-4`}>
                <h3 className={`text-sm font-medium ${colors.text} mb-3`}>
                  {editingIndex !== null ? "Edit Favorite Location" : "Add New Favorite Location"}
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className={`block text-xs ${colors.secondaryText} mb-1`}>Location Name</label>
                    <input
                      type="text"
                      value={newFavorite.name}
                      onChange={(e) => setNewFavorite({ ...newFavorite, name: e.target.value })}
                      placeholder="e.g. Home, Office"
                      className={`w-full rounded-lg h-9 border ${colors.border} px-3 text-sm focus:ring-1 focus:ring-[#e67e5a] focus:border-[#e67e5a]`}
                    />
                  </div>
                  <div>
                    <label className={`block text-xs ${colors.secondaryText} mb-1`}>Address or Postal Code</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={newFavorite.address}
                        onChange={(e) => {
                          setNewFavorite({ ...newFavorite, address: e.target.value })
                          debouncedSearch(e.target.value)
                        }}
                        placeholder="Enter address or 6-digit postal code"
                        className={`w-full rounded-lg h-9 border ${colors.border} px-3 text-sm focus:ring-1 focus:ring-[#e67e5a] focus:border-[#e67e5a]`}
                      />
                      {isSearching && (
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                          <div className="animate-spin h-4 w-4 border-2 border-[#e67e5a] border-t-transparent rounded-full"></div>
                        </div>
                      )}

                      {/* Address suggestions dropdown */}
                      {showSuggestions && addressSuggestions.length > 0 && (
                        <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
                          {addressSuggestions.map((suggestion) => (
                            <div
                              key={suggestion.place_id}
                              onClick={() => handleAddressSuggestionSelect(suggestion)}
                              className="px-4 py-2 hover:bg-[#f0f0eb] cursor-pointer text-sm"
                            >
                              {suggestion.display_name}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">For postal codes, enter 6 digits (e.g., 238839)</p>
                  </div>
                  <div className="flex justify-end space-x-2 mt-2">
                    {editingIndex !== null && (
                      <button
                        type="button"
                        onClick={cancelEditing}
                        className={`py-1.5 px-3 rounded-lg border ${colors.border} text-sm ${colors.text}`}
                      >
                        Cancel
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={editingIndex !== null ? saveEditedFavorite : addFavoriteLocation}
                      className={`py-1.5 px-3 rounded-lg bg-[#e67e5a] text-white text-sm`}
                      disabled={!newFavorite.name || !newFavorite.address}
                    >
                      {editingIndex !== null ? "Save Changes" : "Add Favorite"}
                    </button>
                  </div>
                </div>
              </div>

              {/* List of favorites */}
              <h3 className={`text-sm font-medium ${colors.text} mb-2`}>Your Favorite Locations</h3>
              {favoriteLocations.length === 0 ? (
                <div className={`p-4 rounded-lg ${colors.secondaryBg} text-center`}>
                  <p className={`text-sm ${colors.secondaryText}`}>No favorite locations yet.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {favoriteLocations.map((location, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded-lg border ${colors.border} flex justify-between items-center`}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center">
                          <Star size={14} className="text-yellow-400 fill-yellow-400 mr-2 flex-shrink-0" />
                          <span className={`font-medium ${colors.text} truncate`}>{location.name}</span>
                        </div>
                        <p className={`text-xs ${colors.secondaryText} mt-1 truncate`}>
                          {location.address || `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}`}
                        </p>
                      </div>
                      <div className="flex space-x-1 ml-2 flex-shrink-0">
                        <button
                          type="button"
                          onClick={() => startEditingFavorite(index)}
                          className={`p-1.5 rounded-full hover:bg-[#f0f0eb]`}
                          title="Edit"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="text-gray-500"
                          >
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                          </svg>
                        </button>
                        <button
                          type="button"
                          onClick={() => removeFavoriteLocation(index)}
                          className={`p-1.5 rounded-full hover:bg-[#f0f0eb]`}
                          title="Remove"
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="p-4 border-t border-gray-200">
              <button
                onClick={() => setShowManageFavorites(false)}
                className={`w-full py-2 rounded-lg ${colors.buttonSecondary} ${colors.highlight} font-medium`}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

