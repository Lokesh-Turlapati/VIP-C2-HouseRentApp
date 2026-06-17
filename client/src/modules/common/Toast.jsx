 
import { useEffect } from 'react'

const typeStyles = {
  success: 'bg-green-600',
  error: 'bg-red-500',
  info: 'bg-blue-600',
}

const Toast = ({ message, type = 'info', onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose()
    }, 3000)
    return () => clearTimeout(timer)
  }, [onClose])

  if (!message) return null

  return (
    <div className="fixed top-5 right-5 z-50">
      <div className={`${typeStyles[type]} text-white px-5 py-3 rounded-lg shadow-lg text-sm font-medium animate-fade-in`}>
        {message}
      </div>
    </div>
  )
}

export default Toast