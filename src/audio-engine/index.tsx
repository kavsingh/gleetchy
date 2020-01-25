import React, { FunctionComponent, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { audioNodesSelector } from '~/state/audio-nodes/selectors'
import { audioEngineEventsSelector } from '~/state/audio-engine/selectors'
import { clearAudioEngineEventsAction } from '~/state/audio-engine/actions'
import useConnections from '~/state/hooks/use-connections'
import useGlobalPlayback from '~/state/hooks/use-global-playback'

import BaseAudioEngine from './audio-engine'

const AudioEngine: FunctionComponent = () => {
  const nodes = useSelector(audioNodesSelector)
  const [{ connections }] = useConnections()
  const [{ isPlaying }] = useGlobalPlayback()

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
