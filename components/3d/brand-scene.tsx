'use client'

import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Center, Float, Text3D, Environment } from '@react-three/drei'
import { Suspense, useRef, useMemo, useState, useEffect } from 'react'
import * as THREE from 'three'

const GOLD = '#d4af37'
const CYAN = '#22d3ee'

/* Floating 3D brand wordmark */
function BrandText() {
  const group = useRef<THREE.Group>(null)
  const { viewport } = useThree()

  // Scale text down on small viewports so it always fits
  const scale = Math.min(1, viewport.width / 9)

  useFrame((state) => {
    if (!group.current) return
    const t = state.clock.elapsedTime
    // slow continuous tumble so the metallic 3D edges catch the light,
    // with a subtle parallax nudge toward the pointer
    group.current.rotation.y = Math.sin(t * 0.25) * 0.55 + state.pointer.x * 0.2
    group.current.rotation.x = Math.sin(t * 0.2) * 0.12 - state.pointer.y * 0.12
    group.current.position.y = Math.sin(t * 0.6) * 0.15
  })

  return (
    <group ref={group} scale={scale} position={[0, 0, -1]}>
      <Float speed={1.4} rotationIntensity={0.15} floatIntensity={0.5}>
        <Center>
          <Text3D
            font="/fonts/helvetiker_bold.typeface.json"
            size={1.5}
            height={0.35}
            curveSegments={8}
            bevelEnabled
            bevelThickness={0.04}
            bevelSize={0.03}
            bevelSegments={4}
          >
            TechVyro
            <meshStandardMaterial
              color={GOLD}
              metalness={0.9}
              roughness={0.25}
              emissive={GOLD}
              emissiveIntensity={0.12}
            />
          </Text3D>
        </Center>
      </Float>
    </group>
  )
}

/* Slowly drifting depth particles */
function Particles({ count = 220 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null)

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 22
      arr[i * 3 + 1] = (Math.random() - 0.5) * 14
      arr[i * 3 + 2] = (Math.random() - 0.5) * 12 - 4
    }
    return arr
  }, [count])

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.02
    }
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.045}
        color={CYAN}
        transparent
        opacity={0.55}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  )
}

/* Thin orbiting rings for extra depth */
function Rings() {
  const a = useRef<THREE.Mesh>(null)
  const b = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (a.current) {
      a.current.rotation.z = t * 0.1
      a.current.rotation.x = Math.PI / 2.6
    }
    if (b.current) {
      b.current.rotation.z = -t * 0.08
      b.current.rotation.x = Math.PI / 3.4
    }
  })

  return (
    <group position={[0, 0, -3]}>
      <mesh ref={a}>
        <torusGeometry args={[5.2, 0.012, 16, 120]} />
        <meshBasicMaterial color={GOLD} transparent opacity={0.25} />
      </mesh>
      <mesh ref={b}>
        <torusGeometry args={[6.4, 0.01, 16, 120]} />
        <meshBasicMaterial color={CYAN} transparent opacity={0.2} />
      </mesh>
    </group>
  )
}

export function BrandScene() {
  // Keep the server render and the first client render identical. The scene
  // is decorative, so it must never block the site on touch devices or
  // sandboxed preview browsers without a reliable WebGL renderer.
  const [enabled, setEnabled] = useState(false)

  // Respect reduced-motion and skip on very small / low-power devices for performance
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0
    const isSmallScreen = window.innerWidth < 768
    const isLowMemory =
      'deviceMemory' in navigator &&
      typeof (navigator as Navigator & { deviceMemory?: number }).deviceMemory === 'number' &&
      (navigator as Navigator & { deviceMemory?: number }).deviceMemory! < 4
    const isAutomatedPreview = navigator.webdriver

    setEnabled(!reduce && !isTouch && !isSmallScreen && !isLowMemory && !isAutomatedPreview)
  }, [])

  if (!enabled) return null

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 -z-10 pointer-events-none"
      style={{ opacity: 0.85 }}
    >
      <Canvas
        dpr={[1, 2]}
        camera={{ position: [0, 0, 9], fov: 42 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.7} />
          <directionalLight position={[4, 4, 6]} intensity={1.8} />
          <pointLight position={[-6, -3, 4]} intensity={1.1} color={CYAN} />
          <pointLight position={[6, 4, 4]} intensity={1} color={GOLD} />
          <BrandText />
          <Rings />
          <Particles />
          <Environment preset="city" />
        </Suspense>
      </Canvas>
    </div>
  )
}
