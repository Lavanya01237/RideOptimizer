"use client"

import type React from "react"

import { useEffect } from "react"

import { useState, useRef } from "react"
import {
  User,
  Settings,
  LogOut,
  Star,
  Clock,
  DollarSign,
  TrendingUp,
  Calendar,
  Award,
  ChevronRight,
} from "lucide-react"

// Import the EditProfileForm component at the top of the file
// import { EditProfileForm } from "./EditProfileForm"

// Update the UserProfileProps interface to accept toggleDarkMode function
interface UserProfileProps {
  onClose: () => void
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
  user?: {
    name: string
    email: string
    joinDate?: string
    rating?: number
  }
  darkMode?: boolean
  toggleDarkMode?: () => void
  onLogout: () => void
}

// Update the function signature to accept the new props
export function UserProfile({
  onClose,
  themeColors,
  user,
  darkMode = false,
  toggleDarkMode,
  onLogout,
}: UserProfileProps) {
  const [activeTab, setActiveTab] = useState<"profile" | "stats" | "settings">("profile")

  // Remove the local darkMode state since we're now using the prop
  // const [darkMode, setDarkMode] = useState(false)

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

  // Update the userData to use the darkMode prop
  const userData = {
    name: user?.name || "Alex Johnson",
    email: user?.email || "alex.johnson@example.com",
    phone: "+1 (555) 123-4567",
    joinDate: user?.joinDate || "March 2025",
    profileImage: "/placeholder.svg?height=100&width=100",
    rating: user?.rating || 4.8,
    completedRoutes: 42,
    totalEarnings: 3850.75,
    averagePerRoute: 91.68,
    bestDay: "Wednesday",
    bestTimeOfDay: "Evening (6-9 PM)",
    preferences: {
      darkMode: darkMode, // Use the prop value
      notifications: true,
      soundEffects: true,
      autoBreakScheduling: true,
      defaultStartTime: "6:00 AM",
      defaultEndTime: "8:00 PM",
      defaultBreakTime: "12:00 PM - 1:00 PM",
    },
  }

  // Update the UserProfile component to add a confirmation dialog for sign out
  // Add a new state for the confirmation dialog
  const [showSignOutConfirmation, setShowSignOutConfirmation] = useState(false)

  // Add a new state for showing the edit profile form
  const [showEditProfile, setShowEditProfile] = useState(false)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className={`${colors.card} w-full max-w-3xl h-[90vh] rounded-xl shadow-lg overflow-hidden`}>
        <div className="flex h-full">
          {/* Sidebar */}
          <div className={`w-64 ${colors.bg} p-6 flex flex-col`}>
            <div className="flex items-center space-x-3 mb-8">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200">
                <img
                  src={userData.profileImage || "/placeholder.svg"}
                  alt={userData.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className={`font-medium ${colors.text}`}>{userData.name}</h3>
                <p className={`text-sm ${colors.secondaryText}`}>Driver</p>
              </div>
            </div>

            <nav className="flex-1">
              <ul className="space-y-1">
                <li>
                  <button
                    onClick={() => setActiveTab("profile")}
                    className={`w-full text-left px-4 py-3 rounded-lg flex items-center space-x-3 transition-colors ${
                      activeTab === "profile" ? `${colors.buttonPrimary} text-white` : `hover:bg-white ${colors.text}`
                    }`}
                  >
                    <User size={18} />
                    <span>Profile</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab("stats")}
                    className={`w-full text-left px-4 py-3 rounded-lg flex items-center space-x-3 transition-colors ${
                      activeTab === "stats" ? `${colors.buttonPrimary} text-white` : `hover:bg-white ${colors.text}`
                    }`}
                  >
                    <TrendingUp size={18} />
                    <span>Statistics</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab("settings")}
                    className={`w-full text-left px-4 py-3 rounded-lg flex items-center space-x-3 transition-colors ${
                      activeTab === "settings" ? `${colors.buttonPrimary} text-white` : `hover:bg-white ${colors.text}`
                    }`}
                  >
                    <Settings size={18} />
                    <span>Settings</span>
                  </button>
                </li>
              </ul>
            </nav>

            <div className="mt-auto pt-6 border-t border-gray-200">
              <button
                onClick={() => setShowSignOutConfirmation(true)}
                className="w-full px-4 py-3 rounded-lg flex items-center space-x-3 text-red-500 hover:bg-red-50 transition-colors"
              >
                <LogOut size={18} />
                <span>Sign Out</span>
              </button>
            </div>
          </div>

          {/* Main content */}
          <div className="flex-1 flex flex-col h-full">
            <div className="flex justify-between items-center p-6 border-b border-gray-100 flex-shrink-0">
              <h2 className="text-xl font-semibold">
                {activeTab === "profile" && "My Profile"}
                {activeTab === "stats" && "My Statistics"}
                {activeTab === "settings" && "Settings"}
              </h2>
              <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-x"
                >
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
              </button>
            </div>

            {/* Scrollable content area with visible scrollbar */}
            <div className="flex-1 overflow-y-auto scrollbar-visible">
              {/* Profile Tab */}
              {activeTab === "profile" && (
                <div className="p-6 pb-12 space-y-6">
                  <div className={`p-5 rounded-lg ${colors.bg}`}>
                    <div className="flex items-center">
                      <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200 mr-5">
                        <img
                          src={userData.profileImage || "/placeholder.svg"}
                          alt={userData.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="text-lg font-sm">{userData.name}</h3>
                        <div className="flex items-center mt-1">
                          <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                          <span className="ml-1 text-base">{userData.rating} Rating</span>
                        </div>
                        <p className={`${colors.secondaryText} text-sm mt-1`}>Member since {userData.joinDate}</p>
                      </div>
                      <button
                        onClick={() => setShowEditProfile(true)}
                        className={`ml-auto px-4 py-2 rounded-lg ${colors.buttonSecondary} ${colors.highlight}`}
                      >
                        Edit Profile
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className={`p-5 rounded-lg border ${colors.border}`}>
                      <h4 className="text-lg font-medium mb-5">Contact Information</h4>
                      <div className="space-y-6">
                        <div>
                          <p className="text-gray-500 text-sm mb-1">Email</p>
                          <p className="text-sm">{userData.email}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-sm mb-1">Phone</p>
                          <p className="text-sm">{userData.phone}</p>
                        </div>
                      </div>
                    </div>

                    <div className={`p-5 rounded-lg border ${colors.border}`}>
                      <h4 className="text-lg font-medium mb-5">Account Summary</h4>
                      <div className="space-y-6">
                        <div className="flex justify-between items-center">
                          <p className="text-gray-500 text-sm">Completed Routes</p>
                          <p className="text-sm font-sm">{userData.completedRoutes}</p>
                        </div>
                        <div className="flex justify-between items-center">
                          <p className="text-gray-500 text-sm">Total Earnings</p>
                          <p className="text-sm font-sm text-green-600">${userData.totalEarnings.toFixed(2)}</p>
                        </div>
                        <div className="flex justify-between items-center">
                          <p className="text-gray-500 text-sm">Average per Route</p>
                          <p className="text-sm font-sm">${userData.averagePerRoute.toFixed(2)}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={`p-5 rounded-lg border ${colors.border}`}>
                    <h4 className="text-lg font-medium mb-4">Recent Activity</h4>
                    <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 scrollbar-visible">
                      {[
                        { id: 42, date: "26/03/2025", earnings: 92.58, stops: 5 },
                        { id: 41, date: "25/03/2025", earnings: 80.52, stops: 4 },
                        { id: 40, date: "24/03/2025", earnings: 88.75, stops: 6 },
                        { id: 39, date: "23/03/2025", earnings: 95.2, stops: 7 },
                        { id: 38, date: "22/03/2025", earnings: 78.35, stops: 4 },
                        { id: 37, date: "21/03/2025", earnings: 86.9, stops: 5 },
                        { id: 36, date: "20/03/2025", earnings: 90.15, stops: 6 },
                        { id: 35, date: "19/03/2025", earnings: 82.4, stops: 5 },
                        { id: 34, date: "18/03/2025", earnings: 94.75, stops: 7 },
                        { id: 33, date: "17/03/2025", earnings: 77.8, stops: 4 },
                        { id: 32, date: "16/03/2025", earnings: 89.25, stops: 6 },
                      ].map((route) => (
                        <div key={route.id} className={`p-4 rounded-lg ${colors.bg} flex justify-between items-center`}>
                          <div>
                            <p className="font-medium">Route #{route.id}</p>
                            <p className={`${colors.secondaryText} text-sm`}>{route.date}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-green-600 font-medium">${route.earnings.toFixed(2)}</p>
                            <p className={`${colors.secondaryText} text-sm`}>{route.stops} stops</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Stats Tab */}
              {activeTab === "stats" && (
                <div className="p-6 pb-12 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className={`p-4 rounded-lg ${colors.bg} text-center`}>
                      <DollarSign className={`h-8 w-8 mx-auto mb-2 ${colors.highlight}`} />
                      <p className="text-2xl font-bold">${userData.totalEarnings.toFixed(2)}</p>
                      <p className={`${colors.secondaryText}`}>Total Earnings</p>
                    </div>
                    <div className={`p-4 rounded-lg ${colors.bg} text-center`}>
                      <Clock className={`h-8 w-8 mx-auto mb-2 ${colors.highlight}`} />
                      <p className="text-2xl font-bold">{userData.completedRoutes}</p>
                      <p className={`${colors.secondaryText}`}>Completed Routes</p>
                    </div>
                    <div className={`p-4 rounded-lg ${colors.bg} text-center`}>
                      <Award className={`h-8 w-8 mx-auto mb-2 ${colors.highlight}`} />
                      <p className="text-2xl font-bold">{userData.rating}</p>
                      <p className={`${colors.secondaryText}`}>Average Rating</p>
                    </div>
                  </div>

                  <div className={`p-6 rounded-lg border ${colors.border}`}>
                    <h4 className="font-medium mb-4 text-lg">Earnings Breakdown</h4>
                    <div className="mb-6">
                      <WeeklyEarningsChart darkMode={darkMode} themeColors={colors} />
                    </div>
                    <div className="mt-4">
                      <h5 className="font-medium mb-3 text-sm">Daily Breakdown</h5>
                      <div className="space-y-2">
                        {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map(
                          (day, index) => {
                            // Generate random earnings data for demo
                            const earnings = 70 + Math.random() * 60
                            const trips = 4 + Math.floor(Math.random() * 5)
                            const hours = 6 + Math.random() * 4
                            const isHighlight = day === "Wednesday" // Highlight best day

                            return (
                              <div
                                key={day}
                                className={`p-3 rounded-lg flex justify-between items-center cursor-pointer hover:bg-opacity-80 transition-colors ${
                                  isHighlight ? "bg-[#e1f0ed]" : colors.secondaryBg
                                }`}
                              >
                                <div>
                                  <span className={`font-medium ${isHighlight ? colors.highlight : colors.text}`}>
                                    {day}
                                  </span>
                                  <div className="text-xs text-gray-500">
                                    {trips} trips · {hours.toFixed(1)} hours
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className={`font-medium ${isHighlight ? colors.highlight : "text-green-600"}`}>
                                    ${earnings.toFixed(2)}
                                  </div>
                                  <div className="text-xs text-gray-500">${(earnings / hours).toFixed(2)}/hr</div>
                                </div>
                              </div>
                            )
                          },
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className={`p-6 rounded-lg border ${colors.border}`}>
                      <h4 className="font-medium mb-4 text-lg">Performance Insights</h4>
                      <div className="space-y-4">
                        <div className="flex items-start">
                          <Calendar className="h-5 w-5 mr-3 mt-0.5 text-blue-500" />
                          <div>
                            <p className="font-medium">Best Performing Day</p>
                            <p className={`${colors.secondaryText}`}>{userData.bestDay}</p>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <Clock className="h-5 w-5 mr-3 mt-0.5 text-purple-500" />
                          <div>
                            <p className="font-medium">Peak Earning Hours</p>
                            <p className={`${colors.secondaryText}`}>{userData.bestTimeOfDay}</p>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <TrendingUp className="h-5 w-5 mr-3 mt-0.5 text-green-500" />
                          <div>
                            <p className="font-medium">Earnings Trend</p>
                            <p className={`${colors.secondaryText}`}>+12% compared to last month</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className={`p-6 rounded-lg border ${colors.border}`}>
                      <h4 className="font-medium mb-4 text-lg">Route Statistics</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <p>Average Route Duration</p>
                          <p className="font-medium">3.2 hours</p>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div className={`${colors.buttonPrimary} h-2.5 rounded-full`} style={{ width: "65%" }}></div>
                        </div>

                        <div className="flex justify-between items-center mt-4">
                          <p>Average Stops Per Route</p>
                          <p className="font-medium">7.3 stops</p>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div className={`${colors.buttonPrimary} h-2.5 rounded-full`} style={{ width: "73%" }}></div>
                        </div>

                        <div className="flex justify-between items-center mt-4">
                          <p>Break Time Efficiency</p>
                          <p className="font-medium">92%</p>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div className={`${colors.buttonPrimary} h-2.5 rounded-full`} style={{ width: "92%" }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Settings Tab */}
              {activeTab === "settings" && (
                <div className="p-6 pb-12 space-y-6">
                  <div className={`rounded-lg border ${colors.border} overflow-hidden`}>
                    <div className="p-4 border-b border-gray-200">
                      <h4 className="font-medium text-lg">App Preferences</h4>
                    </div>
                    <div className="divide-y divide-gray-200">
                      <div className="flex items-center justify-between p-4">
                        <div>
                          <p className="font-medium">Dark Mode</p>
                          <p className={`text-sm ${colors.secondaryText}`}>Switch between light and dark themes</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            value=""
                            className="sr-only peer"
                            checked={darkMode}
                            onChange={toggleDarkMode}
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#e67e5a]"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between p-4">
                        <div>
                          <p className="font-medium">Notifications</p>
                          <p className={`text-sm ${colors.secondaryText}`}>Receive alerts and updates</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            value=""
                            className="sr-only peer"
                            defaultChecked={userData.preferences.notifications}
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#e67e5a]"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between p-4">
                        <div>
                          <p className="font-medium">Sound Effects</p>
                          <p className={`text-sm ${colors.secondaryText}`}>Play sounds for actions and alerts</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            value=""
                            className="sr-only peer"
                            defaultChecked={userData.preferences.soundEffects}
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#e67e5a]"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between p-4">
                        <div>
                          <p className="font-medium">Auto Break Scheduling</p>
                          <p className={`text-sm ${colors.secondaryText}`}>
                            Automatically schedule optimal break times
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            value=""
                            className="sr-only peer"
                            defaultChecked={userData.preferences.autoBreakScheduling}
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#e67e5a]"></div>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className={`rounded-lg border ${colors.border} overflow-hidden`}>
                    <div className="p-4 border-b border-gray-200">
                      <h4 className="font-medium text-lg">Default Schedule</h4>
                    </div>
                    <div className="divide-y divide-gray-200">
                      <div className="flex items-center justify-between p-4">
                        <div>
                          <p className="font-medium">Default Start Time</p>
                          <p className={`text-sm ${colors.secondaryText}`}>{userData.preferences.defaultStartTime}</p>
                        </div>
                        <ChevronRight className="h-5 w-5 text-gray-400" />
                      </div>

                      <div className="flex items-center justify-between p-4">
                        <div>
                          <p className="font-medium">Default End Time</p>
                          <p className={`text-sm ${colors.secondaryText}`}>{userData.preferences.defaultEndTime}</p>
                        </div>
                        <ChevronRight className="h-5 w-5 text-gray-400" />
                      </div>

                      <div className="flex items-center justify-between p-4">
                        <div>
                          <p className="font-medium">Default Break Time</p>
                          <p className={`text-sm ${colors.secondaryText}`}>{userData.preferences.defaultBreakTime}</p>
                        </div>
                        <ChevronRight className="h-5 w-5 text-gray-400" />
                      </div>
                    </div>
                  </div>

                  <div className={`rounded-lg border ${colors.border} overflow-hidden`}>
                    <div className="p-4 border-b border-gray-200">
                      <h4 className="font-medium text-lg">Account</h4>
                    </div>
                    <div className="divide-y divide-gray-200">
                      <div className="flex items-center justify-between p-4">
                        <div>
                          <p className="font-medium">Change Password</p>
                          <p className={`text-sm ${colors.secondaryText}`}>Update your account password</p>
                        </div>
                        <ChevronRight className="h-5 w-5 text-gray-400" />
                      </div>

                      <div className="flex items-center justify-between p-4">
                        <div>
                          <p className="font-medium">Privacy Settings</p>
                          <p className={`text-sm ${colors.secondaryText}`}>Manage your data and privacy</p>
                        </div>
                        <ChevronRight className="h-5 w-5 text-gray-400" />
                      </div>

                      <div className="flex items-center justify-between p-4">
                        <div>
                          <p className="font-medium text-red-500">Delete Account</p>
                          <p className={`text-sm ${colors.secondaryText}`}>Permanently delete your account</p>
                        </div>
                        <ChevronRight className="h-5 w-5 text-gray-400" />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {showEditProfile && (
        <EditProfileForm
          onClose={() => setShowEditProfile(false)}
          userData={userData}
          themeColors={colors}
          darkMode={darkMode}
        />
      )}
      {showSignOutConfirmation && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black bg-opacity-50 animate-fadeIn">
          <div
            className={`${colors.card} w-full max-w-sm rounded-xl shadow-xl p-8 transform transition-all duration-300 scale-100 animate-scaleIn`}
          >
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-50 text-red-500 mb-4">
                <LogOut className="h-8 w-8" />
              </div>
              <h3 className={`text-xl font-semibold mb-2 ${colors.text}`}>Sign Out</h3>
              <p className={`${colors.secondaryText}`}>Are you sure you want to sign out of your account?</p>
            </div>

            <div className="flex flex-col space-y-3">
              <button
                onClick={() => {
                  setShowSignOutConfirmation(false)
                  onLogout()
                }}
                className="w-full py-3 px-4 rounded-lg bg-red-500 text-white font-medium hover:bg-red-600 transition-colors duration-200 flex items-center justify-center"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Yes, Sign Out
              </button>

              <button
                onClick={() => setShowSignOutConfirmation(false)}
                className={`w-full py-3 px-4 rounded-lg border ${colors.border} ${colors.text} hover:bg-gray-50 transition-colors duration-200`}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Weekly Earnings Chart Component
function WeeklyEarningsChart({ darkMode, themeColors }: { darkMode?: boolean; themeColors?: any }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [selectedDay, setSelectedDay] = useState<number | null>(null)

  // Mock data for the week
  const weekData = [
    { day: "Mon", earnings: 85.5, trips: 5 },
    { day: "Tue", earnings: 92.75, trips: 6 },
    { day: "Wed", earnings: 120.25, trips: 8 }, // Best day
    { day: "Thu", earnings: 78.3, trips: 4 },
    { day: "Fri", earnings: 105.8, trips: 7 },
    { day: "Sat", earnings: 110.4, trips: 7 },
    { day: "Sun", earnings: 65.2, trips: 3 },
  ]

  const totalEarnings = weekData.reduce((sum, day) => sum + day.earnings, 0)
  const avgDailyEarnings = totalEarnings / 7

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Set dimensions
    const width = canvas.width
    const height = canvas.height
    const padding = 40
    const barWidth = (width - padding * 2) / weekData.length - 10

    // Find max value for scaling
    const maxEarnings = Math.max(...weekData.map((d) => d.earnings))

    // Draw axes
    ctx.beginPath()
    ctx.strokeStyle = darkMode ? "#555" : "#ddd"
    ctx.lineWidth = 1
    ctx.moveTo(padding, padding)
    ctx.lineTo(padding, height - padding)
    ctx.lineTo(width - padding, height - padding)
    ctx.stroke()

    // Draw horizontal grid lines
    const gridLines = 5
    ctx.textAlign = "right"
    ctx.font = "10px Arial"
    ctx.fillStyle = darkMode ? "#aaa" : "#666"

    for (let i = 0; i <= gridLines; i++) {
      const y = height - padding - (i * (height - padding * 2)) / gridLines
      const value = ((i * maxEarnings) / gridLines).toFixed(0)

      ctx.beginPath()
      ctx.strokeStyle = darkMode ? "#444" : "#eee"
      ctx.moveTo(padding, y)
      ctx.lineTo(width - padding, y)
      ctx.stroke()

      ctx.fillText(`$${value}`, padding - 5, y + 3)
    }

    // Draw bars
    weekData.forEach((data, index) => {
      const x = padding + index * ((width - padding * 2) / weekData.length) + 5
      const barHeight = (data.earnings / maxEarnings) * (height - padding * 2)
      const y = height - padding - barHeight

      // Bar
      ctx.beginPath()
      ctx.fillStyle =
        index === selectedDay
          ? "#e67e5a" // Highlight selected day
          : data.day === "Wed"
            ? "rgba(230, 126, 90, 0.7)"
            : "rgba(161, 214, 202, 0.7)" // Highlight Wednesday as best day
      ctx.rect(x, y, barWidth, barHeight)
      ctx.fill()

      // Day label
      ctx.fillStyle = darkMode ? "#aaa" : "#666"
      ctx.textAlign = "center"
      ctx.fillText(data.day, x + barWidth / 2, height - padding + 15)
    })

    // Draw average line
    const avgY = height - padding - (avgDailyEarnings / maxEarnings) * (height - padding * 2)
    ctx.beginPath()
    ctx.strokeStyle = "#888"
    ctx.setLineDash([5, 3])
    ctx.moveTo(padding, avgY)
    ctx.lineTo(width - padding, avgY)
    ctx.stroke()
    ctx.setLineDash([])

    // Average label
    ctx.fillStyle = "#888"
    ctx.textAlign = "left"
    ctx.fillText(`Avg: $${avgDailyEarnings.toFixed(2)}`, padding + 5, avgY - 5)
  }, [darkMode, selectedDay])

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const width = canvas.width
    const padding = 40

    // Calculate which bar was clicked
    const barArea = width - padding * 2
    const barIndex = Math.floor((x - padding) / (barArea / weekData.length))

    if (barIndex >= 0 && barIndex < weekData.length) {
      setSelectedDay(selectedDay === barIndex ? null : barIndex)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <span className="text-sm text-gray-500">This Week's Earnings</span>
          <div className="text-xl font-bold">${totalEarnings.toFixed(2)}</div>
        </div>
        {selectedDay !== null && (
          <div className="bg-[#f0f0eb] px-3 py-1 rounded-lg">
            <div className="font-medium">
              {weekData[selectedDay].day}: ${weekData[selectedDay].earnings.toFixed(2)}
            </div>
            <div className="text-xs text-gray-500">{weekData[selectedDay].trips} trips</div>
          </div>
        )}
      </div>

      <div className="relative bg-white rounded-lg p-2 border border-gray-100">
        <canvas
          ref={canvasRef}
          width={500}
          height={250}
          onClick={handleCanvasClick}
          className="w-full cursor-pointer"
        />
        <div className="absolute top-2 left-2 text-xs text-gray-400">Click on bars for details</div>
      </div>
    </div>
  )
}

interface EditProfileFormProps {
  onClose: () => void
  userData: any
  themeColors: any
  darkMode: boolean
}

function EditProfileForm({ onClose, userData, themeColors, darkMode }: EditProfileFormProps) {
  const [name, setName] = useState(userData.name)
  const [email, setEmail] = useState(userData.email)
  const [phone, setPhone] = useState(userData.phone)

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

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black bg-opacity-50 animate-fadeIn">
      <div
        className={`${colors.card} w-full max-w-md rounded-xl shadow-xl p-8 transform transition-all duration-300 scale-100 animate-scaleIn`}
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className={`text-xl font-semibold ${colors.text}`}>Edit Profile</h3>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-x"
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label htmlFor="name" className={`block text-sm font-medium ${colors.text}`}>
              Name
            </label>
            <input
              type="text"
              id="name"
              className={`mt-1 p-3 w-full rounded-md border ${colors.border} ${colors.text} focus:ring-blue-500 focus:border-blue-500`}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="email" className={`block text-sm font-medium ${colors.text}`}>
              Email
            </label>
            <input
              type="email"
              id="email"
              className={`mt-1 p-3 w-full rounded-md border ${colors.border} ${colors.text} focus:ring-blue-500 focus:border-blue-500`}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="phone" className={`block text-sm font-medium ${colors.text}`}>
              Phone
            </label>
            <input
              type="tel"
              id="phone"
              className={`mt-1 p-3 w-full rounded-md border ${colors.border} ${colors.text} focus:ring-blue-500 focus:border-blue-500`}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
        </div>

        <div className="flex justify-end mt-8 space-x-3">
          <button
            onClick={onClose}
            className={`py-3 px-5 rounded-lg border ${colors.border} ${colors.text} hover:bg-gray-50 transition-colors duration-200`}
          >
            Cancel
          </button>
          <button
            onClick={() => {
              // Save changes logic here
              onClose()
            }}
            className={`py-3 px-5 rounded-lg ${colors.buttonPrimary} text-white font-medium hover:bg-[#d46a48] transition-colors duration-200`}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  )
}
;<style jsx global>{`
  /* Always show scrollbars for better UX */
  .scrollbar-visible::-webkit-scrollbar {
    width: 8px;
    height: 8px;
    display: block;
  }
  
  .scrollbar-visible::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 10px;
  }
  
  .scrollbar-visible::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 10px;
  }
  
  .scrollbar-visible::-webkit-scrollbar-thumb:hover {
    background: #a1a1a1;
  }
  
  /* For Firefox */
  .scrollbar-visible {
    scrollbar-width: thin;
    scrollbar-color: #c1c1c1 #f1f1f1;
  }
`}</style>

