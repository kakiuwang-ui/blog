import { useEffect, useState } from 'react'

export default function MouseFollower() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
      setIsVisible(true)
    }

    const handleMouseLeave = () => {
      setIsVisible(false)
    }

    document.addEventListener('mousemove', updateMousePosition)
    document.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      document.removeEventListener('mousemove', updateMousePosition)
      document.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [])

  if (!isVisible) return null

  return (
    <>
      {/* Main cursor */}
      <div
        className="fixed pointer-events-none mix-blend-difference"
        style={{
          left: mousePosition.x - 8,
          top: mousePosition.y - 8,
          transition: 'all 0.1s ease-out',
          zIndex: 9999
        }}
      >
        <div className="w-4 h-4 bg-white rounded-full opacity-80" />
      </div>

      {/* Trailing cursor */}
      <div
        className="fixed pointer-events-none"
        style={{
          left: mousePosition.x - 16,
          top: mousePosition.y - 16,
          transition: 'all 0.3s ease-out',
          zIndex: 9998
        }}
      >
        <div className="w-8 h-8 border-2 border-blue-500 dark:border-blue-400 rounded-full opacity-30" />
      </div>

      {/* Sparkle effect */}
      <div
        className="fixed pointer-events-none"
        style={{
          left: mousePosition.x - 2,
          top: mousePosition.y - 2,
          transition: 'all 0.2s ease-out',
          zIndex: 9997
        }}
      >
        <div className="w-1 h-1 bg-blue-400 rounded-full animate-ping" />
      </div>
    </>
  )
}