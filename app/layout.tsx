import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { PlatformProvider } from "@/context/platform-context"
import { AuthProvider } from "@/context/auth-context"
import { ActivityProvider } from "@/context/activity-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Keystrok - API Key Management",
  description: "Secure API key management and rotation workflows",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {/* Important: PlatformProvider must come before AuthProvider */}
          <PlatformProvider>
            <AuthProvider>
              <ActivityProvider>{children}</ActivityProvider>
            </AuthProvider>
          </PlatformProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
