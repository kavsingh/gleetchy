import { useSelector, useDispatch } from 'react-redux'
import { uiThemeSelector } from '~/state/ui/selectors'
import { toggleDarkLightUIThemes } from '~/state/ui/actions'

const useUITheme = () => {
  const dispatch = useDispatch()
  const theme = useSelector(uiThemeSelector)
  const toggleTheme = () => dispatch(toggleDarkLightUIThemes())

  return { theme, toggleTheme }
}

export default useUITheme
