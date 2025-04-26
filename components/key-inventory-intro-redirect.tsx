"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export function KeyInventoryIntroRedirect() {
  const router = useRouter()

  useEffect(() => {
    // Mark that the user has seen the intro
    localStorage.setItem("key-inventory-intro-seen", "true")
  }, [])

  const handleContinue = () => {
    router.push("/key-inventory")
  }

  return <button onClick={handleContinue} className="hidden" id="continue-to-key-inventory" aria-hidden="true" />
}
