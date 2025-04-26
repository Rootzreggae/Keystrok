"use client"

interface KeyInfo {
  platform: string
  keyType: string
  keyId: string
  created: string
  age: string
  lastUsed: string
  usage: {
    last30Days: string
    highestDay: string
  }
  permissions: string
}

interface KeyInformationPanelProps {
  keyInfo: KeyInfo
}

export function KeyInformationPanel({ keyInfo }: KeyInformationPanelProps) {
  return (
    <div className="rounded-lg bg-[#171723] p-6">
      <h2 className="mb-4 text-lg font-medium text-white">Key Information</h2>

      <div className="grid grid-cols-1 gap-4 rounded-lg bg-[#1E1E2D] p-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="space-y-1">
          <div className="flex justify-between">
            <span className="text-sm text-gray-400">Platform:</span>
            <span className="text-sm text-white">{keyInfo.platform}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-sm text-gray-400">Key Type:</span>
            <span className="text-sm text-white">{keyInfo.keyType}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-sm text-gray-400">Key ID:</span>
            <span className="text-sm text-white">{keyInfo.keyId}</span>
          </div>
        </div>

        <div className="space-y-1">
          <div className="flex justify-between">
            <span className="text-sm text-gray-400">Created:</span>
            <span className="text-sm text-white">{keyInfo.created}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-sm text-gray-400">Age:</span>
            <span className="text-sm text-[#FF4473]">{keyInfo.age}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-sm text-gray-400">Last Used:</span>
            <span className="text-sm text-white">{keyInfo.lastUsed}</span>
          </div>
        </div>

        <div className="space-y-1">
          <div className="flex justify-between">
            <span className="text-sm text-gray-400">Usage (30 days):</span>
            <span className="text-sm text-white">{keyInfo.usage.last30Days}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-sm text-gray-400">Highest Day:</span>
            <span className="text-sm text-white">{keyInfo.usage.highestDay}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-sm text-gray-400">Permissions:</span>
            <span className="text-sm text-white">{keyInfo.permissions}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
