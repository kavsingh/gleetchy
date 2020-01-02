export type ColorSchemePreference = 'no-preference' | 'light' | 'dark'

export const darkSchemeQuery = (() => {
  try {
    return window?.matchMedia?.('(prefers-color-scheme: dark)')
  } catch {
    return undefined
  }
})()

export const lightSchemeQuery = (() => {
  try {
    return window?.matchMedia?.('(prefers-color-scheme: light)')
  } catch {
    return undefined
  }
})()

export const getPreferredColorScheme = (): ColorSchemePreference => {
  if (darkSchemeQuery?.matches) return 'dark'

  if (lightSchemeQuery?.matches) return 'light'

  return 'no-preference'
}
