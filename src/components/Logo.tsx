import { useState, useEffect } from 'react'

interface LogoProps {
  logos: string[]
  interval?: number
}

function Logo({ logos, interval = 10000 }: LogoProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (logos.length <= 1) return

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % logos.length)
    }, interval)

    return () => clearInterval(timer)
  }, [logos.length, interval])

  if (logos.length === 0) return null

  return (
    <img
      src={logos[currentIndex]}
      alt="Logo"
      className="h-16 w-auto mx-auto mb-4"
    />
  )
}

export default Logo