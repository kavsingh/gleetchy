import React from 'react'
import PropTypes from 'prop-types'

const TitleBar = ({ children }) => (
  <div className="root">
    {children()}
    <style jsx>{`
      .root {
        display: flex;
        flex-direction: row;
        font-size: 0.8em;
        padding: 0 0 0.6em;
      }
    `}</style>
  </div>
)

TitleBar.propTypes = {
  children: PropTypes.func,
}

TitleBar.defaultProps = {
  children: () => <div>Title</div>,
}

export default TitleBar
