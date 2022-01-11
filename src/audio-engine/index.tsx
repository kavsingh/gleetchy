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
// register worklets
// @ts-expect-error worklet url import via webpack
// eslint-disable-next-line import/default
import loopProcessor from '~/nodes/instruments/loop/processor.worklet'

import BaseAudioEngine from './audio-engine'

import type { FCWithoutChildren } from '~/types'

const AudioEngine: FCWithoutChildren = () => {
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
    void getAudioContext()
      .audioWorklet.addModule(loopProcessor as string)
      .then(() => setWorkletsReady(true))
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
