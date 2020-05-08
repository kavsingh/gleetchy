import React, { FunctionComponent } from 'react'
import { ThemeProvider } from 'emotion-theming'

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
