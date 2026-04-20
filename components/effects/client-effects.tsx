"use client"

import { LoadingScreen } from './loading-screen'
import { CursorTrail } from './cursor-trail'
import { ScrollProgress } from './scroll-progress'

export function ClientEffects() {
  return (
    <>
      <LoadingScreen />
      <CursorTrail />
      <ScrollProgress />
    </>
  )
}
