import * as React from "react"

export function useWindowSize() {
  const [windowSize, setWindowSize] = React.useState({
    width: typeof window !== "undefined" ? window.innerWidth : 0,
    height: typeof window !== "undefined" ? window.innerHeight : 0,
  })

  React.useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    window.addEventListener("resize", handleResize)
    handleResize()

    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return windowSize
}

export function useWindowScroll() {
  const [scroll, setScroll] = React.useState({
    x: typeof window !== "undefined" ? window.scrollX : 0,
    y: typeof window !== "undefined" ? window.scrollY : 0,
  })

  React.useEffect(() => {
    function handleScroll() {
      setScroll({
        x: window.scrollX,
        y: window.scrollY,
      })
    }

    window.addEventListener("scroll", handleScroll)
    handleScroll()

    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return scroll
}
