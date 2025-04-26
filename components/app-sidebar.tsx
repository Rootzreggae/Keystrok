"use client"

import type * as React from "react"
import { cn } from "@/lib/utils"
import { BarChart2, Key, RefreshCw, Search, Settings, FileText, PanelLeftClose, Lock, User, LogOut } from "lucide-react"
import { SidebarMenu, SidebarMenuButton, SidebarTrigger, useSidebar } from "@/components/ui/sidebar"
import { CustomSidebar, CustomSidebarContent, CustomSidebarHeader, CustomSidebarFooter } from "./custom-sidebar"
import { CustomSidebarMenuItem } from "./custom-sidebar-menu-item"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useScreenSize } from "@/hooks/use-screen-size"
import { useAuth } from "@/context/auth-context"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"

interface NavItem {
  title: string
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
  href: string
  disabled?: boolean
  comingSoon?: boolean
}

const navItems: NavItem[] = [
  {
    title: "Dashboard",
    icon: BarChart2,
    href: "/",
  },
  {
    title: "Key Inventory",
    icon: Key,
    href: "/key-inventory",
  },
  {
    title: "Rotation Workflows",
    icon: RefreshCw,
    href: "/rotation-workflows",
  },
  {
    title: "Discovery Scanner",
    icon: Search,
    href: "/discovery-scanner",
    disabled: true,
    comingSoon: true,
  },
  {
    title: "Platform Settings",
    icon: Settings,
    href: "/platform-settings",
  },
  {
    title: "Reports",
    icon: FileText,
    href: "/reports",
    disabled: true,
    comingSoon: true,
  },
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof CustomSidebar>) {
  const pathname = usePathname()
  const { state } = useSidebar()
  const isCollapsed = state === "collapsed"
  const screenSize = useScreenSize()
  const isMobile = screenSize === "sm" || screenSize === "md"
  const { user, signOut } = useAuth()

  // Don't render the sidebar on mobile screens
  if (isMobile) {
    return null
  }

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user?.email) return "U"
    return user.email.charAt(0).toUpperCase()
  }

  return (
    <CustomSidebar
      collapsible="icon"
      className="border-r border-gray-800 transition-all duration-300 ease-in-out bg-[#1a1b2e]"
      {...props}
    >
      <CustomSidebarHeader
        className={cn(
          "flex h-14 items-center transition-all duration-300",
          isCollapsed ? "justify-center px-0" : "justify-between px-4",
        )}
      >
        <Link
          href="/"
          className={cn(
            "flex items-center transition-all duration-300 cursor-pointer",
            isCollapsed ? "justify-center w-full" : "flex-row gap-3",
          )}
        >
          <div
            className={cn(
              "flex items-center justify-center bg-purple-600 text-white transition-all duration-300",
              isCollapsed ? "w-8 h-8" : "h-10 w-10 rounded-md",
            )}
          >
            <KeyIcon className={cn(isCollapsed ? "h-5 w-5" : "h-6 w-6")} />
          </div>
          {!isCollapsed && <span className="text-xl font-semibold text-white sidebar-brand">Keystrok</span>}
        </Link>
        {!isCollapsed && (
          <SidebarTrigger className="bg-transparent hover:bg-gray-700/50">
            <PanelLeftClose className="h-5 w-5" />
          </SidebarTrigger>
        )}
      </CustomSidebarHeader>
      <CustomSidebarContent className={cn("transition-all duration-300", isCollapsed ? "p-0" : "p-2")}>
        <SidebarMenu className={cn("flex w-full min-w-0 flex-col gap-6 transition-all duration-300 mt-6")}>
          {navItems.map((item, index) => (
            <TooltipProvider key={item.href} delayDuration={300}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div>
                    <CustomSidebarMenuItem
                      isHighlighted={pathname === item.href || pathname.startsWith(`${item.href}/`)}
                      isDisabled={item.disabled}
                    >
                      {item.disabled ? (
                        <div
                          className={cn(
                            "flex items-center justify-center opacity-50 cursor-not-allowed",
                            isCollapsed ? "h-10 w-full" : "h-8 gap-4 px-4 py-2",
                            (pathname === item.href || pathname.startsWith(`${item.href}/`)) &&
                              "text-white font-medium",
                          )}
                        >
                          <item.icon className="h-5 w-5 text-gray-400" />
                          {!isCollapsed && <span>{item.title}</span>}
                          {!isCollapsed && <Lock className="h-3.5 w-3.5 ml-auto" />}
                        </div>
                      ) : (
                        <SidebarMenuButton
                          asChild
                          isActive={pathname === item.href || pathname.startsWith(`${item.href}/`)}
                          className={cn(
                            "transition-all duration-200",
                            isCollapsed ? "h-10 justify-center px-0 w-full" : "h-8 gap-4",
                            (pathname === item.href || pathname.startsWith(`${item.href}/`)) &&
                              "text-white font-medium",
                          )}
                        >
                          <Link
                            href={item.href}
                            className={cn(
                              "flex items-center",
                              isCollapsed ? "justify-center w-full h-full" : "",
                              pathname === item.href && isCollapsed ? "icon-active" : "",
                            )}
                          >
                            {pathname === item.href && isCollapsed ? (
                              <div className="flex items-center justify-center bg-[#1e1e3a] w-10 h-10 rounded-md">
                                <item.icon className="h-5 w-5 text-white" />
                              </div>
                            ) : (
                              <item.icon className={cn("h-5 w-5", item.disabled ? "text-gray-400" : "text-white")} />
                            )}
                            {!isCollapsed && <span>{item.title}</span>}
                          </Link>
                        </SidebarMenuButton>
                      )}
                    </CustomSidebarMenuItem>
                  </div>
                </TooltipTrigger>
                {isCollapsed && (
                  <TooltipContent side="right">
                    <p>
                      {item.title}
                      {item.comingSoon ? " - Coming soon" : ""}
                    </p>
                  </TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
          ))}
        </SidebarMenu>
      </CustomSidebarContent>

      <CustomSidebarFooter className={cn("p-4 border-t border-gray-800", isCollapsed && "p-2")}>
        {user ? (
          <div className={cn("flex items-center", isCollapsed ? "flex-col" : "justify-between")}>
            <TooltipProvider delayDuration={300}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link href="/profile" className={cn("flex items-center gap-3", isCollapsed && "mb-4")}>
                    <Avatar className="h-8 w-8 bg-[#2B3B64] text-white">
                      <AvatarFallback>{getUserInitials()}</AvatarFallback>
                    </Avatar>
                    {!isCollapsed && (
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-white">{user.email?.split("@")[0]}</span>
                        <span className="text-xs text-gray-400">View profile</span>
                      </div>
                    )}
                  </Link>
                </TooltipTrigger>
                {isCollapsed && (
                  <TooltipContent side="right">
                    <p>Profile settings</p>
                  </TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>

            {!isCollapsed && <Separator orientation="vertical" className="h-8" />}

            <TooltipProvider delayDuration={300}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" onClick={signOut} className="text-gray-400 hover:text-white">
                    <LogOut className="h-5 w-5" />
                    {!isCollapsed && <span className="sr-only">Log out</span>}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>Log out</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        ) : (
          <Link
            href="/login"
            className={cn(
              "flex items-center justify-center text-sm text-[#6B5EFF] hover:text-[#5A4FD9]",
              isCollapsed ? "flex-col" : "gap-2",
            )}
          >
            <User className="h-4 w-4" />
            {!isCollapsed && <span>Sign in</span>}
          </Link>
        )}
      </CustomSidebarFooter>

      {isCollapsed && (
        <div className="absolute bottom-20 left-0 w-full flex justify-center">
          <SidebarTrigger className="bg-transparent hover:bg-gray-700/50">
            <PanelLeftClose className="h-5 w-5 rotate-180" />
          </SidebarTrigger>
        </div>
      )}
    </CustomSidebar>
  )
}

export function KeyIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="7.5" cy="15.5" r="5.5" />
      <path d="m21 2-9.6 9.6" />
      <path d="m15.5 7.5 3 3L22 7l-3-3" />
    </svg>
  )
}
