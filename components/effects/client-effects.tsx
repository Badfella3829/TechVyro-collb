"use client"

import { LoadingScreen } from './loading-screen'
import { CustomCursor } from './custom-cursor'
import { ScrollProgress } from './scroll-progress'
import { ScrollBackground } from './scroll-background'
import { BrandDetector } from './brand-detector'
import { Spotlight } from './spotlight'
import { FloatingBlobs } from './floating-shapes'
import { SoundEffects } from './sound-effects'

export function ClientEffects() {
  return (
    <>
      <LoadingScreen />
      <FloatingBlobs />
      <ScrollBackground />
      <CustomCursor />
      <Spotlight color="cyan" intensity={0.12} size={500} />
      <ScrollProgress />
      <BrandDetector />
      <SoundEffects />
    </>
  )
}
