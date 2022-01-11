import { ThemeProvider } from '@emotion/react'

import useUITheme from '~/state/hooks/use-ui-theme'

import GlobalStyles from './global-styles'

import type { FunctionComponent } from 'react'

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
