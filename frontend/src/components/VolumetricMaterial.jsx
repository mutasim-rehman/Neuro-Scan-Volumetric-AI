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
    uClipPlanes: [0, 0, 0],
    uTransferFunction: 0.1,
    uColorMode: 0,
    uBrightness: 1.0,
    uContrast: 1.0,
    uTime: 0,
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
    uniform vec3 uDimensions;
    uniform vec3 uClipPlanes;
    uniform float uTransferFunction;
    uniform float uColorMode;
    uniform float uBrightness;
    uniform float uContrast;
    uniform float uTime;
    
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
    
    vec3 getColor(float density) {
      if (uColorMode < 0.5) {
        return vec3(0.7, 0.7, 0.75) * density;
      } else if (uColorMode < 1.5) {
        vec3 color;
        if (density < 0.25) {
          color = mix(vec3(0.0, 0.0, 1.0), vec3(0.0, 1.0, 1.0), density * 4.0);
        } else if (density < 0.5) {
          color = mix(vec3(0.0, 1.0, 1.0), vec3(0.0, 1.0, 0.0), (density - 0.25) * 4.0);
        } else if (density < 0.75) {
          color = mix(vec3(0.0, 1.0, 0.0), vec3(1.0, 1.0, 0.0), (density - 0.5) * 4.0);
        } else {
          color = mix(vec3(1.0, 1.0, 0.0), vec3(1.0, 0.0, 0.0), (density - 0.75) * 4.0);
        }
        return color;
      } else {
        float hue = density * 6.0;
        vec3 color = vec3(
          abs(hue - 3.0) - 1.0,
          2.0 - abs(hue - 2.0),
          2.0 - abs(hue - 4.0)
        );
        return clamp(color, 0.0, 1.0);
      }
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
      
      float density = 0.0;
      float alpha = 0.0;
      
      for (int i = 0; i < maxSteps; i++) {
        if (float(i) * stepSize > rayLength) break;
        if (alpha >= alphaThreshold) break;
        
        vec3 samplePos = startPos + rayDir * (float(i) * stepSize);
        vec3 uv = localToUV(samplePos);
        
        if (any(lessThan(uv, vec3(0.0))) || any(greaterThan(uv, vec3(1.0)))) {
          continue;
        }
        
        float sampleDensity = sampleVolume(uv);
        sampleDensity = (sampleDensity - 0.5) * uContrast + 0.5;
        sampleDensity *= uBrightness;
        sampleDensity = clamp(sampleDensity, 0.0, 1.0);
        
        float opacity = smoothstep(uTransferFunction, 1.0, sampleDensity) * stepSize;
        float contribution = opacity * (1.0 - alpha);
        density += sampleDensity * contribution;
        alpha += contribution;
      }
      
      vec3 color = getColor(density) * uBrightness;
      gl_FragColor = vec4(color, alpha);
    }
  `
)

// Register the shader material
extend({ VolumetricShaderMaterial })

export default function VolumetricMaterial({ 
  volumeTexture, 
  dimensions, 
  clipPlanes = [0, 0, 0],
  transferFunction = 0.1,
  colorMode = 0,
  brightness = 1.0,
  contrast = 1.0
}) {
  const materialRef = React.useRef()

  React.useEffect(() => {
    if (materialRef.current) {
      materialRef.current.uniforms.uClipPlanes.value = clipPlanes
      materialRef.current.uniforms.uTransferFunction.value = transferFunction
      materialRef.current.uniforms.uColorMode.value = colorMode
      materialRef.current.uniforms.uBrightness.value = brightness
      materialRef.current.uniforms.uContrast.value = contrast
    }
  }, [clipPlanes, transferFunction, colorMode, brightness, contrast])

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
      uColorMode={colorMode}
      uBrightness={brightness}
      uContrast={contrast}
      transparent
      side={THREE.DoubleSide}
    />
  )
}
