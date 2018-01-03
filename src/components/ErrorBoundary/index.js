import React, { Component } from 'react'

import PropTypes from '~/PropTypes'
import ErrorMessage from '~/components/ErrorMessage'

class ErrorBoundary extends Component {
  constructor(...args) {
    super(...args)
    this.state = { error: undefined }
  }

  componentDidCatch(error) {
    this.setState(() => ({ error }))
  }

  render() {
    if (this.state.error && !this.props.silent) {
      return this.props.renderError(this.state.error)
    }

    return <div>{this.props.children}</div>
  }
}

ErrorBoundary.propTypes = {
  renderError: PropTypes.func,
  children: PropTypes.node,
  silent: PropTypes.bool,
}

ErrorBoundary.defaultProps = {
  renderError: error => <ErrorMessage>{error.toString()}</ErrorMessage>,
  children: [],
  silent: false,
}

export default ErrorBoundary
