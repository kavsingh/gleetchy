import { useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { audioNodesSelector } from '~/state/audio-nodes/selectors'
import { connectionsSelector } from '~/state/connections/selectors'
import { audioEngineEventsSelector } from '~/state/audio-engine/selectors'
import {
  clearAudioEngineEventsAction,
  dispatchAudioEngineSubscriptionAction,
} from '~/state/audio-engine/actions'
import useGlobalPlayback from '~/state/hooks/use-global-playback'
import type { FCWithoutChildren } from '~/types'

import BaseAudioEngine from './audio-engine'

const AudioEngine: FCWithoutChildren = () => {
  const nodes = useSelector(audioNodesSelector)
  const connections = useSelector(connectionsSelector)
  const { isPlaying } = useGlobalPlayback()

  const dispatch = useDispatch()
  const audioEngineEvents = useSelector(audioEngineEventsSelector)

  const clearAudioEngineEvents = useCallback(
    () => dispatch(clearAudioEngineEventsAction()),
    [dispatch],
  )

  const dispatchSubscriptionEvent = useCallback<
    typeof dispatchAudioEngineSubscriptionAction
  >(
    (nodeId, eventPayload) =>
      dispatch(dispatchAudioEngineSubscriptionAction(nodeId, eventPayload)),
    [dispatch],
  )

  return (
    <BaseAudioEngine
      isPlaying={isPlaying}
      nodes={nodes}
      connections={connections}
      audioEngineEvents={audioEngineEvents}
      clearAudioEngineEvents={clearAudioEngineEvents}
      dispatchSubscriptionEvent={dispatchSubscriptionEvent}
    />
  )
}

export default AudioEngine
