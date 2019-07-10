import React, { memo, FunctionComponent, ReactNode } from 'react'
import { css } from '@emotion/core'

import { AudioNodeConnection } from '~/types'
import { noop } from '~/util/function'

import TextInput from '../TextInput'
import Button from '../Button'

const rootStyle = css({
  fontSize: '0.8em',
  marginBottom: '0.6em',
})

const labelContainerStyle = css({
  alignItems: 'center',
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'flex-start',

  '& input': {
    appearance: 'none',
    fontWeight: 500,
    margin: 0,
    padding: 0,
  },
})

const infoContainerStyle = css({
  alignItems: 'center',
  display: 'flex',
  flexDirection: 'row',
})

const connectionsStyle = css({
  display: 'flex',
  height: '100%',
})

const connectionStyle = css({
  flexGrow: 0,
  flexShrink: 0,
  height: '0.8em',
  marginRight: '0.3em',
  width: '0.8em',
})

const typeContainerStyle = css({
  marginRight: '0.3em',
})

export interface TitleBarProps {
  label: string
  type: string
  connections?: AudioNodeConnection[]
  children?: ReactNode | (() => ReactNode)
  onLabelChange?(label: string): unknown
  onRemoveClick?(): unknown
}

const TitleBar: FunctionComponent<TitleBarProps> = ({
  label,
  type,
  onLabelChange = noop,
  onRemoveClick = noop,
  connections = [],
  children = [],
}) => (
  <div css={rootStyle}>
    <div css={labelContainerStyle}>
      <div css={connectionsStyle}>
        {connections.map(({ color, from, to }) => (
          <div
            css={connectionStyle}
            style={{ backgroundColor: color }}
            key={`${from}${to}`}
          />
        ))}
      </div>
      <TextInput onChange={onLabelChange} value={label} />
    </div>
    <div css={infoContainerStyle}>
      <div css={typeContainerStyle}>{type} /</div>
      {typeof children === 'function' ? children() : children}
      <Button label="Remove" handler={onRemoveClick} />
    </div>
  </div>
)

export default memo(TitleBar)
