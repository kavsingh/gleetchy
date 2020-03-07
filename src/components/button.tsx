import React, { FunctionComponent, memo } from 'react'
import styled from '@emotion/styled'

import { ThemeProps } from '~/style/theme'

const Button: FunctionComponent<ButtonProps> = ({ handler, children }) => (
  <Container
    role="button"
    tabIndex={0}
    onClick={handler}
    onKeyDown={(event) => {
      if (event.key === 'Enter') handler()
    }}
  >
    [ {children} ]
  </Container>
)

export default memo(Button)

const Container = styled.div<ThemeProps>`
  font-size: 0.8rem;
  cursor: pointer;
  transition: color 0.2s ease-out;

  &:hover,
  &:active {
    color: ${({ theme }) => theme.colors.emphasis};
  }
`

export interface ButtonProps {
  handler: () => unknown
  children: string | string[]
}
