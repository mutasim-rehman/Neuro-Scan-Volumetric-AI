import React from 'react'
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
    varying vec3 vViewDirection;
    
    void main() {
      vLocalPosition = position;
      vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
      vec4 worldPosition = modelMatrix * vec4(position, 1.0);
      vViewDirection = normalize(worldPosition.xyz - cameraPosition);
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
    varying vec3 vViewDirection;
    
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
      vec3 localPos = vLocalPosition;
      
      // Clipping planes - clipPos is in local space (-0.5 to 0.5)
      vec3 clipPos = localPos;
      if (clipPos.x < uClipPlanes.x - 0.5) discard;
      if (clipPos.y < uClipPlanes.y - 0.5) discard;
      if (clipPos.z < uClipPlanes.z - 0.5) discard;
      
      // Simple raymarching from center outward
      // Calculate ray direction from center to this point
      vec3 rayDir = normalize(localPos);
      
      // Raymarching parameters
      const int steps = 256;
      const float stepSize = 0.005;
      
      // Start from center, march outward
      vec3 startPos = vec3(0.0);
      vec3 endPos = localPos;
      
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
        
        // Accumulate alpha and color (front-to-back compositing)
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

export default function VolumetricMaterial({ 
  volumeTexture, 
  dimensions, 
  clipPlanes = [0, 0, 0],
  transferFunction = 0.1 
}) {
  const materialRef = React.useRef()

  // Update uniforms when they change
  React.useEffect(() => {
    if (materialRef.current) {
      materialRef.current.uniforms.uClipPlanes.value = clipPlanes
      materialRef.current.uniforms.uTransferFunction.value = transferFunction
    }
  }, [clipPlanes, transferFunction])

  if (!volumeTexture) {
    return <meshBasicMaterial color="gray" transparent opacity={0.3} />
  }

  return (
    <volumetricShaderMaterial
      ref={materialRef}
      uVolume={volumeTexture}
      uDimensions={dimensions || [1, 1, 1]}
      uClipPlanes={clipPlanes}
      uTransferFunction={transferFunction}
      transparent
      side={THREE.DoubleSide}
    />
  )
}

