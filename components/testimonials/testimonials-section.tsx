"use client"

import { useRef, useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { Star, Quote, ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

const TESTIMONIALS = [
  {
    name: 'Rajesh Kumar',
    role: 'Marketing Head, Smartphone Brand',
    quote: 'TechVyro\'s unboxing video was a game-changer for our launch. 2.4M views and 18% conversion lift!',
    rating: 5,
    initial: 'RK',
    color: 'from-cyan-500 to-blue-500',
  },
  {
    name: 'Priya Sharma',
    role: 'Founder, D2C Audio Brand',
    quote: 'Working with TechVyro was seamless. Professional, on-time delivery, and amazing creative ideas.',
    rating: 5,
    initial: 'PS',
    color: 'from-pink-500 to-rose-500',
  },
  {
    name: 'Vikram Mehta',
    role: 'Brand Manager, Tech Accessories',
    quote: 'Best ROI we\'ve seen from any creator. TechVyro\'s audience trusts them completely — that converts to sales.',
    rating: 5,
    initial: 'VM',
    color: 'from-green-500 to-emerald-500',
  },
  {
    name: 'Anjali Desai',
    role: 'CMO, Smart Home Brand',
    quote: 'Honest reviews, deep tech understanding, and incredible production quality. Highly recommend TechVyro!',
    rating: 5,
    initial: 'AD',
    color: 'from-violet-500 to-purple-500',
  },
  {
    name: 'Amit Patel',
    role: 'CEO, Gadget Startup',
    quote: 'The engagement TechVyro brought was incredible. Our product sold out within 48 hours of the review!',
    rating: 5,
    initial: 'AP',
    color: 'from-orange-500 to-amber-500',
  },
]

export function TestimonialsSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" })
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [direction, setDirection] = useState(0)
  const [isDragging, setIsDragging] = useState(false)

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
      scale: 0.9,
      rotateY: direction > 0 ? 15 : -15,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      rotateY: 0,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0,
      scale: 0.9,
      rotateY: direction < 0 ? 15 : -15,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    }),
  }

  const nextSlide = useCallback(() => {
    setDirection(1)
    setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS.length)
  }, [])

  const prevSlide = useCallback(() => {
    setDirection(-1)
    setCurrentIndex((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length)
  }, [])

  const goToSlide = (index: number) => {
    setDirection(index > currentIndex ? 1 : -1)
    setCurrentIndex(index)
  }

  // Auto-play
  useEffect(() => {
    if (!isAutoPlaying || isDragging) return
    const timer = setInterval(nextSlide, 5000)
    return () => clearInterval(timer)
  }, [isAutoPlaying, isDragging, nextSlide])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prevSlide()
      if (e.key === 'ArrowRight') nextSlide()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [nextSlide, prevSlide])

  const currentTestimonial = TESTIMONIALS[currentIndex]

  return (
    <section id="testimonials" className="py-20 sm:py-28 relative overflow-hidden" ref={sectionRef}>
      {/* Background decoration */}
      <div className="absolute inset-0 dot-pattern opacity-20" />
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="text-primary text-xs font-semibold tracking-wider uppercase">Testimonials</span>
          <h2 className="text-3xl sm:text-4xl font-bold mt-2">
            What Brands <span className="gradient-text">Say</span>
          </h2>
          <p className="text-sm text-muted-foreground mt-2 max-w-xl mx-auto">
            Real feedback from brand partners who&apos;ve scaled with TechVyro.
          </p>
        </motion.div>

        {/* Carousel Container */}
        <div className="relative max-w-4xl mx-auto">
          {/* Main Carousel */}
          <div 
            className="relative h-[320px] sm:h-[280px]"
            style={{ perspective: '1000px' }}
            onMouseEnter={() => setIsDragging(true)}
            onMouseLeave={() => setIsDragging(false)}
          >
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.2}
                onDragEnd={(_, { offset, velocity }) => {
                  const swipe = Math.abs(offset.x) * velocity.x
                  if (swipe < -10000) nextSlide()
                  else if (swipe > 10000) prevSlide()
                }}
                className="absolute inset-0 cursor-grab active:cursor-grabbing"
              >
                <Card className="glass-card border-border/30 h-full hover:border-primary/30 transition-all">
                  <CardContent className="p-6 sm:p-10 flex flex-col h-full">
                    {/* Quote icon with glow */}
                    <div className="relative mb-4">
                      <Quote className="h-10 w-10 text-primary/30" />
                      <div className="absolute inset-0 h-10 w-10 bg-primary/20 blur-xl" />
                    </div>

                    {/* Stars */}
                    <div className="flex gap-1 mb-4">
                      {Array.from({ length: currentTestimonial.rating }).map((_, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: idx * 0.1 }}
                        >
                          <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
                        </motion.div>
                      ))}
                    </div>

                    {/* Quote */}
                    <motion.p 
                      key={`quote-${currentIndex}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      className="text-lg sm:text-xl text-foreground leading-relaxed mb-6 flex-1"
                    >
                      &ldquo;{currentTestimonial.quote}&rdquo;
                    </motion.p>

                    {/* Author */}
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="flex items-center gap-4 pt-4 border-t border-border/30"
                    >
                      <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${currentTestimonial.color} flex items-center justify-center text-white font-bold text-lg shadow-lg`}>
                        {currentTestimonial.initial}
                      </div>
                      <div>
                        <p className="text-base font-semibold">{currentTestimonial.name}</p>
                        <p className="text-sm text-muted-foreground">{currentTestimonial.role}</p>
                      </div>
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Arrows */}
          <div className="flex justify-center items-center gap-4 mt-8">
            <Button
              variant="ghost"
              size="icon"
              onClick={prevSlide}
              className="h-12 w-12 rounded-full glass hover:bg-primary/20 transition-all"
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>

            {/* Dots */}
            <div className="flex gap-2">
              {TESTIMONIALS.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => goToSlide(idx)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    idx === currentIndex 
                      ? 'w-8 bg-primary' 
                      : 'w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50'
                  }`}
                  aria-label={`Go to testimonial ${idx + 1}`}
                />
              ))}
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={nextSlide}
              className="h-12 w-12 rounded-full glass hover:bg-primary/20 transition-all"
            >
              <ChevronRight className="h-6 w-6" />
            </Button>

            {/* Play/Pause */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsAutoPlaying(!isAutoPlaying)}
              className="h-10 w-10 rounded-full glass hover:bg-primary/20 transition-all ml-2"
            >
              {isAutoPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
          </div>

          {/* Progress Bar */}
          <div className="mt-6 h-1 bg-muted/30 rounded-full overflow-hidden max-w-xs mx-auto">
            <motion.div
              key={currentIndex}
              className="h-full bg-gradient-to-r from-primary to-secondary"
              initial={{ width: '0%' }}
              animate={{ width: isAutoPlaying && !isDragging ? '100%' : '0%' }}
              transition={{ duration: 5, ease: 'linear' }}
            />
          </div>
        </div>

        {/* Mini cards preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="hidden lg:flex justify-center gap-4 mt-12"
        >
          {TESTIMONIALS.map((t, idx) => (
            <motion.button
              key={t.name}
              onClick={() => goToSlide(idx)}
              className={`group flex items-center gap-3 px-4 py-3 rounded-xl border transition-all ${
                idx === currentIndex 
                  ? 'glass-card border-primary/50 scale-105' 
                  : 'glass border-border/30 opacity-60 hover:opacity-100 hover:border-border/50'
              }`}
              whileHover={{ scale: idx === currentIndex ? 1.05 : 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${t.color} flex items-center justify-center text-white text-sm font-bold`}>
                {t.initial}
              </div>
              <div className="text-left">
                <p className="text-sm font-medium">{t.name}</p>
                <p className="text-xs text-muted-foreground truncate max-w-[120px]">{t.role}</p>
              </div>
            </motion.button>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
