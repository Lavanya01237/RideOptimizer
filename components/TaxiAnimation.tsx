"use client"

import { useState, useEffect, useRef } from "react"
import { DollarSign, Search, Frown, MapPin, Smile, Clock, TrendingUp, Check } from "lucide-react"

interface TaxiAnimationProps {
  onComplete?: () => void
  loop?: boolean
}

export function TaxiAnimation({ onComplete, loop = true }: TaxiAnimationProps) {
  const [currentScene, setCurrentScene] = useState(0)
  const totalScenes = 6
  const animationRef = useRef<HTMLDivElement>(null)

  // Auto-advance through scenes
  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentScene < totalScenes - 1) {
        setCurrentScene(currentScene + 1)
      } else {
        if (loop) {
          setCurrentScene(0)
        }
        if (onComplete) {
          onComplete()
        }
      }
    }, 5000) // Each scene lasts 5 seconds

    return () => clearTimeout(timer)
  }, [currentScene, loop, onComplete])

  return (
    <div
      className="w-full h-full relative overflow-hidden bg-gradient-to-b from-sky-100 to-blue-50 rounded-lg"
      ref={animationRef}
    >
      <style jsx global>{`
        @keyframes driveAcross {
          0% { transform: translateX(-120%); }
          100% { transform: translateX(120%); }
        }
        
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          25% { transform: translateY(-5px) rotate(1deg); }
          75% { transform: translateY(5px) rotate(-1deg); }
        }
        
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes fadeInRight {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        @keyframes fadeInLeft {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0) rotate(0deg); }
          25% { transform: translateX(-5px) rotate(-2deg); }
          75% { transform: translateX(5px) rotate(2deg); }
        }
        
        @keyframes driveAndBounce {
          0% { transform: translateX(-120%) translateY(0); }
          10% { transform: translateX(-80%) translateY(-5px); }
          20% { transform: translateX(-40%) translateY(0); }
          30% { transform: translateX(0%) translateY(-5px); }
          40% { transform: translateX(40%) translateY(0); }
          50% { transform: translateX(80%) translateY(-5px); }
          60% { transform: translateX(120%) translateY(0); }
          100% { transform: translateX(120%) translateY(0); }
        }
        
        @keyframes popIn {
          0% { transform: scale(0); opacity: 0; }
          70% { transform: scale(1.1); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        
        @keyframes slideInBottom {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        
        @keyframes expandWidth {
          from { width: 0; }
          to { width: 100%; }
        }
        
        @keyframes clockTick {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(180deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes dropIn {
          0% { transform: translateY(-100vh); }
          70% { transform: translateY(10px); }
          85% { transform: translateY(-5px); }
          100% { transform: translateY(0); }
        }
        
        @keyframes fadeOut {
          from { opacity: 1; }
          to { opacity: 0; }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .cloud {
          animation: float 10s ease-in-out infinite;
        }
        
        .cloud:nth-child(2) {
          animation-duration: 13s;
          animation-delay: -2s;
        }
        
        .cloud:nth-child(3) {
          animation-duration: 15s;
          animation-delay: -5s;
        }
        
        .building {
          animation: fadeInUp 0.5s ease-out forwards;
        }
        
        .building:nth-child(2) { animation-delay: 0.1s; }
        .building:nth-child(3) { animation-delay: 0.2s; }
        .building:nth-child(4) { animation-delay: 0.3s; }
        .building:nth-child(5) { animation-delay: 0.4s; }
        
        .feature-item {
          animation: popIn 0.5s ease-out forwards;
        }
        
        .animate-taxi {
          animation: driveAndBounce 6s linear infinite;
        }
        
        .animate-search {
          animation: pulse 2s ease-in-out infinite;
        }
        
        .animate-frustrated {
          animation: shake 0.8s ease-in-out infinite;
        }
        
        .animate-lightbulb {
          animation: pulse 1s ease-in-out infinite;
        }
        
        .animate-coin {
          animation: spin 2s linear infinite;
        }
        
        .animate-hotspot {
          animation: pulse 2s ease-in-out infinite;
        }
        
        .animate-passenger {
          animation: bounce 1s ease-in-out infinite;
        }
        
        .animate-earnings-bar {
          animation: expandWidth 2s ease-out forwards;
        }
        
        .animate-happy {
          animation: bounce 2s ease-in-out infinite;
        }
        
        .animate-star {
          animation: blink 1.5s ease-in-out infinite;
        }
        
        .animate-pop {
          animation: popIn 0.5s ease-out forwards;
        }
        
        .animate-slide-up {
          animation: slideInBottom 0.5s ease-out forwards;
        }
        
        .animate-clock {
          animation: clockTick 10s linear infinite;
        }
        
        .animate-drop {
          animation: dropIn 1s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
        
        .animate-fade-out {
          animation: fadeOut 1s ease-out forwards;
        }
      `}</style>

      {/* Scene 1: Taxi searching for passengers */}
      <div
        className={`absolute inset-0 flex flex-col items-center justify-center transition-opacity duration-1000 ${
          currentScene === 0 ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="relative w-full h-full">
          {/* City background */}
          <div className="absolute bottom-0 w-full flex justify-around items-end">
            <div className="w-20 h-40 bg-gray-300 rounded-t-lg building"></div>
            <div className="w-16 h-60 bg-gray-400 rounded-t-lg building"></div>
            <div className="w-24 h-80 bg-gray-500 rounded-t-lg building"></div>
            <div className="w-20 h-50 bg-gray-400 rounded-t-lg building"></div>
            <div className="w-16 h-70 bg-gray-300 rounded-t-lg building"></div>
          </div>

          {/* Road */}
          <div className="absolute bottom-0 w-full h-24 bg-gray-700">
            <div className="absolute top-1/2 w-full h-4 bg-gray-200 animate-road"></div>
          </div>

          {/* Taxi */}
          <div className="absolute bottom-20 animate-taxi">
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/pngtree-taxi-yellow-taxi-cartoon-png-image_6673884-U4YiTvnbxLfk4lsAPNwIrhRqdhXv7i.png"
              alt="Cartoon Taxi"
              className="w-32 h-auto"
            />
          </div>

          {/* Search icon - properly centered above buildings */}
          <div className="absolute top-20 left-0 right-0 flex flex-col items-center">
            <div className="bg-white p-4 rounded-full shadow-lg">
              <Search className="h-12 w-12 text-gray-400" />
            </div>
            <div className="mt-4 text-center text-lg font-medium bg-white px-4 py-2 rounded-lg shadow-md">
              Searching for passengers...
            </div>
          </div>
        </div>
      </div>

      {/* Scene 2: Frustrated driver - ULTRA SIMPLIFIED */}
      <div
        className={`absolute inset-0 flex flex-col items-center justify-center transition-opacity duration-1000 ${
          currentScene === 1 ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="relative w-full h-full">
          {/* City background - same as first slide */}
          <div className="absolute bottom-0 w-full flex justify-around items-end">
            <div className="w-20 h-40 bg-gray-300 rounded-t-lg building"></div>
            <div className="w-16 h-60 bg-gray-400 rounded-t-lg building"></div>
            <div className="w-24 h-80 bg-gray-500 rounded-t-lg building"></div>
            <div className="w-20 h-50 bg-gray-400 rounded-t-lg building"></div>
            <div className="w-16 h-70 bg-gray-300 rounded-t-lg building"></div>
          </div>

          {/* Road */}
          <div className="absolute bottom-0 w-full h-24 bg-gray-700">
            <div className="absolute top-1/2 w-full h-4 bg-gray-200"></div>
          </div>

          {/* Taxi on the road */}
          <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2">
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/pngtree-taxi-yellow-taxi-cartoon-png-image_6673884-U4YiTvnbxLfk4lsAPNwIrhRqdhXv7i.png"
              alt="Cartoon Taxi"
              className="w-32 h-auto"
            />
          </div>

          {/* Content container - positioned higher above the buildings */}
          <div className="absolute inset-x-0 top-12 flex flex-col items-center">
            {/* Sad face emoji above the taxi */}
            <div className="mb-6">
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot_2025-03-28_at_11.50.49_PM-removebg-preview-0yWDrXlI9OZeFMLtIyTgkJZKGqdyeu.png"
                alt="Sad Face Emoji"
                className="w-16 h-16"
              />
            </div>

            {/* Simple message */}
            <div className="bg-white px-6 py-3 rounded-lg shadow-md mb-4">
              <p className="text-xl font-medium text-gray-800">No passengers in sight!</p>
            </div>

            {/* Simple revenue indicator */}
            <div className="bg-white px-6 py-3 rounded-lg shadow-md">
              <p className="text-lg text-red-500 font-medium">Low earnings: $120/day</p>
            </div>
          </div>
        </div>
      </div>

      {/* Scene 3: Discovering RideOptimizer - with same background as Scene 1 */}
      <div
        className={`absolute inset-0 flex flex-col items-center justify-center transition-opacity duration-1000 ${
          currentScene === 2 ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="relative w-full h-full">
          {/* City background - same as first slide */}
          <div className="absolute bottom-0 w-full flex justify-around items-end">
            <div className="w-20 h-40 bg-gray-300 rounded-t-lg building"></div>
            <div className="w-16 h-60 bg-gray-400 rounded-t-lg building"></div>
            <div className="w-24 h-80 bg-gray-500 rounded-t-lg building"></div>
            <div className="w-20 h-50 bg-gray-400 rounded-t-lg building"></div>
            <div className="w-16 h-70 bg-gray-300 rounded-t-lg building"></div>
          </div>

          {/* Road */}
          <div className="absolute bottom-0 w-full h-24 bg-gray-700">
            <div className="absolute top-1/2 w-full h-4 bg-gray-200"></div>
          </div>

          {/* Taxi on the road */}
          <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2">
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/pngtree-taxi-yellow-taxi-cartoon-png-image_6673884-U4YiTvnbxLfk4lsAPNwIrhRqdhXv7i.png"
              alt="Cartoon Taxi"
              className="w-32 h-auto"
            />
          </div>

          {/* Message box with RideOptimizer - Centered and positioned higher */}
          <div className="absolute inset-0 flex items-start justify-center pt-8">
            <div
              className="bg-white px-8 py-6 rounded-xl shadow-2xl animate-pop z-30"
              style={{
                width: "320px",
                background: "rgba(255, 255, 255, 0.95)",
                backdropFilter: "blur(8px)",
                border: "1px solid rgba(255, 255, 255, 0.3)",
                animationDuration: "0.5s",
                animationDelay: "0.5s",
                animationFillMode: "forwards",
              }}
            >
              {/* Lightbulb icon with glow effect */}
              <div className="absolute -left-6 top-1/2 transform -translate-y-1/2">
                <div className="relative">
                  <div className="absolute inset-0 bg-yellow-300 rounded-full blur-md opacity-40 animate-pulse"></div>
                  <div className="relative bg-white p-3 rounded-full shadow-lg">
                    <svg width="40" height="40" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M25 12C20.5817 12 17 15.5817 17 20C17 22.8273 18.5817 25.2909 20.9091 26.5455C21.8182 27.0909 22.3636 28.0909 22.3636 29.1818V30.9091C22.3636 31.5455 22.8182 32 23.4545 32H26.5455C27.1818 32 27.6364 31.5455 27.6364 30.9091V29.1818C27.6364 28.0909 28.1818 27.0909 29.0909 26.5455C31.4182 25.2909 33 22.8273 33 20C33 15.5817 29.4183 12 25 12Z"
                        stroke="black"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path d="M23 36H27" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M24 40H26" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M13 20H15" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M35 20H37" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <path
                        d="M17 12L19 14"
                        stroke="black"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M33 12L31 14"
                        stroke="black"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path d="M25 8V10" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-center mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#e67e5a] to-[#f3a183] flex items-center justify-center mr-3 shadow-md">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
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
                <span className="font-semibold text-2xl text-[#2d2d2d] tracking-tight">RideOptimizer</span>
              </div>

              <p className="text-center text-[#666] text-base mb-5 leading-relaxed">
                The AI-powered solution to maximize your earnings
              </p>

              <div className="flex justify-center">
                <button className="bg-gradient-to-r from-[#e67e5a] to-[#f3a183] text-white py-2.5 px-7 rounded-full text-base font-medium shadow-md hover:shadow-lg transform transition-all duration-200 hover:scale-105 active:scale-95">
                  Discover How
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scene 4: Discovering features - ENHANCED with multiple features */}
      <div
        className={`absolute inset-0 flex flex-col items-center justify-center transition-opacity duration-1000 ${
          currentScene === 3 ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="relative w-full h-full bg-gradient-to-br from-white to-gray-50">
          {/* City background - subtle silhouette */}
          <div className="absolute bottom-0 w-full flex justify-around items-end opacity-10">
            <div className="w-20 h-40 bg-gray-400 rounded-t-lg"></div>
            <div className="w-16 h-60 bg-gray-500 rounded-t-lg"></div>
            <div className="w-24 h-80 bg-gray-600 rounded-t-lg"></div>
            <div className="w-20 h-50 bg-gray-500 rounded-t-lg"></div>
            <div className="w-16 h-70 bg-gray-400 rounded-t-lg"></div>
          </div>

          {/* Simple centered content */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center max-w-md px-6">
              <h3 className="text-2xl font-bold text-[#2d2d2d] mb-8">Key Features</h3>

              <div className="grid grid-cols-2 gap-x-12 gap-y-10">
                <div className="flex flex-col items-center transform transition-all duration-300 hover:scale-105">
                  <div className="w-16 h-16 rounded-full bg-[#fff8f6] flex items-center justify-center mb-4 shadow-md">
                    <MapPin className="h-8 w-8 text-[#e67e5a]" />
                  </div>
                  <p className="text-[#2d2d2d] font-medium">Demand Mapping</p>
                </div>

                <div className="flex flex-col items-center transform transition-all duration-300 hover:scale-105">
                  <div className="w-16 h-16 rounded-full bg-[#fff8f6] flex items-center justify-center mb-4 shadow-md">
                    <DollarSign className="h-8 w-8 text-[#e67e5a]" />
                  </div>
                  <p className="text-[#2d2d2d] font-medium">Revenue Boost</p>
                </div>

                <div className="flex flex-col items-center transform transition-all duration-300 hover:scale-105">
                  <div className="w-16 h-16 rounded-full bg-[#fff8f6] flex items-center justify-center mb-4 shadow-md">
                    <Clock className="h-8 w-8 text-[#e67e5a]" />
                  </div>
                  <p className="text-[#2d2d2d] font-medium">Smart Scheduling</p>
                </div>

                <div className="flex flex-col items-center transform transition-all duration-300 hover:scale-105">
                  <div className="w-16 h-16 rounded-full bg-[#fff8f6] flex items-center justify-center mb-4 shadow-md">
                    <TrendingUp className="h-8 w-8 text-[#e67e5a]" />
                  </div>
                  <p className="text-[#2d2d2d] font-medium">Route Optimization</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scene 5: Picking up passenger */}
      <div
        className={`absolute inset-0 flex flex-col items-center justify-center transition-opacity duration-1000 ${
          currentScene === 4 ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="relative w-full h-full">
          {/* City background - same as first slide */}
          <div className="absolute bottom-0 w-full flex justify-around items-end">
            <div className="w-20 h-40 bg-gray-300 rounded-t-lg building"></div>
            <div className="w-16 h-60 bg-gray-400 rounded-t-lg building"></div>
            <div className="w-24 h-80 bg-gray-500 rounded-t-lg building"></div>
            <div className="w-20 h-50 bg-gray-400 rounded-t-lg building"></div>
            <div className="w-16 h-70 bg-gray-300 rounded-t-lg building"></div>
          </div>

          {/* Road */}
          <div className="absolute bottom-0 w-full h-24 bg-gray-700">
            <div className="absolute top-1/2 w-full h-4 bg-gray-200"></div>
          </div>

          {/* Heat map effect */}
          <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2">
            <div className="relative">
              {/* Red glow effect */}
              <div className="absolute inset-0 w-64 h-64 bg-red-500 opacity-20 rounded-full blur-3xl"></div>

              {/* Taxi on the road */}
              <div className="relative">
                <img
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/pngtree-taxi-yellow-taxi-cartoon-png-image_6673884-U4YiTvnbxLfk4lsAPNwIrhRqdhXv7i.png"
                  alt="Cartoon Taxi"
                  className="w-32 h-auto"
                />
              </div>

              {/* Passenger on the road */}
              <div className="absolute top-0 right-0 transform translate-x-16">
                <img
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot_2025-03-28_at_11.32.14_PM-removebg-preview-BJEfMDQuL08W5JFfLYV8YLT11c0C15.png"
                  alt="Passenger with luggage"
                  className="w-16 h-auto"
                />
              </div>
            </div>
          </div>

          {/* Message box above the buildings */}
          <div className="absolute top-20 left-1/2 transform -translate-x-1/2 bg-gray-200 bg-opacity-90 p-4 rounded-lg shadow-lg flex items-center">
            <div className="w-10 h-10 rounded-full bg-[#e67e5a] flex items-center justify-center mr-3">
              <MapPin className="h-6 w-6 text-white" />
            </div>
            <span className="font-medium text-base text-black">Finding optimal pickup locations</span>
          </div>
        </div>
      </div>

      {/* Scene 6: Happy driver with increased earnings - ENHANCED */}
      <div
        className={`absolute inset-0 flex flex-col items-center justify-center transition-opacity duration-1000 ${
          currentScene === 5 ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="relative w-full h-full bg-gradient-to-br from-white to-gray-50">
          {/* City background - same as other slides for consistency */}
          <div className="absolute bottom-0 w-full flex justify-around items-end opacity-10">
            <div className="w-20 h-40 bg-gray-400 rounded-t-lg"></div>
            <div className="w-16 h-60 bg-gray-500 rounded-t-lg"></div>
            <div className="w-24 h-80 bg-gray-600 rounded-t-lg"></div>
            <div className="w-20 h-50 bg-gray-500 rounded-t-lg"></div>
            <div className="w-16 h-70 bg-gray-400 rounded-t-lg"></div>
          </div>

          {/* Road */}
          <div></div>

          {/* Main content card */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md">
            <div className="bg-white rounded-xl shadow-lg p-6 animate-pop border border-[#f0f0eb]">
              {/* Header with logo and title */}
              <div className="flex items-center justify-center mb-6">
                <div className="w-12 h-12 rounded-full bg-[#e67e5a] flex items-center justify-center mr-3 shadow-md">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polygon points="3 11 22 2 13 21 11 13 3 11"></polygon>
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-[#2d2d2d]">
                  Maximize Your <span className="text-[#e67e5a]">Earnings</span>
                </h3>
              </div>

              {/* Taxi with earnings visualization */}
              <div className="relative flex justify-center mb-8">
                <div className="relative">
                  <div className="absolute -inset-4 bg-[#fff8f6] rounded-full opacity-70"></div>
                  <img
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/pngtree-taxi-yellow-taxi-cartoon-png-image_6673884-U4YiTvnbxLfk4lsAPNwIrhRqdhXv7i.png"
                    alt="Cartoon Taxi"
                    className="w-32 h-auto relative"
                  />
                </div>
              </div>

              {/* Stats comparison */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-[#f0f0eb] p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <Frown className="h-5 w-5 text-red-500 mr-2" />
                    <span className="font-medium text-[#2d2d2d]">Before</span>
                  </div>
                  <div className="text-2xl font-bold text-red-500 mb-1">
                    $120<span className="text-sm font-normal">/day</span>
                  </div>
                  <div className="flex items-center text-[#6b6b6b] text-sm">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>8 hours driving</span>
                  </div>
                </div>

                <div className="bg-[#e1f0ed] p-4 rounded-lg relative overflow-hidden">
                  <div className="flex items-center mb-2">
                    <Smile className="h-5 w-5 text-[#e67e5a] mr-2" />
                    <span className="font-medium text-[#2d2d2d]">After</span>
                  </div>
                  <div className="text-2xl font-bold text-[#e67e5a] mb-1">
                    $180<span className="text-sm font-normal">/day</span>
                  </div>
                  <div className="flex items-center text-[#2d7a68] text-sm">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    <span>+50% earnings</span>
                  </div>
                </div>
              </div>

              {/* Key benefits */}
              <div className="bg-[#f9f9f8] rounded-lg p-4 mb-6">
                <h4 className="font-medium text-[#2d2d2d] mb-3 flex items-center">
                  <Check className="h-5 w-5 text-[#e67e5a] mr-2" />
                  Driver Benefits
                </h4>

                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-white p-3 rounded-lg text-center shadow-sm">
                    <div className="text-[#e67e5a] font-bold text-lg">-25%</div>
                    <div className="text-xs text-[#6b6b6b]">Idle Time</div>
                  </div>
                  <div className="bg-white p-3 rounded-lg text-center shadow-sm">
                    <div className="text-[#e67e5a] font-bold text-lg">+30%</div>
                    <div className="text-xs text-[#6b6b6b]">Passengers</div>
                  </div>
                  <div className="bg-white p-3 rounded-lg text-center shadow-sm">
                    <div className="text-[#e67e5a] font-bold text-lg">95%</div>
                    <div className="text-xs text-[#6b6b6b]">Satisfaction</div>
                  </div>
                </div>
              </div>

              {/* CTA Button */}
              <button className="w-full bg-[#e67e5a] text-white py-3 px-6 rounded-full font-medium inline-flex items-center justify-center shadow-md hover:shadow-lg transform transition-all duration-200 hover:scale-105 active:scale-95">
                Start Optimizing Now
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Scene indicator dots */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {Array.from({ length: totalScenes }).map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentScene(index)}
            className={`w-3 h-3 rounded-full transition-colors ${
              currentScene === index ? "bg-[#e67e5a]" : "bg-white bg-opacity-50"
            }`}
          />
        ))}
      </div>
    </div>
  )
}

