import React from 'react'
import PropTypes from 'prop-types'

const FX = ({ style }) => (
  <div className="fX" style={style}>
    FX
    <style jsx>{`
      .fX {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    `}</style>
  </div>
)

FX.propTypes = {
  style: PropTypes.shape({}),
}

FX.defaultProps = {
  style: {},
}

export default FX
