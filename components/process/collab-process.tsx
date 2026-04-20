"use client"

import { useRef, useState } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import {
  FileText,
  Lightbulb,
  CheckCircle,
  Camera,
  RefreshCw,
  Rocket,
  BarChart3,
} from 'lucide-react'

const steps = [
  {
    number: '01',
    icon: FileText,
    title: 'Brief Received',
    description: 'You share your brand goals, product details, and campaign expectations. We understand your vision completely.',
    details: ['Brand questionnaire', 'Goal alignment', 'Timeline discussion', 'Budget confirmation'],
    color: 'text-primary border-primary/30 bg-primary/10',
  },
  {
    number: '02',
    icon: Lightbulb,
    title: 'Concept & Strategy',
    description: 'I create a tailored content strategy and creative concept that aligns with your brand voice and audience.',
    details: ['Content ideation', 'Script/storyboard', 'Platform strategy', 'Hashtag research'],
    color: 'text-secondary border-secondary/30 bg-secondary/10',
  },
  {
    number: '03',
    icon: CheckCircle,
    title: 'Brand Approval',
    description: 'You review and approve the creative direction. We make sure every detail matches your expectations.',
    details: ['Concept presentation', 'Feedback round', 'Script approval', 'Final sign-off'],
    color: 'text-accent border-accent/30 bg-accent/10',
  },
  {
    number: '04',
    icon: Camera,
    title: 'Content Production',
    description: 'Professional shooting, editing, and post-production with attention to every detail.',
    details: ['Professional shoot', 'High-end editing', 'Sound design', 'Color grading'],
    color: 'text-primary border-primary/30 bg-primary/10',
  },
  {
    number: '05',
    icon: RefreshCw,
    title: 'Review & Refine',
    description: 'You review the final content. We refine until it is perfect - unlimited revisions included.',
    details: ['Preview delivery', 'Revision rounds', 'Final polishing', 'Caption/copy review'],
    color: 'text-secondary border-secondary/30 bg-secondary/10',
  },
  {
    number: '06',
    icon: Rocket,
    title: 'Content Goes Live',
    description: 'Content published at the optimal time for maximum reach and engagement across platforms.',
    details: ['Scheduled publishing', 'Cross-platform posting', 'Community engagement', 'Hashtag optimization'],
    color: 'text-accent border-accent/30 bg-accent/10',
  },
  {
    number: '07',
    icon: BarChart3,
    title: 'Campaign Report',
    description: 'Detailed 30-day performance report with analytics, insights, and recommendations for future campaigns.',
    details: ['Reach & impressions', 'Engagement analytics', 'Audience insights', 'ROI calculation'],
    color: 'text-primary border-primary/30 bg-primary/10',
  },
]

export function CollabProcess() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [expandedStep, setExpandedStep] = useState<number | null>(null)

  return (
    <section className="py-16 sm:py-24 lg:py-32 relative overflow-hidden">
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
            How It Works
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mt-2 mb-4">
            The Collab
            <span className="gradient-text"> Process</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            A transparent, professional workflow designed for smooth collaboration.
            Click on each step to see the details.
          </p>
        </motion.div>

        {/* Process steps */}
        <div className="max-w-3xl mx-auto space-y-4">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <button
                onClick={() => setExpandedStep(expandedStep === index ? null : index)}
                className="w-full text-left"
              >
                <div className={`glass rounded-xl border border-border/50 p-6 hover:border-primary/30 transition-all duration-300 ${
                  expandedStep === index ? 'border-primary/50' : ''
                }`}>
                  <div className="flex items-center gap-4">
                    {/* Step number and icon */}
                    <div className={`shrink-0 w-12 h-12 rounded-xl border ${step.color} flex items-center justify-center`}>
                      <step.icon className="h-5 w-5" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-mono text-primary tracking-wider">{step.number}</span>
                        <h3 className="text-lg font-semibold text-foreground">{step.title}</h3>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{step.description}</p>
                    </div>

                    {/* Expand indicator */}
                    <div className={`shrink-0 w-6 h-6 rounded-full border border-border flex items-center justify-center transition-transform duration-300 ${
                      expandedStep === index ? 'rotate-45' : ''
                    }`}>
                      <span className="text-muted-foreground text-sm">+</span>
                    </div>
                  </div>

                  {/* Expanded details */}
                  <AnimatePresence>
                    {expandedStep === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 pt-4 border-t border-border/30">
                          {step.details.map((detail) => (
                            <div key={detail} className="flex items-center gap-2 text-sm">
                              <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                              <span className="text-muted-foreground">{detail}</span>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </button>

              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="flex justify-center py-1">
                  <div className="w-px h-4 bg-gradient-to-b from-primary/30 to-transparent" />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
