"use client"

import { LoadingScreen } from './loading-screen'
import { CustomCursor } from './custom-cursor'
import { ScrollProgress } from './scroll-progress'
import { BrandDetector } from './brand-detector'

export function ClientEffects() {
  return (
    <>
      <LoadingScreen />
      <CustomCursor />
      <ScrollProgress />
      <BrandDetector />
    </>
  )
}
