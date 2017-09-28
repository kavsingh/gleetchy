import { Component } from 'react'
import PropTypes from 'prop-types'

class ErrorBoundary extends Component {
  constructor(...args) {
    super(...args)
    this.state = { error: undefined }
  }

  componentDidCatch(error) {
    /* continue on silently for now */
    this.setState(() => ({ error }))
  }

  render() {
    return this.props.children
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node,
}

ErrorBoundary.defaultProps = {
  children: [],
}

export default ErrorBoundary
