export type ColorSchemePreference = 'no-preference' | 'light' | 'dark'

export const darkSchemeQuery: MediaQueryList | undefined =
  window?.matchMedia?.('(prefers-color-scheme: dark)') || undefined

export const lightSchemeQuery: MediaQueryList | undefined =
  window?.matchMedia?.('(prefers-color-scheme: light)') || undefined

export const getPreferredColorScheme = (): ColorSchemePreference => {
  if (darkSchemeQuery.matches) return 'dark'

  if (lightSchemeQuery.matches) return 'light'

  return 'no-preference'
}
