"use client"

import { useRef, useState, useMemo } from 'react'
import { motion, useInView } from 'framer-motion'
import { CalendarDays, ChevronLeft, ChevronRight, AlertTriangle, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { useAvailability } from '@/hooks/use-availability'

type SlotStatus = 'available' | 'booked' | 'tentative'

function getMonthData(year: number, month: number) {
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  return { firstDay, daysInMonth }
}

function toIso(year: number, month: number, day: number): string {
  const m = String(month + 1).padStart(2, '0')
  const d = String(day).padStart(2, '0')
  return `${year}-${m}-${d}`
}

const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export function AvailabilityCalendar() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const today = new Date()
  const [currentMonth, setCurrentMonth] = useState(today.getMonth())
  const [currentYear, setCurrentYear] = useState(today.getFullYear())

  const { firstDay, daysInMonth } = useMemo(
    () => getMonthData(currentYear, currentMonth),
    [currentYear, currentMonth]
  )

  const { data: availability, loading: availabilityLoading } = useAvailability()

  const bookedSet = useMemo(
    () => new Set(availability?.bookedDates || []),
    [availability]
  )
  const tentativeSet = useMemo(
    () => new Set(availability?.tentativeDates || []),
    [availability]
  )

  const getStatusForDay = (day: number): SlotStatus => {
    const iso = toIso(currentYear, currentMonth, day)
    if (bookedSet.has(iso)) return 'booked'
    if (tentativeSet.has(iso)) return 'tentative'
    return 'available'
  }

  const availableCount = useMemo(() => {
    let count = 0
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate())
    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(currentYear, currentMonth, d)
      if (date < todayStart) continue
      if (getStatusForDay(d) === 'available') count++
    }
    return count
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [daysInMonth, currentMonth, currentYear, bookedSet, tentativeSet])

  const navigateMonth = (dir: number) => {
    let newMonth = currentMonth + dir
    let newYear = currentYear
    if (newMonth > 11) { newMonth = 0; newYear++ }
    if (newMonth < 0) { newMonth = 11; newYear-- }
    setCurrentMonth(newMonth)
    setCurrentYear(newYear)
  }

  const isToday = (day: number) =>
    day === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear()

  const isPast = (day: number) => {
    const date = new Date(currentYear, currentMonth, day)
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate())
    return date < todayStart
  }

  return (
    <section id="availability" className="py-24 sm:py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-secondary/5 to-transparent" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative" ref={ref}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="text-primary text-sm font-semibold tracking-wider uppercase">
            Availability
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mt-2 mb-4">
            Collab Slots
            <span className="gradient-text"> This Month</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Check available dates for your next campaign. Slots fill up fast - 
            book early to secure your preferred timeline.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-xl mx-auto"
        >
          <Card className="glass border-border/50 overflow-hidden">
            <CardContent className="p-6 sm:p-8">
              {/* Loading indicator */}
              {availabilityLoading && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/30 border border-border/50 mb-6 text-xs text-muted-foreground">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Loading live availability…
                </div>
              )}

              {/* FOMO badge */}
              {!availabilityLoading && availableCount <= 8 && availableCount > 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/30 mb-6"
                >
                  <AlertTriangle className="h-4 w-4 text-destructive shrink-0" />
                  <span className="text-sm text-destructive font-medium">
                    Only {availableCount} slots left in {monthNames[currentMonth]}!
                  </span>
                </motion.div>
              )}

              {/* Month Navigation */}
              <div className="flex items-center justify-between mb-6">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => navigateMonth(-1)}
                  className="h-8 w-8 rounded-full"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-primary" />
                  <span className="font-semibold">
                    {monthNames[currentMonth]} {currentYear}
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => navigateMonth(1)}
                  className="h-8 w-8 rounded-full"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>

              {/* Day Headers */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {dayNames.map((day) => (
                  <div key={day} className="text-center text-xs text-muted-foreground font-medium py-1">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1">
                {/* Empty cells for offset */}
                {Array.from({ length: firstDay }).map((_, i) => (
                  <div key={`empty-${i}`} className="aspect-square" />
                ))}

                {/* Day cells */}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const day = i + 1
                  const past = isPast(day)
                  const status: SlotStatus = past ? 'booked' : getStatusForDay(day)
                  const todayFlag = isToday(day)

                  return (
                    <motion.div
                      key={day}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={isInView ? { opacity: 1, scale: 1 } : {}}
                      transition={{ delay: 0.3 + i * 0.01 }}
                      className={cn(
                        "aspect-square rounded-lg flex items-center justify-center text-xs font-medium transition-all cursor-default relative",
                        status === 'available' && "bg-accent/15 text-accent border border-accent/30 hover:bg-accent/25",
                        status === 'booked' && "bg-muted/30 text-muted-foreground/50 line-through",
                        status === 'tentative' && "bg-amber-500/10 text-amber-400 border border-amber-500/20",
                        todayFlag && "ring-2 ring-primary ring-offset-1 ring-offset-background"
                      )}
                    >
                      {day}
                    </motion.div>
                  )
                })}
              </div>

              {/* Legend */}
              <div className="flex items-center justify-center gap-6 mt-6 pt-4 border-t border-border/30">
                <div className="flex items-center gap-2 text-xs">
                  <div className="w-3 h-3 rounded bg-accent/15 border border-accent/30" />
                  <span className="text-muted-foreground">Available</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <div className="w-3 h-3 rounded bg-amber-500/10 border border-amber-500/20" />
                  <span className="text-muted-foreground">Tentative</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <div className="w-3 h-3 rounded bg-muted/30" />
                  <span className="text-muted-foreground">Booked</span>
                </div>
              </div>

              {/* CTA */}
              <Button
                className="w-full mt-6 bg-primary text-primary-foreground neon-glow-cyan"
                onClick={() => {
                  const el = document.getElementById('contact')
                  el?.scrollIntoView({ behavior: 'smooth' })
                }}
              >
                Book a Slot
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}
