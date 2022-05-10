import { useCallback, useEffect } from 'react'

import { usePreferredColorScheme } from '~/apis/color-scheme'
import { selectTheme } from '~/state/ui/selectors'
import {
  setDarkTheme,
  setLightTheme,
  toggleTheme as toggleThemeAction,
} from '~/state/ui/actions'

import { useAppDispatch, useAppSelector } from './base'

const useUITheme = () => {
  const dispatch = useAppDispatch()
  const theme = useAppSelector(selectTheme)
  const preferredColorScheme = usePreferredColorScheme()

  const toggleTheme = useCallback(
    () => dispatch(toggleThemeAction()),
    [dispatch],
  )

  useEffect(() => {
    switch (preferredColorScheme) {
      case 'dark':
        dispatch(setDarkTheme())
        break
      case 'light':
        dispatch(setLightTheme())
        break
      default:
        break
    }
  }, [dispatch, preferredColorScheme])

  return { theme, toggleTheme } as const
}

export default useUITheme
