"use client"

import { useState, useRef } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { X, ZoomIn, ExternalLink } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ZoomImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  fill?: boolean
  className?: string
  containerClassName?: string
  enableLightbox?: boolean
  enableHoverZoom?: boolean
  zoomScale?: number
  overlayContent?: React.ReactNode
  href?: string
}

export function ZoomImage({
  src,
  alt,
  width,
  height,
  fill = false,
  className,
  containerClassName,
  enableLightbox = true,
  enableHoverZoom = true,
  zoomScale = 1.1,
  overlayContent,
  href,
}: ZoomImageProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  
  // Mouse position for hover effect
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  
  // Smooth spring values
  const springX = useSpring(mouseX, { stiffness: 150, damping: 15 })
  const springY = useSpring(mouseY, { stiffness: 150, damping: 15 })
  
  // Transform for slight tilt on hover
  const rotateX = useTransform(springY, [-0.5, 0.5], [3, -3])
  const rotateY = useTransform(springX, [-0.5, 0.5], [-3, 3])
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    mouseX.set(x)
    mouseY.set(y)
  }
  
  const handleMouseLeave = () => {
    setIsHovered(false)
    mouseX.set(0)
    mouseY.set(0)
  }
  
  const Wrapper = href ? 'a' : 'div'
  const wrapperProps = href ? { href, target: '_blank', rel: 'noopener noreferrer' } : {}
  
  return (
    <>
      <motion.div
        ref={containerRef}
        className={cn(
          "relative overflow-hidden rounded-xl cursor-pointer group",
          containerClassName
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        onMouseMove={handleMouseMove}
        onClick={() => enableLightbox && !href && setIsOpen(true)}
        style={{
          perspective: 1000,
        }}
        whileHover={{ scale: enableHoverZoom ? 1.02 : 1 }}
        transition={{ duration: 0.3 }}
      >
        <Wrapper {...wrapperProps} className="block">
          <motion.div
            style={{
              rotateX: enableHoverZoom ? rotateX : 0,
              rotateY: enableHoverZoom ? rotateY : 0,
            }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              animate={{ scale: isHovered && enableHoverZoom ? zoomScale : 1 }}
              transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              {fill ? (
                <Image
                  src={src}
                  alt={alt}
                  fill
                  className={cn("object-cover transition-all duration-500", className)}
                />
              ) : (
                <Image
                  src={src}
                  alt={alt}
                  width={width || 400}
                  height={height || 300}
                  className={cn("object-cover transition-all duration-500 w-full h-auto", className)}
                />
              )}
            </motion.div>
          </motion.div>
          
          {/* Shine effect on hover */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none"
            initial={{ opacity: 0, x: '-100%' }}
            animate={{ 
              opacity: isHovered ? 1 : 0,
              x: isHovered ? '100%' : '-100%'
            }}
            transition={{ duration: 0.6 }}
          />
          
          {/* Overlay with icon */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end justify-between p-4 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          >
            {overlayContent}
            <div className="ml-auto">
              {href ? (
                <ExternalLink className="w-5 h-5 text-white drop-shadow-lg" />
              ) : enableLightbox ? (
                <ZoomIn className="w-5 h-5 text-white drop-shadow-lg" />
              ) : null}
            </div>
          </motion.div>
          
          {/* Border glow on hover */}
          <motion.div
            className="absolute inset-0 rounded-xl pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: isHovered ? 1 : 0,
              boxShadow: isHovered 
                ? 'inset 0 0 0 2px oklch(0.85 0.18 195 / 0.5), 0 0 20px oklch(0.85 0.18 195 / 0.2)' 
                : 'inset 0 0 0 0px transparent'
            }}
            transition={{ duration: 0.3 }}
          />
        </Wrapper>
      </motion.div>
      
      {/* Lightbox */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
          >
            {/* Close button */}
            <button
              className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-10"
              onClick={() => setIsOpen(false)}
            >
              <X className="w-6 h-6 text-white" />
            </button>
            
            {/* Image */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: 'spring', damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-[90vw] max-h-[90vh]"
            >
              <Image
                src={src}
                alt={alt}
                width={1200}
                height={800}
                className="object-contain max-h-[90vh] w-auto rounded-lg"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

// Simple hover zoom without lightbox
export function HoverZoomImage({
  src,
  alt,
  className,
  containerClassName,
  scale = 1.15,
}: {
  src: string
  alt: string
  className?: string
  containerClassName?: string
  scale?: number
}) {
  return (
    <div className={cn("overflow-hidden rounded-xl", containerClassName)}>
      <motion.div
        whileHover={{ scale }}
        transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <Image
          src={src}
          alt={alt}
          fill
          className={cn("object-cover", className)}
        />
      </motion.div>
    </div>
  )
}
