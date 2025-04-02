"use client"

import { useState, useEffect } from "react"
import { Bell, X, Info, AlertTriangle, Check } from "lucide-react"

interface NotificationsProps {
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
}

interface Notification {
  id: number
  type: "info" | "warning" | "success"
  title: string
  message: string
  time: string
  read: boolean
}

export function Notifications({ onClose, themeColors }: NotificationsProps) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [filter, setFilter] = useState<"all" | "unread">("all")

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

  // Mock notifications data
  useEffect(() => {
    const mockNotifications: Notification[] = [
      {
        id: 1,
        type: "success",
        title: "Route Completed",
        message: "You have successfully completed your route with 8 stops and earned $92.50.",
        time: "2 hours ago",
        read: false,
      },
      {
        id: 2,
        type: "info",
        title: "New Feature Available",
        message: "Try our new AI-powered route suggestions for even better earnings optimization.",
        time: "1 day ago",
        read: false,
      },
      {
        id: 3,
        type: "warning",
        title: "High Traffic Alert",
        message: "Heavy traffic detected on your usual route. Consider alternative paths for better efficiency.",
        time: "2 days ago",
        read: true,
      },
      {
        id: 4,
        type: "info",
        title: "Weekly Summary",
        message: "Your weekly earnings report is now available. You earned 15% more than last week!",
        time: "5 days ago",
        read: true,
      },
      {
        id: 5,
        type: "success",
        title: "Achievement Unlocked",
        message: "Congratulations! You've completed 50 routes with RideOptimizer.",
        time: "1 week ago",
        read: true,
      },
    ]

    setNotifications(mockNotifications)
  }, [])

  const markAsRead = (id: number) => {
    setNotifications(
      notifications.map((notification) => (notification.id === id ? { ...notification, read: true } : notification)),
    )
  }

  const markAllAsRead = () => {
    setNotifications(notifications.map((notification) => ({ ...notification, read: true })))
  }

  const deleteNotification = (id: number) => {
    setNotifications(notifications.filter((notification) => notification.id !== id))
  }

  const filteredNotifications =
    filter === "all" ? notifications : notifications.filter((notification) => !notification.read)

  const unreadCount = notifications.filter((notification) => !notification.read).length

  const getNotificationIcon = (type: "info" | "warning" | "success") => {
    switch (type) {
      case "info":
        return <Info className="h-5 w-5 text-blue-500" />
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-amber-500" />
      case "success":
        return <Check className="h-5 w-5 text-green-500" />
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className={`${colors.card} w-full max-w-md max-h-[90vh] rounded-xl shadow-lg overflow-hidden`}>
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <div className="flex items-center">
            <Bell className={`h-5 w-5 mr-2 ${colors.highlight}`} />
            <h2 className="text-lg font-semibold">Notifications</h2>
            {unreadCount > 0 && (
              <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${colors.buttonPrimary} ${colors.buttonText}`}>
                {unreadCount} new
              </span>
            )}
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <div className="flex space-x-2">
            <button
              onClick={() => setFilter("all")}
              className={`px-3 py-1 text-sm rounded-full ${
                filter === "all"
                  ? `${colors.buttonPrimary} ${colors.buttonText}`
                  : `${colors.secondaryBg} ${colors.text}`
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter("unread")}
              className={`px-3 py-1 text-sm rounded-full ${
                filter === "unread"
                  ? `${colors.buttonPrimary} ${colors.buttonText}`
                  : `${colors.secondaryBg} ${colors.text}`
              }`}
            >
              Unread
            </button>
          </div>

          {unreadCount > 0 && (
            <button onClick={markAllAsRead} className="text-sm text-blue-600 hover:underline">
              Mark all as read
            </button>
          )}
        </div>

        <div className="overflow-y-auto max-h-[60vh]">
          {filteredNotifications.length === 0 ? (
            <div className="p-8 text-center">
              <Bell className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p className={`${colors.secondaryText}`}>No notifications to display</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 ${!notification.read ? "bg-blue-50" : ""}`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex">
                    <div className="mr-3 mt-1">{getNotificationIcon(notification.type)}</div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h3 className="font-medium">{notification.title}</h3>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            deleteNotification(notification.id)
                          }}
                          className="p-1 rounded-full hover:bg-gray-200"
                        >
                          <X className="h-4 w-4 text-gray-400" />
                        </button>
                      </div>
                      <p className={`text-sm ${colors.secondaryText} mt-1`}>{notification.message}</p>
                      <p className="text-xs text-gray-400 mt-2">{notification.time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className={`w-full py-2 rounded-lg ${colors.buttonSecondary} ${colors.highlight} font-medium`}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

