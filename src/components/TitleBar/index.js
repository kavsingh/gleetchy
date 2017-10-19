import React from 'react'
import PropTypes from 'prop-types'
import { connection as connectionProp } from '../../propTypes'
import { noop } from '../../util/function'
import TextInput from '../TextInput'

const TitleBar = ({
  type,
  connections,
  children,
  onLabelChange,
  label,
  onRemoveClick,
}) => (
  <div className="titleBar">
    <div className="titleBar__labelContainer">
      <div className="titleBar__connections">
        {connections.map(({ color, from, to }) => (
          <div
            className="titleBar__connection"
            style={{ backgroundColor: color }}
            key={`${from}${to}`}
          />
        ))}
      </div>
      <TextInput onChange={onLabelChange} value={label} />
    </div>
    <div className="titleBar__infoContainer">
      <div className="titleBar__typeContainer">{type} /</div>
      {typeof children === 'function' ? children() : children}
      <div
        className="titleBar__removeButton"
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
    <style jsx>{`
      .titleBar {
        font-size: 0.8em;
        margin-bottom: 0.6em;
      }

      .titleBar__labelContainer,
      .titleBar__infoContainer {
        display: flex;
        flex-direction: row;
        align-items: center;
      }

      .titleBar__labelContainer {
        justify-content: flex-start;
      }

      .titleBar__connections {
        display: flex;
        height: 100%;
      }

      .titleBar__connection {
        flex-shrink: 0;
        flex-grow: 0;
        width: 0.8em;
        height: 0.8em;
        margin-right: 0.3em;
      }

      .titleBar__typeContainer {
        margin-right: 0.3em;
      }

      .titleBar__labelContainer :global(input) {
        font-weight: 500;
        padding: 0;
        margin: 0;
        appearance: none;
      }

      .titleBar__removeButton {
        cursor: pointer;
      }
    `}</style>
  </div>
)

TitleBar.propTypes = {
  type: PropTypes.string,
  label: PropTypes.string,
  connections: PropTypes.arrayOf(connectionProp),
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
