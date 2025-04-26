"use client"

import { KeyIcon } from "@/components/app-sidebar"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0D0D14] p-4">
      <div className="w-full max-w-md space-y-8 bg-[#1a1b2e] p-8 rounded-lg shadow-lg text-center">
        <div className="flex flex-col items-center justify-center">
          <div className="flex items-center justify-center h-12 w-12 rounded-md bg-purple-600 text-white">
            <KeyIcon className="h-8 w-8" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-white">Check your email</h2>
          <div className="mt-4 text-gray-300 space-y-4">
            <p>
              We've sent you an email with a verification link. Please check your inbox and click the link to verify
              your account.
            </p>
            <p>If you don't see the email, check your spam folder.</p>
          </div>
        </div>

        <div className="mt-8 space-y-4">
          <Button asChild variant="outline" className="w-full">
            <Link href="/login">Return to login</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
