import React, { useMemo } from 'react'
import { shaderMaterial } from '@react-three/drei'
import { extend } from '@react-three/fiber'
import * as THREE from 'three'

/**
 * Shader material for rendering segmentation mask overlay
 * Blends mask colors with base volume using alpha compositing
 */
const SegmentationShaderMaterial = shaderMaterial(
  {
    uVolume: null,
    uMask: null,
    uDimensions: [1, 1, 1],
    uClipPlanes: [0, 0, 0],
    uMaskOpacity: 0.5,
    uShowMask: true,
  },
  // Vertex Shader
  `
    varying vec3 vWorldPosition;
    varying vec3 vLocalPosition;
    varying vec3 vCameraPositionLocal;
    
    void main() {
      vLocalPosition = position;
      vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
      vec4 cameraLocal = inverseModelMatrix * vec4(cameraPosition, 1.0);
      vCameraPositionLocal = cameraLocal.xyz;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  // Fragment Shader
  `
    uniform sampler3D uVolume;
    uniform sampler3D uMask;
    uniform vec3 uDimensions;
    uniform vec3 uClipPlanes;
    uniform float uMaskOpacity;
    uniform bool uShowMask;
    
    varying vec3 vWorldPosition;
    varying vec3 vLocalPosition;
    varying vec3 vCameraPositionLocal;
    
    vec3 localToUV(vec3 localPos) {
      return localPos + 0.5;
    }
    
    float sampleVolume(vec3 uv) {
      uv = clamp(uv, 0.0, 1.0);
      return texture(uVolume, uv).r;
    }
    
    float sampleMask(vec3 uv) {
      uv = clamp(uv, 0.0, 1.0);
      return texture(uMask, uv).r;
    }
    
    // Get mask color based on label value
    vec3 getMaskColor(float label) {
      // Label 1: Necrotic Tumor Core (Red)
      if (label > 0.0 && label < 0.25) {
        return vec3(1.0, 0.0, 0.0);
      }
      // Label 2: Peritumoral Edema (Green)
      else if (label >= 0.25 && label < 0.5) {
        return vec3(0.0, 1.0, 0.0);
      }
      // Label 4: Enhancing Tumor (Yellow)
      else if (label >= 0.5 && label < 0.75) {
        return vec3(1.0, 1.0, 0.0);
      }
      return vec3(0.0, 0.0, 0.0);
    }
    
    vec2 intersectBox(vec3 rayOrigin, vec3 rayDir, vec3 boxMin, vec3 boxMax) {
      vec3 invDir = 1.0 / rayDir;
      vec3 t0 = (boxMin - rayOrigin) * invDir;
      vec3 t1 = (boxMax - rayOrigin) * invDir;
      vec3 tmin = min(t0, t1);
      vec3 tmax = max(t0, t1);
      float t_entry = max(max(tmin.x, tmin.y), tmin.z);
      float t_exit = min(min(tmax.x, tmax.y), tmax.z);
      return vec2(t_entry, t_exit);
    }
    
    void main() {
      vec3 localPos = vLocalPosition;
      
      // Clipping planes
      vec3 clipPos = localPos;
      if (clipPos.x < uClipPlanes.x - 0.5) discard;
      if (clipPos.y < uClipPlanes.y - 0.5) discard;
      if (clipPos.z < uClipPlanes.z - 0.5) discard;
      
      vec3 rayDir = normalize(vLocalPosition - vCameraPositionLocal);
      vec3 boxMin = vec3(-0.5);
      vec3 boxMax = vec3(0.5);
      
      vec2 t = intersectBox(localPos, rayDir, boxMin, boxMax);
      if (t.y < 0.0 || t.x > t.y) discard;
      
      float t_entry = max(0.0, t.x);
      float t_exit = t.y;
      
      vec3 startPos = localPos + rayDir * t_entry;
      vec3 endPos = localPos + rayDir * t_exit;
      float rayLength = distance(endPos, startPos);
      
      const int maxSteps = 256;
      float stepSize = rayLength / float(maxSteps);
      const float alphaThreshold = 0.99;
      
      vec3 volumeColor = vec3(0.0);
      vec3 maskColor = vec3(0.0);
      float volumeAlpha = 0.0;
      float maskAlpha = 0.0;
      
      // Raymarching loop
      for (int i = 0; i < maxSteps; i++) {
        if (float(i) * stepSize > rayLength) break;
        if (volumeAlpha >= alphaThreshold && maskAlpha >= alphaThreshold) break;
        
        vec3 samplePos = startPos + rayDir * (float(i) * stepSize);
        vec3 uv = localToUV(samplePos);
        
        if (any(lessThan(uv, vec3(0.0))) || any(greaterThan(uv, vec3(1.0)))) {
          continue;
        }
        
        // Sample volume
        float volumeDensity = sampleVolume(uv);
        float volumeOpacity = volumeDensity * stepSize;
        float volumeContribution = volumeOpacity * (1.0 - volumeAlpha);
        volumeColor += vec3(0.7, 0.7, 0.75) * volumeDensity * volumeContribution;
        volumeAlpha += volumeContribution;
        
        // Sample mask if enabled
        if (uShowMask) {
          float maskValue = sampleMask(uv);
          if (maskValue > 0.01) {
            vec3 maskCol = getMaskColor(maskValue);
            float maskOp = maskValue * uMaskOpacity * stepSize;
            float maskContribution = maskOp * (1.0 - maskAlpha);
            maskColor += maskCol * maskContribution;
            maskAlpha += maskContribution;
          }
        }
      }
      
      // Blend: FinalPixel = AnatomyColor * (1 - TumorAlpha) + TumorColor * TumorAlpha
      vec3 finalColor = volumeColor * (1.0 - maskAlpha) + maskColor * maskAlpha;
      float finalAlpha = max(volumeAlpha, maskAlpha);
      
      gl_FragColor = vec4(finalColor, finalAlpha);
    }
  `
)

extend({ SegmentationShaderMaterial })

export default function SegmentationOverlay({
  volumeTexture,
  maskTexture,
  dimensions,
  clipPlanes,
  showMask,
  maskOpacity,
}) {
  if (!volumeTexture || !maskTexture) {
    return null
  }

  return (
    <segmentationShaderMaterial
      uVolume={volumeTexture}
      uMask={maskTexture}
      uDimensions={dimensions || [1, 1, 1]}
      uClipPlanes={clipPlanes}
      uMaskOpacity={maskOpacity}
      uShowMask={showMask}
      transparent
      side={THREE.DoubleSide}
    />
  )
}

