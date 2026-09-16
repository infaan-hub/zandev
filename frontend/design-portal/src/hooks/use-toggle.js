import * as React from "react"

export function useToggle(initialValue = false) {
  const [value, setValue] = React.useState(initialValue)

  const toggle = React.useCallback(() => {
    setValue((v) => !v)
  }, [])

  const setTrue = React.useCallback(() => {
    setValue(true)
  }, [])

  const setFalse = React.useCallback(() => {
    setValue(false)
  }, [])

  return { value, toggle, setTrue, setFalse }
}

export function useBoolean(initialValue = false) {
  return useToggle(initialValue)
}
