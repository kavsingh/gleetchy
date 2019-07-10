import React, { FunctionComponent, useCallback } from 'react'
import { css } from '@emotion/core'

import AnimIn from '~/components/AnimIn'
import { nodeType as delayType } from '~/nodes/audioEffects/delay'
import { nodeType as reverbType } from '~/nodes/audioEffects/reverb'
import useAudioNodesMeta from '~/hooks/useAudioNodesMeta'

import ConnectedDelay from './ConnectedDelay'
import ConnectedReverb from './ConnectedReverb'
import useAudioNodes from '~/hooks/useAudioNodes'

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

const addAudioEffectContainerStyle = css({
  alignItems: 'center',
  display: 'flex',
  justifyContent: 'center',
  minHeight: '5em',
  padding: '1em 0',
  width: '100%',
})

const addAudioEffectButtonStyle = css({
  cursor: 'pointer',
  fontSize: '0.8em',
})

type EffectAddButton = [string, () => void]

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
      <div css={addAudioEffectContainerStyle}>
        {([
          ['Reverb', addReverb],
          ['Delay', addDelay],
        ] as EffectAddButton[]).map(([type, handler]) => (
          <div
            css={addAudioEffectButtonStyle}
            role="button"
            tabIndex={0}
            onClick={handler}
            onKeyDown={event => {
              if (event.key === 'Enter') {
                handler()
              }
            }}
            key={type}
          >
            [ Add {type} ]
          </div>
        ))}
      </div>
    </div>
  )
}

export default AudioEffectsRack
