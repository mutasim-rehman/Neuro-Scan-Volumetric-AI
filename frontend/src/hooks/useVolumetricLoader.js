import { useState, useEffect, useMemo } from 'react'
import * as THREE from 'three'
import { loadVolumetricData } from '../utils/volumetricLoader'

/**
 * Custom hook for loading and managing volumetric data
 * Handles fetching, parsing, and texture creation
 */
export function useVolumetricLoader(fileId = null) {
  const [volumeTexture, setVolumeTexture] = useState(null)
  const [dimensions, setDimensions] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!fileId) {
      // No file selected, use placeholder or return empty
      return
    }

    const loadData = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const { data, width, height, depth } = await loadVolumetricData(fileId)
        
        // Create 3D texture
        const texture = new THREE.DataTexture3D(
          data,
          width,
          height,
          depth
        )
        texture.format = THREE.RedFormat
        texture.type = THREE.FloatType
        texture.minFilter = THREE.LinearFilter
        texture.magFilter = THREE.LinearFilter
        texture.wrapS = THREE.ClampToEdgeWrapping
        texture.wrapT = THREE.ClampToEdgeWrapping
        texture.wrapR = THREE.ClampToEdgeWrapping
        texture.needsUpdate = true

        setVolumeTexture(texture)
        setDimensions([width, height, depth])
      } catch (err) {
        setError(err.message)
        console.error('Failed to load volumetric data:', err)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [fileId])

  return {
    volumeTexture,
    dimensions,
    isLoading,
    error,
  }
}

