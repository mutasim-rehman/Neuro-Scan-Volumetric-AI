import { useState, useCallback } from 'react'

/**
 * Hook for managing toast notifications
 */
export function useToast() {
  const [toasts, setToasts] = useState([])

  const showToast = useCallback((message, type = 'info', duration = 3000) => {
    const id = Date.now()
    const toast = { id, message, type, duration }
    setToasts(prev => [...prev, toast])
    return id
  }, [])

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }, [])

  const showSuccess = useCallback((message) => showToast(message, 'success'), [showToast])
  const showError = useCallback((message) => showToast(message, 'error'), [showToast])
  const showWarning = useCallback((message) => showToast(message, 'warning'), [showToast])
  const showInfo = useCallback((message) => showToast(message, 'info'), [showToast])

  return {
    toasts,
    showToast,
    removeToast,
    showSuccess,
    showError,
    showWarning,
    showInfo,
  }
}

