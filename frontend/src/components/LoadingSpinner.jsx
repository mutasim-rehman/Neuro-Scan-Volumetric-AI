import React from 'react'
import './LoadingSpinner.css'

/**
 * Loading spinner component
 */
export default function LoadingSpinner({ size = 'medium', message }) {
  return (
    <div className={`loading-spinner-container ${size}`}>
      <div className="loading-spinner"></div>
      {message && <div className="loading-message">{message}</div>}
    </div>
  )
}

