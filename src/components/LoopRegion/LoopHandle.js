import React from 'react'
import PropTypes from 'prop-types'

const LoopHandle = ({ align = 'left' }) => (
  <div className="loopHandle">
    <div
      className="loopHandle__tag"
      style={align === 'left' ? { right: 0 } : { left: 0 }}
    />
    <div className="loopHandle__bar" />
    <style jsx>{`
      .loopHandle {
        position: relative;
        height: 100%;
        width: 100%;
      }

      .loopHandle__tag {
        position: absolute;
        height: 1px;
        width: 50%;
        top: 0;
        background-color: #000;
      }

      .loopHandle__bar {
        position: absolute;
        height: 100%;
        width: 1px;
        left: 50%;
        background-color: #000;
      }
    `}</style>
  </div>
)

LoopHandle.propTypes = {
  align: PropTypes.oneOf(['left', 'right']),
}

LoopHandle.defaultProps = {
  align: 'left',
}

export default LoopHandle
