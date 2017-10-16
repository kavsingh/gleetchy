import React from 'react'
import PropTypes from 'prop-types'

const LoopHandle = ({ align = 'left' }) => (
  <div className={`loopHandle loopHandle_${align}`}>
    <div className="loopHandle__tag" />
    <div className="loopHandle__bar" />
    <style jsx>{`
      .loopHandle {
        position: relative;
        height: 100%;
        width: 100%;
        pointer-events: none;
      }

      .loopHandle_right {
        transform: translateX(-100%);
      }

      .loopHandle__tag,
      .loopHandle__bar {
        position: absolute;
        top: 0;
        pointer-events: all;
      }

      .loopHandle__tag {
        height: 1px;
        width: 60%;
        background-color: #000;
      }

      .loopHandle__bar {
        height: 100%;
        width: 100%;
      }

      .loopHandle_left .loopHandle__tag {
        left: 0;
      }

      .loopHandle_right .loopHandle__tag {
        right: 0;
      }

      .loopHandle_left .loopHandle__bar {
        left: -100%;
        border-right: 1px solid #000;
      }

      .loopHandle_right .loopHandle__bar {
        right: -100%;
        border-left: 1px solid #000;
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
