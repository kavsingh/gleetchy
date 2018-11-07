import { connect } from 'react-redux'
import { instrumentDescriptorsSelector } from '~/state/instruments/selectors'
import { addLoopAction } from '~/state/instruments/actions'

import InstrumentsRack from './InstrumentsRack'

export default connect(
  state => ({ instruments: instrumentDescriptorsSelector(state) }),
  dispatch => ({ addLoop: () => dispatch(addLoopAction()) }),
)(InstrumentsRack)
