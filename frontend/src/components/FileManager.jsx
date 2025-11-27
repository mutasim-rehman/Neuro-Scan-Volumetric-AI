import React, { useEffect, useState } from 'react'
import { useViewer } from '../context/ViewerContext'
import LoadingSpinner from './LoadingSpinner'
import './FileManager.css'

/**
 * File Manager component for listing, selecting, and deleting uploaded files
 */
export default function FileManager() {
  const { files, setFiles, setFileId, selectedFile, setSelectedFile } = useViewer()
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const loadFiles = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/volumetric/list')
      if (!response.ok) throw new Error('Failed to load files')
      const data = await response.json()
      setFiles(data.files || [])
    } catch (err) {
      setError(err.message)
      console.error('Failed to load files:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isOpen) {
      loadFiles()
    }
  }, [isOpen])

  const handleSelectFile = (file) => {
    setSelectedFile(file)
    setFileId(file.file_id)
    setIsOpen(false)
  }

  const handleDeleteFile = async (fileId, event) => {
    event.stopPropagation()
    if (!confirm('Are you sure you want to delete this file?')) return

    try {
      const response = await fetch(`/api/volumetric/${fileId}`, {
        method: 'DELETE',
      })
      if (!response.ok) throw new Error('Failed to delete file')
      await loadFiles()
      if (selectedFile?.file_id === fileId) {
        setSelectedFile(null)
        setFileId(null)
      }
    } catch (err) {
      setError(err.message)
      console.error('Failed to delete file:', err)
    }
  }

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  return (
    <>
      <button 
        className="file-manager-toggle"
        onClick={() => setIsOpen(!isOpen)}
        title="File Manager"
      >
        📁
      </button>
      
      {isOpen && (
        <div className="file-manager">
          <div className="file-manager-header">
            <h3>File Manager</h3>
            <button 
              className="close-button"
              onClick={() => setIsOpen(false)}
            >
              ×
            </button>
          </div>
          
          <div className="file-manager-content">
            {loading && (
              <div className="loading-container">
                <LoadingSpinner size="small" message="Loading files..." />
              </div>
            )}
            {error && <div className="error-message">{error}</div>}
            
            {!loading && !error && (
              <>
                <div className="file-list">
                  {files.length === 0 ? (
                    <div className="empty-state">No files uploaded yet</div>
                  ) : (
                    files.map((file) => (
                      <div
                        key={file.file_id}
                        className={`file-item ${selectedFile?.file_id === file.file_id ? 'selected' : ''}`}
                        onClick={() => handleSelectFile(file)}
                      >
                        <div className="file-info">
                          <div className="file-name">{file.filename}</div>
                          <div className="file-meta">
                            {formatFileSize(file.size)}
                          </div>
                        </div>
                        <button
                          className="delete-button"
                          onClick={(e) => handleDeleteFile(file.file_id, e)}
                          title="Delete file"
                        >
                          🗑️
                        </button>
                      </div>
                    ))
                  )}
                </div>
                <button 
                  className="refresh-button"
                  onClick={loadFiles}
                >
                  Refresh
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}

