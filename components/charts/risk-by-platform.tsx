"use client"

import dynamic from "next/dynamic"
import { useApexTheme } from "@/hooks/use-apex-theme"
// Import the new hook at the top of the file
import { useRemoveApexLegends } from "@/hooks/use-remove-apex-legends"

// Dynamically import ApexCharts to avoid SSR issues
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false })

interface PlatformRiskData {
  platform: string
  medium: number
  high: number
}

interface RiskByPlatformProps {
  data: PlatformRiskData[]
}

export function RiskByPlatform({ data }: RiskByPlatformProps) {
  const { mounted, theme } = useApexTheme()

  // Add this line to use our new hook
  useRemoveApexLegends()

  return (
    <div>
      <div className="h-64">
        {mounted && (
          <Chart
            options={{
              chart: {
                type: "bar",
                stacked: true,
                toolbar: {
                  show: false,
                },
                background: "transparent",
                animations: {
                  enabled: true,
                  easing: "easeinout",
                  speed: 800,
                  animateGradually: {
                    enabled: true,
                    delay: 150,
                  },
                  dynamicAnimation: {
                    enabled: true,
                    speed: 350,
                  },
                },
              },
              plotOptions: {
                bar: {
                  horizontal: false,
                  columnWidth: "55%",
                  borderRadius: 2,
                  dataLabels: {
                    position: "top",
                  },
                },
              },
              dataLabels: {
                enabled: false,
              },
              xaxis: {
                categories: data.map((item) => item.platform),
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
                },
              },
              grid: {
                borderColor: "#2A2A3A",
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
              colors: ["#FFB800", "#FF4473"],
              legend: {
                show: false,
              },
              tooltip: {
                theme: "dark",
                x: {
                  show: true,
                },
                y: {
                  formatter: (val) => val + " keys",
                },
                marker: {
                  show: true,
                },
              },
              theme: theme,
              responsive: [
                {
                  breakpoint: 480,
                  options: {
                    chart: {
                      height: 300,
                    },
                    plotOptions: {
                      bar: {
                        columnWidth: "70%",
                      },
                    },
                  },
                },
              ],
            }}
            series={[
              {
                name: "Medium Risk",
                data: data.map((item) => item.medium),
              },
              {
                name: "High Risk",
                data: data.map((item) => item.high),
              },
            ]}
            type="bar"
            height={250}
          />
        )}
      </div>
      <div className="mt-4 flex justify-end space-x-6">
        <div className="flex items-center">
          <div className="mr-2 h-3 w-3 rounded-full bg-[#FFB800]"></div>
          <span className="text-sm text-gray-300">Medium Risk</span>
        </div>
        <div className="flex items-center">
          <div className="mr-2 h-3 w-3 rounded-full bg-[#FF4473]"></div>
          <span className="text-sm text-gray-300">High Risk</span>
        </div>
      </div>
    </div>
  )
}
