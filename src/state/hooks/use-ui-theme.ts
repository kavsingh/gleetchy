import { useCallback, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { usePreferredColorScheme } from '~/apis/color-scheme'
import { uiThemeSelector } from '~/state/ui/selectors'
import {
  toggleDarkLightUIThemesAction,
  setDarkThemeAction,
  setLightThemeAction,
} from '~/state/ui/actions'

const useUITheme = () => {
  const dispatch = useDispatch()

  const preferredColorScheme = usePreferredColorScheme()
  const theme = useSelector(uiThemeSelector)

  const toggleTheme = useCallback(
    () => dispatch(toggleDarkLightUIThemesAction()),
    [dispatch],
  )

  useEffect(() => {
    switch (preferredColorScheme) {
      case 'dark':
        dispatch(setDarkThemeAction())
        break
      case 'light':
        dispatch(setLightThemeAction())
        break
      default:
        break
    }
  }, [dispatch, preferredColorScheme])

  return { theme, toggleTheme }
}

export default useUITheme
