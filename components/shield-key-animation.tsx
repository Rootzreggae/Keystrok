"use client"
import { motion } from "framer-motion"

export function ShieldKeyAnimation() {
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

      {/* Shield Container */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[220px] h-[260px]">
        {/* Shield Base */}
        <motion.div
          className="absolute inset-0"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <Shield />
        </motion.div>

        {/* Lock in center of shield */}
        <motion.div
          className="absolute top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60px] h-[60px]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <Lock />
        </motion.div>

        {/* Key that inserts and rotates */}
        <motion.div
          className="absolute top-[40%] left-[85%] -translate-y-1/2 w-[80px] h-[30px] origin-left"
          initial={{ x: 50, opacity: 0 }}
          animate={{
            x: [50, 0, 0, 0, 50],
            opacity: [0, 1, 1, 1, 0],
            rotate: [0, 0, 90, 0, 0],
          }}
          transition={{
            duration: 6,
            times: [0, 0.2, 0.4, 0.8, 1],
            repeat: Number.POSITIVE_INFINITY,
            repeatDelay: 1,
          }}
        >
          <Key />
        </motion.div>

        {/* Chains around shield */}
        <ChainElement position="top-left" delay={3.5} duration={6} />
        <ChainElement position="top-right" delay={3.7} duration={6} />
        <ChainElement position="bottom-left" delay={3.9} duration={6} />
        <ChainElement position="bottom-right" delay={4.1} duration={6} />
      </div>
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

// Shield component
function Shield() {
  return (
    <svg viewBox="0 0 200 240" fill="none" xmlns="http://www.w3.org/2000/svg">
      <motion.path
        d="M100 10 C 180 30, 190 50, 190 100 C 190 180, 150 210, 100 230 C 50 210, 10 180, 10 100 C 10 50, 20 30, 100 10"
        fill="url(#shieldGradient)"
        stroke="#6B5EFF"
        strokeWidth="4"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 2, ease: "easeInOut" }}
      />
      <motion.path
        d="M100 30 C 160 45, 170 60, 170 100 C 170 160, 140 185, 100 200 C 60 185, 30 160, 30 100 C 30 60, 40 45, 100 30"
        fill="none"
        stroke="#6B5EFF"
        strokeWidth="2"
        strokeDasharray="4 4"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 0.6 }}
        transition={{ duration: 2, delay: 1, ease: "easeInOut" }}
      />
      <defs>
        <linearGradient id="shieldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2B3B64" />
          <stop offset="100%" stopColor="#171723" />
        </linearGradient>
      </defs>
    </svg>
  )
}

// Lock component
function Lock() {
  return (
    <motion.div className="relative w-full h-full">
      {/* Lock body */}
      <motion.div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[80%] h-[70%] rounded-lg bg-gradient-to-b from-[#FFD166] to-[#E8B64C]"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 1 }}
      >
        {/* Keyhole */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[30%] h-[40%] bg-[#1A1B2E] rounded-full">
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[40%] h-[50%] bg-[#1A1B2E]"></div>
        </div>
      </motion.div>

      {/* Lock shackle */}
      <motion.div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[60%] h-[40%] border-[3px] border-[#FFD166] rounded-t-full"
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 1.2 }}
      />
    </motion.div>
  )
}

// Key component
function Key() {
  return (
    <svg viewBox="0 0 80 30" fill="none" xmlns="http://www.w3.org/2000/svg">
      <motion.circle cx="15" cy="15" r="12" fill="#6B5EFF" />
      <motion.path d="M15 3 L15 27" stroke="#171723" strokeWidth="2" />
      <motion.path d="M9 15 L21 15" stroke="#171723" strokeWidth="2" />
      <motion.rect x="27" y="12" width="53" height="6" fill="#6B5EFF" />
      <motion.path d="M50 12 L50 6 L60 6 L60 12" fill="#6B5EFF" />
      <motion.path d="M65 12 L65 6 L75 6 L75 12" fill="#6B5EFF" />
    </svg>
  )
}

// Chain element
function ChainElement({
  position,
  delay,
  duration,
}: {
  position: "top-left" | "top-right" | "bottom-left" | "bottom-right"
  delay: number
  duration: number
}) {
  // Set position and rotation based on which corner
  const positionStyles = {
    "top-left": { top: "-10%", left: "-10%", rotate: "45deg" },
    "top-right": { top: "-10%", right: "-10%", rotate: "-45deg" },
    "bottom-left": { bottom: "-10%", left: "-10%", rotate: "-45deg" },
    "bottom-right": { bottom: "-10%", right: "-10%", rotate: "45deg" },
  }

  const style = positionStyles[position]

  return (
    <motion.div
      className="absolute w-[100px] h-[100px]"
      style={style}
      initial={{ opacity: 0 }}
      animate={{
        opacity: [0, 1, 1, 0],
      }}
      transition={{
        duration: duration,
        times: [0, 0.1, 0.9, 1],
        delay: delay,
        repeat: Number.POSITIVE_INFINITY,
        repeatDelay: 1,
      }}
    >
      <Chain />
    </motion.div>
  )
}

// Chain component
function Chain() {
  return (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <motion.path
        d="M10 10 L90 90"
        stroke="#6B5EFF"
        strokeWidth="4"
        strokeLinecap="round"
        strokeDasharray="0 16"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1, strokeDasharray: "12 16" }}
        transition={{ duration: 1.5 }}
      />
    </svg>
  )
}
