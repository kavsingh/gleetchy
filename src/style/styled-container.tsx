import { ThemeProvider } from '@emotion/react'
import type { FunctionComponent } from 'react'

import useUITheme from '~/state/hooks/use-ui-theme'

import GlobalStyles from './global-styles'

const StyledContainer: FunctionComponent = ({ children }) => {
  const { theme } = useUITheme()

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      {children}
    </ThemeProvider>
  )
}

export default StyledContainer
