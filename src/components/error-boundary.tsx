import React, { PureComponent, ReactNode } from 'react'

import ErrorMessage from '~/components/error-message'

const defaultRenderError: ErrorRenderer = (error) => (
  <ErrorMessage>{error.toString()}</ErrorMessage>
)

class ErrorBoundary extends PureComponent<
  { silent?: boolean; renderError?: ErrorRenderer },
  State
> {
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

export type ErrorRenderer = <E extends Error>(error: E) => ReactNode

interface State {
  error?: Error
}
