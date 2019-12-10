import React, { memo, FunctionComponent } from 'react'
import { css } from '@emotion/core'
import { withTheme } from 'emotion-theming'

import { UITheme } from '~/style/theme'

const rootStyle = css({
  height: '100%',
  pointerEvents: 'none',
  position: 'relative',
  width: '100%',
})

const alignRightStyle = css({
  transform: 'translateX(-100%)',
})

const tagStyle = (theme: UITheme) =>
  css({
    backgroundColor: theme.colorEmphasis,
    height: 1,
    pointerEvents: 'all',
    position: 'absolute',
    top: 0,
    width: '60%',
  })

const tagAlignLeftStyle = css({
  left: 0,
})

const tagAlignRightStyle = css({
  right: 0,
})

const barStyle = css({
  height: '100%',
  pointerEvents: 'all',
  position: 'absolute',
  top: 0,
  width: '100%',
})

const barAlignLeftStyle = (theme: UITheme) =>
  css({
    borderRight: `1px solid ${theme.colorEmphasis}`,
    left: '-100%',
  })

const barAlignRightStyle = (theme: UITheme) =>
  css({
    borderLeft: `1px solid ${theme.colorEmphasis}`,
    right: '-100%',
  })

export interface LoopHandleProps {
  align: 'left' | 'right'
  theme: UITheme
}

const LoopHandle: FunctionComponent<LoopHandleProps> = ({
  align = 'left',
  theme,
}) => (
  <div css={[rootStyle, align === 'right' && alignRightStyle]}>
    <div
      css={[
        tagStyle(theme),
        align === 'left' && tagAlignLeftStyle,
        align === 'right' && tagAlignRightStyle,
      ]}
    />
    <div
      css={[
        barStyle,
        align === 'left' && barAlignLeftStyle(theme),
        align === 'right' && barAlignRightStyle(theme),
      ]}
    />
  </div>
)

export default memo(withTheme(LoopHandle))
