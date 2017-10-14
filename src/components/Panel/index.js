import React from 'react'
import PropTypes from 'prop-types'

const Panel = ({ children, style }) => (
  <div className="panel" style={{ ...style }}>
    {children}
    <style jsx>{`
      .panel {
        padding: 1.4em 0.4em;
        display: flex;
      }
    `}</style>
  </div>
)

Panel.propTypes = {
  children: PropTypes.node,
  style: PropTypes.shape({}),
}

Panel.defaultProps = {
  children: [],
  style: {},
}

export default Panel
