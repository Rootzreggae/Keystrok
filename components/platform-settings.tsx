"use client"

import { Button } from "@/components/ui/button"
import { PlatformCard } from "@/components/platform-card"
import { GlobalSettings } from "@/components/global-settings"
import { Plus } from "lucide-react"
import Link from "next/link"
import { usePlatforms } from "@/context/platform-context"

export function PlatformSettings() {
  const { platforms } = usePlatforms()

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">Platform settings</h1>
          <p className="text-gray-400">Manage your observability platform connections</p>
        </div>
        <div className="flex gap-2">
          <Link href="/platform-settings/add">
            <Button className="bg-[#6B5EFF] px-4 py-2 text-white hover:bg-[#5A4FD9]">
              <Plus className="mr-2 h-4 w-4" /> Add Platform
            </Button>
          </Link>
        </div>
      </div>

      <div className="space-y-6">
        <div className="rounded-lg bg-[#171723] p-6">
          <h2 className="mb-4 text-lg font-medium text-white">Connected Platforms</h2>
          <div className="space-y-4">
            {platforms.map((platform) => (
              <PlatformCard
                key={platform.id}
                id={platform.id}
                name={platform.name}
                icon={platform.icon}
                iconColor={platform.iconColor}
                status={platform.status}
                apiKeys={platform.apiKeys}
                adminPermissions={platform.adminPermissions}
                lastSync={platform.lastSync}
                rotationPolicy={platform.rotationPolicy}
                autoDiscovery={platform.autoDiscovery}
              />
            ))}
          </div>
        </div>

        <GlobalSettings />
      </div>
    </div>
  )
}
