"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { supabase } from "@/lib/supabase"
import { Loader2 } from "lucide-react"

export function UserProfile() {
  const { user } = useAuth()
  const [name, setName] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch user profile data
  const fetchProfile = async () => {
    if (!user) return

    try {
      // First check if the user exists in the database
      const { data, error } = await supabase.from("users").select("name").eq("id", user.id)

      if (error) {
        console.error("Error fetching profile:", error)
        return
      }

      // If user exists, set the name
      if (data && data.length > 0) {
        setName(data[0].name || "")
      } else {
        // If user doesn't exist in the users table, create a record
        console.log("User not found in database, creating profile...")
        const { error: insertError } = await supabase
          .from("users")
          .insert([{ id: user.id, name: user.email?.split("@")[0] || "New User" }])

        if (insertError) {
          console.error("Error creating user profile:", insertError)
        } else {
          // Set default name based on email
          setName(user.email?.split("@")[0] || "New User")
        }
      }
    } catch (err) {
      console.error("Error fetching profile:", err)
    }
  }

  // Load profile data when component mounts
  useEffect(() => {
    fetchProfile()
  }, [user])

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setIsSuccess(false)

    if (!user) {
      setError("You must be logged in to update your profile")
      setIsLoading(false)
      return
    }

    try {
      const { error } = await supabase.from("users").update({ name }).eq("id", user.id)

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

  if (!user) {
    return (
      <div className="p-6 bg-[#1a1b2e] rounded-lg">
        <p className="text-gray-400">Please log in to view your profile</p>
      </div>
    )
  }

  return (
    <div className="p-6 bg-[#1a1b2e] rounded-lg">
      <h2 className="text-2xl font-bold text-white mb-6">Your Profile</h2>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {isSuccess && (
        <Alert className="mb-4 border-green-500 bg-green-500/10">
          <AlertDescription>Profile updated successfully</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleUpdateProfile} className="space-y-4">
        <div>
          <Label htmlFor="email" className="block text-sm font-medium text-gray-300">
            Email address
          </Label>
          <Input
            id="email"
            type="email"
            value={user.email || ""}
            disabled
            className="mt-1 bg-[#252538] border-gray-700 text-gray-400"
          />
          <p className="mt-1 text-xs text-gray-500">Email cannot be changed</p>
        </div>

        <div>
          <Label htmlFor="name" className="block text-sm font-medium text-gray-300">
            Display Name
          </Label>
          <Input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 bg-[#252538] border-gray-700 text-white"
          />
        </div>

        <Button type="submit" disabled={isLoading} className="mt-4">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Updating...
            </>
          ) : (
            "Update Profile"
          )}
        </Button>
      </form>
    </div>
  )
}
