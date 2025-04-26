"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Menu, X, BarChart2, Key, RefreshCw, Search, Settings, FileText, Lock } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { AnimatePresence, motion } from "framer-motion"
import { KeyIcon } from "./app-sidebar"

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

export function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  // Close menu when route changes
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen])

  return (
    <div className="lg:hidden">
      <div className="fixed top-0 left-0 right-0 z-40 flex h-16 items-center justify-between bg-[#171723] px-4 shadow-md">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-purple-600 text-white">
            <KeyIcon className="h-6 w-6" />
          </div>
          <span className="text-xl font-semibold text-white">Keystrok</span>
        </Link>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? "Close menu" : "Open menu"}
          className="text-white hover:bg-[#2a2a3a]"
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed top-16 left-0 z-40 h-[calc(100vh-4rem)] w-[80%] max-w-[300px] overflow-y-auto bg-[#171723] pb-8 shadow-xl"
          >
            <nav className="flex flex-col gap-2 p-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.disabled ? "#" : item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-4 py-3 text-white transition-colors",
                    pathname === item.href ? "bg-[#2B3B64] text-white" : "hover:bg-[#2a2a3a]",
                    item.disabled && "cursor-not-allowed opacity-50",
                  )}
                  onClick={(e) => {
                    if (item.disabled) e.preventDefault()
                  }}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.title}</span>
                  {item.disabled && <Lock className="ml-auto h-3.5 w-3.5" />}
                  {item.comingSoon && !item.disabled && <span className="ml-auto text-xs text-gray-400">Soon</span>}
                </Link>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add padding to the top of the page to account for the fixed header */}
      <div className="h-16 lg:hidden" />
    </div>
  )
}
