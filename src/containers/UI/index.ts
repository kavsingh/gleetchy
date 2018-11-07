import { connect } from 'react-redux'
import { Action } from 'redux'
import { ThunkDispatch } from 'redux-thunk'

import { ApplicationState } from '~/state/configureStore'
import { toggleGlobalPlaybackAction } from '~/state/globalPlayback/actions'
import { isPlayingSelector } from '~/state/globalPlayback/selectors'

import UI from './UI'

export default connect(
  (state: ApplicationState) => ({
    isPlaying: isPlayingSelector(state),
  }),
  (dispatch: ThunkDispatch<ApplicationState, undefined, Action<any>>) => ({
    togglePlayback: () => dispatch(toggleGlobalPlaybackAction()),
  }),
)(UI)
