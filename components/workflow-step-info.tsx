"use client"

interface WorkflowStepInfoProps {
  currentStep: number
}

export function WorkflowStepInfo({ currentStep }: WorkflowStepInfoProps) {
  // Content for step 1 (Preparation)
  if (currentStep === 1) {
    return (
      <div className="rounded-lg bg-[#171723] p-6">
        <h2 className="mb-4 text-lg font-medium text-white">About this step</h2>
        <p className="mb-6 text-sm text-gray-300">
          The preparation phase helps you understand the impact of rotating this key and ensures you're ready to begin
          the process safely.
        </p>

        <h3 className="mb-3 text-base font-medium text-white">Best Practices</h3>
        <ul className="mb-6 space-y-3">
          <li className="flex items-start gap-2 text-sm text-gray-300">
            <span className="mt-1 text-[#6B5EFF]">•</span>
            Verify all systems using the key
          </li>
          <li className="flex items-start gap-2 text-sm text-gray-300">
            <span className="mt-1 text-[#6B5EFF]">•</span>
            Schedule rotation during low-traffic periods
          </li>
          <li className="flex items-start gap-2 text-sm text-gray-300">
            <span className="mt-1 text-[#6B5EFF]">•</span>
            Notify stakeholders before starting
          </li>
          <li className="flex items-start gap-2 text-sm text-gray-300">
            <span className="mt-1 text-[#6B5EFF]">•</span>
            Allow sufficient time for verification
          </li>
        </ul>

        <h3 className="mb-3 text-base font-medium text-white">What Happens Next</h3>
        <p className="mb-3 text-sm text-gray-300">
          You'll create a new key with the same or modified permissions as the current key.
        </p>
        <p className="mb-3 text-sm text-gray-300">
          Then you'll update all systems to use the new key while temporarily keeping the old key active.
        </p>
        <p className="text-sm text-gray-300">After verification, you'll safely revoke the old key.</p>
      </div>
    )
  }

  // For other steps (not implemented in this example)
  return (
    <div className="rounded-lg bg-[#171723] p-6">
      <h2 className="mb-4 text-lg font-medium text-white">About this step</h2>
      <p className="text-sm text-gray-300">Information about step {currentStep} will be displayed here.</p>
    </div>
  )
}
