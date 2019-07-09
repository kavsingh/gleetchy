import { useSelector, useDispatch } from 'react-redux'
import { isPlayingSelector } from '~/state/globalPlayback/selectors'
import { toggleGlobalPlaybackAction } from '~/state/globalPlayback/actions'
import { useCallback } from 'react'

const useGlobalPlayback = () => {
  const dispatch = useDispatch()

  const isPlaying = useSelector(isPlayingSelector)

  const togglePlayBack = useCallback(
    () => dispatch(toggleGlobalPlaybackAction()),
    [dispatch],
  )

  return { isPlaying, togglePlayBack }
}

export default useGlobalPlayback
