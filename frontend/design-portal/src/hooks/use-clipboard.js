import * as React from "react"

export function useClipboard(timeout = 2000) {
  const [copied, setCopied] = React.useState(false)

  const copy = React.useCallback(async (text) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), timeout)
      return true
    } catch (error) {
      console.error("Failed to copy:", error)
      setCopied(false)
      return false
    }
  }, [timeout])

  return { copied, copy }
}
