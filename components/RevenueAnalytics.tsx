"use client"

import { useState } from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { Calendar, ArrowLeft, ArrowRight, DollarSign, Clock, TrendingUp } from "lucide-react"

interface RevenueAnalyticsProps {
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

export function RevenueAnalytics({ themeColors, darkMode = false }: RevenueAnalyticsProps) {
  const [timeframe, setTimeframe] = useState<"day" | "week" | "month" | "year">("week")
  const [currentPeriod, setCurrentPeriod] = useState<number>(0) // 0 = current, -1 = previous, etc.

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

  // Generate mock data based on timeframe
  const generateData = () => {
    if (timeframe === "day") {
      return Array.from({ length: 24 }, (_, i) => {
        const hour = i % 12 === 0 ? 12 : i % 12
        const period = i < 12 ? "AM" : "PM"
        return {
          time: `${hour} ${period}`,
          earnings: Math.max(5, 25 * Math.sin(i / 3) + 40 + Math.random() * 15),
          rides: Math.floor(Math.max(0, 2 * Math.sin(i / 3) + 3 + Math.random() * 2)),
        }
      })
    } else if (timeframe === "week") {
      const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
      return days.map((day, i) => ({
        time: day,
        earnings: Math.max(50, 100 * Math.sin(i / 2) + 120 + Math.random() * 30),
        rides: Math.floor(Math.max(3, 5 * Math.sin(i / 2) + 8 + Math.random() * 4)),
      }))
    } else if (timeframe === "month") {
      return Array.from({ length: 30 }, (_, i) => ({
        time: `${i + 1}`,
        earnings: Math.max(30, 80 * Math.sin(i / 5) + 100 + Math.random() * 40),
        rides: Math.floor(Math.max(2, 4 * Math.sin(i / 5) + 7 + Math.random() * 5)),
      }))
    } else {
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
      return months.map((month, i) => ({
        time: month,
        earnings: Math.max(1500, 1000 * Math.sin(i / 2) + 2500 + Math.random() * 500),
        rides: Math.floor(Math.max(60, 50 * Math.sin(i / 2) + 150 + Math.random() * 30)),
      }))
    }
  }

  const data = generateData()

  // Calculate summary metrics
  const totalEarnings = data.reduce((sum, item) => sum + item.earnings, 0)
  const totalRides = data.reduce((sum, item) => sum + item.rides, 0)
  const avgPerRide = totalRides > 0 ? totalEarnings / totalRides : 0
  const avgPerHour =
    totalEarnings / (timeframe === "day" ? 24 : timeframe === "week" ? 7 * 8 : timeframe === "month" ? 30 * 8 : 365 * 8)

  // Generate time distribution data
  const timeDistribution = [
    { name: "Morning (6-10 AM)", value: 30 },
    { name: "Midday (10 AM-2 PM)", value: 20 },
    { name: "Afternoon (2-6 PM)", value: 25 },
    { name: "Evening (6-10 PM)", value: 15 },
    { name: "Night (10 PM-6 AM)", value: 10 },
  ]

  const COLORS = ["#e67e5a", "#8ab5ae", "#f3a183", "#a3d0c8", "#f8c9b9"]

  // Get period label
  const getPeriodLabel = () => {
    const now = new Date()
    if (timeframe === "day") {
      const date = new Date(now)
      date.setDate(date.getDate() + currentPeriod)
      return date.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })
    } else if (timeframe === "week") {
      const date = new Date(now)
      date.setDate(date.getDate() + currentPeriod * 7)
      const endDate = new Date(date)
      endDate.setDate(endDate.getDate() + 6)
      return `${date.toLocaleDateString("en-US", { month: "short", day: "numeric" })} - ${endDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`
    } else if (timeframe === "month") {
      const date = new Date(now)
      date.setMonth(date.getMonth() + currentPeriod)
      return date.toLocaleDateString("en-US", { month: "long", year: "numeric" })
    } else {
      const date = new Date(now)
      date.setFullYear(date.getFullYear() + currentPeriod)
      return date.getFullYear().toString()
    }
  }

  return (
    <div className={`${colors.card} rounded-xl shadow-lg overflow-hidden`}>
      <div className={`p-6 border-b ${colors.border}`}>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-xl font-semibold flex items-center">
            <DollarSign className={`mr-2 h-5 w-5 ${colors.highlight}`} />
            Revenue Analytics
          </h2>

          <div className="flex flex-wrap gap-2">
            <div className="flex rounded-lg overflow-hidden border border-gray-200">
              <button
                onClick={() => setTimeframe("day")}
                className={`px-3 py-1.5 text-sm ${timeframe === "day" ? `${colors.buttonPrimary} ${colors.buttonText}` : "bg-white"}`}
              >
                Day
              </button>
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

            <div className="flex items-center rounded-lg overflow-hidden border border-gray-200">
              <button
                onClick={() => setCurrentPeriod(currentPeriod - 1)}
                className="px-2 py-1.5 bg-white hover:bg-gray-50"
              >
                <ArrowLeft size={16} />
              </button>
              <div className="px-3 py-1.5 bg-white flex items-center">
                <Calendar size={14} className="mr-2 text-gray-500" />
                <span className="text-sm">{getPeriodLabel()}</span>
              </div>
              <button
                onClick={() => setCurrentPeriod(currentPeriod + 1 > 0 ? 0 : currentPeriod + 1)}
                className="px-2 py-1.5 bg-white hover:bg-gray-50"
                disabled={currentPeriod === 0}
              >
                <ArrowRight size={16} className={currentPeriod === 0 ? "text-gray-300" : ""} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className={`p-4 rounded-lg ${colors.secondaryBg} border ${colors.border}`}>
            <div className="flex justify-between items-start">
              <div>
                <p className={`text-sm ${colors.secondaryText}`}>Total Earnings</p>
                <p className="text-2xl font-bold text-green-600">${totalEarnings.toFixed(2)}</p>
              </div>
              <div className={`p-2 rounded-full ${colors.buttonSecondary}`}>
                <DollarSign className={`h-5 w-5 ${colors.highlight}`} />
              </div>
            </div>
            <div className="mt-2 text-xs text-gray-500">
              {currentPeriod === 0 ? "Current" : "Past"} {timeframe}
            </div>
          </div>

          <div className={`p-4 rounded-lg ${colors.secondaryBg} border ${colors.border}`}>
            <div className="flex justify-between items-start">
              <div>
                <p className={`text-sm ${colors.secondaryText}`}>Total Rides</p>
                <p className="text-2xl font-bold">{totalRides}</p>
              </div>
              <div className={`p-2 rounded-full ${colors.buttonSecondary}`}>
                <TrendingUp className={`h-5 w-5 ${colors.highlight}`} />
              </div>
            </div>
            <div className="mt-2 text-xs text-gray-500">
              {currentPeriod === 0 ? "Current" : "Past"} {timeframe}
            </div>
          </div>

          <div className={`p-4 rounded-lg ${colors.secondaryBg} border ${colors.border}`}>
            <div className="flex justify-between items-start">
              <div>
                <p className={`text-sm ${colors.secondaryText}`}>Avg. Per Ride</p>
                <p className="text-2xl font-bold">${avgPerRide.toFixed(2)}</p>
              </div>
              <div className={`p-2 rounded-full ${colors.buttonSecondary}`}>
                <DollarSign className={`h-5 w-5 ${colors.highlight}`} />
              </div>
            </div>
            <div className="mt-2 text-xs text-gray-500">{avgPerRide > 15 ? "Above average" : "Below average"}</div>
          </div>

          <div className={`p-4 rounded-lg ${colors.secondaryBg} border ${colors.border}`}>
            <div className="flex justify-between items-start">
              <div>
                <p className={`text-sm ${colors.secondaryText}`}>Avg. Per Hour</p>
                <p className="text-2xl font-bold">${avgPerHour.toFixed(2)}</p>
              </div>
              <div className={`p-2 rounded-full ${colors.buttonSecondary}`}>
                <Clock className={`h-5 w-5 ${colors.highlight}`} />
              </div>
            </div>
            <div className="mt-2 text-xs text-gray-500">{avgPerHour > 20 ? "Above average" : "Below average"}</div>
          </div>
        </div>

        {/* Main Chart */}
        <div className={`p-4 rounded-lg border ${colors.border} mb-6`}>
          <h3 className="text-lg font-medium mb-4">Earnings Overview</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#444" : "#eee"} />
                <XAxis dataKey="time" tick={{ fill: darkMode ? "#ccc" : "#666" }} />
                <YAxis tick={{ fill: darkMode ? "#ccc" : "#666" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: darkMode ? "#333" : "#fff",
                    borderColor: darkMode ? "#555" : "#ddd",
                    color: darkMode ? "#eee" : "#333",
                  }}
                />
                <Legend />
                <Bar dataKey="earnings" name="Earnings ($)" fill="#e67e5a" />
                <Line type="monotone" dataKey="rides" name="Rides" stroke="#8ab5ae" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Additional Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className={`p-4 rounded-lg border ${colors.border}`}>
            <h3 className="text-lg font-medium mb-4">Earnings by Time of Day</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={timeDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {timeDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => [`${value}%`, "Percentage"]}
                    contentStyle={{
                      backgroundColor: darkMode ? "#333" : "#fff",
                      borderColor: darkMode ? "#555" : "#ddd",
                      color: darkMode ? "#eee" : "#333",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className={`p-4 rounded-lg border ${colors.border}`}>
            <h3 className="text-lg font-medium mb-4">Rides vs. Earnings Trend</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#444" : "#eee"} />
                  <XAxis dataKey="time" tick={{ fill: darkMode ? "#ccc" : "#666" }} />
                  <YAxis yAxisId="left" tick={{ fill: darkMode ? "#ccc" : "#666" }} />
                  <YAxis yAxisId="right" orientation="right" tick={{ fill: darkMode ? "#ccc" : "#666" }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: darkMode ? "#333" : "#fff",
                      borderColor: darkMode ? "#555" : "#ddd",
                      color: darkMode ? "#eee" : "#333",
                    }}
                  />
                  <Legend />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="earnings"
                    name="Earnings ($)"
                    stroke="#e67e5a"
                    activeDot={{ r: 8 }}
                  />
                  <Line yAxisId="right" type="monotone" dataKey="rides" name="Rides" stroke="#8ab5ae" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

