import React, { useState } from 'react'
import './Controls.css'

/**
 * Control panel for volumetric viewer
 * Includes slicing controls and transfer function adjustment
 */
export default function Controls() {
  const [clipX, setClipX] = useState(0)
  const [clipY, setClipY] = useState(0)
  const [clipZ, setClipZ] = useState(0)
  const [transferFunction, setTransferFunction] = useState(0.1)

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
              value={clipX}
              onChange={(e) => setClipX(parseFloat(e.target.value))}
            />
            <span>{clipX.toFixed(2)}</span>
          </div>
          <div className="control-item">
            <label>Y Plane</label>
            <input
              type="range"
              min="-1"
              max="1"
              step="0.01"
              value={clipY}
              onChange={(e) => setClipY(parseFloat(e.target.value))}
            />
            <span>{clipY.toFixed(2)}</span>
          </div>
          <div className="control-item">
            <label>Z Plane</label>
            <input
              type="range"
              min="-1"
              max="1"
              step="0.01"
              value={clipZ}
              onChange={(e) => setClipZ(parseFloat(e.target.value))}
            />
            <span>{clipZ.toFixed(2)}</span>
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
          <button className="upload-button">
            Upload NIfTI File
          </button>
        </div>
      </div>
    </div>
  )
}

