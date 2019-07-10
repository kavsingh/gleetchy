import React, { FunctionComponent } from 'react'
import { css } from '@emotion/core'

const buttonStyle = css({
  cursor: 'pointer',
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

export default Button
