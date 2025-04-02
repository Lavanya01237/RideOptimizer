"use client"

import { useState, useEffect } from "react"
import { Cloud, CloudRain, Sun, Wind, Snowflake, CloudLightning, AlertTriangle, Car, MapPin } from "lucide-react"

interface WeatherTrafficProps {
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
  location?: { lat: number; lng: number }
}

interface WeatherForecast {
  time: string
  condition: "sunny" | "cloudy" | "rainy" | "snowy" | "stormy" | "windy"
  temperature: number
  precipitation: number
  windSpeed: number
  drivingCondition: "excellent" | "good" | "moderate" | "poor" | "severe"
}

interface TrafficPrediction {
  time: string
  congestionLevel: number // 0-100
  incidents: number
  expectedDelay: number // minutes
  alternateRouteAvailable: boolean
}

export function WeatherTraffic({
  themeColors,
  darkMode = false,
  location = { lat: 1.3521, lng: 103.8198 },
}: WeatherTrafficProps) {
  const [weatherData, setWeatherData] = useState<WeatherForecast[]>([])
  const [trafficData, setTrafficData] = useState<TrafficPrediction[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<"weather" | "traffic">("weather")
  const [selectedDay, setSelectedDay] = useState<"today" | "tomorrow" | "week">("today")

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

  // Mock data generation
  useEffect(() => {
    setIsLoading(true)

    // Generate weather data
    const generateWeatherData = () => {
      const conditions: Array<"sunny" | "cloudy" | "rainy" | "snowy" | "stormy" | "windy"> = [
        "sunny",
        "cloudy",
        "rainy",
        "snowy",
        "stormy",
        "windy",
      ]
      const drivingConditions: Array<"excellent" | "good" | "moderate" | "poor" | "severe"> = [
        "excellent",
        "good",
        "moderate",
        "poor",
        "severe",
      ]

      const now = new Date()
      const data: WeatherForecast[] = []

      // Generate hourly forecasts
      for (let i = 0; i < 24; i++) {
        const forecastTime = new Date(now)
        forecastTime.setHours(now.getHours() + i)

        // More realistic weather patterns
        const hourOfDay = forecastTime.getHours()
        let conditionProbabilities: Record<string, number> = {}

        // Morning tends to be clearer
        if (hourOfDay >= 6 && hourOfDay <= 10) {
          conditionProbabilities = { sunny: 0.5, cloudy: 0.3, rainy: 0.1, windy: 0.1, snowy: 0, stormy: 0 }
        }
        // Afternoon has more varied weather
        else if (hourOfDay >= 11 && hourOfDay <= 16) {
          conditionProbabilities = { sunny: 0.3, cloudy: 0.4, rainy: 0.2, windy: 0.05, snowy: 0, stormy: 0.05 }
        }
        // Evening tends to cool down
        else if (hourOfDay >= 17 && hourOfDay <= 21) {
          conditionProbabilities = { sunny: 0.2, cloudy: 0.5, rainy: 0.2, windy: 0.1, snowy: 0, stormy: 0 }
        }
        // Night is more cloudy
        else {
          conditionProbabilities = { sunny: 0.1, cloudy: 0.6, rainy: 0.2, windy: 0.05, snowy: 0, stormy: 0.05 }
        }

        // Determine condition based on probabilities
        const rand = Math.random()
        let cumulativeProbability = 0
        let condition: "sunny" | "cloudy" | "rainy" | "snowy" | "stormy" | "windy" = "sunny"

        for (const [cond, prob] of Object.entries(conditionProbabilities)) {
          cumulativeProbability += prob
          if (rand <= cumulativeProbability) {
            condition = cond as any
            break
          }
        }

        // Temperature based on time of day and condition
        let baseTemp = 75 // Base temperature in Fahrenheit
        if (hourOfDay >= 12 && hourOfDay <= 16) baseTemp += 10 // Warmer in afternoon
        if (hourOfDay >= 0 && hourOfDay <= 5) baseTemp -= 15 // Cooler at night

        // Adjust for weather condition
        if (condition === "rainy") baseTemp -= 5
        if (condition === "snowy") baseTemp -= 20
        if (condition === "cloudy") baseTemp -= 3
        if (condition === "stormy") baseTemp -= 8

        // Add some randomness
        const temperature = baseTemp + (Math.random() * 4 - 2)

        // Precipitation based on condition
        let precipitation = 0
        if (condition === "rainy") precipitation = 30 + Math.random() * 70
        if (condition === "snowy") precipitation = 20 + Math.random() * 50
        if (condition === "stormy") precipitation = 60 + Math.random() * 40
        if (condition === "cloudy") precipitation = Math.random() * 20

        // Wind speed
        let windSpeed = 5 + Math.random() * 5
        if (condition === "windy") windSpeed = 15 + Math.random() * 20
        if (condition === "stormy") windSpeed = 20 + Math.random() * 30

        // Driving condition based on weather
        let drivingCondition: "excellent" | "good" | "moderate" | "poor" | "severe"
        if (condition === "sunny" && precipitation < 10 && windSpeed < 10) {
          drivingCondition = "excellent"
        } else if ((condition === "sunny" || condition === "cloudy") && precipitation < 30 && windSpeed < 15) {
          drivingCondition = "good"
        } else if ((condition === "rainy" || condition === "cloudy") && precipitation < 50 && windSpeed < 20) {
          drivingCondition = "moderate"
        } else if ((condition === "rainy" || condition === "snowy") && precipitation < 70 && windSpeed < 30) {
          drivingCondition = "poor"
        } else {
          drivingCondition = "severe"
        }

        data.push({
          time: forecastTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          condition,
          temperature: Math.round(temperature),
          precipitation: Math.round(precipitation),
          windSpeed: Math.round(windSpeed),
          drivingCondition,
        })
      }

      return data
    }

    // Generate traffic data
    const generateTrafficData = () => {
      const now = new Date()
      const data: TrafficPrediction[] = []

      // Generate hourly predictions
      for (let i = 0; i < 24; i++) {
        const predictionTime = new Date(now)
        predictionTime.setHours(now.getHours() + i)

        const hourOfDay = predictionTime.getHours()

        // Traffic patterns based on time of day
        let baseCongestion = 30 // Base congestion level

        // Morning rush hour
        if (hourOfDay >= 7 && hourOfDay <= 9) {
          baseCongestion = 70 + Math.random() * 20
        }
        // Evening rush hour
        else if (hourOfDay >= 17 && hourOfDay <= 19) {
          baseCongestion = 80 + Math.random() * 20
        }
        // Lunch time
        else if (hourOfDay >= 12 && hourOfDay <= 13) {
          baseCongestion = 50 + Math.random() * 20
        }
        // Late night
        else if (hourOfDay >= 22 || hourOfDay <= 5) {
          baseCongestion = 10 + Math.random() * 15
        }

        // Weekend adjustment (assuming current day is a weekday)
        const dayOfWeek = predictionTime.getDay()
        if (dayOfWeek === 0 || dayOfWeek === 6) {
          baseCongestion *= 0.7 // Less traffic on weekends
        }

        // Number of incidents correlates with congestion
        const incidents = Math.floor(baseCongestion / 20)

        // Expected delay based on congestion
        const expectedDelay = Math.round((baseCongestion / 100) * 45) // Max 45 min delay at 100% congestion

        // Alternate routes more likely available during high congestion
        const alternateRouteAvailable = Math.random() < baseCongestion / 100

        data.push({
          time: predictionTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          congestionLevel: Math.round(baseCongestion),
          incidents,
          expectedDelay,
          alternateRouteAvailable,
        })
      }

      return data
    }

    // Set the generated data
    setTimeout(() => {
      setWeatherData(generateWeatherData())
      setTrafficData(generateTrafficData())
      setIsLoading(false)
    }, 1000)
  }, [selectedDay])

  // Get weather icon based on condition
  const getWeatherIcon = (condition: string, size = 24) => {
    switch (condition) {
      case "sunny":
        return <Sun size={size} className="text-yellow-500" />
      case "cloudy":
        return <Cloud size={size} className="text-gray-500" />
      case "rainy":
        return <CloudRain size={size} className="text-blue-500" />
      case "snowy":
        return <Snowflake size={size} className="text-blue-300" />
      case "stormy":
        return <CloudLightning size={size} className="text-purple-500" />
      case "windy":
        return <Wind size={size} className="text-teal-500" />
      default:
        return <Cloud size={size} className="text-gray-500" />
    }
  }

  // Get traffic congestion color
  const getTrafficColor = (level: number) => {
    if (level < 30) return "bg-green-500"
    if (level < 60) return "bg-yellow-500"
    if (level < 80) return "bg-orange-500"
    return "bg-red-500"
  }

  // Get driving condition color and text
  const getDrivingConditionInfo = (condition: string) => {
    switch (condition) {
      case "excellent":
        return { color: "text-green-500", text: "Excellent driving conditions" }
      case "good":
        return { color: "text-green-400", text: "Good driving conditions" }
      case "moderate":
        return { color: "text-yellow-500", text: "Moderate driving conditions" }
      case "poor":
        return { color: "text-orange-500", text: "Poor driving conditions" }
      case "severe":
        return { color: "text-red-500", text: "Severe driving conditions" }
      default:
        return { color: "text-gray-500", text: "Unknown conditions" }
    }
  }

  return (
    <div className={`${colors.card} rounded-xl shadow-lg overflow-hidden`}>
      <div className={`p-6 border-b ${colors.border}`}>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-xl font-semibold flex items-center">
            {activeTab === "weather" ? (
              <Cloud className={`mr-2 h-5 w-5 ${colors.highlight}`} />
            ) : (
              <Car className={`mr-2 h-5 w-5 ${colors.highlight}`} />
            )}
            {activeTab === "weather" ? "Weather Forecast" : "Traffic Prediction"}
          </h2>

          <div className="flex flex-wrap gap-2">
            <div className="flex rounded-lg overflow-hidden border border-gray-200">
              <button
                onClick={() => setActiveTab("weather")}
                className={`px-3 py-1.5 text-sm ${activeTab === "weather" ? `${colors.buttonPrimary} ${colors.buttonText}` : "bg-white"}`}
              >
                Weather
              </button>
              <button
                onClick={() => setActiveTab("traffic")}
                className={`px-3 py-1.5 text-sm ${activeTab === "traffic" ? `${colors.buttonPrimary} ${colors.buttonText}` : "bg-white"}`}
              >
                Traffic
              </button>
            </div>

            <div className="flex rounded-lg overflow-hidden border border-gray-200">
              <button
                onClick={() => setSelectedDay("today")}
                className={`px-3 py-1.5 text-sm ${selectedDay === "today" ? `${colors.buttonPrimary} ${colors.buttonText}` : "bg-white"}`}
              >
                Today
              </button>
              <button
                onClick={() => setSelectedDay("tomorrow")}
                className={`px-3 py-1.5 text-sm ${selectedDay === "tomorrow" ? `${colors.buttonPrimary} ${colors.buttonText}` : "bg-white"}`}
              >
                Tomorrow
              </button>
              <button
                onClick={() => setSelectedDay("week")}
                className={`px-3 py-1.5 text-sm ${selectedDay === "week" ? `${colors.buttonPrimary} ${colors.buttonText}` : "bg-white"}`}
              >
                Week
              </button>
            </div>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="p-12 flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#e67e5a]"></div>
        </div>
      ) : (
        <div className="p-6">
          {/* Location */}
          <div className="mb-6 flex items-center">
            <MapPin className="h-5 w-5 text-gray-500 mr-2" />
            <span className="text-sm text-gray-600">
              {location ? `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}` : "Current Location"}
            </span>
          </div>

          {activeTab === "weather" ? (
            <>
              {/* Current Weather Summary */}
              <div className={`p-6 rounded-lg ${colors.secondaryBg} border ${colors.border} mb-6`}>
                <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                  <div className="flex flex-col items-center">
                    {getWeatherIcon(weatherData[0]?.condition || "cloudy", 64)}
                    <span className="text-3xl font-bold mt-2">{weatherData[0]?.temperature}°F</span>
                    <span className="text-sm capitalize">{weatherData[0]?.condition}</span>
                  </div>

                  <div className="flex-1 grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Precipitation</p>
                      <p className="text-lg font-medium">{weatherData[0]?.precipitation}%</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Wind Speed</p>
                      <p className="text-lg font-medium">{weatherData[0]?.windSpeed} mph</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-sm text-gray-500">Driving Conditions</p>
                      <p
                        className={`text-lg font-medium ${getDrivingConditionInfo(weatherData[0]?.drivingCondition || "moderate").color}`}
                      >
                        {getDrivingConditionInfo(weatherData[0]?.drivingCondition || "moderate").text}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Driving recommendation */}
                {(weatherData[0]?.drivingCondition === "poor" || weatherData[0]?.drivingCondition === "severe") && (
                  <div className="mt-4 p-3 bg-red-50 border border-red-100 rounded-lg flex items-start">
                    <AlertTriangle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-red-700">Driving Alert</p>
                      <p className="text-xs text-red-600">
                        {weatherData[0]?.drivingCondition === "severe"
                          ? "Hazardous driving conditions. Consider postponing non-essential travel."
                          : "Poor driving conditions. Drive with caution and allow extra time."}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Hourly Forecast */}
              <h3 className="text-lg font-medium mb-4">Hourly Forecast</h3>
              <div className="overflow-x-auto pb-2">
                <div className="flex space-x-4 min-w-max">
                  {weatherData.slice(0, 12).map((forecast, index) => (
                    <div
                      key={index}
                      className={`p-4 rounded-lg ${colors.secondaryBg} border ${colors.border} min-w-[100px] text-center`}
                    >
                      <p className="text-sm font-medium mb-2">{forecast.time}</p>
                      <div className="flex justify-center mb-2">{getWeatherIcon(forecast.condition)}</div>
                      <p className="text-lg font-bold">{forecast.temperature}°F</p>
                      <p className="text-xs text-gray-500 mt-1">{forecast.precipitation}% precip</p>
                      <div
                        className={`mt-2 w-full h-1 rounded-full ${getDrivingConditionInfo(forecast.drivingCondition).color.replace("text-", "bg-")}`}
                      ></div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Driving Conditions Summary */}
              <div className="mt-6">
                <h3 className="text-lg font-medium mb-4">Driving Conditions Summary</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Morning */}
                  <div className={`p-4 rounded-lg border ${colors.border}`}>
                    <h4 className="font-medium mb-2">Morning (6 AM - 12 PM)</h4>
                    <div className="flex items-center">
                      {getWeatherIcon(
                        weatherData.find((w) => {
                          const hour = Number.parseInt(w.time.split(":")[0])
                          return hour >= 6 && hour < 12
                        })?.condition || "sunny",
                      )}
                      <div className="ml-3">
                        <p className="text-sm">
                          {(() => {
                            const morningForecasts = weatherData.filter((w) => {
                              const hour = Number.parseInt(w.time.split(":")[0])
                              return hour >= 6 && hour < 12
                            })

                            const worstCondition = morningForecasts.reduce((worst, current) => {
                              const conditions = ["excellent", "good", "moderate", "poor", "severe"]
                              const worstIndex = conditions.indexOf(worst.drivingCondition)
                              const currentIndex = conditions.indexOf(current.drivingCondition)
                              return currentIndex > worstIndex ? current : worst
                            }, morningForecasts[0] || { drivingCondition: "good" })

                            return getDrivingConditionInfo(worstCondition.drivingCondition).text
                          })()}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Afternoon */}
                  <div className={`p-4 rounded-lg border ${colors.border}`}>
                    <h4 className="font-medium mb-2">Afternoon (12 PM - 6 PM)</h4>
                    <div className="flex items-center">
                      {getWeatherIcon(
                        weatherData.find((w) => {
                          const hour = Number.parseInt(w.time.split(":")[0])
                          return hour >= 12 && hour < 18
                        })?.condition || "sunny",
                      )}
                      <div className="ml-3">
                        <p className="text-sm">
                          {(() => {
                            const afternoonForecasts = weatherData.filter((w) => {
                              const hour = Number.parseInt(w.time.split(":")[0])
                              return hour >= 12 && hour < 18
                            })

                            const worstCondition = afternoonForecasts.reduce((worst, current) => {
                              const conditions = ["excellent", "good", "moderate", "poor", "severe"]
                              const worstIndex = conditions.indexOf(worst.drivingCondition)
                              const currentIndex = conditions.indexOf(current.drivingCondition)
                              return currentIndex > worstIndex ? current : worst
                            }, afternoonForecasts[0] || { drivingCondition: "good" })

                            return getDrivingConditionInfo(worstCondition.drivingCondition).text
                          })()}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Evening */}
                  <div className={`p-4 rounded-lg border ${colors.border}`}>
                    <h4 className="font-medium mb-2">Evening (6 PM - 12 AM)</h4>
                    <div className="flex items-center">
                      {getWeatherIcon(
                        weatherData.find((w) => {
                          const hour = Number.parseInt(w.time.split(":")[0])
                          return hour >= 18 && hour < 24
                        })?.condition || "cloudy",
                      )}
                      <div className="ml-3">
                        <p className="text-sm">
                          {(() => {
                            const eveningForecasts = weatherData.filter((w) => {
                              const hour = Number.parseInt(w.time.split(":")[0])
                              return hour >= 18 && hour < 24
                            })

                            const worstCondition = eveningForecasts.reduce((worst, current) => {
                              const conditions = ["excellent", "good", "moderate", "poor", "severe"]
                              const worstIndex = conditions.indexOf(worst.drivingCondition)
                              const currentIndex = conditions.indexOf(current.drivingCondition)
                              return currentIndex > worstIndex ? current : worst
                            }, eveningForecasts[0] || { drivingCondition: "good" })

                            return getDrivingConditionInfo(worstCondition.drivingCondition).text
                          })()}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Night */}
                  <div className={`p-4 rounded-lg border ${colors.border}`}>
                    <h4 className="font-medium mb-2">Night (12 AM - 6 AM)</h4>
                    <div className="flex items-center">
                      {getWeatherIcon(
                        weatherData.find((w) => {
                          const hour = Number.parseInt(w.time.split(":")[0])
                          return hour >= 0 && hour < 6
                        })?.condition || "cloudy",
                      )}
                      <div className="ml-3">
                        <p className="text-sm">
                          {(() => {
                            const nightForecasts = weatherData.filter((w) => {
                              const hour = Number.parseInt(w.time.split(":")[0])
                              return hour >= 0 && hour < 6
                            })

                            const worstCondition = nightForecasts.reduce((worst, current) => {
                              const conditions = ["excellent", "good", "moderate", "poor", "severe"]
                              const worstIndex = conditions.indexOf(worst.drivingCondition)
                              const currentIndex = conditions.indexOf(current.drivingCondition)
                              return currentIndex > worstIndex ? current : worst
                            }, nightForecasts[0] || { drivingCondition: "good" })

                            return getDrivingConditionInfo(worstCondition.drivingCondition).text
                          })()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Current Traffic Summary */}
              <div className={`p-6 rounded-lg ${colors.secondaryBg} border ${colors.border} mb-6`}>
                <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-24 h-24 rounded-full flex items-center justify-center ${getTrafficColor(trafficData[0]?.congestionLevel || 0)}`}
                    >
                      <span className="text-3xl font-bold text-white">{trafficData[0]?.congestionLevel}%</span>
                    </div>
                    <span className="text-sm mt-2">Congestion Level</span>
                  </div>

                  <div className="flex-1 grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Current Delay</p>
                      <p className="text-lg font-medium">{trafficData[0]?.expectedDelay} min</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Incidents</p>
                      <p className="text-lg font-medium">{trafficData[0]?.incidents}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-sm text-gray-500">Alternate Routes</p>
                      <p className="text-lg font-medium">
                        {trafficData[0]?.alternateRouteAvailable ? (
                          <span className="text-green-500">Available</span>
                        ) : (
                          <span className="text-gray-500">Not available</span>
                        )}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Traffic recommendation */}
                {trafficData[0]?.congestionLevel > 70 && (
                  <div className="mt-4 p-3 bg-orange-50 border border-orange-100 rounded-lg flex items-start">
                    <AlertTriangle className="h-5 w-5 text-orange-500 mr-2 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-orange-700">Heavy Traffic Alert</p>
                      <p className="text-xs text-orange-600">
                        {trafficData[0]?.alternateRouteAvailable
                          ? "Consider taking an alternate route to avoid delays."
                          : "Expect significant delays. Plan extra travel time."}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Hourly Traffic Forecast */}
              <h3 className="text-lg font-medium mb-4">Hourly Traffic Forecast</h3>
              <div className="overflow-x-auto pb-2">
                <div className="flex space-x-4 min-w-max">
                  {trafficData.slice(0, 12).map((forecast, index) => (
                    <div
                      key={index}
                      className={`p-4 rounded-lg ${colors.secondaryBg} border ${colors.border} min-w-[100px] text-center`}
                    >
                      <p className="text-sm font-medium mb-2">{forecast.time}</p>
                      <div className="flex justify-center items-center mb-2">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center ${getTrafficColor(forecast.congestionLevel)}`}
                        >
                          <span className="text-xs font-bold text-white">{forecast.congestionLevel}%</span>
                        </div>
                      </div>
                      <p className="text-sm font-medium">{forecast.expectedDelay} min</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {forecast.incidents} incident{forecast.incidents !== 1 ? "s" : ""}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Traffic Patterns Summary */}
              <div className="mt-6">
                <h3 className="text-lg font-medium mb-4">Traffic Patterns Summary</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Morning Rush */}
                  <div className={`p-4 rounded-lg border ${colors.border}`}>
                    <h4 className="font-medium mb-2">Morning Rush (7 AM - 9 AM)</h4>
                    <div className="flex items-center">
                      <div
                        className={`w-6 h-6 rounded-full ${getTrafficColor(
                          trafficData
                            .filter((t) => {
                              const hour = Number.parseInt(t.time.split(":")[0])
                              return hour >= 7 && hour <= 9
                            })
                            .reduce((sum, t) => sum + t.congestionLevel, 0) /
                            Math.max(
                              1,
                              trafficData.filter((t) => {
                                const hour = Number.parseInt(t.time.split(":")[0])
                                return hour >= 7 && hour <= 9
                              }).length,
                            ),
                        )}`}
                      ></div>
                      <div className="ml-3">
                        <p className="text-sm">
                          {(() => {
                            const avgCongestion =
                              trafficData
                                .filter((t) => {
                                  const hour = Number.parseInt(t.time.split(":")[0])
                                  return hour >= 7 && hour <= 9
                                })
                                .reduce((sum, t) => sum + t.congestionLevel, 0) /
                              Math.max(
                                1,
                                trafficData.filter((t) => {
                                  const hour = Number.parseInt(t.time.split(":")[0])
                                  return hour >= 7 && hour <= 9
                                }).length,
                              )

                            if (avgCongestion > 80) return "Severe congestion expected"
                            if (avgCongestion > 60) return "Heavy traffic expected"
                            if (avgCongestion > 40) return "Moderate traffic expected"
                            return "Light traffic expected"
                          })()}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Midday */}
                  <div className={`p-4 rounded-lg border ${colors.border}`}>
                    <h4 className="font-medium mb-2">Midday (10 AM - 3 PM)</h4>
                    <div className="flex items-center">
                      <div
                        className={`w-6 h-6 rounded-full ${getTrafficColor(
                          trafficData
                            .filter((t) => {
                              const hour = Number.parseInt(t.time.split(":")[0])
                              return hour >= 10 && hour <= 15
                            })
                            .reduce((sum, t) => sum + t.congestionLevel, 0) /
                            Math.max(
                              1,
                              trafficData.filter((t) => {
                                const hour = Number.parseInt(t.time.split(":")[0])
                                return hour >= 10 && hour <= 15
                              }).length,
                            ),
                        )}`}
                      ></div>
                      <div className="ml-3">
                        <p className="text-sm">
                          {(() => {
                            const avgCongestion =
                              trafficData
                                .filter((t) => {
                                  const hour = Number.parseInt(t.time.split(":")[0])
                                  return hour >= 10 && hour <= 15
                                })
                                .reduce((sum, t) => sum + t.congestionLevel, 0) /
                              Math.max(
                                1,
                                trafficData.filter((t) => {
                                  const hour = Number.parseInt(t.time.split(":")[0])
                                  return hour >= 10 && hour <= 15
                                }).length,
                              )

                            if (avgCongestion > 80) return "Severe congestion expected"
                            if (avgCongestion > 60) return "Heavy traffic expected"
                            if (avgCongestion > 40) return "Moderate traffic expected"
                            return "Light traffic expected"
                          })()}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Evening Rush */}
                  <div className={`p-4 rounded-lg border ${colors.border}`}>
                    <h4 className="font-medium mb-2">Evening Rush (4 PM - 7 PM)</h4>
                    <div className="flex items-center">
                      <div
                        className={`w-6 h-6 rounded-full ${getTrafficColor(
                          trafficData
                            .filter((t) => {
                              const hour = Number.parseInt(t.time.split(":")[0])
                              return hour >= 16 && hour <= 19
                            })
                            .reduce((sum, t) => sum + t.congestionLevel, 0) /
                            Math.max(
                              1,
                              trafficData.filter((t) => {
                                const hour = Number.parseInt(t.time.split(":")[0])
                                return hour >= 16 && hour <= 19
                              }).length,
                            ),
                        )}`}
                      ></div>
                      <div className="ml-3">
                        <p className="text-sm">
                          {(() => {
                            const avgCongestion =
                              trafficData
                                .filter((t) => {
                                  const hour = Number.parseInt(t.time.split(":")[0])
                                  return hour >= 16 && hour <= 19
                                })
                                .reduce((sum, t) => sum + t.congestionLevel, 0) /
                              Math.max(
                                1,
                                trafficData.filter((t) => {
                                  const hour = Number.parseInt(t.time.split(":")[0])
                                  return hour >= 16 && hour <= 19
                                }).length,
                              )

                            if (avgCongestion > 80) return "Severe congestion expected"
                            if (avgCongestion > 60) return "Heavy traffic expected"
                            if (avgCongestion > 40) return "Moderate traffic expected"
                            return "Light traffic expected"
                          })()}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Night */}
                  <div className={`p-4 rounded-lg border ${colors.border}`}>
                    <h4 className="font-medium mb-2">Night (8 PM - 6 AM)</h4>
                    <div className="flex items-center">
                      <div
                        className={`w-6 h-6 rounded-full ${getTrafficColor(
                          trafficData
                            .filter((t) => {
                              const hour = Number.parseInt(t.time.split(":")[0])
                              return hour >= 20 || hour < 6
                            })
                            .reduce((sum, t) => sum + t.congestionLevel, 0) /
                            Math.max(
                              1,
                              trafficData.filter((t) => {
                                const hour = Number.parseInt(t.time.split(":")[0])
                                return hour >= 20 || hour < 6
                              }).length,
                            ),
                        )}`}
                      ></div>
                      <div className="ml-3">
                        <p className="text-sm">
                          {(() => {
                            const avgCongestion =
                              trafficData
                                .filter((t) => {
                                  const hour = Number.parseInt(t.time.split(":")[0])
                                  return hour >= 20 || hour < 6
                                })
                                .reduce((sum, t) => sum + t.congestionLevel, 0) /
                              Math.max(
                                1,
                                trafficData.filter((t) => {
                                  const hour = Number.parseInt(t.time.split(":")[0])
                                  return hour >= 20 || hour < 6
                                }).length,
                              )

                            if (avgCongestion > 80) return "Severe congestion expected"
                            if (avgCongestion > 60) return "Heavy traffic expected"
                            if (avgCongestion > 40) return "Moderate traffic expected"
                            return "Light traffic expected"
                          })()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}

