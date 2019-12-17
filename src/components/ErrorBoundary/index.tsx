import React, { PureComponent, ReactNode } from 'react'

import ErrorMessage from '~/components/ErrorMessage'

const defaultRenderError = (error: Error): ReactNode => (
  <ErrorMessage>{error.toString()}</ErrorMessage>
)

export interface ErrorBoundaryProps {
  silent?: boolean
  renderError?(error: Error): ReactNode
}

interface State {
  error?: Error
}

class ErrorBoundary extends PureComponent<ErrorBoundaryProps, State> {
  public state: State = {}

  public componentDidCatch(error: Error) {
    this.setState(() => ({ error }))
  }

  public render() {
    const {
      children = null,
      silent = false,
      renderError = defaultRenderError,
    } = this.props
    const { error } = this.state

    return error && !silent ? renderError(error) : <>{children}</>
  }
}

export default ErrorBoundary
