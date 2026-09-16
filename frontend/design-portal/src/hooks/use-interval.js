import * as React from "react"

export function useInterval(callback, delay) {
  const savedCallback = React.useRef()

  React.useEffect(() => {
    savedCallback.current = callback
  }, [callback])

  React.useEffect(() => {
    if (delay === null) {
      return
    }

    const id = setInterval(() => savedCallback.current(), delay)
    return () => clearInterval(id)
  }, [delay])
}

export function useTimeout(callback, delay) {
  const savedCallback = React.useRef()

  React.useEffect(() => {
    savedCallback.current = callback
  }, [callback])

  React.useEffect(() => {
    if (delay === null) {
      return
    }

    const id = setTimeout(() => savedCallback.current(), delay)
    return () => clearTimeout(id)
  }, [delay])
}
