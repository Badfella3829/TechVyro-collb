"use client"

import { useRef, useMemo, useState, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Points, PointMaterial } from '@react-three/drei'
import * as THREE from 'three'

function hasWebGL(): boolean {
  if (typeof window === 'undefined') return false
  try {
    const canvas = document.createElement('canvas')
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl2') || canvas.getContext('webgl'))
    )
  } catch {
    return false
  }
}

function Particles({ count = 3000 }) {
  const ref = useRef<THREE.Points>(null)
  const ref2 = useRef<THREE.Points>(null)
  const ref3 = useRef<THREE.Points>(null)
  
  // Generate random positions for particles
  const [positions, positions2, positions3] = useMemo(() => {
    const pos1 = new Float32Array(count * 3)
    const pos2 = new Float32Array(count * 3)
    const pos3 = new Float32Array(count * 3)
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      // Sphere distribution
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const radius = 3 + Math.random() * 7
      
      pos1[i3] = radius * Math.sin(phi) * Math.cos(theta)
      pos1[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
      pos1[i3 + 2] = radius * Math.cos(phi)
      
      // Second layer - larger sphere
      const radius2 = 5 + Math.random() * 10
      pos2[i3] = radius2 * Math.sin(phi) * Math.cos(theta + 0.5)
      pos2[i3 + 1] = radius2 * Math.sin(phi) * Math.sin(theta + 0.5)
      pos2[i3 + 2] = radius2 * Math.cos(phi)
      
      // Third layer - scattered
      const radius3 = 2 + Math.random() * 12
      pos3[i3] = radius3 * Math.sin(phi + 0.3) * Math.cos(theta - 0.3)
      pos3[i3 + 1] = radius3 * Math.sin(phi + 0.3) * Math.sin(theta - 0.3)
      pos3[i3 + 2] = radius3 * Math.cos(phi + 0.3)
    }
    
    return [pos1, pos2, pos3]
  }, [count])
  
  // Animate particles
  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.x -= delta * 0.05
      ref.current.rotation.y -= delta * 0.08
    }
    if (ref2.current) {
      ref2.current.rotation.x += delta * 0.03
      ref2.current.rotation.y += delta * 0.05
    }
    if (ref3.current) {
      ref3.current.rotation.x -= delta * 0.02
      ref3.current.rotation.y -= delta * 0.04
    }
  })
  
  return (
    <group>
      {/* Cyan particles */}
      <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color="#00e5ff"
          size={0.015}
          sizeAttenuation={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </Points>
      
      {/* Magenta particles */}
      <Points ref={ref2} positions={positions2} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color="#ff00ff"
          size={0.012}
          sizeAttenuation={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </Points>
      
      {/* Lime particles */}
      <Points ref={ref3} positions={positions3} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color="#b4ff00"
          size={0.01}
          sizeAttenuation={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </Points>
    </group>
  )
}

export function ParticleField() {
  const [webglOk, setWebglOk] = useState(false)

  useEffect(() => {
    setWebglOk(hasWebGL())
  }, [])

  return (
    <div className="absolute inset-0 -z-10">
      {webglOk && (
        <Canvas
          camera={{ position: [0, 0, 6], fov: 75 }}
          dpr={[1, 2]}
          style={{ background: 'transparent' }}
          onCreated={({ gl }) => {
            gl.domElement.addEventListener('webglcontextlost', (e) => e.preventDefault())
          }}
        >
          <Particles />
        </Canvas>
      )}
      
      {/* Gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-radial from-transparent to-background/50 pointer-events-none" />
    </div>
  )
}
