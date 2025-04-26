"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { CirclePlus, Server, Zap, Settings, Globe } from "lucide-react"

export function FirstTimeCustomPlatform() {
  const router = useRouter()

  const handleGetStarted = () => {
    router.push("/platform-settings/custom/intro")
  }

  return (
    <div className="rounded-lg bg-[#171723] p-8">
      <div className="mx-auto max-w-3xl text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#6B5EFF]/20">
          <Server className="h-8 w-8 text-[#6B5EFF]" />
        </div>

        <h1 className="mt-4 text-2xl font-bold text-white">Connect Your Custom Platforms</h1>
        <p className="mt-2 text-gray-400">
          Extend Keystrok's capabilities by adding your own custom platforms and internal tools
        </p>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          <FeatureBox
            icon={<Globe className="h-5 w-5 text-[#6B5EFF]" />}
            title="Any Platform"
            description="Connect to internal or proprietary systems"
          />
          <FeatureBox
            icon={<Zap className="h-5 w-5 text-[#6B5EFF]" />}
            title="Unified Management"
            description="Manage all your keys in one place"
          />
          <FeatureBox
            icon={<Settings className="h-5 w-5 text-[#6B5EFF]" />}
            title="Complete Control"
            description="Configure every aspect of your integration"
          />
        </div>

        <Button onClick={handleGetStarted} className="mt-8 bg-[#6B5EFF] hover:bg-[#5A4FD9]" size="lg">
          <CirclePlus className="mr-2 h-5 w-5" />
          Create Custom Platform
        </Button>
      </div>
    </div>
  )
}

interface FeatureBoxProps {
  icon: React.ReactNode
  title: string
  description: string
}

function FeatureBox({ icon, title, description }: FeatureBoxProps) {
  return (
    <div className="rounded-lg bg-[#1E1E2D] p-5">
      <div className="flex flex-col items-center text-center">
        <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-md bg-[#2D2D44]">{icon}</div>
        <h3 className="text-base font-medium text-white">{title}</h3>
        <p className="mt-1 text-sm text-gray-400">{description}</p>
      </div>
    </div>
  )
}
