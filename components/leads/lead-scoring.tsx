"use client"

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { 
  Sparkles, TrendingUp, Building2, DollarSign, Clock, 
  Target, CheckCircle2, AlertCircle, Zap, Filter,
  ArrowUpRight, ArrowDownRight, Minus
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface Lead {
  id: string
  name: string
  company: string
  email: string
  industry: string
  budget: 'low' | 'medium' | 'high' | 'enterprise'
  engagement: number // 0-100
  responseTime: number // hours
  previousCollabs: number
  socialFollowing: number
  score: number
  priority: 'hot' | 'warm' | 'cold'
  lastActivity: string
  signals: string[]
}

const SAMPLE_LEADS: Lead[] = [
  {
    id: '1',
    name: 'Rajesh Mehta',
    company: 'TechGadgets Pro',
    email: 'rajesh@techgadgets.pro',
    industry: 'Consumer Electronics',
    budget: 'enterprise',
    engagement: 95,
    responseTime: 2,
    previousCollabs: 3,
    socialFollowing: 500000,
    score: 94,
    priority: 'hot',
    lastActivity: '2 hours ago',
    signals: ['Opened proposal 5x', 'Visited pricing page', 'Downloaded media kit'],
  },
  {
    id: '2',
    name: 'Priya Sharma',
    company: 'AudioMax India',
    email: 'priya@audiomax.in',
    industry: 'Audio Equipment',
    budget: 'high',
    engagement: 82,
    responseTime: 8,
    previousCollabs: 1,
    socialFollowing: 250000,
    score: 78,
    priority: 'hot',
    lastActivity: '1 day ago',
    signals: ['Replied to email', 'Watched portfolio videos'],
  },
  {
    id: '3',
    name: 'Vikram Singh',
    company: 'SmartHome Co',
    email: 'vikram@smarthome.co',
    industry: 'Smart Home',
    budget: 'medium',
    engagement: 65,
    responseTime: 24,
    previousCollabs: 0,
    socialFollowing: 100000,
    score: 62,
    priority: 'warm',
    lastActivity: '3 days ago',
    signals: ['Filled contact form', 'Viewed 2 case studies'],
  },
  {
    id: '4',
    name: 'Anjali Desai',
    company: 'WearableTech',
    email: 'anjali@wearabletech.in',
    industry: 'Wearables',
    budget: 'high',
    engagement: 70,
    responseTime: 12,
    previousCollabs: 2,
    socialFollowing: 350000,
    score: 72,
    priority: 'warm',
    lastActivity: '2 days ago',
    signals: ['Scheduled but cancelled call', 'Active on Instagram'],
  },
  {
    id: '5',
    name: 'Rohit Kumar',
    company: 'BudgetPhones',
    email: 'rohit@budgetphones.com',
    industry: 'Smartphones',
    budget: 'low',
    engagement: 30,
    responseTime: 72,
    previousCollabs: 0,
    socialFollowing: 25000,
    score: 28,
    priority: 'cold',
    lastActivity: '2 weeks ago',
    signals: ['Single page visit'],
  },
]

const PRIORITY_STYLES = {
  hot: { bg: 'bg-red-500/20', text: 'text-red-500', border: 'border-red-500/30', icon: Zap },
  warm: { bg: 'bg-amber-500/20', text: 'text-amber-500', border: 'border-amber-500/30', icon: TrendingUp },
  cold: { bg: 'bg-blue-500/20', text: 'text-blue-500', border: 'border-blue-500/30', icon: Clock },
}

const BUDGET_LABELS = {
  low: { label: 'Under 25K', color: 'text-muted-foreground' },
  medium: { label: '25K - 75K', color: 'text-primary' },
  high: { label: '75K - 2L', color: 'text-accent' },
  enterprise: { label: '2L+', color: 'text-secondary' },
}

function calculateScoreBreakdown(lead: Lead) {
  return [
    { label: 'Budget Fit', score: lead.budget === 'enterprise' ? 30 : lead.budget === 'high' ? 25 : lead.budget === 'medium' ? 15 : 5, max: 30 },
    { label: 'Engagement', score: Math.round(lead.engagement * 0.25), max: 25 },
    { label: 'Response Speed', score: lead.responseTime < 12 ? 20 : lead.responseTime < 24 ? 15 : lead.responseTime < 48 ? 10 : 5, max: 20 },
    { label: 'Social Presence', score: lead.socialFollowing > 400000 ? 15 : lead.socialFollowing > 200000 ? 12 : lead.socialFollowing > 100000 ? 8 : 5, max: 15 },
    { label: 'Past Collabs', score: Math.min(lead.previousCollabs * 3, 10), max: 10 },
  ]
}

export function LeadScoring() {
  const [filter, setFilter] = useState<'all' | 'hot' | 'warm' | 'cold'>('all')
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)

  const filteredLeads = useMemo(() => {
    return filter === 'all' 
      ? SAMPLE_LEADS 
      : SAMPLE_LEADS.filter(l => l.priority === filter)
  }, [filter])

  const stats = useMemo(() => ({
    total: SAMPLE_LEADS.length,
    hot: SAMPLE_LEADS.filter(l => l.priority === 'hot').length,
    warm: SAMPLE_LEADS.filter(l => l.priority === 'warm').length,
    cold: SAMPLE_LEADS.filter(l => l.priority === 'cold').length,
    avgScore: Math.round(SAMPLE_LEADS.reduce((acc, l) => acc + l.score, 0) / SAMPLE_LEADS.length),
  }), [])

  return (
    <section className="py-16 sm:py-20 relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <span className="text-primary text-xs font-semibold tracking-wider uppercase">AI-Powered</span>
          <h2 className="text-3xl sm:text-4xl font-bold mt-2">
            Smart Lead <span className="gradient-text">Scoring</span>
          </h2>
          <p className="text-sm text-muted-foreground mt-2 max-w-xl mx-auto">
            AI automatically prioritizes leads based on budget, engagement, and conversion probability
          </p>
        </motion.div>

        {/* Stats Overview */}
        <div className="grid sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Leads', value: stats.total, icon: Target, color: 'text-foreground' },
            { label: 'Hot Leads', value: stats.hot, icon: Zap, color: 'text-red-500' },
            { label: 'Warm Leads', value: stats.warm, icon: TrendingUp, color: 'text-amber-500' },
            { label: 'Avg Score', value: stats.avgScore, icon: Sparkles, color: 'text-primary' },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="glass border-border/50">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-muted">
                    <stat.icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Leads List */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Prioritized Leads</h3>
              <Select value={filter} onValueChange={(v) => setFilter(v as typeof filter)}>
                <SelectTrigger className="w-32">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Leads</SelectItem>
                  <SelectItem value="hot">Hot Only</SelectItem>
                  <SelectItem value="warm">Warm Only</SelectItem>
                  <SelectItem value="cold">Cold Only</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              {filteredLeads.map((lead, index) => {
                const PriorityIcon = PRIORITY_STYLES[lead.priority].icon
                
                return (
                  <motion.div
                    key={lead.id}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card 
                      className={`glass border-border/50 hover:border-primary/50 transition-all cursor-pointer ${
                        selectedLead?.id === lead.id ? 'ring-1 ring-primary' : ''
                      }`}
                      onClick={() => setSelectedLead(lead)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start gap-4">
                          {/* Score Circle */}
                          <div className="relative w-14 h-14 flex-shrink-0">
                            <svg className="w-full h-full -rotate-90">
                              <circle
                                cx="28"
                                cy="28"
                                r="24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="4"
                                className="text-muted"
                              />
                              <circle
                                cx="28"
                                cy="28"
                                r="24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="4"
                                strokeDasharray={`${(lead.score / 100) * 150.8} 150.8`}
                                className={PRIORITY_STYLES[lead.priority].text}
                              />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                              <span className="text-sm font-bold">{lead.score}</span>
                            </div>
                          </div>

                          {/* Lead Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-semibold text-sm truncate">{lead.name}</h4>
                              <Badge className={`${PRIORITY_STYLES[lead.priority].bg} ${PRIORITY_STYLES[lead.priority].text} border-0 gap-1 text-[10px]`}>
                                <PriorityIcon className="h-3 w-3" />
                                {lead.priority.toUpperCase()}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground mb-2">
                              {lead.company} / {lead.industry}
                            </p>
                            <div className="flex flex-wrap gap-2">
                              <Badge variant="outline" className={`text-[10px] ${BUDGET_LABELS[lead.budget].color}`}>
                                <DollarSign className="h-2.5 w-2.5 mr-0.5" />
                                {BUDGET_LABELS[lead.budget].label}
                              </Badge>
                              <Badge variant="outline" className="text-[10px]">
                                <Building2 className="h-2.5 w-2.5 mr-0.5" />
                                {(lead.socialFollowing / 1000).toFixed(0)}K followers
                              </Badge>
                            </div>
                          </div>

                          {/* Activity */}
                          <div className="text-right">
                            <p className="text-[10px] text-muted-foreground">{lead.lastActivity}</p>
                            {lead.previousCollabs > 0 && (
                              <Badge variant="outline" className="mt-1 text-[10px] bg-accent/10 text-accent border-accent/30">
                                {lead.previousCollabs} past collabs
                              </Badge>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )
              })}
            </div>
          </div>

          {/* Lead Details */}
          <Card className="glass border-border/50 h-fit sticky top-24">
            <CardHeader>
              <CardTitle className="text-lg">
                {selectedLead ? 'Lead Details' : 'Select a Lead'}
              </CardTitle>
              <CardDescription>
                {selectedLead ? 'AI-generated insights' : 'Click on a lead to see details'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!selectedLead ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Sparkles className="h-12 w-12 mx-auto mb-3 opacity-30" />
                  <p className="text-sm">Select a lead to view AI insights</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Score Breakdown */}
                  <div>
                    <h4 className="font-semibold text-sm mb-3">Score Breakdown</h4>
                    <div className="space-y-3">
                      {calculateScoreBreakdown(selectedLead).map((item) => (
                        <div key={item.label}>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-muted-foreground">{item.label}</span>
                            <span className="font-semibold">{item.score}/{item.max}</span>
                          </div>
                          <Progress value={(item.score / item.max) * 100} className="h-1.5" />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Signals */}
                  <div>
                    <h4 className="font-semibold text-sm mb-3">Buying Signals</h4>
                    <div className="space-y-2">
                      {selectedLead.signals.map((signal, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs">
                          <CheckCircle2 className="h-3.5 w-3.5 text-accent" />
                          <span>{signal}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recommendation */}
                  <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="h-4 w-4 text-primary" />
                      <span className="font-semibold text-sm">AI Recommendation</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {selectedLead.priority === 'hot' 
                        ? 'High-value lead! Reach out within 24 hours with a personalized proposal.'
                        : selectedLead.priority === 'warm'
                        ? 'Good potential. Schedule a discovery call to understand their needs better.'
                        : 'Nurture with content. Add to newsletter and follow up in 2 weeks.'
                      }
                    </p>
                  </div>

                  <Button className="w-full gap-2">
                    Contact Lead
                    <ArrowUpRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
