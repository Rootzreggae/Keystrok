"use client"

import type React from "react"

import { useState, useEffect } from "react"

interface WorkflowProcessVisualProps {
  className?: string
}

export function WorkflowProcessVisual({ className }: WorkflowProcessVisualProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const totalSteps = 4

  // Auto-advance through steps
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % totalSteps)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className={`rounded-lg bg-[#171723] p-6 ${className}`}>
      <div className="mb-4 flex justify-between">
        {Array.from({ length: totalSteps }).map((_, index) => (
          <div
            key={index}
            className={`h-2 flex-1 mx-1 rounded-full transition-all duration-300 ${
              index === currentStep ? "bg-[#6B5EFF]" : "bg-[#343B4F]"
            }`}
            onClick={() => setCurrentStep(index)}
          />
        ))}
      </div>

      <div className="relative h-64 overflow-hidden rounded-lg bg-[#0D0D14]">
        {/* Step 1: Generate New Key */}
        <div
          className={`absolute inset-0 flex flex-col items-center justify-center p-6 transition-opacity duration-500 ${
            currentStep === 0 ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <div className="mb-4 h-16 w-16 rounded-full bg-[#2B3B64] flex items-center justify-center">
            <KeyIcon className="h-8 w-8 text-[#6B5EFF]" />
          </div>
          <h3 className="mb-2 text-xl font-medium text-white text-center">Generate New API Key</h3>
          <p className="text-gray-400 text-center">Automatically create a new API key in your platform</p>
        </div>

        {/* Step 2: Deploy New Key */}
        <div
          className={`absolute inset-0 flex flex-col items-center justify-center p-6 transition-opacity duration-500 ${
            currentStep === 1 ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <div className="mb-4 h-16 w-16 rounded-full bg-[#2B3B64] flex items-center justify-center">
            <DeployIcon className="h-8 w-8 text-[#6B5EFF]" />
          </div>
          <h3 className="mb-2 text-xl font-medium text-white text-center">Deploy New Key</h3>
          <p className="text-gray-400 text-center">
            Update all services to use the new key while keeping the old one active
          </p>
        </div>

        {/* Step 3: Verify Services */}
        <div
          className={`absolute inset-0 flex flex-col items-center justify-center p-6 transition-opacity duration-500 ${
            currentStep === 2 ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <div className="mb-4 h-16 w-16 rounded-full bg-[#2B3B64] flex items-center justify-center">
            <VerifyIcon className="h-8 w-8 text-[#6B5EFF]" />
          </div>
          <h3 className="mb-2 text-xl font-medium text-white text-center">Verify Services</h3>
          <p className="text-gray-400 text-center">Confirm all services are successfully using the new key</p>
        </div>

        {/* Step 4: Deactivate Old Key */}
        <div
          className={`absolute inset-0 flex flex-col items-center justify-center p-6 transition-opacity duration-500 ${
            currentStep === 3 ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <div className="mb-4 h-16 w-16 rounded-full bg-[#2B3B64] flex items-center justify-center">
            <DeactivateIcon className="h-8 w-8 text-[#6B5EFF]" />
          </div>
          <h3 className="mb-2 text-xl font-medium text-white text-center">Deactivate Old Key</h3>
          <p className="text-gray-400 text-center">Safely remove the old key after the transition period</p>
        </div>
      </div>

      <div className="mt-4 flex justify-center">
        <div className="flex space-x-2">
          {Array.from({ length: totalSteps }).map((_, index) => (
            <button
              key={index}
              className={`h-3 w-3 rounded-full ${index === currentStep ? "bg-[#6B5EFF]" : "bg-[#343B4F]"}`}
              onClick={() => setCurrentStep(index)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

function KeyIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="7.5" cy="15.5" r="5.5" />
      <path d="m21 2-9.6 9.6" />
      <path d="m15.5 7.5 3 3L22 7l-3-3" />
    </svg>
  )
}

function DeployIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 2v20" />
      <path d="m19 15-7 7-7-7" />
      <path d="M5 10h14" />
      <path d="M5 6h14" />
    </svg>
  )
}

function VerifyIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  )
}

function DeactivateIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  )
}
