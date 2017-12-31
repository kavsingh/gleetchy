import React from 'react'

import PropTypes from '~/PropTypes'
import { noop } from '~/util/function'
import { cssLabeled } from '~/util/style'
import TextInput from '~/components/TextInput'

const classes = cssLabeled('titleBar', {
  root: {
    fontSize: '0.8em',
    marginBottom: '0.6em',
  },

  labelContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',

    '& input': {
      fontWeight: 500,
      padding: 0,
      margin: 0,
      appearance: 'none',
    },
  },

  infoContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },

  connections: {
    display: 'flex',
    height: '100%',
  },

  connection: {
    flexShrink: 0,
    flexGrow: 0,
    width: '0.8em',
    height: '0.8em',
    marginRight: '0.3em',
  },

  typeContainer: {
    marginRight: '0.3em',
  },

  removeButton: {
    cursor: 'pointer',
  },
})

const TitleBar = ({
  type,
  connections,
  children,
  onLabelChange,
  label,
  onRemoveClick,
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
          if (event.key === 'Enter') onRemoveClick()
        }}
      >
        {'[ Remove ]'}
      </div>
    </div>
  </div>
)

TitleBar.propTypes = {
  label: PropTypes.string,
  type: PropTypes.string,
  connections: PropTypes.arrayOf(PropTypes.connection),
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
  onLabelChange: PropTypes.func,
  onRemoveClick: PropTypes.func,
}

TitleBar.defaultProps = {
  label: '',
  type: '',
  connections: [],
  children: [],
  onLabelChange: noop,
  onRemoveClick: noop,
}

export default TitleBar
