import React, { useState, useRef } from 'react'
import { useViewer } from '../context/ViewerContext'
import './Controls.css'

/**
 * Control panel for volumetric viewer
 * Includes slicing controls and transfer function adjustment
 */
export default function Controls() {
  const {
    clipPlanes,
    updateClipPlane,
    transferFunction,
    setTransferFunction,
    setFileId,
  } = useViewer()
  const fileInputRef = useRef(null)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState(null)

  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    const filename = file.name.toLowerCase()
    if (!filename.endsWith('.nii') && !filename.endsWith('.nii.gz')) {
      setUploadError('Invalid file type. Please upload a .nii or .nii.gz file.')
      return
    }

    setUploading(true)
    setUploadError(null)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/volumetric/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.detail || 'Upload failed')
      }

      const result = await response.json()
      setFileId(result.file_id)
      setUploadError(null)
    } catch (error) {
      setUploadError(error.message || 'Failed to upload file')
      console.error('Upload error:', error)
    } finally {
      setUploading(false)
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  return (
    <div className="controls">
      <div className="controls-panel">
        <h2>NeuroScan Viewer</h2>
        
        <div className="control-group">
          <h3>Slicing Planes</h3>
          <div className="control-item">
            <label>X Plane</label>
            <input
              type="range"
              min="-1"
              max="1"
              step="0.01"
              value={clipPlanes[0]}
              onChange={(e) => updateClipPlane(0, parseFloat(e.target.value))}
            />
            <span>{clipPlanes[0].toFixed(2)}</span>
          </div>
          <div className="control-item">
            <label>Y Plane</label>
            <input
              type="range"
              min="-1"
              max="1"
              step="0.01"
              value={clipPlanes[1]}
              onChange={(e) => updateClipPlane(1, parseFloat(e.target.value))}
            />
            <span>{clipPlanes[1].toFixed(2)}</span>
          </div>
          <div className="control-item">
            <label>Z Plane</label>
            <input
              type="range"
              min="-1"
              max="1"
              step="0.01"
              value={clipPlanes[2]}
              onChange={(e) => updateClipPlane(2, parseFloat(e.target.value))}
            />
            <span>{clipPlanes[2].toFixed(2)}</span>
          </div>
        </div>

        <div className="control-group">
          <h3>Transfer Function</h3>
          <div className="control-item">
            <label>Opacity Threshold</label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={transferFunction}
              onChange={(e) => setTransferFunction(parseFloat(e.target.value))}
            />
            <span>{transferFunction.toFixed(2)}</span>
          </div>
        </div>

        <div className="control-group">
          <h3>File Upload</h3>
          <input
            ref={fileInputRef}
            type="file"
            accept=".nii,.nii.gz"
            onChange={handleFileUpload}
            style={{ display: 'none' }}
            id="file-upload"
          />
          <label htmlFor="file-upload" className="upload-button">
            {uploading ? 'Uploading...' : 'Upload NIfTI File'}
          </label>
          {uploadError && (
            <div className="error-message">{uploadError}</div>
          )}
        </div>
      </div>
    </div>
  )
}

