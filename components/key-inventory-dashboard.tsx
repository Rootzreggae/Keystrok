"use client"

import { useState, useEffect, useMemo } from "react"
import { usePlatforms } from "@/context/platform-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, ChevronDown, X, SlidersHorizontal } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

type FilterType = "Platform" | "Status" | "Age" | "Risk Level"
type SortDirection = "asc" | "desc"
type SortField = "name" | "platform" | "created" | "lastUsed" | "age" | "risk" | "status"

// Define the API key type
interface ApiKey {
  id: string
  name: string
  description: string
  platform: string
  platformId: string
  platformColor: string
  created: string
  lastUsed: string
  age: string
  risk: "Low" | "Medium" | "High"
  status: "Healthy" | "Rotate Now" | "In Progress"
  action: "Rotate" | "View"
  isNew?: boolean
}

// Define a mock workflow type for checking existing workflows
interface Workflow {
  id: string
  name: string
  keyName: string
}

export function KeyInventoryDashboard() {
  const { platforms, lastUpdated } = usePlatforms()
  const router = useRouter()
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
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([])
  const [filteredKeys, setFilteredKeys] = useState<ApiKey[]>([])
  const [isFiltering, setIsFiltering] = useState(false)
  const [newKeyIds, setNewKeyIds] = useState<Set<string>>(new Set())
  const [initialLoadComplete, setInitialLoadComplete] = useState(false)

  // Mock workflows data - in a real app, this would come from an API or context
  const [workflows, setWorkflows] = useState<Workflow[]>([
    { id: "workflow-123", name: "Production API Key Rotation", keyName: "Production API Key" },
    { id: "workflow-456", name: "Dev Environment Rotation", keyName: "Dev Environment" },
  ])

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)

  // Calculate counts for filters
  const platformCounts = useMemo(() => {
    return apiKeys.reduce((acc: Record<string, number>, key) => {
      acc[key.platform] = (acc[key.platform] || 0) + 1
      return acc
    }, {})
  }, [apiKeys])

  const statusCounts = useMemo(() => {
    return apiKeys.reduce((acc: Record<string, number>, key) => {
      acc[key.status] = (acc[key.status] || 0) + 1
      return acc
    }, {})
  }, [apiKeys])

  const riskCounts = useMemo(() => {
    return apiKeys.reduce((acc: Record<string, number>, key) => {
      acc[key.risk] = (acc[key.risk] || 0) + 1
      return acc
    }, {})
  }, [apiKeys])

  // Function to check if a workflow exists for a given key name
  const findWorkflowForKey = (keyName: string): Workflow | undefined => {
    return workflows.find((workflow) => workflow.keyName === keyName)
  }

  // Function to handle action button clicks
  const handleActionClick = (key: ApiKey) => {
    // Check if we have a workflow for this key
    const existingWorkflow = findWorkflowForKey(key.name)

    // Store the key info in localStorage for potential use in workflow creation
    localStorage.setItem("selected-key", JSON.stringify(key))

    if (existingWorkflow) {
      // If a workflow exists, navigate to that specific workflow
      router.push(`/rotation-workflows/${existingWorkflow.id}`)
    } else {
      // If no workflow exists, navigate to the rotation workflows section
      // Set a flag in localStorage to indicate we're coming from key inventory
      localStorage.setItem("from-key-inventory", "true")
      router.push("/rotation-workflows")

      // If the key status is "Rotate Now", we might want to automatically start workflow creation
      if (key.status === "Rotate Now") {
        localStorage.setItem("auto-start-rotation", "true")
      }
    }
  }

  // Generate API keys based on connected platforms - EXACTLY ONE KEY PER PLATFORM
  useEffect(() => {
    // If there are no platforms, clear the keys and return early
    if (platforms.length === 0) {
      setApiKeys([])
      setFilteredKeys([])
      setInitialLoadComplete(true)
      return
    }

    // Create a map of existing keys by platformId for quick lookup
    const existingKeysByPlatform = new Map<string, ApiKey>()
    apiKeys.forEach((key) => {
      existingKeysByPlatform.set(key.platformId, key)
    })

    // Create a new array to hold all keys
    const updatedKeys: ApiKey[] = []
    const newKeyIdsSet = new Set<string>()

    // Process each platform - ensure exactly one key per platform
    platforms.forEach((platform) => {
      // Check if we already have a key for this platform
      if (existingKeysByPlatform.has(platform.id)) {
        // Keep the existing key
        updatedKeys.push(existingKeysByPlatform.get(platform.id)!)
      } else {
        // This is a new platform, create exactly one key for it
        const newId = crypto.randomUUID()

        // Generate random creation date (between 1 and 400 days ago)
        const daysAgo = Math.floor(Math.random() * 400) + 1
        const creationDate = new Date()
        creationDate.setDate(creationDate.getDate() - daysAgo)

        // Format the creation date
        const created = creationDate.toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })

        // Format the last used date
        const lastUsed = `Today, ${new Date().getHours()}:${String(new Date().getMinutes()).padStart(2, "0")} ${new Date().getHours() >= 12 ? "PM" : "AM"}`

        // Determine risk level based on age
        let risk: "Low" | "Medium" | "High" = "Low"
        let status: "Healthy" | "Rotate Now" | "In Progress" = "Healthy"

        if (daysAgo > 180) {
          risk = "High"
          status = "Rotate Now"
        } else if (daysAgo > 90) {
          risk = "Medium"
          status = Math.random() > 0.5 ? "Rotate Now" : "In Progress"
        }

        const newKey: ApiKey = {
          id: newId,
          name: `${platform.name} API Key`,
          description: "Primary API Key",
          platform: platform.name,
          platformId: platform.id,
          platformColor: platform.iconColor,
          created,
          lastUsed,
          age: `${daysAgo}d`,
          risk,
          status,
          action: status === "Rotate Now" ? "Rotate" : "View",
          isNew: true,
        }

        updatedKeys.push(newKey)
        newKeyIdsSet.add(newId)
      }
    })

    // Update the state with the new keys
    setApiKeys(updatedKeys)
    setFilteredKeys(updatedKeys)
    setNewKeyIds(newKeyIdsSet)
    setInitialLoadComplete(true)

    // Clear the "new" flag after 3 seconds
    if (newKeyIdsSet.size > 0) {
      const timerId = setTimeout(() => {
        setNewKeyIds(new Set())
      }, 3000)

      // Clean up the timer
      return () => clearTimeout(timerId)
    }
  }, [platforms, lastUpdated]) // Remove apiKeys from dependency array

  // Effect to filter and sort keys when filters or sort options change
  useEffect(() => {
    if (!initialLoadComplete) return

    if (searchQuery.trim() !== "" || Object.values(activeFilters).some(Boolean) || sortField !== null) {
      setIsFiltering(true)
    }

    // Apply filters
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

    // Reset to first page when filters change
    setCurrentPage(1)

    // Add a small delay to simulate processing for better UX
    const timer = setTimeout(() => {
      setFilteredKeys(result)
      setIsFiltering(false)
    }, 300)

    return () => clearTimeout(timer)
  }, [activeFilters, sortField, sortDirection, searchQuery, initialLoadComplete, apiKeys]) // Explicitly list all dependencies

  // Calculate summary statistics
  const totalKeys = apiKeys.length
  const needRotation = apiKeys.filter((key) => key.status === "Rotate Now").length
  const inProgress = apiKeys.filter((key) => key.status === "In Progress").length
  const healthy = apiKeys.filter((key) => key.status === "Healthy").length

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
    setSearchQuery("")
  }

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  // Get current items for pagination
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredKeys.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredKeys.length / itemsPerPage)

  // Get row background color based on risk
  const getRowBgColor = (risk: "Low" | "Medium" | "High") => {
    switch (risk) {
      case "High":
        return "bg-[rgba(250,0,62,0.10)]"
      case "Medium":
        return "bg-[rgba(232,185,49,0.10)]"
      case "Low":
        return "bg-[rgba(75,123,236,0.10)]"
      default:
        return "bg-[rgba(75,123,236,0.10)]"
    }
  }

  // Get color for risk badge
  const getRiskBadgeColors = (risk: "Low" | "Medium" | "High") => {
    switch (risk) {
      case "Low":
        return {
          bg: "bg-[#4682B4]/30", // Steel blue for Low
          text: "text-[#87CEEB]", // Sky blue text
        }
      case "Medium":
        return {
          bg: "bg-[#DAA520]/30", // Golden for Medium
          text: "text-[#FFD700]", // Gold text
        }
      case "High":
        return {
          bg: "bg-[#DC143C]/30", // Crimson for High
          text: "text-white", // White text
        }
    }
  }

  // Get color for status badge
  const getStatusBadgeColors = (status: "Healthy" | "Rotate Now" | "In Progress") => {
    switch (status) {
      case "Healthy":
        return {
          bg: "bg-[#2E8B57]/30", // Sea green for Healthy
          text: "text-[#98FB98]", // Pale green text
        }
      case "Rotate Now":
        return {
          bg: "bg-[#B22222]/30", // Firebrick for Rotate Now
          text: "text-white", // White text
        }
      case "In Progress":
        return {
          bg: "bg-[#4682B4]/30", // Steel blue for In Progress
          text: "text-[#87CEEB]", // Sky blue text
        }
    }
  }

  // Get color for action button
  const getActionButtonColors = (action: "Rotate" | "View") => {
    switch (action) {
      case "Rotate":
        return action === "Rotate" ? "bg-[#FF1493] hover:bg-[#FF1493]/90 text-white" : "bg-white text-[#1E1E3A]"
      case "View":
        return "bg-[#87CEEB] hover:bg-[#87CEEB]/90 text-[#1E1E3A]"
    }
  }

  // Get color for age text
  const getAgeTextColor = (age: string) => {
    const days = Number.parseInt(age)
    if (days > 300) return "text-[#FF69B4]" // Hot pink for old keys
    if (days > 200) return "text-[#FFD700]" // Gold for medium-age keys
    return "text-[#87CEEB]" // Sky blue for newer keys
  }

  // Get platform badge color
  const getPlatformBadgeColor = (platform: string) => {
    switch (platform) {
      case "Datadog":
        return "bg-[#7B68EE]/30 text-white" // Purple for Datadog
      case "Grafana":
        return "bg-[#DAA520]/30 text-white" // Golden for Grafana
      case "New Relic":
        return "bg-[#4169E1]/30 text-white" // Royal Blue for New Relic
      default:
        return "bg-gray-600/30 text-white"
    }
  }

  // Check if platforms exist to determine button behavior
  const hasPlatforms = platforms.length > 0
  const addPlatformUrl = hasPlatforms ? "/platform-settings/add" : "/platform-settings"
  const addPlatformLabel = hasPlatforms ? "+ Add Platform" : "Connect Platform"

  return (
    <div className="w-full space-y-6">
      {/* Header Section */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-semibold text-white">Key Inventory</h1>
          <p className="text-gray-400">Manage your API keys across platforms</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative flex-1 md:w-64 md:flex-none">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Search keys..."
                className="w-full pl-10 bg-[#0D0D14] border-[#343B4F] text-white placeholder-gray-500 focus:border-[#6B5EFF]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
          <Link href={hasPlatforms ? "/platform-settings/add" : "/platform-settings"}>
            <Button>{hasPlatforms ? "+ Add Platform" : "Connect Platform"}</Button>
          </Link>
        </div>
      </div>

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
              <SlidersHorizontal className="h-4 w-4 text-gray-400" />
              <span className="text-sm font-medium text-white">Filters:</span>
              <span className="text-xs text-gray-400">
                {Object.values(activeFilters).filter(Boolean).length > 0
                  ? `${Object.values(activeFilters).filter(Boolean).length} active`
                  : "None active"}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                disabled={Object.values(activeFilters).filter(Boolean).length === 0 && !searchQuery}
                className="text-gray-400 hover:text-white disabled:opacity-50"
              >
                Clear all
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <FilterDropdown
              type="Platform"
              options={Object.keys(platformCounts)}
              activeValue={activeFilters.Platform}
              onSelect={(value) => toggleFilter("Platform", value)}
              count={platformCounts}
            />
            <FilterDropdown
              type="Status"
              options={Object.keys(statusCounts) as ("Healthy" | "Rotate Now" | "In Progress")[]}
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
              options={Object.keys(riskCounts) as ("Low" | "Medium" | "High")[]}
              activeValue={activeFilters["Risk Level"]}
              onSelect={(value) => toggleFilter("Risk Level", value)}
              count={riskCounts}
            />

            <div className="relative ml-auto">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowSortOptions(!showSortOptions)}
                className="flex items-center gap-1 bg-[#1E1E2D] border-[#343B4F] text-white hover:bg-[#2B3B64] hover:text-white"
              >
                <span>Sort by</span>
                <ChevronDown className="h-3 w-3 ml-1" />
              </Button>

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
          {(Object.values(activeFilters).some(Boolean) || searchQuery) && (
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <span className="text-xs text-gray-400">Active filters:</span>

              {searchQuery && (
                <div className="flex items-center gap-1 rounded-full bg-[#2B3B64] px-2 py-1 text-xs text-white">
                  <span>Search: {searchQuery}</span>
                  <button onClick={() => setSearchQuery("")} className="ml-1 rounded-full hover:bg-[#3B4B74] p-0.5">
                    <X className="h-3 w-3" />
                  </button>
                </div>
              )}

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
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ),
              )}
            </div>
          )}
        </div>
      </div>

      {/* API Keys Table - Redesigned to match the image */}
      <div className="rounded-lg bg-[#171821] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="bg-[#171821] text-gray-300">
              <tr>
                <th className="px-6 py-4 text-left font-medium">Name</th>
                <th className="px-6 py-4 text-left font-medium">Platform</th>
                <th className="px-6 py-4 text-left font-medium">Created</th>
                <th className="px-6 py-4 text-left font-medium">Last Used</th>
                <th className="px-6 py-4 text-left font-medium">Age</th>
                <th className="px-6 py-4 text-left font-medium">Risk</th>
                <th className="px-6 py-4 text-left font-medium">Status</th>
                <th className="px-6 py-4 text-left font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isFiltering ? (
                <tr>
                  <td colSpan={8} className="h-24 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="mb-2 h-6 w-6 animate-spin rounded-full border-2 border-t-transparent border-white"></div>
                      <span className="text-sm text-gray-400">Filtering results...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredKeys.length === 0 ? (
                <tr>
                  <td colSpan={8} className="h-24 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <span className="text-sm text-gray-400">No results match your filters</span>
                      <Button
                        variant="link"
                        onClick={clearFilters}
                        className="mt-2 text-[#6B5EFF] hover:text-[#5A4FD9]"
                      >
                        Clear all filters
                      </Button>
                    </div>
                  </td>
                </tr>
              ) : (
                currentItems.map((key, index) => (
                  <tr
                    key={key.id}
                    className={`${getRowBgColor(key.risk)} border-b border-[#343B4F]/30 ${newKeyIds.has(key.id) ? "animate-pulse" : ""}`}
                  >
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <div className="font-medium text-white">{key.name}</div>
                        <div className="text-sm text-gray-400">{key.description}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div
                        className={`inline-flex items-center rounded-full px-3 py-1 ${getPlatformBadgeColor(
                          key.platform,
                        )}`}
                      >
                        <span className="text-sm">{key.platform}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-300">{key.created}</td>
                    <td className="px-6 py-4 text-sm text-gray-300">{key.lastUsed}</td>
                    <td className={`px-6 py-4 text-sm font-medium ${getAgeTextColor(key.age)}`}>{key.age}</td>
                    <td className="px-6 py-4">
                      <div
                        className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${
                          getRiskBadgeColors(key.risk).bg
                        } ${getRiskBadgeColors(key.risk).text}`}
                      >
                        {key.risk}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div
                        className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${
                          getStatusBadgeColors(key.status).bg
                        } ${getStatusBadgeColors(key.status).text}`}
                      >
                        {key.status}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleActionClick(key)}
                        className={`rounded-md px-4 py-1 text-sm font-medium ${getActionButtonColors(key.action)} cursor-pointer transition-all duration-200 hover:shadow-md active:scale-95`}
                        aria-label={`${key.action} ${key.name}`}
                      >
                        {key.action}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination - Updated to match the image */}
        {!isFiltering && filteredKeys.length > 0 && (
          <div className="flex items-center justify-between border-t border-[#343B4F]/30 px-6 py-4">
            <div className="text-sm text-gray-400">
              {`Showing ${indexOfFirstItem + 1} - ${Math.min(
                indexOfLastItem,
                filteredKeys.length,
              )} of ${filteredKeys.length} keys`}
            </div>
            <div className="flex items-center gap-2">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`h-8 w-8 rounded-md flex items-center justify-center ${
                    currentPage === i + 1
                      ? "bg-[#6B5EFF] text-white"
                      : "bg-[#1E1E2D] text-gray-400 hover:bg-[#2B3B64] hover:text-white"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              {totalPages > 5 && (
                <>
                  <button className="h-8 w-8 rounded-md bg-[#1E1E2D] text-gray-400 flex items-center justify-center">
                    ...
                  </button>
                  <button
                    onClick={() => setCurrentPage(totalPages)}
                    className="h-8 w-8 rounded-md bg-[#1E1E2D] text-gray-400 hover:bg-[#2B3B64] hover:text-white flex items-center justify-center"
                  >
                    {totalPages}
                  </button>
                </>
              )}
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="rounded-md bg-[#1E1E2D] px-3 py-1 text-sm text-gray-400 hover:bg-[#2B3B64] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
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
