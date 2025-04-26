"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { KeyIcon } from "@/components/app-sidebar"
import Link from "next/link"
import { supabase } from "@/lib/supabase"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })

      if (error) {
        setError(error.message)
        return
      }

      setIsSuccess(true)
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
          <h2 className="mt-6 text-3xl font-bold text-white">Reset your password</h2>
          <p className="mt-2 text-sm text-gray-400">Enter your email and we'll send you a reset link</p>
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
                If an account exists with this email, you'll receive a password reset link shortly.
              </AlertDescription>
            </Alert>
            <Button asChild variant="outline" className="w-full">
              <Link href="/login">Return to login</Link>
            </Button>
          </div>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
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
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Sending reset link..." : "Send reset link"}
              </Button>
            </div>

            <div className="text-center text-sm">
              <Link href="/login" className="text-[#6B5EFF] hover:text-[#5A4FD9]">
                Back to login
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
