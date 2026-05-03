"use client"

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type CursorMode = 'constellation' | 'fountain-pen' | 'particles' | 'crosshair' | 'orbital'

interface CursorModeState {
  mode: CursorMode
  setMode: (mode: CursorMode) => void
}

export const useCursorMode = create<CursorModeState>()(
  persist(
    (set) => ({
      mode: 'constellation',
      setMode: (mode) => set({ mode }),
    }),
    {
      name: 'cursor-mode',
    }
  )
)

export const cursorModeLabels: Record<CursorMode, string> = {
  'constellation': 'Constellation',
  'fountain-pen': 'Fountain Pen',
  'particles': 'Particles',
  'crosshair': 'Crosshair',
  'orbital': 'Orbital',
}
