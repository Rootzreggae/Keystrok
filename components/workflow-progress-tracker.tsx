"use client"

import { cn } from "@/lib/utils"

interface Step {
  id: number
  name: string
  status: "completed" | "current" | "pending"
}

interface WorkflowProgressTrackerProps {
  steps: Step[]
  currentStep: number
}

export function WorkflowProgressTracker({ steps, currentStep }: WorkflowProgressTrackerProps) {
  return (
    <div className="flex justify-center w-full py-8">
      <div className="w-[70%]">
        <ul className="steps w-full">
          {steps.map((step, index) => {
            const isActive = index < currentStep || step.status === "current"
            return (
              <li key={step.id} className={cn("step", isActive ? "step-primary" : "")}>
                {step.name}
              </li>
            )
          })}
        </ul>
      </div>

      {/* Custom CSS for DaisyUI-style steps */}
      <style jsx global>{`
        /* Base steps container */
        .steps {
          display: flex;
          overflow: hidden;
          counter-reset: step;
        }

        /* Individual step */
        .step {
          display: grid;
          grid-template-columns: auto;
          grid-template-rows: 40px 1fr;
          place-items: center;
          text-align: center;
          min-width: 4rem;
          flex: 1;
          color: #94a3b8;
          position: relative;
        }

        /* Step counter */
        .step:before {
          content: counter(step);
          counter-increment: step;
          grid-column: 1;
          grid-row: 1;
          height: 2rem;
          width: 2rem;
          border-radius: 9999px;
          background-color: #1e1e2d;
          z-index: 10;
          place-items: center;
          place-content: center;
          display: grid;
          font-size: 0.875rem;
          color: white;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
          transition: all 0.2s ease;
        }

        /* Connector line */
        .step:not(:first-child):after {
          content: '';
          position: absolute;
          left: -50%;
          top: 1rem;
          width: 100%;
          height: 0.25rem;
          background-color: #343b4f;
          z-index: 1;
        }

        /* Active step styling */
        .step-primary {
          color: #6b5eff;
        }

        .step-primary:before {
          background-color: #6b5eff;
          color: white;
        }

        .step-primary:after {
          background-color: #6b5eff;
        }

        /* Responsive adjustments */
        @media (max-width: 640px) {
          .step {
            min-width: 2rem;
          }
          
          .step:before {
            height: 1.5rem;
            width: 1.5rem;
            font-size: 0.75rem;
          }
        }
      `}</style>
    </div>
  )
}
