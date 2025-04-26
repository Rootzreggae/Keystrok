"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { AlertCircle } from "lucide-react"

interface ErrorBoundaryProps {
  children: React.ReactNode
}

export function ErrorBoundary({ children }: ErrorBoundaryProps) {
  const [hasError, setHasError] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const errorHandler = (event: ErrorEvent) => {
      event.preventDefault()
      setHasError(true)
      setError(new Error(event.message))
    }

    window.addEventListener("error", errorHandler)

    return () => {
      window.removeEventListener("error", errorHandler)
    }
  }, [])

  if (hasError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white p-4">
        <div className="max-w-md w-full bg-gray-800 p-6 rounded-lg shadow-lg">
          <div className="flex items-center text-amber-500 mb-4">
            <AlertCircle className="h-6 w-6 mr-2" />
            <h2 className="text-xl font-semibold">Something went wrong</h2>
          </div>
          <p className="mb-4">
            An error occurred while loading this page. You may be missing required environment variables or
            configuration.
          </p>
          <div className="bg-gray-900 p-3 rounded text-sm mb-4 overflow-auto">
            <code>{error?.message || "Unknown error"}</code>
          </div>
          <div className="flex justify-between">
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded text-white"
            >
              Reload page
            </button>
            <a href="/" className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded text-white">
              Go to homepage
            </a>
          </div>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
