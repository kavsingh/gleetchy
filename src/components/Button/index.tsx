import React, { FunctionComponent, memo } from 'react'
import styled from '@emotion/styled'
import { withTheme } from 'emotion-theming'

import { ThemeProps } from '~/style/theme'

const Container = styled.div<ThemeProps>`
  cursor: pointer;
  transition: color 0.2s ease-out;

  &:hover,
  &:active {
    color: ${({ theme }) => theme.colors.emphasis};
  }
`

const Button: FunctionComponent<{
  label: string
  handler: () => unknown
}> = ({ label, handler }) => (
  <Container
    role="button"
    tabIndex={0}
    onClick={handler}
    onKeyDown={event => {
      if (event.key === 'Enter') handler()
    }}
  >
    [ {label} ]
  </Container>
)

export default memo(withTheme(Button))
