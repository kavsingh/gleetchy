import React, { FunctionComponent, memo, ReactNode } from 'react'
import { css, keyframes } from '@emotion/core'

const animation = keyframes({
  from: {
    opacity: 0,
    transform: 'translate(0, -4%)',
  },
  to: {
    opacity: 1,
    transform: 'translate(0, 0)',
  },
})

const rootStyle = css({
  height: '100%',
  width: '100%',
  opacity: 0,
  animation: `${animation} 400ms forwards ease-out`,
})

// For some reason memo does not expose children properly.
// TODO: kiv type updates
const AnimIn: FunctionComponent<{ children: ReactNode }> = ({ children }) => (
  <div css={rootStyle}>{children}</div>
)

export default memo(AnimIn)
