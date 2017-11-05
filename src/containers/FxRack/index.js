import { connect } from 'react-redux'
import { __ } from 'ramda'
import { getConnectionsFor } from '../../util/audio'
import { fxSelector, activeFxSelector } from '../../state/fx/selectors'
import { connectionsSelector } from '../../state/connections/selectors'
import {
  updateFxPropsAction,
  updateFxLabelAction,
  addReverbAction,
  addDelayAction,
  removeFxAction,
} from '../../state/fx/actions'
import FxRack from './FxRack'

export default connect(
  state => ({
    fx: fxSelector(state),
    activeFx: activeFxSelector(state),
    getConnections: getConnectionsFor(__, connectionsSelector(state)),
  }),
  dispatch => ({
    updateFx: (id, props) => dispatch(updateFxPropsAction(id, props)),
    updateFxLabel: (id, label) => dispatch(updateFxLabelAction(id, label)),
    addReverb: () => dispatch(addReverbAction()),
    addDelay: () => dispatch(addDelayAction()),
    removeFx: id => dispatch(removeFxAction(id)),
  }),
)(FxRack)
