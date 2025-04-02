"use client"

import { useState } from "react"
import {
  Calendar,
  Clock,
  Plus,
  Trash2,
  Edit,
  Copy,
  Check,
  X,
  AlertCircle,
  Repeat,
  MapPin,
  DollarSign,
} from "lucide-react"

interface ScheduleDay {
  id: string
  day: "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday"
  startTime: string
  endTime: string
  breaks: Array<{
    id: string
    startTime: string
    endTime: string
  }>
  active: boolean
}

interface RecurringRoute {
  id: string
  name: string
  days: Array<"monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday">
  startLocation: {
    name: string
    lat: number
    lng: number
  }
  endLocation: {
    name: string
    lat: number
    lng: number
  }
  startTime: string
  estimatedEarnings: number
  active: boolean
}

interface SchedulePlannerProps {
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

export default function SchedulePlanner({ themeColors, darkMode = false }: SchedulePlannerProps) {
  const [activeTab, setActiveTab] = useState<"weekly" | "recurring">("weekly")
  const [editingDayId, setEditingDayId] = useState<string | null>(null)
  const [editingRouteId, setEditingRouteId] = useState<string | null>(null)

  // Weekly schedule state
  const [weeklySchedule, setWeeklySchedule] = useState<ScheduleDay[]>([
    {
      id: "1",
      day: "monday",
      startTime: "07:00",
      endTime: "15:00",
      breaks: [{ id: "1-1", startTime: "11:30", endTime: "12:30" }],
      active: true,
    },
    {
      id: "2",
      day: "tuesday",
      startTime: "07:00",
      endTime: "15:00",
      breaks: [{ id: "2-1", startTime: "11:30", endTime: "12:30" }],
      active: true,
    },
    {
      id: "3",
      day: "wednesday",
      startTime: "07:00",
      endTime: "15:00",
      breaks: [{ id: "3-1", startTime: "11:30", endTime: "12:30" }],
      active: true,
    },
    {
      id: "4",
      day: "thursday",
      startTime: "07:00",
      endTime: "15:00",
      breaks: [{ id: "4-1", startTime: "11:30", endTime: "12:30" }],
      active: true,
    },
    {
      id: "5",
      day: "friday",
      startTime: "15:00",
      endTime: "23:00",
      breaks: [{ id: "5-1", startTime: "18:30", endTime: "19:30" }],
      active: true,
    },
    {
      id: "6",
      day: "saturday",
      startTime: "15:00",
      endTime: "23:00",
      breaks: [{ id: "6-1", startTime: "18:30", endTime: "19:30" }],
      active: true,
    },
    {
      id: "7",
      day: "sunday",
      startTime: "09:00",
      endTime: "17:00",
      breaks: [{ id: "7-1", startTime: "12:30", endTime: "13:30" }],
      active: false,
    },
  ])

  // Recurring routes state
  const [recurringRoutes, setRecurringRoutes] = useState<RecurringRoute[]>([
    {
      id: "1",
      name: "Airport Morning Run",
      days: ["monday", "wednesday", "friday"],
      startLocation: {
        name: "Home",
        lat: 1.3644,
        lng: 103.9915,
      },
      endLocation: {
        name: "Changi Airport",
        lat: 1.3644,
        lng: 103.9915,
      },
      startTime: "05:30",
      estimatedEarnings: 35,
      active: true,
    },
    {
      id: "2",
      name: "Downtown Evening",
      days: ["monday", "tuesday", "wednesday", "thursday", "friday"],
      startLocation: {
        name: "Home",
        lat: 1.3644,
        lng: 103.9915,
      },
      endLocation: {
        name: "Downtown Core",
        lat: 1.2789,
        lng: 103.8536,
      },
      startTime: "16:00",
      estimatedEarnings: 28,
      active: true,
    },
    {
      id: "3",
      name: "Weekend Shopping Mall",
      days: ["saturday", "sunday"],
      startLocation: {
        name: "Home",
        lat: 1.3644,
        lng: 103.9915,
      },
      endLocation: {
        name: "Orchard Road",
        lat: 1.3006,
        lng: 103.8368,
      },
      startTime: "10:00",
      estimatedEarnings: 22,
      active: false,
    },
  ])

  // Editing states
  const [editingDay, setEditingDay] = useState<ScheduleDay | null>(null)
  const [editingRoute, setEditingRoute] = useState<RecurringRoute | null>(null)

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

  // Format day name
  const formatDayName = (day: string) => {
    return day.charAt(0).toUpperCase() + day.slice(1)
  }

  // Format time for display
  const formatTimeForDisplay = (time: string) => {
    const [hours, minutes] = time.split(":").map(Number)
    const period = hours >= 12 ? "PM" : "AM"
    const displayHours = hours % 12 || 12
    return `${displayHours}:${minutes.toString().padStart(2, "0")} ${period}`
  }

  // Calculate working hours
  const calculateWorkingHours = (day: ScheduleDay) => {
    const startHours = Number.parseInt(day.startTime.split(":")[0])
    const startMinutes = Number.parseInt(day.startTime.split(":")[1])
    const endHours = Number.parseInt(day.endTime.split(":")[0])
    const endMinutes = Number.parseInt(day.endTime.split(":")[1])

    let totalMinutes = endHours * 60 + endMinutes - (startHours * 60 + startMinutes)

    // Subtract break times
    day.breaks.forEach((breakTime) => {
      const breakStartHours = Number.parseInt(breakTime.startTime.split(":")[0])
      const breakStartMinutes = Number.parseInt(breakTime.startTime.split(":")[1])
      const breakEndHours = Number.parseInt(breakTime.endTime.split(":")[0])
      const breakEndMinutes = Number.parseInt(breakTime.endTime.split(":")[1])

      const breakMinutes = breakEndHours * 60 + breakEndMinutes - (breakStartHours * 60 + breakStartMinutes)
      totalMinutes -= breakMinutes
    })

    const hours = Math.floor(totalMinutes / 60)
    const minutes = totalMinutes % 60

    return `${hours}h ${minutes}m`
  }

  // Start editing a day
  const startEditingDay = (day: ScheduleDay) => {
    setEditingDayId(day.id)
    setEditingDay({ ...day })
  }

  // Save edited day
  const saveEditedDay = () => {
    if (!editingDay) return

    setWeeklySchedule(weeklySchedule.map((day) => (day.id === editingDayId ? editingDay : day)))

    setEditingDayId(null)
    setEditingDay(null)
  }

  // Cancel editing day
  const cancelEditingDay = () => {
    setEditingDayId(null)
    setEditingDay(null)
  }

  // Add break to editing day
  const addBreakToEditingDay = () => {
    if (!editingDay) return

    const newBreak = {
      id: `${editingDay.id}-${editingDay.breaks.length + 1}`,
      startTime: "12:00",
      endTime: "13:00",
    }

    setEditingDay({
      ...editingDay,
      breaks: [...editingDay.breaks, newBreak],
    })
  }

  // Remove break from editing day
  const removeBreakFromEditingDay = (breakId: string) => {
    if (!editingDay) return

    setEditingDay({
      ...editingDay,
      breaks: editingDay.breaks.filter((b) => b.id !== breakId),
    })
  }

  // Toggle day active status
  const toggleDayActive = (dayId: string) => {
    setWeeklySchedule(weeklySchedule.map((day) => (day.id === dayId ? { ...day, active: !day.active } : day)))
  }

  // Start editing a route
  const startEditingRoute = (route: RecurringRoute) => {
    setEditingRouteId(route.id)
    setEditingRoute({ ...route })
  }

  // Save edited route
  const saveEditedRoute = () => {
    if (!editingRoute) return

    setRecurringRoutes(recurringRoutes.map((route) => (route.id === editingRouteId ? editingRoute : route)))

    setEditingRouteId(null)
    setEditingRoute(null)
  }

  // Cancel editing route
  const cancelEditingRoute = () => {
    setEditingRouteId(null)
    setEditingRoute(null)
  }

  // Toggle route day
  const toggleRouteDay = (day: "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday") => {
    if (!editingRoute) return

    const days = editingRoute.days.includes(day)
      ? editingRoute.days.filter((d) => d !== day)
      : [...editingRoute.days, day]

    setEditingRoute({
      ...editingRoute,
      days,
    })
  }

  // Toggle route active status
  const toggleRouteActive = (routeId: string) => {
    setRecurringRoutes(
      recurringRoutes.map((route) => (route.id === routeId ? { ...route, active: !route.active } : route)),
    )
  }

  // Duplicate route
  const duplicateRoute = (route: RecurringRoute) => {
    const newRoute = {
      ...route,
      id: Date.now().toString(),
      name: `${route.name} (Copy)`,
      active: false,
    }

    setRecurringRoutes([...recurringRoutes, newRoute])
  }

  // Delete route
  const deleteRoute = (routeId: string) => {
    setRecurringRoutes(recurringRoutes.filter((route) => route.id !== routeId))
  }

  // Calculate weekly hours
  const calculateWeeklyHours = () => {
    let totalMinutes = 0

    weeklySchedule.forEach((day) => {
      if (!day.active) return

      const startHours = Number.parseInt(day.startTime.split(":")[0])
      const startMinutes = Number.parseInt(day.startTime.split(":")[1])
      const endHours = Number.parseInt(day.endTime.split(":")[0])
      const endMinutes = Number.parseInt(day.endTime.split(":")[1])

      let dayMinutes = endHours * 60 + endMinutes - (startHours * 60 + startMinutes)

      // Subtract break times
      day.breaks.forEach((breakTime) => {
        const breakStartHours = Number.parseInt(breakTime.startTime.split(":")[0])
        const breakStartMinutes = Number.parseInt(breakTime.startTime.split(":")[1])
        const breakEndHours = Number.parseInt(breakTime.endTime.split(":")[0])
        const breakEndMinutes = Number.parseInt(breakTime.endTime.split(":")[1])

        const breakMinutes = breakEndHours * 60 + breakEndMinutes - (breakStartHours * 60 + breakStartMinutes)
        dayMinutes -= breakMinutes
      })

      totalMinutes += dayMinutes
    })

    const hours = Math.floor(totalMinutes / 60)
    const minutes = totalMinutes % 60

    return `${hours}h ${minutes}m`
  }

  // Calculate estimated weekly earnings from recurring routes
  const calculateWeeklyRecurringEarnings = () => {
    let totalEarnings = 0

    recurringRoutes.forEach((route) => {
      if (!route.active) return
      totalEarnings += route.estimatedEarnings * route.days.length
    })

    return totalEarnings
  }

  return (
    <div className={`${colors.card} rounded-xl shadow-lg overflow-hidden`}>
      <div className={`p-6 border-b ${colors.border}`}>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-xl font-semibold flex items-center">
            <Calendar className={`mr-2 h-5 w-5 ${colors.highlight}`} />
            Schedule Planner
          </h2>

          <div className="flex rounded-lg overflow-hidden border border-gray-200">
            <button
              onClick={() => setActiveTab("weekly")}
              className={`px-3 py-1.5 text-sm ${activeTab === "weekly" ? `${colors.buttonPrimary} ${colors.buttonText}` : "bg-white"}`}
            >
              Weekly Schedule
            </button>
            <button
              onClick={() => setActiveTab("recurring")}
              className={`px-3 py-1.5 text-sm ${activeTab === "recurring" ? `${colors.buttonPrimary} ${colors.buttonText}` : "bg-white"}`}
            >
              Recurring Routes
            </button>
          </div>
        </div>
      </div>

      <div className="p-6">
        {activeTab === "weekly" ? (
          <>
            {/* Weekly Schedule Summary */}
            <div className={`p-4 rounded-lg ${colors.secondaryBg} border ${colors.border} mb-6`}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className={`text-sm ${colors.secondaryText}`}>Total Working Days</p>
                  <p className="text-2xl font-bold">{weeklySchedule.filter((day) => day.active).length}</p>
                </div>
                <div>
                  <p className={`text-sm ${colors.secondaryText}`}>Weekly Working Hours</p>
                  <p className="text-2xl font-bold">{calculateWeeklyHours()}</p>
                </div>
                <div>
                  <p className={`text-sm ${colors.secondaryText}`}>Avg. Hours Per Day</p>
                  <p className="text-2xl font-bold">
                    {weeklySchedule.filter((day) => day.active).length > 0
                      ? (
                          Number.parseInt(calculateWeeklyHours().split("h")[0]) /
                          weeklySchedule.filter((day) => day.active).length
                        ).toFixed(1) + "h"
                      : "0h"}
                  </p>
                </div>
              </div>
            </div>

            {/* Weekly Schedule */}
            <h3 className="text-lg font-medium mb-4">Weekly Working Schedule</h3>
            <div className="space-y-4">
              {weeklySchedule.map((day) => (
                <div
                  key={day.id}
                  className={`p-4 rounded-lg border ${day.active ? colors.border : "border-gray-200"} ${!day.active ? "opacity-60" : ""}`}
                >
                  {editingDayId === day.id ? (
                    // Editing mode
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium">{formatDayName(day.day)}</h4>
                        <div className="flex items-center space-x-2">
                          <button onClick={cancelEditingDay} className="p-1.5 rounded-full hover:bg-gray-100">
                            <X className="h-5 w-5 text-gray-500" />
                          </button>
                          <button onClick={saveEditedDay} className="p-1.5 rounded-full hover:bg-gray-100">
                            <Check className="h-5 w-5 text-green-500" />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className={`block text-sm ${colors.secondaryText} mb-1`}>Start Time</label>
                          <input
                            type="time"
                            value={editingDay?.startTime || ""}
                            onChange={(e) =>
                              setEditingDay((prev) => (prev ? { ...prev, startTime: e.target.value } : null))
                            }
                            className={`w-full rounded-lg h-10 border ${colors.border} px-3 focus:ring-1 focus:ring-[#e67e5a] focus:border-[#e67e5a]`}
                          />
                        </div>
                        <div>
                          <label className={`block text-sm ${colors.secondaryText} mb-1`}>End Time</label>
                          <input
                            type="time"
                            value={editingDay?.endTime || ""}
                            onChange={(e) =>
                              setEditingDay((prev) => (prev ? { ...prev, endTime: e.target.value } : null))
                            }
                            className={`w-full rounded-lg h-10 border ${colors.border} px-3 focus:ring-1 focus:ring-[#e67e5a] focus:border-[#e67e5a]`}
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <label className={`block text-sm ${colors.secondaryText}`}>Breaks</label>
                          <button
                            onClick={addBreakToEditingDay}
                            className="text-xs flex items-center text-blue-600 hover:text-blue-800"
                          >
                            <Plus className="h-3 w-3 mr-1" />
                            Add Break
                          </button>
                        </div>

                        {editingDay?.breaks.map((breakTime) => (
                          <div key={breakTime.id} className="flex items-center space-x-2 mb-2">
                            <input
                              type="time"
                              value={breakTime.startTime}
                              onChange={(e) =>
                                setEditingDay((prev) => {
                                  if (!prev) return null
                                  return {
                                    ...prev,
                                    breaks: prev.breaks.map((b) =>
                                      b.id === breakTime.id ? { ...b, startTime: e.target.value } : b,
                                    ),
                                  }
                                })
                              }
                              className={`rounded-lg h-10 border ${colors.border} px-3 focus:ring-1 focus:ring-[#e67e5a] focus:border-[#e67e5a]`}
                            />
                            <span>to</span>
                            <input
                              type="time"
                              value={breakTime.endTime}
                              onChange={(e) =>
                                setEditingDay((prev) => {
                                  if (!prev) return null
                                  return {
                                    ...prev,
                                    breaks: prev.breaks.map((b) =>
                                      b.id === breakTime.id ? { ...b, endTime: e.target.value } : b,
                                    ),
                                  }
                                })
                              }
                              className={`rounded-lg h-10 border ${colors.border} px-3 focus:ring-1 focus:ring-[#e67e5a] focus:border-[#e67e5a]`}
                            />
                            <button
                              onClick={() => removeBreakFromEditingDay(breakTime.id)}
                              className="p-1.5 rounded-full hover:bg-gray-100"
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </button>
                          </div>
                        ))}

                        {editingDay?.breaks.length === 0 && (
                          <p className="text-sm text-gray-500 italic">No breaks scheduled</p>
                        )}
                      </div>

                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id={`active-${day.id}`}
                          checked={editingDay?.active || false}
                          onChange={(e) =>
                            setEditingDay((prev) => (prev ? { ...prev, active: e.target.checked } : null))
                          }
                          className="h-4 w-4 text-[#e67e5a] focus:ring-[#e67e5a] rounded"
                        />
                        <label htmlFor={`active-${day.id}`} className="ml-2 text-sm">
                          Active
                        </label>
                      </div>
                    </div>
                  ) : (
                    // View mode
                    <div>
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium">{formatDayName(day.day)}</h4>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => toggleDayActive(day.id)}
                            className={`px-2 py-1 rounded-md text-xs ${day.active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}`}
                          >
                            {day.active ? "Active" : "Inactive"}
                          </button>
                          <button onClick={() => startEditingDay(day)} className="p-1.5 rounded-full hover:bg-gray-100">
                            <Edit className="h-4 w-4 text-gray-500" />
                          </button>
                        </div>
                      </div>

                      <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 text-gray-500 mr-2" />
                          <span className="text-sm">
                            {formatTimeForDisplay(day.startTime)} - {formatTimeForDisplay(day.endTime)}
                          </span>
                        </div>

                        <div className="flex items-center">
                          <span className="text-sm text-gray-500 mr-2">Breaks:</span>
                          {day.breaks.length > 0 ? (
                            <span className="text-sm">
                              {day.breaks.map((breakTime, index) => (
                                <span key={breakTime.id}>
                                  {formatTimeForDisplay(breakTime.startTime)} -{" "}
                                  {formatTimeForDisplay(breakTime.endTime)}
                                  {index < day.breaks.length - 1 ? ", " : ""}
                                </span>
                              ))}
                            </span>
                          ) : (
                            <span className="text-sm text-gray-500 italic">None</span>
                          )}
                        </div>

                        <div className="flex items-center">
                          <span className="text-sm text-gray-500 mr-2">Working Hours:</span>
                          <span className="text-sm font-medium">{calculateWorkingHours(day)}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Schedule Tips */}
            <div className="mt-6">
              <div className={`p-4 rounded-lg bg-blue-50 border border-blue-100 flex items-start`}>
                <AlertCircle className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-blue-700">Schedule Optimization Tips</p>
                  <p className="text-sm text-blue-600 mt-1">
                    Based on historical data, the most profitable times to drive are weekday mornings (6-9 AM) and
                    evenings (4-7 PM). Consider adjusting your schedule to maximize these peak demand periods.
                  </p>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Recurring Routes Summary */}
            <div className={`p-4 rounded-lg ${colors.secondaryBg} border ${colors.border} mb-6`}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className={`text-sm ${colors.secondaryText}`}>Active Routes</p>
                  <p className="text-2xl font-bold">{recurringRoutes.filter((route) => route.active).length}</p>
                </div>
                <div>
                  <p className={`text-sm ${colors.secondaryText}`}>Weekly Trips</p>
                  <p className="text-2xl font-bold">
                    {recurringRoutes.filter((route) => route.active).reduce((sum, route) => sum + route.days.length, 0)}
                  </p>
                </div>
                <div>
                  <p className={`text-sm ${colors.secondaryText}`}>Est. Weekly Earnings</p>
                  <p className="text-2xl font-bold text-green-600">${calculateWeeklyRecurringEarnings()}</p>
                </div>
              </div>
            </div>

            {/* Recurring Routes */}
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Recurring Routes</h3>
              <button
                onClick={() => {
                  const newRoute: RecurringRoute = {
                    id: Date.now().toString(),
                    name: "New Route",
                    days: ["monday"],
                    startLocation: {
                      name: "Home",
                      lat: 1.3644,
                      lng: 103.9915,
                    },
                    endLocation: {
                      name: "Downtown",
                      lat: 1.2789,
                      lng: 103.8536,
                    },
                    startTime: "08:00",
                    estimatedEarnings: 25,
                    active: false,
                  }
                  setRecurringRoutes([...recurringRoutes, newRoute])
                  setEditingRouteId(newRoute.id)
                  setEditingRoute(newRoute)
                }}
                className={`${colors.buttonPrimary} ${colors.buttonText} py-2 px-4 rounded-lg flex items-center`}
              >
                <Plus size={16} className="mr-1" />
                Add Route
              </button>
            </div>

            <div className="space-y-4">
              {recurringRoutes.map((route) => (
                <div
                  key={route.id}
                  className={`p-4 rounded-lg border ${route.active ? colors.border : "border-gray-200"} ${!route.active ? "opacity-60" : ""}`}
                >
                  {editingRouteId === route.id ? (
                    // Editing mode
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <input
                          type="text"
                          value={editingRoute?.name || ""}
                          onChange={(e) => setEditingRoute((prev) => (prev ? { ...prev, name: e.target.value } : null))}
                          className={`font-medium text-lg rounded-lg border ${colors.border} px-3 py-1 focus:ring-1 focus:ring-[#e67e5a] focus:border-[#e67e5a]`}
                        />
                        <div className="flex items-center space-x-2">
                          <button onClick={cancelEditingRoute} className="p-1.5 rounded-full hover:bg-gray-100">
                            <X className="h-5 w-5 text-gray-500" />
                          </button>
                          <button onClick={saveEditedRoute} className="p-1.5 rounded-full hover:bg-gray-100">
                            <Check className="h-5 w-5 text-green-500" />
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className={`block text-sm ${colors.secondaryText} mb-1`}>Active Days</label>
                        <div className="flex flex-wrap gap-2">
                          {["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"].map((day) => (
                            <button
                              key={day}
                              type="button"
                              onClick={() => toggleRouteDay(day as any)}
                              className={`px-3 py-1.5 rounded-full text-sm ${
                                editingRoute?.days.includes(day as any)
                                  ? `${colors.buttonPrimary} ${colors.buttonText}`
                                  : "bg-gray-100 text-gray-700"
                              }`}
                            >
                              {formatDayName(day)}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className={`block text-sm ${colors.secondaryText} mb-1`}>Start Location</label>
                          <input
                            type="text"
                            value={editingRoute?.startLocation.name || ""}
                            onChange={(e) =>
                              setEditingRoute((prev) =>
                                prev
                                  ? {
                                      ...prev,
                                      startLocation: { ...prev.startLocation, name: e.target.value },
                                    }
                                  : null,
                              )
                            }
                            className={`w-full rounded-lg h-10 border ${colors.border} px-3 focus:ring-1 focus:ring-[#e67e5a] focus:border-[#e67e5a]`}
                          />
                        </div>
                        <div>
                          <label className={`block text-sm ${colors.secondaryText} mb-1`}>End Location</label>
                          <input
                            type="text"
                            value={editingRoute?.endLocation.name || ""}
                            onChange={(e) =>
                              setEditingRoute((prev) =>
                                prev
                                  ? {
                                      ...prev,
                                      endLocation: { ...prev.endLocation, name: e.target.value },
                                    }
                                  : null,
                              )
                            }
                            className={`w-full rounded-lg h-10 border ${colors.border} px-3 focus:ring-1 focus:ring-[#e67e5a] focus:border-[#e67e5a]`}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className={`block text-sm ${colors.secondaryText} mb-1`}>Start Time</label>
                          <input
                            type="time"
                            value={editingRoute?.startTime || ""}
                            onChange={(e) =>
                              setEditingRoute((prev) => (prev ? { ...prev, startTime: e.target.value } : null))
                            }
                            className={`w-full rounded-lg h-10 border ${colors.border} px-3 focus:ring-1 focus:ring-[#e67e5a] focus:border-[#e67e5a]`}
                          />
                        </div>
                        <div>
                          <label className={`block text-sm ${colors.secondaryText} mb-1`}>Estimated Earnings ($)</label>
                          <input
                            type="number"
                            value={editingRoute?.estimatedEarnings || 0}
                            onChange={(e) =>
                              setEditingRoute((prev) =>
                                prev
                                  ? {
                                      ...prev,
                                      estimatedEarnings: Number.parseFloat(e.target.value) || 0,
                                    }
                                  : null,
                              )
                            }
                            className={`w-full rounded-lg h-10 border ${colors.border} px-3 focus:ring-1 focus:ring-[#e67e5a] focus:border-[#e67e5a]`}
                          />
                        </div>
                      </div>

                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id={`active-route-${route.id}`}
                          checked={editingRoute?.active || false}
                          onChange={(e) =>
                            setEditingRoute((prev) => (prev ? { ...prev, active: e.target.checked } : null))
                          }
                          className="h-4 w-4 text-[#e67e5a] focus:ring-[#e67e5a] rounded"
                        />
                        <label htmlFor={`active-route-${route.id}`} className="ml-2 text-sm">
                          Active
                        </label>
                      </div>
                    </div>
                  ) : (
                    // View mode
                    <div>
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium text-lg">{route.name}</h4>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => toggleRouteActive(route.id)}
                            className={`px-2 py-1 rounded-md text-xs ${route.active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}`}
                          >
                            {route.active ? "Active" : "Inactive"}
                          </button>
                          <button
                            onClick={() => startEditingRoute(route)}
                            className="p-1.5 rounded-full hover:bg-gray-100"
                          >
                            <Edit className="h-4 w-4 text-gray-500" />
                          </button>
                          <button
                            onClick={() => duplicateRoute(route)}
                            className="p-1.5 rounded-full hover:bg-gray-100"
                          >
                            <Copy className="h-4 w-4 text-gray-500" />
                          </button>
                          <button
                            onClick={() => deleteRoute(route.id)}
                            className="p-1.5 rounded-full hover:bg-gray-100"
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </button>
                        </div>
                      </div>

                      <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <div className="flex items-center mb-2">
                            <Repeat className="h-4 w-4 text-gray-500 mr-2" />
                            <span className="text-sm font-medium">Active Days</span>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"].map(
                              (day) => (
                                <span
                                  key={day}
                                  className={`px-2 py-0.5 rounded-full text-xs ${
                                    route.days.includes(day as any)
                                      ? `${colors.buttonSecondary} ${colors.highlight}`
                                      : "bg-gray-100 text-gray-400"
                                  }`}
                                >
                                  {formatDayName(day).substring(0, 3)}
                                </span>
                              ),
                            )}
                          </div>
                        </div>

                        <div>
                          <div className="flex items-center mb-2">
                            <Clock className="h-4 w-4 text-gray-500 mr-2" />
                            <span className="text-sm font-medium">Start Time</span>
                          </div>
                          <span className="text-sm">{formatTimeForDisplay(route.startTime)}</span>
                        </div>
                      </div>

                      <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <div className="flex items-center mb-2">
                            <MapPin className="h-4 w-4 text-gray-500 mr-2" />
                            <span className="text-sm font-medium">Route</span>
                          </div>
                          <span className="text-sm">
                            {route.startLocation.name} → {route.endLocation.name}
                          </span>
                        </div>

                        <div>
                          <div className="flex items-center mb-2">
                            <DollarSign className="h-4 w-4 text-gray-500 mr-2" />
                            <span className="text-sm font-medium">Earnings</span>
                          </div>
                          <div className="flex items-center">
                            <span className="text-sm text-green-600 font-medium">${route.estimatedEarnings}/trip</span>
                            <span className="text-sm text-gray-500 ml-2">
                              (${route.estimatedEarnings * route.days.length}/week)
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {recurringRoutes.length === 0 && (
                <div className={`p-8 rounded-lg ${colors.secondaryBg} text-center`}>
                  <p className="text-gray-500">No recurring routes yet. Add your first route to get started.</p>
                </div>
              )}
            </div>

            {/* Recurring Routes Tips */}
            <div className="mt-6">
              <div className={`p-4 rounded-lg bg-blue-50 border border-blue-100 flex items-start`}>
                <AlertCircle className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-blue-700">Recurring Routes Tips</p>
                  <p className="text-sm text-blue-600 mt-1">
                    Setting up recurring routes can help you establish a consistent schedule and income. Airport routes
                    in the early morning and business district routes during evening rush hours typically yield the
                    highest earnings.
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

