"use client"

import {
  Navigation,
  UserIcon,
  BellIcon,
  MapIcon,
  LogOut,
  BarChart,
  Fuel,
  Cloud,
  Award,
  Calendar,
  Menu,
} from "lucide-react"
import Link from "next/link"
import { useState } from "react"

interface HeaderProps {
  notificationCount?: number
  onNotificationsClick?: () => void
  onUserProfileClick?: () => void
  onNewRouteClick?: () => void
  onLogout?: () => void
  showBackToApp?: boolean
  userName?: string
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
  onBackToAppClick?: () => void
  onToggleHeatMap?: () => void
  onTutorialClick?: () => void
  showTutorialHighlight?: boolean
  darkMode?: boolean
  toggleDarkMode?: () => void
  onFeatureSelect?: (feature: string) => void
  toggleSidebar?: () => void
  activeFeature?: string | null
}

export function Header({
  notificationCount = 0,
  onNotificationsClick,
  onUserProfileClick,
  onNewRouteClick = () => {},
  onLogout,
  showBackToApp = false,
  userName,
  themeColors,
  onBackToAppClick,
  onToggleHeatMap,
  onTutorialClick,
  showTutorialHighlight = false,
  darkMode = false,
  toggleDarkMode,
  onFeatureSelect,
  toggleSidebar,
  activeFeature,
}: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

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

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <>
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
                {userName && (
                  <div className="p-3 mb-4 bg-[#f0f0eb] rounded-lg">
                    <div className="font-medium text-[#2d2d2d]">{userName}</div>
                  </div>
                )}
                <button
                  onClick={onUserProfileClick}
                  className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-[#f0f0eb]"
                >
                  <UserIcon className="h-5 w-5 text-[#6b6b6b]" />
                  <span className="text-[#2d2d2d]">Profile</span>
                </button>
                <Link href="#" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-[#f0f0eb]">
                  <Navigation className="h-5 w-5 text-[#6b6b6b]" />
                  <span className="text-[#2d2d2d]">History</span>
                </Link>
                <button
                  onClick={onNotificationsClick}
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
                  onClick={onToggleHeatMap}
                  className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-[#f0f0eb] text-left"
                >
                  <MapIcon className="h-5 w-5 text-[#6b6b6b]" />
                  <span className="text-[#2d2d2d]">Demand Heat Map</span>
                </button>
                <button
                  onClick={onTutorialClick}
                  className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-[#f0f0eb] text-left"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5 text-[#6b6b6b]"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                    <path d="M12 17h.01" />
                  </svg>
                  <span className="text-[#2d2d2d]">Tutorial</span>
                </button>
                {onFeatureSelect && (
                  <>
                    <button
                      onClick={() => onFeatureSelect("analytics")}
                      className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-[#f0f0eb]"
                    >
                      <BarChart className="h-5 w-5 text-[#6b6b6b]" />
                      <span className="text-[#2d2d2d]">Revenue Analytics</span>
                    </button>
                    <button
                      onClick={() => onFeatureSelect("fuel")}
                      className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-[#f0f0eb]"
                    >
                      <Fuel className="h-5 w-5 text-[#6b6b6b]" />
                      <span className="text-[#2d2d2d]">Fuel Tracker</span>
                    </button>
                    <button
                      onClick={() => onFeatureSelect("weather")}
                      className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-[#f0f0eb]"
                    >
                      <Cloud className="h-5 w-5 text-[#6b6b6b]" />
                      <span className="text-[#2d2d2d]">Weather & Traffic</span>
                    </button>
                    <button
                      onClick={() => onFeatureSelect("performance")}
                      className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-[#f0f0eb]"
                    >
                      <Award className="h-5 w-5 text-[#6b6b6b]" />
                      <span className="text-[#2d2d2d]">Performance</span>
                    </button>
                    <button
                      onClick={() => onFeatureSelect("schedule")}
                      className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-[#f0f0eb]"
                    >
                      <Calendar className="h-5 w-5 text-[#6b6b6b]" />
                      <span className="text-[#2d2d2d]">Schedule Planner</span>
                    </button>
                  </>
                )}
                {onLogout && (
                  <button
                    onClick={onLogout}
                    className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-[#f0f0eb] text-red-500"
                  >
                    <LogOut className="h-5 w-5" />
                    <span>Sign Out</span>
                  </button>
                )}
              </nav>
            </div>
          </div>
        </div>
      )}

      <header className="bg-gradient-to-r from-white to-[#faf7f5] border-b border-[#e8e8e3] transition-colors duration-300 shadow-sm py-5 pb-12">
        <div className="max-w-7xl mx-auto px-7 sm:px-6 lg:px-8">
          <div className="relative flex justify-center">
            {/* Center Section - Logo and App Name */}
            <div className="flex items-center">
              {/* Logo with enhanced styling */}
              <div className="w-16 h-16 rounded-full bg-[#e67e5a] flex items-center justify-center shadow-md border-2 border-white logo-pulse">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="drop-shadow-sm"
                >
                  <polygon points="3 11 22 2 13 21 11 13 3 11"></polygon>
                </svg>
              </div>

              {/* Text with enhanced styling */}
              <div className="ml-4">
                <h1 className="text-4xl font-bold tracking-tight">
                  <span className="text-[#e67e5a]">Ride</span>
                  <span className="text-[#2d2d2d]">Optimizer</span>
                </h1>
                <div className="text-sm font-medium text-[#6b6b6b]">For professional drivers</div>
              </div>
            </div>

            {/* Action buttons - positioned at the bottom */}
            <div className="absolute bottom-0 transform translate-y-8 flex items-center justify-end w-full">
              {!showBackToApp && (
                <>
                  {/* New Route button */}
                  <button
                    onClick={() => onFeatureSelect && onFeatureSelect(null)}
                    className={`text-sm px-3.5 py-1.5 rounded-full ${activeFeature === null ? "bg-[#e67e5a] text-white" : "bg-[#e1f0ed] text-[#2d2d2d]"} hover:bg-[#d5e9e5] flex items-center text-[13px] mr-2`}
                  >
                    <MapIcon className="h-3.5 w-3.5 mr-1" />
                    New Route
                  </button>

                  <button
                    onClick={onToggleHeatMap}
                    className="text-sm px-3.5 py-1.5 rounded-full bg-[#e1f0ed] text-[#2d2d2d] hover:bg-[#d5e9e5] flex items-center text-[13px] mr-2"
                  >
                    <MapIcon className="h-3.5 w-3.5 mr-1" />
                    Demand Heat Map
                  </button>
                  <button
                    onClick={onTutorialClick}
                    className={`text-sm px-3.5 py-1.5 rounded-full ${showTutorialHighlight ? "bg-yellow-100 border border-yellow-400 animate-pulse" : "bg-[#e1f0ed]"} text-[#2d2d2d] hover:bg-[#d5e9e5] flex items-center text-[13px] relative`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-1"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                      <path d="M12 17h.01" />
                    </svg>
                    Tutorial
                    {showTutorialHighlight && (
                      <span className="absolute -top-2 -right-2 flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-yellow-500"></span>
                      </span>
                    )}
                  </button>
                </>
              )}
              {showBackToApp && (
                <button
                  onClick={(e) => {
                    e.preventDefault()
                    console.log("Back button clicked")
                    if (onBackToAppClick) {
                      onBackToAppClick()
                    } else {
                      console.log("No handler provided")
                    }
                  }}
                  className="text-sm px-3.5 py-1.5 rounded-full bg-[#e1f0ed] text-[#2d2d2d] hover:bg-[#d5e9e5] flex items-center text-[13px]"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mr-1"
                  >
                    <path d="m12 19-7-7 7-7" />
                    <path d="M19 12H5" />
                  </svg>
                  Back to App
                </button>
              )}
            </div>

            {/* User controls - positioned absolutely to the right top */}
            <div className="absolute right-0 top-0 flex items-center space-x-3">
              {/* Menu button - now in the top right with notification and profile */}
              <button
                onClick={toggleSidebar}
                className="w-10 h-10 rounded-full bg-white border border-[#e8e8e3] flex items-center justify-center"
                aria-label="Menu"
              >
                <Menu size={18} className="text-[#2d2d2d]" />
              </button>

              <button
                onClick={onNotificationsClick}
                className="w-10 h-10 rounded-full bg-white border border-[#e8e8e3] flex items-center justify-center relative"
              >
                <BellIcon size={18} className="text-[#2d2d2d]" />
                {notificationCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#e67e5a] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {notificationCount}
                  </span>
                )}
              </button>

              <button
                onClick={onUserProfileClick}
                className="w-10 h-10 rounded-full bg-white border border-[#e8e8e3] flex items-center justify-center"
              >
                <UserIcon size={18} className="text-[#2d2d2d]" />
              </button>

              <button
                onClick={toggleMenu}
                className="w-10 h-10 rounded-full border border-[#e8e8e3] flex items-center justify-center lg:hidden"
              >
                <Navigation size={18} className="text-[#2d2d2d]" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <style jsx global>{`
        /* Logo hover effect */
        @keyframes pulse-shadow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(230, 126, 90, 0.4); }
          50% { box-shadow: 0 0 0 8px rgba(230, 126, 90, 0); }
        }

        .logo-pulse:hover {
          animation: pulse-shadow 2s infinite;
        }
      `}</style>
    </>
  )
}

