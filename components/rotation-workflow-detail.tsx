"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { WorkflowProgressTracker } from "@/components/workflow-progress-tracker"
import { KeyInformationPanel } from "@/components/key-information-panel"
import { SystemsUsingKeyPanel } from "@/components/systems-using-key-panel"
import { BeforeYouBeginPanel } from "@/components/before-you-begin-panel"
import { WorkflowStepInfo } from "@/components/workflow-step-info"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"

interface RotationWorkflowDetailProps {
  workflow: any // Using any for brevity, but should be properly typed
}

export function RotationWorkflowDetail({ workflow }: RotationWorkflowDetailProps) {
  const [allChecked, setAllChecked] = useState(false)
  const [checkboxes, setCheckboxes] = useState({
    systemsIdentified: false,
    accessToUpdate: false,
    understandProcess: false,
    notifiedTeam: false,
  })
  const [isStarting, setIsStarting] = useState(false)

  const handleCheckboxChange = (name: keyof typeof checkboxes) => {
    const newCheckboxes = {
      ...checkboxes,
      [name]: !checkboxes[name],
    }
    setCheckboxes(newCheckboxes)
    setAllChecked(
      newCheckboxes.systemsIdentified &&
        newCheckboxes.accessToUpdate &&
        newCheckboxes.understandProcess &&
        newCheckboxes.notifiedTeam,
    )
  }

  const handleStartRotation = () => {
    if (!allChecked) return

    setIsStarting(true)

    // Simulate API call
    setTimeout(() => {
      setIsStarting(false)
      toast({
        title: "Rotation started",
        description: "Your key rotation workflow has been started successfully.",
      })
      // In a real app, you would navigate to the next step or refresh the page
    }, 1000)
  }

  return (
    <div className="w-full space-y-6">
      {/* Header with back button */}
      <div className="flex items-center gap-4">
        <Link href="/rotation-workflows">
          <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-semibold text-white">{workflow.name}</h1>
          <p className="text-gray-400">{workflow.subtitle}</p>
        </div>
      </div>

      {/* Progress tracker */}
      <WorkflowProgressTracker steps={workflow.steps} currentStep={workflow.currentStep} />

      {/* Workflow metadata */}
      <div className="flex flex-wrap justify-between gap-4 text-sm text-gray-400">
        <div>Started: {workflow.startedAt}</div>
        <div>Elapsed: {workflow.elapsedTime}</div>
        <div>Est. Completion: {workflow.estimatedCompletion}</div>
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {/* Key Information Panel */}
          <KeyInformationPanel keyInfo={workflow.keyInfo} />

          {/* Systems Using This Key */}
          <SystemsUsingKeyPanel systems={workflow.systems} usageData={workflow.usageData} />

          {/* Before You Begin */}
          <BeforeYouBeginPanel checkboxes={checkboxes} onCheckboxChange={handleCheckboxChange} />
        </div>

        {/* Right sidebar with step information */}
        <div className="space-y-6">
          <WorkflowStepInfo currentStep={workflow.currentStep} />
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex justify-end gap-4 pt-4">
        <Button variant="outline">Cancel</Button>
        <Button disabled={!allChecked || isStarting} onClick={handleStartRotation}>
          {isStarting ? "Starting..." : "Start Rotation"}
        </Button>
      </div>

      <Toaster />
    </div>
  )
}
