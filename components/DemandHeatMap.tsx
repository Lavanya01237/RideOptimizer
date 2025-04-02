"use client"

import { useEffect, useState, useRef } from "react"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Clock, Info, Play, Pause } from "lucide-react"
import dynamic from "next/dynamic"

// Define types
interface HeatMapPoint {
  lat: number
  lng: number
  intensity: number
  hour: number
}

interface DemandHeatMapProps {
  darkMode?: boolean
  themeColors?: {
    bg: string
    card: string
    text: string
    highlight: string
    secondaryBg: string
    border: string
  }
  centerLocation?: { lat: number; lng: number }
}

// Dynamically import the HeatMapComponent to avoid SSR issues
const HeatMapComponent = dynamic(() => import("./HeatMapComponent"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full w-full bg-gray-100 rounded-lg">
      <div className="text-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-500 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading map...</p>
      </div>
    </div>
  ),
})

// Generate mock heat map data with higher intensity values
const generateMockHeatMapData = (centerLat: number, centerLng: number): HeatMapPoint[] => {
  const points: HeatMapPoint[] = []

  // Generate data for each hour of the day
  for (let hour = 0; hour < 24; hour++) {
    // Number of points varies by time of day
    const numPoints =
      hour >= 7 && hour <= 9
        ? 50 // Morning rush
        : hour >= 17 && hour <= 19
          ? 60 // Evening rush
          : hour >= 22 || hour <= 2
            ? 40 // Night life
            : hour >= 12 && hour <= 14
              ? 35 // Lunch time
              : 20 // Normal hours

    // Create hotspots in different areas based on time
    for (let i = 0; i < numPoints; i++) {
      // Create different clusters based on time of day
      let latOffset, lngOffset, intensity

      if (hour >= 7 && hour <= 9) {
        // Morning rush - business districts
        latOffset = Math.random() * 0.04 - 0.02 + (Math.random() > 0.6 ? 0.02 : -0.01)
        lngOffset = Math.random() * 0.04 - 0.02 + (Math.random() > 0.6 ? 0.02 : -0.01)
        intensity = 0.8 + Math.random() * 0.2 // Higher intensity: 0.8-1.0
      } else if (hour >= 17 && hour <= 19) {
        // Evening rush - residential areas
        latOffset = Math.random() * 0.04 - 0.02 - (Math.random() > 0.6 ? 0.02 : 0.01)
        lngOffset = Math.random() * 0.04 - 0.02 - (Math.random() > 0.6 ? 0.02 : 0.01)
        intensity = 0.8 + Math.random() * 0.2 // Higher intensity: 0.8-1.0
      } else if (hour >= 22 || hour <= 2) {
        // Night life - entertainment districts
        latOffset = Math.random() * 0.03 - 0.015 + (Math.random() > 0.5 ? 0.015 : -0.015)
        lngOffset = Math.random() * 0.03 - 0.015 + (Math.random() > 0.5 ? 0.015 : -0.015)
        intensity = 0.7 + Math.random() * 0.3 // Medium-high intensity: 0.7-1.0
      } else if (hour >= 12 && hour <= 14) {
        // Lunch time - scattered around city
        latOffset = Math.random() * 0.06 - 0.03
        lngOffset = Math.random() * 0.06 - 0.03
        intensity = 0.6 + Math.random() * 0.3 // Medium intensity: 0.6-0.9
      } else {
        // Normal hours - more random
        latOffset = Math.random() * 0.08 - 0.04
        lngOffset = Math.random() * 0.08 - 0.04
        intensity = 0.3 + Math.random() * 0.3 // Lower intensity: 0.3-0.6
      }

      points.push({
        lat: centerLat + latOffset,
        lng: centerLng + lngOffset,
        intensity,
        hour,
      })
    }
  }

  return points
}

export function DemandHeatMap({
  darkMode = false,
  themeColors,
  centerLocation = { lat: 1.3521, lng: 103.8198 }, // Default to Singapore
}: DemandHeatMapProps) {
  const [currentHour, setCurrentHour] = useState<number>(new Date().getHours())
  const [isPlaying, setIsPlaying] = useState<boolean>(false)
  const [showInfo, setShowInfo] = useState<boolean>(true)
  const [heatMapData, setHeatMapData] = useState<HeatMapPoint[]>([])
  const playIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Generate data on component mount
  useEffect(() => {
    setHeatMapData(generateMockHeatMapData(centerLocation.lat, centerLocation.lng))
  }, [centerLocation.lat, centerLocation.lng])

  // Handle auto-play functionality
  useEffect(() => {
    if (isPlaying) {
      playIntervalRef.current = setInterval(() => {
        setCurrentHour((prev) => (prev + 1) % 24)
      }, 1500)
    } else if (playIntervalRef.current) {
      clearInterval(playIntervalRef.current)
    }

    return () => {
      if (playIntervalRef.current) {
        clearInterval(playIntervalRef.current)
      }
    }
  }, [isPlaying])

  // Format hour for display
  const formatHour = (hour: number): string => {
    if (hour === 0 || hour === 24) return "12:00 AM"
    if (hour === 12) return "12:00 PM"
    if (hour > 12) return `${hour - 12}:00 PM`
    return `${hour}:00 AM`
  }

  // Get demand level description
  const getDemandLevel = (hour: number): { level: string; color: string } => {
    if (hour >= 7 && hour <= 9) return { level: "Very High", color: "text-red-500" }
    if (hour >= 17 && hour <= 19) return { level: "Very High", color: "text-red-500" }
    if (hour >= 22 || hour <= 2) return { level: "High", color: "text-orange-500" }
    if (hour >= 12 && hour <= 14) return { level: "Medium", color: "text-yellow-500" }
    return { level: "Low", color: "text-green-500" }
  }

  const demandInfo = getDemandLevel(currentHour)

  const colors = themeColors || {
    bg: darkMode ? "bg-gray-900" : "bg-purple-50",
    card: darkMode ? "bg-gray-800" : "bg-white",
    text: darkMode ? "text-gray-200" : "text-gray-800",
    highlight: darkMode ? "text-purple-400" : "text-purple-600",
    secondaryBg: darkMode ? "bg-gray-700" : "bg-purple-50",
    border: darkMode ? "border-gray-700" : "border-purple-100",
  }

  // Filter points for current hour
  const filteredPoints = heatMapData
    .filter((point) => point.hour === currentHour)
    .map((point) => [point.lat, point.lng, point.intensity] as [number, number, number])

  return (
    <div className="flex flex-col h-full overflow-y-auto" style={{ height: "100%" }}>
      {/* Fixed Controls - These stay at the top */}
      <div
        className={`${colors.card} p-4 border-b ${colors.border} flex flex-col md:flex-row items-center justify-between gap-4 sticky top-0 z-20`}
      >
        <div className="flex items-center gap-2">
          <Clock className={`h-5 w-5 ${colors.highlight}`} />
          <span className="font-medium">Time: {formatHour(currentHour)}</span>
          <span className={`ml-2 font-medium ${demandInfo.color}`}>{demandInfo.level} Demand</span>
        </div>

        <div className="flex-1 max-w-md px-2">
          <Slider
            value={[currentHour]}
            min={0}
            max={23}
            step={1}
            onValueChange={(value) => {
              setCurrentHour(value[0])
              if (isPlaying) setIsPlaying(false)
            }}
          />
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant={isPlaying ? "destructive" : "default"}
            size="sm"
            onClick={() => setIsPlaying(!isPlaying)}
            className={isPlaying ? "bg-red-500 hover:bg-red-600" : `${colors.buttonPrimary}`}
          >
            {isPlaying ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
            {isPlaying ? "Stop" : "Play"} Time Lapse
          </Button>

          <Button variant="outline" size="sm" onClick={() => setShowInfo(!showInfo)}>
            <Info className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Info Panel - Also fixed */}
      {showInfo && (
        <div className={`${colors.secondaryBg} p-3 border-b ${colors.border} sticky top-[72px] z-10`}>
          <div className="flex items-center gap-2 mb-2">
            <Info className={`h-4 w-4 ${colors.highlight}`} />
            <h3 className="font-medium">Demand Patterns</h3>
          </div>
          <div className="text-sm grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
            <div className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-full bg-red-500"></span>
              <span>7-9 AM: Business districts (rush hour)</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-full bg-red-500"></span>
              <span>5-7 PM: Residential areas (rush hour)</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-full bg-orange-500"></span>
              <span>10 PM-2 AM: Entertainment districts</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
              <span>12-2 PM: Lunch time (scattered)</span>
            </div>
          </div>
        </div>
      )}

      {/* Scrollable Content Area */}
      <div className="overflow-y-auto flex-1" style={{ height: "calc(100% - 140px)" }}>
        {/* Map Container */}
        <div style={{ height: "500px", position: "relative" }}>
          <HeatMapComponent darkMode={darkMode} centerLocation={centerLocation} points={filteredPoints} />

          {/* Legend */}
          <div className="absolute bottom-4 right-4 bg-white bg-opacity-90 dark:bg-gray-800 dark:bg-opacity-90 p-2 rounded-lg shadow-md z-[1000]">
            <div className="text-xs font-medium mb-1">Demand Intensity</div>
            <div className="flex items-center gap-1">
              <div className="w-full h-2 bg-gradient-to-r from-blue-500 via-lime-500 via-yellow-500 to-red-500 rounded"></div>
            </div>
            <div className="flex justify-between text-xs mt-1">
              <span>Low</span>
              <span>High</span>
            </div>
          </div>
        </div>

        {/* Additional Content to make scrolling necessary */}
        <div className="p-4">
          <h2 className={`text-xl font-bold ${colors.highlight} mb-4`}>Demand Analysis</h2>

          {/* Time-based Analysis */}
          <div className={`${colors.card} p-4 border ${colors.border} rounded-lg mb-6`}>
            <h3 className="text-lg font-semibold mb-3">Time-based Demand Patterns</h3>
            <div className="space-y-4">
              {[
                {
                  time: "Morning Rush (7-9 AM)",
                  desc: "High demand in business districts and transportation hubs as commuters head to work.",
                },
                { time: "Mid-Morning (9-11 AM)", desc: "Moderate demand around shopping centers and office areas." },
                {
                  time: "Lunch Hours (12-2 PM)",
                  desc: "Increased activity around restaurants, malls, and business districts.",
                },
                {
                  time: "Afternoon (2-5 PM)",
                  desc: "Steady demand for airport runs, shopping centers, and school pickups.",
                },
                { time: "Evening Rush (5-7 PM)", desc: "Peak demand as commuters return home from work." },
                {
                  time: "Evening (7-10 PM)",
                  desc: "Moderate demand for restaurant, entertainment venues, and shopping areas.",
                },
                { time: "Night (10 PM-2 AM)", desc: "High demand around nightlife districts, bars, and restaurants." },
                { time: "Late Night (2-5 AM)", desc: "Limited demand, mostly airport runs and late-night workers." },
              ].map((item, i) => (
                <div key={i} className="border-b last:border-b-0 pb-3 last:pb-0">
                  <h4 className="font-medium">{item.time}</h4>
                  <p className="text-sm mt-1">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Location-based Analysis */}
          <div className={`${colors.card} p-4 border ${colors.border} rounded-lg mb-6`}>
            <h3 className="text-lg font-semibold mb-3">Location-based Demand Hotspots</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  area: "Downtown Business District",
                  level: "Very High",
                  times: "7-9 AM, 5-7 PM",
                  desc: "Office workers commuting to and from work",
                },
                {
                  area: "Shopping Malls",
                  level: "High",
                  times: "11 AM-8 PM",
                  desc: "Shoppers and diners throughout the day",
                },
                {
                  area: "Airport",
                  level: "Steady",
                  times: "All day",
                  desc: "Consistent demand for airport pickups and drop-offs",
                },
                {
                  area: "Entertainment District",
                  level: "High",
                  times: "7 PM-2 AM",
                  desc: "Evening entertainment and nightlife",
                },
                {
                  area: "Residential Areas",
                  level: "Medium",
                  times: "7-9 AM, 5-7 PM",
                  desc: "Commuters heading to and from work",
                },
                {
                  area: "University Campus",
                  level: "Medium",
                  times: "8-10 AM, 3-6 PM",
                  desc: "Students and faculty commuting",
                },
                { area: "Hospital Zone", level: "Low-Medium", times: "All day", desc: "Patients, visitors, and staff" },
                { area: "Industrial Park", level: "Medium", times: "6-8 AM, 4-6 PM", desc: "Shift workers commuting" },
              ].map((item, i) => (
                <div key={i} className={`${colors.secondaryBg} p-3 rounded-lg`}>
                  <h4 className="font-medium">{item.area}</h4>
                  <div className="mt-2 text-sm">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">Demand Level:</span>
                      <span
                        className={
                          item.level === "Very High"
                            ? "text-red-500"
                            : item.level === "High"
                              ? "text-orange-500"
                              : item.level === "Medium"
                                ? "text-yellow-500"
                                : "text-green-500"
                        }
                      >
                        {item.level}
                      </span>
                    </div>
                    <div className="mb-1">
                      <span className="font-medium">Peak Times:</span> {item.times}
                    </div>
                    <div>
                      <span className="font-medium">Primary Users:</span> {item.desc}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recommendations */}
          <div className={`${colors.card} p-4 border ${colors.border} rounded-lg mb-6`}>
            <h3 className="text-lg font-semibold mb-3">Driver Recommendations</h3>
            <div className="space-y-4">
              {[
                {
                  title: "Morning Strategy",
                  desc: "Position yourself near residential areas before 7 AM to catch the morning commute. Move to business districts for mid-morning corporate rides.",
                },
                {
                  title: "Afternoon Approach",
                  desc: "Target shopping centers and lunch spots from 11 AM to 2 PM. Transition to school areas for afternoon pickups around 3 PM.",
                },
                {
                  title: "Evening Tactics",
                  desc: "Be near business districts at 5 PM for the evening rush. After 7 PM, move toward entertainment districts and restaurants.",
                },
                {
                  title: "Weekend Focus",
                  desc: "Mornings: Target brunch spots and shopping areas. Afternoons: Parks and tourist attractions. Evenings: Entertainment districts and restaurants.",
                },
                {
                  title: "Weather Considerations",
                  desc: "Demand increases significantly during rain or extreme weather. Position yourself in high-traffic areas during these times for maximum earnings.",
                },
              ].map((item, i) => (
                <div key={i} className="border-b last:border-b-0 pb-3 last:pb-0">
                  <h4 className="font-medium">{item.title}</h4>
                  <p className="text-sm mt-1">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

