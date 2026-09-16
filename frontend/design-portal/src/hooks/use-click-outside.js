import * as React from "react"

export function useClickOutside(ref, handler) {
  React.useEffect(() => {
    const listener = (event) => {
      if (!ref.current || ref.current.contains(event.target)) {
        return
      }
      handler(event)
    }

    document.addEventListener("mousedown", listener)
    document.addEventListener("touchstart", listener)

    return () => {
      document.removeEventListener("mousedown", listener)
      document.removeEventListener("touchstart", listener)
    }
  }, [ref, handler])
}

export function useClickOutsideMulti(refs, handler) {
  React.useEffect(() => {
    const listener = (event) => {
      for (const ref of refs) {
        if (ref.current && ref.current.contains(event.target)) {
          return
        }
      }
      handler(event)
    }

    document.addEventListener("mousedown", listener)
    document.addEventListener("touchstart", listener)

    return () => {
      document.removeEventListener("mousedown", listener)
      document.removeEventListener("touchstart", listener)
    }
  }, [refs, handler])
}
