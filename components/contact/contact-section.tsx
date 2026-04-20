"use client"

import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { 
  Send, 
  Mail, 
  MessageSquare, 
  Clock, 
  Calendar,
  Building2,
  Target,
  Wallet,
  FileText
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const budgetRanges = [
  'Under ₹10,000',
  '₹10,000 - ₹25,000',
  '₹25,000 - ₹50,000',
  '₹50,000 - ₹1,00,000',
  '₹1,00,000+'
]

const collabTypes = [
  'Dedicated Video',
  'Integrated Sponsorship',
  'Product Review',
  'Instagram Reel',
  'YouTube Short',
  'Social Media Post',
  'Live Stream',
  'Brand Ambassador',
  'Bundle Package',
  'Other'
]

const campaignGoals = [
  'Brand Awareness',
  'Product Launch',
  'Sales/Conversions',
  'App Downloads',
  'Lead Generation',
  'Community Building',
  'Other'
]

export function ContactSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    setIsSubmitting(false)
    setIsSubmitted(true)
  }

  return (
    <section id="contact" className="py-24 sm:py-32 relative">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-background" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative" ref={ref}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="text-primary text-sm font-semibold tracking-wider uppercase">
            Let&apos;s Work Together
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mt-2 mb-4">
            Book a
            <span className="gradient-text"> Collaboration</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Ready to create content that converts? Fill out the form below and 
            I&apos;ll get back to you within 24 hours.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Contact Info Cards */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-1 space-y-4"
          >
            {/* Response time */}
            <Card className="glass border-border/50">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-primary/20">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Quick Response</h3>
                    <p className="text-sm text-muted-foreground">
                      Usually replies within 2-4 hours during business hours
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Email */}
            <Card className="glass border-border/50">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-secondary/20">
                    <Mail className="h-5 w-5 text-secondary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Email</h3>
                    <p className="text-sm text-muted-foreground">
                      collab@techvyro.com
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* WhatsApp */}
            <Card className="glass border-border/50 hover:border-accent/50 transition-colors cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-accent/20">
                    <MessageSquare className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">WhatsApp Business</h3>
                    <p className="text-sm text-muted-foreground">
                      Click to chat directly
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Book a call */}
            <Card className="glass border-primary/50 bg-primary/5">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-primary/20">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1">Book a Call</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Schedule a 30-min discovery call
                    </p>
                    <Button variant="outline" size="sm" className="w-full">
                      View Calendar
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Trust signals */}
            <div className="glass p-4 rounded-xl space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <span className="w-2 h-2 bg-accent rounded-full animate-pulse" />
                <span className="text-muted-foreground">3 brands viewed media kit today</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="w-2 h-2 bg-primary rounded-full" />
                <span className="text-muted-foreground">Last collab booked: 2 days ago</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="w-2 h-2 bg-secondary rounded-full" />
                <span className="text-muted-foreground">Currently working with 4 brands</span>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="lg:col-span-2"
          >
            <Card className="glass border-border/50">
              <CardContent className="p-6 sm:p-8">
                {isSubmitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-12"
                  >
                    <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-4">
                      <Send className="h-7 w-7 text-accent" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Message Sent!</h3>
                    <p className="text-muted-foreground mb-6">
                      Thanks for reaching out! I&apos;ll get back to you within 24 hours.
                    </p>
                    <Button onClick={() => setIsSubmitted(false)} variant="outline">
                      Send Another Message
                    </Button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Brand Info */}
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="brandName" className="flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-muted-foreground" />
                          Brand Name *
                        </Label>
                        <Input 
                          id="brandName" 
                          placeholder="Your brand name"
                          required
                          className="bg-background/50"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="contactName">Contact Person *</Label>
                        <Input 
                          id="contactName" 
                          placeholder="Your name"
                          required
                          className="bg-background/50"
                        />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address *</Label>
                        <Input 
                          id="email" 
                          type="email"
                          placeholder="you@company.com"
                          required
                          className="bg-background/50"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="website">Website / Instagram</Label>
                        <Input 
                          id="website" 
                          placeholder="@yourbrand or website.com"
                          className="bg-background/50"
                        />
                      </div>
                    </div>

                    {/* Campaign Details */}
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="flex items-center gap-2">
                          <Target className="h-4 w-4 text-muted-foreground" />
                          Campaign Goal *
                        </Label>
                        <Select required>
                          <SelectTrigger className="bg-background/50">
                            <SelectValue placeholder="Select goal" />
                          </SelectTrigger>
                          <SelectContent>
                            {campaignGoals.map((goal) => (
                              <SelectItem key={goal} value={goal.toLowerCase().replace(/\s+/g, '-')}>
                                {goal}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label className="flex items-center gap-2">
                          <Wallet className="h-4 w-4 text-muted-foreground" />
                          Budget Range
                        </Label>
                        <Select>
                          <SelectTrigger className="bg-background/50">
                            <SelectValue placeholder="Select budget" />
                          </SelectTrigger>
                          <SelectContent>
                            {budgetRanges.map((range) => (
                              <SelectItem key={range} value={range.toLowerCase().replace(/\s+/g, '-')}>
                                {range}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        Preferred Collab Type
                      </Label>
                      <Select>
                        <SelectTrigger className="bg-background/50">
                          <SelectValue placeholder="Select collaboration type" />
                        </SelectTrigger>
                        <SelectContent>
                          {collabTypes.map((type) => (
                            <SelectItem key={type} value={type.toLowerCase().replace(/\s+/g, '-')}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Campaign Brief / Message *</Label>
                      <Textarea 
                        id="message" 
                        placeholder="Tell me about your brand, product, and what you're looking to achieve..."
                        rows={5}
                        required
                        className="bg-background/50 resize-none"
                      />
                    </div>

                    <Button 
                      type="submit" 
                      size="lg" 
                      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground neon-glow-cyan"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <span className="animate-spin mr-2">
                            <svg className="h-5 w-5" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                          </span>
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="h-5 w-5 mr-2" />
                          Send Inquiry
                        </>
                      )}
                    </Button>

                    <p className="text-xs text-center text-muted-foreground">
                      By submitting, you agree to be contacted regarding your inquiry.
                    </p>
                  </form>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
