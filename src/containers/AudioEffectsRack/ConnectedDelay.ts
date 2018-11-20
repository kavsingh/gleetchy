import { connect } from 'react-redux'
import { Dispatch } from 'redux'

import { nodeProps, nodeType, UI as Delay } from '~/nodes/audioEffects/delay'
import {
  removeAudioEffectAction,
  updateAudioEffectLabelAction,
  updateAudioEffectPropsAction,
} from '~/state/audioEffects/actions'
import {
  activeAudioEffectsSelector,
  audioEffectsSelector,
} from '~/state/audioEffects/selectors'
import { ApplicationState } from '~/state/configureStore'
import { connectionsSelector } from '~/state/connections/selectors'
import { getConnectionsFor } from '~/util/audio'

const mapStateToProps = (state: ApplicationState, { id }: { id: string }) => {
  const delay = audioEffectsSelector(state)[id]

  if (!delay) {
    throw new Error(`Delay not found at id ${id}`)
  }

  if (delay.type !== nodeType) {
    throw new Error(
      `Unexpected effect type for ${id}, expected ${nodeType}, got ${
        delay.type
      }`,
    )
  }

  const { props, label } = delay

  return {
    connections: getConnectionsFor(id, connectionsSelector(state)),
    delayTime: (props as typeof nodeProps).delayTime,
    isActive: activeAudioEffectsSelector(state).includes(id),
    label,
    wetDryRatio: props.wetDryRatio,
  }
}

const mapDispatchToProps = (dispatch: Dispatch, { id }: { id: string }) => ({
  onDelayTimeChange: (delayTime: number) =>
    dispatch(updateAudioEffectPropsAction(id, { delayTime })),
  onLabelChange: (label: string) =>
    dispatch(updateAudioEffectLabelAction(id, label)),
  onWetDryRatioChange: (wetDryRatio: number) =>
    dispatch(updateAudioEffectPropsAction(id, { wetDryRatio })),
  remove: () => dispatch(removeAudioEffectAction(id)),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Delay)
