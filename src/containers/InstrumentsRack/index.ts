import { connect } from 'react-redux'

import { ApplicationState } from '~/state/configureStore'
import { addLoopAction } from '~/state/instruments/actions'
import { orderedInstrumentsSelector } from '~/state/instruments/selectors'

import InstrumentsRack from './InstrumentsRack'

export default connect(
  (state: ApplicationState) => ({
    instruments: orderedInstrumentsSelector(state),
  }),
  dispatch => ({ addLoop: () => dispatch(addLoopAction()) }),
)(InstrumentsRack)
