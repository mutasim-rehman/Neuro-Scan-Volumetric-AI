import React, { useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { ViewerProvider } from './context/ViewerContext'
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
  useKeyboardShortcuts()

  return (
    <ViewerProvider>
      <div className="app">
        <Canvas
          camera={{ position: [2, 2, 2], fov: 75 }}
          gl={{ antialias: true, alpha: true }}
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
        <Controls />
        <FileManager />
        <ChannelSelector />
        <MeasurementTools />
        <ExportTools />
        <HelpPanel />
        <ToastContainer />
      </div>
    </ViewerProvider>
  )
}

export default App

