'use client'

import { Canvas } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera } from '@react-three/drei'
import { useRef, useEffect, useState } from 'react'
import * as THREE from 'three'

function GlobeMesh() {
  const meshRef = useRef<THREE.Mesh>(null)
  const groupRef = useRef<THREE.Group>(null)
  const [globeTexture, setGlobeTexture] = useState<THREE.Texture | null>(null)
  
  useEffect(() => {
    if (!meshRef.current || !groupRef.current) return

    // Auto-rotate when not interacting
    const interval = setInterval(() => {
      if (groupRef.current) {
        groupRef.current.rotation.y += 0.0005
      }
    }, 16)

    return () => clearInterval(interval)
  }, [])

  // Create the canvas texture only in the browser; this component is also SSR-rendered.
  useEffect(() => {
    const texture = createGlobeTexture()
    setGlobeTexture(texture)
    return () => texture.dispose()
  }, [])

  // Create canvas texture for globe
  const createGlobeTexture = () => {
    const canvas = document.createElement('canvas')
    canvas.width = 2048
    canvas.height = 1024

    const ctx = canvas.getContext('2d')
    if (!ctx) return new THREE.Texture()

    // Ocean blue background
    ctx.fillStyle = '#0a4a8a'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Land masses (simplified)
    ctx.fillStyle = '#2d8f3d'

    // North America
    ctx.beginPath()
    ctx.ellipse(200, 300, 150, 180, -0.3, 0, Math.PI * 2)
    ctx.fill()

    // South America
    ctx.beginPath()
    ctx.ellipse(300, 500, 80, 120, -0.2, 0, Math.PI * 2)
    ctx.fill()

    // Europe
    ctx.beginPath()
    ctx.ellipse(900, 250, 120, 100, 0, 0, Math.PI * 2)
    ctx.fill()

    // Africa
    ctx.beginPath()
    ctx.ellipse(1050, 450, 130, 150, 0.1, 0, Math.PI * 2)
    ctx.fill()

    // Asia
    ctx.beginPath()
    ctx.ellipse(1400, 350, 200, 180, 0, 0, Math.PI * 2)
    ctx.fill()

    // Australia
    ctx.beginPath()
    ctx.ellipse(1550, 650, 70, 80, 0, 0, Math.PI * 2)
    ctx.fill()

    // Clouds / highlights with gold accent
    ctx.fillStyle = 'rgba(212, 175, 55, 0.3)'
    ctx.beginPath()
    ctx.ellipse(400, 200, 200, 100, 0.5, 0, Math.PI * 2)
    ctx.fill()

    ctx.beginPath()
    ctx.ellipse(1200, 400, 150, 80, -0.3, 0, Math.PI * 2)
    ctx.fill()

    const texture = new THREE.CanvasTexture(canvas)
    texture.anisotropy = 16
    return texture
  }

  if (!globeTexture) return null

  return (
    <group ref={groupRef}>
      <mesh ref={meshRef} castShadow receiveShadow>
        <sphereGeometry args={[2, 64, 64]} />
        <meshPhongMaterial
          map={globeTexture}
          shininess={5}
          emissive={0x1a1a2e}
          emissiveIntensity={0.3}
        />
      </mesh>

      {/* Glow effect */}
      <mesh scale={2.05}>
        <sphereGeometry args={[2, 32, 32]} />
        <meshBasicMaterial
          color={0xd4af37}
          transparent
          opacity={0.1}
          wireframe={false}
        />
      </mesh>

      {/* Rotation indicator dots */}
      {[
        { lat: 0, lon: 0 },
        { lat: 35, lon: -95 },
        { lat: -33, lon: 18 },
        { lat: 40, lon: 116 },
      ].map((pos, i) => {
        const latRad = (pos.lat * Math.PI) / 180
        const lonRad = (pos.lon * Math.PI) / 180
        const x = Math.cos(latRad) * Math.cos(lonRad) * 2
        const y = Math.sin(latRad) * 2
        const z = Math.cos(latRad) * Math.sin(lonRad) * 2

        return (
          <mesh key={i} position={[x, y, z]}>
            <sphereGeometry args={[0.1, 16, 16]} />
            <meshBasicMaterial color={0xd4af37} />
          </mesh>
        )
      })}
    </group>
  )
}

export function InteractiveGlobe() {
  return (
    <div className="w-full h-[400px] sm:h-[500px] rounded-lg overflow-hidden border border-gold/20 bg-gradient-to-b from-background to-background/80">
      <Canvas
        camera={{ position: [0, 0, 4.5], fov: 45 }}
        gl={{
          antialias: true,
          alpha: true,
          preserveDrawingBuffer: false,
        }}
      >
        <PerspectiveCamera makeDefault position={[0, 0, 4.5]} fov={45} />

        {/* Lighting */}
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 3, 5]} intensity={1} castShadow />
        <pointLight position={[-5, -3, 5]} intensity={0.4} color={0xd4af37} />

        {/* Globe */}
        <GlobeMesh />

        {/* Controls - orbit with damping */}
        <OrbitControls
          enableZoom={true}
          enablePan={true}
          enableRotate={true}
          zoomSpeed={1}
          rotateSpeed={0.5}
          dampingFactor={0.05}
          autoRotate={true}
          autoRotateSpeed={2}
          minDistance={3}
          maxDistance={8}
        />
      </Canvas>
    </div>
  )
}
