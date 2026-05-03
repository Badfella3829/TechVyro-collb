"use client"

import { LoadingScreen } from './loading-screen'
import { CustomCursor } from './custom-cursor'
import { ScrollProgress } from './scroll-progress'
import { BrandDetector } from './brand-detector'
import { Spotlight } from './spotlight'

export function ClientEffects() {
  return (
    <>
      <LoadingScreen />
      <CustomCursor />
      <Spotlight color="cyan" intensity={0.12} size={500} />
      <ScrollProgress />
      <BrandDetector />
    </>
  )
}
