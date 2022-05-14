import { useCallback, useEffect, useState } from 'react'

import { selectAudioNodes } from '~/state/audio-nodes/selectors'
import { selectConnections } from '~/state/connections/selectors'
import { selectAudioEngineEvents } from '~/state/audio-engine/selectors'
import { useAppSelector, useAppDispatch } from '~/state/hooks/base'
import {
  clearEvents,
  publishSubscriptionEvent,
} from '~/state/audio-engine/actions'
import useAudioContext from '~/state/hooks/use-audio-context'
import useGlobalPlayback from '~/state/hooks/use-global-playback'
import { GLoopNode } from '~/nodes/instruments/loop/create-audio-node'
import { GDelayNode } from '~/nodes/audio-effects/delay/create-audio-node'
import { GReverbNode } from '~/nodes/audio-effects/reverb/create-audio-node'

import BaseAudioEngine from './audio-engine'

import type { FC } from 'react'

const AudioEngine: FC = () => {
  const nodes = useAppSelector(selectAudioNodes)
  const connections = useAppSelector(selectConnections)
  const { isPlaying } = useGlobalPlayback()
  const { audioContext } = useAudioContext()

  const dispatch = useAppDispatch()
  const audioEngineEvents = useAppSelector(selectAudioEngineEvents)
  const [workletsReady, setWorkletsReady] = useState(false)

  const clearAudioEngineEvents = useCallback(
    () => dispatch(clearEvents()),
    [dispatch],
  )

  const dispatchSubscriptionEvent = useCallback(
    (
      nodeId: PublishEventArgs['nodeId'],
      subscriptionPayload: PublishEventArgs['subscriptionPayload'],
    ) => dispatch(publishSubscriptionEvent({ nodeId, subscriptionPayload })),
    [dispatch],
  )

  useEffect(() => {
    if (!audioContext) return

    void registerWorklets(audioContext).then(() => setWorkletsReady(true))
  }, [audioContext])

  return workletsReady ? (
    <BaseAudioEngine
      audioContext={audioContext}
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

const registerWorklets = async (context: AudioContext) => {
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

type PublishEventArgs = Parameters<typeof publishSubscriptionEvent>[0]
