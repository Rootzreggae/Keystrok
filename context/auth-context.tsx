"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { getSupabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"
// Import the platform context
// import { usePlatforms } from "@/context/platform-context"

type User = {
  id: string
  email?: string
  name?: string
}

type AuthContextType = {
  user: User | null
  loading: boolean
  isPreviewMode: boolean
  signIn: (email: string, password: string) => Promise<{ error: any | null; redirectNeeded: boolean }>
  signUp: (email: string, password: string) => Promise<{ error: any | null }>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<{ error: any | null }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [isPreviewMode, setIsPreviewMode] = useState(false)
  const router = useRouter()
  // const { hasPlatforms } = usePlatforms() // Call usePlatforms unconditionally

  // Check if we're in preview mode
  useEffect(() => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
      setIsPreviewMode(true)
    }
  }, [])

  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      try {
        const supabase = getSupabase()
        if (!supabase) {
          console.warn("Supabase client not available, running in limited mode")
          setLoading(false)
          return
        }

        // Check active session
        const { data, error } = await supabase.auth.getSession()
        if (error) {
          console.error("Error getting session:", error)
        } else if (data.session?.user) {
          setUser({
            id: data.session.user.id,
            email: data.session.user.email,
            name: data.session.user.user_metadata?.name,
          })
        }

        // Subscribe to auth changes
        try {
          const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (session?.user) {
              setUser({
                id: session.user.id,
                email: session.user.email,
                name: session.user.user_metadata?.name,
              })
            } else {
              setUser(null)
            }
          })

          return () => {
            authListener?.subscription.unsubscribe()
          }
        } catch (listenerError) {
          console.error("Error setting up auth listener:", listenerError)
        }
      } catch (error) {
        console.error("Error initializing auth:", error)
      } finally {
        setLoading(false)
      }
    }

    initAuth()
  }, [])

  // Add a function to handle preview mode login (if it doesn't exist)
  const handlePreviewLogin = async (email: string, password: string) => {
    // For preview mode, simulate a successful login
    setLoading(true)

    // Simulate network delay for a more realistic experience
    await new Promise((resolve) => setTimeout(resolve, 800))

    // Set the user to a mock user
    setUser({
      id: "preview-user",
      email: email || "preview@example.com",
      name: "Preview User",
    })

    setLoading(false)
    return { error: null, redirectNeeded: true }
  }

  // Add this function inside the AuthProvider component

  // Sign in with email and password
  const signIn = async (email: string, password: string) => {
    if (isPreviewMode) {
      return handlePreviewLogin(email, password)
    }

    setLoading(true)
    try {
      const supabase = getSupabase()
      if (!supabase) {
        setLoading(false)
        return { error: new Error("Authentication service not available"), redirectNeeded: false }
      }

      const { error } = await supabase.auth.signInWithPassword({ email, password })

      return { error, redirectNeeded: !error }
    } catch (error) {
      console.error("Sign in error:", error)
      return { error, redirectNeeded: false }
    } finally {
      setLoading(false)
    }
  }

  // Sign up with email and password
  const signUp = async (email: string, password: string) => {
    setLoading(true)
    try {
      const supabase = getSupabase()
      if (!supabase) {
        setLoading(false)
        return { error: new Error("Authentication service not available") }
      }

      const { error } = await supabase.auth.signUp({ email, password })

      // In preview mode, simulate successful signup
      if (isPreviewMode) {
        return { error: null }
      }

      return { error }
    } catch (error) {
      console.error("Sign up error:", error)
      return { error }
    } finally {
      setLoading(false)
    }
  }

  // Sign out
  const signOut = async () => {
    try {
      const supabase = getSupabase()
      if (supabase) {
        await supabase.auth.signOut()
      }

      // Always clear the user state
      setUser(null)
      router.push("/login")
    } catch (error) {
      console.error("Sign out error:", error)
      // Still clear the user state and redirect even if there's an error
      setUser(null)
      router.push("/login")
    }
  }

  // Reset password
  const resetPassword = async (email: string) => {
    try {
      const supabase = getSupabase()
      if (!supabase) {
        return { error: new Error("Authentication service not available") }
      }

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })

      // In preview mode, simulate successful password reset
      if (isPreviewMode) {
        return { error: null }
      }

      return { error }
    } catch (error) {
      console.error("Reset password error:", error)
      return { error }
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isPreviewMode,
        signIn,
        signUp,
        signOut,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
