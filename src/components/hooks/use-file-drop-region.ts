import { useState, useCallback, useMemo, DragEventHandler } from 'react'
import { T } from 'ramda'

import { noop, cancelReactEvent } from '~/lib/util'

export interface UseFileDropRegionProps {
  fileFilter?(file: File, index: number, array: File[]): boolean
  onFiles?(files: File[]): unknown
  onNoFiles?(): unknown
}

export default function useFileDropRegion({
  fileFilter = T,
  onFiles = noop,
  onNoFiles = noop,
}: UseFileDropRegionProps) {
  const [isDropActive, setIsDropActive] = useState(false)

  const eventSetDropActive = useCallback<DragEventHandler>((event) => {
    cancelReactEvent(event)
    setIsDropActive(true)
  }, [])

  const eventSetDropInactive = useCallback<DragEventHandler>((event) => {
    cancelReactEvent(event)
    setIsDropActive(false)
  }, [])

  const onDrop = useCallback<DragEventHandler>(
    (event) => {
      const receivable = Array.from(event.dataTransfer.files).filter(fileFilter)

      cancelReactEvent(event)
      setIsDropActive(false)

      if (receivable.length) onFiles(receivable)
      else onNoFiles()
    },
    [fileFilter, onFiles, onNoFiles],
  )

  const eventHandlers = useMemo(
    () => ({
      onDrop,
      onDrag: cancelReactEvent,
      onDragOver: cancelReactEvent,
      onDragStart: cancelReactEvent,
      onDragEnter: eventSetDropActive,
      onDragLeave: eventSetDropInactive,
      onDragEnd: eventSetDropInactive,
    }),
    [onDrop, eventSetDropActive, eventSetDropInactive],
  )

  return { isDropActive, eventHandlers }
}
