"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { KeyInventoryWithDb } from "@/components/key-inventory-with-db"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function KeyInventoryDatabasePage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="text-2xl font-semibold text-white">Key Inventory (Database)</h1>
            <p className="text-gray-400">Manage your API keys using Supabase database</p>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/key-inventory">
              <Button variant="outline">Back to Key Inventory</Button>
            </Link>
          </div>
        </div>

        <KeyInventoryWithDb />
      </div>
    </DashboardLayout>
  )
}
