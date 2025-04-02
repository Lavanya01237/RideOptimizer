"use client"

import { useState } from "react"
import { DemandHeatMap } from "./DemandHeatMap"
import { X } from "lucide-react"

interface HeatMapModalProps {
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

export function HeatMapModal({ onClose, themeColors }: HeatMapModalProps) {
  const [darkMode, setDarkMode] = useState(false)

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-6xl h-[90vh] bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-[#e67e5a] flex items-center justify-center shadow-md mr-3">
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
            <h2 className="text-xl font-bold">
              <span className="text-[#e67e5a]">Demand</span>
              <span className="text-[#2d2d2d]"> Heat Map</span>
            </h2>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
            <X className="h-6 w-6 text-gray-500" />
          </button>
        </div>

        {/* Heat Map Content with enhanced scrollbar */}
        <div className="flex-1 overflow-hidden">
          <DemandHeatMap darkMode={darkMode} themeColors={themeColors} />
        </div>
      </div>

      {/* Enhanced custom scrollbar styling */}
      <style jsx global>{`
        /* Vertical scrollbar styling */
        ::-webkit-scrollbar {
          width: 14px;
          height: 14px;
        }
        
        ::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        
        ::-webkit-scrollbar-thumb {
          background: #c1c1c1;
          border-radius: 10px;
          border: 3px solid #f1f1f1;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: #a1a1a1;
        }
        
        /* For Firefox */
        * {
          scrollbar-width: thin;
          scrollbar-color: #c1c1c1 #f1f1f1;
        }
      `}</style>
    </div>
  )
}

