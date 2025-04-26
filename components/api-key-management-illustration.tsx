"use client"

import { motion } from "framer-motion"
import { Key, Lock, Code, Database, Server } from "lucide-react"

export function ApiKeyManagementIllustration() {
  return (
    <div className="relative w-full h-full min-h-[300px] max-w-[500px] mx-auto">
      {/* Background glow effect */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] h-[90%] rounded-full bg-[#6B5EFF]/20 blur-3xl"
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
        }}
      />

      {/* Decorative elements */}
      <DecorativeElement type="plus" color="#6BFFB8" size={20} position={{ top: "10%", right: "15%" }} delay={0.5} />
      <DecorativeElement type="plus" color="#6B5EFF" size={24} position={{ top: "15%", left: "10%" }} delay={0.7} />
      <DecorativeElement
        type="circle"
        color="#6B5EFF"
        size={12}
        position={{ bottom: "20%", left: "15%" }}
        delay={0.9}
      />
      <DecorativeElement
        type="circle"
        color="#6BFFB8"
        size={16}
        position={{ bottom: "30%", right: "10%" }}
        delay={1.1}
      />

      {/* Central Vault */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[220px] h-[220px]"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <Vault />
      </motion.div>

      {/* API Keys */}
      <motion.div
        className="absolute top-[30%] left-[15%] w-[80px] h-[80px]"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.7 }}
      >
        <ApiKey color="#6B5EFF" />
      </motion.div>

      <motion.div
        className="absolute bottom-[25%] right-[15%] w-[70px] h-[70px]"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.9 }}
      >
        <ApiKey color="#FFD166" />
      </motion.div>

      {/* Database */}
      <motion.div
        className="absolute bottom-[20%] left-[20%] w-[70px] h-[70px]"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        whileHover={{ y: -5, transition: { duration: 0.3 } }}
      >
        <div className="bg-[#2B3B64] rounded-lg p-3 flex items-center justify-center">
          <Database className="w-full h-full text-[#6BFFB8]" />
        </div>
      </motion.div>

      {/* Server */}
      <motion.div
        className="absolute top-[25%] right-[15%] w-[70px] h-[70px]"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        whileHover={{ y: 5, transition: { duration: 0.3 } }}
      >
        <div className="bg-[#2B3B64] rounded-lg p-3 flex items-center justify-center">
          <Server className="w-full h-full text-[#6BFFB8]" />
        </div>
      </motion.div>

      {/* Animated Keys */}
      <AnimatedKey
        position={{ top: "60%", left: "70%" }}
        delay={1.2}
        duration={4}
        size={40}
        color="#FFD166"
        targetPosition={{ top: "50%", left: "50%" }}
      />

      <AnimatedKey
        position={{ top: "40%", left: "75%" }}
        delay={2.5}
        duration={4.5}
        size={35}
        color="#6B5EFF"
        targetPosition={{ top: "50%", left: "50%" }}
      />

      <AnimatedKey
        position={{ top: "65%", left: "25%" }}
        delay={1.8}
        duration={5}
        size={30}
        color="#6BFFB8"
        targetPosition={{ top: "50%", left: "50%" }}
      />
    </div>
  )
}

// Decorative elements (plus signs, circles)
function DecorativeElement({
  type,
  color,
  size,
  position,
  delay,
}: {
  type: "plus" | "circle"
  color: string
  size: number
  position: any
  delay: number
}) {
  return (
    <motion.div
      className="absolute"
      style={{ ...position, width: size, height: size }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay }}
      animate={{
        y: [0, -5, 0],
      }}
      transition={{
        y: {
          duration: 3,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
          ease: "easeInOut",
          delay: Math.random() * 2,
        },
      }}
    >
      {type === "plus" ? (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 4V20M4 12H20" stroke={color} strokeWidth="3" strokeLinecap="round" />
        </svg>
      ) : (
        <div className="w-full h-full rounded-full" style={{ backgroundColor: color }}></div>
      )}
    </motion.div>
  )
}

// Vault component
function Vault() {
  return (
    <div className="relative w-full h-full">
      {/* Vault outer shell */}
      <motion.div
        className="absolute inset-0 rounded-xl bg-gradient-to-br from-[#2B3B64] to-[#171723] border-2 border-[#3a3a5a] shadow-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        {/* Vault door frame */}
        <motion.div
          className="absolute inset-[15px] rounded-lg border-2 border-[#3a3a5a] overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          {/* Vault door */}
          <motion.div
            className="absolute inset-0 bg-[#1A1B2E] flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
          >
            {/* Vault lock */}
            <motion.div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60px] h-[60px]"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 1 }}
            >
              <div className="relative w-full h-full">
                <div className="absolute inset-0 rounded-full bg-[#2B3B64] flex items-center justify-center">
                  <Lock className="w-8 h-8 text-[#FFD166]" />
                </div>

                {/* Rotating dial */}
                <motion.div
                  className="absolute inset-0 rounded-full border-4 border-[#FFD166] border-dashed"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                />
              </div>
            </motion.div>

            {/* Code lines */}
            <motion.div
              className="absolute bottom-[20px] left-[20px] right-[20px] h-[40px]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.7 }}
              transition={{ duration: 1, delay: 1.2 }}
            >
              <div className="space-y-2">
                <motion.div
                  className="h-2 bg-[#6B5EFF] rounded-full"
                  animate={{ width: ["30%", "60%", "30%"] }}
                  transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
                />
                <motion.div
                  className="h-2 bg-[#6BFFB8] rounded-full"
                  animate={{ width: ["50%", "30%", "50%"] }}
                  transition={{ duration: 5, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse", delay: 0.5 }}
                />
                <motion.div
                  className="h-2 bg-[#FFD166] rounded-full"
                  animate={{ width: ["40%", "70%", "40%"] }}
                  transition={{ duration: 4.5, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse", delay: 1 }}
                />
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Vault handle */}
      <motion.div
        className="absolute top-1/2 right-[-10px] -translate-y-1/2 w-[30px] h-[60px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 1.5 }}
      >
        <div className="w-full h-full bg-[#FFD166] rounded-r-lg flex items-center justify-center">
          <div className="w-[10px] h-[40px] bg-[#1A1B2E] rounded-full" />
        </div>
      </motion.div>

      {/* Vault hinges */}
      <motion.div
        className="absolute top-[30px] left-[-5px] w-[10px] h-[20px] bg-[#FFD166] rounded-l-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 1.6 }}
      />
      <motion.div
        className="absolute bottom-[30px] left-[-5px] w-[10px] h-[20px] bg-[#FFD166] rounded-l-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 1.7 }}
      />
    </div>
  )
}

// API Key component
function ApiKey({ color }: { color: string }) {
  return (
    <div className="relative w-full h-full">
      <motion.div
        className="absolute inset-0 bg-[#1A1B2E] rounded-lg p-3 flex items-center justify-center"
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.3 }}
      >
        <Code className="w-full h-full text-[#6BFFB8]" />
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[30px] h-[30px]"
          animate={{ rotate: [0, 15, 0, -15, 0] }}
          transition={{ duration: 5, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
        >
          <Key className="w-full h-full text-[#FFD166]" />
        </motion.div>
      </motion.div>
    </div>
  )
}

// Animated Key component
function AnimatedKey({
  position,
  delay,
  duration,
  size,
  color,
  targetPosition,
}: {
  position: any
  delay: number
  duration: number
  size: number
  color: string
  targetPosition: any
}) {
  return (
    <motion.div
      className="absolute"
      style={{ ...position, width: size, height: size }}
      initial={{ opacity: 0 }}
      animate={{
        opacity: [0, 1, 1, 0],
        x: [0, targetPosition.left ? `calc(${targetPosition.left} - ${position.left})` : 0],
        y: [0, targetPosition.top ? `calc(${targetPosition.top} - ${position.top})` : 0],
        scale: [1, 0.8],
      }}
      transition={{
        duration: duration,
        delay: delay,
        repeat: Number.POSITIVE_INFINITY,
        repeatDelay: 2,
      }}
    >
      <div className="relative w-full h-full">
        <Key className="w-full h-full" style={{ color }} />
        <motion.div
          className="absolute inset-0 bg-white rounded-full"
          animate={{ opacity: [0, 0.3, 0] }}
          transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
        />
      </div>
    </motion.div>
  )
}
