"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { usePlatforms } from "@/context/platform-context"
import { BarChart2, Key, RefreshCw, Settings, ArrowRight } from "lucide-react"
import Link from "next/link"

// Mock data for the dashboard
const apiKeys = [
  {
    id: "1",
    name: "Production API Key",
    description: "API Key",
    platform: "Datadog",
    platformColor: "bg-[#7C3AED]",
    created: "Jan 15, 2022",
    lastUsed: "Today, 10:42 AM",
    age: "395d",
    risk: "High",
    status: "Rotate Now",
    action: "Rotate",
  },
  {
    id: "2",
    name: "Grafana Admin",
    description: "Service Account",
    platform: "Grafana",
    platformColor: "bg-[#F46800]",
    created: "Jan 15, 2022",
    lastUsed: "Today, 10:42 AM",
    age: "395d",
    risk: "Medium",
    status: "Rotate Now",
    action: "Rotate",
  },
  {
    id: "3",
    name: "Dev Environment",
    description: "API Key",
    platform: "Datadog",
    platformColor: "bg-[#7C3AED]",
    created: "Jul 10, 2022",
    lastUsed: "Today, 9:22 AM",
    age: "218d",
    risk: "Low",
    status: "In Progress",
    action: "View",
  },
  {
    id: "4",
    name: "Monitoring Token",
    description: "API Key",
    platform: "New Relic",
    platformColor: "bg-[#4B7BEC]",
    created: "Oct 5, 2022",
    lastUsed: "Today, 9:22 AM",
    age: "218d",
    risk: "Low",
    status: "Healthy",
    action: "Rotate",
  },
]

export function DashboardSummary() {
  const { platforms } = usePlatforms()

  // Calculate summary statistics
  const totalKeys = apiKeys.length
  const needRotation = apiKeys.filter((key) => key.status === "Rotate Now").length
  const inProgress = apiKeys.filter((key) => key.status === "In Progress").length
  const healthy = apiKeys.filter((key) => key.status === "Healthy").length

  return (
    <div className="w-full space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">Dashboard</h1>
        <p className="text-gray-400">Overview of your API key management</p>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatusCard
          title="Total Keys"
          count={totalKeys}
          description={`Across ${platforms.length} platforms`}
          textColor="text-white"
          icon={<Key className="h-5 w-5 text-gray-400" />}
        />
        <StatusCard
          title="Need Rotation"
          count={needRotation}
          description="keys older than 180 days"
          textColor="text-[#FF4473]"
          icon={<RefreshCw className="h-5 w-5 text-[#FF4473]" />}
        />
        <StatusCard
          title="In Progress"
          count={inProgress}
          description="Active rotation workflows"
          textColor="text-[#FFB800]"
          icon={<BarChart2 className="h-5 w-5 text-[#FFB800]" />}
        />
        <StatusCard
          title="Healthy"
          count={healthy}
          description="Keys with no issues"
          textColor="text-[#21D07A]"
          icon={<CheckIcon className="h-5 w-5 text-[#21D07A]" />}
        />
      </div>

      {/* Key Inventory Section */}
      <div className="rounded-lg bg-[#171723] p-6">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <Key className="h-5 w-5 text-[#6B5EFF]" />
              <h2 className="text-xl font-semibold text-white">Key Inventory</h2>
            </div>
            <p className="text-gray-400">Manage your API keys across platforms</p>
          </div>
          <Link href="/key-inventory">
            <Button className="inline-flex items-center whitespace-nowrap transition-all duration-200 hover:bg-[#5A4FD9] active:bg-[#4A3FC9]">
              View All Keys <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="mt-6 overflow-hidden rounded-lg border border-[#343B4F]">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-[#343B4F] bg-[#1E1E2D]">
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Name</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Platform</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Age</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Risk</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Status</th>
              </tr>
            </thead>
            <tbody>
              {apiKeys.slice(0, 3).map((key) => (
                <tr key={key.id} className="border-b border-[#343B4F] last:border-0">
                  <td className="px-4 py-4">
                    <div>
                      <div className="font-medium text-white">{key.name}</div>
                      <div className="text-sm text-gray-400">{key.description}</div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div
                      className="inline-flex items-center rounded-full px-3 py-1"
                      style={{ backgroundColor: "rgba(43, 59, 100, 0.6)" }}
                    >
                      <div className={`mr-2 h-3 w-3 rounded-full ${key.platformColor}`}></div>
                      <span className="text-sm text-white">{key.platform}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm font-medium text-[#FF4473]">{key.age}</td>
                  <td className="px-4 py-4">
                    <RiskBadge risk={key.risk as "Low" | "Medium" | "High"} />
                  </td>
                  <td className="px-4 py-4">
                    <StatusBadge status={key.status as "Healthy" | "Rotate Now" | "In Progress"} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex justify-center">
          <Link href="/key-inventory">
            <Button
              variant="ghost"
              className="text-[#6B5EFF] inline-flex items-center whitespace-nowrap transition-all duration-200 hover:bg-[#1E1E2D]/50 active:bg-[#1E1E2D]"
            >
              View all {totalKeys} keys <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Platform Section */}
      <div className="rounded-lg bg-[#171723] p-6">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <Settings className="h-5 w-5 text-[#6B5EFF]" />
              <h2 className="text-xl font-semibold text-white">Platform Settings</h2>
            </div>
            <p className="text-gray-400">Manage your connected platforms</p>
          </div>
          <Link href="/platform-settings">
            <Button className="inline-flex items-center whitespace-nowrap transition-all duration-200 hover:bg-[#5A4FD9] active:bg-[#4A3FC9]">
              Manage Platforms <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
          {platforms.map((platform, index) => (
            <div key={index} className="rounded-lg bg-[#1E1E2D] p-4">
              <div className="flex items-center gap-3">
                <div className={`flex h-10 w-10 items-center justify-center rounded-full ${platform.iconColor}`}>
                  <span className="text-lg font-medium text-white">{platform.icon}</span>
                </div>
                <div>
                  <h3 className="font-medium text-white">{platform.name}</h3>
                  <p className="text-sm text-gray-400">
                    {platform.apiKeys} {platform.apiKeys === 1 ? "key" : "keys"}
                  </p>
                </div>
              </div>
            </div>
          ))}
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
  icon?: React.ReactNode
}

function StatusCard({ title, count, description, textColor = "text-white", icon }: StatusCardProps) {
  return (
    <div className="flex flex-col rounded-lg bg-[#171723] p-4 text-white">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="font-medium">{title}</h3>
        {icon}
      </div>
      <p className={`mb-3 text-4xl font-semibold ${textColor}`}>{count}</p>
      <p className="text-sm text-gray-400">{description}</p>
    </div>
  )
}

function RiskBadge({ risk }: { risk: "Low" | "Medium" | "High" }) {
  const bgColor = {
    Low: "bg-[#2B3B64]",
    Medium: "bg-[#8C6D1F]",
    High: "bg-[#9A2D3F]",
  }[risk]

  const textColor = {
    Low: "text-[#7B9CFF]",
    Medium: "text-[#FFB800]",
    High: "text-[#FF4473]",
  }[risk]

  return <div className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${bgColor} ${textColor}`}>{risk}</div>
}

function StatusBadge({ status }: { status: "Healthy" | "Rotate Now" | "In Progress" }) {
  const bgColor = {
    Healthy: "bg-[#1F4E3A]",
    "Rotate Now": "bg-[#8C6D1F]",
    "In Progress": "bg-[#2B3B64]",
  }[status]

  const textColor = {
    Healthy: "text-[#21D07A]",
    "Rotate Now": "text-[#FFB800]",
    "In Progress": "text-[#7B9CFF]",
  }[status]

  return (
    <div className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${bgColor} ${textColor}`}>{status}</div>
  )
}

function CheckIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  )
}
