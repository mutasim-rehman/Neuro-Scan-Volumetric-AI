import React, { useState, useRef } from 'react'
import { useViewer } from '../context/ViewerContext'
import './ExportTools.css'

/**
 * Export tools for saving screenshots and data
 */
export default function ExportTools() {
  const { fileId, selectedFile } = useViewer()
  const [isOpen, setIsOpen] = useState(false)
  const [exporting, setExporting] = useState(false)
  const canvasRef = useRef(null)

  const handleScreenshot = async () => {
    setExporting(true)
    try {
      // Find the canvas element
      const canvas = document.querySelector('canvas')
      if (!canvas) {
        throw new Error('Canvas not found')
      }
      
      // Get canvas data
      const dataURL = canvas.toDataURL('image/png')
      
      // Create download link
      const link = document.createElement('a')
      link.download = `neuroscan_${fileId || 'screenshot'}_${Date.now()}.png`
      link.href = dataURL
      link.click()
    } catch (error) {
      console.error('Error exporting screenshot:', error)
      alert('Failed to export screenshot')
    } finally {
      setExporting(false)
    }
  }

  const handleExportData = async () => {
    if (!fileId) {
      alert('No file loaded to export')
      return
    }

    setExporting(true)
    try {
      // Fetch the volumetric data
      const response = await fetch(`/api/volumetric/${fileId}`)
      if (!response.ok) throw new Error('Failed to fetch data')
      
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.download = `volume_${fileId}.bin`
      link.href = url
      link.click()
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error exporting data:', error)
      alert('Failed to export data')
    } finally {
      setExporting(false)
    }
  }

  return (
    <>
      <button
        className="export-toggle"
        onClick={() => setIsOpen(!isOpen)}
        title="Export Tools"
      >
        💾
      </button>

      {isOpen && (
        <div className="export-tools">
          <div className="export-header">
            <h3>Export Tools</h3>
            <button className="close-button" onClick={() => setIsOpen(false)}>
              ×
            </button>
          </div>

          <div className="export-content">
            <div className="export-section">
              <h4>Screenshot</h4>
              <p className="export-description">
                Export current view as PNG image
              </p>
              <button
                className="export-button"
                onClick={handleScreenshot}
                disabled={exporting}
              >
                {exporting ? 'Exporting...' : 'Export Screenshot'}
              </button>
            </div>

            <div className="export-section">
              <h4>Volume Data</h4>
              <p className="export-description">
                Export loaded volume data as binary file
              </p>
              <button
                className="export-button"
                onClick={handleExportData}
                disabled={exporting || !fileId}
              >
                {exporting ? 'Exporting...' : 'Export Data'}
              </button>
            </div>

            {selectedFile && (
              <div className="export-info">
                <p><strong>Current File:</strong> {selectedFile.filename}</p>
                <p><strong>File ID:</strong> {fileId}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}

