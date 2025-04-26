"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { usePlatforms } from "@/context/platform-context"
import { useActivities } from "@/context/activity-context"
import { ArrowRight, Check, Clock } from "lucide-react"
import { SecurityHealthGauge } from "@/components/charts/security-health-gauge"
import { RiskByPlatform } from "@/components/charts/risk-by-platform"

// Mock data for the dashboard
const keySecurityData = {
  healthy: 17,
  needAttention: 2,
  critical: 1,
}

const platformRiskData = [
  { platform: "Datadog", medium: 3, high: 2 },
  { platform: "Grafana", medium: 4, high: 1 },
  { platform: "New Relic", medium: 5, high: 2 },
  { platform: "Github", medium: 3, high: 1 },
]

const rotationStatusData = {
  inProgress: 3,
  needRotation: 5,
  upToDate: 12,
}

const upcomingExpirations = [
  {
    id: "1",
    name: "Database Access Key",
    environment: "MongoDB - Production",
    expirationDate: "April 25",
    risk: "high",
  },
  {
    id: "2",
    name: "AWS IAM User - Admin",
    environment: "AWS - Production",
    expirationDate: "May 7",
    risk: "high",
  },
  {
    id: "3",
    name: "CI/CD Pipeline Key",
    environment: "GitHub - Development",
    expirationDate: "May 12",
    risk: "high",
  },
  {
    id: "4",
    name: "GCP Service Account",
    environment: "GCP - Staging",
    expirationDate: "May 19",
    risk: "medium",
  },
]

export function DashboardRedesign() {
  const { platforms } = usePlatforms()
  const { getRecentActivities } = useActivities()
  const [timeRange, setTimeRange] = useState("Last 30 days")

  // Get recent activities
  const recentActivities = getRecentActivities(2)

  // Default activities if none exist
  const defaultActivities = [
    {
      id: "1",
      name: "Production API Key",
      platform: "Datadog",
      platformIcon: "D",
      platformColor: "bg-[#7C3AED]",
      status: "completed",
      date: "Apr 19, 2025",
    },
    {
      id: "2",
      name: "Grafana Admin Service",
      platform: "Grafana",
      platformIcon: "G",
      platformColor: "bg-[#F46800]",
      status: "completed",
      date: "Apr 19, 2025",
    },
  ]

  // Calculate total keys
  const totalKeys = keySecurityData.healthy + keySecurityData.needAttention + keySecurityData.critical

  // Calculate security health percentage
  const securityHealthPercentage = Math.round((keySecurityData.healthy / totalKeys) * 100)

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-semibold text-white">Dashboard</h1>
          <p className="text-gray-400">Welcome back! Here's an overview of your APIkey security posture.</p>
        </div>
        <div className="relative">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="w-48 appearance-none rounded-md border border-[#343B4F] bg-[#1E1E2D] px-4 py-2 pr-10 text-white focus:border-[#6B5EFF] focus:outline-none"
          >
            <option>Last 7 days</option>
            <option>Last 30 days</option>
            <option>Last 90 days</option>
            <option>This year</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
            <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Key Security Health */}
        <div className="rounded-lg bg-[#171723] p-6">
          <h2 className="mb-4 text-lg font-medium text-white">Key Security Health</h2>
          <SecurityHealthGauge
            percentage={securityHealthPercentage}
            healthyCount={keySecurityData.healthy}
            needAttentionCount={keySecurityData.needAttention}
            criticalCount={keySecurityData.critical}
          />
        </div>

        {/* Risk by Platform */}
        <div className="rounded-lg bg-[#171723] p-6">
          <h2 className="mb-4 text-lg font-medium text-white">Risk by Platform</h2>
          <RiskByPlatform data={platformRiskData} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Key Rotation Status */}
        <div className="rounded-lg bg-[#171723] p-6">
          <h2 className="mb-6 text-lg font-medium text-white">Key Rotation Status</h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="flex flex-col items-center rounded-lg bg-[#1E1E2D] p-6">
              <span className="mb-2 text-4xl font-bold text-white">{rotationStatusData.inProgress}</span>
              <span className="text-center text-sm text-gray-400">In Progress</span>
            </div>
            <div className="flex flex-col items-center rounded-lg bg-[#1E1E2D] p-6">
              <span className="mb-2 text-4xl font-bold text-white">{rotationStatusData.needRotation}</span>
              <span className="text-center text-sm text-gray-400">Need Rotation</span>
            </div>
            <div className="flex flex-col items-center rounded-lg bg-[#1E1E2D] p-6">
              <span className="mb-2 text-4xl font-bold text-white">{rotationStatusData.upToDate}</span>
              <span className="text-center text-sm text-gray-400">Up To Date</span>
            </div>
          </div>

          <h3 className="mb-4 mt-8 text-base font-medium text-white">Recent Rotation Activity</h3>
          <div className="space-y-4">
            {recentActivities.length > 0
              ? recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between rounded-lg bg-[#1E1E2D] p-4">
                    <div className="flex items-center space-x-4">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-full text-white ${activity.platformColor}`}
                      >
                        <span className="text-lg font-medium">{activity.platformIcon}</span>
                      </div>
                      <div>
                        <p className="font-medium text-white">{activity.platformName}</p>
                        <p className="text-sm text-gray-400">
                          {activity.type === "platform_added" ? "Platform connected" : "Workflow created"} -{" "}
                          {activity.date}
                        </p>
                      </div>
                    </div>
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-full ${
                        activity.status === "completed" ? "bg-[#1F4E3A]" : "bg-[#2B3B64]"
                      }`}
                    >
                      {activity.status === "completed" ? (
                        <Check className="h-4 w-4 text-[#21D07A]" />
                      ) : (
                        <Clock className="h-4 w-4 text-[#7B9CFF]" />
                      )}
                    </div>
                  </div>
                ))
              : defaultActivities.map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between rounded-lg bg-[#1E1E2D] p-4">
                    <div className="flex items-center space-x-4">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-full text-white ${activity.platformColor}`}
                      >
                        <span className="text-lg font-medium">{activity.platformIcon}</span>
                      </div>
                      <div>
                        <p className="font-medium text-white">{activity.name}</p>
                        <p className="text-sm text-gray-400">Rotation completed - {activity.date}</p>
                      </div>
                    </div>
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-full ${
                        activity.status === "completed" ? "bg-[#1F4E3A]" : "bg-[#2B3B64]"
                      }`}
                    >
                      {activity.status === "completed" ? (
                        <Check className="h-4 w-4 text-[#21D07A]" />
                      ) : (
                        <Clock className="h-4 w-4 text-[#7B9CFF]" />
                      )}
                    </div>
                  </div>
                ))}
          </div>
        </div>

        {/* Upcoming Key Expirations */}
        <div className="rounded-lg bg-[#171723] p-6">
          <h2 className="mb-6 text-lg font-medium text-white">Upcoming Key Expirations</h2>
          <div className="space-y-4">
            {upcomingExpirations.map((expiration) => (
              <div
                key={expiration.id}
                className={`rounded-lg ${expiration.risk === "high" ? "bg-[#2A1A1F]" : "bg-[#2A2A1A]"} p-4`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`font-medium ${expiration.risk === "high" ? "text-[#FF4473]" : "text-[#FFB800]"}`}>
                      {expiration.name}
                    </p>
                    <p className="text-sm text-gray-400">{expiration.environment}</p>
                  </div>
                  <p className={`font-medium ${expiration.risk === "high" ? "text-[#FF4473]" : "text-[#FFB800]"}`}>
                    {expiration.expirationDate}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex justify-center">
            <Button variant="ghost" className="text-[#4B7BEC] hover:bg-[#2B3B64]">
              Show All Expirations <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="rounded-lg bg-[#171723] p-6">
        <h3 className="mb-4 text-base font-medium text-[#7E89AC]">Quick Actions</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Button className="bg-[#2B3B64] text-white hover:bg-[#23395D]">Add New Key</Button>
          <Button className="bg-[#2B3B64] text-white hover:bg-[#23395D]">Run Discovery Scan</Button>
          <Button className="bg-[#6B5EFF] text-white hover:bg-[#5A4FD9]">Rotate High Risk Keys</Button>
        </div>
      </div>
    </div>
  )
}
