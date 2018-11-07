import React, { memo, ReactNode, StatelessComponent } from 'react'

import TextInput from '~/components/TextInput'
import { AudioNodeConnection } from '~/types'
import { noop } from '~/util/function'
import { cssLabeled } from '~/util/style'

const classes = cssLabeled('titleBar', {
  root: {
    fontSize: '0.8em',
    marginBottom: '0.6em',
  },

  labelContainer: {
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
  },

  infoContainer: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
  },

  connections: {
    display: 'flex',
    height: '100%',
  },

  connection: {
    flexGrow: 0,
    flexShrink: 0,
    height: '0.8em',
    marginRight: '0.3em',
    width: '0.8em',
  },

  typeContainer: {
    marginRight: '0.3em',
  },

  removeButton: {
    cursor: 'pointer',
  },
})

export interface TitleBarProps {
  label: string
  children: ReactNode | (() => ReactNode)
  type: string
  connections?: AudioNodeConnection[]
  onLabelChange?(label: string): void
  onRemoveClick?(): void
}

const TitleBar: StatelessComponent<TitleBarProps> = ({
  label,
  type,
  onLabelChange = noop,
  onRemoveClick = noop,
  connections = [],
  children = [],
}) => (
  <div className={classes.root}>
    <div className={classes.labelContainer}>
      <div className={classes.connections}>
        {connections.map(({ color, from, to }) => (
          <div
            className={classes.connection}
            style={{ backgroundColor: color }}
            key={`${from}${to}`}
          />
        ))}
      </div>
      <TextInput onChange={onLabelChange} value={label} />
    </div>
    <div className={classes.infoContainer}>
      <div className={classes.typeContainer}>{type} /</div>
      {typeof children === 'function' ? children() : children}
      <div
        className={classes.removeButton}
        role="button"
        onClick={onRemoveClick}
        tabIndex={0}
        onKeyDown={event => {
          if (event.key === 'Enter') {
            onRemoveClick()
          }
        }}
      >
        {'[ Remove ]'}
      </div>
    </div>
  </div>
)

export default memo<TitleBarProps>(TitleBar)
