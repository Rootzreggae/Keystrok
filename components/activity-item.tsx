import type { Activity } from "@/context/activity-context"
import { Check, Clock } from "lucide-react"

interface ActivityItemProps {
  activity: Activity
}

export function ActivityItem({ activity }: ActivityItemProps) {
  // Function to render activity details based on type
  const renderActivityDetails = () => {
    switch (activity.type) {
      case "platform_added":
        return {
          name: `${activity.platformName} Platform`,
          description: `Platform connected - ${activity.date}`,
        }
      case "workflow_created":
        return {
          name: activity.workflowName || "Rotation Workflow",
          description: `Workflow created - ${activity.date}`,
        }
      case "key_rotated":
        return {
          name: activity.keyName || "API Key",
          description: `Key rotated - ${activity.date}`,
        }
      case "workflow_completed":
        return {
          name: activity.workflowName || "Rotation Workflow",
          description: `Workflow completed - ${activity.date}`,
        }
      default:
        return {
          name: "Unknown Activity",
          description: `Activity recorded - ${activity.date}`,
        }
    }
  }

  const details = renderActivityDetails()

  return (
    <div className="flex items-center justify-between rounded-lg bg-[#1E1E2D] p-4">
      <div className="flex items-center space-x-4">
        <div className={`flex h-10 w-10 items-center justify-center rounded-full text-white ${activity.platformColor}`}>
          <span className="text-lg font-medium">{activity.platformIcon}</span>
        </div>
        <div>
          <p className="font-medium text-white">{details.name}</p>
          <p className="text-sm text-gray-400">{details.description}</p>
        </div>
      </div>
      <div
        className={`flex h-8 w-8 items-center justify-center rounded-full ${
          activity.status === "completed" ? "bg-[#1F4E3A]" : "bg-[#2B3B64]"
        }`}
      >
        {activity.status === "completed" ? (
          <Check className="h-4 w-4 text-[#21D07A]" />
        ) : (
          <Clock className="h-4 w-4 text-[#7B9CFF]" />
        )}
      </div>
    </div>
  )
}
