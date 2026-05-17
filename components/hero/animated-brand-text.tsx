"use client"

import { useEffect, useRef } from 'react'
import { motion, useAnimationFrame } from 'framer-motion'

export function AnimatedBrandText() {
  const containerRef = useRef<HTMLDivElement>(null)
  const timeRef = useRef(0)

  // Manual animation frame for smooth 3D rotation
  useAnimationFrame((t, delta) => {
    timeRef.current += delta * 0.001
    if (containerRef.current) {
      const rotateY = Math.sin(timeRef.current * 0.3) * 15
      const rotateX = Math.sin(timeRef.current * 0.2) * 8
      const translateY = Math.sin(timeRef.current * 0.5) * 10
      containerRef.current.style.transform = `
        perspective(1000px) 
        rotateY(${rotateY}deg) 
        rotateX(${rotateX}deg) 
        translateY(${translateY}px)
      `
    }
  })

  return (
    <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none select-none">
      {/* 3D perspective container */}
      <div 
        ref={containerRef}
        className="relative"
        style={{ 
          transformStyle: 'preserve-3d',
          perspective: '1000px',
        }}
      >
        {/* Glow/blur background */}
        <motion.div
          animate={{
            opacity: [0.4, 0.6, 0.4],
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute inset-0 blur-[80px]"
          style={{
            background: 'radial-gradient(ellipse, rgba(168, 85, 247, 0.5) 0%, rgba(59, 130, 246, 0.3) 50%, transparent 70%)',
            transform: 'scale(1.5)',
          }}
        />

        {/* Main 3D Glass Text */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="relative"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* Back layer - shadow/depth */}
          <span
            className="absolute text-[15vw] sm:text-[18vw] md:text-[20vw] font-black tracking-tighter"
            style={{
              transform: 'translateZ(-50px)',
              color: 'rgba(139, 92, 246, 0.15)',
              filter: 'blur(8px)',
            }}
          >
            TECHVYRO
          </span>

          {/* Middle layer - glass body */}
          <span
            className="absolute text-[15vw] sm:text-[18vw] md:text-[20vw] font-black tracking-tighter"
            style={{
              transform: 'translateZ(-25px)',
              background: 'linear-gradient(180deg, rgba(255,255,255,0.08) 0%, rgba(139,92,246,0.15) 50%, rgba(59,130,246,0.1) 100%)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              color: 'transparent',
              filter: 'blur(2px)',
            }}
          >
            TECHVYRO
          </span>

          {/* Front layer - glass surface with refraction */}
          <motion.span
            animate={{
              backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "linear",
            }}
            className="relative text-[15vw] sm:text-[18vw] md:text-[20vw] font-black tracking-tighter"
            style={{
              transform: 'translateZ(0px)',
              background: `
                linear-gradient(
                  135deg, 
                  rgba(255,255,255,0.25) 0%, 
                  rgba(168,85,247,0.3) 20%,
                  rgba(255,255,255,0.15) 40%,
                  rgba(59,130,246,0.25) 60%,
                  rgba(255,255,255,0.2) 80%,
                  rgba(139,92,246,0.3) 100%
                )
              `,
              backgroundSize: '200% 200%',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              color: 'transparent',
              WebkitTextStroke: '1px rgba(255,255,255,0.15)',
              textShadow: `
                0 0 60px rgba(168, 85, 247, 0.4),
                0 0 120px rgba(59, 130, 246, 0.3),
                0 0 180px rgba(139, 92, 246, 0.2)
              `,
            }}
          >
            TECHVYRO
          </motion.span>

          {/* Shimmer/light reflection moving across */}
          <motion.div
            animate={{
              x: ['-100%', '200%'],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
              repeatDelay: 2,
            }}
            className="absolute inset-0 overflow-hidden"
          >
            <div 
              className="absolute inset-y-0 w-1/4"
              style={{
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                transform: 'skewX(-20deg)',
              }}
            />
          </motion.div>

          {/* Glass highlight on top edge */}
          <motion.div
            animate={{
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute top-0 left-0 right-0 h-[20%]"
            style={{
              background: 'linear-gradient(to bottom, rgba(255,255,255,0.2), transparent)',
              maskImage: 'linear-gradient(to right, transparent 10%, white 30%, white 70%, transparent 90%)',
              WebkitMaskImage: 'linear-gradient(to right, transparent 10%, white 30%, white 70%, transparent 90%)',
            }}
          />
        </motion.div>

        {/* Reflection below */}
        <motion.div
          animate={{
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute left-0 right-0"
          style={{
            top: '100%',
            transform: 'scaleY(-0.4) translateY(-20%)',
            filter: 'blur(4px)',
          }}
        >
          <span
            className="text-[15vw] sm:text-[18vw] md:text-[20vw] font-black tracking-tighter"
            style={{
              background: 'linear-gradient(to bottom, rgba(168,85,247,0.2), transparent)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              color: 'transparent',
            }}
          >
            TECHVYRO
          </span>
        </motion.div>
      </div>

      {/* Floating glass particles */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: 6 + Math.random() * 10,
            height: 6 + Math.random() * 10,
            left: `${10 + Math.random() * 80}%`,
            top: `${20 + Math.random() * 60}%`,
            background: 'radial-gradient(circle, rgba(168,85,247,0.4), rgba(59,130,246,0.2))',
            boxShadow: '0 0 20px rgba(139,92,246,0.3)',
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, Math.random() * 20 - 10, 0],
            opacity: [0.3, 0.7, 0.3],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 4 + Math.random() * 3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.4,
          }}
        />
      ))}
    </div>
  )
}
