"use client"

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ChevronLeft, ChevronRight, Calendar as CalendarIcon, 
  Video, Image, Mic, Clock, CheckCircle2, AlertCircle,
  Youtube, Instagram, Sparkles
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

interface ContentItem {
  id: string
  title: string
  type: 'youtube' | 'reel' | 'short' | 'podcast' | 'story'
  status: 'scheduled' | 'in-progress' | 'completed' | 'available'
  date: Date
  time?: string
  brand?: string
  description?: string
}

const CONTENT_TYPES = {
  youtube: { icon: Youtube, label: 'YouTube Video', color: 'bg-red-500' },
  reel: { icon: Instagram, label: 'Instagram Reel', color: 'bg-pink-500' },
  short: { icon: Video, label: 'YouTube Short', color: 'bg-orange-500' },
  podcast: { icon: Mic, label: 'Podcast', color: 'bg-purple-500' },
  story: { icon: Image, label: 'Story', color: 'bg-blue-500' },
}

const STATUS_STYLES = {
  scheduled: { bg: 'bg-primary/20', text: 'text-primary', label: 'Scheduled' },
  'in-progress': { bg: 'bg-amber-500/20', text: 'text-amber-500', label: 'In Progress' },
  completed: { bg: 'bg-accent/20', text: 'text-accent', label: 'Completed' },
  available: { bg: 'bg-muted', text: 'text-muted-foreground', label: 'Slot Available' },
}

// Generate sample content for demo
function generateSampleContent(): ContentItem[] {
  const today = new Date()
  const content: ContentItem[] = []
  
  const titles = [
    'iPhone 16 Pro Max Deep Review',
    'Best Budget Earbuds 2024',
    'MacBook Air M3 vs M2',
    'Samsung S24 Ultra Camera Test',
    'Tech News Weekly',
    'Pixel 9 Unboxing',
    'Gaming Phone Showdown',
    'Smart Home Setup Guide',
  ]
  
  const brands = ['Apple', 'Samsung', 'OnePlus', 'Google', 'Xiaomi', 'Nothing']
  const types: ContentItem['type'][] = ['youtube', 'reel', 'short', 'podcast', 'story']
  const statuses: ContentItem['status'][] = ['scheduled', 'in-progress', 'completed', 'available']
  
  for (let i = -7; i < 21; i++) {
    const date = new Date(today)
    date.setDate(date.getDate() + i)
    
    // Add 1-3 items per day randomly
    const itemsPerDay = Math.floor(Math.random() * 3) + 1
    
    for (let j = 0; j < itemsPerDay; j++) {
      const isPast = i < 0
      const isToday = i === 0
      
      content.push({
        id: `${i}-${j}`,
        title: titles[Math.floor(Math.random() * titles.length)],
        type: types[Math.floor(Math.random() * types.length)],
        status: isPast ? 'completed' : isToday ? 'in-progress' : 
                Math.random() > 0.7 ? 'available' : 'scheduled',
        date,
        time: `${10 + Math.floor(Math.random() * 10)}:00`,
        brand: Math.random() > 0.4 ? brands[Math.floor(Math.random() * brands.length)] : undefined,
        description: 'Detailed product review with real-world testing and performance benchmarks.',
      })
    }
  }
  
  return content
}

export function ContentCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDay, setSelectedDay] = useState<Date | null>(null)
  const [selectedContent, setSelectedContent] = useState<ContentItem | null>(null)
  
  const contentItems = useMemo(() => generateSampleContent(), [])
  
  const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
  const monthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)
  const startDate = new Date(monthStart)
  startDate.setDate(startDate.getDate() - startDate.getDay())
  
  const days: Date[] = []
  const current = new Date(startDate)
  while (current <= monthEnd || days.length % 7 !== 0) {
    days.push(new Date(current))
    current.setDate(current.getDate() + 1)
  }
  
  const getContentForDate = (date: Date) => {
    return contentItems.filter(item => 
      item.date.toDateString() === date.toDateString()
    )
  }
  
  const navigateMonth = (direction: number) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev)
      newDate.setMonth(newDate.getMonth() + direction)
      return newDate
    })
  }
  
  const isToday = (date: Date) => {
    const today = new Date()
    return date.toDateString() === today.toDateString()
  }
  
  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === currentDate.getMonth()
  }

  const dayContent = selectedDay ? getContentForDate(selectedDay) : []

  return (
    <section className="py-16 sm:py-20 relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <span className="text-primary text-xs font-semibold tracking-wider uppercase">Content Schedule</span>
          <h2 className="text-3xl sm:text-4xl font-bold mt-2">
            Upcoming <span className="gradient-text">Content</span>
          </h2>
          <p className="text-sm text-muted-foreground mt-2 max-w-xl mx-auto">
            See what&apos;s coming up and find available collaboration slots
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Calendar */}
          <Card className="lg:col-span-2 glass border-border/50">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <CalendarIcon className="h-5 w-5 text-primary" />
                  {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </CardTitle>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => navigateMonth(-1)}
                    className="h-8 w-8"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => navigateMonth(1)}
                    className="h-8 w-8"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Day headers */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="text-center text-xs font-semibold text-muted-foreground py-2">
                    {day}
                  </div>
                ))}
              </div>
              
              {/* Calendar grid */}
              <div className="grid grid-cols-7 gap-1">
                {days.map((date, index) => {
                  const dayContent = getContentForDate(date)
                  const hasAvailable = dayContent.some(c => c.status === 'available')
                  
                  return (
                    <motion.button
                      key={index}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedDay(date)}
                      className={`
                        relative p-2 min-h-[80px] rounded-lg border transition-all text-left
                        ${isCurrentMonth(date) ? 'bg-card' : 'bg-muted/30'}
                        ${isToday(date) ? 'border-primary ring-1 ring-primary' : 'border-border/30'}
                        ${selectedDay?.toDateString() === date.toDateString() ? 'border-secondary' : ''}
                        hover:border-primary/50
                      `}
                    >
                      <span className={`
                        text-sm font-semibold
                        ${!isCurrentMonth(date) ? 'text-muted-foreground/50' : ''}
                        ${isToday(date) ? 'text-primary' : ''}
                      `}>
                        {date.getDate()}
                      </span>
                      
                      {/* Content indicators */}
                      <div className="mt-1 space-y-0.5">
                        {dayContent.slice(0, 3).map((item, i) => {
                          const TypeIcon = CONTENT_TYPES[item.type].icon
                          return (
                            <div
                              key={item.id}
                              className={`
                                flex items-center gap-1 px-1 py-0.5 rounded text-[10px] truncate
                                ${STATUS_STYLES[item.status].bg}
                              `}
                            >
                              <TypeIcon className="h-2.5 w-2.5 flex-shrink-0" />
                              <span className="truncate">{item.type}</span>
                            </div>
                          )
                        })}
                        {dayContent.length > 3 && (
                          <span className="text-[10px] text-muted-foreground">
                            +{dayContent.length - 3} more
                          </span>
                        )}
                      </div>
                      
                      {/* Available slot indicator */}
                      {hasAvailable && (
                        <div className="absolute top-1 right-1">
                          <Sparkles className="h-3 w-3 text-accent" />
                        </div>
                      )}
                    </motion.button>
                  )
                })}
              </div>
              
              {/* Legend */}
              <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-border/30">
                {Object.entries(STATUS_STYLES).map(([key, style]) => (
                  <div key={key} className="flex items-center gap-2 text-xs">
                    <div className={`w-3 h-3 rounded ${style.bg}`} />
                    <span className="text-muted-foreground">{style.label}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Selected Day Details */}
          <Card className="glass border-border/50">
            <CardHeader>
              <CardTitle className="text-lg">
                {selectedDay 
                  ? selectedDay.toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      month: 'short', 
                      day: 'numeric' 
                    })
                  : 'Select a Day'
                }
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!selectedDay ? (
                <div className="text-center py-8 text-muted-foreground">
                  <CalendarIcon className="h-12 w-12 mx-auto mb-3 opacity-30" />
                  <p className="text-sm">Click on a day to see scheduled content</p>
                </div>
              ) : dayContent.length === 0 ? (
                <div className="text-center py-8">
                  <Sparkles className="h-12 w-12 mx-auto mb-3 text-accent" />
                  <p className="text-sm text-muted-foreground mb-4">No content scheduled</p>
                  <Button size="sm" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                    Book This Slot
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  <AnimatePresence mode="popLayout">
                    {dayContent.map((item, index) => {
                      const TypeInfo = CONTENT_TYPES[item.type]
                      const StatusInfo = STATUS_STYLES[item.status]
                      
                      return (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 10 }}
                          transition={{ delay: index * 0.05 }}
                          onClick={() => setSelectedContent(item)}
                          className="p-3 rounded-lg border border-border/50 hover:border-primary/50 transition-all cursor-pointer group"
                        >
                          <div className="flex items-start gap-3">
                            <div className={`p-2 rounded-lg ${TypeInfo.color} text-white`}>
                              <TypeInfo.icon className="h-4 w-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-xs font-medium truncate">{item.title}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge 
                                  variant="outline" 
                                  className={`text-[10px] ${StatusInfo.bg} ${StatusInfo.text} border-0`}
                                >
                                  {StatusInfo.label}
                                </Badge>
                                {item.time && (
                                  <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                                    <Clock className="h-2.5 w-2.5" />
                                    {item.time}
                                  </span>
                                )}
                              </div>
                              {item.brand && (
                                <p className="text-[10px] text-muted-foreground mt-1">
                                  Brand: {item.brand}
                                </p>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      )
                    })}
                  </AnimatePresence>
                  
                  {dayContent.some(c => c.status === 'available') && (
                    <Button className="w-full mt-4 bg-accent hover:bg-accent/90 text-accent-foreground">
                      Book Available Slot
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Content Detail Modal */}
      <Dialog open={!!selectedContent} onOpenChange={() => setSelectedContent(null)}>
        <DialogContent className="glass border-border/50">
          <DialogHeader>
            <DialogTitle>{selectedContent?.title}</DialogTitle>
          </DialogHeader>
          {selectedContent && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-lg ${CONTENT_TYPES[selectedContent.type].color} text-white`}>
                  {(() => {
                    const TypeIcon = CONTENT_TYPES[selectedContent.type].icon
                    return <TypeIcon className="h-5 w-5" />
                  })()}
                </div>
                <div>
                  <p className="font-semibold">{CONTENT_TYPES[selectedContent.type].label}</p>
                  <p className="text-sm text-muted-foreground">
                    {selectedContent.date.toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                    {selectedContent.time && ` at ${selectedContent.time}`}
                  </p>
                </div>
              </div>
              
              <Badge className={`${STATUS_STYLES[selectedContent.status].bg} ${STATUS_STYLES[selectedContent.status].text} border-0`}>
                {STATUS_STYLES[selectedContent.status].label}
              </Badge>
              
              {selectedContent.brand && (
                <div>
                  <p className="text-sm font-semibold">Brand Partner</p>
                  <p className="text-sm text-muted-foreground">{selectedContent.brand}</p>
                </div>
              )}
              
              {selectedContent.description && (
                <div>
                  <p className="text-sm font-semibold">Description</p>
                  <p className="text-sm text-muted-foreground">{selectedContent.description}</p>
                </div>
              )}
              
              {selectedContent.status === 'available' && (
                <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                  Request This Slot
                </Button>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  )
}
