import React from 'react'
import { Canvas } from '@react-three/fiber'
import { ViewerProvider } from './context/ViewerContext'
import VolumetricViewer from './components/VolumetricViewer'
import Controls from './components/Controls'
import './App.css'

function App() {
  return (
    <ViewerProvider>
      <div className="app">
        <Canvas
          camera={{ position: [2, 2, 2], fov: 75 }}
          gl={{ antialias: true, alpha: true }}
        >
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          <VolumetricViewer />
        </Canvas>
        <Controls />
      </div>
    </ViewerProvider>
  )
}

export default App

