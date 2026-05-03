"use client"

import { useEffect, useRef, useCallback, useState } from 'react'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Volume2, VolumeX } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

// Sound store with persistence
interface SoundState {
  enabled: boolean
  volume: number
  toggle: () => void
  setVolume: (v: number) => void
}

export const useSoundStore = create<SoundState>()(
  persist(
    (set) => ({
      enabled: false, // Off by default - user must opt-in
      volume: 0.3,
      toggle: () => set((state) => ({ enabled: !state.enabled })),
      setVolume: (v) => set({ volume: v }),
    }),
    { name: 'techvyro-sound-prefs' }
  )
)

// Web Audio API based sound synthesizer
class SoundSynth {
  private audioContext: AudioContext | null = null
  private gainNode: GainNode | null = null
  
  private getContext() {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as typeof window & { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
      this.gainNode = this.audioContext.createGain()
      this.gainNode.connect(this.audioContext.destination)
    }
    return { ctx: this.audioContext, gain: this.gainNode! }
  }
  
  setVolume(volume: number) {
    if (this.gainNode) {
      this.gainNode.gain.value = volume
    }
  }
  
  // Soft click sound
  click() {
    const { ctx, gain } = this.getContext()
    const osc = ctx.createOscillator()
    const oscGain = ctx.createGain()
    
    osc.type = 'sine'
    osc.frequency.setValueAtTime(800, ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.05)
    
    oscGain.gain.setValueAtTime(0.15, ctx.currentTime)
    oscGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08)
    
    osc.connect(oscGain)
    oscGain.connect(gain)
    
    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + 0.1)
  }
  
  // Soft hover/whoosh sound
  hover() {
    const { ctx, gain } = this.getContext()
    const osc = ctx.createOscillator()
    const oscGain = ctx.createGain()
    
    osc.type = 'sine'
    osc.frequency.setValueAtTime(300, ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.08)
    
    oscGain.gain.setValueAtTime(0.05, ctx.currentTime)
    oscGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1)
    
    osc.connect(oscGain)
    oscGain.connect(gain)
    
    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + 0.12)
  }
  
  // Success/positive sound
  success() {
    const { ctx, gain } = this.getContext()
    
    const playNote = (freq: number, delay: number) => {
      const osc = ctx.createOscillator()
      const oscGain = ctx.createGain()
      
      osc.type = 'sine'
      osc.frequency.setValueAtTime(freq, ctx.currentTime + delay)
      
      oscGain.gain.setValueAtTime(0, ctx.currentTime + delay)
      oscGain.gain.linearRampToValueAtTime(0.1, ctx.currentTime + delay + 0.02)
      oscGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + 0.15)
      
      osc.connect(oscGain)
      oscGain.connect(gain)
      
      osc.start(ctx.currentTime + delay)
      osc.stop(ctx.currentTime + delay + 0.2)
    }
    
    playNote(523.25, 0) // C5
    playNote(659.25, 0.08) // E5
    playNote(783.99, 0.16) // G5
  }
  
  // Toggle/switch sound
  toggle() {
    const { ctx, gain } = this.getContext()
    const osc = ctx.createOscillator()
    const oscGain = ctx.createGain()
    
    osc.type = 'triangle'
    osc.frequency.setValueAtTime(600, ctx.currentTime)
    osc.frequency.setValueAtTime(800, ctx.currentTime + 0.05)
    
    oscGain.gain.setValueAtTime(0.08, ctx.currentTime)
    oscGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1)
    
    osc.connect(oscGain)
    oscGain.connect(gain)
    
    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + 0.12)
  }
  
  // Pop sound for notifications
  pop() {
    const { ctx, gain } = this.getContext()
    const osc = ctx.createOscillator()
    const oscGain = ctx.createGain()
    
    osc.type = 'sine'
    osc.frequency.setValueAtTime(1000, ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.15)
    
    oscGain.gain.setValueAtTime(0.12, ctx.currentTime)
    oscGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2)
    
    osc.connect(oscGain)
    oscGain.connect(gain)
    
    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + 0.25)
  }
}

// Singleton synth instance
let synthInstance: SoundSynth | null = null
const getSynth = () => {
  if (!synthInstance) {
    synthInstance = new SoundSynth()
  }
  return synthInstance
}

// Hook to play sounds
export function useSound() {
  const { enabled, volume } = useSoundStore()
  
  const play = useCallback((type: 'click' | 'hover' | 'success' | 'toggle' | 'pop') => {
    if (!enabled || typeof window === 'undefined') return
    
    const synth = getSynth()
    synth.setVolume(volume)
    synth[type]()
  }, [enabled, volume])
  
  return { play, enabled }
}

// Component that attaches global event listeners
export function SoundEffects() {
  const { enabled, volume } = useSoundStore()
  const lastHoverTime = useRef(0)
  
  useEffect(() => {
    if (!enabled) return
    
    const synth = getSynth()
    synth.setVolume(volume)
    
    // Click handler
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const isInteractive = target.closest('button, a, [role="button"], input[type="checkbox"], input[type="radio"], .clickable')
      if (isInteractive) {
        synth.click()
      }
    }
    
    // Hover handler (throttled)
    const handleMouseEnter = (e: MouseEvent) => {
      const now = Date.now()
      if (now - lastHoverTime.current < 100) return // Throttle to 100ms
      
      const target = e.target as HTMLElement
      // Check if target is an element with matches method
      if (!target || typeof target.matches !== 'function') return
      
      const isInteractive = target.matches('button, a, [role="button"], .hoverable')
      if (isInteractive) {
        lastHoverTime.current = now
        synth.hover()
      }
    }
    
    document.addEventListener('click', handleClick, { passive: true })
    document.addEventListener('mouseenter', handleMouseEnter, { capture: true, passive: true })
    
    return () => {
      document.removeEventListener('click', handleClick)
      document.removeEventListener('mouseenter', handleMouseEnter, { capture: true })
    }
  }, [enabled, volume])
  
  return null
}

// Sound toggle button component
export function SoundToggle() {
  const { enabled, toggle, volume, setVolume } = useSoundStore()
  const [showSlider, setShowSlider] = useState(false)
  
  const handleToggle = () => {
    toggle()
    if (!enabled) {
      // Play a sound when enabling
      setTimeout(() => {
        const synth = getSynth()
        synth.setVolume(volume)
        synth.toggle()
      }, 50)
    }
  }
  
  return (
    <div 
      className="relative"
      onMouseEnter={() => setShowSlider(true)}
      onMouseLeave={() => setShowSlider(false)}
    >
      <button
        onClick={handleToggle}
        className="p-2 rounded-lg glass-soft border border-border/30 hover:border-primary/30 transition-colors"
        aria-label={enabled ? 'Disable sounds' : 'Enable sounds'}
      >
        {enabled ? (
          <Volume2 className="h-4 w-4 text-primary" />
        ) : (
          <VolumeX className="h-4 w-4 text-muted-foreground" />
        )}
      </button>
      
      <AnimatePresence>
        {showSlider && enabled && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            className="absolute top-full mt-2 left-1/2 -translate-x-1/2 p-3 glass rounded-lg border border-border/30 z-50"
          >
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="w-20 h-1 accent-primary cursor-pointer"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
