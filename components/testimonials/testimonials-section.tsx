"use client"

import { useRef, useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { Star, Quote, ChevronLeft, ChevronRight, Pause, Play, Building2, TrendingUp, Users, Award, BadgeCheck } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

const TESTIMONIALS = [
  {
    name: 'Rajesh Kumar',
    role: 'Marketing Head',
    company: 'Xiaomi India',
    quote: 'TechVyro\'s unboxing video was a game-changer for our launch. 2.4M views and 18% conversion lift!',
    rating: 5,
    initial: 'RK',
    color: 'from-orange-500 to-amber-500',
    stats: { views: '2.4M', conversion: '+18%' },
    verified: true,
    campaignType: 'Product Launch Campaign',
  },
  {
    name: 'Priya Sharma',
    role: 'Founder & CEO',
    company: 'boAt Lifestyle',
    quote: 'Working with TechVyro was seamless. Professional, on-time delivery, and amazing creative ideas that resonated with our audience.',
    rating: 5,
    initial: 'PS',
    color: 'from-pink-500 to-rose-500',
    stats: { views: '1.8M', conversion: '+22%' },
    verified: true,
    campaignType: 'Brand Awareness',
  },
  {
    name: 'Vikram Mehta',
    role: 'Brand Manager',
    company: 'Samsung India',
    quote: 'Best ROI we\'ve seen from any creator. TechVyro\'s audience trusts them completely — that converts to sales.',
    rating: 5,
    initial: 'VM',
    color: 'from-blue-500 to-cyan-500',
    stats: { views: '3.1M', conversion: '+15%' },
    verified: true,
    campaignType: 'Flagship Launch',
  },
  {
    name: 'Anjali Desai',
    role: 'CMO',
    company: 'Noise',
    quote: 'Honest reviews, deep tech understanding, and incredible production quality. Our smartwatch launch was a huge success!',
    rating: 5,
    initial: 'AD',
    color: 'from-violet-500 to-purple-500',
    stats: { views: '1.5M', conversion: '+25%' },
    verified: true,
    campaignType: 'Smartwatch Review',
  },
  {
    name: 'Amit Patel',
    role: 'CEO',
    company: 'Portronics',
    quote: 'The engagement TechVyro brought was incredible. Our product sold out within 48 hours of the review going live!',
    rating: 5,
    initial: 'AP',
    color: 'from-green-500 to-emerald-500',
    stats: { views: '980K', conversion: '+32%' },
    verified: true,
    campaignType: 'Product Review',
  },
  {
    name: 'Neha Gupta',
    role: 'Digital Marketing Lead',
    company: 'OnePlus India',
    quote: 'TechVyro understands tech like no other creator. Their detailed comparisons helped us stand out in a crowded market.',
    rating: 5,
    initial: 'NG',
    color: 'from-red-500 to-orange-500',
    stats: { views: '2.8M', conversion: '+20%' },
    verified: true,
    campaignType: 'Comparison Video',
  },
]

// Stats counter component
function AnimatedStat({ value, label, icon: Icon, delay }: { value: string; label: string; icon: any; delay: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true })
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay, duration: 0.5 }}
      className="text-center"
    >
      <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 mb-3">
        <Icon className="w-6 h-6 text-primary" />
      </div>
      <motion.div
        initial={{ scale: 0.5 }}
        animate={isInView ? { scale: 1 } : {}}
        transition={{ delay: delay + 0.2, type: "spring", stiffness: 200 }}
        className="text-3xl sm:text-4xl font-bold gradient-text"
      >
        {value}
      </motion.div>
      <p className="text-sm text-muted-foreground mt-1">{label}</p>
    </motion.div>
  )
}

export function TestimonialsSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" })
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [direction, setDirection] = useState(0)
  const [isDragging, setIsDragging] = useState(false)

  const slideVariants: any = {
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
    <section id="testimonials" className="py-10 sm:py-14 relative overflow-hidden" ref={sectionRef}>
      {/* Background decoration */}
      <div className="absolute inset-0 grid-pattern-subtle opacity-20" />
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <Award className="h-3.5 w-3.5 text-primary" />
            <span className="text-xs font-semibold text-primary tracking-wide uppercase">Testimonials</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mt-2">
            What Brands <span className="gradient-text">Say</span>
          </h2>
          <p className="text-base text-muted-foreground mt-3 max-w-xl mx-auto">
            Real feedback from brand partners who&apos;ve scaled with TechVyro.
          </p>
        </motion.div>

        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16 max-w-3xl mx-auto"
        >
          <AnimatedStat value="50+" label="Brand Collabs" icon={Building2} delay={0.1} />
          <AnimatedStat value="25M+" label="Total Views" icon={TrendingUp} delay={0.2} />
          <AnimatedStat value="98%" label="Client Satisfaction" icon={Award} delay={0.3} />
          <AnimatedStat value="500K+" label="Audience Reached" icon={Users} delay={0.4} />
        </motion.div>

        {/* Carousel Container */}
        <div className="relative max-w-4xl mx-auto">
          {/* Main Carousel */}
          <div 
            className="relative h-[380px] sm:h-[320px]"
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
                <Card className="glass-card border-border/30 h-full hover:border-primary/30 transition-all overflow-hidden">
                  <CardContent className="p-6 sm:p-10 flex flex-col h-full relative">
                    {/* Decorative gradient */}
                    <div className={`absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl ${currentTestimonial.color} opacity-10 blur-3xl`} />
                    
                    {/* Quote icon with glow */}
                    <div className="relative mb-4">
                      <Quote className="h-10 w-10 text-primary/40" />
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

                    {/* Campaign Stats */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.25 }}
                      className="flex gap-6 mb-6"
                    >
                      <div className="glass-soft px-4 py-2 rounded-lg">
                        <p className="text-xs text-muted-foreground">Views</p>
                        <p className="text-lg font-bold text-primary">{currentTestimonial.stats.views}</p>
                      </div>
                      <div className="glass-soft px-4 py-2 rounded-lg">
                        <p className="text-xs text-muted-foreground">Conversion</p>
                        <p className="text-lg font-bold text-green-500">{currentTestimonial.stats.conversion}</p>
                      </div>
                    </motion.div>

                    {/* Author */}
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="flex items-center gap-4 pt-4 border-t border-border/30"
                    >
                      <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${currentTestimonial.color} flex items-center justify-center text-white font-bold text-lg shadow-lg ring-4 ring-background`}>
                        {currentTestimonial.initial}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="text-base font-semibold">{currentTestimonial.name}</p>
                          {currentTestimonial.verified && (
                            <BadgeCheck className="h-4 w-4 text-blue-500" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{currentTestimonial.role}</p>
                        <p className="text-xs text-primary/70 mt-0.5">{currentTestimonial.campaignType}</p>
                      </div>
                      <div className="hidden sm:block text-right">
                        <p className="text-xs text-muted-foreground">Company</p>
                        <p className="text-sm font-semibold text-primary">{currentTestimonial.company}</p>
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
              className="h-12 w-12 rounded-full glass hover:bg-primary/20 transition-all hover:scale-110"
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>

            {/* Dots */}
            <div className="flex gap-2">
              {TESTIMONIALS.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => goToSlide(idx)}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    idx === currentIndex 
                      ? 'w-10 bg-gradient-to-r from-primary to-secondary' 
                      : 'w-2.5 bg-muted-foreground/30 hover:bg-muted-foreground/50'
                  }`}
                  aria-label={`Go to testimonial ${idx + 1}`}
                />
              ))}
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={nextSlide}
              className="h-12 w-12 rounded-full glass hover:bg-primary/20 transition-all hover:scale-110"
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
          <div className="mt-6 h-1.5 bg-muted/30 rounded-full overflow-hidden max-w-xs mx-auto">
            <motion.div
              key={currentIndex}
              className="h-full bg-gradient-to-r from-primary via-secondary to-primary"
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
          className="hidden lg:flex justify-center gap-3 mt-12 flex-wrap"
        >
          {TESTIMONIALS.map((t, idx) => (
            <motion.button
              key={t.name}
              onClick={() => goToSlide(idx)}
              className={`group flex items-center gap-3 px-4 py-3 rounded-xl border transition-all ${
                idx === currentIndex 
                  ? 'glass-card border-primary/50 shadow-lg shadow-primary/10' 
                  : 'glass border-border/30 opacity-60 hover:opacity-100 hover:border-border/50'
              }`}
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${t.color} flex items-center justify-center text-white text-sm font-bold shadow-md`}>
                {t.initial}
              </div>
              <div className="text-left">
                <p className="text-sm font-medium">{t.name}</p>
                <p className="text-xs text-muted-foreground">{t.company}</p>
              </div>
            </motion.button>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center mt-12"
        >
          <p className="text-muted-foreground text-sm mb-4">Want similar results for your brand?</p>
          <a 
            href="#contact" 
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-semibold hover:opacity-90 transition-all hover:scale-105"
          >
            Start Your Campaign
            <TrendingUp className="w-4 h-4" />
          </a>
        </motion.div>
      </div>
    </section>
  )
}
