"use client"

import { useEffect, useState, useRef } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { 
  Trophy, Award, Target, Zap, Star, Users, Eye, Heart, 
  TrendingUp, Youtube, Instagram, Play, CheckCircle2, Crown,
  Sparkles, Medal
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface Achievement {
  id: string
  icon: React.ReactNode
  title: string
  description: string
  value: number
  suffix: string
  color: 'cyan' | 'magenta' | 'lime' | 'amber'
  unlocked: boolean
  unlockedDate?: string
}

interface Milestone {
  id: string
  icon: React.ReactNode
  title: string
  target: number
  current: number
  suffix: string
  color: 'cyan' | 'magenta' | 'lime'
}

const ACHIEVEMENTS: Achievement[] = [
  {
    id: '1m-views',
    icon: <Eye className="h-6 w-6" />,
    title: '1 Million Views',
    description: 'First video to hit 1M views',
    value: 1000000,
    suffix: '',
    color: 'cyan',
    unlocked: true,
    unlockedDate: 'March 2023',
  },
  {
    id: '100k-subs',
    icon: <Users className="h-6 w-6" />,
    title: '100K Subscribers',
    description: 'YouTube Silver Play Button earned',
    value: 100000,
    suffix: '',
    color: 'magenta',
    unlocked: true,
    unlockedDate: 'August 2023',
  },
  {
    id: '50-brands',
    icon: <Trophy className="h-6 w-6" />,
    title: '50 Brand Collaborations',
    description: 'Worked with 50+ top tech brands',
    value: 50,
    suffix: '+',
    color: 'lime',
    unlocked: true,
    unlockedDate: 'January 2024',
  },
  {
    id: '10m-reach',
    icon: <TrendingUp className="h-6 w-6" />,
    title: '10M Monthly Reach',
    description: 'Cross-platform monthly impressions',
    value: 10000000,
    suffix: '',
    color: 'amber',
    unlocked: true,
    unlockedDate: 'June 2024',
  },
  {
    id: 'viral-master',
    icon: <Zap className="h-6 w-6" />,
    title: 'Viral Master',
    description: '5 videos with 500K+ views',
    value: 5,
    suffix: '',
    color: 'cyan',
    unlocked: true,
    unlockedDate: 'September 2024',
  },
  {
    id: 'engagement-king',
    icon: <Heart className="h-6 w-6" />,
    title: 'Engagement King',
    description: 'Maintained 8%+ engagement rate',
    value: 8,
    suffix: '%',
    color: 'magenta',
    unlocked: true,
    unlockedDate: 'October 2024',
  },
]

const MILESTONES: Milestone[] = [
  {
    id: 'yt-500k',
    icon: <Youtube className="h-5 w-5" />,
    title: '500K YouTube Subscribers',
    target: 500000,
    current: 350000,
    suffix: '',
    color: 'cyan',
  },
  {
    id: 'ig-1m',
    icon: <Instagram className="h-5 w-5" />,
    title: '1M Instagram Followers',
    target: 1000000,
    current: 680000,
    suffix: '',
    color: 'magenta',
  },
  {
    id: 'views-100m',
    icon: <Play className="h-5 w-5" />,
    title: '100M Total Views',
    target: 100000000,
    current: 78000000,
    suffix: '',
    color: 'lime',
  },
]

function AnimatedCounter({ 
  value, 
  suffix = '', 
  duration = 2000 
}: { 
  value: number
  suffix?: string
  duration?: number 
}) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true })

  useEffect(() => {
    if (!isInView) return

    const startTime = Date.now()
    const endValue = value

    const tick = () => {
      const now = Date.now()
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      
      // Easing function
      const easeOut = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(easeOut * endValue))

      if (progress < 1) {
        requestAnimationFrame(tick)
      }
    }

    requestAnimationFrame(tick)
  }, [isInView, value, duration])

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M'
    } else if (num >= 1000) {
      return (num / 1000).toFixed(0) + 'K'
    }
    return num.toString()
  }

  return (
    <span ref={ref} className="tabular-nums">
      {formatNumber(count)}{suffix}
    </span>
  )
}

function AchievementCard({ achievement, index }: { achievement: Achievement; index: number }) {
  const [showCelebration, setShowCelebration] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true })

  useEffect(() => {
    if (isInView && achievement.unlocked) {
      const timeout = setTimeout(() => setShowCelebration(true), index * 200 + 500)
      return () => clearTimeout(timeout)
    }
  }, [isInView, achievement.unlocked, index])

  const colorClasses = {
    cyan: 'from-primary to-primary/50 neon-glow-cyan',
    magenta: 'from-secondary to-secondary/50 neon-glow-magenta',
    lime: 'from-accent to-accent/50 neon-glow-lime',
    amber: 'from-amber-500 to-amber-500/50',
  }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
    >
      <Card className={`relative overflow-hidden glass border-border/50 hover:border-primary/40 transition-all group ${
        achievement.unlocked ? '' : 'opacity-50 grayscale'
      }`}>
        <CardContent className="p-5">
          {/* Celebration particles */}
          <AnimatePresence>
            {showCelebration && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 pointer-events-none"
              >
                {[...Array(8)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ 
                      x: '50%', 
                      y: '50%', 
                      scale: 0,
                      opacity: 1 
                    }}
                    animate={{
                      x: `${50 + (Math.random() - 0.5) * 100}%`,
                      y: `${50 + (Math.random() - 0.5) * 100}%`,
                      scale: [0, 1, 0],
                      opacity: [1, 1, 0],
                    }}
                    transition={{ 
                      duration: 0.8,
                      delay: i * 0.05,
                    }}
                    className={`absolute w-2 h-2 rounded-full ${
                      achievement.color === 'cyan' ? 'bg-primary' :
                      achievement.color === 'magenta' ? 'bg-secondary' :
                      achievement.color === 'lime' ? 'bg-accent' : 'bg-amber-500'
                    }`}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex items-start gap-4">
            <div className={`p-3 rounded-xl bg-gradient-to-br ${colorClasses[achievement.color]} flex-shrink-0`}>
              <div className="text-white">
                {achievement.icon}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-bold text-sm truncate">{achievement.title}</h3>
                {achievement.unlocked && (
                  <CheckCircle2 className="h-4 w-4 text-accent flex-shrink-0" />
                )}
              </div>
              <p className="text-xs text-muted-foreground mb-2">{achievement.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold gradient-text">
                  <AnimatedCounter value={achievement.value} suffix={achievement.suffix} />
                </span>
                {achievement.unlockedDate && (
                  <Badge variant="outline" className="text-[10px] border-border/50">
                    {achievement.unlockedDate}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

function MilestoneProgress({ milestone, index }: { milestone: Milestone; index: number }) {
  const progress = (milestone.current / milestone.target) * 100

  const colorClasses = {
    cyan: 'bg-primary',
    magenta: 'bg-secondary',
    lime: 'bg-accent',
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M'
    } else if (num >= 1000) {
      return (num / 1000).toFixed(0) + 'K'
    }
    return num.toString()
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.15 }}
      className="glass rounded-xl p-4 border border-border/50"
    >
      <div className="flex items-center gap-3 mb-3">
        <div className={`p-2 rounded-lg ${colorClasses[milestone.color]} text-white`}>
          {milestone.icon}
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-sm">{milestone.title}</h4>
          <p className="text-xs text-muted-foreground">
            {formatNumber(milestone.current)} / {formatNumber(milestone.target)}
          </p>
        </div>
        <span className="text-lg font-bold gradient-text">{progress.toFixed(0)}%</span>
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${progress}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: index * 0.15 + 0.3 }}
          className={`h-full ${colorClasses[milestone.color]} rounded-full`}
        />
      </div>
    </motion.div>
  )
}

export function AchievementsSection() {
  return (
    <section className="py-16 sm:py-20 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-0 w-64 h-64 bg-secondary/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <span className="text-primary text-xs font-semibold tracking-wider uppercase">Hall of Fame</span>
          <h2 className="text-3xl sm:text-4xl font-bold mt-2">
            Achievements <span className="gradient-text">Unlocked</span>
          </h2>
          <p className="text-sm text-muted-foreground mt-2 max-w-xl mx-auto">
            Milestones hit, badges earned, and goals crushed
          </p>
        </motion.div>

        {/* Achievements Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
          {ACHIEVEMENTS.map((achievement, index) => (
            <AchievementCard key={achievement.id} achievement={achievement} index={index} />
          ))}
        </div>

        {/* Next Milestones */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12"
        >
          <div className="flex items-center gap-2 mb-6">
            <Target className="h-5 w-5 text-secondary" />
            <h3 className="text-xl font-bold">Next Milestones</h3>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {MILESTONES.map((milestone, index) => (
              <MilestoneProgress key={milestone.id} milestone={milestone} index={index} />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
