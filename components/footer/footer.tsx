"use client"

import { useRef, useState, useEffect } from 'react'
import Image from 'next/image'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { 
  Youtube, 
  Instagram, 
  Twitter, 
  Linkedin,
  ArrowUp,
  Heart
} from 'lucide-react'
import { Button } from '@/components/ui/button'

const navLinks = [
  { href: '#about', label: 'About' },
  { href: '#stats', label: 'Stats' },
  { href: '#packages', label: 'Packages' },
  { href: '#portfolio', label: 'Portfolio' },
  { href: '#media-kit', label: 'Media Kit' },
  { href: '#availability', label: 'Availability' },
  { href: '#contact', label: 'Contact' },
]

const socialLinks = [
  { icon: Youtube, href: 'https://youtube.com/@techvyro', label: 'YouTube', color: 'hover:text-red-500' },
  { icon: Instagram, href: 'https://instagram.com/techvyro', label: 'Instagram', color: 'hover:text-pink-500' },
  { icon: Twitter, href: 'https://twitter.com/techvyro', label: 'Twitter/X', color: 'hover:text-foreground' },
  { icon: Linkedin, href: 'https://linkedin.com/in/techvyro', label: 'LinkedIn', color: 'hover:text-blue-500' },
]

export function Footer() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })
  const [showBackToTop, setShowBackToTop] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const currentYear = new Date().getFullYear()

  return (
    <footer ref={ref} className="relative pt-16 pb-8 border-t border-border/50">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent pointer-events-none" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Main footer content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12"
        >
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="relative w-12 h-12 rounded-xl overflow-hidden">
                <Image
                  src="/images/techvyro-logo.jpg"
                  alt="TechVyro"
                  fill
                  className="object-cover"
                />
              </div>
              <span className="text-2xl font-bold gradient-text">TechVyro</span>
            </div>
            <p className="text-muted-foreground mb-6 max-w-md">
              India&apos;s Premier Tech Content Creator. Creating content that informs, 
              engages, and converts for brands across the tech industry.
            </p>
            {/* Social links */}
            <div className="flex items-center gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`p-2 rounded-full glass text-muted-foreground ${social.color} transition-colors`}
                  aria-label={social.label}
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-3">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <button
                    onClick={() => scrollToSection(link.href)}
                    className="text-muted-foreground hover:text-primary transition-colors text-sm"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold mb-4">Get In Touch</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <span className="block text-foreground font-medium">Email</span>
                techvyro@gmail.com
              </li>
              <li>
                <span className="block text-foreground font-medium">Response Time</span>
                Within 24 hours
              </li>
              <li>
                <span className="block text-foreground font-medium">Location</span>
                India
              </li>
            </ul>
          </div>
        </motion.div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent mb-8" />

        {/* Bottom bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-between gap-4"
        >
          <p className="text-sm text-muted-foreground text-center sm:text-left">
            &copy; {currentYear} TechVyro. All rights reserved.
          </p>
          
          <div className="flex items-center gap-6">
            <button className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Privacy Policy
            </button>
            <button className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Terms of Service
            </button>
          </div>

          <p className="text-xs text-muted-foreground flex items-center gap-1">
            Made with <Heart className="h-3 w-3 text-secondary fill-secondary" /> in India
          </p>
        </motion.div>

        {/* Back to top button */}
        <AnimatePresence>
          {showBackToTop && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              transition={{ duration: 0.3 }}
              className="fixed bottom-8 right-8 z-40"
            >
              <Button
                onClick={scrollToTop}
                size="icon"
                className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg neon-glow-cyan h-12 w-12"
                aria-label="Back to top"
              >
                <ArrowUp className="h-5 w-5" />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </footer>
  )
}
