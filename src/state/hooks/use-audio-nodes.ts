import { useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import {
  audioNodesSelector,
  activeAudioNodeIdsSelector,
} from '~/state/audio-nodes/selectors'
import { addAudioNodeAction } from '~/state/audio-nodes/actions'

const useAudioNodes = () => {
  const dispatch = useDispatch()

  const nodes = useSelector(audioNodesSelector)
  const activeIds = useSelector(activeAudioNodeIdsSelector)

  const addNode = useCallback(
    (type: string) => dispatch(addAudioNodeAction(type)),
    [dispatch],
  )

  return [{ nodes, activeIds }, { addNode }] as const
}

export default useAudioNodes
