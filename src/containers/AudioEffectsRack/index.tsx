import React, { FunctionComponent, useCallback } from 'react'
import { css } from '@emotion/core'

import AnimIn from '~/components/AnimIn'
import { nodeType as delayType } from '~/nodes/audioEffects/delay'
import { nodeType as reverbType } from '~/nodes/audioEffects/reverb'
import useAudioNodesMeta from '~/hooks/useAudioNodesMeta'

import ConnectedDelay from './ConnectedDelay'
import ConnectedReverb from './ConnectedReverb'
import useAudioNodes from '~/hooks/useAudioNodes'
import AddNodeButtons from '~/components/AddNodeButtons'

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

const AudioEffectsRack: FunctionComponent = () => {
  const { audioEffects } = useAudioNodesMeta()
  const { add } = useAudioNodes()

  const addReverb = useCallback(() => add(reverbType), [add])
  const addDelay = useCallback(() => add(delayType), [add])

  return (
    <div css={rootStyle}>
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
      <AddNodeButtons buttons={[['Reverb', addReverb], ['Delay', addDelay]]} />
    </div>
  )
}

export default AudioEffectsRack
