"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { RefreshCw, Shield, Clock, CheckCircle, ArrowRight, Info } from "lucide-react"
import Link from "next/link"
import { WorkflowProcessVisual } from "@/components/workflow-process-visual"

export function RotationWorkflowsNoPlatforms() {
  return (
    <div className="w-full space-y-8">
      {/* Hero Section */}
      <div className="rounded-lg bg-[#171723] p-8">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-white mb-4">Automate Your API Key Rotation</h1>
            <p className="text-gray-400 text-lg mb-6">
              Secure your infrastructure with automated key rotation workflows that reduce risk and save time.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/platform-settings/add">
                <Button className="bg-[#6B5EFF] hover:bg-[#5A4FD9] px-6 py-5 text-base">
                  Connect Your First Platform
                </Button>
              </Link>
              <Button
                variant="outline"
                className="border-[#343B4F] bg-[#1E1E2D] text-white hover:bg-[#2B3B64] px-6 py-5 text-base"
              >
                Watch Demo
              </Button>
            </div>
          </div>
          <div className="flex-1 flex justify-center">
            <div className="relative w-full max-w-md aspect-square">
              <div className="absolute inset-0 bg-[#2B3B64] rounded-full opacity-20 animate-pulse"></div>
              <div className="absolute inset-4 bg-[#2B3B64] rounded-full opacity-30"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-[#6B5EFF] rounded-full p-8">
                  <RefreshCw className="h-20 w-20 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Info Alert */}
      <div className="rounded-lg bg-[#2B3B64] p-4 flex items-start gap-3">
        <Info className="h-5 w-5 text-[#7B9CFF] flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-[#7B9CFF]">
            <span className="font-medium">Getting started is easy.</span> Connect a platform like Datadog, Grafana, or
            New Relic to start creating rotation workflows.
          </p>
        </div>
      </div>

      {/* Key Benefits Section */}
      <div>
        <h2 className="text-2xl font-semibold text-white mb-6">Why Use Rotation Workflows?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <BenefitCard
            icon={<Shield className="h-8 w-8 text-[#6B5EFF]" />}
            title="Enhanced Security"
            description="Regularly rotating API keys limits the damage from potential exposures and follows security best practices."
          />
          <BenefitCard
            icon={<Clock className="h-8 w-8 text-[#6B5EFF]" />}
            title="Save Time & Effort"
            description="Automate the entire rotation process from key generation to deployment and verification."
          />
          <BenefitCard
            icon={<CheckCircle className="h-8 w-8 text-[#6B5EFF]" />}
            title="Ensure Compliance"
            description="Meet security requirements and industry standards with documented, auditable rotation processes."
          />
        </div>
      </div>

      {/* How It Works Section */}
      <div>
        <h2 className="text-2xl font-semibold text-white mb-6">How It Works</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <WorkflowStep
            number="1"
            title="Connect Your Platforms"
            description="Integrate with Datadog, Grafana, New Relic and other observability platforms."
            image="/unified-data-dark.png"
          />
          <WorkflowStep
            number="2"
            title="Create Rotation Workflows"
            description="Set up automated processes with our step-by-step wizard to safely replace keys."
            image="/dark-workflow-wizard.png"
          />
          <WorkflowStep
            number="3"
            title="Monitor & Manage"
            description="Track progress and manage your rotation workflows from a central dashboard."
            image="/dark-workflow-dashboard.png"
          />
        </div>
      </div>

      {/* Workflow Process Visual */}
      <div className="rounded-lg bg-[#171723] p-8">
        <h2 className="text-2xl font-semibold text-white mb-6">See How Rotation Works</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-medium text-white mb-4">Zero-Downtime Rotation Process</h3>
            <p className="text-gray-400 mb-6">
              Our intelligent workflow ensures your services continue running without interruption during key rotation.
              The process follows these steps:
            </p>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[#6B5EFF] mt-0.5">
                  <span className="text-xs font-medium text-white">1</span>
                </div>
                <p className="text-gray-300">Generate a new API key in your platform</p>
              </li>
              <li className="flex items-start gap-3">
                <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[#6B5EFF] mt-0.5">
                  <span className="text-xs font-medium text-white">2</span>
                </div>
                <p className="text-gray-300">Deploy the new key to all services while keeping the old key active</p>
              </li>
              <li className="flex items-start gap-3">
                <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[#6B5EFF] mt-0.5">
                  <span className="text-xs font-medium text-white">3</span>
                </div>
                <p className="text-gray-300">Verify all services are successfully using the new key</p>
              </li>
              <li className="flex items-start gap-3">
                <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[#6B5EFF] mt-0.5">
                  <span className="text-xs font-medium text-white">4</span>
                </div>
                <p className="text-gray-300">Safely deactivate the old key after the transition period</p>
              </li>
            </ul>
          </div>
          <WorkflowProcessVisual />
        </div>
      </div>

      {/* CTA Section */}
      <div className="rounded-lg bg-gradient-to-r from-[#343B4F] to-[#2B3B64] p-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl font-semibold text-white mb-2">Ready to get started?</h2>
            <p className="text-gray-300">
              Connect your first platform and create your first rotation workflow in minutes.
            </p>
          </div>
          <Link href="/platform-settings/add">
            <Button className="bg-[#6B5EFF] hover:bg-[#5A4FD9] px-6 py-5 text-base whitespace-nowrap">
              Connect Platform <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

interface BenefitCardProps {
  icon: React.ReactNode
  title: string
  description: string
}

function BenefitCard({ icon, title, description }: BenefitCardProps) {
  return (
    <div className="rounded-lg bg-[#171723] p-6 h-full">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-medium text-white mb-2">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </div>
  )
}

interface WorkflowStepProps {
  number: string
  title: string
  description: string
  image: string
}

function WorkflowStep({ number, title, description, image }: WorkflowStepProps) {
  return (
    <div className="rounded-lg bg-[#171723] overflow-hidden h-full flex flex-col">
      <div className="relative">
        <img src={image || "/placeholder.svg"} alt={title} className="w-full h-48 object-cover" />
        <div className="absolute top-4 left-4 flex h-8 w-8 items-center justify-center rounded-full bg-[#6B5EFF]">
          <span className="text-white font-medium">{number}</span>
        </div>
      </div>
      <div className="p-6 flex-1">
        <h3 className="text-xl font-medium text-white mb-2">{title}</h3>
        <p className="text-gray-400">{description}</p>
      </div>
    </div>
  )
}
