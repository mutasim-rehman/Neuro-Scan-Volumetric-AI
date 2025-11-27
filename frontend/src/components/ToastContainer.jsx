import React from 'react'
import Toast from './Toast'
import { useViewer } from '../context/ViewerContext'

/**
 * Container for displaying toast notifications
 */
export default function ToastContainer() {
  const { toast } = useViewer()

  if (!toast) return null

  return (
    <div className="toast-container">
      {toast.toasts.map(toastItem => (
        <Toast
          key={toastItem.id}
          message={toastItem.message}
          type={toastItem.type}
          duration={toastItem.duration}
          onClose={() => toast.removeToast(toastItem.id)}
        />
      ))}
    </div>
  )
}

