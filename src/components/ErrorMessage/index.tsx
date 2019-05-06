import React, { memo, FunctionComponent, ReactNode } from 'react'
import { css } from '@emotion/core'

import { colorError, colorEmphasis } from '~/style/color'

const rootStyle = css({
  backgroundColor: colorError,
  color: colorEmphasis,
  fontSize: '0.9em',
  padding: '2em',
  width: '100%',
})
// For some reason memo does not expose children properly.
// TODO: kiv type updates
const ErrorMessage: FunctionComponent<{ children: ReactNode }> = ({
  children,
}) => <div css={rootStyle}>{children}</div>

export default memo(ErrorMessage)
