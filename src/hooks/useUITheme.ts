import { useSelector, useDispatch } from 'react-redux'
import { uiThemeSelector } from '~/state/ui/selectors'
import { toggleDarkLightUIThemes } from '~/state/ui/actions'
import { useCallback } from 'react'

const useUITheme = () => {
  const dispatch = useDispatch()

  const theme = useSelector(uiThemeSelector)

  const toggleTheme = useCallback(() => dispatch(toggleDarkLightUIThemes()), [
    dispatch,
  ])

  return { theme, toggleTheme }
}

export default useUITheme
