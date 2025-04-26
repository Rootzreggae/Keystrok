"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { Settings, Server, Code, ArrowRight, ShieldCheck, BarChart4 } from "lucide-react"

export function CustomPlatformIntroduction() {
  const router = useRouter()
  const [showWizard, setShowWizard] = useState(false)

  const handleGetStarted = () => {
    router.push("/platform-settings/custom/intro")
  }

  const handleSkipIntro = () => {
    router.push("/platform-settings/custom")
  }

  return (
    <div className="w-full space-y-8">
      <div className="rounded-lg bg-[#171723] p-8">
        <div className="mx-auto max-w-3xl space-y-8">
          <div className="text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#6B5EFF]/20">
              <Settings className="h-8 w-8 text-[#6B5EFF]" />
            </div>
            <h1 className="mt-4 text-2xl font-bold text-white">Custom Platform Integration</h1>
            <p className="mt-2 text-gray-400">
              Connect your own observability platforms and custom tools to Keystrok for unified key management
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <FeatureCard
              icon={<Server className="h-5 w-5 text-[#6B5EFF]" />}
              title="Any API-Based Platform"
              description="Connect to any platform with an API for authentication and key management"
            />
            <FeatureCard
              icon={<Code className="h-5 w-5 text-[#6B5EFF]" />}
              title="Flexible Configuration"
              description="Configure endpoints, authentication methods, and custom headers"
            />
            <FeatureCard
              icon={<BarChart4 className="h-5 w-5 text-[#6B5EFF]" />}
              title="Monitoring Support"
              description="Set up metrics, logs, and traces integration with your custom platform"
            />
            <FeatureCard
              icon={<ShieldCheck className="h-5 w-5 text-[#6B5EFF]" />}
              title="Secure Key Management"
              description="Apply the same key rotation policies and security features to your custom platforms"
            />
          </div>

          <div className="rounded-lg bg-[#1E1E2D] p-6">
            <h2 className="text-lg font-medium text-white">How It Works</h2>
            <ul className="mt-4 space-y-4">
              <StepItem
                number={1}
                title="Define Your Platform"
                description="Provide basic information about your custom platform"
              />
              <StepItem
                number={2}
                title="Configure Features"
                description="Specify which features and capabilities your platform supports"
              />
              <StepItem
                number={3}
                title="Set Up API Integration"
                description="Configure API endpoints, authentication methods, and security settings"
              />
              <StepItem
                number={4}
                title="Test & Validate"
                description="Test the connection to ensure everything is configured correctly"
              />
            </ul>
          </div>

          <div className="flex flex-col justify-center gap-3 sm:flex-row">
            <Button onClick={handleGetStarted} className="bg-[#6B5EFF] hover:bg-[#5A4FD9]">
              Get Started <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              onClick={handleSkipIntro}
              className="border-[#4B4B58] bg-transparent text-white hover:bg-[#2B3B64]"
            >
              Skip Introduction
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

interface FeatureCardProps {
  icon: React.ReactNode
  title: string
  description: string
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="rounded-lg bg-[#1E1E2D] p-5">
      <div className="flex items-start gap-4">
        <div className="mt-1 flex h-8 w-8 items-center justify-center rounded-md bg-[#2D2D44]">{icon}</div>
        <div>
          <h3 className="text-base font-medium text-white">{title}</h3>
          <p className="mt-1 text-sm text-gray-400">{description}</p>
        </div>
      </div>
    </div>
  )
}

interface StepItemProps {
  number: number
  title: string
  description: string
}

function StepItem({ number, title, description }: StepItemProps) {
  return (
    <li className="flex items-start gap-4">
      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#6B5EFF] text-white">
        {number}
      </div>
      <div>
        <h3 className="text-base font-medium text-white">{title}</h3>
        <p className="mt-1 text-sm text-gray-400">{description}</p>
      </div>
    </li>
  )
}
