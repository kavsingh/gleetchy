import React, { FunctionComponent, useCallback } from 'react'
import styled from '@emotion/styled'

import AnimIn from '~/components/AnimIn'
import { nodeType as delayType } from '~/nodes/audioEffects/delay'
import { nodeType as reverbType } from '~/nodes/audioEffects/reverb'
import useAudioNodesMeta from '~/state/hooks/useAudioNodesMeta'
import useAudioNodes from '~/state/hooks/useAudioNodes'
import AddNodeButtons from '~/components/AddNodeButtons'
import ErrorBoundary from '~/components/ErrorBoundary'

import ConnectedDelay from './ConnectedDelay'
import ConnectedReverb from './ConnectedReverb'

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

const Rack: FunctionComponent = () => {
  const [{ audioEffects }] = useAudioNodesMeta()

  return (
    <ErrorBoundary>
      {audioEffects.map(({ id, type }) => {
        switch (type) {
          case delayType:
            return (
              <AudioEffectContainer key={id}>
                <ConnectedDelay id={id} />
              </AudioEffectContainer>
            )
          case reverbType:
            return (
              <AudioEffectContainer key={id}>
                <ConnectedReverb id={id} />
              </AudioEffectContainer>
            )
          default:
            return null
        }
      })}
    </ErrorBoundary>
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
