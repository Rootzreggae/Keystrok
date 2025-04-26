"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Shield, ShieldIcon as Shield2, BarChart, CheckCircle, Layers, Clock } from "lucide-react"
import { usePlatforms } from "@/context/platform-context"
import { useRouter, useSearchParams } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { submitIntroComplete } from "./actions"
import { useState } from "react"

export default function KeyInventoryIntro() {
  const router = useRouter()
  const { platforms } = usePlatforms()
  const hasPlatforms = platforms.length > 0
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Add these imports if they don't exist
  const searchParams = useSearchParams()
  const fromLogin = searchParams.get("fromLogin") === "true"

  // Determine button properties based on whether platforms exist
  const buttonProps = {
    href: hasPlatforms ? "/key-inventory?showDashboard=true" : "/platform-settings",
    label: hasPlatforms ? "Access Key Inventory" : "Connect Platform",
  }

  const handleAccessKeyInventory = async () => {
    if (hasPlatforms) {
      setIsSubmitting(true)
      try {
        await submitIntroComplete()
        router.push("/key-inventory?showDashboard=true")
      } catch (error) {
        console.error("Failed to submit intro completion:", error)
      } finally {
        setIsSubmitting(false)
      }
    } else {
      router.push("/platform-settings")
    }
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col items-center py-12 px-4 max-w-7xl mx-auto">
        <div className="flex justify-center mb-8">
          <div className="bg-[#2D3142] p-4 rounded-full">
            <Shield className="h-8 w-8 text-[#6B5EFF]" />
          </div>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold text-center mb-4">Key Inventory</h1>
        <p className="text-gray-400 text-center max-w-2xl mb-10">
          Monitor, manage, and rotate your API keys across all platforms from a single dashboard
        </p>

        {fromLogin && (
          <div className="mb-6 bg-purple-500/10 border border-purple-500/30 text-purple-400 p-4 rounded-md">
            <p className="font-medium">Welcome to Keystrok!</p>
            <p className="text-sm mt-1">
              This introduction will help you get started with managing your API keys securely.
            </p>
          </div>
        )}

        <div className="mb-16">
          <Button
            onClick={handleAccessKeyInventory}
            disabled={isSubmitting}
            className="bg-[#6B5EFF] hover:bg-[#5A4FD9] px-8 py-2 flex items-center gap-2"
            size="lg"
          >
            <Shield className="h-5 w-5" />
            {buttonProps.label}
            {isSubmitting && (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
            )}
          </Button>
        </div>

        <h2 className="text-2xl font-bold mb-8">Why Use Key Inventory?</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          <FeatureCard
            icon={<Shield2 className="h-6 w-6 text-[#6B5EFF]" />}
            title="Enhanced Security"
            description="Monitor the health and security status of all your API keys in one place, reducing the risk of compromised credentials."
          />

          <FeatureCard
            icon={<Clock className="h-6 w-6 text-[#6B5EFF]" />}
            title="Automated Rotation"
            description="Initiate and manage key rotation workflows directly from the dashboard to maintain security best practices."
          />

          <FeatureCard
            icon={<Clock className="h-6 w-6 text-[#6B5EFF]" />}
            title="Age Tracking"
            description="Automatically track the age of your API keys and get notified when they should be rotated."
          />

          <FeatureCard
            icon={<BarChart className="h-6 w-6 text-[#6B5EFF]" />}
            title="Risk Assessment"
            description="Visualize risk levels across your API key inventory to prioritize security actions."
          />

          <FeatureCard
            icon={<CheckCircle className="h-6 w-6 text-[#6B5EFF]" />}
            title="Compliance Ready"
            description="Stay compliant with security policies by maintaining proper key rotation schedules and documentation."
          />

          <FeatureCard
            icon={<Layers className="h-6 w-6 text-[#6B5EFF]" />}
            title="Multi-Platform Support"
            description="Manage keys across all your connected platforms with a unified interface and consistent workflows."
          />
        </div>

        <div className="bg-[#2D3142] rounded-lg p-8 text-center w-full max-w-4xl">
          <h2 className="text-2xl font-bold mb-4">Ready to secure your API keys?</h2>
          <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
            Start monitoring and managing your API keys today to enhance your security posture and gain peace of mind.
          </p>

          <Button
            onClick={handleAccessKeyInventory}
            disabled={isSubmitting}
            className="bg-[#6B5EFF] hover:bg-[#5A4FD9] px-8 py-2 flex items-center gap-2 mx-auto"
            size="lg"
          >
            <Shield className="h-5 w-5" />
            {buttonProps.label}
            {isSubmitting && (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
            )}
          </Button>
        </div>
      </div>
    </DashboardLayout>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="bg-[#1A1D2A] p-6 rounded-lg">
      <div className="mb-4">{icon}</div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-gray-400 text-sm">{description}</p>
    </div>
  )
}
