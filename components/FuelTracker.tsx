"use client"

import { useState } from "react"
import { FuelIcon as GasPump, Plus, Trash2, TrendingDown, TrendingUp, DollarSign, BarChart4 } from "lucide-react"

interface FuelEntry {
  id: string
  date: string
  gallons: number
  price: number
  odometer: number
  fullTank: boolean
  notes: string
}

interface FuelTrackerProps {
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

export function FuelTracker({ themeColors, darkMode = false }: FuelTrackerProps) {
  const [showAddForm, setShowAddForm] = useState(false)
  const [entries, setEntries] = useState<FuelEntry[]>([
    {
      id: "1",
      date: "2025-03-25",
      gallons: 12.5,
      price: 3.45,
      odometer: 45678,
      fullTank: true,
      notes: "Regular unleaded",
    },
    {
      id: "2",
      date: "2025-03-18",
      gallons: 11.8,
      price: 3.52,
      odometer: 45432,
      fullTank: true,
      notes: "",
    },
    {
      id: "3",
      date: "2025-03-11",
      gallons: 12.2,
      price: 3.48,
      odometer: 45187,
      fullTank: true,
      notes: "Premium",
    },
  ])

  const [newEntry, setNewEntry] = useState<Omit<FuelEntry, "id">>({
    date: new Date().toISOString().split("T")[0],
    gallons: 0,
    price: 0,
    odometer: 0,
    fullTank: true,
    notes: "",
  })

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

  // Calculate fuel efficiency metrics
  const calculateMetrics = () => {
    if (entries.length < 2) return { mpg: 0, costPerMile: 0, totalSpent: 0, avgPrice: 0 }

    // Sort entries by date (newest first)
    const sortedEntries = [...entries].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    // Calculate total distance and fuel
    let totalDistance = 0
    let totalGallons = 0
    let totalSpent = 0

    for (let i = 0; i < sortedEntries.length - 1; i++) {
      const distance = sortedEntries[i].odometer - sortedEntries[i + 1].odometer
      totalDistance += distance
      totalGallons += sortedEntries[i].gallons
      totalSpent += sortedEntries[i].gallons * sortedEntries[i].price
    }

    // Add the oldest entry's fuel
    totalGallons += sortedEntries[sortedEntries.length - 1].gallons
    totalSpent += sortedEntries[sortedEntries.length - 1].gallons * sortedEntries[sortedEntries.length - 1].price

    const mpg = totalDistance / totalGallons
    const costPerMile = totalSpent / totalDistance
    const avgPrice = entries.reduce((sum, entry) => sum + entry.price, 0) / entries.length

    return { mpg, costPerMile, totalSpent, avgPrice }
  }

  const { mpg, costPerMile, totalSpent, avgPrice } = calculateMetrics()

  const handleAddEntry = () => {
    const id = Date.now().toString()
    setEntries([{ ...newEntry, id }, ...entries])
    setNewEntry({
      date: new Date().toISOString().split("T")[0],
      gallons: 0,
      price: 0,
      odometer: 0,
      fullTank: true,
      notes: "",
    })
    setShowAddForm(false)
  }

  const handleDeleteEntry = (id: string) => {
    setEntries(entries.filter((entry) => entry.id !== id))
  }

  return (
    <div className={`${colors.card} rounded-xl shadow-lg overflow-hidden`}>
      <div className={`p-6 border-b ${colors.border}`}>
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold flex items-center">
            <GasPump className={`mr-2 h-5 w-5 ${colors.highlight}`} />
            Fuel Tracker
          </h2>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className={`${colors.buttonPrimary} ${colors.buttonText} py-2 px-4 rounded-lg flex items-center`}
          >
            {showAddForm ? (
              "Cancel"
            ) : (
              <>
                <Plus size={16} className="mr-1" />
                Add Fuel
              </>
            )}
          </button>
        </div>
      </div>

      {showAddForm && (
        <div className={`p-6 border-b ${colors.border} ${colors.secondaryBg}`}>
          <h3 className="text-lg font-medium mb-4">Add Fuel Entry</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className={`block text-sm ${colors.secondaryText} mb-1`}>Date</label>
              <input
                type="date"
                value={newEntry.date}
                onChange={(e) => setNewEntry({ ...newEntry, date: e.target.value })}
                className={`w-full rounded-lg h-10 border ${colors.border} px-3 focus:ring-1 focus:ring-[#e67e5a] focus:border-[#e67e5a]`}
              />
            </div>

            <div>
              <label className={`block text-sm ${colors.secondaryText} mb-1`}>Gallons</label>
              <input
                type="number"
                step="0.01"
                value={newEntry.gallons || ""}
                onChange={(e) => setNewEntry({ ...newEntry, gallons: Number.parseFloat(e.target.value) || 0 })}
                className={`w-full rounded-lg h-10 border ${colors.border} px-3 focus:ring-1 focus:ring-[#e67e5a] focus:border-[#e67e5a]`}
                placeholder="0.00"
              />
            </div>

            <div>
              <label className={`block text-sm ${colors.secondaryText} mb-1`}>Price per Gallon ($)</label>
              <input
                type="number"
                step="0.01"
                value={newEntry.price || ""}
                onChange={(e) => setNewEntry({ ...newEntry, price: Number.parseFloat(e.target.value) || 0 })}
                className={`w-full rounded-lg h-10 border ${colors.border} px-3 focus:ring-1 focus:ring-[#e67e5a] focus:border-[#e67e5a]`}
                placeholder="0.00"
              />
            </div>

            <div>
              <label className={`block text-sm ${colors.secondaryText} mb-1`}>Odometer Reading</label>
              <input
                type="number"
                value={newEntry.odometer || ""}
                onChange={(e) => setNewEntry({ ...newEntry, odometer: Number.parseInt(e.target.value) || 0 })}
                className={`w-full rounded-lg h-10 border ${colors.border} px-3 focus:ring-1 focus:ring-[#e67e5a] focus:border-[#e67e5a]`}
                placeholder="0"
              />
            </div>

            <div>
              <label className={`block text-sm ${colors.secondaryText} mb-1`}>Full Tank?</label>
              <div className="flex items-center h-10">
                <input
                  type="checkbox"
                  checked={newEntry.fullTank}
                  onChange={(e) => setNewEntry({ ...newEntry, fullTank: e.target.checked })}
                  className="h-4 w-4 text-[#e67e5a] focus:ring-[#e67e5a] rounded"
                />
                <span className="ml-2">Yes, filled to full</span>
              </div>
            </div>

            <div className="md:col-span-2">
              <label className={`block text-sm ${colors.secondaryText} mb-1`}>Notes</label>
              <input
                type="text"
                value={newEntry.notes}
                onChange={(e) => setNewEntry({ ...newEntry, notes: e.target.value })}
                className={`w-full rounded-lg h-10 border ${colors.border} px-3 focus:ring-1 focus:ring-[#e67e5a] focus:border-[#e67e5a]`}
                placeholder="Optional notes"
              />
            </div>
          </div>

          <div className="mt-4 flex justify-end">
            <button
              onClick={handleAddEntry}
              disabled={!newEntry.gallons || !newEntry.price || !newEntry.odometer}
              className={`${colors.buttonPrimary} ${colors.buttonText} py-2 px-6 rounded-lg disabled:opacity-50`}
            >
              Save Entry
            </button>
          </div>
        </div>
      )}

      <div className="p-6">
        {/* Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className={`p-4 rounded-lg ${colors.secondaryBg} border ${colors.border}`}>
            <div className="flex justify-between items-start">
              <div>
                <p className={`text-sm ${colors.secondaryText}`}>Fuel Efficiency</p>
                <p className="text-2xl font-bold">{mpg.toFixed(1)} MPG</p>
              </div>
              <div className={`p-2 rounded-full ${mpg > 25 ? "bg-green-100" : "bg-yellow-100"}`}>
                {mpg > 25 ? (
                  <TrendingUp className="h-5 w-5 text-green-600" />
                ) : (
                  <TrendingDown className="h-5 w-5 text-yellow-600" />
                )}
              </div>
            </div>
            <div className="mt-2 text-xs text-gray-500">{mpg > 25 ? "Above average" : "Below average"}</div>
          </div>

          <div className={`p-4 rounded-lg ${colors.secondaryBg} border ${colors.border}`}>
            <div className="flex justify-between items-start">
              <div>
                <p className={`text-sm ${colors.secondaryText}`}>Cost Per Mile</p>
                <p className="text-2xl font-bold">${costPerMile.toFixed(2)}</p>
              </div>
              <div className={`p-2 rounded-full ${costPerMile < 0.15 ? "bg-green-100" : "bg-yellow-100"}`}>
                <DollarSign className={`h-5 w-5 ${costPerMile < 0.15 ? "text-green-600" : "text-yellow-600"}`} />
              </div>
            </div>
            <div className="mt-2 text-xs text-gray-500">
              {costPerMile < 0.15 ? "Good efficiency" : "Room for improvement"}
            </div>
          </div>

          <div className={`p-4 rounded-lg ${colors.secondaryBg} border ${colors.border}`}>
            <div className="flex justify-between items-start">
              <div>
                <p className={`text-sm ${colors.secondaryText}`}>Total Spent</p>
                <p className="text-2xl font-bold">${totalSpent.toFixed(2)}</p>
              </div>
              <div className={`p-2 rounded-full ${colors.buttonSecondary}`}>
                <DollarSign className={`h-5 w-5 ${colors.highlight}`} />
              </div>
            </div>
            <div className="mt-2 text-xs text-gray-500">Last {entries.length} fill-ups</div>
          </div>

          <div className={`p-4 rounded-lg ${colors.secondaryBg} border ${colors.border}`}>
            <div className="flex justify-between items-start">
              <div>
                <p className={`text-sm ${colors.secondaryText}`}>Avg. Price/Gallon</p>
                <p className="text-2xl font-bold">${avgPrice.toFixed(2)}</p>
              </div>
              <div className={`p-2 rounded-full ${colors.buttonSecondary}`}>
                <BarChart4 className={`h-5 w-5 ${colors.highlight}`} />
              </div>
            </div>
            <div className="mt-2 text-xs text-gray-500">
              {avgPrice < 3.5 ? "Below market average" : "Above market average"}
            </div>
          </div>
        </div>

        {/* Fuel Entries Table */}
        <div className={`rounded-lg border ${colors.border} overflow-hidden`}>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className={colors.secondaryBg}>
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Date
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Gallons
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Price/Gal
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Total
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Odometer
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Notes
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {entries.map((entry) => (
                <tr key={entry.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{new Date(entry.date).toLocaleDateString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{entry.gallons.toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">${entry.price.toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    ${(entry.gallons * entry.price).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{entry.odometer.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{entry.notes || "-"}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                    <button onClick={() => handleDeleteEntry(entry.id)} className="text-red-500 hover:text-red-700">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {entries.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No fuel entries yet. Add your first fill-up to start tracking.</p>
          </div>
        )}
      </div>
    </div>
  )
}

