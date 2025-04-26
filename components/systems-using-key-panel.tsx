"use client"

import dynamic from "next/dynamic"
import { useApexTheme } from "@/hooks/use-apex-theme"

// Dynamically import ApexCharts to avoid SSR issues
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false })

interface System {
  name: string
  color: string
}

interface SystemsUsingKeyPanelProps {
  systems: System[]
  usageData: { date: string; value: number }[]
}

export function SystemsUsingKeyPanel({ systems, usageData }: SystemsUsingKeyPanelProps) {
  const { mounted, theme } = useApexTheme()

  return (
    <div className="rounded-lg bg-[#171723] p-6">
      <h2 className="mb-4 text-lg font-medium text-white">Systems Using This Key</h2>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Systems list */}
        <div className="space-y-4 rounded-lg bg-[#1E1E2D] p-4">
          <ul className="space-y-3">
            {systems.map((system, index) => (
              <li key={index} className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full" style={{ backgroundColor: system.color }}></div>
                <span className="text-sm text-white">{system.name}</span>
              </li>
            ))}
          </ul>
          <p className="text-xs text-gray-400">This key is used by {systems.length} critical systems</p>
        </div>

        {/* Usage chart */}
        <div className="rounded-lg bg-[#1E1E2D] p-4">
          <div className="h-48">
            {mounted && (
              <Chart
                options={{
                  chart: {
                    type: "line",
                    toolbar: {
                      show: false,
                    },
                    background: "transparent",
                    animations: {
                      enabled: true,
                    },
                  },
                  stroke: {
                    curve: "smooth",
                    width: 3,
                  },
                  colors: ["#6B5EFF"],
                  grid: {
                    borderColor: "#343B4F",
                    strokeDashArray: 4,
                    yaxis: {
                      lines: {
                        show: true,
                      },
                    },
                    xaxis: {
                      lines: {
                        show: false,
                      },
                    },
                  },
                  xaxis: {
                    categories: usageData.map((item) => item.date),
                    labels: {
                      style: {
                        colors: "#939AA8",
                      },
                    },
                    axisBorder: {
                      show: false,
                    },
                    axisTicks: {
                      show: false,
                    },
                  },
                  yaxis: {
                    labels: {
                      style: {
                        colors: "#939AA8",
                      },
                      formatter: (value) => {
                        return value >= 1000 ? `${Math.round(value / 1000)}k` : value.toString()
                      },
                    },
                  },
                  tooltip: {
                    theme: "dark",
                    x: {
                      show: true,
                    },
                    y: {
                      formatter: (val) => `${val.toLocaleString()} calls`,
                    },
                  },
                  theme: theme,
                  dataLabels: {
                    enabled: false,
                  },
                }}
                series={[
                  {
                    name: "API Calls",
                    data: usageData.map((item) => item.value),
                  },
                ]}
                type="line"
                height={180}
              />
            )}
          </div>
          <div className="mt-2 text-center text-xs text-gray-400">30 Day Usage Trend</div>
        </div>
      </div>
    </div>
  )
}
