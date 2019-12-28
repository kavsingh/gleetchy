import { useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { equals } from 'ramda'

import {
  audioNodesSelector,
  activeAudioNodeIdsSelector,
} from '~/state/audioNodes/selectors'
import { addAudioNodeAction } from '~/state/audioNodes/actions'

const useAudioNodes = () => {
  const dispatch = useDispatch()

  const nodes = useSelector(audioNodesSelector)
  const activeIds = useSelector(activeAudioNodeIdsSelector, equals)

  const addNode = useCallback(
    (type: string) => dispatch(addAudioNodeAction(type)),
    [dispatch],
  )

  return [{ nodes, activeIds }, { addNode }] as const
}

export default useAudioNodes
