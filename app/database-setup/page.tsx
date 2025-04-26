"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { DatabaseSeeder } from "@/components/database-seeder"
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabase"
import Link from "next/link"

export default function DatabaseSetupPage() {
  const [counts, setCounts] = useState<{
    platforms: number
    apiKeys: number
    workflows: number
    activities: number
  }>({
    platforms: 0,
    apiKeys: 0,
    workflows: 0,
    activities: 0,
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function checkDatabase() {
      try {
        setIsLoading(true)

        // Get counts from each table
        const [platformsResult, keysResult, workflowsResult, activitiesResult] = await Promise.all([
          supabase.from("platforms").select("id", { count: "exact", head: true }),
          supabase.from("api_keys").select("id", { count: "exact", head: true }),
          supabase.from("rotation_workflows").select("id", { count: "exact", head: true }),
          supabase.from("activities").select("id", { count: "exact", head: true }),
        ])

        setCounts({
          platforms: platformsResult.count || 0,
          apiKeys: keysResult.count || 0,
          workflows: workflowsResult.count || 0,
          activities: activitiesResult.count || 0,
        })
      } catch (error) {
        console.error("Error checking database:", error)
      } finally {
        setIsLoading(false)
      }
    }

    checkDatabase()
  }, [])

  const isDatabaseEmpty =
    counts.platforms === 0 && counts.apiKeys === 0 && counts.workflows === 0 && counts.activities === 0

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="text-2xl font-semibold text-white">Database Setup</h1>
            <p className="text-gray-400">Set up and seed your Keystrok database</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-4 rounded-lg bg-gray-800 p-6">
            <h2 className="text-xl font-semibold text-white">Database Status</h2>

            {isLoading ? (
              <div className="text-gray-400">Checking database status...</div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Platforms:</span>
                  <span className="font-medium text-white">{counts.platforms}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">API Keys:</span>
                  <span className="font-medium text-white">{counts.apiKeys}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Workflows:</span>
                  <span className="font-medium text-white">{counts.workflows}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Activities:</span>
                  <span className="font-medium text-white">{counts.activities}</span>
                </div>

                <div className="pt-2">
                  <div
                    className={`rounded-md p-3 ${isDatabaseEmpty ? "bg-yellow-900/20 text-yellow-500" : "bg-green-900/20 text-green-500"}`}
                  >
                    {isDatabaseEmpty
                      ? "Database is empty. Use the seeder to populate it with sample data."
                      : "Database contains data. You can explore the application features."}
                  </div>
                </div>
              </div>
            )}

            <div className="pt-4">
              <h3 className="mb-2 font-medium text-white">Explore Features</h3>
              <div className="flex flex-wrap gap-2">
                <Link href="/key-inventory/database">
                  <Button variant="outline" size="sm">
                    Key Inventory
                  </Button>
                </Link>
                <Link href="/platform-settings">
                  <Button variant="outline" size="sm">
                    Platform Settings
                  </Button>
                </Link>
                <Link href="/rotation-workflows">
                  <Button variant="outline" size="sm">
                    Rotation Workflows
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          <DatabaseSeeder />
        </div>
      </div>
    </DashboardLayout>
  )
}
