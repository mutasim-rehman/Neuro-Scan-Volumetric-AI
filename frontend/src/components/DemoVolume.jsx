import React, { useMemo } from 'react'
import * as THREE from 'three'

/**
 * Creates a simple demo 3D texture for testing when no real data is available
 * Generates a sphere-like density field
 */
export function createDemoVolume(width = 64, height = 64, depth = 64) {
  const size = width * height * depth
  const data = new Float32Array(size)
  
  const centerX = width / 2
  const centerY = height / 2
  const centerZ = depth / 2
  const radius = Math.min(width, height, depth) * 0.3
  
  for (let z = 0; z < depth; z++) {
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const dx = x - centerX
        const dy = y - centerY
        const dz = z - centerZ
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz)
        
        // Create sphere with falloff
        const density = Math.max(0, 1 - dist / radius)
        const index = z * width * height + y * width + x
        data[index] = density
      }
    }
  }
  
  return data
}

/**
 * Hook to create a demo volume texture
 */
export function useDemoVolume() {
  return useMemo(() => {
    const width = 64
    const height = 64
    const depth = 64
    const data = createDemoVolume(width, height, depth)
    
    const texture = new THREE.DataTexture3D(data, width, height, depth)
    texture.format = THREE.RedFormat
    texture.type = THREE.FloatType
    texture.minFilter = THREE.LinearFilter
    texture.magFilter = THREE.LinearFilter
    texture.wrapS = THREE.ClampToEdgeWrapping
    texture.wrapT = THREE.ClampToEdgeWrapping
    texture.wrapR = THREE.ClampToEdgeWrapping
    texture.needsUpdate = true
    
    return {
      texture,
      dimensions: [width, height, depth]
    }
  }, [])
}

