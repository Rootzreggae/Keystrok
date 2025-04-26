"use client"

/**
 * Utility functions to help with context management and prevent circular dependencies
 */

import { useEffect, useState } from "react"

/**
 * A utility hook to safely check if a component is mounted before performing operations
 * This helps prevent memory leaks and issues with async operations
 */
export function useSafeMount() {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    return () => setIsMounted(false)
  }, [])

  return isMounted
}

/**
 * A utility to safely access context values without causing circular dependencies
 * @param contextValue The value from the context
 * @param fallbackValue A fallback value to use if the context is not available
 */
export function safeContextAccess<T>(contextValue: T | null | undefined, fallbackValue: T): T {
  return contextValue !== null && contextValue !== undefined ? contextValue : fallbackValue
}
