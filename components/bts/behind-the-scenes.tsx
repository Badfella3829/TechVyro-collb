"use client"

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Camera, Video, Lightbulb, Clapperboard, Play, Clock,
  Eye, Heart, MessageCircle, Share2, ChevronRight, X
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent } from '@/components/ui/dialog'

interface BTSPost {
  id: string
  title: string
  description: string
  thumbnail: string
  type: 'photo' | 'video' | 'blog'
  category: 'setup' | 'process' | 'equipment' | 'day-in-life'
  date: string
  readTime?: string
  views: number
  likes: number
  content?: string
  images?: string[]
  videoUrl?: string
}

const CATEGORIES = {
  setup: { label: 'Studio Setup', icon: Camera, color: 'bg-primary' },
  process: { label: 'Creation Process', icon: Clapperboard, color: 'bg-secondary' },
  equipment: { label: 'My Gear', icon: Lightbulb, color: 'bg-accent' },
  'day-in-life': { label: 'Day in Life', icon: Clock, color: 'bg-amber-500' },
}

const BTS_POSTS: BTSPost[] = [
  {
    id: '1',
    title: 'My 2024 Studio Setup Tour',
    description: 'Complete walkthrough of my upgraded home studio with 4K recording capabilities.',
    thumbnail: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=600&h=400&fit=crop',
    type: 'video',
    category: 'setup',
    date: '2024-03-15',
    views: 125000,
    likes: 8500,
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
  },
  {
    id: '2',
    title: 'How I Edit My Tech Reviews',
    description: 'My complete editing workflow from raw footage to final upload. Tools, plugins, and tips.',
    thumbnail: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=600&h=400&fit=crop',
    type: 'blog',
    category: 'process',
    date: '2024-03-10',
    readTime: '8 min read',
    views: 45000,
    likes: 3200,
    content: `
      <h3>The Editing Process</h3>
      <p>Every video I create goes through a meticulous editing process. Here's my complete workflow:</p>
      
      <h4>1. Importing & Organization</h4>
      <p>First, I import all raw footage into DaVinci Resolve and organize clips by scene. Color-coded bins help me stay organized during long editing sessions.</p>
      
      <h4>2. Rough Cut</h4>
      <p>I start with a rough cut, focusing on storytelling flow rather than perfection. This stage is about getting the narrative right.</p>
      
      <h4>3. Fine Editing</h4>
      <p>Here's where the magic happens - precise cuts, B-roll integration, and pacing adjustments.</p>
      
      <h4>4. Color Grading</h4>
      <p>I use custom LUTs that I've developed over years to give my videos that signature TechVyro look.</p>
      
      <h4>5. Sound Design</h4>
      <p>Background music, sound effects, and audio leveling. Good audio is 50% of a great video.</p>
    `,
  },
  {
    id: '3',
    title: 'Camera Gear I Use in 2024',
    description: 'From main camera to lighting - every piece of equipment in my kit.',
    thumbnail: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&h=400&fit=crop',
    type: 'photo',
    category: 'equipment',
    date: '2024-03-05',
    views: 89000,
    likes: 5600,
    images: [
      'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1502982720700-bfff97f2ecac?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1617005082133-548c4dd27f35?w=800&h=600&fit=crop',
    ],
  },
  {
    id: '4',
    title: 'A Day Shooting with Samsung',
    description: 'Behind the scenes of my Galaxy S24 Ultra collaboration shoot.',
    thumbnail: 'https://images.unsplash.com/photo-1605236453806-6ff36851218e?w=600&h=400&fit=crop',
    type: 'video',
    category: 'day-in-life',
    date: '2024-02-28',
    views: 230000,
    likes: 15000,
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
  },
  {
    id: '5',
    title: 'Lighting Setup for Product Shots',
    description: 'How I achieve that clean, professional look for product photography.',
    thumbnail: 'https://images.unsplash.com/photo-1542744094-24638eff58bb?w=600&h=400&fit=crop',
    type: 'blog',
    category: 'setup',
    date: '2024-02-20',
    readTime: '5 min read',
    views: 67000,
    likes: 4100,
    content: `
      <h3>Perfect Product Lighting</h3>
      <p>Getting that perfect product shot requires careful attention to lighting. Here's my setup:</p>
      
      <h4>Key Light</h4>
      <p>I use a large softbox at 45 degrees to create soft, even lighting on the product.</p>
      
      <h4>Fill Light</h4>
      <p>A reflector on the opposite side fills in shadows without adding harsh secondary light.</p>
      
      <h4>Background Light</h4>
      <p>LED strips behind the product create that subtle glow effect you see in my shots.</p>
    `,
  },
  {
    id: '6',
    title: 'My Content Planning System',
    description: 'Tools and workflows I use to plan content weeks in advance.',
    thumbnail: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=600&h=400&fit=crop',
    type: 'blog',
    category: 'process',
    date: '2024-02-15',
    readTime: '6 min read',
    views: 38000,
    likes: 2800,
    content: `
      <h3>Content Planning Like a Pro</h3>
      <p>Consistency is key in content creation. Here's how I stay ahead:</p>
      
      <h4>Notion Dashboard</h4>
      <p>My entire content calendar lives in Notion. Every video, from idea to publication, is tracked.</p>
      
      <h4>Batch Recording</h4>
      <p>I shoot 3-4 videos in a single day when energy is high. This lets me focus on editing the rest of the week.</p>
      
      <h4>Trend Monitoring</h4>
      <p>I use tools like Google Trends and VidIQ to stay on top of what viewers want to see.</p>
    `,
  },
]

function formatNumber(num: number): string {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
  return num.toString()
}

export function BehindTheScenes() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedPost, setSelectedPost] = useState<BTSPost | null>(null)
  
  const filteredPosts = selectedCategory 
    ? BTS_POSTS.filter(p => p.category === selectedCategory)
    : BTS_POSTS

  return (
    <section className="py-16 sm:py-20 relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <span className="text-primary text-xs font-semibold tracking-wider uppercase">Behind The Scenes</span>
          <h2 className="text-3xl sm:text-4xl font-bold mt-2">
            How The <span className="gradient-text">Magic</span> Happens
          </h2>
          <p className="text-sm text-muted-foreground mt-2 max-w-xl mx-auto">
            Peek into my creative process, studio setup, and daily workflow
          </p>
        </motion.div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          <Button
            variant={selectedCategory === null ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory(null)}
            className="rounded-full"
          >
            All
          </Button>
          {Object.entries(CATEGORIES).map(([key, { label, icon: Icon }]) => (
            <Button
              key={key}
              variant={selectedCategory === key ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(key)}
              className="rounded-full gap-1.5"
            >
              <Icon className="h-3.5 w-3.5" />
              {label}
            </Button>
          ))}
        </div>

        {/* Posts Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredPosts.map((post, index) => {
              const CategoryInfo = CATEGORIES[post.category]
              
              return (
                <motion.div
                  key={post.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card
                    className="glass border-border/50 hover:border-primary/40 transition-all cursor-pointer group overflow-hidden"
                    onClick={() => setSelectedPost(post)}
                  >
                    {/* Thumbnail */}
                    <div className="relative aspect-video overflow-hidden">
                      <img
                        src={post.thumbnail}
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      
                      {/* Type Badge */}
                      <Badge className={`absolute top-2 left-2 ${CategoryInfo.color} text-white border-0`}>
                        <CategoryInfo.icon className="h-3 w-3 mr-1" />
                        {CategoryInfo.label}
                      </Badge>
                      
                      {/* Play Button for Videos */}
                      {post.type === 'video' && (
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center">
                            <Play className="h-6 w-6 text-black ml-1" />
                          </div>
                        </div>
                      )}
                      
                      {/* Stats Overlay */}
                      <div className="absolute bottom-2 left-2 right-2 flex items-center gap-3 text-white text-xs">
                        <span className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {formatNumber(post.views)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Heart className="h-3 w-3" />
                          {formatNumber(post.likes)}
                        </span>
                      </div>
                    </div>
                    
                    <CardContent className="p-4">
                      <h3 className="font-bold text-sm mb-1 line-clamp-1 group-hover:text-primary transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                        {post.description}
                      </p>
                      <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                        <span>{new Date(post.date).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric',
                          year: 'numeric'
                        })}</span>
                        {post.readTime && <span>{post.readTime}</span>}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>

        {/* View All Button */}
        <div className="text-center mt-8">
          <Button variant="outline" className="gap-2">
            View All BTS Content
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Post Detail Modal */}
      <Dialog open={!!selectedPost} onOpenChange={() => setSelectedPost(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto glass border-border/50 p-0">
          {selectedPost && (
            <>
              {/* Header Image/Video */}
              <div className="relative aspect-video">
                {selectedPost.type === 'video' && selectedPost.videoUrl ? (
                  <iframe
                    src={selectedPost.videoUrl}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <img
                    src={selectedPost.thumbnail}
                    alt={selectedPost.title}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              
              <div className="p-6">
                <Badge className={`${CATEGORIES[selectedPost.category].color} text-white border-0 mb-3`}>
                  {CATEGORIES[selectedPost.category].label}
                </Badge>
                
                <h2 className="text-2xl font-bold mb-2">{selectedPost.title}</h2>
                
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                  <span>{new Date(selectedPost.date).toLocaleDateString('en-US', { 
                    month: 'long', 
                    day: 'numeric',
                    year: 'numeric'
                  })}</span>
                  {selectedPost.readTime && <span>{selectedPost.readTime}</span>}
                </div>
                
                <div className="flex items-center gap-4 mb-6">
                  <span className="flex items-center gap-1 text-sm">
                    <Eye className="h-4 w-4" />
                    {formatNumber(selectedPost.views)} views
                  </span>
                  <span className="flex items-center gap-1 text-sm">
                    <Heart className="h-4 w-4" />
                    {formatNumber(selectedPost.likes)} likes
                  </span>
                  <Button variant="ghost" size="sm" className="ml-auto gap-1">
                    <Share2 className="h-4 w-4" />
                    Share
                  </Button>
                </div>
                
                <div className="border-t border-border/30 pt-6">
                  <p className="text-muted-foreground mb-4">{selectedPost.description}</p>
                  
                  {selectedPost.content && (
                    <div 
                      className="prose prose-invert prose-sm max-w-none"
                      dangerouslySetInnerHTML={{ __html: selectedPost.content }}
                    />
                  )}
                  
                  {selectedPost.images && selectedPost.images.length > 0 && (
                    <div className="grid grid-cols-2 gap-3 mt-4">
                      {selectedPost.images.map((img, i) => (
                        <img
                          key={i}
                          src={img}
                          alt={`${selectedPost.title} - Image ${i + 1}`}
                          className="rounded-lg w-full"
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  )
}
