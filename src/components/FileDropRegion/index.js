import React, { Component } from 'react'
import { T, always } from 'ramda'

import PropTypes from '~/PropTypes'
import { cancelEvent } from '~/util/event'
import { noop } from '~/util/function'

class FileDropRegion extends Component {
  constructor(...args) {
    super(...args)

    this.state = { dropActive: false }

    this.handleFileDrop = this.handleFileDrop.bind(this)
    this.handleDragEnter = this.handleDragEnter.bind(this)
    this.handleDragLeave = this.handleDragLeave.bind(this)
    this.handleDragEnd = this.handleDragLeave.bind(this)
  }

  handleDragEnter(event) {
    cancelEvent(event)
    this.setState(() => ({ dropActive: true }))
  }

  handleDragLeave(event) {
    cancelEvent(event)
    this.setState(() => ({ dropActive: false }))
  }

  handleFileDrop(event) {
    const receivable = Array.from(
      (event.dataTransfer || {}).files || [],
    ).filter(this.props.fileFilter)

    cancelEvent(event)

    if (!receivable.length) this.props.onNoFiles()
    else this.props.onFiles(receivable)

    this.setState(() => ({ dropActive: false }))
  }

  render() {
    return this.props.children({
      onDrag: cancelEvent,
      onDragStart: cancelEvent,
      onDragOver: cancelEvent,
      onDragEnd: this.handleDragEnd,
      onDragEnter: this.handleDragEnter,
      onDragLeave: this.handleDragLeave,
      onDrop: this.handleFileDrop,
      dropActive: this.state.dropActive,
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
