"use client"
import { useRouter } from "next/navigation"
import { usePlatforms } from "@/context/platform-context"

export function usePostLoginRedirection() {
  const router = useRouter()
  const { hasPlatforms, loading: platformsLoading } = usePlatforms()

  const handleRedirection = (redirectNeeded: boolean) => {
    if (!redirectNeeded) return

    if (!platformsLoading) {
      if (!hasPlatforms) {
        // Redirect to intro page if user has no platforms
        router.push("/key-inventory/intro?fromLogin=true")
      } else {
        // Redirect to dashboard if user has platforms
        router.push("/")
      }
    }
  }

  return { handleRedirection }
}
