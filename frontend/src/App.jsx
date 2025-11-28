import React, { useEffect, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { ViewerProvider } from './context/ViewerContext'
import { ErrorBoundary } from './components/ErrorBoundary'
import VolumetricViewer from './components/VolumetricViewer'
import Controls from './components/Controls'
import FileManager from './components/FileManager'
import ChannelSelector from './components/ChannelSelector'
import MeasurementTools from './components/MeasurementTools'
import ExportTools from './components/ExportTools'
import HelpPanel from './components/HelpPanel'
import ToastContainer from './components/ToastContainer'
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts'
import './App.css'

function App() {
  const [webglError, setWebglError] = useState(null)
  useKeyboardShortcuts()

  useEffect(() => {
    // Check WebGL support
    const canvas = document.createElement('canvas')
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
    if (!gl) {
      setWebglError('WebGL is not supported in your browser. Please use Chrome, Firefox, or Edge.')
    }
  }, [])

  if (webglError) {
    return (
      <div className="app">
        <div className="webgl-error">
          <h2>⚠️ WebGL Not Supported</h2>
          <p>{webglError}</p>
          <p>Please use a modern browser with WebGL support (Chrome, Firefox, or Edge).</p>
        </div>
      </div>
    )
  }

  return (
    <ErrorBoundary>
      <ViewerProvider>
        <div className="app">
          <Canvas
            camera={{ position: [2, 2, 2], fov: 75 }}
            gl={{ 
              antialias: true, 
              alpha: true,
              preserveDrawingBuffer: true,
              powerPreference: "high-performance"
            }}
            onCreated={({ gl }) => {
              // Check for WebGL errors
              const error = gl.getError()
              if (error !== gl.NO_ERROR) {
                console.warn('WebGL error on creation:', error)
              }
            }}
            onError={(error) => {
              console.error('Canvas error:', error)
              setWebglError('Failed to initialize WebGL. Check browser console for details.')
            }}
          >
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} />
            <OrbitControls 
              enableDamping
              dampingFactor={0.05}
              minDistance={1}
              maxDistance={10}
            />
            <VolumetricViewer />
          </Canvas>
          <ErrorBoundary>
            <Controls />
            <FileManager />
            <ChannelSelector />
            <MeasurementTools />
            <ExportTools />
            <HelpPanel />
            <ToastContainer />
          </ErrorBoundary>
        </div>
      </ViewerProvider>
    </ErrorBoundary>
  )
}

export default App

