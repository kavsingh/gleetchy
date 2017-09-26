import React from 'react'
import PropTypes from 'prop-types'

const Handle = ({ align = 'left' }) => (
  <div className="handle">
    <div
      className="handleTag"
      style={align === 'left' ? { right: 0 } : { left: 0 }}
    />
    <div className="handleLine" />
    <style jsx>{`
      .handle {
        position: relative;
        height: 100%;
        width: 100%;
      }

      .handleLine {
        position: absolute;
        height: 100%;
        width: 1px;
        left: 50%;
        background-color: #000;
      }

      .handleTag {
        position: absolute;
        height: 1px;
        width: 50%;
        top: 0;
        background-color: #000;
      }
    `}</style>
  </div>
)

Handle.propTypes = {
  align: PropTypes.oneOf(['left', 'right']),
}

Handle.defaultProps = {
  align: 'left',
}

export default Handle
