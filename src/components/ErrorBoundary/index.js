import React, { Component } from 'react'
import PropTypes from 'prop-types'

class ErrorBoundary extends Component {
  constructor(...args) {
    super(...args)
    this.state = { error: undefined }
  }

  componentDidCatch(error) {
    this.setState(() => ({ error }))
  }

  render() {
    if (this.state.error) return this.props.renderError(this.state.error)
    return this.props.children
  }
}

ErrorBoundary.propTypes = {
  renderError: PropTypes.func,
  children: PropTypes.node,
}

ErrorBoundary.defaultProps = {
  renderError: error => <div>{error.toString()}</div>,
  children: [],
}

export default ErrorBoundary
