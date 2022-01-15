import { useCallback, useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { getAudioContext } from '~/apis/audio'
import { selectAudioNodes } from '~/state/audio-nodes/selectors'
import { selectConnections } from '~/state/connections/selectors'
import { selectAudioEngineEvents } from '~/state/audio-engine/selectors'
import {
  clearAudioEngineEventsAction,
  dispatchAudioEngineSubscriptionAction,
} from '~/state/audio-engine/actions'
import useGlobalPlayback from '~/state/hooks/use-global-playback'
import { GLoopNode } from '~/nodes/instruments/loop/create-audio-node'
import { GDelayNode } from '~/nodes/audio-effects/delay/create-audio-node'
import { GReverbNode } from '~/nodes/audio-effects/reverb/create-audio-node'

import BaseAudioEngine from './audio-engine'

import type { VoidFunctionComponent } from 'react'

const AudioEngine: VoidFunctionComponent = () => {
  const nodes = useSelector(selectAudioNodes)
  const connections = useSelector(selectConnections)
  const { isPlaying } = useGlobalPlayback()

  const dispatch = useDispatch()
  const audioEngineEvents = useSelector(selectAudioEngineEvents)
  const [workletsReady, setWorkletsReady] = useState(false)

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

  useEffect(() => {
    void registerWorklets().then(() => setWorkletsReady(true))
  }, [])

  return workletsReady ? (
    <BaseAudioEngine
      isPlaying={isPlaying}
      nodes={nodes}
      connections={connections}
      audioEngineEvents={audioEngineEvents}
      clearAudioEngineEvents={clearAudioEngineEvents}
      dispatchSubscriptionEvent={dispatchSubscriptionEvent}
    />
  ) : null
}

export default AudioEngine

const registerWorklets = async () => {
  const context = getAudioContext()
  const sources = (
    await Promise.all([
      GLoopNode.getWorklets(),
      GDelayNode.getWorklets(),
      GReverbNode.getWorklets(),
    ])
  ).flat()

  return Promise.all(
    sources.map((source) => context.audioWorklet.addModule(source)),
  )
}
