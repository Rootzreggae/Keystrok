"use client"

import { useEffect, useState } from "react"
import { AlertCircle } from "lucide-react"

export function PreviewModeBanner() {
  const [isPreviewMode, setIsPreviewMode] = useState(false)

  useEffect(() => {
    // Check if we're in preview mode (no Supabase config)
    const hasSupabaseConfig =
      typeof process.env.NEXT_PUBLIC_SUPABASE_URL === "string" &&
      process.env.NEXT_PUBLIC_SUPABASE_URL.length > 0 &&
      typeof process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY === "string" &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.length > 0

    setIsPreviewMode(!hasSupabaseConfig)
  }, [])

  if (!isPreviewMode) return null

  return (
    <div className="bg-amber-500 text-black px-4 py-2 flex items-center justify-center text-sm w-full fixed top-0 left-0 right-0 z-50">
      <AlertCircle className="h-4 w-4 mr-2" />
      <span>
        Running in preview mode with mock data. Some features may be limited.{" "}
        <a
          href="#"
          className="underline font-medium"
          onClick={(e) => {
            e.preventDefault()
            alert("This would link to setup documentation in a real application.")
          }}
        >
          Learn how to set up Supabase
        </a>
      </span>
    </div>
  )
}
