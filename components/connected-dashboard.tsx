"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { usePlatforms } from "@/context/platform-context"
import { Button } from "@/components/ui/button"
import { Search, ChevronDown, ListOrderedIcon as SortIcon, XIcon, AlertTriangle } from "lucide-react"
import Link from "next/link"

type FilterType = "Platform" | "Status" | "Age" | "Risk Level"
type SortDirection = "asc" | "desc"
type SortField = "name" | "platform" | "created" | "lastUsed" | "age" | "risk" | "status"

interface ConnectedDashboardProps {
  userRules?: {
    platformRules: Array<{
      id: number
      name: string
      description: string
      isActive: boolean
    }>
    securityPolicies: Array<{
      id: number
      name: string
      description: string
      isActive: boolean
    }>
  }
}

// Updated mock data to match the image
const apiKeys = [
  {
    id: "1",
    name: "Datadog API Key",
    description: "Primary API Key",
    platform: "Datadog",
    platformColor: "bg-[#394EEA]", // Updated to match the image
    created: "Jun 3, 2024",
    lastUsed: "Today",
    age: "324d",
    risk: "High",
    status: "Rotate Now",
    action: "Rotate",
    hasWarning: true,
  },
]

export function ConnectedDashboard({ userRules }: ConnectedDashboardProps) {
  const { platforms } = usePlatforms()
  const [searchQuery, setSearchQuery] = useState("")
  const [activeFilters, setActiveFilters] = useState<Record<FilterType, string | null>>({
    Platform: null,
    Status: null,
    Age: null,
    "Risk Level": null,
  })
  const [sortField, setSortField] = useState<SortField | null>(null)
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc")

  const [showSortOptions, setShowSortOptions] = useState(false)
  const [filteredKeys, setFilteredKeys] = useState(apiKeys)
  const [isFiltering, setIsFiltering] = useState(false)

  // Calculate counts for filter options
  const platformCounts = {
    Datadog: apiKeys.filter((key) => key.platform === "Datadog").length,
    Grafana: apiKeys.filter((key) => key.platform === "Grafana").length,
    "New Relic": apiKeys.filter((key) => key.platform === "New Relic").length,
  }

  const statusCounts = {
    Healthy: apiKeys.filter((key) => key.status === "Healthy").length,
    "Rotate Now": apiKeys.filter((key) => key.status === "Rotate Now").length,
    "In Progress": apiKeys.filter((key) => key.status === "In Progress").length,
  }

  const riskCounts = {
    Low: apiKeys.filter((key) => key.risk === "Low").length,
    Medium: apiKeys.filter((key) => key.risk === "Medium").length,
    High: apiKeys.filter((key) => key.risk === "High").length,
  }

  // Effect to filter and sort keys when filters or sort options change
  useEffect(() => {
    // Use a stable reference for the filtering function
    const filterAndSortData = () => {
      setIsFiltering(true)

      // Create a new array instead of mutating the original
      let result = [...apiKeys]

      // Apply search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase()
        result = result.filter(
          (key) =>
            key.name.toLowerCase().includes(query) ||
            key.description.toLowerCase().includes(query) ||
            key.platform.toLowerCase().includes(query),
        )
      }

      // Apply dropdown filters
      if (activeFilters.Platform) {
        result = result.filter((key) => key.platform === activeFilters.Platform)
      }

      if (activeFilters.Status) {
        result = result.filter((key) => key.status === activeFilters.Status)
      }

      if (activeFilters.Age) {
        // Parse age filter
        if (activeFilters.Age === "< 30 days") {
          result = result.filter((key) => Number.parseInt(key.age) < 30)
        } else if (activeFilters.Age === "30-90 days") {
          result = result.filter((key) => {
            const age = Number.parseInt(key.age)
            return age >= 30 && age <= 90
          })
        } else if (activeFilters.Age === "> 90 days") {
          result = result.filter((key) => Number.parseInt(key.age) > 90)
        }
      }

      if (activeFilters["Risk Level"]) {
        result = result.filter((key) => key.risk === activeFilters["Risk Level"])
      }

      // Apply sorting
      if (sortField) {
        result.sort((a, b) => {
          let valueA = a[sortField]
          let valueB = b[sortField]

          // Special handling for age (remove 'd' and convert to number)
          if (sortField === "age") {
            valueA = Number.parseInt(valueA)
            valueB = Number.parseInt(valueB)
          }

          if (valueA < valueB) return sortDirection === "asc" ? -1 : 1
          if (valueA > valueB) return sortDirection === "asc" ? 1 : -1
          return 0
        })
      }

      return result
    }

    // Use requestAnimationFrame to prevent layout thrashing
    const updateFilteredKeys = () => {
      setIsFiltering(true)

      // Use requestAnimationFrame to ensure smooth updates
      requestAnimationFrame(() => {
        const filteredResults = filterAndSortData()
        setFilteredKeys(filteredResults)
        setIsFiltering(false)
      })
    }

    updateFilteredKeys()

    // Clear any existing timers to prevent memory leaks
    return () => {
      setIsFiltering(false)
    }
  }, [activeFilters, sortField, sortDirection, searchQuery])

  // Mock data for the dashboard
  const totalKeys = 42
  const needRotation = 8
  const inProgress = 3
  const healthy = 31

  const toggleFilter = (type: FilterType, value: string) => {
    setActiveFilters((prev) => ({
      ...prev,
      [type]: prev[type] === value ? null : value,
    }))
  }

  const clearFilters = () => {
    setActiveFilters({
      Platform: null,
      Status: null,
      Age: null,
      "Risk Level": null,
    })
  }

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-semibold text-white">Platform settings</h1>
          <p className="text-gray-400">Manage your observability platform connections</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative flex-1 md:w-64 md:flex-none">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search keys..."
              className="w-full rounded-md border border-[#343B4F] bg-[#0D0D14] py-2 pl-10 pr-4 text-white placeholder-gray-500 focus:border-[#6B5EFF] focus:outline-none focus:ring-1 focus:ring-[#6B5EFF]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Link href="/platform-settings/add">
            <Button>+ Add Platform</Button>
          </Link>
        </div>
      </div>

      {userRules && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4 text-white">Applicable Rules</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-800 rounded-lg p-4">
              <h4 className="text-md font-medium mb-2 text-white">Platform Rules</h4>
              <ul className="space-y-2">
                {userRules.platformRules.map((rule) => (
                  <li key={rule.id} className="flex items-start">
                    <div
                      className={`w-2 h-2 mt-1.5 rounded-full ${rule.isActive ? "bg-green-500" : "bg-gray-500"} mr-2`}
                    ></div>
                    <div>
                      <p className="text-sm font-medium text-white">{rule.name}</p>
                      <p className="text-xs text-gray-400">{rule.description}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-gray-800 rounded-lg p-4">
              <h4 className="text-md font-medium mb-2 text-white">Security Policies</h4>
              <ul className="space-y-2">
                {userRules.securityPolicies.map((policy) => (
                  <li key={policy.id} className="flex items-start">
                    <div
                      className={`w-2 h-2 mt-1.5 rounded-full ${policy.isActive ? "bg-green-500" : "bg-gray-500"} mr-2`}
                    ></div>
                    <div>
                      <p className="text-sm font-medium text-white">{policy.name}</p>
                      <p className="text-xs text-gray-400">{policy.description}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Status Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatusCard
          title="Total Keys"
          count={totalKeys}
          description={`Across ${platforms.length} platforms`}
          textColor="text-white"
        />
        <StatusCard
          title="Need Rotation"
          count={needRotation}
          description="keys older than 180 days"
          textColor="text-[#FF4473]"
        />
        <StatusCard
          title="In Progress"
          count={inProgress}
          description="Active rotation workflows"
          textColor="text-[#FFB800]"
        />
        <StatusCard title="Healthy" count={healthy} description="Keys with no issues" textColor="text-[#21D07A]" />
      </div>

      {/* Enhanced Filters */}
      <div className="rounded-lg bg-[#171723] p-4">
        <div className="flex flex-col space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-white">Filters:</span>
              <span className="text-xs text-gray-400">
                {Object.values(activeFilters).filter(Boolean).length > 0
                  ? `${Object.values(activeFilters).filter(Boolean).length} active`
                  : "None active"}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={clearFilters}
                className={`text-sm text-gray-400 hover:text-white transition-colors ${
                  Object.values(activeFilters).filter(Boolean).length === 0 ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={Object.values(activeFilters).filter(Boolean).length === 0}
              >
                Clear all
              </button>
              <Button
                variant="secondary"
                onClick={clearFilters}
                disabled={Object.values(activeFilters).filter(Boolean).length === 0}
              >
                Clear Filters
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <FilterDropdown
              type="Platform"
              options={["Datadog", "Grafana", "New Relic"]}
              activeValue={activeFilters.Platform}
              onSelect={(value) => toggleFilter("Platform", value)}
              count={platformCounts}
            />
            <FilterDropdown
              type="Status"
              options={["Healthy", "Rotate Now", "In Progress"]}
              activeValue={activeFilters.Status}
              onSelect={(value) => toggleFilter("Status", value)}
              count={statusCounts}
            />
            <FilterDropdown
              type="Age"
              options={["< 30 days", "30-90 days", "> 90 days"]}
              activeValue={activeFilters.Age}
              onSelect={(value) => toggleFilter("Age", value)}
            />
            <FilterDropdown
              type="Risk Level"
              options={["Low", "Medium", "High"]}
              activeValue={activeFilters["Risk Level"]}
              onSelect={(value) => toggleFilter("Risk Level", value)}
              count={riskCounts}
            />

            <div className="relative ml-auto">
              <button
                onClick={() => setShowSortOptions(!showSortOptions)}
                className="flex items-center gap-1 rounded-md bg-[#1E1E2D] px-3 py-2 text-sm text-white hover:bg-[#2B3B64]"
              >
                <SortIcon className="h-4 w-4" />
                <span>Sort by</span>
                <ChevronDown className="h-3 w-3" />
              </button>

              {showSortOptions && (
                <div className="absolute right-0 top-full z-10 mt-1 w-48 rounded-md border border-[#343B4F] bg-[#1E1E2D] py-1 shadow-lg">
                  {[
                    { field: "name", label: "Name" },
                    { field: "platform", label: "Platform" },
                    { field: "created", label: "Created Date" },
                    { field: "age", label: "Age" },
                    { field: "risk", label: "Risk Level" },
                  ].map((option) => (
                    <button
                      key={option.field}
                      onClick={() => {
                        handleSort(option.field as SortField)
                        setShowSortOptions(false)
                      }}
                      className={`flex w-full items-center justify-between px-4 py-2 text-left text-sm hover:bg-[#2B3B64] ${
                        sortField === option.field ? "bg-[#2B3B64] text-white" : "text-gray-300"
                      }`}
                    >
                      <span>{option.label}</span>
                      {sortField === option.field && <span>{sortDirection === "asc" ? "↑" : "↓"}</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Active filters display */}
          {Object.entries(activeFilters).some(([_, value]) => value !== null) && (
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <span className="text-xs text-gray-400">Active filters:</span>
              {Object.entries(activeFilters).map(
                ([key, value]) =>
                  value && (
                    <div
                      key={`${key}-${value}`}
                      className="flex items-center gap-1 rounded-full bg-[#2B3B64] px-2 py-1 text-xs text-white"
                    >
                      <span>
                        {key}: {value}
                      </span>
                      <button
                        onClick={() => toggleFilter(key as FilterType, value)}
                        className="ml-1 rounded-full hover:bg-[#3B4B74] p-0.5"
                      >
                        <XIcon className="h-3 w-3" />
                      </button>
                    </div>
                  ),
              )}
            </div>
          )}
        </div>
      </div>

      {/* API Keys Table - Updated to match the image */}
      <div className="overflow-hidden rounded-lg bg-[#0F0F17] table-container">
        <div className="overflow-x-auto table-fixed-height">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-[#1E1E2D] bg-[#0F0F17]">
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Name</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Platform</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Created</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Last Used</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Age</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Risk</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Status</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E1E2D]">
              {isFiltering ? (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="mb-2 h-6 w-6 animate-spin rounded-full border-2 border-t-transparent border-white"></div>
                      <span className="text-sm text-gray-400">Filtering results...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredKeys.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <span className="text-sm text-gray-400">No results match your filters</span>
                      <button onClick={clearFilters} className="mt-2 text-sm text-[#6B5EFF] hover:underline">
                        Clear all filters
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredKeys.map((key) => (
                  <tr key={key.id} className="border-b border-[#1E1E2D] last:border-0 transition-none">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="mr-2 flex flex-col">
                          <div className="font-medium text-white">{key.name}</div>
                          <div className="text-sm text-gray-400">{key.description}</div>
                        </div>
                        {key.hasWarning && <AlertTriangle className="h-4 w-4 text-[#FF4473]" />}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div
                        className="inline-flex items-center rounded-full px-3 py-1"
                        style={{ backgroundColor: "rgba(57, 78, 234, 0.2)" }}
                      >
                        <span className="text-sm text-white">{key.platform}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-400">{key.created}</td>
                    <td className="px-6 py-4 text-sm text-gray-400">{key.lastUsed}</td>
                    <td className="px-6 py-4 text-sm font-medium text-[#FF4473]">{key.age}</td>
                    <td className="px-6 py-4">
                      <RiskBadge risk={key.risk as "Low" | "Medium" | "High"} />
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={key.status as "Healthy" | "Rotate Now" | "In Progress"} />
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center justify-center rounded-full bg-[#FF4473] px-4 py-1 text-sm font-medium text-white hover:bg-[#FF4473]/90">
                        {key.action}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between border-t border-[#1E1E2D] px-6 py-3">
          <div className="text-sm text-gray-400">
            {`Showing 1 - ${Math.min(filteredKeys.length, filteredKeys.length)} of ${filteredKeys.length} items`}
          </div>
        </div>
      </div>
    </div>
  )
}

interface StatusCardProps {
  title: string
  count: number
  description: string
  textColor?: string
}

function StatusCard({ title, count, description, textColor = "text-white" }: StatusCardProps) {
  return (
    <div className="flex flex-col rounded-lg bg-[#171723] p-4 text-white">
      <h3 className="mb-3 font-medium">{title}</h3>
      <p className={`mb-3 text-4xl font-semibold ${textColor}`}>{count}</p>
      <p className="text-sm text-gray-400">{description}</p>
    </div>
  )
}

interface FilterDropdownProps {
  type: FilterType
  options: string[]
  activeValue: string | null
  onSelect: (value: string) => void
  count?: Record<string, number>
}

function FilterDropdown({ type, options, activeValue, onSelect, count }: FilterDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 rounded-md ${
          activeValue ? "bg-[#2B3B64] text-white" : "bg-[#1E1E2D] text-white hover:bg-[#2B3B64]"
        } px-3 py-2 text-sm transition-colors`}
      >
        <span>{activeValue || type}</span>
        {activeValue && (
          <div className="flex h-4 w-4 items-center justify-center rounded-full bg-[#6B5EFF] text-xs text-white">1</div>
        )}
        <ChevronDown className="h-4 w-4" />
      </button>
      {isOpen && (
        <div className="absolute left-0 top-full z-10 mt-1 w-48 rounded-md border border-[#343B4F] bg-[#1E1E2D] py-1 shadow-lg">
          {options.map((option) => (
            <button
              key={option}
              onClick={() => {
                onSelect(option)
                setIsOpen(false)
              }}
              className={`flex w-full items-center justify-between px-4 py-2 text-left text-sm hover:bg-[#2B3B64] ${
                activeValue === option ? "bg-[#2B3B64] text-white" : "text-gray-300"
              }`}
            >
              <span>{option}</span>
              {count && (
                <span className="rounded-full bg-[#343B4F] px-2 py-0.5 text-xs text-gray-400">
                  {count[option] || 0}
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// Updated RiskBadge to match the image
function RiskBadge({ risk }: { risk: "Low" | "Medium" | "High" }) {
  const bgColor = {
    Low: "bg-[#2B3B64]",
    Medium: "bg-[#8C6D1F]",
    High: "bg-[#FF4473]/20", // Updated to match the image
  }[risk]

  const textColor = {
    Low: "text-[#7B9CFF]",
    Medium: "text-[#FFB800]",
    High: "text-[#FF4473]", // Updated to match the image
  }[risk]

  return <div className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${bgColor} ${textColor}`}>{risk}</div>
}

// Updated StatusBadge to match the image
function StatusBadge({ status }: { status: "Healthy" | "Rotate Now" | "In Progress" }) {
  const bgColor = {
    Healthy: "bg-[#1F4E3A]",
    "Rotate Now": "bg-[#FFB800]/20", // Updated to match the image
    "In Progress": "bg-[#2B3B64]",
  }[status]

  const textColor = {
    Healthy: "text-[#21D07A]",
    "Rotate Now": "text-[#FFB800]", // Updated to match the image
    "In Progress": "text-[#7B9CFF]",
  }[status]

  return (
    <div className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${bgColor} ${textColor}`}>{status}</div>
  )
}

function PaginationButton({ children, active = false }: { children: React.ReactNode; active?: boolean }) {
  return (
    <button
      className={`rounded-md px-3 py-1 text-sm ${
        active ? "bg-[#6B5EFF] text-white" : "bg-[#1E1E2D] text-gray-400 hover:bg-[#2B3B64] hover:text-white"
      }`}
    >
      {children}
    </button>
  )
}
