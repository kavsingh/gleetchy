import React from 'react'

import PropTypes from '~/PropTypes'
import { noop, stubArray } from '~/util/function'
import { cssLabeled } from '~/util/style'
import AnimIn from '~/components/AnimIn'
import { UI as Delay, nodeType as delayType } from '~/nodes/audioEffects/delay'
import {
  UI as Reverb,
  nodeType as reverbType,
} from '~/nodes/audioEffects/reverb'

const classes = cssLabeled('audioEffectsRack', {
  root: {
    width: '100%',
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
  },

  audioEffectContainer: {
    flex: '1 0 10em',
    padding: '1em 0',
  },

  addAudioEffectContainer: {
    minHeight: '5em',
    padding: '1em 0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },

  addAudioEffectButton: {
    cursor: 'pointer',
    fontSize: '0.8em',
  },
})

const AudioEffectsRack = ({
  audioEffects,
  activeAudioEffects,
  updateAudioEffect,
  updateAudioEffectLabel,
  addReverb,
  addDelay,
  removeAudioEffect,
  getConnections,
}) => (
  <div className={classes.root}>
    {audioEffects.map(({ id, type, props, label }) => {
      switch (type) {
        case delayType:
          return (
            <div className={classes.audioEffectContainer} key={id}>
              <AnimIn>
                <Delay
                  label={label}
                  connections={getConnections(id)}
                  isActive={activeAudioEffects.includes(id)}
                  wetDryRatio={props.wetDryRatio}
                  delayTime={props.delayTime}
                  onDelayTimeChange={delayTime =>
                    updateAudioEffect(id, { delayTime })
                  }
                  onWetDryRatioChange={wetDryRatio =>
                    updateAudioEffect(id, { wetDryRatio })
                  }
                  onLabelChange={val => updateAudioEffectLabel(id, val)}
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
                  wetDryRatio={props.wetDryRatio}
                  onWetDryRatioChange={wetDryRatio =>
                    updateAudioEffect(id, { wetDryRatio })
                  }
                  onLabelChange={val => updateAudioEffectLabel(id, val)}
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
      {[['Reverb', addReverb], ['Delay', addDelay]].map(([type, handler]) => (
        <div
          className={classes.addAudioEffectButton}
          role="button"
          tabIndex={0}
          onClick={handler}
          onKeyDown={event => {
            if (event.key === 'Enter') handler()
          }}
          key={type}
        >
          [ Add {type} ]
        </div>
      ))}
    </div>
  </div>
)

AudioEffectsRack.propTypes = {
  audioEffects: PropTypes.arrayOf(PropTypes.shape({})),
  activeAudioEffects: PropTypes.arrayOf(PropTypes.string),
  getConnections: PropTypes.func,
  updateAudioEffect: PropTypes.func,
  updateAudioEffectLabel: PropTypes.func,
  removeAudioEffect: PropTypes.func,
  addReverb: PropTypes.func,
  addDelay: PropTypes.func,
}

AudioEffectsRack.defaultProps = {
  audioEffects: [],
  activeAudioEffects: [],
  getConnections: stubArray,
  updateAudioEffect: noop,
  updateAudioEffectLabel: noop,
  removeAudioEffect: noop,
  addReverb: noop,
  addDelay: noop,
}

export default AudioEffectsRack
