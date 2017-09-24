import React from 'react'
import PropTypes from 'prop-types'
import classNames from './TitleBar.css'

const TitleBar = ({ children }) => (
  <div className={classNames.root}>{children()}</div>
)

TitleBar.propTypes = {
  children: PropTypes.func,
}

TitleBar.defaultProps = {
  children: () => <div>Title</div>,
}

export default TitleBar
