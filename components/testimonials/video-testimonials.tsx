"use client"

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Pause, X, Volume2, VolumeX, ChevronLeft, ChevronRight } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent } from '@/components/ui/dialog'

interface VideoTestimonial {
  id: string
  name: string
  role: string
  company: string
  thumbnail: string
  videoUrl: string
  quote: string
  results: string
}

const VIDEO_TESTIMONIALS: VideoTestimonial[] = [
  {
    id: '1',
    name: 'Rajesh Kumar',
    role: 'Marketing Head',
    company: 'TechGadgets India',
    thumbnail: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=300&fit=crop',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    quote: 'TechVyro transformed our product launch completely.',
    results: '2.4M Views, 18% Sales Lift',
  },
  {
    id: '2',
    name: 'Priya Sharma',
    role: 'Founder & CEO',
    company: 'AudioMax',
    thumbnail: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=300&fit=crop',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    quote: 'Best creator collaboration we have ever done.',
    results: '1.8M Reach, 25% Engagement',
  },
  {
    id: '3',
    name: 'Vikram Mehta',
    role: 'Brand Manager',
    company: 'SmartHome Pro',
    thumbnail: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=300&fit=crop',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    quote: 'ROI exceeded all our expectations.',
    results: '3.2M Views, 200% ROI',
  },
  {
    id: '4',
    name: 'Anjali Desai',
    role: 'CMO',
    company: 'GadgetWorld',
    thumbnail: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=300&fit=crop',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    quote: 'Professional, creative, and delivers results.',
    results: '1.5M Views, 500K New Followers',
  },
]

export function VideoTestimonials() {
  const [selectedVideo, setSelectedVideo] = useState<VideoTestimonial | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState<string | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 320
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      })
    }
  }

  return (
    <section className="py-16 sm:py-20 relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <span className="text-primary text-xs font-semibold tracking-wider uppercase">Video Reviews</span>
          <h2 className="text-3xl sm:text-4xl font-bold mt-2">
            Hear From <span className="gradient-text">Our Partners</span>
          </h2>
          <p className="text-sm text-muted-foreground mt-2 max-w-xl mx-auto">
            Real video testimonials from brands who scaled with TechVyro
          </p>
        </motion.div>

        {/* Navigation Buttons */}
        <div className="flex justify-end gap-2 mb-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => scroll('left')}
            className="border-border/50 hover:border-primary/50"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => scroll('right')}
            className="border-border/50 hover:border-primary/50"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Video Grid */}
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 snap-x snap-mandatory"
        >
          {VIDEO_TESTIMONIALS.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="flex-shrink-0 w-[280px] sm:w-[300px] snap-center"
            >
              <Card className="glass border-border/50 hover:border-primary/40 transition-all group overflow-hidden">
                {/* Thumbnail */}
                <div
                  className="relative aspect-video cursor-pointer overflow-hidden"
                  onClick={() => setSelectedVideo(testimonial)}
                >
                  <img
                    src={testimonial.thumbnail}
                    alt={testimonial.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-14 h-14 rounded-full bg-primary/90 flex items-center justify-center neon-glow-cyan"
                    >
                      <Play className="h-6 w-6 text-primary-foreground ml-1" />
                    </motion.div>
                  </div>
                  {/* Results Badge */}
                  <div className="absolute bottom-2 left-2 right-2">
                    <div className="bg-black/70 backdrop-blur-sm rounded-md px-2 py-1">
                      <p className="text-xs font-semibold text-accent">{testimonial.results}</p>
                    </div>
                  </div>
                </div>

                {/* Info */}
                <div className="p-4">
                  <p className="text-sm text-muted-foreground italic mb-3 line-clamp-2">
                    &ldquo;{testimonial.quote}&rdquo;
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-sm">
                      {testimonial.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{testimonial.name}</p>
                      <p className="text-[11px] text-muted-foreground">
                        {testimonial.role}, {testimonial.company}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Video Modal */}
      <Dialog open={!!selectedVideo} onOpenChange={() => setSelectedVideo(null)}>
        <DialogContent className="max-w-4xl p-0 bg-black border-border/50 overflow-hidden">
          <div className="relative aspect-video">
            {selectedVideo && (
              <iframe
                src={`${selectedVideo.videoUrl}?autoplay=1`}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            )}
          </div>
          {selectedVideo && (
            <div className="p-4 bg-card">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold">
                  {selectedVideo.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <p className="font-semibold">{selectedVideo.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {selectedVideo.role} at {selectedVideo.company}
                  </p>
                </div>
                <div className="ml-auto">
                  <span className="text-sm font-semibold text-accent">{selectedVideo.results}</span>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  )
}
