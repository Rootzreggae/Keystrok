"use client"

import { useEffect } from "react"

export function useRemoveApexLegends() {
  useEffect(() => {
    // Function to remove the legend series elements
    const removeLegendSeries = () => {
      // Find the specific container with all three classes
      const legendContainers = document.querySelectorAll(
        ".apexcharts-legend.apexcharts-align-center.apx-legend-position-right",
      )

      if (legendContainers.length > 0) {
        legendContainers.forEach((container) => {
          // Find all legend series elements within this container
          const legendSeries = container.querySelectorAll(".apexcharts-legend-series")

          // Remove each legend series element
          legendSeries.forEach((element) => {
            element.remove()
          })
        })
      }
    }

    // Initial removal after a short delay to ensure charts are rendered
    const initialTimer = setTimeout(() => {
      removeLegendSeries()
    }, 500)

    // Set up a mutation observer to watch for changes to the DOM
    // This will handle cases where charts are re-rendered
    const observer = new MutationObserver((mutations) => {
      // Check if any mutations added ApexCharts elements
      const hasApexChartsChanges = mutations.some((mutation) => {
        return Array.from(mutation.addedNodes).some((node) => {
          if (node instanceof HTMLElement) {
            return node.classList.contains("apexcharts-legend") || node.querySelector(".apexcharts-legend-series")
          }
          return false
        })
      })

      if (hasApexChartsChanges) {
        // If ApexCharts elements were added, remove legend series
        removeLegendSeries()
      }
    })

    // Start observing the document body for changes with optimized options
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: false, // Only observe childList changes
      characterData: false, // Don't observe text changes
    })

    // Clean up
    return () => {
      clearTimeout(initialTimer)
      observer.disconnect()
    }
  }, [])
}
