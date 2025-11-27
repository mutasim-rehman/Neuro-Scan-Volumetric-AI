import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import VolumetricMaterial from './VolumetricMaterial'
import { useVolumetricLoader } from '../hooks/useVolumetricLoader'
import { useDemoVolume } from './DemoVolume'

/**
 * VolumetricViewer - Main 3D container for volumetric rendering
 * Uses raymarching shader to render the "Ghost Brain"
 */
export default function VolumetricViewer() {
  const meshRef = useRef()
  const { volumeTexture, dimensions, isLoading } = useVolumetricLoader()
  const { texture: demoTexture, dimensions: demoDimensions } = useDemoVolume()

  // Rotate the volume for demo purposes
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.2
    }
  })

  // Use real data if available, otherwise use demo
  const activeTexture = volumeTexture || demoTexture
  const activeDimensions = dimensions || demoDimensions

  // Calculate box size based on dimensions (normalized to unit cube)
  const scale = useMemo(() => {
    if (!activeDimensions) return [1, 1, 1]
    const [w, h, d] = activeDimensions
    const maxDim = Math.max(w, h, d)
    return [w / maxDim, h / maxDim, d / maxDim]
  }, [activeDimensions])

  if (isLoading && !volumeTexture) {
    return (
      <mesh>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial color="gray" wireframe />
      </mesh>
    )
  }

  return (
    <mesh ref={meshRef} scale={scale}>
      <boxGeometry args={[1, 1, 1]} />
      <VolumetricMaterial volumeTexture={activeTexture} dimensions={activeDimensions} />
    </mesh>
  )
}

