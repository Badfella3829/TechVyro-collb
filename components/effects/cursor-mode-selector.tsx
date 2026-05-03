"use client"

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Sparkles, PenTool, Atom, Crosshair, Orbit } from 'lucide-react'
import { useCursorMode, cursorModeLabels, type CursorMode } from '@/hooks/use-cursor-mode'
import { cn } from '@/lib/utils'

const modeIcons: Record<CursorMode, React.ElementType> = {
  constellation: Sparkles,
  'fountain-pen': PenTool,
  particles: Atom,
  crosshair: Crosshair,
  orbital: Orbit,
}

export function CursorModeSelector() {
  const [isOpen, setIsOpen] = useState(false)
  const { mode, setMode } = useCursorMode()
  const Icon = modeIcons[mode]

  const handleSelect = (newMode: CursorMode) => {
    setMode(newMode)
    setIsOpen(false)
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-sm font-medium transition-all",
          "bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground",
          "border border-border/50 hover:border-border",
          isOpen && "bg-muted text-foreground border-border"
        )}
        aria-label="Select cursor mode"
      >
        <Icon className="h-4 w-4" />
        <span className="hidden lg:inline">{cursorModeLabels[mode]}</span>
        <ChevronDown className={cn(
          "h-3 w-3 transition-transform duration-200",
          isOpen && "rotate-180"
        )} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            
            {/* Dropdown */}
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.95 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className="absolute right-0 top-full mt-2 z-50 min-w-[160px] rounded-lg border border-border bg-card/95 backdrop-blur-lg p-1 shadow-xl"
            >
              {(Object.keys(cursorModeLabels) as CursorMode[]).map((cursorMode) => {
                const ModeIcon = modeIcons[cursorMode]
                const isActive = mode === cursorMode
                
                return (
                  <button
                    key={cursorMode}
                    onClick={() => handleSelect(cursorMode)}
                    className={cn(
                      "flex items-center gap-2 w-full px-3 py-2 rounded-md text-sm transition-colors",
                      isActive
                        ? "bg-primary/20 text-primary"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    <ModeIcon className="h-4 w-4" />
                    <span>{cursorModeLabels[cursorMode]}</span>
                    {isActive && (
                      <motion.div
                        layoutId="active-cursor"
                        className="ml-auto w-1.5 h-1.5 rounded-full bg-primary"
                      />
                    )}
                  </button>
                )
              })}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
