import { useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { selectIsPlaying } from '~/state/global-playback/selectors'
import { toggleGlobalPlaybackAction } from '~/state/global-playback/actions'

const useGlobalPlayback = () => {
  const dispatch = useDispatch()

  const isPlaying = useSelector(selectIsPlaying)

  const togglePlayback = useCallback(
    () => dispatch(toggleGlobalPlaybackAction()),
    [dispatch],
  )

  return { isPlaying, togglePlayback }
}

export default useGlobalPlayback
