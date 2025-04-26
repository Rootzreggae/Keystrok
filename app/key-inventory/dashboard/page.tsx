"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { KeyInventoryDashboard } from "@/components/key-inventory-dashboard"
import { KeyInventoryEmptyState } from "@/components/key-inventory-empty-state"
import { usePlatforms } from "@/context/platform-context"
import { useEffect, useState } from "react"

export default function KeyInventoryDashboardPage() {
  const { hasPlatforms, platforms, lastUpdated } = usePlatforms()
  const [key, setKey] = useState(0)

  // Force a re-render when platforms change or when lastUpdated changes
  useEffect(() => {
    setKey((prevKey) => prevKey + 1)
  }, [platforms, lastUpdated])

  return (
    <DashboardLayout>{hasPlatforms ? <KeyInventoryDashboard key={key} /> : <KeyInventoryEmptyState />}</DashboardLayout>
  )
}
