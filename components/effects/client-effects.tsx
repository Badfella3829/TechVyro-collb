"use client"

import { LoadingScreen } from './loading-screen'
import { CursorTrail } from './cursor-trail'
import { ScrollProgress } from './scroll-progress'
import { BrandDetector } from './brand-detector'

export function ClientEffects() {
  return (
    <>
      <LoadingScreen />
      <CursorTrail />
      <ScrollProgress />
      <BrandDetector />
    </>
  )
}
