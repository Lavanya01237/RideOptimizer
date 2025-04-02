"use client"
import { Home, X, BarChart, Fuel, Cloud, Award, Calendar, Navigation } from "lucide-react"
import { cn } from "@/lib/utils"

interface SidebarMenuProps {
  activeFeature: string | null
  onFeatureSelect: (feature: string | null) => void
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
  isOpen: boolean
  onToggle: () => void
}

export function SidebarMenu({
  activeFeature,
  onFeatureSelect,
  themeColors,
  darkMode = false,
  isOpen,
  onToggle,
}: SidebarMenuProps) {
  const handleFeatureSelect = (feature: string | null) => {
    onFeatureSelect(feature)
    if (window.innerWidth < 1024) {
      onToggle() // Close sidebar on mobile after selection
    }
  }

  const menuItems = [
    { id: null, label: "Home", icon: Home, description: "Route Planning" },
    { id: "analytics", label: "Revenue Analytics", icon: BarChart, description: "Track your earnings" },
    { id: "fuel", label: "Fuel Tracker", icon: Fuel, description: "Monitor fuel consumption" },
    { id: "weather", label: "Weather & Traffic", icon: Cloud, description: "Check conditions" },
    { id: "performance", label: "Performance", icon: Award, description: "View your stats" },
    { id: "schedule", label: "Schedule Planner", icon: Calendar, description: "Plan your week" },
  ]

  return (
    <>
      {/* Overlay for mobile - only visible when sidebar is open */}
      <div
        className={cn(
          "fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none",
        )}
        onClick={onToggle}
      />

      {/* Sidebar */}
      <div
        className={cn(
          "fixed left-0 top-0 h-full z-30 transition-all duration-300 transform",
          isOpen ? "translate-x-0" : "-translate-x-full",
          themeColors.card,
          "shadow-xl w-64 lg:w-72",
        )}
      >
        <div className="p-6 h-full flex flex-col">
          {/* Logo and app name */}
          <div className="flex items-center justify-between mb-8 mt-4">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-[#e67e5a] flex items-center justify-center">
                <Navigation className="h-5 w-5 text-white" />
              </div>
              <div className="ml-3">
                <h1 className="text-xl font-bold">
                  <span className="text-[#e67e5a]">Ride</span>
                  <span className={themeColors.text}>Optimizer</span>
                </h1>
              </div>
            </div>

            {/* Close button */}
            <button onClick={onToggle} className="p-2 rounded-full hover:bg-gray-200" aria-label="Close menu">
              <X size={20} className={themeColors.text} />
            </button>
          </div>

          {/* Menu items */}
          <nav className="flex-1 overflow-y-auto">
            <ul className="space-y-2">
              {menuItems.map((item) => (
                <li key={item.label}>
                  <button
                    onClick={() => handleFeatureSelect(item.id)}
                    className={cn(
                      "w-full flex items-center p-3 rounded-lg transition-colors duration-200",
                      activeFeature === item.id
                        ? `${themeColors.buttonPrimary} text-white`
                        : `hover:${themeColors.secondaryBg} ${themeColors.text}`,
                    )}
                  >
                    <item.icon
                      className={cn("h-5 w-5 mr-3", activeFeature === item.id ? "text-white" : themeColors.highlight)}
                    />
                    <div className="flex flex-col items-start">
                      <span className="font-medium">{item.label}</span>
                      <span
                        className={cn(
                          "text-xs",
                          activeFeature === item.id ? "text-white text-opacity-80" : themeColors.secondaryText,
                        )}
                      >
                        {item.description}
                      </span>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {/* Close button for mobile */}
          <button
            onClick={onToggle}
            className={`lg:hidden mt-4 p-2 rounded-lg ${themeColors.secondaryBg} ${themeColors.text} w-full`}
          >
            Close Menu
          </button>
        </div>
      </div>
    </>
  )
}

