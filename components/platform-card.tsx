"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { usePlatforms } from "@/context/platform-context"
import { useState } from "react"
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
import Link from "next/link"

interface PlatformCardProps {
  id: string
  name: string
  icon: string
  iconColor: string
  status: "Connected" | "Disconnected"
  apiKeys: number
  adminPermissions: string
  lastSync: string
  rotationPolicy: string
  autoDiscovery: string
}

export function PlatformCard({
  id,
  name,
  icon,
  iconColor,
  status,
  apiKeys,
  adminPermissions,
  lastSync,
  rotationPolicy,
  autoDiscovery,
}: PlatformCardProps) {
  const { removePlatform } = usePlatforms()
  const [showDisconnectDialog, setShowDisconnectDialog] = useState(false)
  const [isDisconnecting, setIsDisconnecting] = useState(false)

  const handleDisconnect = async () => {
    try {
      setIsDisconnecting(true)
      await removePlatform(id)
      setShowDisconnectDialog(false)
    } catch (error) {
      console.error("Error disconnecting platform:", error)
    } finally {
      setIsDisconnecting(false)
    }
  }

  return (
    <>
      <div className="rounded-lg bg-[#1E1E2D] p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div className={cn("flex h-10 w-10 items-center justify-center rounded-full text-white", iconColor)}>
              <span className="text-lg font-medium">{icon}</span>
            </div>
            <span className="text-lg font-medium text-white">{name}</span>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button variant="outline" onClick={() => setShowDisconnectDialog(true)} disabled={isDisconnecting}>
              {isDisconnecting ? "Disconnecting..." : "Disconnect"}
            </Button>
            <Link href="/platform-settings/custom/intro">
              <Button variant="secondary">Configure</Button>
            </Link>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-400">Status:</span>
              <div className="flex items-center gap-1">
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                <span className="text-sm text-white">{status}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-400">Rotation Policy:</span>
              <span className="text-sm text-white">{rotationPolicy}</span>
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-400">API Keys:</span>
              <span className="text-sm text-white">{apiKeys}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-400">Auto-Discovery:</span>
              <span className="text-sm text-white">{autoDiscovery}</span>
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-400">Admin Permissions:</span>
              <span className="text-sm text-white">{adminPermissions}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-400">Last Sync:</span>
              <span className="text-sm text-white">{lastSync}</span>
            </div>
          </div>
        </div>
      </div>

      <AlertDialog open={showDisconnectDialog} onOpenChange={setShowDisconnectDialog}>
        <AlertDialogContent className="bg-[#171723] border border-[#343B4F] text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Disconnect Platform</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              Are you sure you want to disconnect {name}? This will remove all associated API keys and settings.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-[#23395D] text-white hover:bg-[#2B3B64]" disabled={isDisconnecting}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDisconnect}
              className="bg-[#6B5EFF] text-white hover:bg-[#5A4FD9]"
              disabled={isDisconnecting}
            >
              {isDisconnecting ? "Disconnecting..." : "Disconnect"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
