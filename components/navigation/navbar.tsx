"use client"

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { useRouter, usePathname } from 'next/navigation'
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion'
import { Menu, X, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/theme/theme-toggle'
import { LangToggle } from '@/components/i18n/lang-toggle'
import { CursorModeSelector } from '@/components/effects/cursor-mode-selector'
import { SoundToggle } from '@/components/effects/sound-effects'
import { cn } from '@/lib/utils'

const navLinks = [
  { href: '/about', label: 'About', external: true },
  { href: '#stats', label: 'Stats' },
  { href: '#packages', label: 'Packages' },
  { href: '/match', label: 'Match', external: true },
  { href: '/case-studies', label: 'Case Studies', external: true },
  { href: '/blog', label: 'Blog', external: true },
  { href: '#contact', label: 'Contact' },
]

// Magnetic nav link component
function MagneticNavLink({ 
  href, 
  label, 
  onClick,
  isActive 
}: { 
  href: string
  label: string
  onClick: () => void
  isActive?: boolean
}) {
  const ref = useRef<HTMLButtonElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  
  const springX = useSpring(x, { stiffness: 150, damping: 15 })
  const springY = useSpring(y, { stiffness: 150, damping: 15 })

  const handleMouse = (e: React.MouseEvent) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    x.set((e.clientX - centerX) * 0.15)
    y.set((e.clientY - centerY) * 0.15)
  }

  const reset = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.button
      ref={ref}
      onClick={onClick}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      style={{ x: springX, y: springY }}
      className="relative text-sm font-medium text-muted-foreground hover:text-foreground transition-colors group py-2"
    >
      <span className="relative z-10">{label}</span>
      {/* Underline animation */}
      <motion.span 
        className="absolute -bottom-0.5 left-0 h-0.5 bg-gradient-to-r from-primary to-secondary rounded-full"
        initial={{ width: 0 }}
        whileHover={{ width: '100%' }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      />
      {/* Hover glow */}
      <motion.span
        className="absolute inset-0 -z-10 rounded-lg bg-primary/5 opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100 transition-all duration-300"
      />
    </motion.button>
  )
}

// Animated logo component
function AnimatedLogo({ onClick }: { onClick: () => void }) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="flex items-center gap-3 group relative"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Logo container */}
      <motion.div 
        className="relative w-10 h-10 rounded-lg overflow-hidden bg-background border border-primary/20"
        animate={{
          borderColor: isHovered ? 'oklch(0.85 0.18 195 / 0.5)' : 'oklch(0.85 0.18 195 / 0.2)',
          boxShadow: isHovered 
            ? '0 0 20px oklch(0.85 0.18 195 / 0.3)' 
            : '0 0 0px oklch(0.85 0.18 195 / 0)',
        }}
        transition={{ duration: 0.3 }}
      >
        <Image
          src="/images/techvyro-icon.jpg"
          alt="TechVyro"
          fill
          sizes="40px"
          className="object-contain"
        />
        {/* Shine effect on hover */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          initial={{ x: '-100%' }}
          animate={{ x: isHovered ? '200%' : '-100%' }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
        />
      </motion.div>
      
      {/* Brand text with character animation */}
      <span className="text-lg sm:text-xl font-bold relative overflow-hidden">
        {'TechVyro'.split('').map((char, i) => (
          <motion.span
            key={i}
            className="inline-block gradient-text"
            animate={{
              y: isHovered ? [0, -3, 0] : 0,
            }}
            transition={{
              duration: 0.4,
              delay: i * 0.03,
              ease: 'easeOut',
            }}
          >
            {char}
          </motion.span>
        ))}
      </span>

      {/* Sparkle on hover */}
      <AnimatePresence>
        {isHovered && (
          <motion.span
            initial={{ opacity: 0, scale: 0, rotate: -180 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 0, rotate: 180 }}
            className="absolute -right-1 -top-1"
          >
            <Sparkles className="w-3 h-3 text-primary" />
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  )
}

export function Navbar() {
  const router = useRouter()
  const pathname = usePathname()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isHidden, setIsHidden] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeLink, setActiveLink] = useState('')

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (typeof document === 'undefined') return
    if (isMobileMenuOpen) {
      const original = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      return () => { document.body.style.overflow = original }
    }
  }, [isMobileMenuOpen])

  useEffect(() => {
    let lastY = typeof window !== 'undefined' ? window.scrollY : 0
    let ticking = false

    const update = () => {
      const y = window.scrollY
      setIsScrolled(y > 50)

      if (isMobileMenuOpen || y < 120) {
        setIsHidden(false)
      } else if (y > lastY + 6) {
        setIsHidden(true)
      } else if (y < lastY - 6) {
        setIsHidden(false)
      }
      lastY = y
      ticking = false
    }

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(update)
        ticking = true
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [isMobileMenuOpen])

  const scrollToSection = (href: string) => {
    setIsMobileMenuOpen(false)
    // Route links (e.g. /about, /match) - use SPA navigation
    if (href.startsWith('/') && !href.startsWith('/#')) {
      router.push(href)
      return
    }
    // Normalize hash links (handles both "#contact" and "/#contact")
    const hash = href.includes('#') ? `#${href.split('#')[1]}` : href
    if (pathname !== '/') {
      router.push(`/${hash}`)
      return
    }
    const element = document.querySelector(hash)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: isHidden ? -120 : 0, opacity: 1 }}
        transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-[background,padding,backdrop-filter] duration-300",
          isScrolled 
            ? "glass py-2 sm:py-3 border-b border-border/30" 
            : "bg-transparent py-3 sm:py-4"
        )}
      >
        <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Animated Logo */}
            <AnimatedLogo 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            />

            {/* Desktop Navigation with magnetic links */}
            <div className="hidden md:flex items-center gap-6 lg:gap-8">
              {navLinks.map((link) => (
                <MagneticNavLink
                  key={link.href}
                  href={link.href}
                  label={link.label}
                  onClick={() => {
                    setActiveLink(link.href)
                    scrollToSection(link.href)
                  }}
                  isActive={activeLink === link.href}
                />
              ))}
            </div>

            {/* CTA Button + toggles */}
            <div className="hidden md:flex items-center gap-2">
              <SoundToggle />
              <CursorModeSelector />
              <LangToggle />
              <ThemeToggle />
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  onClick={() => scrollToSection('#contact')}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground relative overflow-hidden group"
                >
                  <span className="relative z-10">Get in Touch</span>
                  {/* Button shine effect */}
                  <motion.span
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    initial={{ x: '-100%' }}
                    whileHover={{ x: '200%' }}
                    transition={{ duration: 0.6 }}
                  />
                </Button>
              </motion.div>
            </div>

            {/* Mobile Menu Button with animation */}
            <motion.button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
              className="md:hidden p-3 -mr-2 text-foreground min-h-[44px] min-w-[44px] flex items-center justify-center relative"
              whileTap={{ scale: 0.9 }}
            >
              <AnimatePresence mode="wait">
                {isMobileMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X className="h-6 w-6" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu className="h-6 w-6" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </nav>
      </motion.header>

      {/* Mobile Menu with staggered animations */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 md:hidden overflow-y-auto overscroll-contain"
          >
            {/* Backdrop with blur */}
            <motion.div 
              className="absolute inset-0 bg-background/98 backdrop-blur-xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            
            {/* Decorative elements */}
            <motion.div
              className="absolute top-1/4 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
            />
            <motion.div
              className="absolute bottom-1/4 left-0 w-64 h-64 bg-secondary/5 rounded-full blur-3xl"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3 }}
            />

            <nav className="relative pt-24 pb-12 px-6 min-h-full">
              <div className="flex flex-col gap-4">
                {navLinks.map((link, index) => (
                  <motion.button
                    key={link.href}
                    initial={{ opacity: 0, x: -40, filter: 'blur(10px)' }}
                    animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, x: -40, filter: 'blur(10px)' }}
                    transition={{ 
                      delay: index * 0.08,
                      duration: 0.4,
                      ease: [0.25, 0.46, 0.45, 0.94]
                    }}
                    onClick={() => scrollToSection(link.href)}
                    className="text-3xl font-bold text-foreground text-left py-3 min-h-[44px] relative group"
                    whileHover={{ x: 10 }}
                  >
                    <span className="relative">
                      {link.label}
                      <motion.span
                        className="absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-primary to-secondary"
                        initial={{ width: 0 }}
                        whileHover={{ width: '100%' }}
                        transition={{ duration: 0.3 }}
                      />
                    </span>
                    {/* Number indicator */}
                    <span className="absolute -left-6 top-1/2 -translate-y-1/2 text-xs text-muted-foreground/50 font-mono">
                      0{index + 1}
                    </span>
                  </motion.button>
                ))}
                
                {/* Toggles */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: navLinks.length * 0.08 + 0.1 }}
                  className="flex items-center gap-3 mt-6 pt-6 border-t border-border/30"
                >
                  <ThemeToggle />
                  <LangToggle />
                  <CursorModeSelector />
                </motion.div>
                
                {/* CTA Button */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: navLinks.length * 0.08 + 0.2 }}
                >
                  <Button
                    onClick={() => scrollToSection('#contact')}
                    size="lg"
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground mt-4 h-14 text-lg"
                  >
                    Get in Touch
                  </Button>
                </motion.div>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
