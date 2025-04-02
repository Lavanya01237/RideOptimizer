"use client"

import { useState } from "react"
import { Award, TrendingUp, Clock, DollarSign, Star, MapPin, ThumbsUp, Users, BarChart } from "lucide-react"

interface PerformanceDashboardProps {
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
  darkMode?: boolean
}

export function PerformanceDashboard({ themeColors, darkMode = false }: PerformanceDashboardProps) {
  const [timeframe, setTimeframe] = useState<"week" | "month" | "year">("month")

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

  // Mock performance data
  const performanceData = {
    rating: 4.8,
    totalTrips: 1248,
    completionRate: 98.2,
    acceptanceRate: 95.7,
    avgEarningsPerHour: 28.45,
    avgEarningsPerTrip: 15.75,
    totalHours: 1560,
    topAreas: [
      { name: "Downtown", trips: 342, earnings: 5670 },
      { name: "Airport", trips: 215, earnings: 4830 },
      { name: "Orchard Road", trips: 187, earnings: 2980 },
      { name: "Marina Bay", trips: 156, earnings: 2340 },
    ],
    peakHours: [
      { time: "7-9 AM", trips: 245, earnings: 3920 },
      { time: "5-7 PM", trips: 312, earnings: 4680 },
      { time: "10 PM-12 AM", trips: 178, earnings: 2670 },
    ],
    achievements: [
      { name: "1000+ Trips", earned: true, date: "2024-12-15" },
      { name: "4.8+ Rating", earned: true, date: "2025-01-10" },
      { name: "100 Airport Trips", earned: true, date: "2025-02-05" },
      { name: "500 Hours Online", earned: true, date: "2024-11-20" },
      { name: "Perfect Week", earned: false, progress: 80 },
      { name: "Weekend Warrior", earned: true, date: "2025-03-01" },
    ],
    recentFeedback: [
      { comment: "Very professional driver, clean car", rating: 5, date: "2025-03-25" },
      { comment: "Great conversation, knew the fastest routes", rating: 5, date: "2025-03-22" },
      { comment: "Arrived promptly, smooth ride", rating: 4, date: "2025-03-20" },
      { comment: "Helped with luggage, very courteous", rating: 5, date: "2025-03-18" },
    ],
  }

  // Calculate progress towards next tier
  const tierProgress = 78 // Percentage progress to next tier
  const currentTier = "Gold"
  const nextTier = "Platinum"

  return (
    <div className={`${colors.card} rounded-xl shadow-lg overflow-hidden`}>
      <div className={`p-6 border-b ${colors.border}`}>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-xl font-semibold flex items-center">
            <Award className={`mr-2 h-5 w-5 ${colors.highlight}`} />
            Driver Performance
          </h2>

          <div className="flex rounded-lg overflow-hidden border border-gray-200">
            <button
              onClick={() => setTimeframe("week")}
              className={`px-3 py-1.5 text-sm ${timeframe === "week" ? `${colors.buttonPrimary} ${colors.buttonText}` : "bg-white"}`}
            >
              Week
            </button>
            <button
              onClick={() => setTimeframe("month")}
              className={`px-3 py-1.5 text-sm ${timeframe === "month" ? `${colors.buttonPrimary} ${colors.buttonText}` : "bg-white"}`}
            >
              Month
            </button>
            <button
              onClick={() => setTimeframe("year")}
              className={`px-3 py-1.5 text-sm ${timeframe === "year" ? `${colors.buttonPrimary} ${colors.buttonText}` : "bg-white"}`}
            >
              Year
            </button>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Driver Tier Progress */}
        <div className={`p-6 rounded-lg ${colors.secondaryBg} border ${colors.border} mb-6`}>
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg">
                <span className="text-3xl font-bold text-white">{currentTier}</span>
              </div>
              <span className="text-sm mt-2">Driver Tier</span>
            </div>

            <div className="flex-1">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">{currentTier} Driver</span>
                <span className="text-sm font-medium">{nextTier} Driver</span>
              </div>
              <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-400 to-amber-600"
                  style={{ width: `${tierProgress}%` }}
                ></div>
              </div>
              <div className="mt-2 text-sm text-center">
                {100 - tierProgress}% more to reach {nextTier} tier
              </div>

              <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="flex items-center">
                  <Star className="h-5 w-5 text-amber-500 mr-2" />
                  <div>
                    <p className="text-sm font-medium">{performanceData.rating} Rating</p>
                    <p className="text-xs text-gray-500">Lifetime average</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Users className="h-5 w-5 text-blue-500 mr-2" />
                  <div>
                    <p className="text-sm font-medium">{performanceData.totalTrips} Trips</p>
                    <p className="text-xs text-gray-500">Lifetime total</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <h3 className="text-lg font-medium mb-4">Performance Metrics</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className={`p-4 rounded-lg ${colors.secondaryBg} border ${colors.border}`}>
            <div className="flex justify-between items-start">
              <div>
                <p className={`text-sm ${colors.secondaryText}`}>Completion Rate</p>
                <p className="text-2xl font-bold">{performanceData.completionRate}%</p>
              </div>
              <div className={`p-2 rounded-full ${colors.buttonSecondary}`}>
                <ThumbsUp className={`h-5 w-5 ${colors.highlight}`} />
              </div>
            </div>
            <div className="mt-2 text-xs text-gray-500">
              {performanceData.completionRate > 95 ? "Excellent" : "Good"}
            </div>
          </div>

          <div className={`p-4 rounded-lg ${colors.secondaryBg} border ${colors.border}`}>
            <div className="flex justify-between items-start">
              <div>
                <p className={`text-sm ${colors.secondaryText}`}>Acceptance Rate</p>
                <p className="text-2xl font-bold">{performanceData.acceptanceRate}%</p>
              </div>
              <div className={`p-2 rounded-full ${colors.buttonSecondary}`}>
                <ThumbsUp className={`h-5 w-5 ${colors.highlight}`} />
              </div>
            </div>
            <div className="mt-2 text-xs text-gray-500">
              {performanceData.acceptanceRate > 90 ? "Excellent" : "Good"}
            </div>
          </div>

          <div className={`p-4 rounded-lg ${colors.secondaryBg} border ${colors.border}`}>
            <div className="flex justify-between items-start">
              <div>
                <p className={`text-sm ${colors.secondaryText}`}>Avg. Per Hour</p>
                <p className="text-2xl font-bold">${performanceData.avgEarningsPerHour.toFixed(2)}</p>
              </div>
              <div className={`p-2 rounded-full ${colors.buttonSecondary}`}>
                <DollarSign className={`h-5 w-5 ${colors.highlight}`} />
              </div>
            </div>
            <div className="mt-2 text-xs text-gray-500">
              {performanceData.avgEarningsPerHour > 25 ? "Above average" : "Average"}
            </div>
          </div>

          <div className={`p-4 rounded-lg ${colors.secondaryBg} border ${colors.border}`}>
            <div className="flex justify-between items-start">
              <div>
                <p className={`text-sm ${colors.secondaryText}`}>Avg. Per Trip</p>
                <p className="text-2xl font-bold">${performanceData.avgEarningsPerTrip.toFixed(2)}</p>
              </div>
              <div className={`p-2 rounded-full ${colors.buttonSecondary}`}>
                <DollarSign className={`h-5 w-5 ${colors.highlight}`} />
              </div>
            </div>
            <div className="mt-2 text-xs text-gray-500">
              {performanceData.avgEarningsPerTrip > 15 ? "Above average" : "Average"}
            </div>
          </div>
        </div>

        {/* Top Performing Areas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className={`p-4 rounded-lg border ${colors.border}`}>
            <h3 className="text-lg font-medium mb-4 flex items-center">
              <MapPin className="h-5 w-5 mr-2 text-blue-500" />
              Top Performing Areas
            </h3>
            <div className="space-y-3">
              {performanceData.topAreas.map((area, index) => (
                <div key={index} className={`p-3 rounded-lg ${colors.secondaryBg}`}>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{area.name}</span>
                    <span className="text-green-600 font-medium">${area.earnings.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center mt-1 text-sm text-gray-500">
                    <span>{area.trips} trips</span>
                    <span>${(area.earnings / area.trips).toFixed(2)}/trip</span>
                  </div>
                  <div className="mt-2 w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500"
                      style={{ width: `${(area.trips / performanceData.topAreas[0].trips) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={`p-4 rounded-lg border ${colors.border}`}>
            <h3 className="text-lg font-medium mb-4 flex items-center">
              <Clock className="h-5 w-5 mr-2 text-purple-500" />
              Peak Earning Hours
            </h3>
            <div className="space-y-3">
              {performanceData.peakHours.map((peak, index) => (
                <div key={index} className={`p-3 rounded-lg ${colors.secondaryBg}`}>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{peak.time}</span>
                    <span className="text-green-600 font-medium">${peak.earnings.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center mt-1 text-sm text-gray-500">
                    <span>{peak.trips} trips</span>
                    <span>${(peak.earnings / peak.trips).toFixed(2)}/trip</span>
                  </div>
                  <div className="mt-2 w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-purple-500"
                      style={{ width: `${(peak.trips / performanceData.peakHours[0].trips) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Achievements and Feedback */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className={`p-4 rounded-lg border ${colors.border}`}>
            <h3 className="text-lg font-medium mb-4 flex items-center">
              <Award className="h-5 w-5 mr-2 text-amber-500" />
              Achievements
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {performanceData.achievements.map((achievement, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg ${achievement.earned ? "bg-amber-50 border border-amber-100" : colors.secondaryBg}`}
                >
                  <div className="flex items-start">
                    {achievement.earned ? (
                      <div className="p-1.5 bg-amber-100 rounded-full mr-2">
                        <Award className="h-4 w-4 text-amber-600" />
                      </div>
                    ) : (
                      <div className="p-1.5 bg-gray-200 rounded-full mr-2">
                        <Award className="h-4 w-4 text-gray-500" />
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-medium">{achievement.name}</p>
                      {achievement.earned ? (
                        <p className="text-xs text-gray-500">
                          Earned on {new Date(achievement.date).toLocaleDateString()}
                        </p>
                      ) : (
                        <div className="mt-1">
                          <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                            <div className="h-full bg-amber-500" style={{ width: `${achievement.progress}%` }}></div>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">{achievement.progress}% complete</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={`p-4 rounded-lg border ${colors.border}`}>
            <h3 className="text-lg font-medium mb-4 flex items-center">
              <Star className="h-5 w-5 mr-2 text-yellow-500" />
              Recent Passenger Feedback
            </h3>
            <div className="space-y-3">
              {performanceData.recentFeedback.map((feedback, index) => (
                <div key={index} className={`p-3 rounded-lg ${colors.secondaryBg}`}>
                  <div className="flex justify-between items-start">
                    <p className="text-sm">{feedback.comment}</p>
                    <div className="flex items-center ml-2">
                      <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                      <span className="text-sm ml-1">{feedback.rating}</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{new Date(feedback.date).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Improvement Tips */}
        <div className="mt-6">
          <h3 className="text-lg font-medium mb-4 flex items-center">
            <TrendingUp className="h-5 w-5 mr-2 text-green-500" />
            Performance Improvement Tips
          </h3>
          <div className={`p-4 rounded-lg ${colors.secondaryBg} border ${colors.border}`}>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="p-2 bg-green-100 rounded-full mr-3 flex-shrink-0">
                  <Clock className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="font-medium">Optimize Your Schedule</p>
                  <p className="text-sm text-gray-600 mt-1">
                    Based on your data, driving during 5-7 PM could increase your earnings by up to 15%. Consider
                    adjusting your schedule to maximize these peak hours.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="p-2 bg-blue-100 rounded-full mr-3 flex-shrink-0">
                  <MapPin className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium">Focus on High-Value Areas</p>
                  <p className="text-sm text-gray-600 mt-1">
                    Airport trips are generating your highest per-trip earnings. Consider positioning yourself near the
                    airport during morning hours to capture more of these fares.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="p-2 bg-purple-100 rounded-full mr-3 flex-shrink-0">
                  <BarChart className="h-4 w-4 text-purple-600" />
                </div>
                <div>
                  <p className="font-medium">Increase Trip Volume</p>
                  <p className="text-sm text-gray-600 mt-1">
                    Your earnings per trip are above average, but you could increase overall revenue by accepting more
                    short trips during non-peak hours instead of waiting for longer fares.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

