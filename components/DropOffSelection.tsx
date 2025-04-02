"use client"

import type React from "react"

import { useState, useRef } from "react"
import { MapPin, X, ThumbsUp, Coffee } from "lucide-react"
import { Map } from "./Map"

interface Location {
  lat: number
  lng: number
  type: "pickup" | "dropoff"
  time: string
  revenue: number
  tripId: number
}

// Update the props interface to accept an array of break times
interface DropOffSelectionProps {
  darkMode?: boolean
  currentLocation: { lat: number; lng: number }
  onDropOffSelected: (location: DropOffLocation) => void
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
  currentTime?: string
  breakTimes?: { startHour: number; endHour: number }[]
  customRouteLocations?: Location[]
  handleFinishRoute?: () => void
}

interface DropOffLocation {
  id: number
  lat: number
  lng: number
  label: string
  score?: number
  revenue?: number
  distance?: number
  duration?: number
}

// Add a function to perform reverse geocoding
const reverseGeocode = async (lat: number, lng: number): Promise<string> => {
  try {
    // Using OpenStreetMap's Nominatim service for reverse geocoding
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
      {
        headers: {
          "Accept-Language": "en-US,en;q=0.9",
          "User-Agent": "RideOptimizer/1.0",
        },
      },
    )

    if (!response.ok) {
      throw new Error("Failed to fetch location name")
    }

    const data = await response.json()

    // Extract a meaningful location name from the response
    if (data.display_name) {
      // Parse the display name to get a shorter, more readable version
      const parts = data.display_name.split(",")
      // Return first 2-3 parts for a more concise name
      return parts.slice(0, 2).join(", ")
    }

    return "Unknown Location"
  } catch (error) {
    console.error("Error in reverse geocoding:", error)
    return "Unknown Location"
  }
}

export function DropOffSelection({
  darkMode = false,
  currentLocation,
  onDropOffSelected,
  onCancel,
  themeColors,
  currentTime,
  breakTimes = [],
  customRouteLocations = [],
  handleFinishRoute,
}: DropOffSelectionProps) {
  const [dropOffLocations, setDropOffLocations] = useState<DropOffLocation[]>([])
  const [selectedLocationId, setSelectedLocationId] = useState<number | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [aiRecommendedId, setAiRecommendedId] = useState<number | null>(null)
  const mapRef = useRef<any>(null)
  const [isLoadingLocation, setIsLoadingLocation] = useState(false)

  // Add a new state for location search and suggestions
  const [searchQuery, setSearchQuery] = useState("")
  const [locationSuggestions, setLocationSuggestions] = useState<
    Array<{
      place_id: number
      display_name: string
      lat: string
      lon: string
    }>
  >([])
  const [isSearching, setIsSearching] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)

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

  // Update the isDuringBreak function to check all break times
  const isDuringBreak = (hourString: string): boolean => {
    if (!hourString) return false

    const [time, period] = hourString.split(" ")
    let hour = Number.parseInt(time.split(":")[0])
    if (period === "PM" && hour !== 12) hour += 12
    if (period === "AM" && hour === 12) hour = 0

    return breakTimes?.some((breakTime) => hour >= breakTime.startHour && hour < breakTime.endHour) || false
  }

  // Check if we are currently in break time
  const isInBreakTime = currentTime ? isDuringBreak(currentTime) : false

  const handleLocationSelected = async (lat: number, lng: number) => {
    console.log("Location selected:", lat, lng)
    setIsLoadingLocation(true)

    try {
      // Get the actual location name using reverse geocoding
      const locationName = await reverseGeocode(lat, lng)

      // Use the fetched location name or the search query if provided
      const label = searchQuery || locationName

      const newLocation: DropOffLocation = {
        id: Date.now(),
        lat,
        lng,
        label,
      }

      setDropOffLocations([...dropOffLocations, newLocation])
      setSearchQuery("") // Clear the search query after adding location
    } catch (error) {
      console.error("Error getting location name:", error)

      // Fallback to a generic name if geocoding fails
      const label = searchQuery || `Location ${dropOffLocations.length + 1}`

      const newLocation: DropOffLocation = {
        id: Date.now(),
        lat,
        lng,
        label,
      }

      setDropOffLocations([...dropOffLocations, newLocation])
      setSearchQuery("") // Clear the search query after adding location
    } finally {
      setIsLoadingLocation(false)
    }
  }

  // Helper function to calculate distance between two points (in km)
  const haversineDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371 // Earth's radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180
    const dLon = ((lon2 - lon1) * Math.PI) / 180
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  }

  const handleAnalyzeLocations = async () => {
    if (dropOffLocations.length === 0) return

    setIsAnalyzing(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))

      const updatedLocations = dropOffLocations.map((location) => {
        const distance = haversineDistance(currentLocation.lat, currentLocation.lng, location.lat, location.lng)

        const duration = (distance / 60) * 60 * 60 // seconds
        const revenue = 4.5 + distance * 0.7
        const prediction = Math.random() * 2 - 1
        const demandScore = prediction < 0 ? -prediction : 0

        // Check if arrival would be during break time
        let score = revenue * (1 + Math.max(0, demandScore))

        if (currentTime) {
          const [time, period] = currentTime.split(" ")
          let hour = Number.parseInt(time.split(":")[0])
          const minute = Number.parseInt(time.split(":")[1])
          if (period === "PM" && hour !== 12) hour += 12
          if (period === "AM" && hour === 12) hour = 0

          // Estimate arrival hour
          const durationMinutes = Math.ceil(duration / 60)
          const totalMinutes = hour * 60 + minute + durationMinutes
          const arrivalHour = Math.floor(totalMinutes / 60)

          // Penalize locations that would arrive during break time
          if (breakTimes?.some((breakTime) => arrivalHour >= breakTime.startHour && arrivalHour < breakTime.endHour)) {
            score *= 0.5 // Reduce score for locations that arrive during break
          }
        }

        return {
          ...location,
          score,
          revenue,
          distance,
          duration,
        }
      })

      const bestLocation = updatedLocations.reduce(
        (best, current) => (current.score! > best.score! ? current : best),
        updatedLocations[0],
      )

      setAiRecommendedId(bestLocation.id)
      setSelectedLocationId(bestLocation.id)
      setDropOffLocations(updatedLocations)
    } catch (error) {
      console.error("Error analyzing drop-off locations:", error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleLocationSelect = (id: number) => {
    setSelectedLocationId(id)
  }

  const handleConfirmSelection = () => {
    if (selectedLocationId !== null) {
      const selectedLocation = dropOffLocations.find((loc) => loc.id === selectedLocationId)
      if (selectedLocation) {
        onDropOffSelected(selectedLocation)
      }
    }
  }

  const handleRemoveLocation = (id: number) => {
    setDropOffLocations(dropOffLocations.filter((loc) => loc.id !== id))
    if (selectedLocationId === id) {
      setSelectedLocationId(null)
    }
    if (aiRecommendedId === id) {
      setAiRecommendedId(null)
    }
  }

  const formatDuration = (seconds: number): string => {
    const minutes = Math.round(seconds / 60)
    return `${minutes} min`
  }

  // Update the renderBreakTimeNotice function to show all break times
  const renderBreakTimeNotice = () => {
    if (isInBreakTime && breakTimes && breakTimes.length > 0) {
      // Find the current break we're in
      const [time, period] = currentTime?.split(" ") || []
      let currentHour = Number.parseInt(time?.split(":")[0] || "0")
      if (period === "PM" && currentHour !== 12) currentHour += 12
      if (period === "AM" && currentHour === 12) currentHour = 0

      const currentBreak = breakTimes.find(
        (breakTime) => currentHour >= breakTime.startHour && currentHour < breakTime.endHour,
      )

      if (currentBreak) {
        const endHour = currentBreak.endHour
        const formattedEndTime =
          endHour === 12 ? "12:00 PM" : endHour > 12 ? `${endHour - 12}:00 PM` : `${endHour}:00 AM`

        return (
          <div className={`p-3 rounded-lg bg-amber-100 border border-amber-200 mb-4`}>
            <div className="flex items-center">
              <Coffee className={`h-5 w-5 mr-2 text-amber-600`} />
              <span className={`font-medium text-amber-700`}>Break Time</span>
            </div>
            <p className={`text-sm mt-1 text-amber-600`}>
              You're currently on break until {formattedEndTime}. The next trip will be scheduled after your break.
            </p>
          </div>
        )
      }
    }
    return null
  }

  // Add a function to search for locations
  const searchLocations = async (query: string) => {
    if (!query || query.length < 3) {
      setLocationSuggestions([])
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
        throw new Error("Failed to fetch location suggestions")
      }

      const data = await response.json()
      setLocationSuggestions(data)
      setShowSuggestions(true)
    } catch (error) {
      console.error("Error searching for locations:", error)
    } finally {
      setIsSearching(false)
    }
  }

  // Add a function to handle location selection from suggestions
  const handleLocationSuggestionSelect = (suggestion: {
    place_id: number
    display_name: string
    lat: string
    lon: string
  }) => {
    const lat = Number.parseFloat(suggestion.lat)
    const lng = Number.parseFloat(suggestion.lon)

    // Close suggestions
    setShowSuggestions(false)
    setSearchQuery(suggestion.display_name)

    // Handle the selected location
    handleLocationSelected(lat, lng)
  }

  // Add a debounce function for search
  const debounce = (func: Function, delay: number) => {
    let timeoutId: NodeJS.Timeout
    return (...args: any[]) => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => {
        func.apply(null, args)
      }, delay)
    }
  }

  // Create a debounced search function
  const debouncedSearch = useRef(
    debounce((query: string) => {
      searchLocations(query)
    }, 500),
  ).current

  // Update the search query and trigger search
  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    setSearchQuery(query)
    debouncedSearch(query)
  }

  // JSX rendering with improved layout
  return (
    <div className="flex h-full">
      {/* Left panel for controls - fixed width */}
      <div
        className={`w-96 flex-shrink-0 flex flex-col h-full ${colors.card} border-r ${colors.border} overflow-auto shadow-lg z-10`}
      >
        <div className="p-4 border-b border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h2 className={`text-lg font-semibold ${colors.text}`}>Select Drop-off Location</h2>
            <button onClick={onCancel} className={`p-2 rounded-full hover:bg-[#f0f0eb]`}>
              <X size={20} className={colors.text} />
            </button>
          </div>

          {renderBreakTimeNotice()}

          <div className="mb-4">
            <label className={`block text-sm font-medium ${colors.secondaryText} mb-1`}>Search for a location</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search for a place, address, or postal code"
                value={searchQuery}
                onChange={handleSearchInputChange}
                className={`pl-10 w-full rounded-lg h-10 border ${colors.border} bg-white text-[#2d2d2d] placeholder-gray-400 px-4 focus:ring-2 focus:ring-[#e67e5a] focus:border-[#e67e5a] transition-colors duration-200`}
              />
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <MapPin className={`h-5 w-5 text-[#e67e5a]`} />
              </div>
              {isSearching && (
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <div className="animate-spin h-4 w-4 border-2 border-[#e67e5a] border-t-transparent rounded-full"></div>
                </div>
              )}

              {/* Location suggestions dropdown */}
              {showSuggestions && locationSuggestions.length > 0 && (
                <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
                  {locationSuggestions.map((suggestion) => (
                    <div
                      key={suggestion.place_id}
                      onClick={() => handleLocationSuggestionSelect(suggestion)}
                      className="px-4 py-2 hover:bg-[#f0f0eb] cursor-pointer text-sm"
                    >
                      {suggestion.display_name}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <p className={`text-sm ${colors.secondaryText} mb-4`}>
            Search for a location, or click on the map to add potential drop-off locations. Our AI will analyze and
            recommend the best option.
          </p>
        </div>

        {dropOffLocations.length > 0 && (
          <div className="p-4 flex-1 overflow-auto">
            <div className="flex justify-between mb-2">
              <span className={`text-sm font-medium ${colors.text}`}>
                Potential Drop-offs ({dropOffLocations.length})
              </span>
              <button
                onClick={handleAnalyzeLocations}
                disabled={isAnalyzing || dropOffLocations.length === 0}
                className={`text-xs py-1 px-3 rounded-full ${
                  isAnalyzing || dropOffLocations.length === 0
                    ? "bg-gray-200 text-gray-400"
                    : `${colors.buttonPrimary} ${colors.buttonText}`
                } transition-colors duration-200`}
              >
                {isAnalyzing ? "Analyzing..." : "Analyze Drop-offs"}
              </button>
            </div>

            <div className="space-y-2 overflow-y-auto">
              {dropOffLocations.map((location) => (
                <div
                  key={location.id}
                  onClick={() => handleLocationSelect(location.id)}
                  className={`p-3 rounded-lg cursor-pointer transition-all duration-200 border relative ${
                    selectedLocationId === location.id
                      ? "bg-[#e1f0ed] border-[#e67e5a]"
                      : "bg-white border-[#e8e8e3] hover:bg-[#f0f0eb]"
                  } ${aiRecommendedId === location.id ? "border-2" : "border"}`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="w-2 h-2 rounded-full bg-[#e67e5a]" />
                        <span className={`font-medium ${colors.text}`}>{location.label}</span>
                        {aiRecommendedId === location.id && (
                          <span className={`text-xs py-0.5 px-2 rounded-full bg-green-100 text-green-800`}>
                            AI Recommended
                          </span>
                        )}
                      </div>
                      <p className={`text-xs ${colors.secondaryText} mt-1`}>
                        {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
                      </p>
                      {location.score !== undefined && (
                        <div className="mt-2 grid grid-cols-3 gap-2 text-xs">
                          <div className={`${colors.secondaryText}`}>
                            <span className="block font-medium">Distance</span>
                            <span>{location.distance?.toFixed(1)} km</span>
                          </div>
                          <div className={`${colors.secondaryText}`}>
                            <span className="block font-medium">Time</span>
                            <span>{formatDuration(location.duration || 0)}</span>
                          </div>
                          <div className={`text-[#4caf50]`}>
                            <span className="block font-medium">Revenue</span>
                            <span>${location.revenue?.toFixed(2)}</span>
                          </div>
                        </div>
                      )}
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleRemoveLocation(location.id)
                      }}
                      className={`p-1 rounded-full hover:bg-[#f0f0eb]`}
                    >
                      <X size={16} className={colors.secondaryText} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="p-4 border-t border-gray-200 mt-auto">
          <div className="space-y-3">
            {customRouteLocations.length > 1 && (
              <button
                onClick={handleFinishRoute}
                className="w-full py-2 rounded-full bg-[#e67e5a] text-white font-medium transition-colors duration-200"
              >
                Finish Route Planning
              </button>
            )}
            <div className="flex gap-3">
              <button
                onClick={onCancel}
                className={`flex-1 py-2 rounded-full border ${colors.border} ${colors.text} hover:bg-[#f0f0eb] transition-colors duration-200`}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmSelection}
                disabled={selectedLocationId === null}
                className={`flex-1 py-3 rounded-full ${
                  selectedLocationId === null
                    ? "bg-gray-200 text-gray-400"
                    : `${colors.buttonPrimary} ${colors.buttonText} hover:bg-[#e06a43]`
                } transition-colors duration-200 relative`}
              >
                <ThumbsUp size={20} className="absolute left-6 top-1/2 -translate-y-[40%]" />
                <div className="text-center w-full">
                  <div className="leading-tight pl-2">
                    <div>Confirm</div>
                    <div>Selection</div>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Right panel for map - takes remaining space */}
      <div className="flex-1 relative">
        <Map
          locations={[
            {
              lat: currentLocation.lat,
              lng: currentLocation.lng,
              type: "pickup",
              time: "Current Location",
              revenue: 0,
              tripId: 0,
            },
          ]}
          darkMode={darkMode}
          isSelectionMode={true}
          onLocationSelected={handleLocationSelected}
          customDropoffs={dropOffLocations}
          themeColors={colors}
        />

        {isLoadingLocation && (
          <div className="absolute top-4 right-4 z-10 bg-white px-4 py-2 rounded-lg shadow-md">
            <div className="flex items-center space-x-2">
              <div className="animate-spin h-4 w-4 border-2 border-[#e67e5a] border-t-transparent rounded-full"></div>
              <span className="text-sm text-gray-600">Getting location name...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

