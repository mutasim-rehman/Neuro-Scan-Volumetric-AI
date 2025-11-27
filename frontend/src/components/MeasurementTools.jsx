import React, { useState } from 'react'
import { useViewer } from '../context/ViewerContext'
import './MeasurementTools.css'

/**
 * Measurement tools for distance and angle measurements in 3D space
 */
export default function MeasurementTools() {
  const { fileId } = useViewer()
  const [isOpen, setIsOpen] = useState(false)
  const [measurements, setMeasurements] = useState([])
  const [isMeasuring, setIsMeasuring] = useState(false)
  const [currentPoints, setCurrentPoints] = useState([])

  const handleStartMeasurement = () => {
    setIsMeasuring(true)
    setCurrentPoints([])
  }

  const handleCancelMeasurement = () => {
    setIsMeasuring(false)
    setCurrentPoints([])
  }

  const calculateDistance = (p1, p2) => {
    const dx = p2.x - p1.x
    const dy = p2.y - p1.y
    const dz = p2.z - p1.z
    return Math.sqrt(dx * dx + dy * dy + dz * dz)
  }

  // Placeholder for measurement implementation
  // In a full implementation, you would:
  // 1. Use raycasting to pick points in 3D space
  // 2. Store measurement points
  // 3. Render lines between points
  // 4. Display distance/angle values

  return (
    <>
      <button
        className="measurement-toggle"
        onClick={() => setIsOpen(!isOpen)}
        title="Measurement Tools"
        disabled={!fileId}
      >
        📏
      </button>

      {isOpen && (
        <div className="measurement-tools">
          <div className="measurement-header">
            <h3>Measurement Tools</h3>
            <button className="close-button" onClick={() => setIsOpen(false)}>
              ×
            </button>
          </div>

          <div className="measurement-content">
            <div className="measurement-info">
              <p>Click points in the 3D view to measure distances.</p>
            </div>

            <div className="measurement-controls">
              <button
                className="measure-button"
                onClick={handleStartMeasurement}
                disabled={isMeasuring}
              >
                Start Measurement
              </button>
              {isMeasuring && (
                <button
                  className="cancel-button"
                  onClick={handleCancelMeasurement}
                >
                  Cancel
                </button>
              )}
            </div>

            {measurements.length > 0 && (
              <div className="measurements-list">
                <h4>Measurements</h4>
                {measurements.map((measurement, index) => (
                  <div key={index} className="measurement-item">
                    <span>Distance: {measurement.distance.toFixed(2)} mm</span>
                    <button
                      className="delete-measurement"
                      onClick={() => {
                        const newMeasurements = [...measurements]
                        newMeasurements.splice(index, 1)
                        setMeasurements(newMeasurements)
                      }}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}

