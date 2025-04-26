"use client"

import { Button } from "@/components/ui/button"
import { Plus, Filter, Search } from "lucide-react"
import Link from "next/link"

export function RotationWorkflowsDashboard() {
  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-semibold text-white">Rotation Workflows</h1>
          <p className="text-gray-400">Manage your API key rotation processes</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative flex-1 md:w-64 md:flex-none">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search workflows..."
              className="w-full rounded-md border border-[#343B4F] bg-[#0D0D14] py-2 pl-10 pr-4 text-white placeholder-gray-500 focus:border-[#6B5EFF] focus:outline-none focus:ring-1 focus:ring-[#6B5EFF]"
            />
          </div>
          <Link href="/rotation-workflows/create">
            <Button className="whitespace-nowrap bg-[#6B5EFF] px-4 py-2 text-white hover:bg-[#5A4FD9]">
              <Plus className="mr-2 h-4 w-4" /> New Workflow
            </Button>
          </Link>
        </div>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatusCard title="Total Workflows" count={3} description="Across all platforms" />
        <StatusCard title="In Progress" count={1} description="Currently running" textColor="text-[#7B9CFF]" />
        <StatusCard title="Completed" count={2} description="Successfully rotated" textColor="text-[#21D07A]" />
        <StatusCard title="Failed" count={0} description="No failed workflows" textColor="text-[#FF4473]" />
      </div>

      {/* Workflows Table */}
      <div className="overflow-hidden rounded-lg bg-[#171723]">
        <div className="flex items-center justify-between border-b border-[#343B4F] p-4">
          <h2 className="text-lg font-medium text-white">Your Workflows</h2>
          <Button variant="outline" className="border-[#343B4F] bg-[#1E1E2D] text-white hover:bg-[#2B3B64]">
            <Filter className="mr-2 h-4 w-4" /> Filter
          </Button>
        </div>
        <div className="p-4">
          <div className="rounded-lg bg-[#1E1E2D] p-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="mb-4 md:mb-0">
                <h3 className="font-medium text-white">Datadog API Key Rotation</h3>
                <p className="text-sm text-gray-400">Created 2 days ago • Last run: Today</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="rounded-full bg-[#2B3B64] px-3 py-1 text-sm text-[#7B9CFF]">In Progress</div>
                <Link href="/rotation-workflows/workflow-123">
                  <Button className="bg-[#2B3B64] text-white hover:bg-[#23395D]">View</Button>
                </Link>
              </div>
            </div>
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
