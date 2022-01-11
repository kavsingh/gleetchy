import { memo } from 'react'
import { css, Global } from '@emotion/react'

import type { Theme } from '@emotion/react'
import type { FCWithoutChildren } from '~/types'

const globalStyles = (theme: Theme) => css`
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

  /* TODO: move this back to UI root when audio engine refactored */
  body {
    color: ${theme.colors.body};
    font-family: ${theme.fonts.body};
    background-color: ${theme.colors.page};
  }
`

const GlobalStyles: FCWithoutChildren = () => <Global styles={globalStyles} />

export default memo(GlobalStyles)
