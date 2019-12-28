import { requireWindowWith } from '~/util/env'

type ColorSchemePreference = 'no-preference' | 'light' | 'dark'

export const getPreferredColorScheme = (): ColorSchemePreference => {
  const WINDOW = requireWindowWith(['matchMedia'])

  if (WINDOW && WINDOW.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark'
  }

  if (WINDOW && WINDOW.matchMedia('(prefers-color-scheme: light)').matches) {
    return 'light'
  }

  return 'no-preference'
}
