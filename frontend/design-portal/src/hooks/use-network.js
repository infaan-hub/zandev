import * as React from "react"

export function useOnlineStatus() {
  const [isOnline, setIsOnline] = React.useState(navigator.onLine)

  React.useEffect(() => {
    function handleOnline() {
      setIsOnline(true)
    }

    function handleOffline() {
      setIsOnline(false)
    }

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  return isOnline
}

export function useNetworkStatus() {
  const [status, setStatus] = React.useState({
    online: navigator.onLine,
    downlink: null,
    effectiveType: null,
    rtt: null,
    saveData: false,
  })

  React.useEffect(() => {
    function handleOnline() {
      setStatus((prev) => ({ ...prev, online: true }))
    }

    function handleOffline() {
      setStatus((prev) => ({ ...prev, online: false }))
    }

    function handleConnectionChange() {
      const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection
      if (connection) {
        setStatus({
          online: navigator.onLine,
          downlink: connection.downlink,
          effectiveType: connection.effectiveType,
          rtt: connection.rtt,
          saveData: connection.saveData,
        })
      }
    }

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection
    if (connection) {
      connection.addEventListener("change", handleConnectionChange)
      handleConnectionChange()
    }

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
      if (connection) {
        connection.removeEventListener("change", handleConnectionChange)
      }
    }
  }, [])

  return status
}
