import React, { createContext, useContext, useState } from 'react'
import { useToast } from '../hooks/useToast'

const ViewerContext = createContext()

export function ViewerProvider({ children }) {
  const [fileId, setFileId] = useState(null)
  const [clipPlanes, setClipPlanes] = useState([0, 0, 0])
  const [transferFunction, setTransferFunction] = useState(0.1)
  const [colorMode, setColorMode] = useState(0) // 0 = grayscale, 1 = heatmap, 2 = rainbow
  const [brightness, setBrightness] = useState(1.0)
  const [contrast, setContrast] = useState(1.0)
  const [files, setFiles] = useState([])
  const [selectedFile, setSelectedFile] = useState(null)
  const [channels, setChannels] = useState({}) // {T1: fileId, T1ce: fileId, T2: fileId, FLAIR: fileId}
  const [activeChannel, setActiveChannel] = useState(null) // Currently displayed channel
  const [segmentationMask, setSegmentationMask] = useState(null) // Mask file ID
  const [showMask, setShowMask] = useState(false)
  const [maskOpacity, setMaskOpacity] = useState(0.5)
  const toast = useToast()

  const updateClipPlane = (index, value) => {
    const newPlanes = [...clipPlanes]
    newPlanes[index] = value
    setClipPlanes(newPlanes)
  }

  return (
    <ViewerContext.Provider
      value={{
        fileId,
        setFileId,
        clipPlanes,
        updateClipPlane,
        transferFunction,
        setTransferFunction,
        colorMode,
        setColorMode,
        brightness,
        setBrightness,
        contrast,
        setContrast,
        files,
        setFiles,
        selectedFile,
        setSelectedFile,
        channels,
        setChannels,
        activeChannel,
        setActiveChannel,
        segmentationMask,
        setSegmentationMask,
        showMask,
        setShowMask,
        maskOpacity,
        setMaskOpacity,
        toast,
      }}
    >
      {children}
    </ViewerContext.Provider>
  )
}

export function useViewer() {
  const context = useContext(ViewerContext)
  if (!context) {
    throw new Error('useViewer must be used within ViewerProvider')
  }
  return context
}

