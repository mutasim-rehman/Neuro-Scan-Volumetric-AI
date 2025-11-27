import React, { useMemo } from 'react'
import { shaderMaterial } from '@react-three/drei'
import { extend } from '@react-three/fiber'
import * as THREE from 'three'

/**
 * Custom shader material for volumetric raymarching
 * Implements the "Ghost Brain" effect with 256-step raymarching
 */
const VolumetricShaderMaterial = shaderMaterial(
  {
    uVolume: null,
    uDimensions: [1, 1, 1],
    uClipPlanes: [0, 0, 0], // X, Y, Z clipping plane positions (-1 to 1)
    uTransferFunction: 0.1, // Opacity threshold
    uTime: 0,
  },
  // Vertex Shader
  `
    varying vec3 vWorldPosition;
    varying vec3 vLocalPosition;
    
    void main() {
      vLocalPosition = position;
      vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  // Fragment Shader - Raymarching
  `
    uniform sampler3D uVolume;
    uniform vec3 uDimensions;
    uniform vec3 uClipPlanes;
    uniform float uTransferFunction;
    uniform float uTime;
    
    varying vec3 vWorldPosition;
    varying vec3 vLocalPosition;
    
    // Convert local position (-0.5 to 0.5) to texture coordinates (0 to 1)
    vec3 localToUV(vec3 localPos) {
      return localPos + 0.5;
    }
    
    // Sample 3D texture
    float sampleVolume(vec3 uv) {
      // Clamp to valid texture coordinates
      uv = clamp(uv, 0.0, 1.0);
      return texture(uVolume, uv).r;
    }
    
    void main() {
      vec3 rayOrigin = vLocalPosition;
      vec3 rayDir = normalize(rayOrigin - vec3(0.0));
      
      // Clipping planes
      vec3 clipPos = vLocalPosition;
      if (clipPos.x < uClipPlanes.x - 0.5) discard;
      if (clipPos.y < uClipPlanes.y - 0.5) discard;
      if (clipPos.z < uClipPlanes.z - 0.5) discard;
      
      // Raymarching parameters
      const int steps = 256;
      const float stepSize = 0.01;
      
      vec3 startPos = rayOrigin;
      vec3 endPos = rayOrigin + rayDir * 0.5;
      
      float density = 0.0;
      float alpha = 0.0;
      
      // Raymarching loop
      for (int i = 0; i < steps; i++) {
        float t = float(i) / float(steps);
        vec3 samplePos = mix(startPos, endPos, t);
        vec3 uv = localToUV(samplePos);
        
        // Check bounds
        if (any(lessThan(uv, vec3(0.0))) || any(greaterThan(uv, vec3(1.0)))) {
          break;
        }
        
        float sampleDensity = sampleVolume(uv);
        
        // Transfer function: map density to opacity
        float opacity = smoothstep(uTransferFunction, 1.0, sampleDensity);
        
        // Accumulate alpha and color
        float contribution = opacity * (1.0 - alpha);
        density += sampleDensity * contribution;
        alpha += contribution;
        
        if (alpha >= 0.99) break;
      }
      
      // Ghostly grey color
      vec3 color = vec3(0.7, 0.7, 0.75) * density;
      
      gl_FragColor = vec4(color, alpha);
    }
  `
)

extend({ VolumetricShaderMaterial })

export default function VolumetricMaterial({ volumeTexture, dimensions }) {
  if (!volumeTexture) {
    return <meshBasicMaterial color="gray" transparent opacity={0.3} />
  }

  return (
    <volumetricShaderMaterial
      uVolume={volumeTexture}
      uDimensions={dimensions || [1, 1, 1]}
      uClipPlanes={[0, 0, 0]}
      uTransferFunction={0.1}
      transparent
      side={THREE.DoubleSide}
    />
  )
}

