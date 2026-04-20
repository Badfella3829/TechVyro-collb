"use client"

import { useRef, useState, useEffect } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

interface Testimonial {
  id: number
  name: string
  designation: string
  company: string
  content: string
  rating: number
  avatar: string
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: 'Rahul Sharma',
    designation: 'Marketing Head',
    company: 'Samsung India',
    content: 'TechVyro delivered exceptional content for our Galaxy S24 launch. The attention to detail in the review and the audience engagement was far beyond our expectations. Highly recommend for any tech brand.',
    rating: 5,
    avatar: 'RS',
  },
  {
    id: 2,
    name: 'Priya Mehta',
    designation: 'Brand Manager',
    company: 'OnePlus',
    content: 'Working with TechVyro was seamless from start to finish. The content quality, professionalism, and ROI we received was outstanding. Our campaign reached 2x the expected audience.',
    rating: 5,
    avatar: 'PM',
  },
  {
    id: 3,
    name: 'Amit Patel',
    designation: 'CEO',
    company: 'TechStore India',
    content: 'The best tech content creator we have worked with in India. TechVyro understands the product deeply and creates content that actually drives conversions. 3x ROI on our campaign.',
    rating: 5,
    avatar: 'AP',
  },
  {
    id: 4,
    name: 'Sneha Gupta',
    designation: 'Digital Marketing Lead',
    company: 'Xiaomi India',
    content: 'TechVyro brings a unique perspective to tech content. The storytelling approach helped us connect with our audience on a deeper level. Campaign results exceeded all KPIs.',
    rating: 5,
    avatar: 'SG',
  },
  {
    id: 5,
    name: 'Vikram Singh',
    designation: 'Partnership Manager',
    company: 'Google India',
    content: 'Professional, creative, and data-driven. TechVyro provided detailed post-campaign reports that helped us understand the impact. Will definitely collaborate again.',
    rating: 5,
    avatar: 'VS',
  },
]

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${i < rating ? 'text-amber-400 fill-amber-400' : 'text-muted-foreground/30'}`}
        />
      ))}
    </div>
  )
}

export function TestimonialsSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [current, setCurrent] = useState(0)
  const [direction, setDirection] = useState(0)

  // Auto-advance
  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1)
      setCurrent(prev => (prev + 1) % testimonials.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [])

  const paginate = (dir: number) => {
    setDirection(dir)
    setCurrent(prev => {
      if (dir === 1) return (prev + 1) % testimonials.length
      return prev === 0 ? testimonials.length - 1 : prev - 1
    })
  }

  const variants = {
    enter: (dir: number) => ({ x: dir > 0 ? 300 : -300, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -300 : 300, opacity: 0 }),
  }

  return (
    <section id="testimonials" className="py-24 sm:py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-secondary/5 to-transparent" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative" ref={ref}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-primary text-sm font-semibold tracking-wider uppercase">
            Testimonials
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mt-2 mb-4">
            What Brands
            <span className="gradient-text"> Say</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Don&apos;t just take my word for it - hear from brands that have seen real results
            from our collaborations.
          </p>
        </motion.div>

        {/* Featured testimonial carousel */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-3xl mx-auto mb-12"
        >
          <Card className="glass border-border/50 relative overflow-hidden">
            <div className="absolute top-6 right-6 text-primary/10">
              <Quote className="h-20 w-20" />
            </div>
            <CardContent className="p-8 sm:p-12 min-h-[280px] flex flex-col justify-center">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={current}
                  custom={direction}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                >
                  <StarRating rating={testimonials[current].rating} />
                  <p className="text-lg sm:text-xl text-foreground leading-relaxed mt-4 mb-6">
                    &ldquo;{testimonials[current].content}&rdquo;
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-sm font-bold text-primary-foreground">
                      {testimonials[current].avatar}
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{testimonials[current].name}</p>
                      <p className="text-sm text-muted-foreground">
                        {testimonials[current].designation}, {testimonials[current].company}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </CardContent>
          </Card>

          {/* Controls */}
          <div className="flex items-center justify-center gap-4 mt-6">
            <Button
              variant="outline"
              size="icon"
              onClick={() => paginate(-1)}
              className="rounded-full h-10 w-10"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <div className="flex items-center gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => { setDirection(i > current ? 1 : -1); setCurrent(i) }}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    i === current ? 'w-8 bg-primary' : 'w-2 bg-muted-foreground/30'
                  }`}
                  aria-label={`Go to testimonial ${i + 1}`}
                />
              ))}
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={() => paginate(1)}
              className="rounded-full h-10 w-10"
              aria-label="Next testimonial"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </motion.div>

        {/* Grid of mini testimonials */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {testimonials.slice(0, 3).map((t, index) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
            >
              <Card className="glass border-border/50 hover:border-primary/30 transition-colors h-full">
                <CardContent className="p-6">
                  <StarRating rating={t.rating} />
                  <p className="text-sm text-muted-foreground mt-3 mb-4 line-clamp-3">
                    &ldquo;{t.content}&rdquo;
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-xs font-bold text-primary-foreground">
                      {t.avatar}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{t.name}</p>
                      <p className="text-xs text-muted-foreground">{t.company}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
