"use client"

import { useEffect, useRef } from "react"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import "leaflet.heat"

interface HeatMapComponentProps {
  darkMode?: boolean
  centerLocation: { lat: number; lng: number }
  points: [number, number, number][]
}

export default function HeatMapComponent({ darkMode = false, centerLocation, points }: HeatMapComponentProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const leafletMapRef = useRef<L.Map | null>(null)
  const heatLayerRef = useRef<any>(null)

  // Initialize map and heat layer
  useEffect(() => {
    // Skip if no container
    if (!mapRef.current) return

    // Add event listener to stop propagation of click events
    const stopPropagation = (e: MouseEvent) => {
      e.stopPropagation()
    }

    // Add the event listener to the map container
    mapRef.current.addEventListener("click", stopPropagation)

    // Initialize map if it doesn't exist
    if (!leafletMapRef.current) {
      try {
        // Fix Leaflet icon issue
        delete (L.Icon.Default.prototype as any)._getIconUrl
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
          iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
          shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
        })

        // Create map with explicit settings
        const map = L.map(mapRef.current, {
          center: [centerLocation.lat, centerLocation.lng],
          zoom: 13,
          keyboard: true,
          dragging: true,
          zoomControl: true,
          doubleClickZoom: false, // Disable double click zoom to prevent issues
        })

        // Add tile layer
        L.tileLayer(
          darkMode
            ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
          {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          },
        ).addTo(map)

        // Store map reference
        leafletMapRef.current = map
      } catch (error) {
        console.error("Error initializing map:", error)
      }
    }

    // Update heat layer with new points
    if (leafletMapRef.current) {
      try {
        // Remove existing heat layer
        if (heatLayerRef.current) {
          leafletMapRef.current.removeLayer(heatLayerRef.current)
          heatLayerRef.current = null
        }

        // Add new heat layer if we have points
        if (points && points.length > 0) {
          // Create fallback points if needed
          const pointsToUse =
            points.length > 0
              ? points
              : [
                  [centerLocation.lat, centerLocation.lng, 0.7],
                  [centerLocation.lat + 0.01, centerLocation.lng + 0.01, 0.5],
                  [centerLocation.lat - 0.01, centerLocation.lng - 0.01, 0.3],
                ]

          // Create and add the heat layer with improved configuration
          // @ts-ignore - leaflet.heat is not typed
          const heatLayer = L.heatLayer(pointsToUse, {
            radius: 25,
            blur: 15,
            maxZoom: 17,
            minOpacity: 0.4,
            max: 1.0, // Set maximum value to ensure proper scaling
            gradient: { 0.4: "blue", 0.6: "lime", 0.8: "yellow", 1.0: "red" },
          })

          heatLayer.addTo(leafletMapRef.current)
          heatLayerRef.current = heatLayer
        }
      } catch (error) {
        console.error("Error updating heat layer:", error)
      }
    }

    // Cleanup on unmount
    return () => {
      if (mapRef.current) {
        mapRef.current.removeEventListener("click", stopPropagation)
      }

      if (leafletMapRef.current) {
        if (heatLayerRef.current) {
          leafletMapRef.current.removeLayer(heatLayerRef.current)
        }
        leafletMapRef.current.remove()
        leafletMapRef.current = null
        heatLayerRef.current = null
      }
    }
  }, [centerLocation.lat, centerLocation.lng, darkMode, points])

  return (
    <div
      ref={mapRef}
      className="h-full w-full"
      style={{
        minHeight: "500px",
        height: "100%",
        width: "100%",
        position: "absolute",
        top: 0,
        left: 0,
      }}
    />
  )
}

