"use client"

import { motion } from 'framer-motion'

export function AnimatedBrandText() {
  return (
    <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none select-none">
      {/* Main TECHVYRO text - glass/crystal style */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="relative"
      >
        {/* Glow layer behind text */}
        <motion.div
          animate={{
            opacity: [0.3, 0.5, 0.3],
            scale: [1, 1.02, 1],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute inset-0 blur-3xl"
          style={{
            background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.4) 0%, rgba(59, 130, 246, 0.3) 50%, rgba(168, 85, 247, 0.4) 100%)',
          }}
        />
        
        {/* Main text with glass effect */}
        <motion.h2
          animate={{
            backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "linear",
          }}
          className="text-[12vw] sm:text-[14vw] md:text-[16vw] lg:text-[18vw] font-black tracking-tighter leading-none"
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(139,92,246,0.25) 25%, rgba(255,255,255,0.2) 50%, rgba(59,130,246,0.25) 75%, rgba(255,255,255,0.15) 100%)',
            backgroundSize: '200% 200%',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            color: 'transparent',
            WebkitTextStroke: '1px rgba(255,255,255,0.1)',
            textShadow: '0 0 80px rgba(139, 92, 246, 0.3), 0 0 120px rgba(59, 130, 246, 0.2)',
            filter: 'drop-shadow(0 0 30px rgba(139, 92, 246, 0.2))',
          }}
        >
          TECHVYRO
        </motion.h2>

        {/* Shimmer overlay effect */}
        <motion.div
          animate={{
            x: ['-100%', '200%'],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
            repeatDelay: 2,
          }}
          className="absolute inset-0 overflow-hidden"
          style={{
            maskImage: 'linear-gradient(to right, transparent, white, transparent)',
            WebkitMaskImage: 'linear-gradient(to right, transparent, white, transparent)',
          }}
        >
          <div 
            className="w-1/3 h-full"
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)',
            }}
          />
        </motion.div>

        {/* Reflection/glass effect at bottom */}
        <motion.div
          animate={{
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -bottom-4 left-0 right-0 h-16 sm:h-24"
          style={{
            background: 'linear-gradient(to bottom, rgba(139, 92, 246, 0.15), transparent)',
            filter: 'blur(8px)',
            transform: 'scaleY(-0.3) translateY(-100%)',
          }}
        />
      </motion.div>

      {/* Floating particles around the text */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-primary/20"
          style={{
            width: Math.random() * 8 + 4,
            height: Math.random() * 8 + 4,
            left: `${15 + Math.random() * 70}%`,
            top: `${20 + Math.random() * 60}%`,
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0.2, 0.5, 0.2],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.5,
          }}
        />
      ))}
    </div>
  )
}
