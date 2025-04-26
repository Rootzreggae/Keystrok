"use client"

interface BeforeYouBeginPanelProps {
  checkboxes: {
    systemsIdentified: boolean
    accessToUpdate: boolean
    understandProcess: boolean
    notifiedTeam: boolean
  }
  onCheckboxChange: (name: keyof BeforeYouBeginPanelProps["checkboxes"]) => void
}

export function BeforeYouBeginPanel({ checkboxes, onCheckboxChange }: BeforeYouBeginPanelProps) {
  return (
    <div className="rounded-lg bg-[#171723] p-6">
      <h2 className="mb-4 text-lg font-medium text-white">Before You Begin</h2>

      <div className="space-y-4 rounded-lg bg-[#1E1E2D] p-4">
        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            id="systemsIdentified"
            checked={checkboxes.systemsIdentified}
            onChange={() => onCheckboxChange("systemsIdentified")}
            className="mt-1 h-4 w-4 rounded border-[#343B4F] bg-[#0D0D14] text-[#6B5EFF] focus:ring-[#6B5EFF]"
          />
          <label htmlFor="systemsIdentified" className="text-sm text-gray-300">
            I have identified all systems using this key
          </label>
        </div>

        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            id="accessToUpdate"
            checked={checkboxes.accessToUpdate}
            onChange={() => onCheckboxChange("accessToUpdate")}
            className="mt-1 h-4 w-4 rounded border-[#343B4F] bg-[#0D0D14] text-[#6B5EFF] focus:ring-[#6B5EFF]"
          />
          <label htmlFor="accessToUpdate" className="text-sm text-gray-300">
            I have access to update these systems
          </label>
        </div>

        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            id="understandProcess"
            checked={checkboxes.understandProcess}
            onChange={() => onCheckboxChange("understandProcess")}
            className="mt-1 h-4 w-4 rounded border-[#343B4F] bg-[#0D0D14] text-[#6B5EFF] focus:ring-[#6B5EFF]"
          />
          <label htmlFor="understandProcess" className="text-sm text-gray-300">
            I understand this process may take up to 7 days
          </label>
        </div>

        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            id="notifiedTeam"
            checked={checkboxes.notifiedTeam}
            onChange={() => onCheckboxChange("notifiedTeam")}
            className="mt-1 h-4 w-4 rounded border-[#343B4F] bg-[#0D0D14] text-[#6B5EFF] focus:ring-[#6B5EFF]"
          />
          <label htmlFor="notifiedTeam" className="text-sm text-gray-300">
            I've notified relevant team members
          </label>
        </div>
      </div>
    </div>
  )
}
