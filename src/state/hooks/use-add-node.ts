import { useCallback } from 'react'

import { addAudioNodeAction } from '~/state/audio-nodes/actions'

import { useAppDispatch } from './base'

const useAddNode = () => {
  const dispatch = useAppDispatch()

  const addNode = useCallback(
    (type: string) => dispatch(addAudioNodeAction(type)),
    [dispatch],
  )

  return { addNode } as const
}

export default useAddNode
