import { useEffect, useRef, useState, useCallback } from 'react'

export function useTimer(initialMinutes = 0) {
  const [remainingSeconds, setRemainingSeconds] = useState(initialMinutes * 60)
  const [isRunning, setIsRunning] = useState(false)
  const intervalRef = useRef<any>(null)

  useEffect(() => {
    setRemainingSeconds(initialMinutes * 60)
  }, [initialMinutes])

  useEffect(() => {
    if (isRunning && remainingSeconds > 0) {
      intervalRef.current = setInterval(() => {
        setRemainingSeconds((prev) => {
          if (prev <= 1) {
            setIsRunning(false)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } else if (remainingSeconds === 0) {
      setIsRunning(false)
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isRunning, remainingSeconds])

  const start = useCallback(() => {
    if (remainingSeconds > 0) {
      setIsRunning(true)
    }
  }, [remainingSeconds])

  const stop = useCallback(() => {
    setIsRunning(false)
  }, [])

  const reset = useCallback((minutes: number) => {
    setIsRunning(false)
    setRemainingSeconds(minutes * 60)
  }, [])

  const formatTime = useCallback(() => {
    const m = Math.floor(remainingSeconds / 60)
    const s = remainingSeconds % 60
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }, [remainingSeconds])

  return {
    remainingSeconds,
    isRunning,
    start,
    stop,
    reset,
    formatTime,
  }
}
