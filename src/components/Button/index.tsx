import React, { FunctionComponent } from 'react'
import { css } from '@emotion/core'
import { withTheme } from 'emotion-theming'

import { UITheme } from '~/style/theme'

const buttonStyle = (theme: UITheme) =>
  css({
    cursor: 'pointer',
    transition: 'color 0.2s ease-out',

    '&:hover, &:active': {
      color: theme.colorEmphasis,
    },
  })

const Button: FunctionComponent<{
  label: string
  handler: () => unknown
}> = ({ label, handler }) => (
  <div
    css={buttonStyle}
    role="button"
    tabIndex={0}
    onClick={handler}
    onKeyDown={event => {
      if (event.key === 'Enter') handler()
    }}
  >
    [ {label} ]
  </div>
)

export default withTheme(Button)
