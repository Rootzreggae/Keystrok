"use client"

import type * as React from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface TablePaginationProps {
  currentPage: number
  totalPages: number
  totalItems: number
  pageSize: number
  onPageChange: (page: number) => void
  className?: string
}

export function TablePagination({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  className,
}: TablePaginationProps) {
  const startItem = (currentPage - 1) * pageSize + 1
  const endItem = Math.min(currentPage * pageSize, totalItems)

  const renderPageButtons = () => {
    const buttons = []

    // Always show first page
    buttons.push(
      <PaginationButton key="page-1" active={currentPage === 1} onClick={() => onPageChange(1)}>
        1
      </PaginationButton>,
    )

    // If there are many pages, add ellipsis
    if (currentPage > 3) {
      buttons.push(
        <PaginationButton key="ellipsis-1" disabled>
          ...
        </PaginationButton>,
      )
    }

    // Show current page and neighbors
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      if (i === 1 || i === totalPages) continue // Skip first and last as they're always shown
      buttons.push(
        <PaginationButton key={`page-${i}`} active={currentPage === i} onClick={() => onPageChange(i)}>
          {i}
        </PaginationButton>,
      )
    }

    // If there are many pages, add ellipsis
    if (currentPage < totalPages - 2) {
      buttons.push(
        <PaginationButton key="ellipsis-2" disabled>
          ...
        </PaginationButton>,
      )
    }

    // Always show last page if there's more than one page
    if (totalPages > 1) {
      buttons.push(
        <PaginationButton
          key={`page-${totalPages}`}
          active={currentPage === totalPages}
          onClick={() => onPageChange(totalPages)}
        >
          {totalPages}
        </PaginationButton>,
      )
    }

    return buttons
  }

  return (
    <div className={cn("flex items-center justify-between px-4 py-3", className)}>
      <div className="text-sm text-gray-400">
        {totalItems === 0 ? "No results" : `Showing ${startItem} - ${endItem} of ${totalItems} items`}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </Button>

          <div className="flex items-center gap-1">{renderPageButtons()}</div>

          <Button
            variant="secondary"
            size="sm"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  )
}

interface PaginationButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean
  children: React.ReactNode
}

function PaginationButton({ active = false, children, ...props }: PaginationButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex h-8 min-w-8 items-center justify-center rounded-md px-3 py-1 text-sm font-medium transition-colors",
        active ? "bg-[#6B5EFF] text-white" : "bg-[#1E1E2D] text-gray-400 hover:bg-[#2B3B64] hover:text-white",
        "disabled:pointer-events-none disabled:opacity-50",
      )}
      {...props}
    >
      {children}
    </button>
  )
}
