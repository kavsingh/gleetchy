import React from 'react'
import { css, Global } from '@emotion/core'

import { FunctionComponentWithoutChildren } from '~/types'
import { UITheme } from '~/style/theme'

const globalStyles = (theme: UITheme) => css`
  html {
    box-sizing: border-box;
    font-size: 14px;
    cursor: default;
    user-select: none;
  }

  *,
  *::before,
  *::after {
    box-sizing: inherit;
    cursor: inherit;
    user-select: inherit;
  }

  *:focus,
  *:active {
    outline: none;
  }

  a,
  button {
    cursor: initial;
  }

  html,
  body {
    width: 100%;
    margin: 0;
    padding: 0;
    background-color: ${theme.colors.page};
    -webkit-font-smoothing: antialiased;
  }
`

const GlobalStyles: FunctionComponentWithoutChildren = () => (
  <Global styles={globalStyles} />
)

export default GlobalStyles
