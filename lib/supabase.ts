import { createClient } from "@supabase/supabase-js"

// Types for our database tables
export type DbPlatform = {
  id: string
  name: string
  icon: string
  icon_color: string
  status: string
  api_keys_count: number
  admin_permissions: string | null
  last_sync: string | null
  rotation_policy: string | null
  user_id: string
  created_at: string
  updated_at: string
}

export type ApiKey = {
  id: string
  name: string
  description: string | null
  platform_id: string
  created_at: string
  last_used: string | null
  key_hash: string | null
  age_days: number | null
  risk_level: string | null
  status: string | null
  user_id: string
}

export type RotationWorkflow = {
  id: string
  name: string
  subtitle: string | null
  api_key_id: string
  current_step: number
  total_steps: number
  started_at: string
  estimated_completion: string | null
  status: string
  user_id: string
  created_at: string
  updated_at: string
}

export type WorkflowStep = {
  id: string
  workflow_id: string
  step_number: number
  name: string
  status: string
  completed_at: string | null
  created_at: string
}

export type DbActivity = {
  id: string
  type: string
  platform_id: string | null
  platform_name: string
  platform_icon: string
  platform_color: string
  key_name: string | null
  workflow_name: string | null
  status: string | null
  timestamp: string
  date: string | null
  user_id: string
}

export type SecurityPolicy = {
  id: string
  name: string
  description: string | null
  is_active: boolean
  user_id: string
  created_at: string
}

// Mock data for when Supabase is not available
const mockData = {
  platforms: [
    {
      id: "mock-platform-1",
      name: "Demo Platform",
      icon: "database",
      icon_color: "#6366f1",
      status: "Connected",
      api_keys_count: 3,
      admin_permissions: "Full",
      last_sync: new Date().toISOString(),
      rotation_policy: "30 days",
      user_id: "mock-user",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ],
  apiKeys: [
    {
      id: "mock-key-1",
      name: "Demo API Key",
      description: "This is a demo API key for preview mode",
      platform_id: "mock-platform-1",
      created_at: new Date().toISOString(),
      last_used: new Date().toISOString(),
      key_hash: "xxxx-xxxx-xxxx",
      age_days: 15,
      risk_level: "Medium",
      status: "Healthy",
      user_id: "mock-user",
    },
  ],
  activities: [
    {
      id: "mock-activity-1",
      type: "platform_added",
      platform_id: "mock-platform-1",
      platform_name: "Demo Platform",
      platform_icon: "database",
      platform_color: "#6366f1",
      key_name: null,
      workflow_name: null,
      status: null,
      timestamp: new Date().toISOString(),
      date: new Date().toISOString().split("T")[0],
      user_id: "mock-user",
    },
  ],
}

// Create a mock Supabase client for preview mode
const createMockClient = () => {
  // Create a mock user for demo purposes
  const mockUser = {
    id: "mock-user-id",
    email: "demo@example.com",
    user_metadata: { name: "Demo User" },
  }

  // Create a mock session
  const mockSession = {
    user: mockUser,
    access_token: "mock-access-token",
    refresh_token: "mock-refresh-token",
    expires_at: Date.now() + 3600,
  }

  // Track auth state listeners
  const authListeners: Array<(event: string, session: any) => void> = []

  return {
    from: (table: string) => {
      return {
        select: (columns?: string) => {
          const data =
            table === "platforms"
              ? mockData.platforms
              : table === "api_keys"
                ? mockData.apiKeys
                : table === "activities"
                  ? mockData.activities
                  : []

          // Create a chainable query builder
          const queryBuilder = {
            data,
            eq: () => queryBuilder,
            neq: () => queryBuilder,
            gt: () => queryBuilder,
            gte: () => queryBuilder,
            lt: () => queryBuilder,
            lte: () => queryBuilder,
            like: () => queryBuilder,
            ilike: () => queryBuilder,
            is: () => queryBuilder,
            in: () => queryBuilder,
            contains: () => queryBuilder,
            containedBy: () => queryBuilder,
            rangeLt: () => queryBuilder,
            rangeGt: () => queryBuilder,
            rangeGte: () => queryBuilder,
            rangeLte: () => queryBuilder,
            rangeAdjacent: () => queryBuilder,
            overlaps: () => queryBuilder,
            textSearch: () => queryBuilder,
            match: () => queryBuilder,
            not: () => queryBuilder,
            or: () => queryBuilder,
            filter: () => queryBuilder,
            order: () => queryBuilder,
            limit: () => queryBuilder,
            range: () => queryBuilder,
            single: () => Promise.resolve({ data: data[0] || null, error: null }),
            maybeSingle: () => Promise.resolve({ data: data[0] || null, error: null }),
            then: (callback: (result: { data: any; error: null }) => void) => {
              callback({ data, error: null })
              return Promise.resolve({ data, error: null })
            },
          }

          return queryBuilder
        },
        insert: (values: any) => {
          const newItem = Array.isArray(values) ? values[0] : values
          const id = newItem.id || `mock-${table}-${Date.now()}`
          const createdItem = { ...newItem, id, created_at: new Date().toISOString() }

          return Promise.resolve({ data: [createdItem], error: null })
        },
        update: (values: any) => Promise.resolve({ data: values, error: null }),
        upsert: (values: any) => Promise.resolve({ data: values, error: null }),
        delete: () => Promise.resolve({ data: null, error: null }),
      }
    },
    auth: {
      getSession: () => Promise.resolve({ data: { session: mockSession }, error: null }),
      getUser: () => Promise.resolve({ data: { user: mockUser }, error: null }),
      signInWithPassword: ({ email, password }: { email: string; password: string }) => {
        // Notify listeners about the sign-in event
        setTimeout(() => {
          authListeners.forEach((listener) => listener("SIGNED_IN", mockSession))
        }, 0)

        return Promise.resolve({
          data: { user: mockUser, session: mockSession },
          error: null,
        })
      },
      signUp: ({ email, password }: { email: string; password: string }) => {
        return Promise.resolve({
          data: { user: mockUser, session: null },
          error: null,
        })
      },
      signOut: () => {
        // Notify listeners about the sign-out event
        setTimeout(() => {
          authListeners.forEach((listener) => listener("SIGNED_OUT", null))
        }, 0)

        return Promise.resolve({ error: null })
      },
      resetPasswordForEmail: (email: string) => Promise.resolve({ error: null }),
      onAuthStateChange: (callback: (event: string, session: any) => void) => {
        // Add the callback to our listeners array
        authListeners.push(callback)

        // Return an object with an unsubscribe method
        return {
          data: {
            subscription: {
              unsubscribe: () => {
                // Remove the callback from our listeners array
                const index = authListeners.indexOf(callback)
                if (index !== -1) {
                  authListeners.splice(index, 1)
                }
              },
            },
          },
        }
      },
    },
    storage: {
      from: (bucket: string) => ({
        upload: () => Promise.resolve({ data: { path: "mock-path" }, error: null }),
        download: () => Promise.resolve({ data: new Blob(), error: null }),
        list: () => Promise.resolve({ data: [], error: null }),
        remove: () => Promise.resolve({ data: null, error: null }),
      }),
    },
    rpc: (fn: string, params?: any) => Promise.resolve({ data: null, error: null }),
  }
}

// Check if Supabase environment variables are available
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Create a function to get the Supabase client
export function getSupabaseClient() {
  // Check if we're in the browser
  if (typeof window === "undefined") {
    // Server-side: require environment variables
    if (!supabaseUrl || !supabaseAnonKey) {
      console.error("Supabase environment variables are missing for server-side operations.")
      return null
    }
    return createClient(supabaseUrl, supabaseAnonKey)
  }

  // Client-side: try to use environment variables, fall back to mock if needed
  if (supabaseUrl && supabaseAnonKey) {
    return createClient(supabaseUrl, supabaseAnonKey)
  }

  // If environment variables are missing, use mock client for preview
  console.warn("Using mock Supabase client for preview mode. Some features will be limited.")
  return createMockClient() as unknown as ReturnType<typeof createClient>
}

// Create a singleton instance of the Supabase client
let supabaseInstance: ReturnType<typeof createClient> | null = null

export function getSupabase() {
  if (!supabaseInstance && typeof window !== "undefined") {
    supabaseInstance = getSupabaseClient()
  }
  return supabaseInstance
}

// For backward compatibility
export const supabase = typeof window !== "undefined" ? getSupabaseClient() : null

// For development/demo purposes, we'll use a temporary user ID if not authenticated
export async function getUserId(): Promise<string> {
  try {
    // Get the Supabase client
    const supabaseClient = getSupabase()

    // If Supabase is available, try to get the authenticated user
    if (supabaseClient) {
      const { data } = await supabaseClient.auth.getSession()
      if (data.session?.user?.id) {
        return data.session.user.id
      }
    }

    // If not authenticated or Supabase is not available, use localStorage
    if (typeof window !== "undefined") {
      let tempUserId = localStorage.getItem("keystrok-temp-user-id")
      if (!tempUserId) {
        tempUserId = crypto.randomUUID()
        localStorage.setItem("keystrok-temp-user-id", tempUserId)
      }
      return tempUserId
    }

    // Fallback for server-side rendering
    return "temp-user-id"
  } catch (error) {
    console.error("Error getting user ID:", error)
    return "error-user-id"
  }
}

// For backward compatibility
export const getTemporaryUserId = getUserId

// For server components/actions
export async function getServerUserId(cookies?: string): Promise<string | null> {
  if (!cookies) return null

  try {
    // Check if Supabase environment variables are available
    if (!supabaseUrl || !supabaseAnonKey) {
      console.error("Supabase environment variables are missing for server-side operations.")
      return null
    }

    // Create a server-side supabase client using cookies
    const supabaseServer = createClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        get(name: string) {
          const match = cookies.match(new RegExp(`(^| )${name}=([^;]+)`))
          return match ? match[2] : undefined
        },
      },
    })

    // Get the user from the session
    const {
      data: { session },
    } = await supabaseServer.auth.getSession()
    return session?.user?.id || null
  } catch (error) {
    console.error("Error in getServerUserId:", error)
    return null
  }
}

// Get the current user ID from the session
export async function getCurrentUserId(): Promise<string | null> {
  try {
    const supabaseClient = getSupabase()
    if (!supabaseClient) return null

    const { data } = await supabaseClient.auth.getSession()
    return data.session?.user?.id || null
  } catch (error) {
    console.error("Error getting current user ID:", error)
    return null
  }
}
