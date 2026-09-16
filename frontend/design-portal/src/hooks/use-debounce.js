import * as React from "react"

export function useDebounce(value, delay = 500) {
  const [debouncedValue, setDebouncedValue] = React.useState(value)

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

export function useDebouncedCallback(callback, delay = 500) {
  const timeoutRef = React.useRef(null)

  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  const debouncedCallback = React.useCallback(
    (...args) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      timeoutRef.current = setTimeout(() => {
        callback(...args)
      }, delay)
    },
    [callback, delay]
  )

  return debouncedCallback
}
