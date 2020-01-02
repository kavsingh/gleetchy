import React, { FunctionComponent, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { audioEngineEventsSelector } from '~/state/audioEngine/selectors'
import { clearAudioEngineEventsAction } from '~/state/audioEngine/actions'
import useConnections from '~/state/hooks/useConnections'
import useGlobalPlayback from '~/state/hooks/useGlobalPlayback'
import useAudioNodes from '~/state/hooks/useAudioNodes'

import BaseAudioEngine from './audio-engine'

const AudioEngine: FunctionComponent = () => {
  const [{ connections }] = useConnections()
  const [{ isPlaying }] = useGlobalPlayback()
  const [{ nodes }] = useAudioNodes()

  const dispatch = useDispatch()
  const audioEngineEvents = useSelector(audioEngineEventsSelector)

  const clearAudioEngineEvents = useCallback(
    () => dispatch(clearAudioEngineEventsAction()),
    [dispatch],
  )

  return (
    <BaseAudioEngine
      isPlaying={isPlaying}
      nodes={nodes}
      connections={connections}
      audioEngineEvents={audioEngineEvents}
      clearAudioEngineEvents={clearAudioEngineEvents}
    />
  )
}

export default AudioEngine
