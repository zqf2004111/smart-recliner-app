import { useRef, useCallback } from 'react'

interface LongPressOptions {
  onPress?: () => void
  onLongPress?: () => void
  onRelease?: () => void
  delay?: number
}

export function useLongPress(options: LongPressOptions) {
  const { onPress, onLongPress, onRelease, delay = 800 } = options
  const timerRef = useRef<any>(null)
  const isLongPressRef = useRef(false)

  const start = useCallback(() => {
    isLongPressRef.current = false
    timerRef.current = setTimeout(() => {
      isLongPressRef.current = true
      onLongPress?.()
    }, delay)
  }, [onLongPress, delay])

  const end = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
    if (!isLongPressRef.current) {
      onPress?.()
    }
    onRelease?.()
  }, [onPress, onRelease])

  return {
    onTouchStart: start,
    onTouchEnd: end,
    onTouchCancel: end,
    onMouseDown: start,
    onMouseUp: end,
    onMouseLeave: end,
  }
}
