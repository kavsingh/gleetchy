import React, { FunctionComponent, useCallback } from 'react'
import styled from '@emotion/styled'

import AnimIn from '~/components/anim-in'
import { nodeType as delayType } from '~/nodes/audio-effects/delay'
import { nodeType as reverbType } from '~/nodes/audio-effects/reverb'
import useAudioNodesMeta from '~/state/hooks/use-audio-nodes-meta'
import useAudioNodes from '~/state/hooks/use-audio-nodes'
import AddNodeButtons from '~/components/add-node-buttons'
import ErrorBoundary from '~/components/error-boundary'

import ConnectedDelay from './connected-delay'
import ConnectedReverb from './connected-reverb'

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  width: 100%;
`

const AudioEffectContainer = styled(AnimIn)`
  flex: 1 0 10em;
  padding: 1em 0;
`

const RackMount: FunctionComponent = ({ children }) => (
  <AudioEffectContainer>
    <ErrorBoundary>{children}</ErrorBoundary>
  </AudioEffectContainer>
)

const Rack: FunctionComponent = () => {
  const [{ audioEffects }] = useAudioNodesMeta()

  return (
    <>
      {audioEffects.map(({ id, type }) => {
        switch (type) {
          case delayType:
            return (
              <RackMount key={id}>
                <ConnectedDelay id={id} />
              </RackMount>
            )
          case reverbType:
            return (
              <RackMount key={id}>
                <ConnectedReverb id={id} />
              </RackMount>
            )
          default:
            return null
        }
      })}
    </>
  )
}

const Add: FunctionComponent = () => {
  const [, { addNode }] = useAudioNodes()

  const addReverb = useCallback(() => addNode(reverbType), [addNode])
  const addDelay = useCallback(() => addNode(delayType), [addNode])

  return (
    <AddNodeButtons
      buttons={[
        ['Reverb', addReverb],
        ['Delay', addDelay],
      ]}
    />
  )
}

const AudioEffectsRack: FunctionComponent = () => (
  <Container>
    <Rack />
    <Add />
  </Container>
)

export default AudioEffectsRack
