"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { usePlatforms } from "@/context/platform-context"
import { Edit, Trash2, ChevronDown, RefreshCw, Settings } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useRouter } from "next/navigation"

// Add a detailed view toggle to see more information
export function CustomPlatformManager() {
  const { platforms, removePlatform } = usePlatforms()
  const [platformToDelete, setPlatformToDelete] = useState<string | null>(null)
  const [expandedPlatform, setExpandedPlatform] = useState<string | null>(null)
  const router = useRouter()

  // Filter to only show custom platforms (for this demo, we'll consider any platform with a single letter icon as custom)
  const customPlatforms = platforms.filter((platform) => platform.icon.length === 1)

  const handleEdit = (platformId: string) => {
    // In a real implementation, this would navigate to an edit page with the platform ID
    router.push(`/platform-settings/custom/edit?id=${platformId}`)
  }

  const handleDelete = (platformId: string) => {
    setPlatformToDelete(platformId)
  }

  const confirmDelete = () => {
    if (platformToDelete) {
      removePlatform(platformToDelete)
      setPlatformToDelete(null)
    }
  }

  const cancelDelete = () => {
    setPlatformToDelete(null)
  }

  if (customPlatforms.length === 0) {
    return (
      <div className="rounded-lg bg-[#171723] p-6">
        <div className="text-center">
          <h3 className="text-lg font-medium text-white">No Custom Platforms</h3>
          <p className="mt-2 text-sm text-gray-400">
            You haven't added any custom platforms yet. Add your first custom platform to get started.
          </p>
          <Button
            className="mt-4 bg-[#6B5EFF] hover:bg-[#5A4FD9]"
            onClick={() => router.push("/platform-settings/custom")}
          >
            Add Custom Platform
          </Button>
        </div>
      </div>
    )
  }

  // In the rendering part, update the platform cards to be more detailed:
  return (
    <div className="rounded-lg bg-[#171723] p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-medium text-white">Custom Platforms</h2>
        <Button
          className="bg-[#6B5EFF] hover:bg-[#5A4FD9]"
          onClick={() => router.push("/platform-settings/custom/intro")}
        >
          Add Custom Platform
        </Button>
      </div>

      <div className="space-y-4">
        {customPlatforms.map((platform) => (
          <div key={platform.id} className="rounded-lg border border-[#4B4B58] bg-[#1E1E2D] overflow-hidden">
            <div
              className="flex items-center justify-between p-4 cursor-pointer"
              onClick={() => setExpandedPlatform(expandedPlatform === platform.id ? null : platform.id)}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-md text-lg font-medium text-white`}
                  style={{ backgroundColor: platform.iconColor }}
                >
                  {platform.icon}
                </div>
                <div>
                  <h3 className="text-sm font-medium text-white">{platform.name}</h3>
                  <p className="text-xs text-gray-400">
                    {platform.apiKeys} API {platform.apiKeys === 1 ? "Key" : "Keys"} • {platform.status}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-[#4B4B58] bg-transparent hover:bg-[#2B3B64]"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleEdit(platform.id)
                    }}
                  >
                    <Edit className="h-4 w-4" />
                    <span className="ml-1">Edit</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-[#4B4B58] bg-transparent text-red-500 hover:bg-red-900/20 hover:text-red-400"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDelete(platform.id)
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="ml-1">Delete</span>
                  </Button>
                </div>
                <ChevronDown
                  className={`h-5 w-5 text-gray-400 transition-transform ${
                    expandedPlatform === platform.id ? "transform rotate-180" : ""
                  }`}
                />
              </div>
            </div>

            {expandedPlatform === platform.id && (
              <div className="p-4 border-t border-[#4B4B58] bg-[#171723]">
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <h4 className="text-sm font-medium text-white mb-2">Platform Details</h4>
                    <table className="w-full text-sm">
                      <tbody>
                        <tr>
                          <td className="py-1 text-gray-400">Status:</td>
                          <td className="py-1 text-white">
                            <span
                              className={`inline-flex items-center rounded-full px-2 py-1 text-xs ${
                                platform.status === "Connected"
                                  ? "bg-green-900/20 text-green-400"
                                  : "bg-red-900/20 text-red-400"
                              }`}
                            >
                              {platform.status}
                            </span>
                          </td>
                        </tr>
                        <tr>
                          <td className="py-1 text-gray-400">Last Sync:</td>
                          <td className="py-1 text-white">{platform.lastSync}</td>
                        </tr>
                        <tr>
                          <td className="py-1 text-gray-400">API Keys:</td>
                          <td className="py-1 text-white">{platform.apiKeys}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-white mb-2">Settings</h4>
                    <table className="w-full text-sm">
                      <tbody>
                        <tr>
                          <td className="py-1 text-gray-400">Rotation Policy:</td>
                          <td className="py-1 text-white">{platform.rotationPolicy}</td>
                        </tr>
                        <tr>
                          <td className="py-1 text-gray-400">Auto Discovery:</td>
                          <td className="py-1 text-white">{platform.autoDiscovery}</td>
                        </tr>
                        <tr>
                          <td className="py-1 text-gray-400">Permissions:</td>
                          <td className="py-1 text-white">{platform.adminPermissions}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="mt-4 flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-[#4B7BEC] bg-transparent text-[#4B7BEC] hover:bg-[#2B3B64] hover:text-[#7B9CFF]"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Sync Now
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-[#4B4B58] bg-transparent text-white hover:bg-[#2B3B64]"
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Configure
                  </Button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <AlertDialog open={!!platformToDelete} onOpenChange={() => setPlatformToDelete(null)}>
        <AlertDialogContent className="border-[#4B4B58] bg-[#171723] text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Custom Platform</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              Are you sure you want to delete this custom platform? This action cannot be undone and will remove all
              associated API keys and settings.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-[#4B4B58] bg-[#23395D] text-white hover:bg-[#2B3B64]">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction className="bg-red-600 text-white hover:bg-red-700" onClick={confirmDelete}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
