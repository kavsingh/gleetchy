import { useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { selectAudioNodes } from '~/state/audio-nodes/selectors'
import { selectConnections } from '~/state/connections/selectors'
import { selectAudioEngineEvents } from '~/state/audio-engine/selectors'
import {
  clearAudioEngineEventsAction,
  dispatchAudioEngineSubscriptionAction,
} from '~/state/audio-engine/actions'
import useGlobalPlayback from '~/state/hooks/use-global-playback'

import BaseAudioEngine from './audio-engine'

import type { FCWithoutChildren } from '~/types'

const AudioEngine: FCWithoutChildren = () => {
  const nodes = useSelector(selectAudioNodes)
  const connections = useSelector(selectConnections)
  const { isPlaying } = useGlobalPlayback()

  const dispatch = useDispatch()
  const audioEngineEvents = useSelector(selectAudioEngineEvents)

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
