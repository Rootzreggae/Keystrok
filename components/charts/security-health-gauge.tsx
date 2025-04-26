"use client"

import dynamic from "next/dynamic"
import { useApexTheme } from "@/hooks/use-apex-theme"
// Import the new hook at the top of the file
import { useRemoveApexLegends } from "@/hooks/use-remove-apex-legends"

// Dynamically import ApexCharts to avoid SSR issues
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false })

interface SecurityHealthGaugeProps {
  percentage: number
  healthyCount: number
  needAttentionCount: number
  criticalCount: number
}

export function SecurityHealthGauge({
  percentage,
  healthyCount,
  needAttentionCount,
  criticalCount,
}: SecurityHealthGaugeProps) {
  const { mounted, theme } = useApexTheme()

  // Add this line to use our new hook
  useRemoveApexLegends()

  // Determine the color based on the percentage
  const getColor = (percent: number) => {
    if (percent >= 80) return "#21D07A" // Green for good
    if (percent >= 50) return "#FFB800" // Yellow for medium
    return "#FF4473" // Red for poor
  }

  // Determine the label based on the percentage
  const getLabel = (percent: number) => {
    if (percent >= 80) return "Good"
    if (percent >= 50) return "Fair"
    return "Poor"
  }

  const color = getColor(percentage)
  const label = getLabel(percentage)

  return (
    <div className="flex flex-col md:flex-row items-center justify-center gap-8">
      <div className="relative h-72 w-72 mx-auto md:mx-0">
        {mounted && (
          <Chart
            options={{
              chart: {
                type: "radialBar",
                background: "transparent",
                height: 350,
              },
              plotOptions: {
                radialBar: {
                  offsetY: 0,
                  startAngle: 0,
                  endAngle: 270,
                  hollow: {
                    margin: 5,
                    size: "30%",
                    background: "transparent",
                  },
                  track: {
                    show: true,
                    background: "#1E1E2D",
                    strokeWidth: "100%",
                    opacity: 1,
                    margin: 10,
                  },
                  dataLabels: {
                    name: {
                      fontSize: "14px",
                      color: "#fff",
                      offsetY: -10,
                    },
                    value: {
                      fontSize: "16px",
                      color: "#fff",
                      offsetY: -2,
                      formatter: (val) => val + "%",
                    },
                    total: {
                      show: true,
                      label: "Total",
                      color: "#fff",
                      formatter: () => percentage + "%",
                    },
                  },
                },
              },
              colors: ["#21D07A", "#FFB800", "#FF4473"],
              labels: ["Healthy", "Needs Attention", "Critical"],
              legend: {
                show: true,
                floating: true,
                fontSize: "13px",
                position: "right",
                offsetX: -10,
                offsetY: 15,
                labels: {
                  useSeriesColors: true,
                },
                formatter: (seriesName, opts) => {
                  const value = opts.w.globals.series[opts.seriesIndex]
                  const count = [healthyCount, needAttentionCount, criticalCount][opts.seriesIndex]
                  return `${seriesName}: ${value}% (${count})`
                },
                itemMargin: {
                  horizontal: 3,
                },
                containerClass: "custom-legend-container",
                itemClass: "custom-legend-item",
                markers: {
                  width: 12,
                  height: 12,
                  strokeWidth: 0,
                  strokeColor: "#fff",
                  radius: 12,
                  customHTML: undefined,
                  onClick: undefined,
                  offsetX: -5,
                  offsetY: 0,
                },
                onItemClick: {
                  toggleDataSeries: true,
                },
                onItemHover: {
                  highlightDataSeries: true,
                },
              },
              theme: theme,
              tooltip: {
                enabled: true,
                theme: "dark",
                y: {
                  formatter: (val) => val + "%",
                },
              },
              responsive: [
                {
                  breakpoint: 480,
                  options: {
                    legend: {
                      show: false,
                    },
                  },
                },
              ],
            }}
            series={[
              ((healthyCount / (healthyCount + needAttentionCount + criticalCount)) * 100).toFixed(0),
              ((needAttentionCount / (healthyCount + needAttentionCount + criticalCount)) * 100).toFixed(0),
              ((criticalCount / (healthyCount + needAttentionCount + criticalCount)) * 100).toFixed(0),
            ]}
            type="radialBar"
            height={350}
          />
        )}
      </div>
      <div className="w-full md:w-auto md:max-w-xs grid grid-cols-1 gap-4 mt-6 md:mt-0 md:self-center">
        <div className="flex items-center space-x-8">
          <div className="flex items-center">
            <div className="mr-2 h-3 w-3 rounded-full bg-[#21D07A]"></div>
            <span className="text-sm text-gray-300">Healthy keys</span>
          </div>
          <span className="text-sm text-white">({healthyCount})</span>
        </div>
        <div className="flex items-center space-x-8">
          <div className="flex items-center">
            <div className="mr-2 h-3 w-3 rounded-full bg-[#FFB800]"></div>
            <span className="text-sm text-gray-300">Need Attention</span>
          </div>
          <span className="text-sm text-white">({needAttentionCount})</span>
        </div>
        <div className="flex items-center space-x-8">
          <div className="flex items-center">
            <div className="mr-2 h-3 w-3 rounded-full bg-[#FF4473]"></div>
            <span className="text-sm text-gray-300">Critical</span>
          </div>
          <span className="text-sm text-white">({criticalCount})</span>
        </div>
      </div>
      {/* Custom styles to override ApexCharts legend classes */}
      <style jsx>{`
        :global(.custom-legend-container .apexcharts-legend-series) {
          display: flex !important;
          align-items: center !important;
          margin: 8px 0 !important;
        }
        
        :global(.custom-legend-item) {
          display: flex !important;
          align-items: center !important;
        }
      `}</style>
    </div>
  )
}
