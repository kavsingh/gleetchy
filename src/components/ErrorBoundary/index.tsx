import React, { PureComponent, ReactNode } from 'react'

import ErrorMessage from '~/components/ErrorMessage'

const ErrorAny = ErrorMessage as any

const defaultRenderError = (error: Error): ReactNode => (
  <ErrorAny>{error.toString()}</ErrorAny>
)

export interface ErrorBoundaryProps {
  silent?: boolean
  renderError?(error: Error): ReactNode
}

class ErrorBoundary extends PureComponent<
  ErrorBoundaryProps,
  { error?: Error }
> {
  public state = { error: undefined }

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
