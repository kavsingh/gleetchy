import { useCallback } from 'react'

import { selectIsPlaying } from '~/state/global-playback/selectors'
import { toggleGlobalPlaybackAction } from '~/state/global-playback/actions'

import { useAppDispatch, useAppSelector } from './base'

const useGlobalPlayback = () => {
  const dispatch = useAppDispatch()
  const isPlaying = useAppSelector(selectIsPlaying)

  const togglePlayback = useCallback(
    () => dispatch(toggleGlobalPlaybackAction()),
    [dispatch],
  )

  return { isPlaying, togglePlayback } as const
}

export default useGlobalPlayback
