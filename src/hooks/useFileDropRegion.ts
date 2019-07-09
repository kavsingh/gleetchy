import { T } from 'ramda'
import { useState, useCallback } from 'react'

import { noop } from '~/util/function'
import { cancelReactEvent } from '~/util/event'

export interface UseFileDropRegionProps {
  fileFilter?(file: File, index: number, array: File[]): boolean
  onFiles?(files: File[]): unknown
  onNoFiles?(): unknown
}

const withCancelEvent = (fn: () => unknown) => (event: React.DragEvent) => {
  cancelReactEvent(event)
  fn()
}

export default function useFileDropRegion({
  fileFilter = T,
  onFiles = noop,
  onNoFiles = noop,
}: UseFileDropRegionProps) {
  const [isDropActive, setIsDropActive] = useState(false)

  const onDrop = useCallback(
    (event: React.DragEvent) => {
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
    },
    [setIsDropActive, onFiles, onNoFiles, fileFilter],
  )

  return [
    isDropActive,
    {
      onDrop,
      onDrag: cancelReactEvent,
      onDragOver: cancelReactEvent,
      onDragStart: cancelReactEvent,
      onDragEnter: withCancelEvent(() => setIsDropActive(true)),
      onDragLeave: withCancelEvent(() => setIsDropActive(false)),
      onDragEnd: withCancelEvent(() => setIsDropActive(false)),
    },
  ]
}
