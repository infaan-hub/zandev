import { useEffect, useRef, useCallback, useState } from 'react'

const WS_URL = import.meta.env.VITE_WS_URL || `${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${window.location.host}/ws/designs/`

export function useDesignWebSocket(onDesignUpdate) {
  const wsRef = useRef(null)
  const reconnectTimer = useRef(null)
  const [connected, setConnected] = useState(false)
  const reconnectAttempts = useRef(0)

  const connect = useCallback(() => {
    try {
      const ws = new WebSocket(WS_URL)
      wsRef.current = ws

      ws.onopen = () => {
        setConnected(true)
        reconnectAttempts.current = 0
      }

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          if (data.type === 'design_updated' && onDesignUpdate) {
            onDesignUpdate(data)
          }
        } catch (err) {
          // silent
        }
      }

      ws.onclose = () => {
        setConnected(false)
        const delay = Math.min(1000 * Math.pow(2, reconnectAttempts.current), 30000)
        reconnectAttempts.current++
        reconnectTimer.current = setTimeout(connect, delay)
      }

      ws.onerror = () => {
        ws.close()
      }
    } catch (err) {
      const delay = Math.min(1000 * Math.pow(2, reconnectAttempts.current), 30000)
      reconnectAttempts.current++
      reconnectTimer.current = setTimeout(connect, delay)
    }
  }, [onDesignUpdate])

  useEffect(() => {
    connect()
    return () => {
      clearTimeout(reconnectTimer.current)
      if (wsRef.current) wsRef.current.close()
    }
  }, [connect])

  return { connected }
}
