"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  LayoutDashboard, FileVideo, MessageSquare, CreditCard, Settings,
  CheckCircle2, Clock, AlertCircle, Play, Download, Eye, TrendingUp,
  Upload, Send, Paperclip, Calendar, Bell, LogOut, ChevronRight,
  BarChart3, Users, ThumbsUp, Share2
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

// Demo data
const CLIENT = {
  name: 'Rajesh Kumar',
  company: 'TechGadgets India',
  email: 'rajesh@techgadgets.in',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
  plan: 'Growth Package',
  since: 'January 2024',
}

const PROJECTS = [
  {
    id: '1',
    title: 'Galaxy S24 Ultra Review',
    type: 'YouTube Video',
    status: 'in-review',
    progress: 85,
    dueDate: '2024-04-01',
    thumbnail: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=300&h=200&fit=crop',
    views: null,
    deliverables: [
      { name: 'Script Approval', status: 'completed' },
      { name: 'Raw Footage', status: 'completed' },
      { name: 'First Edit', status: 'completed' },
      { name: 'Final Review', status: 'in-progress' },
      { name: 'Publication', status: 'pending' },
    ],
  },
  {
    id: '2',
    title: 'TWS Earbuds Comparison',
    type: 'Instagram Reel',
    status: 'published',
    progress: 100,
    dueDate: '2024-03-15',
    thumbnail: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=300&h=200&fit=crop',
    views: 125000,
    likes: 8500,
    shares: 1200,
    deliverables: [
      { name: 'Script Approval', status: 'completed' },
      { name: 'Raw Footage', status: 'completed' },
      { name: 'First Edit', status: 'completed' },
      { name: 'Final Review', status: 'completed' },
      { name: 'Publication', status: 'completed' },
    ],
  },
  {
    id: '3',
    title: 'Smart Home Setup Guide',
    type: 'YouTube Video',
    status: 'in-production',
    progress: 45,
    dueDate: '2024-04-15',
    thumbnail: 'https://images.unsplash.com/photo-1558002038-1055907df827?w=300&h=200&fit=crop',
    views: null,
    deliverables: [
      { name: 'Script Approval', status: 'completed' },
      { name: 'Raw Footage', status: 'in-progress' },
      { name: 'First Edit', status: 'pending' },
      { name: 'Final Review', status: 'pending' },
      { name: 'Publication', status: 'pending' },
    ],
  },
]

const MESSAGES = [
  {
    id: '1',
    sender: 'TechVyro',
    avatar: '/images/techvyro-icon.jpg',
    message: 'Hi Rajesh! The first edit for S24 Ultra review is ready. Please check and share feedback.',
    time: '2 hours ago',
    isOwn: false,
  },
  {
    id: '2',
    sender: 'You',
    message: 'Looks great! Just a few minor tweaks needed on the camera section.',
    time: '1 hour ago',
    isOwn: true,
  },
  {
    id: '3',
    sender: 'TechVyro',
    avatar: '/images/techvyro-icon.jpg',
    message: 'Perfect, I\'ll make those changes and send the updated version by tomorrow.',
    time: '45 mins ago',
    isOwn: false,
  },
]

const STATS = [
  { label: 'Total Views', value: '2.4M', change: '+15%', icon: Eye },
  { label: 'Engagement', value: '8.5%', change: '+2.3%', icon: ThumbsUp },
  { label: 'Shares', value: '45K', change: '+28%', icon: Share2 },
  { label: 'New Followers', value: '12K', change: '+18%', icon: Users },
]

const STATUS_STYLES = {
  'in-production': { bg: 'bg-amber-500/20', text: 'text-amber-500', label: 'In Production' },
  'in-review': { bg: 'bg-primary/20', text: 'text-primary', label: 'In Review' },
  'published': { bg: 'bg-accent/20', text: 'text-accent', label: 'Published' },
  'pending': { bg: 'bg-muted', text: 'text-muted-foreground', label: 'Pending' },
  'completed': { bg: 'bg-accent/20', text: 'text-accent', label: 'Completed' },
  'in-progress': { bg: 'bg-primary/20', text: 'text-primary', label: 'In Progress' },
}

function formatNumber(num: number): string {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
  return num.toString()
}

export default function ClientPortal() {
  const [activeTab, setActiveTab] = useState('overview')
  const [selectedProject, setSelectedProject] = useState<typeof PROJECTS[0] | null>(null)
  const [newMessage, setNewMessage] = useState('')

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b border-border/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="font-bold text-xl gradient-text">TechVyro</div>
              <Badge variant="outline" className="text-xs">Client Portal</Badge>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-secondary rounded-full text-[10px] flex items-center justify-center">
                  3
                </span>
              </Button>
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={CLIENT.avatar} />
                  <AvatarFallback>{CLIENT.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div className="hidden sm:block">
                  <p className="text-sm font-semibold">{CLIENT.name}</p>
                  <p className="text-[10px] text-muted-foreground">{CLIENT.company}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="glass border-border/50">
            <TabsTrigger value="overview" className="gap-2">
              <LayoutDashboard className="h-4 w-4" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="projects" className="gap-2">
              <FileVideo className="h-4 w-4" />
              <span className="hidden sm:inline">Projects</span>
            </TabsTrigger>
            <TabsTrigger value="messages" className="gap-2">
              <MessageSquare className="h-4 w-4" />
              <span className="hidden sm:inline">Messages</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="gap-2">
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Analytics</span>
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Welcome */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="glass border-border/50 bg-gradient-to-r from-primary/10 to-secondary/10">
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <h1 className="text-2xl font-bold mb-1">Welcome back, {CLIENT.name.split(' ')[0]}!</h1>
                      <p className="text-muted-foreground">
                        You have {PROJECTS.filter(p => p.status !== 'published').length} active projects
                      </p>
                    </div>
                    <Button className="gap-2">
                      <Calendar className="h-4 w-4" />
                      Schedule Call
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Stats */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {STATS.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="glass border-border/50">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <stat.icon className="h-5 w-5 text-primary" />
                        <Badge variant="outline" className="text-accent border-accent/30 text-[10px]">
                          {stat.change}
                        </Badge>
                      </div>
                      <p className="text-2xl font-bold">{stat.value}</p>
                      <p className="text-xs text-muted-foreground">{stat.label}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Active Projects */}
            <Card className="glass border-border/50">
              <CardHeader>
                <CardTitle className="text-lg">Active Projects</CardTitle>
                <CardDescription>Your current collaborations with TechVyro</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {PROJECTS.filter(p => p.status !== 'published').map((project) => (
                    <div
                      key={project.id}
                      className="flex items-center gap-4 p-3 rounded-lg border border-border/50 hover:border-primary/50 transition-all cursor-pointer"
                      onClick={() => setSelectedProject(project)}
                    >
                      <img
                        src={project.thumbnail}
                        alt={project.title}
                        className="w-20 h-14 object-cover rounded-lg"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-sm truncate">{project.title}</h3>
                          <Badge className={`${STATUS_STYLES[project.status].bg} ${STATUS_STYLES[project.status].text} border-0 text-[10px]`}>
                            {STATUS_STYLES[project.status].label}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mb-2">{project.type}</p>
                        <div className="flex items-center gap-2">
                          <Progress value={project.progress} className="flex-1 h-1.5" />
                          <span className="text-xs font-semibold">{project.progress}%</span>
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Projects Tab */}
          <TabsContent value="projects" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              {PROJECTS.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="glass border-border/50 hover:border-primary/40 transition-all overflow-hidden">
                    <div className="relative aspect-video">
                      <img
                        src={project.thumbnail}
                        alt={project.title}
                        className="w-full h-full object-cover"
                      />
                      <Badge className={`absolute top-2 right-2 ${STATUS_STYLES[project.status].bg} ${STATUS_STYLES[project.status].text} border-0`}>
                        {STATUS_STYLES[project.status].label}
                      </Badge>
                      {project.status === 'published' && project.views && (
                        <div className="absolute bottom-2 left-2 flex items-center gap-2 text-white text-xs">
                          <span className="flex items-center gap-1 bg-black/60 px-2 py-0.5 rounded">
                            <Eye className="h-3 w-3" />
                            {formatNumber(project.views)}
                          </span>
                        </div>
                      )}
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-bold text-sm mb-1">{project.title}</h3>
                      <p className="text-xs text-muted-foreground mb-3">{project.type}</p>
                      
                      <div className="space-y-2 mb-4">
                        {project.deliverables.map((d, i) => (
                          <div key={i} className="flex items-center gap-2 text-xs">
                            {d.status === 'completed' ? (
                              <CheckCircle2 className="h-3.5 w-3.5 text-accent" />
                            ) : d.status === 'in-progress' ? (
                              <Clock className="h-3.5 w-3.5 text-primary animate-pulse" />
                            ) : (
                              <div className="h-3.5 w-3.5 rounded-full border border-muted-foreground" />
                            )}
                            <span className={d.status === 'pending' ? 'text-muted-foreground' : ''}>
                              {d.name}
                            </span>
                          </div>
                        ))}
                      </div>
                      
                      <div className="flex items-center justify-between pt-3 border-t border-border/30">
                        <span className="text-[10px] text-muted-foreground">
                          Due: {new Date(project.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </span>
                        <Button size="sm" variant="ghost" className="h-7 text-xs gap-1">
                          {project.status === 'published' ? (
                            <>
                              <Play className="h-3 w-3" />
                              Watch
                            </>
                          ) : (
                            <>
                              <Eye className="h-3 w-3" />
                              Preview
                            </>
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* Messages Tab */}
          <TabsContent value="messages" className="space-y-6">
            <Card className="glass border-border/50">
              <CardHeader>
                <CardTitle className="text-lg">Direct Messages</CardTitle>
                <CardDescription>Chat with TechVyro about your projects</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px] flex flex-col">
                  <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                    {MESSAGES.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex gap-3 ${msg.isOwn ? 'flex-row-reverse' : ''}`}
                      >
                        {!msg.isOwn && (
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={msg.avatar} />
                            <AvatarFallback>TV</AvatarFallback>
                          </Avatar>
                        )}
                        <div className={`max-w-[70%] ${msg.isOwn ? 'text-right' : ''}`}>
                          <div className={`inline-block p-3 rounded-lg ${
                            msg.isOwn 
                              ? 'bg-primary text-primary-foreground' 
                              : 'bg-muted'
                          }`}>
                            <p className="text-sm">{msg.message}</p>
                          </div>
                          <p className="text-[10px] text-muted-foreground mt-1">{msg.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex gap-2 pt-4 border-t border-border/30">
                    <Button variant="ghost" size="icon" className="flex-shrink-0">
                      <Paperclip className="h-4 w-4" />
                    </Button>
                    <Input
                      placeholder="Type your message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      className="flex-1"
                    />
                    <Button size="icon" className="flex-shrink-0">
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="glass border-border/50">
                <CardHeader>
                  <CardTitle className="text-lg">Performance Overview</CardTitle>
                  <CardDescription>How your content is performing</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {PROJECTS.filter(p => p.status === 'published').map((project) => (
                      <div key={project.id} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{project.title}</span>
                          <span className="text-sm text-primary">{formatNumber(project.views || 0)} views</span>
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-center">
                          <div>
                            <p className="text-lg font-bold">{formatNumber(project.views || 0)}</p>
                            <p className="text-[10px] text-muted-foreground">Views</p>
                          </div>
                          <div>
                            <p className="text-lg font-bold">{formatNumber(project.likes || 0)}</p>
                            <p className="text-[10px] text-muted-foreground">Likes</p>
                          </div>
                          <div>
                            <p className="text-lg font-bold">{formatNumber(project.shares || 0)}</p>
                            <p className="text-[10px] text-muted-foreground">Shares</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="glass border-border/50">
                <CardHeader>
                  <CardTitle className="text-lg">Download Reports</CardTitle>
                  <CardDescription>Get detailed analytics reports</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {['Monthly Performance Report', 'Audience Insights', 'ROI Analysis', 'Engagement Breakdown'].map((report) => (
                      <div
                        key={report}
                        className="flex items-center justify-between p-3 rounded-lg border border-border/50 hover:border-primary/50 transition-all"
                      >
                        <span className="text-sm">{report}</span>
                        <Button variant="ghost" size="sm" className="gap-1">
                          <Download className="h-4 w-4" />
                          PDF
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
