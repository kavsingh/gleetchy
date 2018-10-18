import React, { PureComponent } from 'react'
import { T, always } from 'ramda'

import PropTypes from '~/PropTypes'
import { cancelEvent } from '~/util/event'
import { noop } from '~/util/function'

class FileDropRegion extends PureComponent {
  constructor(...args) {
    super(...args)

    this.state = { dropActive: false }

    this.handleDragEnd = this.handleDragLeave
  }

  handleDragEnter = event => {
    cancelEvent(event)
    this.setState(() => ({ dropActive: true }))
  }

  handleDragLeave = event => {
    cancelEvent(event)
    this.setState(() => ({ dropActive: false }))
  }

  handleFileDrop = event => {
    const { fileFilter, onFiles, onNoFiles } = this.props

    const receivable = Array.from(
      (event.dataTransfer || {}).files || [],
    ).filter(fileFilter)

    cancelEvent(event)

    if (!receivable.length) onNoFiles()
    else onFiles(receivable)

    this.setState(() => ({ dropActive: false }))
  }

  render() {
    const { children } = this.props
    const { dropActive } = this.state

    return children({
      dropActive,
      onDrag: cancelEvent,
      onDragStart: cancelEvent,
      onDragOver: cancelEvent,
      onDragEnd: this.handleDragEnd,
      onDragEnter: this.handleDragEnter,
      onDragLeave: this.handleDragLeave,
      onDrop: this.handleFileDrop,
    })
  }
}

FileDropRegion.propTypes = {
  fileFilter: PropTypes.func,
  onFiles: PropTypes.func,
  onNoFiles: PropTypes.func,
  children: PropTypes.func,
}

FileDropRegion.defaultProps = {
  fileFilter: T,
  onFiles: noop,
  onNoFiles: noop,
  children: always(<div />),
}

export default FileDropRegion
