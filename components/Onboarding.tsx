"use client"

import { useState } from "react"
import { ArrowRight, Check, MapPin, Clock, Calendar, Navigation, Play } from "lucide-react"

interface OnboardingProps {
  onComplete: () => void
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

export function Onboarding({ onComplete, themeColors }: OnboardingProps) {
  const [step, setStep] = useState(1)
  const totalSteps = 5

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

  const nextStep = () => {
    if (step < totalSteps) {
      setStep(step + 1)
    } else {
      onComplete()
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className={`${colors.card} w-full max-w-2xl rounded-xl shadow-lg overflow-hidden`}>
        {/* Progress bar */}
        <div className="w-full h-1 bg-gray-200">
          <div
            className={`h-full ${colors.buttonPrimary} transition-all duration-300`}
            style={{ width: `${(step / totalSteps) * 100}%` }}
          ></div>
        </div>

        <div className="p-8">
          {/* Step 1: Welcome */}
          {step === 1 && (
            <div className="text-center">
              <div
                className={`w-20 h-20 rounded-full ${colors.buttonSecondary} flex items-center justify-center mx-auto mb-6`}
              >
                <Navigation className={`h-10 w-10 ${colors.highlight}`} />
              </div>
              <h2 className="text-2xl font-bold mb-4">Welcome to RideOptimizer</h2>
              <p className={`${colors.secondaryText} mb-8 max-w-md mx-auto`}>
                Let's get you set up to maximize your earnings and optimize your routes. We'll guide you through a few
                quick steps.
              </p>

              <div className="flex flex-col items-center space-y-4">
                <button
                  onClick={nextStep}
                  className={`${colors.buttonPrimary} ${colors.buttonText} py-3 px-6 rounded-full font-medium flex items-center justify-center transition-transform hover:scale-[1.02] active:scale-[0.98] w-64`}
                >
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </button>
                <button onClick={onComplete} className="text-sm text-gray-500 hover:underline">
                  Skip tutorial
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Location Settings */}
          {step === 2 && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Set Your Starting Location</h2>
              <p className={`${colors.secondaryText} mb-6`}>
                RideOptimizer uses your starting location to calculate the most efficient routes and maximize your
                earnings.
              </p>

              <div className={`p-6 rounded-lg ${colors.secondaryBg} mb-6`}>
                <div className="flex items-start space-x-4">
                  <div className={`p-3 rounded-full ${colors.buttonSecondary} mt-1`}>
                    <MapPin className={`h-6 w-6 ${colors.highlight}`} />
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">Starting Location</h3>
                    <p className={`text-sm ${colors.secondaryText} mb-4`}>
                      You can either use your current location or set a custom starting point for your routes.
                    </p>
                    <div className="flex flex-col space-y-3">
                      <div className="flex items-center">
                        <div className="w-6 h-6 rounded-full border-2 border-gray-300 flex items-center justify-center mr-3">
                          <div className={`w-3 h-3 rounded-full ${colors.buttonPrimary}`}></div>
                        </div>
                        <span>Use my current location</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-6 h-6 rounded-full border-2 border-gray-300 flex items-center justify-center mr-3">
                          <div className="w-3 h-3 rounded-full bg-transparent"></div>
                        </div>
                        <span>Set a custom location</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-between">
                <button
                  onClick={() => setStep(1)}
                  className={`py-2 px-4 rounded-lg border ${colors.border} ${colors.text} hover:bg-gray-50`}
                >
                  Back
                </button>
                <button
                  onClick={nextStep}
                  className={`${colors.buttonPrimary} ${colors.buttonText} py-2 px-6 rounded-lg font-medium flex items-center`}
                >
                  Continue
                  <ArrowRight className="ml-2 h-5 w-5" />
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Schedule Settings */}
          {step === 3 && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Set Your Schedule</h2>
              <p className={`${colors.secondaryText} mb-6`}>
                Define your working hours and break times to help RideOptimizer plan the most efficient routes.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className={`p-6 rounded-lg ${colors.secondaryBg}`}>
                  <div className="flex items-start space-x-4">
                    <div className={`p-3 rounded-full ${colors.buttonSecondary}`}>
                      <Clock className={`h-6 w-6 ${colors.highlight}`} />
                    </div>
                    <div>
                      <h3 className="font-medium mb-2">Working Hours</h3>
                      <p className={`text-sm ${colors.secondaryText} mb-4`}>Set your typical start and end times</p>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm mb-1">Start Time</label>
                          <select className={`w-full rounded-lg h-10 border ${colors.border} px-3`}>
                            <option>6:00 AM</option>
                            <option>7:00 AM</option>
                            <option>8:00 AM</option>
                            <option>9:00 AM</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm mb-1">End Time</label>
                          <select className={`w-full rounded-lg h-10 border ${colors.border} px-3`}>
                            <option>6:00 PM</option>
                            <option>7:00 PM</option>
                            <option>8:00 PM</option>
                            <option>9:00 PM</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className={`p-6 rounded-lg ${colors.secondaryBg}`}>
                  <div className="flex items-start space-x-4">
                    <div className={`p-3 rounded-full ${colors.buttonSecondary}`}>
                      <Calendar className={`h-6 w-6 ${colors.highlight}`} />
                    </div>
                    <div>
                      <h3 className="font-medium mb-2">Break Time</h3>
                      <p className={`text-sm ${colors.secondaryText} mb-4`}>Schedule your break during the day</p>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm mb-1">Start Time</label>
                          <select className={`w-full rounded-lg h-10 border ${colors.border} px-3`}>
                            <option>12:00 PM</option>
                            <option>1:00 PM</option>
                            <option>2:00 PM</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm mb-1">End Time</label>
                          <select className={`w-full rounded-lg h-10 border ${colors.border} px-3`}>
                            <option>1:00 PM</option>
                            <option>2:00 PM</option>
                            <option>3:00 PM</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-between">
                <button
                  onClick={() => setStep(2)}
                  className={`py-2 px-4 rounded-lg border ${colors.border} ${colors.text} hover:bg-gray-50`}
                >
                  Back
                </button>
                <button
                  onClick={nextStep}
                  className={`${colors.buttonPrimary} ${colors.buttonText} py-2 px-6 rounded-lg font-medium flex items-center`}
                >
                  Continue
                  <ArrowRight className="ml-2 h-5 w-5" />
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Heat Map Explanation */}
          {step === 4 && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Demand Heat Map</h2>
              <p className={`${colors.secondaryText} mb-6`}>
                The demand heat map helps you identify high-demand areas throughout the day to maximize your earnings.
              </p>

              <div className={`p-6 rounded-lg ${colors.secondaryBg} mb-6`}>
                <div className="flex flex-col space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className={`p-3 rounded-full ${colors.buttonSecondary} mt-1 flex-shrink-0`}>
                      <Clock className={`h-6 w-6 ${colors.highlight}`} />
                    </div>
                    <div>
                      <h3 className="font-medium mb-2">Time-Based Demand</h3>
                      <p className={`text-sm ${colors.secondaryText}`}>
                        Use the time slider to see how demand patterns change throughout the day. Morning and evening
                        rush hours typically show the highest demand.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className={`p-3 rounded-full ${colors.buttonSecondary} mt-1 flex-shrink-0`}>
                      <div className="w-6 h-6 bg-gradient-to-r from-blue-500 via-yellow-500 to-red-500 rounded-full"></div>
                    </div>
                    <div>
                      <h3 className="font-medium mb-2">Color Intensity</h3>
                      <p className={`text-sm ${colors.secondaryText}`}>
                        Red areas indicate high demand, yellow shows medium demand, and blue represents lower demand.
                        Position yourself in or near red zones to maximize your chances of getting rides.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className={`p-3 rounded-full ${colors.buttonSecondary} mt-1 flex-shrink-0`}>
                      <Play className={`h-6 w-6 ${colors.highlight}`} />
                    </div>
                    <div>
                      <h3 className="font-medium mb-2">Time Lapse Feature</h3>
                      <p className={`text-sm ${colors.secondaryText}`}>
                        Use the play button to see how demand shifts throughout the day. This can help you plan your
                        schedule and positioning in advance.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-between">
                <button
                  onClick={() => setStep(3)}
                  className={`py-2 px-4 rounded-lg border ${colors.border} ${colors.text} hover:bg-gray-50`}
                >
                  Back
                </button>
                <button
                  onClick={nextStep}
                  className={`${colors.buttonPrimary} ${colors.buttonText} py-2 px-6 rounded-lg font-medium flex items-center`}
                >
                  Continue
                  <ArrowRight className="ml-2 h-5 w-5" />
                </button>
              </div>
            </div>
          )}

          {/* Step 5: Final Step */}
          {step === 5 && (
            <div className="text-center">
              <div
                className={`w-20 h-20 rounded-full ${colors.buttonSecondary} flex items-center justify-center mx-auto mb-6`}
              >
                <Check className={`h-10 w-10 ${colors.highlight}`} />
              </div>
              <h2 className="text-2xl font-bold mb-4">You're All Set!</h2>
              <p className={`${colors.secondaryText} mb-8 max-w-md mx-auto`}>
                Your RideOptimizer is now configured and ready to help you maximize your earnings. Let's start planning
                your optimal routes.
              </p>

              <div className="flex flex-col items-center">
                <button
                  onClick={onComplete}
                  className={`${colors.buttonPrimary} ${colors.buttonText} py-3 px-6 rounded-full font-medium flex items-center justify-center transition-transform hover:scale-[1.02] active:scale-[0.98] w-64`}
                >
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

