"use client"

import { ArrowRight, DollarSign, Clock, MapPin, TrendingUp, BarChart3, Shield, CheckCircle } from "lucide-react"
import { TaxiAnimation } from "./TaxiAnimation"
import { useState } from "react"

interface WelcomePageProps {
  onStart: () => void
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
  videoUrl?: string
}

export function WelcomePage({ onStart, themeColors, videoUrl }: WelcomePageProps) {
  const [useVideo, setUseVideo] = useState(!!videoUrl)

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
    <div className={`min-h-screen ${colors.bg} flex flex-col`}>
      <style jsx global>{`
@keyframes drive {
  0% {
    transform: translateX(-120%) rotate(0deg);
  }
  100% {
    transform: translateX(120%) rotate(0deg);
  }
}

.animate-drive {
  animation: drive 8s linear infinite;
}

/* Gradient backgrounds */
.gradient-primary {
  background: linear-gradient(135deg, #e67e5a 0%, #f3a183 100%);
}

.gradient-secondary {
  background: linear-gradient(135deg, #8ab5ae 0%, #a3d0c8 100%);
}

/* Subtle animations */
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-5px); }
}

.animate-float {
  animation: float 3s ease-in-out infinite;
}

/* Card hover effects */
.feature-card {
  transition: all 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
}

/* Stat card animations */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.stat-card {
  animation: fadeInUp 0.5s ease-out forwards;
  transform-style: preserve-3d;
  perspective: 1000px;
  backface-visibility: hidden;
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05);
}

.stat-card:nth-child(1) { animation-delay: 0.1s; }
.stat-card:nth-child(2) { animation-delay: 0.2s; }
.stat-card:nth-child(3) { animation-delay: 0.3s; }
.stat-card:nth-child(4) { animation-delay: 0.4s; }

/* City skyline */
.city-skyline {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1000 100' preserveAspectRatio='none'%3E%3Cpath fill='%23718f8a' d='M0,0 L0,100 L1000,100 L1000,0 L0,0 Z M40,100 L40,80 L60,80 L60,100 L40,100 Z M80,100 L80,60 L100,60 L100,100 L80,100 Z M120,100 L120,70 L140,70 L140,100 L120,100 Z M160,100 L160,50 L180,50 L180,100 L160,100 Z M220,100 L220,65 L240,65 L240,100 L220,100 Z M280,100 L280,75 L300,75 L300,100 L280,100 Z M340,100 L340,55 L360,55 L360,100 L340,100 Z M380,100 L380,80 L400,80 L400,100 L380,100 Z M440,100 L440,70 L460,70 L460,100 L440,100 Z M500,100 L500,40 L520,40 L520,100 L500,100 Z M540,100 L540,60 L560,60 L560,100 L540,100 Z M600,100 L600,75 L620,75 L620,100 L600,100 Z M660,100 L660,85 L680,85 L680,100 L660,100 Z M720,100 L720,55 L740,55 L740,100 L720,100 Z M780,100 L780,65 L800,65 L800,100 L780,100 Z M840,100 L840,45 L860,45 L860,100 L840,100 Z M900,100 L900,70 L920,70 L920,100 L900,100 Z M960,100 L960,80 L980,80 L980,100 L960,100 Z'%3E%3C/path%3E%3C/svg%3E");
  background-size: cover;
  background-position: bottom;
  height: 60px;
  width: 100%;
  position: absolute;
  bottom: 16px;
  opacity: 0.5;
}

/* Logo hover effect */
@keyframes pulse-shadow {
  0%, 100% { box-shadow: 0 0 0 0 rgba(230, 126, 90, 0.4); }
  50% { box-shadow: 0 0 0 8px rgba(230, 126, 90, 0); }
}

.logo-pulse:hover {
  animation: pulse-shadow 2s infinite;
}

/* Text gradient animation */
@keyframes gradient-shift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.animate-gradient {
  background-size: 200% auto;
  animation: gradient-shift 3s ease infinite;
}

/* Additional animations */
@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
}

.animate-bounce-slow {
  animation: bounce 3s ease-in-out infinite;
}

@keyframes pulse-glow {
  0%, 100% { opacity: 0.7; }
  50% { opacity: 1; }
}

.animate-pulse-glow {
  animation: pulse-glow 2s ease-in-out infinite;
}

/* Road animation */
@keyframes road {
  0% {
    background-position: 0 0;
  }
  100% {
    background-position: 200px 0;
  }
}

.animate-road {
  animation: road 5s linear infinite;
  background-image: linear-gradient(
    90deg,
    rgba(0, 0, 0, 0.1) 0%,
    rgba(0, 0, 0, 0.1) 50%,
    transparent 50%,
    transparent 100%
  );
  background-size: 20px 100%;
}
`}</style>

      {/* Enhanced header with gradient background */}
      <header className="bg-gradient-to-r from-white to-[#faf7f5] border-b border-[#e8e8e3] shadow-md py-5">
        <div className="max-w-7xl mx-auto px-7 py-3 sm:px-6 lg:px-8">
          <div className="relative">
            {/* Sign up/login button - positioned absolutely */}
            <div className="absolute right-6 top-[75%]">
              <button
                onClick={onStart}
                className="px-4 py-2 rounded-full text-sm font-medium bg-[#e67e5a] text-white hover:bg-[#d06a4a] transition-colors duration-200"
              >
                Sign up / Log in
              </button>
            </div>

            {/* Centered logo and text */}
            <div className="flex justify-center">
              <div className="flex items-center">
                {/* Logo with enhanced styling */}
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#e67e5a] to-[#f3a183] flex items-center justify-center shadow-md border-2 border-white logo-pulse">
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
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center py-8 px-4 sm:px-6 lg:px-8">
        {/* Taxi Driver App Badge - Enhanced */}
        <div className="w-full max-w-6xl mb-4 relative">
          <div className="flex items-center">
            <div className="gradient-primary text-white px-6 py-2.5 rounded-full text-sm font-medium shadow-lg flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-2"
              >
                <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                <path d="M1 10h22"></path>
              </svg>
              Taxi Driver App
            </div>
          </div>
        </div>

        {/* Hero Section */}
        <div className="w-full max-w-6xl mb-12">
          <div className="relative bg-white rounded-2xl shadow-xl overflow-hidden border border-[#e8e8e3]">
            <div className="md:grid md:grid-cols-2">
              <div className="p-8 md:p-12 flex flex-col justify-center">
                <h2 className="text-3xl sm:text-4xl font-bold text-[#2d2d2d] mb-6 leading-tight">
                  Boost your earnings as a taxi driver
                </h2>
                <p className="text-[#6b6b6b] mb-8 leading-relaxed text-lg">
                  RideOptimizer helps professional drivers plan smarter routes, optimize break times, and increase daily
                  revenue with AI-powered recommendations.
                </p>

                {/* Enhanced driver stats with cards - Redesigned for consistent aesthetic */}
                <div className="mb-8">
                  <div className="grid grid-cols-2 gap-4 relative">
                    {/* Daily earnings increase */}
                    <div className="stat-card bg-white p-4 rounded-xl shadow-sm border border-[#e8e8e3] hover:border-[#e67e5a] transition-all duration-300 group">
                      <div className="flex items-center mb-2">
                        <div className="w-10 h-10 rounded-full bg-[#f0f0eb] flex items-center justify-center mr-3 group-hover:bg-[#fff8f6] transition-colors duration-300">
                          <TrendingUp className="h-5 w-5 text-[#e67e5a]" />
                        </div>
                        <span className="text-[#e67e5a] font-bold text-lg">+18%</span>
                      </div>
                      <p className="text-[#6b6b6b] text-sm">Daily earnings increase</p>
                    </div>

                    {/* Reduction in idle time */}
                    <div className="stat-card bg-white p-4 rounded-xl shadow-sm border border-[#e8e8e3] hover:border-[#e67e5a] transition-all duration-300 group">
                      <div className="flex items-center mb-2">
                        <div className="w-10 h-10 rounded-full bg-[#f0f0eb] flex items-center justify-center mr-3 group-hover:bg-[#fff8f6] transition-colors duration-300">
                          <Clock className="h-5 w-5 text-[#e67e5a]" />
                        </div>
                        <span className="text-[#e67e5a] font-bold text-lg">-12%</span>
                      </div>
                      <p className="text-[#6b6b6b] text-sm">Reduction in idle time</p>
                    </div>

                    {/* Higher fare trips */}
                    <div className="stat-card bg-white p-4 rounded-xl shadow-sm border border-[#e8e8e3] hover:border-[#e67e5a] transition-all duration-300 group">
                      <div className="flex items-center mb-2">
                        <div className="w-10 h-10 rounded-full bg-[#f0f0eb] flex items-center justify-center mr-3 group-hover:bg-[#fff8f6] transition-colors duration-300">
                          <DollarSign className="h-5 w-5 text-[#e67e5a]" />
                        </div>
                        <span className="text-[#e67e5a] font-bold text-lg">+25%</span>
                      </div>
                      <p className="text-[#6b6b6b] text-sm">Higher fare trips</p>
                    </div>

                    {/* Driver satisfaction */}
                    <div className="stat-card bg-white p-4 rounded-xl shadow-sm border border-[#e8e8e3] hover:border-[#e67e5a] transition-all duration-300 group">
                      <div className="flex items-center mb-2">
                        <div className="w-10 h-10 rounded-full bg-[#f0f0eb] flex items-center justify-center mr-3 group-hover:bg-[#fff8f6] transition-colors duration-300">
                          <BarChart3 className="h-5 w-5 text-[#e67e5a]" />
                        </div>
                        <span className="text-[#e67e5a] font-bold text-lg">92%</span>
                      </div>
                      <p className="text-[#6b6b6b] text-sm">Driver satisfaction</p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={onStart}
                  className="gradient-primary text-white py-4 px-8 rounded-full font-medium flex items-center justify-center transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-md w-full sm:w-auto sm:inline-flex"
                >
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </button>
              </div>

              {/* Animation/Video section */}
              <div className="relative h-[300px] md:h-auto">
                <div className="absolute inset-0 overflow-hidden">
                  {useVideo && videoUrl ? (
                    /* Video element */
                    <video
                      className="w-full h-full object-cover"
                      autoPlay
                      loop
                      muted
                      playsInline
                      poster="/placeholder.svg?height=400&width=600"
                    >
                      <source src={videoUrl} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  ) : (
                    /* Animated sequence */
                    <TaxiAnimation loop={true} />
                  )}

                  {/* Optional overlay for better text contrast if needed */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="w-full max-w-6xl mb-12">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-[#2d2d2d] mb-4">Optimize Your Driving Experience</h2>
            <p className="text-[#6b6b6b] max-w-2xl mx-auto">
              Our intelligent tools help you make more money while spending less time on the road.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <div className="feature-card bg-white p-6 rounded-xl shadow-md border border-[#e8e8e3] hover:border-[#e67e5a]">
              <div className="w-14 h-14 rounded-full gradient-primary flex items-center justify-center mb-5 shadow-sm mx-auto">
                <DollarSign className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-[#2d2d2d] mb-3 text-center">Maximize Fares</h3>
              <p className="text-[#6b6b6b] leading-relaxed text-center">
                AI-powered suggestions to help you find higher-paying trips and reduce empty miles.
              </p>
            </div>

            <div className="feature-card bg-white p-6 rounded-xl shadow-md border border-[#e8e8e3] hover:border-[#e67e5a]">
              <div className="w-14 h-14 rounded-full gradient-primary flex items-center justify-center mb-5 shadow-sm mx-auto">
                <Clock className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-[#2d2d2d] mb-3 text-center">Smart Scheduling</h3>
              <p className="text-[#6b6b6b] leading-relaxed text-center">
                Plan your driving shifts with intelligent break times and optimal working hours.
              </p>
            </div>

            <div className="feature-card bg-white p-6 rounded-xl shadow-md border border-[#e8e8e3] hover:border-[#e67e5a]">
              <div className="w-14 h-14 rounded-full gradient-primary flex items-center justify-center mb-5 shadow-sm mx-auto">
                <MapPin className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-[#2d2d2d] mb-3 text-center">Hotspot Finder</h3>
              <p className="text-[#6b6b6b] leading-relaxed text-center">
                Discover high-demand pickup locations based on real-time and historical data.
              </p>
            </div>
          </div>
        </div>

        {/* Trusted by Professional Drivers section */}
        <div className="w-full max-w-6xl">
          <div className="bg-white p-8 rounded-xl shadow-md border border-[#e8e8e3]">
            <div className="flex items-center justify-center mb-8">
              <Shield className="h-8 w-8 text-[#e67e5a] mr-3" />
              <h3 className="text-2xl font-semibold text-[#2d2d2d]">Trusted by Professional Drivers</h3>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              <div className="bg-[#f0f0eb] p-4 rounded-xl shadow-sm flex flex-col items-center text-center">
                <CheckCircle className="h-8 w-8 text-green-500 mb-3" />
                <span className="font-medium">Privacy Protected</span>
              </div>

              <div className="bg-[#f0f0eb] p-4 rounded-xl shadow-sm flex flex-col items-center text-center">
                <CheckCircle className="h-8 w-8 text-green-500 mb-3" />
                <span className="font-medium">24/7 Support</span>
              </div>

              <div className="bg-[#f0f0eb] p-4 rounded-xl shadow-sm flex flex-col items-center text-center">
                <CheckCircle className="h-8 w-8 text-green-500 mb-3" />
                <span className="font-medium">Works Offline</span>
              </div>

              <div className="bg-[#f0f0eb] p-4 rounded-xl shadow-sm flex flex-col items-center text-center">
                <CheckCircle className="h-8 w-8 text-green-500 mb-3" />
                <span className="font-medium">Free Updates</span>
              </div>
            </div>

            <div className="mt-8 text-center">
              <button
                onClick={onStart}
                className="bg-[#e1f0ed] text-[#e67e5a] py-3 px-8 rounded-full font-medium inline-flex items-center justify-center transition-all duration-300 hover:bg-[#d5e9e5]"
              >
                Start Optimizing Your Routes
                <ArrowRight className="ml-2 h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </main>

      <footer className="py-8 bg-[#f9f9f8] text-[#6b6b6b] border-t border-[#e8e8e3] mt-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center mr-2">
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
              >
                <polygon points="3 11 22 2 13 21 11 13 3 11"></polygon>
              </svg>
            </div>
            <span className="text-[#2d2d2d] font-medium text-lg">RideOptimizer</span>
          </div>
          <p className="text-sm">© {new Date().getFullYear()} RideOptimizer | Helping taxi drivers maximize earnings</p>
        </div>
      </footer>
    </div>
  )
}

