"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Gift, Copy, Check, Users, IndianRupee, Share2, 
  ArrowRight, Sparkles, Trophy, Medal, Crown
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'

const TIERS = [
  { 
    name: 'Bronze', 
    icon: Medal, 
    referrals: 1, 
    reward: '5% Discount',
    color: 'from-amber-600 to-amber-800',
  },
  { 
    name: 'Silver', 
    icon: Medal, 
    referrals: 3, 
    reward: '10% Discount + Priority',
    color: 'from-gray-300 to-gray-500',
  },
  { 
    name: 'Gold', 
    icon: Trophy, 
    referrals: 5, 
    reward: '15% Discount + Free Reel',
    color: 'from-yellow-400 to-yellow-600',
  },
  { 
    name: 'Platinum', 
    icon: Crown, 
    referrals: 10, 
    reward: '20% Lifetime + VIP Access',
    color: 'from-primary to-secondary',
  },
]

const REFERRAL_STATS = {
  totalReferrals: 7,
  pendingReferrals: 2,
  earnings: 45000,
  currentTier: 'Gold',
  nextTier: 'Platinum',
  referralsToNext: 3,
}

const RECENT_REFERRALS = [
  { name: 'Amit Sharma', company: 'AudioMax', status: 'converted', reward: 15000, date: '2024-03-10' },
  { name: 'Neha Gupta', company: 'TechWorld', status: 'converted', reward: 12000, date: '2024-03-05' },
  { name: 'Vikram Singh', company: 'GadgetZone', status: 'pending', reward: null, date: '2024-03-15' },
  { name: 'Priya Patel', company: 'SmartLife', status: 'pending', reward: null, date: '2024-03-18' },
]

export function ReferralSection() {
  const [copied, setCopied] = useState(false)
  const referralCode = 'TECHVYRO-PARTNER-2024'
  const referralLink = `https://techvyro.com/collab?ref=${referralCode}`

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const currentTierIndex = TIERS.findIndex(t => t.name === REFERRAL_STATS.currentTier)
  const progressToNext = ((REFERRAL_STATS.totalReferrals - TIERS[currentTierIndex].referrals) / 
    (TIERS[currentTierIndex + 1]?.referrals - TIERS[currentTierIndex].referrals || 1)) * 100

  return (
    <section className="py-16 sm:py-20 relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <span className="text-primary text-xs font-semibold tracking-wider uppercase">Partner Program</span>
          <h2 className="text-3xl sm:text-4xl font-bold mt-2">
            Refer & <span className="gradient-text">Earn</span>
          </h2>
          <p className="text-sm text-muted-foreground mt-2 max-w-xl mx-auto">
            Refer brands to TechVyro and earn rewards on every successful collaboration
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Referral Code Card */}
          <Card className="lg:col-span-2 glass border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Gift className="h-5 w-5 text-primary" />
                Your Referral Link
              </CardTitle>
              <CardDescription>
                Share this link with brands. When they collaborate, you earn!
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={referralLink}
                  readOnly
                  className="font-mono text-sm"
                />
                <Button
                  onClick={() => copyToClipboard(referralLink)}
                  className="gap-2 shrink-0"
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  {copied ? 'Copied!' : 'Copy'}
                </Button>
              </div>

              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" className="gap-2">
                  <Share2 className="h-4 w-4" />
                  Share on Twitter
                </Button>
                <Button variant="outline" size="sm" className="gap-2">
                  <Share2 className="h-4 w-4" />
                  Share on LinkedIn
                </Button>
                <Button variant="outline" size="sm" className="gap-2">
                  <Share2 className="h-4 w-4" />
                  WhatsApp
                </Button>
              </div>

              {/* Tiers */}
              <div className="pt-4 border-t border-border/30">
                <h4 className="font-semibold text-sm mb-4">Reward Tiers</h4>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {TIERS.map((tier, index) => {
                    const isActive = tier.name === REFERRAL_STATS.currentTier
                    const isUnlocked = index <= currentTierIndex
                    
                    return (
                      <motion.div
                        key={tier.name}
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                        className={`relative p-3 rounded-lg border transition-all ${
                          isActive 
                            ? 'border-primary bg-primary/10 ring-1 ring-primary' 
                            : isUnlocked 
                              ? 'border-accent/50 bg-accent/5' 
                              : 'border-border/50 opacity-60'
                        }`}
                      >
                        {isActive && (
                          <Badge className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-[10px]">
                            Current
                          </Badge>
                        )}
                        <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${tier.color} flex items-center justify-center mb-2`}>
                          <tier.icon className="h-5 w-5 text-white" />
                        </div>
                        <p className="font-bold text-sm">{tier.name}</p>
                        <p className="text-[10px] text-muted-foreground mb-1">{tier.referrals}+ referrals</p>
                        <p className="text-xs text-primary">{tier.reward}</p>
                      </motion.div>
                    )
                  })}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats Card */}
          <div className="space-y-4">
            <Card className="glass border-border/50">
              <CardContent className="p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${TIERS[currentTierIndex].color} flex items-center justify-center`}>
                    {(() => {
                      const TierIcon = TIERS[currentTierIndex].icon
                      return <TierIcon className="h-6 w-6 text-white" />
                    })()}
                  </div>
                  <div>
                    <p className="font-bold">{REFERRAL_STATS.currentTier} Partner</p>
                    <p className="text-xs text-muted-foreground">
                      {REFERRAL_STATS.referralsToNext} more to {REFERRAL_STATS.nextTier}
                    </p>
                  </div>
                </div>
                <Progress value={progressToNext} className="h-2 mb-4" />
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 rounded-lg bg-muted/50">
                    <Users className="h-5 w-5 mx-auto mb-1 text-primary" />
                    <p className="text-xl font-bold">{REFERRAL_STATS.totalReferrals}</p>
                    <p className="text-[10px] text-muted-foreground">Total Referrals</p>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-muted/50">
                    <IndianRupee className="h-5 w-5 mx-auto mb-1 text-accent" />
                    <p className="text-xl font-bold">{(REFERRAL_STATS.earnings / 1000).toFixed(0)}K</p>
                    <p className="text-[10px] text-muted-foreground">Total Earnings</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass border-border/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Recent Referrals</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {RECENT_REFERRALS.slice(0, 3).map((ref, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 rounded-lg bg-muted/30"
                  >
                    <div>
                      <p className="text-sm font-medium">{ref.name}</p>
                      <p className="text-[10px] text-muted-foreground">{ref.company}</p>
                    </div>
                    <Badge 
                      variant="outline" 
                      className={ref.status === 'converted' 
                        ? 'bg-accent/20 text-accent border-accent/30' 
                        : 'bg-amber-500/20 text-amber-500 border-amber-500/30'
                      }
                    >
                      {ref.status === 'converted' ? `+${(ref.reward! / 1000).toFixed(0)}K` : 'Pending'}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
