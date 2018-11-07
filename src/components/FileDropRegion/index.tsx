import { T } from 'ramda'
import React, { PureComponent, ReactNode } from 'react'

import { cancelEvent } from '~/util/event'
import { noop } from '~/util/function'

export interface FileDropRegionChildProps {
  dropActive: boolean
  onDrag(event: React.DragEvent<any>): any
  onDragStart(event: React.DragEvent<any>): any
  onDragOver(event: React.DragEvent<any>): any
  onDragEnd(event: React.DragEvent<any>): any
  onDragEnter(event: React.DragEvent<any>): any
  onDragLeave(event: React.DragEvent<any>): any
  onDrop(event: React.DragEvent<any>): any
}

export interface FileDropRegionProps {
  children(props: FileDropRegionChildProps): ReactNode
  fileFilter?(file: File, index: number, array: File[]): boolean
  onFiles?(files: File[]): void
  onNoFiles?(): void
}

class FileDropRegion extends PureComponent<
  FileDropRegionProps,
  { dropActive: boolean }
> {
  public state = { dropActive: false }

  public render() {
    const { children } = this.props
    const { dropActive } = this.state

    return children({
      dropActive,
      onDrag: this.eventCanceler,
      onDragEnd: this.handleDragEnd,
      onDragEnter: this.handleDragEnter,
      onDragLeave: this.handleDragLeave,
      onDragOver: this.eventCanceler,
      onDragStart: this.eventCanceler,
      onDrop: this.handleFileDrop,
    })
  }

  private eventCanceler = (event: React.DragEvent<any>) => {
    cancelEvent(event.nativeEvent)
  }

  private handleDragEnter = (event: React.DragEvent<any>) => {
    this.eventCanceler(event)
    this.setState(() => ({ dropActive: true }))
  }

  private handleDragEnd = (event: React.DragEvent<any>) => {
    this.eventCanceler(event)
    this.setState(() => ({ dropActive: false }))
  }

  private handleDragLeave = (event: React.DragEvent<any>) => {
    this.eventCanceler(event)
    this.setState(() => ({ dropActive: false }))
  }

  private handleFileDrop = (event: React.DragEvent<any>) => {
    const { fileFilter = T, onFiles = noop, onNoFiles = noop } = this.props

    const receivable = Array.from(
      (event.dataTransfer || {}).files || [],
    ).filter(fileFilter)

    this.eventCanceler(event)

    if (!receivable.length) {
      onNoFiles()
    } else {
      onFiles(receivable)
    }

    this.setState(() => ({ dropActive: false }))
  }
}

export default FileDropRegion
