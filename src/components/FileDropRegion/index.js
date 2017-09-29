import React, { Component } from 'react'
import PropTypes from 'prop-types'

const cancelEvent = event => {
  event.preventDefault()
  event.stopPropagation()
  return false
}

class FileDropRegion extends Component {
  constructor(...args) {
    super(...args)
    this.handleFileDrop = this.handleFileDrop.bind(this)
  }

  handleFileDrop(event) {
    const receivable = Array.from(
      (event.dataTransfer || {}).files || [],
    ).filter(this.props.fileFilter)

    cancelEvent(event)

    if (!receivable.length) this.props.onNoFiles()
    else this.props.onFiles(receivable)
  }

  render() {
    return this.props.children({
      onDrag: cancelEvent,
      onDragStart: cancelEvent,
      onDragEnd: cancelEvent,
      onDragOver: cancelEvent,
      onDragEnter: cancelEvent,
      onDragLeave: cancelEvent,
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
  style: {},
  fileFilter: () => true,
  onFiles: () => {},
  onNoFiles: () => {},
  children: () => <div />,
}

export default FileDropRegion
