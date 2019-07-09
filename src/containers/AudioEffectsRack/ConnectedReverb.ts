import { connect } from 'react-redux'
import { Dispatch } from 'redux'

import { nodeType, UI as Reverb } from '~/nodes/audioEffects/reverb'
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
  const reverb = audioEffectsSelector(state)[id]

  if (!reverb) {
    throw new Error(`Reverb not found at id ${id}`)
  }

  if (reverb.type !== nodeType) {
    throw new Error(
      `Unexpected effect type for ${id}, expected ${nodeType}, got ${reverb.type}`,
    )
  }

  const { audioProps: props, label } = reverb

  return {
    connections: getConnectionsFor(id, connectionsSelector(state)),
    isActive: activeAudioEffectsSelector(state).includes(id),
    label,
    wetDryRatio: props.wetDryRatio,
  }
}

const mapDispatchToProps = (dispatch: Dispatch, { id }: { id: string }) => ({
  onLabelChange: (label: string) =>
    dispatch(updateAudioEffectLabelAction(id, label)),
  onWetDryRatioChange: (wetDryRatio: number) =>
    dispatch(updateAudioEffectPropsAction(id, { wetDryRatio })),
  remove: () => dispatch(removeAudioEffectAction(id)),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Reverb)
