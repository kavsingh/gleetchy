import React, { memo, StatelessComponent } from 'react'

import AnimIn from '~/components/AnimIn'
import { nodeType as delayType } from '~/nodes/audioEffects/delay'
import { nodeType as reverbType } from '~/nodes/audioEffects/reverb'
import { AudioNodeIdentifier } from '~/types'
import { noop } from '~/util/function'
import { cssLabeled } from '~/util/style'

import ConnectedDelay from './ConnectedDelay'
import ConnectedReverb from './ConnectedReverb'

const classes = cssLabeled('audioEffectsRack', {
  root: {
    alignItems: 'flex-start',
    display: 'flex',
    flexWrap: 'wrap',
    width: '100%',
  },

  audioEffectContainer: {
    flex: '1 0 10em',
    padding: '1em 0',
  },

  addAudioEffectContainer: {
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'center',
    minHeight: '5em',
    padding: '1em 0',
    width: '100%',
  },

  addAudioEffectButton: {
    cursor: 'pointer',
    fontSize: '0.8em',
  },
})

export interface AudioEffectsRackProps {
  audioEffects: AudioNodeIdentifier[]
  addReverb(): unknown
  addDelay(): unknown
}

type EffectAddButton = [string, () => void]

const AudioEffectsRack: StatelessComponent<AudioEffectsRackProps> = ({
  audioEffects = [],
  addReverb = noop,
  addDelay = noop,
}) => (
  <div className={classes.root}>
    {audioEffects.map(({ id, type }) => {
      switch (type) {
        case delayType:
          return (
            <div className={classes.audioEffectContainer} key={id}>
              <AnimIn>
                <ConnectedDelay id={id} />
              </AnimIn>
            </div>
          )
        case reverbType:
          return (
            <div className={classes.audioEffectContainer} key={id}>
              <AnimIn>
                <ConnectedReverb id={id} />
              </AnimIn>
            </div>
          )
        default:
          return null
      }
    })}
    <div className={classes.addAudioEffectContainer}>
      {([['Reverb', addReverb], ['Delay', addDelay]] as EffectAddButton[]).map(
        ([type, handler]) => (
          <div
            className={classes.addAudioEffectButton}
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
        ),
      )}
    </div>
  </div>
)

export default memo(AudioEffectsRack)
