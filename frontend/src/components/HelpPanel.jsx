import React, { useState } from 'react'
import './HelpPanel.css'

/**
 * Help panel with keyboard shortcuts and usage guide
 */
export default function HelpPanel() {
  const [isOpen, setIsOpen] = useState(false)

  const shortcuts = [
    { key: 'H', description: 'Toggle help panel' },
    { key: 'F', description: 'Toggle file manager' },
    { key: 'C', description: 'Toggle channel selector' },
    { key: 'M', description: 'Toggle measurement tools' },
    { key: 'E', description: 'Toggle export tools' },
    { key: 'R', description: 'Reset camera view' },
    { key: 'Space', description: 'Pause/resume rotation' },
  ]

  return (
    <>
      <button
        className="help-toggle"
        onClick={() => setIsOpen(!isOpen)}
        title="Help (H)"
      >
        ?
      </button>

      {isOpen && (
        <div className="help-panel">
          <div className="help-header">
            <h2>NeuroScan Help</h2>
            <button className="close-button" onClick={() => setIsOpen(false)}>
              ×
            </button>
          </div>

          <div className="help-content">
            <section className="help-section">
              <h3>Keyboard Shortcuts</h3>
              <div className="shortcuts-list">
                {shortcuts.map((shortcut, index) => (
                  <div key={index} className="shortcut-item">
                    <kbd>{shortcut.key}</kbd>
                    <span>{shortcut.description}</span>
                  </div>
                ))}
              </div>
            </section>

            <section className="help-section">
              <h3>Mouse Controls</h3>
              <ul>
                <li><strong>Left Click + Drag:</strong> Rotate view</li>
                <li><strong>Right Click + Drag:</strong> Pan view</li>
                <li><strong>Scroll Wheel:</strong> Zoom in/out</li>
              </ul>
            </section>

            <section className="help-section">
              <h3>Getting Started</h3>
              <ol>
                <li>Upload a NIfTI file using the upload button</li>
                <li>Use slicing planes to explore the volume</li>
                <li>Adjust transfer function for better visibility</li>
                <li>Switch color modes for different visualizations</li>
                <li>Use channel selector for multi-channel MRI</li>
              </ol>
            </section>

            <section className="help-section">
              <h3>Features</h3>
              <ul>
                <li><strong>Volumetric Raymarching:</strong> 256-step raymarching for 3D visualization</li>
                <li><strong>Slicing Planes:</strong> X, Y, Z clipping planes</li>
                <li><strong>Transfer Functions:</strong> Opacity threshold, brightness, contrast</li>
                <li><strong>Color Modes:</strong> Grayscale, Heatmap, Rainbow</li>
                <li><strong>Multi-Channel:</strong> Support for T1, T1ce, T2, FLAIR</li>
                <li><strong>Segmentation Masks:</strong> Overlay AI-generated tumor masks</li>
                <li><strong>Export:</strong> Screenshot and data export</li>
              </ul>
            </section>
          </div>
        </div>
      )}
    </>
  )
}

