"use client"

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Navbar } from '@/components/navigation/navbar'
import { Footer } from '@/components/footer/footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { 
  Sparkles, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  Video, 
  Film, 
  ImageIcon, 
  Radio, 
  Star, 
  Package,
  Target,
  TrendingUp,
  Users,
  Zap
} from 'lucide-react'
import Link from 'next/link'

interface QuizAnswer {
  budget: string
  productType: string
  goal: string
  timeline: string
  platforms: string[]
}

const STEPS = [
  { id: 'budget', title: 'Budget', question: 'Aapka approximate budget kya hai?' },
  { id: 'productType', title: 'Product', question: 'Aap kis type ka product promote karna chahte ho?' },
  { id: 'goal', title: 'Goal', question: 'Aapka primary goal kya hai?' },
  { id: 'timeline', title: 'Timeline', question: 'Campaign kab launch karna hai?' },
  { id: 'platforms', title: 'Platforms', question: 'Kaun se platforms pe focus karna hai?' },
]

const BUDGET_OPTIONS = [
  { value: 'starter', label: 'Under ₹15,000', desc: 'Perfect for testing waters' },
  { value: 'growth', label: '₹15,000 - ₹50,000', desc: 'Most popular choice' },
  { value: 'premium', label: '₹50,000 - ₹1,00,000', desc: 'Full campaign coverage' },
  { value: 'enterprise', label: '₹1,00,000+', desc: 'Brand ambassador level' },
]

const PRODUCT_OPTIONS = [
  { value: 'tech', label: 'Tech / Gadgets', desc: 'Phones, laptops, accessories' },
  { value: 'lifestyle', label: 'Lifestyle', desc: 'Fashion, fitness, home' },
  { value: 'software', label: 'Software / Apps', desc: 'SaaS, mobile apps, tools' },
  { value: 'gaming', label: 'Gaming', desc: 'Consoles, accessories, games' },
  { value: 'other', label: 'Other', desc: 'Something unique' },
]

const GOAL_OPTIONS = [
  { value: 'awareness', label: 'Brand Awareness', desc: 'Get your name out there', icon: Users },
  { value: 'sales', label: 'Drive Sales', desc: 'Direct conversions', icon: TrendingUp },
  { value: 'launch', label: 'Product Launch', desc: 'Big reveal moment', icon: Zap },
  { value: 'engagement', label: 'Engagement', desc: 'Build community', icon: Target },
]

const TIMELINE_OPTIONS = [
  { value: 'urgent', label: 'This Week', desc: 'Rush delivery' },
  { value: 'soon', label: '2-4 Weeks', desc: 'Standard timeline' },
  { value: 'planned', label: '1-2 Months', desc: 'Well-planned campaign' },
  { value: 'flexible', label: 'Flexible', desc: 'No rush' },
]

const PLATFORM_OPTIONS = [
  { value: 'youtube', label: 'YouTube', desc: 'Long-form videos' },
  { value: 'instagram', label: 'Instagram', desc: 'Reels & Stories' },
  { value: 'all', label: 'All Platforms', desc: 'Maximum reach' },
]

function getRecommendation(answers: QuizAnswer) {
  const { budget, productType, goal, timeline } = answers
  
  // Recommendation logic based on answers
  if (budget === 'enterprise') {
    return {
      package: 'Brand Ambassador Program',
      price: '₹1,00,000+',
      icon: Star,
      color: 'from-yellow-500 to-amber-500',
      description: 'Long-term partnership with exclusive content, event appearances, and multi-platform coverage.',
      features: ['3-12 month exclusive deal', 'Multiple content pieces', 'Event appearances', 'Social media takeovers', 'Priority support'],
      cta: 'Discuss Partnership',
    }
  }
  
  if (budget === 'premium' || (budget === 'growth' && goal === 'launch')) {
    return {
      package: 'Mega Campaign Bundle',
      price: '₹75,000',
      icon: Package,
      color: 'from-primary to-cyan-500',
      description: 'Complete package with video, reel, live session, stories, and post - maximum exposure.',
      features: ['1 Dedicated Video', '1 Instagram Reel', '1 Live Session', '5 Stories', '1 Feed Post', 'All platforms coverage'],
      cta: 'Book Campaign',
    }
  }
  
  if (budget === 'growth') {
    if (goal === 'sales' || goal === 'awareness') {
      return {
        package: 'Growth Bundle',
        price: '₹40,000',
        icon: TrendingUp,
        color: 'from-green-500 to-emerald-500',
        description: 'Balanced package for serious growth - video + reel + stories + post.',
        features: ['1 YouTube Video', '1 Instagram Reel', '3 Stories', '1 Feed Post', 'Multi-platform reach'],
        cta: 'Get Started',
      }
    }
    return {
      package: 'Dedicated Sponsored Video',
      price: '₹25,000',
      icon: Video,
      color: 'from-red-500 to-orange-500',
      description: 'Full video focused on your brand - review, unboxing, or story format.',
      features: ['5-15 min video', 'Custom thumbnail', 'Multi-platform upload', 'Full creative control'],
      cta: 'Book Video',
    }
  }
  
  // Starter budget
  if (goal === 'engagement' || productType === 'lifestyle') {
    return {
      package: 'Instagram Reel Package',
      price: '₹8,000',
      icon: Film,
      color: 'from-pink-500 to-rose-500',
      description: '15-60 sec high-engagement reel with trending format and music.',
      features: ['Trending format', 'Music integration', 'Hashtag strategy', 'Explore page potential'],
      cta: 'Book Reel',
    }
  }
  
  return {
    package: 'Starter Bundle',
    price: '₹15,000',
    icon: ImageIcon,
    color: 'from-blue-500 to-cyan-500',
    description: 'Perfect for first-time collaborations - reel + stories + post combo.',
    features: ['1 Instagram Reel', '2 Stories', '1 Feed Post', 'Quick turnaround'],
    cta: 'Start Collab',
  }
}

export default function BrandMatchPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState<QuizAnswer>({
    budget: '',
    productType: '',
    goal: '',
    timeline: '',
    platforms: [],
  })
  const [showResult, setShowResult] = useState(false)
  const [brandName, setBrandName] = useState('')
  
  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      setShowResult(true)
    }
  }
  
  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }
  
  const canProceed = () => {
    const step = STEPS[currentStep]
    if (step.id === 'platforms') {
      return answers.platforms.length > 0
    }
    return answers[step.id as keyof QuizAnswer] !== ''
  }
  
  const recommendation = getRecommendation(answers)
  const RecommendIcon = recommendation.icon
  
  return (
    <main className="relative min-h-screen">
      <Navbar />
      
      <section className="pt-28 sm:pt-32 pb-20 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-4">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              <span className="text-xs font-semibold text-primary tracking-wide">AI BRAND MATCH</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              Find Your <span className="gradient-text">Perfect Package</span>
            </h1>
            <p className="text-muted-foreground">
              Answer 5 quick questions and we will recommend the best collaboration package for your brand.
            </p>
          </div>
          
          <AnimatePresence mode="wait">
            {!showResult ? (
              <motion.div
                key={`step-${currentStep}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="glass border-border/50">
                  <CardHeader>
                    {/* Progress */}
                    <div className="flex gap-1 mb-4">
                      {STEPS.map((_, i) => (
                        <div
                          key={i}
                          className={`h-1 flex-1 rounded-full transition-colors ${
                            i <= currentStep ? 'bg-primary' : 'bg-muted'
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground mb-1">
                      Step {currentStep + 1} of {STEPS.length}
                    </p>
                    <CardTitle className="text-xl">{STEPS[currentStep].question}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Step 0: Budget */}
                    {currentStep === 0 && (
                      <RadioGroup
                        value={answers.budget}
                        onValueChange={(v) => setAnswers({ ...answers, budget: v })}
                        className="grid gap-3"
                      >
                        {BUDGET_OPTIONS.map((opt) => (
                          <Label
                            key={opt.value}
                            className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all ${
                              answers.budget === opt.value
                                ? 'border-primary bg-primary/5'
                                : 'border-border/50 hover:border-border'
                            }`}
                          >
                            <RadioGroupItem value={opt.value} />
                            <div>
                              <p className="font-medium">{opt.label}</p>
                              <p className="text-sm text-muted-foreground">{opt.desc}</p>
                            </div>
                          </Label>
                        ))}
                      </RadioGroup>
                    )}
                    
                    {/* Step 1: Product Type */}
                    {currentStep === 1 && (
                      <RadioGroup
                        value={answers.productType}
                        onValueChange={(v) => setAnswers({ ...answers, productType: v })}
                        className="grid gap-3"
                      >
                        {PRODUCT_OPTIONS.map((opt) => (
                          <Label
                            key={opt.value}
                            className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all ${
                              answers.productType === opt.value
                                ? 'border-primary bg-primary/5'
                                : 'border-border/50 hover:border-border'
                            }`}
                          >
                            <RadioGroupItem value={opt.value} />
                            <div>
                              <p className="font-medium">{opt.label}</p>
                              <p className="text-sm text-muted-foreground">{opt.desc}</p>
                            </div>
                          </Label>
                        ))}
                      </RadioGroup>
                    )}
                    
                    {/* Step 2: Goal */}
                    {currentStep === 2 && (
                      <RadioGroup
                        value={answers.goal}
                        onValueChange={(v) => setAnswers({ ...answers, goal: v })}
                        className="grid sm:grid-cols-2 gap-3"
                      >
                        {GOAL_OPTIONS.map((opt) => {
                          const Icon = opt.icon
                          return (
                            <Label
                              key={opt.value}
                              className={`flex flex-col items-center gap-2 p-6 rounded-xl border cursor-pointer transition-all text-center ${
                                answers.goal === opt.value
                                  ? 'border-primary bg-primary/5'
                                  : 'border-border/50 hover:border-border'
                              }`}
                            >
                              <RadioGroupItem value={opt.value} className="sr-only" />
                              <Icon className={`h-8 w-8 ${answers.goal === opt.value ? 'text-primary' : 'text-muted-foreground'}`} />
                              <p className="font-medium">{opt.label}</p>
                              <p className="text-xs text-muted-foreground">{opt.desc}</p>
                            </Label>
                          )
                        })}
                      </RadioGroup>
                    )}
                    
                    {/* Step 3: Timeline */}
                    {currentStep === 3 && (
                      <RadioGroup
                        value={answers.timeline}
                        onValueChange={(v) => setAnswers({ ...answers, timeline: v })}
                        className="grid sm:grid-cols-2 gap-3"
                      >
                        {TIMELINE_OPTIONS.map((opt) => (
                          <Label
                            key={opt.value}
                            className={`flex flex-col items-center gap-1 p-4 rounded-xl border cursor-pointer transition-all text-center ${
                              answers.timeline === opt.value
                                ? 'border-primary bg-primary/5'
                                : 'border-border/50 hover:border-border'
                            }`}
                          >
                            <RadioGroupItem value={opt.value} className="sr-only" />
                            <p className="font-medium">{opt.label}</p>
                            <p className="text-xs text-muted-foreground">{opt.desc}</p>
                          </Label>
                        ))}
                      </RadioGroup>
                    )}
                    
                    {/* Step 4: Platforms */}
                    {currentStep === 4 && (
                      <div className="space-y-4">
                        <div className="grid gap-3">
                          {PLATFORM_OPTIONS.map((opt) => (
                            <Label
                              key={opt.value}
                              className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all ${
                                answers.platforms.includes(opt.value)
                                  ? 'border-primary bg-primary/5'
                                  : 'border-border/50 hover:border-border'
                              }`}
                              onClick={() => {
                                if (opt.value === 'all') {
                                  setAnswers({ ...answers, platforms: ['all'] })
                                } else {
                                  const newPlatforms = answers.platforms.includes(opt.value)
                                    ? answers.platforms.filter((p) => p !== opt.value)
                                    : [...answers.platforms.filter((p) => p !== 'all'), opt.value]
                                  setAnswers({ ...answers, platforms: newPlatforms })
                                }
                              }}
                            >
                              <div className={`h-5 w-5 rounded border flex items-center justify-center ${
                                answers.platforms.includes(opt.value) ? 'bg-primary border-primary' : 'border-muted-foreground'
                              }`}>
                                {answers.platforms.includes(opt.value) && (
                                  <CheckCircle2 className="h-4 w-4 text-primary-foreground" />
                                )}
                              </div>
                              <div>
                                <p className="font-medium">{opt.label}</p>
                                <p className="text-sm text-muted-foreground">{opt.desc}</p>
                              </div>
                            </Label>
                          ))}
                        </div>
                        
                        <div className="pt-4 border-t border-border/50">
                          <Label htmlFor="brandName" className="text-sm text-muted-foreground">
                            Brand Name (Optional)
                          </Label>
                          <Input
                            id="brandName"
                            placeholder="e.g., Xiaomi, boAt, OnePlus"
                            value={brandName}
                            onChange={(e) => setBrandName(e.target.value)}
                            className="mt-2"
                          />
                        </div>
                      </div>
                    )}
                    
                    {/* Navigation */}
                    <div className="flex justify-between pt-4">
                      <Button
                        variant="outline"
                        onClick={handleBack}
                        disabled={currentStep === 0}
                        className="gap-2"
                      >
                        <ArrowLeft className="h-4 w-4" />
                        Back
                      </Button>
                      <Button
                        onClick={handleNext}
                        disabled={!canProceed()}
                        className="gap-2"
                      >
                        {currentStep === STEPS.length - 1 ? 'See Recommendation' : 'Next'}
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ) : (
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="glass border-border/50 overflow-hidden">
                  <div className={`h-2 bg-gradient-to-r ${recommendation.color}`} />
                  <CardHeader className="text-center pb-4">
                    <div className={`mx-auto h-16 w-16 rounded-2xl bg-gradient-to-br ${recommendation.color} flex items-center justify-center mb-4`}>
                      <RecommendIcon className="h-8 w-8 text-white" />
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">Perfect Match for {brandName || 'Your Brand'}</p>
                    <CardTitle className="text-2xl sm:text-3xl">{recommendation.package}</CardTitle>
                    <p className="text-3xl font-bold text-primary mt-2">{recommendation.price}</p>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <p className="text-center text-muted-foreground">{recommendation.description}</p>
                    
                    <div className="bg-muted/30 rounded-xl p-4">
                      <p className="text-sm font-semibold mb-3">Package Includes:</p>
                      <ul className="space-y-2">
                        {recommendation.features.map((feature, i) => (
                          <li key={i} className="flex items-center gap-2 text-sm">
                            <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button asChild size="lg" className="flex-1 gap-2">
                        <Link href="#contact">
                          {recommendation.cta}
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button
                        variant="outline"
                        size="lg"
                        onClick={() => {
                          setShowResult(false)
                          setCurrentStep(0)
                          setAnswers({ budget: '', productType: '', goal: '', timeline: '', platforms: [] })
                          setBrandName('')
                        }}
                      >
                        Start Over
                      </Button>
                    </div>
                    
                    <p className="text-xs text-center text-muted-foreground">
                      Custom requirements? <Link href="#contact" className="text-primary hover:underline">Contact us</Link> for a tailored quote.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
      
      <Footer />
    </main>
  )
}
