import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// List of paths that don't require authentication
const publicPaths = ["/login", "/signup", "/verify-email", "/forgot-password", "/reset-password"]

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  // Check if the user is authenticated
  const {
    data: { session },
  } = await supabase.auth.getSession()

  const isAuthRoute = publicPaths.some((path) => req.nextUrl.pathname.startsWith(path))
  const isApiRoute = req.nextUrl.pathname.startsWith("/api")

  // Allow public assets and API routes
  if (req.nextUrl.pathname.startsWith("/_next") || isApiRoute) {
    return res
  }

  // Redirect authenticated users away from auth pages
  if (session && isAuthRoute) {
    return NextResponse.redirect(new URL("/", req.url))
  }

  // Redirect unauthenticated users to login page
  if (!session && !isAuthRoute) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  return res
}

// Only run middleware on specific paths
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.png$).*)"],
}
