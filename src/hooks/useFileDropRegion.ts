import { T } from 'ramda'
import { useState } from 'react'

import { noop } from '~/util/function'
import { cancelReactEvent } from '~/util/event'

export interface UseFileDropRegionProps {
  fileFilter?(file: File, index: number, array: File[]): boolean
  onFiles?(files: File[]): void
  onNoFiles?(): void
}

const withCancelEvent = (fn: () => void) => (event: React.DragEvent) => {
  cancelReactEvent(event)
  fn()
}

export default function useFileDropRegion({
  fileFilter = T,
  onFiles = noop,
  onNoFiles = noop,
}: UseFileDropRegionProps) {
  const [isDropActive, setIsDropActive] = useState(false)

  const onDrop = (event: React.DragEvent) => {
    const receivable = Array.from(
      (event.dataTransfer || {}).files || [],
    ).filter(fileFilter)

    cancelReactEvent(event)

    if (!receivable.length) {
      onNoFiles()
    } else {
      onFiles(receivable)
    }

    setIsDropActive(false)
  }

  return {
    onDrop,
    isDropActive,
    onDrag: cancelReactEvent,
    onDragOver: cancelReactEvent,
    onDragStart: cancelReactEvent,
    onDragEnter: withCancelEvent(() => setIsDropActive(true)),
    onDragLeave: withCancelEvent(() => setIsDropActive(false)),
    onDragEnd: withCancelEvent(() => setIsDropActive(false)),
  }
}
