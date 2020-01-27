import { useState, useCallback, useEffect } from 'react'

export type ColorSchemePreference = 'no-preference' | 'light' | 'dark'

export const darkSchemeQuery =
  globalThis?.matchMedia?.('(prefers-color-scheme: dark)') ?? undefined

export const lightSchemeQuery =
  globalThis?.matchMedia?.('(prefers-color-scheme: light)') ?? undefined

export const getPreferredColorScheme = (): ColorSchemePreference => {
  if (darkSchemeQuery?.matches) return 'dark'

  if (lightSchemeQuery?.matches) return 'light'

  return 'no-preference'
}

export const usePreferredColorScheme = () => {
  const [scheme, setScheme] = useState(getPreferredColorScheme())

  const handleDarkSchemeQueryChange = useCallback(
    (event: MediaQueryListEvent) => {
      if (event.matches) setScheme('dark')
    },
    [],
  )

  const handleLightSchemeQueryChange = useCallback(
    (event: MediaQueryListEvent) => {
      if (event.matches) setScheme('light')
    },
    [],
  )

  useEffect(() => {
    darkSchemeQuery?.addListener(handleDarkSchemeQueryChange)
    lightSchemeQuery?.addListener(handleLightSchemeQueryChange)

    return () => {
      darkSchemeQuery?.removeListener(handleDarkSchemeQueryChange)
      lightSchemeQuery?.removeListener(handleLightSchemeQueryChange)
    }
  }, [handleDarkSchemeQueryChange, handleLightSchemeQueryChange])

  return scheme
}
