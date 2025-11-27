import React, { useState, useEffect } from 'react'
import { useViewer } from '../context/ViewerContext'
import './ChannelSelector.css'

/**
 * Channel selector for multi-channel MRI support
 * Allows selecting and managing T1, T1ce, T2, FLAIR channels
 */
export default function ChannelSelector() {
  const {
    channels,
    setChannels,
    activeChannel,
    setActiveChannel,
    setFileId,
    files,
  } = useViewer()
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const channelNames = ['T1', 'T1ce', 'T2', 'FLAIR']

  const handleChannelSelect = (channelName, fileId) => {
    const newChannels = { ...channels }
    if (fileId) {
      newChannels[channelName] = fileId
    } else {
      delete newChannels[channelName]
    }
    setChannels(newChannels)
  }

  const handleSetActive = (channelName) => {
    if (channels[channelName]) {
      setActiveChannel(channelName)
      setFileId(channels[channelName])
    }
  }

  const handleCreateGroup = async () => {
    // Check if all channels are set
    const allChannelsSet = channelNames.every(name => channels[name])
    if (!allChannelsSet) {
      alert('Please select all 4 channels (T1, T1ce, T2, FLAIR) before creating a group')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/multi-channel/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(channels),
      })

      if (!response.ok) throw new Error('Failed to create channel group')
      const result = await response.json()
      alert(`Channel group created: ${result.group_id}`)
    } catch (error) {
      console.error('Error creating channel group:', error)
      alert('Failed to create channel group')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <button
        className="channel-selector-toggle"
        onClick={() => setIsOpen(!isOpen)}
        title="Channel Selector"
      >
        📊
      </button>

      {isOpen && (
        <div className="channel-selector">
          <div className="channel-selector-header">
            <h3>Multi-Channel MRI</h3>
            <button className="close-button" onClick={() => setIsOpen(false)}>
              ×
            </button>
          </div>

          <div className="channel-selector-content">
            {channelNames.map((channelName) => {
              const selectedFileId = channels[channelName]
              const isActive = activeChannel === channelName

              return (
                <div key={channelName} className="channel-item">
                  <div className="channel-label">
                    <span className={`channel-name ${isActive ? 'active' : ''}`}>
                      {channelName}
                    </span>
                    {isActive && <span className="active-badge">Active</span>}
                  </div>
                  <select
                    value={selectedFileId || ''}
                    onChange={(e) => handleChannelSelect(channelName, e.target.value)}
                    className="channel-select"
                  >
                    <option value="">Select file...</option>
                    {files.map((file) => (
                      <option key={file.file_id} value={file.file_id}>
                        {file.filename}
                      </option>
                    ))}
                  </select>
                  {selectedFileId && (
                    <button
                      className="set-active-button"
                      onClick={() => handleSetActive(channelName)}
                      disabled={isActive}
                    >
                      {isActive ? 'Active' : 'Set Active'}
                    </button>
                  )}
                </div>
              )
            })}

            <div className="channel-actions">
              <button
                className="create-group-button"
                onClick={handleCreateGroup}
                disabled={loading || !channelNames.every(name => channels[name])}
              >
                {loading ? 'Creating...' : 'Create Channel Group'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

