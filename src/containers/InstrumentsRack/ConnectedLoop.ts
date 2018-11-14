import { connect } from 'react-redux'

import { UI as Loop } from '~/nodes/instruments/loop'
import { LoopProps } from '~/nodes/instruments/loop/UI'
import {
  receiveAudioFileAction,
  selectAudioFileAction,
} from '~/state/audioFiles/actions'
import { ApplicationState } from '~/state/configureStore'
import { connectionsSelector } from '~/state/connections/selectors'
import {
  removeInstrumentAction,
  updateInstrumentLabelAction,
  updateInstrumentPropsAction,
} from '~/state/instruments/actions'
import {
  activeInstrumentsSelector,
  instrumentsSelector,
} from '~/state/instruments/selectors'
import { getConnectionsFor } from '~/util/audio'

type StateProps = Pick<
  LoopProps,
  | 'audioBuffer'
  | 'connections'
  | 'fileName'
  | 'label'
  | 'gain'
  | 'highGain'
  | 'isActive'
  | 'loopEnd'
  | 'loopStart'
  | 'lowGain'
  | 'midGain'
  | 'playbackRate'
>

type DispatchProps = Pick<
  LoopProps,
  | 'onEqChange'
  | 'onGainChange'
  | 'onLabelChange'
  | 'onLoopRegionChange'
  | 'onPlaybackRateChange'
  | 'receiveAudioFile'
  | 'remove'
  | 'selectAudioFile'
>

export default connect(
  (state: ApplicationState, { id }: { id: string }): StateProps => {
    const loop = instrumentsSelector(state)[id]

    if (!loop) {
      throw new Error(`Loop not found at id ${id}`)
    }

    if (loop.type !== 'INSTRUMENT_LOOP') {
      throw new Error(
        `Unexpected instrument type for ${id}, expected INSTRUMENT_LOOP, got ${
          loop.type
        }`,
      )
    }

    const { props, label } = loop

    return {
      audioBuffer: props.audioBuffer,
      connections: getConnectionsFor(id, connectionsSelector(state)),
      fileName: props.fileName,
      gain: props.gain,
      highGain: props.highGain,
      isActive: activeInstrumentsSelector(state).includes(id),
      label,
      loopEnd: props.loopEnd,
      loopStart: props.loopStart,
      lowGain: props.lowGain,
      midGain: props.midGain,
      playbackRate: props.playbackRate,
    }
  },
  (dispatch: any, { id }: { id: string }): DispatchProps => ({
    onEqChange: (eqProps: any) =>
      dispatch(updateInstrumentPropsAction(id, eqProps)),
    onGainChange: (gain: number) =>
      dispatch(updateInstrumentPropsAction(id, { gain })),
    onLabelChange: (label: string) =>
      dispatch(updateInstrumentLabelAction(id, label)),
    onLoopRegionChange: (loopStart: number, loopEnd: number) =>
      dispatch(updateInstrumentPropsAction(id, { loopStart, loopEnd })),
    onPlaybackRateChange: (playbackRate: number) =>
      dispatch(updateInstrumentPropsAction(id, { playbackRate })),
    receiveAudioFile: (file: File) =>
      dispatch(receiveAudioFileAction(id, file)),
    remove: () => dispatch(removeInstrumentAction(id)),
    selectAudioFile: () => dispatch(selectAudioFileAction(id)),
  }),
)(Loop)
