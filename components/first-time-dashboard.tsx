"use client"
import { Button } from "@/components/ui/button"
import { Shield, Key, RefreshCw, ArrowRight, Lock, FileText } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { ApiKeyManagementIllustration } from "./api-key-management-illustration"

interface FirstTimeDashboardProps {
  hasPlatforms: boolean
  userRules?: {
    platformRules: Array<{
      id: number
      name: string
      description: string
      isActive: boolean
    }>
    securityPolicies: Array<{
      id: number
      name: string
      description: string
      isActive: boolean
    }>
  }
}

export function FirstTimeDashboard({ userRules }: FirstTimeDashboardProps) {
  const features = [
    {
      icon: <Key className="h-6 w-6 text-[#6B5EFF]" />,
      title: "Centralized Key Management",
      description: "Track and manage all your API keys across multiple platforms in one secure location.",
    },
    {
      icon: <RefreshCw className="h-6 w-6 text-[#6B5EFF]" />,
      title: "Automated Key Rotation",
      description: "Schedule and automate key rotations to enhance security and prevent unauthorized access.",
    },
    {
      icon: <Shield className="h-6 w-6 text-[#6B5EFF]" />,
      title: "Security Monitoring",
      description: "Get real-time alerts about key expiration, usage patterns, and potential security risks.",
    },
  ]

  return (
    <div className="w-full space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-lg bg-gradient-to-br from-[#171723] to-[#2B3B64] p-8">
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#6B5EFF] opacity-10 blur-3xl"></div>
        <div className="absolute -bottom-32 -left-20 h-64 w-64 rounded-full bg-[#6B5EFF] opacity-10 blur-3xl"></div>

        <div className="relative z-10 flex flex-col lg:flex-row items-center">
          <div className="lg:w-1/2 text-center lg:text-left">
            <motion.h1
              className="mb-4 text-3xl font-bold text-white md:text-4xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Secure Your API Keys with Keystrok
            </motion.h1>
            <motion.p
              className="mb-6 text-lg text-gray-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Keystrok helps you manage, monitor, and automatically rotate API keys across all your platforms, reducing
              security risks and saving you valuable time.
            </motion.p>
            <motion.div
              className="flex flex-col sm:flex-row justify-center lg:justify-start gap-2 sm:space-x-4 sm:space-y-0"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Link href="/platform-settings/add">
                <Button size="lg" className="w-full sm:w-auto">
                  Get Started <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </motion.div>
          </div>

          {/* Shield Key Animation */}
          <motion.div
            className="lg:w-1/2 mt-8 lg:mt-0 h-[300px] lg:h-[350px]"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <ApiKeyManagementIllustration />
          </motion.div>
        </div>
      </div>

      {/* Key Features */}
      <div>
        <h2 className="mb-6 text-2xl font-semibold text-white">Key Features</h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="rounded-lg bg-[#171723] p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
            >
              <div className="mb-4 rounded-full bg-[#2B3B64]/50 p-3 inline-block">{feature.icon}</div>
              <h3 className="mb-2 text-xl font-medium text-white">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {userRules && (
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="mb-6 text-2xl font-semibold text-white">Applicable Rules</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Platform Rules Card */}
            <motion.div
              className="rounded-xl overflow-hidden bg-gradient-to-br from-[#1a1a2e] to-[#2d3a55]"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="p-5 bg-[#202040]/50 border-b border-[#3a3a5a]">
                <div className="flex items-center">
                  <FileText className="h-5 w-5 text-[#6B5EFF] mr-2" />
                  <h3 className="text-lg font-semibold text-white">Platform Rules</h3>
                </div>
              </div>
              <div className="p-5">
                <ul className="space-y-4">
                  {userRules.platformRules.map((rule) => (
                    <li key={rule.id} className="flex items-start">
                      <div className={`flex-shrink-0 w-3 h-3 mt-1.5 rounded-full bg-green-400 mr-3`}></div>
                      <div>
                        <p className="text-sm font-medium text-white">{rule.name}</p>
                        <p className="text-xs text-gray-400 mt-1">{rule.description}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>

            {/* Security Policies Card */}
            <motion.div
              className="rounded-xl overflow-hidden bg-gradient-to-br from-[#1a1a2e] to-[#2d3a55]"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="p-5 bg-[#202040]/50 border-b border-[#3a3a5a]">
                <div className="flex items-center">
                  <Lock className="h-5 w-5 text-[#6B5EFF] mr-2" />
                  <h3 className="text-lg font-semibold text-white">Security Policies</h3>
                </div>
              </div>
              <div className="p-5">
                <ul className="space-y-4">
                  {userRules.securityPolicies.map((policy) => (
                    <li key={policy.id} className="flex items-start">
                      <div
                        className={`flex-shrink-0 w-3 h-3 mt-1.5 rounded-full ${
                          policy.isActive ? "bg-green-400" : "bg-gray-500"
                        } mr-3`}
                      ></div>
                      <div>
                        <p className="text-sm font-medium text-white">{policy.name}</p>
                        <p className="text-xs text-gray-400 mt-1">{policy.description}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <QuickStatCard title="Average Time Saved" value="4.5 hours" description="per week on key management" />
        <QuickStatCard title="Security Improvement" value="73%" description="reduction in key-related incidents" />
        <QuickStatCard title="Platforms Supported" value="25+" description="major services and growing" />
        <QuickStatCard title="Implementation Time" value="< 15 min" description="to set up your first workflow" />
      </div>

      {/* CTA Section */}
      <div className="rounded-lg bg-gradient-to-r from-[#343B4F] to-[#2B3B64] p-8">
        <div className="flex flex-col items-center justify-between gap-6 text-center md:flex-row md:text-left">
          <div>
            <h2 className="text-2xl font-semibold text-white mb-2">Ready to secure your API keys?</h2>
            <p className="text-gray-300">Connect your first platform and start managing your keys in minutes.</p>
          </div>
          <Link href="/platform-settings/add">
            <Button size="lg" className="whitespace-nowrap">
              Connect Platform <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

interface QuickStatCardProps {
  title: string
  value: string
  description: string
}

function QuickStatCard({ title, value, description }: QuickStatCardProps) {
  return (
    <motion.div
      className="flex flex-col rounded-lg bg-[#171723] p-4 text-white"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h3 className="mb-1 text-sm font-medium text-gray-400">{title}</h3>
      <p className="mb-1 text-3xl font-semibold text-white">{value}</p>
      <p className="text-xs text-gray-400">{description}</p>
    </motion.div>
  )
}
