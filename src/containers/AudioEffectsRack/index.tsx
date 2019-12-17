import React, { FunctionComponent, useCallback } from 'react'
import { css } from '@emotion/core'

import AnimIn from '~/components/AnimIn'
import { nodeType as delayType } from '~/nodes/audioEffects/delay'
import { nodeType as reverbType } from '~/nodes/audioEffects/reverb'
import useAudioNodesMeta from '~/state/hooks/useAudioNodesMeta'
import useAudioNodes from '~/state/hooks/useAudioNodes'
import AddNodeButtons from '~/components/AddNodeButtons'
import ErrorBoundary from '~/components/ErrorBoundary'

import ConnectedDelay from './ConnectedDelay'
import ConnectedReverb from './ConnectedReverb'

const rootStyle = css({
  alignItems: 'flex-start',
  display: 'flex',
  flexWrap: 'wrap',
  width: '100%',
})

const audioEffectContainerStyle = css({
  flex: '1 0 10em',
  padding: '1em 0',
})

const Rack: FunctionComponent = () => {
  const [{ audioEffects }] = useAudioNodesMeta()

  return (
    <ErrorBoundary>
      {audioEffects.map(({ id, type }) => {
        switch (type) {
          case delayType:
            return (
              <div css={audioEffectContainerStyle} key={id}>
                <AnimIn>
                  <ConnectedDelay id={id} />
                </AnimIn>
              </div>
            )
          case reverbType:
            return (
              <div css={audioEffectContainerStyle} key={id}>
                <AnimIn>
                  <ConnectedReverb id={id} />
                </AnimIn>
              </div>
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
  <div css={rootStyle}>
    <Rack />
    <Add />
  </div>
)

export default AudioEffectsRack
