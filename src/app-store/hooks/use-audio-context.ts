import { useCallback } from 'react'

import { initAudioContext as initAudioContextAction } from '../audio-context/actions'
import { selectAudioContext } from '../audio-context/selectors'
import { useAppDispatch, useAppSelector } from './base'

const useAudioContext = () => {
  const dispatch = useAppDispatch()
  const audioContext = useAppSelector(selectAudioContext)

  const initAudioContext = useCallback(() => {
    dispatch(initAudioContextAction())
  }, [dispatch])

  return { audioContext, initAudioContext } as const
}

export default useAudioContext
