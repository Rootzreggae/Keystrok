"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { KeyIcon } from "@/components/app-sidebar"
import Link from "next/link"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  // Check if we have a valid hash in the URL
  useEffect(() => {
    const hashParams = new URLSearchParams(window.location.hash.substring(1))
    if (!hashParams.get("access_token")) {
      setError("Invalid or expired password reset link")
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    // Validate passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match")
      setIsLoading(false)
      return
    }

    // Validate password strength
    if (password.length < 8) {
      setError("Password must be at least 8 characters")
      setIsLoading(false)
      return
    }

    try {
      const { error } = await supabase.auth.updateUser({ password })

      if (error) {
        setError(error.message)
        return
      }

      setIsSuccess(true)

      // Redirect to login after 3 seconds
      setTimeout(() => {
        router.push("/login")
      }, 3000)
    } catch (err) {
      setError("An unexpected error occurred")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0D0D14] p-4">
      <div className="w-full max-w-md space-y-8 bg-[#1a1b2e] p-8 rounded-lg shadow-lg">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="flex items-center justify-center h-12 w-12 rounded-md bg-purple-600 text-white">
            <KeyIcon className="h-8 w-8" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-white">Set new password</h2>
          <p className="mt-2 text-sm text-gray-400">Enter your new password below</p>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {isSuccess ? (
          <div className="text-center space-y-6">
            <Alert className="border-green-500 bg-green-500/10">
              <AlertDescription>
                Your password has been reset successfully. You will be redirected to the login page.
              </AlertDescription>
            </Alert>
            <Button asChild variant="outline" className="w-full">
              <Link href="/login">Go to login</Link>
            </Button>
          </div>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div>
              <Label htmlFor="password" className="block text-sm font-medium text-gray-300">
                New Password
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 bg-[#252538] border-gray-700 text-white"
              />
            </div>
            <div>
              <Label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300">
                Confirm New Password
              </Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mt-1 bg-[#252538] border-gray-700 text-white"
              />
            </div>

            <div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Resetting password..." : "Reset password"}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
