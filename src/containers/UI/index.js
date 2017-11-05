import { connect } from 'react-redux'
import { toggleGlobalPaybackAction } from '../../state/globalPlayback/actions'
import { isPlayingSelector } from '../../state/globalPlayback/selectors'
import UI from './UI'

export default connect(
  state => ({
    isPlaying: isPlayingSelector(state),
  }),
  dispatch => ({
    togglePlayback: () => dispatch(toggleGlobalPaybackAction()),
  }),
)(UI)
