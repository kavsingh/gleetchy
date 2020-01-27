import React, { FunctionComponent, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { audioNodesSelector } from '~/state/audio-nodes/selectors'
import { connectionsSelector } from '~/state/connections/selectors'
import { audioEngineEventsSelector } from '~/state/audio-engine/selectors'
import { clearAudioEngineEventsAction } from '~/state/audio-engine/actions'
import useGlobalPlayback from '~/state/hooks/use-global-playback'

import BaseAudioEngine from './audio-engine'

const AudioEngine: FunctionComponent = () => {
  const nodes = useSelector(audioNodesSelector)
  const connections = useSelector(connectionsSelector)
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
