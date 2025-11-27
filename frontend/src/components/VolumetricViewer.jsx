import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import VolumetricMaterial from './VolumetricMaterial'
import SegmentationOverlay from './SegmentationOverlay'
import { useVolumetricLoader } from '../hooks/useVolumetricLoader'
import { useDemoVolume } from './DemoVolume'
import { useViewer } from '../context/ViewerContext'

/**
 * VolumetricViewer - Main 3D container for volumetric rendering
 * Uses raymarching shader to render the "Ghost Brain"
 */
export default function VolumetricViewer() {
  const meshRef = useRef()
  const { 
    fileId, 
    clipPlanes, 
    transferFunction,
    colorMode,
    brightness,
    contrast,
    segmentationMask,
    showMask,
    maskOpacity
  } = useViewer()
  const { volumeTexture, dimensions, isLoading } = useVolumetricLoader(fileId)
  const { texture: maskTexture, dimensions: maskDimensions } = useVolumetricLoader(segmentationMask)
  const { texture: demoTexture, dimensions: demoDimensions } = useDemoVolume()

  // Remove auto-rotation - now using OrbitControls

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

  if (isLoading && !volumeTexture && fileId) {
    return (
      <mesh>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial color="gray" wireframe />
      </mesh>
    )
  }

  // Use segmentation overlay if mask is available and enabled
  const useOverlay = showMask && maskTexture && segmentationMask

  return (
    <mesh ref={meshRef} scale={scale}>
      <boxGeometry args={[1, 1, 1]} />
      {useOverlay ? (
        <SegmentationOverlay
          volumeTexture={activeTexture}
          maskTexture={maskTexture}
          dimensions={activeDimensions}
          clipPlanes={clipPlanes}
          showMask={showMask}
          maskOpacity={maskOpacity}
        />
      ) : (
        <VolumetricMaterial 
          volumeTexture={activeTexture} 
          dimensions={activeDimensions}
          clipPlanes={clipPlanes}
          transferFunction={transferFunction}
          colorMode={colorMode}
          brightness={brightness}
          contrast={contrast}
        />
      )}
    </mesh>
  )
}

