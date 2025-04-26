"use client"

import { useEffect, useState } from "react"

export function useApexTheme() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const theme = {
    mode: "dark",
    palette: "palette1",
    monochrome: {
      enabled: false,
      color: "#6B5EFF",
      shadeTo: "dark",
      shadeIntensity: 0.65,
    },
  }

  const defaultColors = ["#6B5EFF", "#21D07A", "#FFB800", "#FF4473", "#4B7BEC", "#F46800"]

  return { mounted, theme, defaultColors }
}
