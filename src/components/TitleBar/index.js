import React from 'react'
import PropTypes from 'prop-types'
import TextInput from '../TextInput'

const TitleBar = ({ type, children, onLabelChange, label, onRemoveClick }) => (
  <div className="titleBar">
    <div className="titleBar__labelContainer">
      <TextInput onChange={onLabelChange} value={label} />
    </div>
    <div className="titleBar__typeContainer">/ {type} /</div>
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
    <style jsx>{`
      .titleBar {
        display: flex;
        flex-direction: row;
        align-items: center;
        font-size: 0.8em;
        height: 1em;
        margin-bottom: 0.6em;
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
  onLabelChange: PropTypes.func,
  onRemoveClick: PropTypes.func,
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
}

TitleBar.defaultProps = {
  label: '',
  type: '',
  onLabelChange: () => {},
  onRemoveClick: () => {},
  children: [],
}

export default TitleBar
