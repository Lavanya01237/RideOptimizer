"use client"

import { useEffect, useState, useRef } from "react"
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMapEvents } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"

// Define types
interface Location {
  lat: number
  lng: number
  type: "pickup" | "dropoff"
  time: string
  revenue: number
  tripId: number
  locationName?: string
}

interface MapComponentProps {
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

// Fix Leaflet icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
})

// Create custom icons
const pickupIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-yellow.png",
  iconSize: [30, 45],
  iconAnchor: [15, 45],
  popupAnchor: [1, -34],
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  shadowSize: [41, 41],
})

const dropoffIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-violet.png",
  iconSize: [30, 45],
  iconAnchor: [15, 45],
  popupAnchor: [1, -34],
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  shadowSize: [41, 41],
})

const currentLocationIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
  iconSize: [30, 45],
  iconAnchor: [15, 45],
  popupAnchor: [1, -34],
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  shadowSize: [41, 41],
})

const plannedDropoffIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
  iconSize: [30, 45],
  iconAnchor: [15, 45],
  popupAnchor: [1, -34],
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  shadowSize: [41, 41],
})

// Add a new function to perform reverse geocoding
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

// Location selector component
function LocationSelector({ onLocationSelected }: { onLocationSelected: (lat: number, lng: number) => void }) {
  const map = useMapEvents({
    click: (e) => {
      onLocationSelected(e.latlng.lat, e.latlng.lng)
      map.panTo(e.latlng)
    },
  })
  return null
}

export default function MapComponent({
  locations,
  darkMode = false,
  isSelectionMode = false,
  onLocationSelected,
  customDropoffs = [],
  themeColors,
  onMapClick,
}: MapComponentProps) {
  const center = locations.length > 0 ? locations[0] : { lat: 1.3521, lng: 103.8198 }
  const [routes, setRoutes] = useState<Array<{ pickup: Location; dropoff: Location; coordinates: [number, number][] }>>(
    [],
  )
  const [activeTrip, setActiveTrip] = useState<number | null>(null)
  const [tempMarker, setTempMarker] = useState<{ lat: number; lng: number; name?: string } | null>(null)
  const mapRef = useRef<any>(null)

  const colors = themeColors || {
    bg: darkMode ? "bg-gray-900" : "bg-purple-50",
    card: darkMode ? "bg-gray-800" : "bg-white",
    text: darkMode ? "text-gray-200" : "text-gray-800",
    highlight: darkMode ? "text-purple-400" : "text-purple-600",
    secondaryBg: darkMode ? "bg-gray-700" : "bg-purple-50",
    border: darkMode ? "border-gray-700" : "border-purple-100",
  }

  // Find the most recent location
  const getMostRecentLocation = () => {
    if (locations.length <= 0) return null

    if (isSelectionMode) return locations[0]

    const sortedLocations = [...locations].sort((a, b) => b.tripId - a.tripId)
    return sortedLocations[0]
  }

  // Generate routes between pickup and dropoff locations
  useEffect(() => {
    const generateRoutes = () => {
      const tripRoutes: Array<{ pickup: Location; dropoff: Location; coordinates: [number, number][] }> = []

      for (let i = 0; i < locations.length; i++) {
        if (locations[i].type === "pickup") {
          const dropoff = locations.find((loc) => loc.tripId === locations[i].tripId && loc.type === "dropoff")

          if (dropoff) {
            // Create a straight line route for simplicity
            tripRoutes.push({
              pickup: locations[i],
              dropoff: dropoff,
              coordinates: [
                [locations[i].lat, locations[i].lng],
                [dropoff.lat, dropoff.lng],
              ],
            })
          }
        }
      }

      setRoutes(tripRoutes)
    }

    if (locations.length > 0) {
      generateRoutes()
    }
  }, [locations])

  const handleTripClick = (tripId: number) => {
    setActiveTrip((prevId) => (prevId === tripId ? null : tripId))

    const pickup = locations.find((loc) => loc.tripId === tripId && loc.type === "pickup")
    const dropoff = locations.find((loc) => loc.tripId === tripId && loc.type === "dropoff")

    if (pickup && dropoff && mapRef.current) {
      const bounds = [
        [pickup.lat, pickup.lng],
        [dropoff.lat, dropoff.lng],
      ]
      mapRef.current.fitBounds(bounds, { padding: [50, 50] })
    }
  }

  // Handle map clicks for location selection
  const handleLocationSelected = async (lat: number, lng: number) => {
    setTempMarker({ lat, lng })

    if (onLocationSelected) {
      onLocationSelected(lat, lng)
    }

    if (mapRef.current) {
      mapRef.current.panTo([lat, lng])
    }

    // Get the location name and update the popup content
    try {
      const locationName = await reverseGeocode(lat, lng)
      setTempMarker({ lat, lng, name: locationName })
    } catch (error) {
      console.error("Failed to get location name:", error)
    }
  }

  const mostRecentLocation = getMostRecentLocation()

  return (
    <div className="relative h-full rounded-lg overflow-hidden">
      <MapContainer center={[center.lat, center.lng]} zoom={12} className="h-full w-full rounded-lg z-0" ref={mapRef}>
        <TileLayer
          url={
            darkMode
              ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
              : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          }
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {/* Add location selector when in selection mode */}
        {isSelectionMode && onLocationSelected && <LocationSelector onLocationSelected={handleLocationSelected} />}

        {/* Render each individual trip route */}
        {!isSelectionMode &&
          routes.map((route, index) => {
            const isActive = activeTrip === null || activeTrip === route.pickup.tripId
            return (
              <Polyline
                key={`route-${route.pickup.tripId}`}
                positions={route.coordinates}
                pathOptions={{
                  color: isActive ? (darkMode ? "#C084FC" : "#9333EA") : darkMode ? "#374151" : "#E9D5FF",
                  weight: isActive ? 4 : 2,
                  opacity: isActive ? 0.8 : 0.4,
                  dashArray: "6 8",
                }}
                eventHandlers={{
                  click: () => handleTripClick(route.pickup.tripId),
                }}
              />
            )
          })}

        {/* Render regular locations (excluding the most recent one) */}
        {!isSelectionMode &&
          locations.map((location, index) => {
            // Skip the most recent location as it will be rendered with a different marker
            if (
              mostRecentLocation &&
              location.lat === mostRecentLocation.lat &&
              location.lng === mostRecentLocation.lng
            ) {
              return null
            }

            return (
              <Marker
                key={`${location.tripId}-${location.type}-${index}`}
                position={[location.lat, location.lng]}
                icon={location.type === "pickup" ? pickupIcon : dropoffIcon}
                eventHandlers={{
                  click: () => handleTripClick(location.tripId),
                }}
              >
                <Popup className={darkMode ? "dark-popup" : ""}>
                  <div className={`text-sm p-2 ${darkMode ? "text-white" : ""}`}>
                    <div className="flex items-center space-x-2 mb-2">
                      <span
                        className={`w-3 h-3 rounded-full ${location.type === "pickup" ? "bg-yellow-500" : "bg-purple-500"}`}
                      />
                      <span className="font-medium">{location.type === "pickup" ? "Pick-up" : "Drop-off"}</span>
                    </div>
                    {location.locationName && <p className="text-sm font-medium mb-2">{location.locationName}</p>}
                    {location.time && <p className="text-sm mb-2">Time: {location.time}</p>}
                    {location.type === "dropoff" && (
                      <p className="text-green-600 font-medium text-sm mb-2">Revenue: ${location.revenue.toFixed(2)}</p>
                    )}
                    <p className="text-xs mt-1 text-gray-500">
                      {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
                    </p>
                  </div>
                </Popup>
              </Marker>
            )
          })}

        {/* Render the most recent location with a blue marker */}
        {mostRecentLocation && (
          <Marker
            key={`most-recent-${mostRecentLocation.tripId}-${mostRecentLocation.type}`}
            position={[mostRecentLocation.lat, mostRecentLocation.lng]}
            icon={currentLocationIcon}
            zIndexOffset={1000} // Ensure this marker appears on top
          >
            <Popup className={darkMode ? "dark-popup" : ""} autoClose={false}>
              <div className={`text-sm p-2 ${darkMode ? "text-white" : ""}`}>
                <div className="flex items-center space-x-2 mb-2">
                  <span className="w-3 h-3 rounded-full bg-blue-500" />
                  <span className="font-medium">
                    {isSelectionMode
                      ? "Current Location"
                      : mostRecentLocation.type === "pickup"
                        ? "Current Pickup Location"
                        : "Current Dropoff Location"}
                  </span>
                </div>
                {mostRecentLocation.locationName && (
                  <p className="text-sm font-medium mb-2">{mostRecentLocation.locationName}</p>
                )}
                {mostRecentLocation.time && <p className="text-sm mb-2">Time: {mostRecentLocation.time}</p>}
                {mostRecentLocation.type === "dropoff" && mostRecentLocation.revenue > 0 && (
                  <p className="text-green-600 font-medium text-sm mb-2">
                    Revenue: ${mostRecentLocation.revenue.toFixed(2)}
                  </p>
                )}
                <p className="text-xs mt-1 text-gray-500">
                  {mostRecentLocation.lat.toFixed(4)}, {mostRecentLocation.lng.toFixed(4)}
                </p>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Render custom dropoff locations */}
        {customDropoffs &&
          customDropoffs.length > 0 &&
          customDropoffs.map((dropoff) => (
            <Marker
              key={`custom-dropoff-${dropoff.id}`}
              position={[dropoff.lat, dropoff.lng]}
              icon={plannedDropoffIcon}
            >
              <Popup className={darkMode ? "dark-popup" : ""} autoClose={false}>
                <div className={`text-sm p-2 ${darkMode ? "text-white" : ""}`}>
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="w-3 h-3 rounded-full bg-red-500" />
                    <span className="font-medium">{dropoff.label}</span>
                  </div>
                  <p className="text-xs mt-1 text-gray-500">
                    {dropoff.lat.toFixed(4)}, {dropoff.lng.toFixed(4)}
                  </p>
                </div>
              </Popup>
            </Marker>
          ))}

        {/* Show temporary marker when selecting a location */}
        {tempMarker && (
          <Marker position={[tempMarker.lat, tempMarker.lng]} icon={plannedDropoffIcon}>
            <Popup className={darkMode ? "dark-popup" : ""} autoClose={false} closeOnClick={false}>
              <div className={`text-sm p-2 ${darkMode ? "text-white" : ""}`}>
                <p className="font-medium mb-2">{tempMarker.name || "Selected Location"}</p>
                <p className="text-xs text-gray-500">
                  {tempMarker.lat.toFixed(4)}, {tempMarker.lng.toFixed(4)}
                </p>
              </div>
            </Popup>
          </Marker>
        )}
      </MapContainer>

      {/* Selection mode indicator */}
      {isSelectionMode && (
        <div
          className={`absolute top-4 left-4 z-10 bg-[#e67e5a] text-white px-4 py-2 rounded-full shadow-lg text-sm font-medium`}
        >
          Click on the map to select a drop-off location
        </div>
      )}

      {/* Reset view button - only show when not in selection mode */}
      {!isSelectionMode && locations.length > 0 && (
        <button
          className={`absolute top-4 right-4 z-10 ${darkMode ? "bg-gray-800 text-purple-300" : "bg-white text-purple-700"} rounded-full px-4 py-2 text-xs font-medium shadow-lg hover:${darkMode ? "bg-gray-700" : "bg-purple-50"} transition-colors duration-200`}
          onClick={() => {
            setActiveTrip(null)
            if (mapRef.current) {
              const allCoordinates = locations.map((loc) => [loc.lat, loc.lng])
              mapRef.current.fitBounds(allCoordinates.length > 0 ? allCoordinates : [[1.3521, 103.8198]])
            }
          }}
        >
          Reset View
        </button>
      )}
    </div>
  )
}

