"use client"

import type React from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { EnsureFullWidth } from "./ensure-full-width"
import { EnsureSidebarStyling } from "./ensure-sidebar-styling"
import { EnhancedBreadcrumb } from "./enhanced-breadcrumb"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <SidebarProvider>
      <div className="flex h-screen overflow-hidden">
        <AppSidebar />
        <SidebarInset
          className="flex-1 transition-all duration-300 ease-in-out"
          style={{ width: "100vw", maxWidth: "100vw", margin: 0, borderRadius: 0, boxShadow: "none" }}
        >
          <main className="h-full w-full overflow-y-auto">
            <div className="w-full p-4 md:p-6">
              <EnhancedBreadcrumb />
              {children}
            </div>
          </main>
        </SidebarInset>
        <EnsureFullWidth />
        <EnsureSidebarStyling />
      </div>
    </SidebarProvider>
  )
}
