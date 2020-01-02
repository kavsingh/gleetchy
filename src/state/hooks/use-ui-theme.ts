import { useCallback, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { uiThemeSelector } from '~/state/ui/selectors'
import {
  toggleDarkLightUIThemesAction,
  setDarkThemeAction,
  setLightThemeAction,
} from '~/state/ui/actions'
import { darkSchemeQuery, lightSchemeQuery } from '~/apis/color-scheme'

const useUITheme = () => {
  const dispatch = useDispatch()

  const theme = useSelector(uiThemeSelector)

  const toggleTheme = useCallback(
    () => dispatch(toggleDarkLightUIThemesAction()),
    [dispatch],
  )

  const handleDarkSchemeQueryChange = useCallback(
    (event: MediaQueryListEvent) => {
      if (event.matches) dispatch(setDarkThemeAction())
    },
    [dispatch],
  )

  const handleLightSchemeQueryChange = useCallback(
    (event: MediaQueryListEvent) => {
      if (event.matches) dispatch(setLightThemeAction())
    },
    [dispatch],
  )

  useEffect(() => {
    darkSchemeQuery?.addEventListener('change', handleDarkSchemeQueryChange)
    lightSchemeQuery?.addEventListener('change', handleLightSchemeQueryChange)

    return () => {
      darkSchemeQuery?.removeEventListener(
        'change',
        handleDarkSchemeQueryChange,
      )
      lightSchemeQuery?.removeEventListener(
        'change',
        handleLightSchemeQueryChange,
      )
    }
  }, [handleDarkSchemeQueryChange, handleLightSchemeQueryChange])

  return [{ theme }, { toggleTheme }] as const
}

export default useUITheme
