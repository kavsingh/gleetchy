import { connect } from 'react-redux'
import { __ } from 'ramda'
import { getConnectionsFor } from '~/util/audio'
import {
  instrumentsSelector,
  activeInstrumentsSelector,
} from '~/state/instruments/selectors'
import { connectionsSelector } from '~/state/connections/selectors'
import {
  selectAudioFileAction,
  receiveAudioFileAction,
} from '~/state/audioFiles/actions'
import {
  addLoopAction,
  removeInstrumentAction,
  updateInstrumentLabelAction,
  updateInstrumentPropsAction,
} from '~/state/instruments/actions'
import InstrumentsRack from './InstrumentsRack'

export default connect(
  state => ({
    instruments: instrumentsSelector(state),
    activeInstruments: activeInstrumentsSelector(state),
    getConnections: getConnectionsFor(__, connectionsSelector(state)),
  }),
  dispatch => ({
    loopSelectFile: id => dispatch(selectAudioFileAction(id)),
    loopReceiveFile: (id, file) => dispatch(receiveAudioFileAction(id, file)),
    updateInstrument: (id, props) =>
      dispatch(updateInstrumentPropsAction(id, props)),
    updateInstrumentLabel: (id, label) =>
      dispatch(updateInstrumentLabelAction(id, label)),
    addLoop: () => dispatch(addLoopAction()),
    removeInstrument: id => dispatch(removeInstrumentAction(id)),
  }),
)(InstrumentsRack)
