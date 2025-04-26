"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "@/context/auth-context"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { KeyIcon } from "@/components/app-sidebar"
import Link from "next/link"

export default function SignupPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { signUp } = useAuth()
  const router = useRouter()

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
      const { error, data } = await signUp(email, password)

      if (error) {
        setError(error.message)
        return
      }

      // Check if email confirmation is required
      if (data.user && !data.session) {
        router.push("/verify-email")
      } else {
        // Redirect to dashboard on successful signup with auto-login
        router.push("/")
      }
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
          <h2 className="mt-6 text-3xl font-bold text-white">Create your account</h2>
          <p className="mt-2 text-sm text-gray-400">Start managing your API keys securely</p>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="email" className="block text-sm font-medium text-gray-300">
                Email address
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 bg-[#252538] border-gray-700 text-white"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <Label htmlFor="password" className="block text-sm font-medium text-gray-300">
                Password
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
                Confirm Password
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
          </div>

          <div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Creating account..." : "Create account"}
            </Button>
          </div>

          <div className="text-center text-sm">
            <span className="text-gray-400">Already have an account? </span>
            <Link href="/login" className="text-[#6B5EFF] hover:text-[#5A4FD9]">
              Sign in
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
