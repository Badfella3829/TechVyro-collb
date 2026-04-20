"use client"

import { Calendar, Clock, ArrowRight, MessageCircle } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '916396094707'
const PRESET_MESSAGE = encodeURIComponent(
  "Hi Akansh! I'd like to book a free 30-min discovery call. Please share your available time slots."
)

export function CalendlyEmbed() {
  const bookingHref = `https://wa.me/${WHATSAPP_NUMBER.replace(/\D/g, '')}?text=${PRESET_MESSAGE}`

  return (
    <Card className="glass border-border/50 hover:border-primary/40 transition-colors">
      <CardContent className="p-5 sm:p-6">
        <div className="flex items-start gap-4 mb-5">
          <div className="p-3 rounded-xl bg-gradient-to-br from-primary to-secondary text-white shrink-0">
            <Calendar className="h-5 w-5" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold leading-tight">Book a Discovery Call</h3>
            <p className="text-xs text-muted-foreground mt-1">Pick a 30-min slot — free consultation</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2 mb-5 text-xs">
          {[
            { icon: Clock, label: '30 min' },
            { icon: Calendar, label: 'Same week' },
            { icon: ArrowRight, label: 'Free' },
          ].map((s) => (
            <div key={s.label} className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg bg-muted/30">
              <s.icon className="h-3 w-3 text-primary" />
              <span className="font-medium">{s.label}</span>
            </div>
          ))}
        </div>
        <Button asChild className="w-full bg-emerald-600 hover:bg-emerald-700 text-white" size="lg">
          <a href={bookingHref} target="_blank" rel="noopener noreferrer">
            <MessageCircle className="h-4 w-4 mr-2" />
            Book via WhatsApp <ArrowRight className="h-4 w-4 ml-2" />
          </a>
        </Button>
        <p className="text-[10px] text-muted-foreground text-center mt-3">
          Instant reply on WhatsApp • +91 63960 94707
        </p>
      </CardContent>
    </Card>
  )
}
