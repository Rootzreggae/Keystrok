"use client"

import type React from "react"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Shield, RotateCcw, AlertTriangle } from "lucide-react"
import Link from "next/link"

export default function HowItWorksPage() {
  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="flex items-center mb-8">
          <Link href="/key-inventory">
            <Button variant="ghost" className="mr-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-white">How Key Inventory Works</h1>
        </div>

        <div className="space-y-12">
          <FeatureSection
            icon={<Shield className="h-10 w-10 text-[#6B5EFF]" />}
            title="Monitor Your API Keys"
            description="Track all your API keys across different platforms in one centralized dashboard. Get visibility into key age, usage patterns, and security status."
          />

          <FeatureSection
            icon={<AlertTriangle className="h-10 w-10 text-[#FFB800]" />}
            title="Identify Security Risks"
            description="Automatically identify high-risk API keys based on age, permissions, and usage patterns. Receive alerts when keys need to be rotated."
          />

          <FeatureSection
            icon={<RotateCcw className="h-10 w-10 text-[#21D07A]" />}
            title="Streamline Key Rotation"
            description="Follow guided workflows to safely rotate your API keys without service disruption. Maintain detailed audit logs of all key rotations."
          />
        </div>

        <div className="mt-12 flex justify-center">
          <Link href="/key-inventory/dashboard">
            <Button size="lg" className="bg-[#6B5EFF] hover:bg-[#5A4FD9]">
              Access Key Inventory
            </Button>
          </Link>
        </div>
      </div>
    </DashboardLayout>
  )
}

function FeatureSection({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <div className="flex gap-6">
      <div className="flex-shrink-0 flex items-start justify-center w-16 h-16 rounded-full bg-[#171723]">{icon}</div>
      <div>
        <h2 className="text-xl font-semibold text-white mb-2">{title}</h2>
        <p className="text-gray-400">{description}</p>
      </div>
    </div>
  )
}
