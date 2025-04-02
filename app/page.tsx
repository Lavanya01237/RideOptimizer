"use client"

import { useState, useEffect, useCallback } from "react"
import { Map } from "@/components/Map"
import RouteForm from "@/components/RouteForm"
import { RouteSummary } from "@/components/RouteSummary"
import { DropOffSelection } from "@/components/DropOffSelection"
import { PickupRecommendation } from "@/components/PickupRecommendation"
import { WelcomePage } from "@/components/WelcomePage"
import { UserProfile } from "@/components/UserProfile"
import { Onboarding } from "@/components/Onboarding"
import { Notifications } from "@/components/Notifications"
import { AuthPage } from "@/components/AuthPage"
import { TutorialPointer } from "@/components/TutorialPointer"
import { Navigation, HistoryIcon, UserIcon, BellIcon, ArrowLeftCircle, PlusCircle, MapIcon, LogOut } from "lucide-react"
import { Header } from "@/components/Header"
import { HeatMapModal } from "@/components/HeatMapModal"
import { RevenueAnalytics } from "@/components/RevenueAnalytics"
import { FuelTracker } from "@/components/FuelTracker"
import { WeatherTraffic } from "@/components/WeatherTraffic"
import { PerformanceDashboard } from "@/components/PerformanceDashboard"
import SchedulePlanner from "@/components/SchedulePlanner"
// Import the SidebarMenu component at the top with other imports
import { SidebarMenu } from "@/components/SidebarMenu"

// Add these new types to handle the AI flow
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

interface PickupLocation {
  id: number
  lat: number
  lng: number
  label: string
  score?: number
  distance?: number
  duration?: number
  prediction?: number
}

interface Location {
  lat: number
  lng: number
  type: "pickup" | "dropoff"
  time: string
  revenue: number
  tripId: number
  locationName?: string
}

interface Route {
  locations: Location[]
  totalRevenue: number
  totalDrivingTime: number
  breakTime: string
}

interface User {
  email: string
  name: string
}

type AppMode = "welcome" | "auth" | "form" | "route" | "drop-off-selection" | "pickup-recommendation"

export default function App() {
  // Add state for video URL
  const [videoUrl, setVideoUrl] = useState<string | undefined>(undefined)
  const [route, setRoute] = useState<Route | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [darkMode, setDarkMode] = useState(false)
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<"reinforcement" | "greedy">("reinforcement")
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [appMode, setAppMode] = useState<AppMode>("welcome")
  const [currentLocation, setCurrentLocation] = useState({ lat: 1.3521, lng: 103.8198 })
  const [customRouteLocations, setCustomRouteLocations] = useState<Location[]>([])
  const [selectedDropOff, setSelectedDropOff] = useState<DropOffLocation | null>(null)
  const [nextTripId, setNextTripId] = useState(1)
  const [initialStartTime, setInitialStartTime] = useState<number>(6) // Default start time (6 AM)
  const [endTime, setEndTime] = useState<number>(25) // Default end time (1 AM next day)
  const [previousRoutes, setPreviousRoutes] = useState<Route[]>([])
  const [canContinuePlanning, setCanContinuePlanning] = useState(false)
  // With this:
  const [breakTimes, setBreakTimes] = useState<{ startHour: number; endHour: number }[]>([
    { startHour: 12, endHour: 13 }, // Default lunch break
  ])
  const [isBreakTime, setIsBreakTime] = useState<boolean>(false)
  const [activeFeature, setActiveFeature] = useState<string | null>(null)

  // Add state for sidebar visibility
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  // User experience states
  const [showUserProfile, setShowUserProfile] = useState(false)
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [isFirstTimeUser, setIsFirstTimeUser] = useState(true)
  const [notificationCount, setNotificationCount] = useState(3)

  // Authentication state
  const [user, setUser] = useState<User | null>(null)

  // Add a new state to control the heat map modal visibility
  const [showHeatMap, setShowHeatMap] = useState(false)

  // Add a new state for showing the tutorial highlight
  const [showTutorialHighlight, setShowTutorialHighlight] = useState(false)

  // Add a new state to track if we should show the tutorial pointer
  const [showTutorialPointer, setShowTutorialPointer] = useState(false)

  // Add a new state for the sign out confirmation dialog
  const [showSignOutConfirmation, setShowSignOutConfirmation] = useState(false)

  // Add a function to dismiss the tutorial pointer - using useCallback to ensure stability
  const dismissTutorialPointer = useCallback(() => {
    console.log("Dismissing tutorial pointer and highlight")
    setShowTutorialPointer(false)
    setShowTutorialHighlight(false)
  }, [])

  // Function to toggle sidebar
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  // Check if it's the first time user on component mount
  useEffect(() => {
    // Check if user is already logged in from localStorage
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("rideOptimizer_user")
      if (storedUser) {
        try {
          const userData = JSON.parse(storedUser)
          setUser(userData)
          // If user is already logged in and on welcome or auth page, redirect to form
          if (appMode === "welcome" || appMode === "auth") {
            if (isFirstTimeUser) {
              setShowOnboarding(true)
            } else {
              setAppMode("form")
            }
          }
        } catch (e) {
          console.error("Error parsing stored user data:", e)
          localStorage.removeItem("rideOptimizer_user")
        }
      }
    }
  }, [])

  // Add this to your existing useEffect in the App component to handle OAuth redirects
  useEffect(() => {
    // Check if we're returning from an OAuth redirect
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search)
      const authStatus = urlParams.get("auth")
      const provider = urlParams.get("provider")

      if (authStatus === "success" && provider) {
        // In a real app, you would validate the session/token here
        // For demo purposes, we'll simulate a successful login

        // Clean up the URL
        window.history.replaceState({}, document.title, window.location.pathname)

        // Set the user state based on the provider
        if (provider === "google") {
          const userData = {
            email: "user@gmail.com",
            name: "Google User",
          }
          setUser(userData)
          localStorage.setItem("rideOptimizer_user", JSON.stringify(userData))
          setAppMode("form")
        }
      } else if (authStatus === "error") {
        // Handle authentication error
        console.error("Authentication failed")
        // You might want to show an error message to the user
      }
    }
  }, [])

  // Update the darkMode state to be persisted in localStorage
  // Add this useEffect after the existing useEffects
  useEffect(() => {
    // Check if dark mode preference is stored in localStorage
    if (typeof window !== "undefined") {
      const storedDarkMode = localStorage.getItem("rideOptimizer_darkMode")
      if (storedDarkMode) {
        setDarkMode(storedDarkMode === "true")
      }
    }
  }, [])

  // Function to get current hour for time calculations
  const getCurrentHour = (timeStr: string): number => {
    const [time, period] = timeStr.split(" ")
    let [hour, minute] = time.split(":").map(Number)
    if (period === "PM" && hour !== 12) hour += 12
    if (period === "AM" && hour === 12) hour = 0
    return hour
  }

  // Helper function to convert time string to minutes
  const timeStringToMinutes = (timeString: string): number => {
    const [time, period] = timeString.split(" ")
    const [hour, minute] = time.split(":").map(Number)

    let totalMinutes = (hour % 12) * 60 + minute
    if (period === "PM" && hour !== 12) totalMinutes += 12 * 60
    if (period === "AM" && hour === 12) totalMinutes = minute // 12 AM is 0 hours

    return totalMinutes
  }

  // Helper function to convert minutes to time string
  const minutesToTimeString = (totalMinutes: number): string => {
    const hours = Math.floor(totalMinutes / 60) % 24
    const minutes = totalMinutes % 60
    const period = hours >= 12 ? "PM" : "AM"
    const formattedHour = hours % 12 || 12

    return `${formattedHour}:${minutes.toString().padStart(2, "0")} ${period}`
  }

  // Update the helper function to check if a time is during any break
  const isDuringBreak = (timeString: string): boolean => {
    if (!timeString) return false

    const minutes = timeStringToMinutes(timeString)
    const hour = Math.floor(minutes / 60)

    return breakTimes.some((breakTime) => hour >= breakTime.startHour && hour < breakTime.endHour)
  }

  // Update the helper function to get time after break
  const getTimeAfterBreak = (timeString: string): string => {
    if (!isDuringBreak(timeString)) return timeString

    const minutes = timeStringToMinutes(timeString)
    const hour = Math.floor(minutes / 60)

    // Find the break we're in
    const currentBreak = breakTimes.find((breakTime) => hour >= breakTime.startHour && hour < breakTime.endHour)

    if (currentBreak) {
      return minutesToTimeString(currentBreak.endHour * 60)
    }

    return timeString
  }

  const handleStartApp = () => {
    // Instead of going directly to the form, go to auth first
    setAppMode("auth")
  }

  // Update the handleLogin function to show the tutorial pointer for new users
  const handleLogin = (userData: User, isNewUser = false) => {
    console.log("Login successful, user data:", userData, "isNewUser:", isNewUser)
    setUser(userData)

    // Store user data
    if (typeof window !== "undefined") {
      localStorage.setItem("rideOptimizer_user", JSON.stringify(userData))
    }

    // For new users ONLY, show the tutorial highlight and pointer
    if (isNewUser) {
      setShowTutorialHighlight(true)
      setShowTutorialPointer(true)
      // Also set first time user flag for new users
      setIsFirstTimeUser(true)
      setShowOnboarding(true)
    } else {
      // For existing users, make sure tutorial is not shown
      setShowTutorialHighlight(false)
      setShowTutorialPointer(false)
      setIsFirstTimeUser(false)
    }

    // Always go to form after login
    setAppMode("form")
  }

  // Handle logout
  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("rideOptimizer_user")
    }
    setUser(null)
    setAppMode("welcome")
    setShowUserProfile(false) // Close the profile modal when logging out
  }

  // Update the interface for the route submission function
  const handleRouteSubmit = async (data: {
    lat: number
    lng: number
    startTime: number
    endTime: number
    algorithm: "reinforcement" | "greedy"
    breakTimes: { startHour: number; endHour: number }[]
  }) => {
    try {
      setLoading(true)
      setError(null)
      setSelectedAlgorithm(data.algorithm)
      setCurrentLocation({ lat: data.lat, lng: data.lng })
      setInitialStartTime(data.startTime)
      setEndTime(data.endTime)

      // Store all break times
      setBreakTimes(data.breakTimes)

      // If user chooses AI optimization (reinforcement learning)
      if (data.algorithm === "reinforcement") {
        // Start the AI-guided flow instead of fetching a complete route
        setCustomRouteLocations([
          {
            lat: data.lat,
            lng: data.lng,
            type: "pickup",
            time: formatTime(data.startTime, 0),
            revenue: 0,
            tripId: 0, // Initial location
          },
        ])

        setLoading(false)
        setAppMode("drop-off-selection")
        setCanContinuePlanning(true)
      } else {
        // Traditional approach - fetch full route from backend
        // Simulate API call with timeout
        setTimeout(async () => {
          try {
            const optimizedRoute = await generateMockRoute(data)
            setRoute(optimizedRoute)
            setAppMode("route")
            setLoading(false)
            setCanContinuePlanning(false)
          } catch (error) {
            console.error("Error generating route:", error)
            setError("Failed to generate route. Please try again.")
            setLoading(false)
          }
        }, 2000)
      }
    } catch (err) {
      setError("Failed to generate route. Please try again.")
      console.error("Error generating route:", err)
      setLoading(false)
    }
  }

  // Update the generateMockRoute function to handle multiple break times
  const generateMockRoute = async (data: {
    lat: number
    lng: number
    startTime: number
    endTime: number
    breakTimes: { startHour: number; endHour: number }[]
  }): Promise<Route> => {
    const locations: Location[] = []
    let currentTime = data.startTime
    let tripId = 1
    let totalRevenue = 0

    // Helper function for reverse geocoding
    const getLocationName = async (lat: number, lng: number): Promise<string> => {
      try {
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

        if (data.display_name) {
          const parts = data.display_name.split(",")
          return parts.slice(0, 2).join(", ")
        }

        return "Unknown Location"
      } catch (error) {
        console.error("Error in reverse geocoding:", error)
        return "Unknown Location"
      }
    }

    // Get name for starting location
    const startLocationName = await getLocationName(data.lat, data.lng)

    // Add starting location
    locations.push({
      lat: data.lat,
      lng: data.lng,
      type: "pickup",
      time: formatTime(currentTime, 0),
      revenue: 0,
      tripId: 0,
      locationName: startLocationName,
    })

    // Generate 5-8 trips
    const numTrips = Math.floor(Math.random() * 4) + 5

    for (let i = 0; i < numTrips; i++) {
      // Skip if we're past end time
      if (currentTime >= data.endTime) break

      // Check if current time is during any break
      const isDuringBreak = data.breakTimes.some(
        (breakTime) => currentTime >= breakTime.startHour && currentTime < breakTime.endHour,
      )

      if (isDuringBreak) {
        // Find the break we're in and skip to its end
        const currentBreak = data.breakTimes.find(
          (breakTime) => currentTime >= breakTime.startHour && currentTime < breakTime.endHour,
        )
        if (currentBreak) {
          currentTime = currentBreak.endHour
        }
      }

      // Generate pickup location (small random offset from current location)
      const pickupLat = data.lat + (Math.random() * 0.02 - 0.01)
      const pickupLng = data.lng + (Math.random() * 0.02 - 0.01)

      // Get name for pickup location
      const pickupLocationName = await getLocationName(pickupLat, pickupLng)

      // Add pickup location
      locations.push({
        lat: pickupLat,
        lng: pickupLng,
        type: "pickup",
        time: formatTime(currentTime, Math.floor(Math.random() * 30)),
        revenue: 0,
        tripId,
        locationName: pickupLocationName,
      })

      // Advance time by 5-15 minutes (converted to hours)
      currentTime += (5 + Math.floor(Math.random() * 10)) / 60

      // Check again if we're in a break after advancing time
      const isNewTimeDuringBreak = data.breakTimes.some(
        (breakTime) => currentTime >= breakTime.startHour && currentTime < breakTime.endHour,
      )

      if (isNewTimeDuringBreak) {
        // Find the break we're in and skip to its end
        const currentBreak = data.breakTimes.find(
          (breakTime) => currentTime >= breakTime.startHour && currentTime < breakTime.endHour,
        )
        if (currentBreak) {
          currentTime = currentBreak.endHour
        }
      }

      // Generate dropoff location (larger random offset)
      const dropoffLat = pickupLat + (Math.random() * 0.04 - 0.02)
      const dropoffLng = pickupLng + (Math.random() * 0.04 - 0.02)

      // Get name for dropoff location
      const dropoffLocationName = await getLocationName(dropoffLat, dropoffLng)

      // Generate revenue ($5-$25)
      const revenue = 5 + Math.random() * 20
      totalRevenue += revenue

      // Add dropoff location
      locations.push({
        lat: dropoffLat,
        lng: dropoffLng,
        type: "dropoff",
        time: formatTime(currentTime, Math.floor(Math.random() * 30)),
        revenue,
        tripId,
        locationName: dropoffLocationName,
      })

      // Advance time by 10-20 minutes (converted to hours)
      currentTime += (10 + Math.floor(Math.random() * 10)) / 60

      // Increment trip ID
      tripId++
    }

    // Calculate total driving time
    const totalDrivingTime = Math.round((currentTime - data.startTime) * 10) / 10

    // Format all break times for display
    const formattedBreakTimes = data.breakTimes
      .map((breakTime) => `${formatTime(breakTime.startHour, 0)} - ${formatTime(breakTime.endHour, 0)}`)
      .join(", ")

    return {
      locations,
      totalRevenue,
      totalDrivingTime,
      breakTime: formattedBreakTimes,
    }
  }

  // Update the handleDropOffSelected function to check for multiple breaks
  const handleDropOffSelected = (location: DropOffLocation) => {
    setSelectedDropOff(location)

    // Add the drop-off to our custom route
    const lastLocation = customRouteLocations[customRouteLocations.length - 1]
    const currentTripId = nextTripId

    // Calculate estimated time for the drop-off
    let estimatedMinutes = timeStringToMinutes(lastLocation.time) + Math.ceil((location.duration || 300) / 60)

    // Check if drop-off time falls within break time
    const estimatedHour = Math.floor(estimatedMinutes / 60)

    if (breakTimes.some((breakTime) => estimatedHour >= breakTime.startHour && estimatedHour < breakTime.endHour)) {
      // Adjust time to after break
      const currentBreak = breakTimes.find(
        (breakTime) => estimatedHour >= breakTime.startHour && estimatedHour < breakTime.endHour,
      )
      if (currentBreak) {
        estimatedMinutes = currentBreak.endHour * 60
      }
    }

    // Create the time string
    const dropOffTime = minutesToTimeString(estimatedMinutes)

    // Add selected drop-off
    const newDropOff: Location = {
      lat: location.lat,
      lng: location.lng,
      type: "dropoff",
      time: dropOffTime,
      revenue: location.revenue || 0,
      tripId: currentTripId,
    }

    setCustomRouteLocations([...customRouteLocations, newDropOff])
    setNextTripId(currentTripId + 1)

    // Move to pickup recommendation mode
    setCurrentLocation({ lat: location.lat, lng: location.lng })
    setAppMode("pickup-recommendation")
  }

  // Update the handlePickupSelected function to check for multiple breaks
  const handlePickupSelected = (location: PickupLocation) => {
    // Add the new pickup location to our custom route
    const lastLocation = customRouteLocations[customRouteLocations.length - 1]

    // Calculate time to pickup location
    let estimatedMinutes = timeStringToMinutes(lastLocation.time) + Math.ceil((location.duration || 300) / 60)

    // Check if time falls within break time
    const estimatedHour = Math.floor(estimatedMinutes / 60)

    if (breakTimes.some((breakTime) => estimatedHour >= breakTime.startHour && estimatedHour < breakTime.endHour)) {
      // Skip to end of break
      const currentBreak = breakTimes.find(
        (breakTime) => estimatedHour >= breakTime.startHour && estimatedHour < breakTime.endHour,
      )
      if (currentBreak) {
        estimatedMinutes = currentBreak.endHour * 60
      }
    }

    // Create the time string
    const pickupTime = minutesToTimeString(estimatedMinutes)

    const newPickup: Location = {
      lat: location.lat,
      lng: location.lng,
      type: "pickup",
      time: pickupTime,
      revenue: 0,
      tripId: nextTripId,
    }

    setCustomRouteLocations([...customRouteLocations, newPickup])
    setCurrentLocation({ lat: location.lat, lng: location.lng })

    // Check if we've reached the end time
    const currentHour = getCurrentHour(pickupTime)
    if (currentHour >= endTime) {
      handleFinishRoute()
    } else {
      // Go back to drop-off selection for the next leg
      setAppMode("drop-off-selection")
    }
  }

  const handleFinishRoute = () => {
    // Calculate total revenue and driving time
    const totalRevenue = customRouteLocations
      .filter((loc) => loc.type === "dropoff")
      .reduce((sum, loc) => sum + loc.revenue, 0)

    // Calculate driving time from first to last location
    const firstTime = timeStringToMinutes(customRouteLocations[0].time)
    const lastTime = timeStringToMinutes(customRouteLocations[customRouteLocations.length - 1].time)
    const totalDrivingTime = Math.round(((lastTime - firstTime) / 60) * 10) / 10 // Convert minutes to hours with 1 decimal

    // Create a complete route object
    const completeRoute: Route = {
      locations: [...customRouteLocations],
      totalRevenue,
      totalDrivingTime,
      breakTime: getFormattedBreakTime(),
    }

    // Save the current route to previous routes
    setPreviousRoutes((prev) => [...prev, completeRoute])

    setRoute(completeRoute)
    setAppMode("route")

    // Add a new notification when route is completed
    setNotificationCount((prev) => prev + 1)
  }

  // Add this function to toggle the heat map modal
  const toggleHeatMap = () => {
    setShowHeatMap(!showHeatMap)
  }

  const handleContinuePlanning = () => {
    // Resume planning from the last location
    if (route && route.locations.length > 0) {
      const lastLocation = route.locations[route.locations.length - 1]
      setCurrentLocation({ lat: lastLocation.lat, lng: lastLocation.lng })

      // Check if we need to reset the custom route locations
      if (customRouteLocations.length === 0) {
        setCustomRouteLocations(route.locations)
      }

      // Determine next mode based on the last location type
      if (lastLocation.type === "pickup") {
        setAppMode("drop-off-selection")
      } else {
        setAppMode("pickup-recommendation")
      }
    }
  }

  // Update the handleNewRoute function to reset break times
  const handleNewRoute = () => {
    // Start a completely new route
    setRoute(null)
    setCustomRouteLocations([])
    setSelectedDropOff(null)
    setNextTripId(1)
    setAppMode("form")
    setCanContinuePlanning(false)

    // Clear previous routes
    setPreviousRoutes([])

    // Also reset to default location if needed
    setCurrentLocation({ lat: 1.3521, lng: 103.8198 })

    // Reset time settings to defaults
    setInitialStartTime(6) // Default start time (6 AM)
    setEndTime(25) // Default end time (1 AM next day)
    setBreakTimes([{ startHour: 12, endHour: 13 }])
  }

  // Update the toggleDarkMode function to save preference to localStorage
  const toggleDarkMode = () => {
    const newDarkMode = !darkMode
    setDarkMode(newDarkMode)
    if (typeof window !== "undefined") {
      localStorage.setItem("rideOptimizer_darkMode", newDarkMode.toString())
    }
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  // Update the resetApp function to reset break times
  const resetApp = () => {
    setRoute(null)
    setCustomRouteLocations([])
    setSelectedDropOff(null)
    setNextTripId(1)
    setAppMode("form")
    setCanContinuePlanning(false)

    // Clear previous routes
    setPreviousRoutes([])

    // Reset to default location
    setCurrentLocation({ lat: 1.3521, lng: 103.8198 })

    // Reset time settings to defaults
    setInitialStartTime(6)
    setEndTime(25)
    setBreakTimes([{ startHour: 12, endHour: 13 }])
  }

  // Helper function to format time
  const formatTime = (hour: number, minutes: number): string => {
    const period = hour >= 12 ? "PM" : "AM"
    const formattedHour = hour % 12 || 12
    return `${formattedHour}:${minutes.toString().padStart(2, "0")} ${period}`
  }

  // Add a function to handle tutorial button click
  const handleTutorialClick = () => {
    setShowOnboarding(true)
    setShowTutorialHighlight(false)
    setShowTutorialPointer(false)
  }

  // Update the helper function to add minutes to a time string
  const addMinutesToTime = (timeString: string, minutesToAdd: number): string => {
    const [time, period] = timeString.split(" ")
    const [hour, minute] = time.split(":").map(Number)

    let totalMinutes = (hour % 12) * 60 + minute
    if (period === "PM" && hour !== 12) totalMinutes += 12 * 60

    totalMinutes += minutesToAdd

    // Check if the resulting time is during break hours
    const resultHour = Math.floor(totalMinutes / 60)
    if (breakTimes.some((breakTime) => resultHour >= breakTime.startHour && resultHour < breakTime.endHour)) {
      // Skip to end of break
      const currentBreak = breakTimes.find(
        (breakTime) => resultHour >= breakTime.startHour && resultHour < breakTime.endHour,
      )
      if (currentBreak) {
        totalMinutes = currentBreak.endHour * 60
      }
    }

    const newHour = Math.floor(totalMinutes / 60) % 24
    const newMinute = totalMinutes % 60
    const newPeriod = newHour >= 12 ? "PM" : "AM"
    const formattedHour = newHour % 12 || 12

    return `${formattedHour}:${newMinute.toString().padStart(2, "0")} ${newPeriod}`
  }

  // Update the helper function to get formatted break time string
  const getFormattedBreakTime = (): string => {
    const formatHour = (hour: number) => {
      if (hour === 0 || hour === 24) return "12:00 AM"
      if (hour === 12) return "12:00 PM"
      if (hour > 12) return `${hour - 12}:00 PM`
      return `${hour}:00 AM`
    }

    return breakTimes
      .map((breakTime) => `${formatHour(breakTime.startHour)} - ${formatHour(breakTime.endHour)}`)
      .join(", ")
  }

  // Update the effect to check if current time is during break
  useEffect(() => {
    if (customRouteLocations.length > 0) {
      const lastLocation = customRouteLocations[customRouteLocations.length - 1]
      const currentHour = getCurrentHour(lastLocation.time)

      // Set flag for whether we're in break time
      setIsBreakTime(
        breakTimes.some((breakTime) => currentHour >= breakTime.startHour && currentHour < breakTime.endHour),
      )
    }
  }, [customRouteLocations, breakTimes])

  // Update the themeColors definition to use dark mode colors when enabled
  const themeColors = darkMode
    ? {
        bg: "bg-[#1a1a1a]", // Dark background
        card: "bg-[#2d2d2d]", // Dark card background
        text: "text-[#f8f7f4]", // Light text for dark mode
        highlight: "text-[#ff8f6c]", // Brighter coral for dark mode
        secondaryBg: "bg-[#333333]", // Dark secondary background
        border: "border-[#444444]", // Dark borders
        buttonPrimary: "bg-[#ff8f6c]", // Brighter coral for buttons
        buttonSecondary: "bg-[#2a3f3a]", // Darker mint for secondary buttons
        buttonText: "text-white",
        secondaryText: "text-[#b0b0b0]", // Lighter gray for secondary text
        greenText: "text-[#6dce71]", // Brighter green for dark mode
      }
    : {
        bg: "bg-[#f8f7f4]", // Light beige background
        card: "bg-white",
        text: "text-[#2d2d2d]",
        highlight: "text-[#e67e5a]", // Coral/salmon color
        secondaryBg: "bg-[#f0f0eb]", // Light gray-beige for secondary elements
        border: "border-[#e8e8e3]",
        buttonPrimary: "bg-[#e67e5a]", // Coral/salmon for primary buttons
        buttonSecondary: "bg-[#e1f0ed]", // Light mint for secondary buttons
        buttonText: "text-white",
        secondaryText: "text-[#6b6b6b]",
        greenText: "text-[#4caf50]", // Green text for revenue
      }

  // Check if user can continue route planning based on time
  useEffect(() => {
    if (route && route.locations.length > 0) {
      const lastLocation = route.locations[route.locations.length - 1]
      const currentHour = getCurrentHour(lastLocation.time)
      setCanContinuePlanning(currentHour < endTime)
    }
  }, [route, endTime])

  // Handle onboarding completion
  const handleOnboardingComplete = () => {
    setShowOnboarding(false)
    setIsFirstTimeUser(false)
    setAppMode("form")
  }

  // Function to set video URL when provided by user
  const handleSetVideoUrl = (url: string) => {
    setVideoUrl(url)
  }

  // Add this with the other functions
  const handleFeatureSelect = (feature: string | null) => {
    setActiveFeature(feature)

    // If we're not in form mode, switch to it
    if (appMode !== "form" && appMode !== "route") {
      setAppMode("form")
    }
  }

  // Render welcome page if not authenticated
  if (appMode === "welcome") {
    return <WelcomePage onStart={handleStartApp} themeColors={themeColors} videoUrl={videoUrl} />
  }

  // Render auth page
  if (appMode === "auth") {
    return (
      <div className={`min-h-screen ${themeColors.bg}`}>
        <Header notificationCount={0} themeColors={themeColors} />
        <AuthPage onLogin={handleLogin} onCancel={() => setAppMode("welcome")} themeColors={themeColors} />
      </div>
    )
  }

  // If user is not authenticated, redirect to welcome page
  if (!user && appMode !== "welcome" && appMode !== "auth") {
    setAppMode("welcome")
    return <WelcomePage onStart={handleStartApp} themeColors={themeColors} videoUrl={videoUrl} />
  }

  // Update the return statement to add dark class to the root div when dark mode is enabled
  // Replace the opening div of the return statement with:
  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? "dark " : ""}${themeColors.bg}`}>
      {appMode !== "welcome" && appMode !== "auth" && (
        <SidebarMenu
          activeFeature={activeFeature}
          onFeatureSelect={handleFeatureSelect}
          themeColors={themeColors}
          darkMode={darkMode}
          isOpen={isSidebarOpen}
          onToggle={toggleSidebar}
        />
      )}
      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={toggleMenu}></div>
          <div className="absolute left-0 top-0 h-full w-64 bg-white border-r border-gray-200 transition-transform duration-300 transform shadow-lg">
            <div className="p-5">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-full bg-[#e1f0ed]">
                    <Navigation className="h-6 w-6 text-[#e67e5a]" />
                  </div>
                  <h1 className="text-xl font-medium text-[#2d2d2d]">RideOptimizer</h1>
                </div>
              </div>

              <nav className="space-y-2">
                {user && (
                  <div className="p-3 mb-4 bg-[#f0f0eb] rounded-lg">
                    <div className="font-medium text-[#2d2d2d]">{user.name}</div>
                    <div className="text-sm text-[#6b6b6b]">{user.email}</div>
                  </div>
                )}
                <button
                  onClick={() => setShowUserProfile(true)}
                  className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-[#f0f0eb]"
                >
                  <UserIcon className="h-5 w-5 text-[#6b6b6b]" />
                  <span className="text-[#2d2d2d]">Profile</span>
                </button>
                <a href="#" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-[#f0f0eb]">
                  <HistoryIcon className="h-5 w-5 text-[#6b6b6b]" />
                  <span className="text-[#2d2d2d]">History</span>
                </a>
                <button
                  onClick={() => setShowNotifications(true)}
                  className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-[#f0f0eb]"
                >
                  <BellIcon className="h-5 w-5 text-[#6b6b6b]" />
                  <span className="text-[#2d2d2d]">Notifications</span>
                  {notificationCount > 0 && (
                    <span className="ml-auto bg-[#e67e5a] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {notificationCount}
                    </span>
                  )}
                </button>
                <button
                  onClick={toggleHeatMap}
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-[#f0f0eb] w-full text-left"
                >
                  <MapIcon className="h-5 w-5 text-[#6b6b6b]" />
                  <span className="text-[#2d2d2d]">Demand Heat Map</span>
                </button>
                <button
                  onClick={() => setShowSignOutConfirmation(true)}
                  className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-[#f0f0eb] text-red-500"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Sign Out</span>
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}

      <Header
        notificationCount={notificationCount}
        onNotificationsClick={() => setShowNotifications(true)}
        onUserProfileClick={() => setShowUserProfile(true)}
        onNewRouteClick={resetApp}
        themeColors={themeColors}
        userName={user?.name}
        onToggleHeatMap={toggleHeatMap}
        onTutorialClick={handleTutorialClick}
        showTutorialHighlight={showTutorialHighlight}
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
        onLogout={handleLogout}
        onFeatureSelect={handleFeatureSelect}
        toggleSidebar={toggleSidebar}
        activeFeature={activeFeature}
      />

      {/* Update the main content padding to accommodate the new header layout */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 lg:ml-16">
        {/* Find the section where the form is rendered in appMode === "form"
        // Replace the entire form section with this conditional rendering */}

        {appMode === "form" && (
          <div className="flex flex-col items-center justify-center">
            {activeFeature === null ? (
              // Show the route planning form when no feature is selected
              <div className="w-full max-w-2xl">
                <RouteForm
                  onSubmit={handleRouteSubmit}
                  isLoading={loading}
                  darkMode={darkMode}
                  themeColors={themeColors}
                />

                {error && (
                  <div className="mt-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg transition-all duration-300 animate-fadeIn">
                    {error}
                  </div>
                )}
              </div>
            ) : (
              // Show the selected feature
              <div className="w-full">
                {activeFeature === "analytics" && <RevenueAnalytics themeColors={themeColors} darkMode={darkMode} />}

                {activeFeature === "fuel" && <FuelTracker themeColors={themeColors} darkMode={darkMode} />}

                {activeFeature === "weather" && (
                  <WeatherTraffic themeColors={themeColors} darkMode={darkMode} location={currentLocation} />
                )}

                {activeFeature === "performance" && (
                  <PerformanceDashboard themeColors={themeColors} darkMode={darkMode} />
                )}

                {activeFeature === "schedule" && <SchedulePlanner themeColors={themeColors} darkMode={darkMode} />}
              </div>
            )}
          </div>
        )}

        {appMode === "route" && route && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 space-y-6">
              <RouteSummary
                route={{ ...route, breakTime: getFormattedBreakTime() }}
                darkMode={darkMode}
                algorithm={selectedAlgorithm}
                themeColors={themeColors}
              />

              {/* Route Management Controls */}
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <h3 className="font-medium mb-4 text-[#2d2d2d]">Route Management</h3>
                <div className="flex gap-3">
                  <button
                    onClick={handleNewRoute}
                    className="flex-1 py-2 px-3 rounded-lg flex items-center justify-center bg-[#e1f0ed] text-[#2d2d2d] transition-colors duration-200"
                  >
                    <PlusCircle className="h-4 w-4 mr-2" />
                    New Route
                  </button>

                  {getCurrentHour(route.locations[route.locations.length - 1].time) < endTime && (
                    <button
                      onClick={handleContinuePlanning}
                      className="flex-1 py-2 px-3 rounded-lg flex items-center justify-center bg-[#e67e5a] text-white transition-colors duration-200"
                    >
                      <ArrowLeftCircle className="h-4 w-4 mr-2" />
                      Continue Planning
                    </button>
                  )}
                </div>

                {previousRoutes.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium mb-2 text-[#2d2d2d]">Previous Routes</h4>
                    <div className="max-h-40 overflow-y-auto pr-2 space-y-2">
                      {previousRoutes.map((prevRoute, index) => (
                        <div
                          key={index}
                          className="p-2 rounded-lg cursor-pointer transition-all duration-200 bg-[#f0f0eb] hover:bg-[#e8e8e3]"
                          onClick={() => setRoute(prevRoute)}
                        >
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-[#2d2d2d]">Route {index + 1}</span>
                            <span className="text-sm text-[#4caf50]">${prevRoute.totalRevenue.toFixed(2)}</span>
                          </div>
                          <div className="text-xs text-[#6b6b6b]">
                            {prevRoute.locations.length} locations • {prevRoute.totalDrivingTime}h
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="lg:col-span-2">
              <div className="bg-white p-4 rounded-lg shadow-sm h-[700px]">
                <Map locations={route.locations} darkMode={darkMode} themeColors={themeColors} />
              </div>
            </div>
          </div>
        )}

        {appMode === "drop-off-selection" && (
          <div className="h-[700px] bg-white rounded-lg shadow-sm overflow-hidden">
            <DropOffSelection
              darkMode={darkMode}
              currentLocation={currentLocation}
              onDropOffSelected={handleDropOffSelected}
              onCancel={resetApp}
              themeColors={themeColors}
              currentTime={
                customRouteLocations.length > 0 ? customRouteLocations[customRouteLocations.length - 1].time : undefined
              }
              breakTimes={breakTimes}
              customRouteLocations={customRouteLocations}
              handleFinishRoute={handleFinishRoute}
            />
          </div>
        )}

        {appMode === "pickup-recommendation" && (
          <div className="h-[700px] bg-white rounded-lg shadow-sm overflow-hidden">
            <PickupRecommendation
              darkMode={darkMode}
              currentLocation={currentLocation}
              onPickupSelected={handlePickupSelected}
              onCancel={resetApp}
              themeColors={themeColors}
              currentTime={
                customRouteLocations.length > 0 ? customRouteLocations[customRouteLocations.length - 1].time : undefined
              }
              breakTimes={breakTimes}
            />
          </div>
        )}
      </main>

      <footer className="py-4 mt-8 bg-[#f9f9f8] text-[#6b6b6b] border-t border-[#e8e8e3]">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm">
          ©{new Date().getFullYear()}
          RideOptimizer | Optimizing routes for maximum efficiency
        </div>
      </footer>

      {/* User Experience Components */}
      {showUserProfile && (
        <UserProfile
          onClose={() => setShowUserProfile(false)}
          themeColors={themeColors}
          user={user || undefined}
          darkMode={darkMode}
          toggleDarkMode={toggleDarkMode}
          onLogout={handleLogout} // Make sure this line is present
        />
      )}

      {showOnboarding && <Onboarding onComplete={handleOnboardingComplete} themeColors={themeColors} />}

      {showNotifications && (
        <Notifications
          onClose={() => {
            setShowNotifications(false)
            setNotificationCount(0)
          }}
          themeColors={themeColors}
        />
      )}
      {showHeatMap && <HeatMapModal onClose={toggleHeatMap} themeColors={themeColors} />}

      {/* Tutorial Pointer */}
      {showTutorialPointer && <TutorialPointer onDismiss={dismissTutorialPointer} />}
      {showSignOutConfirmation && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black bg-opacity-50 animate-fadeIn">
          <div
            className={`${themeColors.card} w-full max-w-sm rounded-xl shadow-xl p-8 transform transition-all duration-300 scale-100`}
          >
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-50 text-red-500 mb-4">
                <LogOut className="h-8 w-8" />
              </div>
              <h3 className={`text-xl font-semibold mb-2 ${themeColors.text}`}>Sign Out</h3>
              <p className={`${themeColors.secondaryText}`}>Are you sure you want to sign out of your account?</p>
            </div>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowSignOutConfirmation(false)}
                className="py-2 px-4 rounded-lg transition-colors duration-200 bg-gray-200 hover:bg-gray-300 text-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="py-2 px-4 rounded-lg transition-colors duration-200 bg-red-500 hover:bg-red-600 text-white"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

