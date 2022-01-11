import { useCallback } from 'react'
import { useDispatch } from 'react-redux'

import { addAudioNodeAction } from '~/state/audio-nodes/actions'

const useAddNode = () => {
  const dispatch = useDispatch()

  const addNode = useCallback(
    (type: string) => dispatch(addAudioNodeAction(type)),
    [dispatch],
  )

  return { addNode } as const
}

export default useAddNode
