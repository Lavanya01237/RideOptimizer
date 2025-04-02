"use client"

import dynamic from "next/dynamic"
import { useEffect, useState } from "react"

// Dynamically import the MapComponent to avoid SSR issues with Leaflet
const MapComponent = dynamic(() => import("./MapComponent"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full flex items-center justify-center bg-gray-100 rounded-lg">
      <div className="text-center">
        <div className="inline-block animate-spin h-8 w-8 border-4 border-gray-300 border-t-purple-600 rounded-full mb-4"></div>
        <p className="text-gray-600">Loading map...</p>
      </div>
    </div>
  ),
})

interface Location {
  lat: number
  lng: number
  type: "pickup" | "dropoff"
  time: string
  revenue: number
  tripId: number
  locationName?: string
}

interface MapProps {
  locations: Location[]
  darkMode?: boolean
  isSelectionMode?: boolean
  onLocationSelected?: (lat: number, lng: number) => void
  customDropoffs?: Array<{
    id: number
    lat: number
    lng: number
    label: string
  }>
  themeColors?: {
    bg: string
    card: string
    text: string
    highlight: string
    secondaryBg: string
    border: string
  }
  onMapClick?: (lat: number, lng: number) => void
}

export function Map({
  locations,
  darkMode = false,
  isSelectionMode = false,
  onLocationSelected,
  customDropoffs,
  themeColors,
  onMapClick,
}: MapProps) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-gray-100 rounded-lg">
        <div className="text-center">
          <div className="inline-block animate-spin h-8 w-8 border-4 border-gray-300 border-t-purple-600 rounded-full mb-4"></div>
          <p className="text-gray-600">Loading map...</p>
        </div>
      </div>
    )
  }

  return (
    <MapComponent
      locations={locations}
      darkMode={darkMode}
      isSelectionMode={isSelectionMode}
      onLocationSelected={onLocationSelected}
      customDropoffs={customDropoffs}
      themeColors={themeColors}
      onMapClick={onMapClick}
    />
  )
}

