import React, { StatelessComponent } from 'react'

import AnimIn from '~/components/AnimIn'
import { nodeType as delayType, UI as Delay } from '~/nodes/audioEffects/delay'
import {
  nodeType as reverbType,
  UI as Reverb,
} from '~/nodes/audioEffects/reverb'
import { AudioNodeConnection, AudioNodeState } from '~/types'
import { noop, stubArray } from '~/util/function'
import { cssLabeled } from '~/util/style'

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
  audioEffects: Array<
    AudioNodeState<{ wetDryRatio?: number; delayTime?: number }>
  >
  activeAudioEffects: string[]
  getConnections(id: string): AudioNodeConnection[]
  updateAudioEffect(id: string, props: any): void
  updateAudioEffectLabel(id: string, label: string): void
  removeAudioEffect(id: string): void
  addReverb(): void
  addDelay(): void
}

type EffectAddButton = [string, () => void]

const AudioEffectsRack: StatelessComponent<AudioEffectsRackProps> = ({
  audioEffects = [],
  activeAudioEffects = [],
  getConnections = stubArray,
  updateAudioEffect = noop,
  updateAudioEffectLabel = noop,
  removeAudioEffect = noop,
  addReverb = noop,
  addDelay = noop,
}) => (
  <div className={classes.root}>
    {audioEffects.map(({ id, type, props: effectProps, label }) => {
      switch (type) {
        case delayType:
          return (
            <div className={classes.audioEffectContainer} key={id}>
              <AnimIn>
                <Delay
                  label={label}
                  connections={getConnections(id)}
                  isActive={activeAudioEffects.includes(id)}
                  wetDryRatio={effectProps.wetDryRatio}
                  delayTime={effectProps.delayTime}
                  onDelayTimeChange={(delayTime: number) =>
                    updateAudioEffect(id, { delayTime })
                  }
                  onWetDryRatioChange={(wetDryRatio: number) =>
                    updateAudioEffect(id, { wetDryRatio })
                  }
                  onLabelChange={(val: string) =>
                    updateAudioEffectLabel(id, val)
                  }
                  remove={() => removeAudioEffect(id)}
                />
              </AnimIn>
            </div>
          )
        case reverbType:
          return (
            <div className={classes.audioEffectContainer} key={id}>
              <AnimIn>
                <Reverb
                  label={label}
                  connections={getConnections(id)}
                  isActive={activeAudioEffects.includes(id)}
                  wetDryRatio={effectProps.wetDryRatio}
                  onWetDryRatioChange={(wetDryRatio: number) =>
                    updateAudioEffect(id, { wetDryRatio })
                  }
                  onLabelChange={(val: string) =>
                    updateAudioEffectLabel(id, val)
                  }
                  remove={() => removeAudioEffect(id)}
                />
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

export default AudioEffectsRack
