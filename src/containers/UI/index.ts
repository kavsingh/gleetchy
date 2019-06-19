import { connect } from 'react-redux'
import { Action } from 'redux'
import { ThunkDispatch } from 'redux-thunk'

import { ApplicationState } from '~/state/configureStore'
import { toggleGlobalPlaybackAction } from '~/state/globalPlayback/actions'
import { isPlayingSelector } from '~/state/globalPlayback/selectors'
import { toggleDarkLightUIThemes } from '~/state/ui/actions'
import { uiThemeSelector } from '~/state/ui/selectors'

import UI from './UI'

export default connect(
  (state: ApplicationState) => ({
    isPlaying: isPlayingSelector(state),
    theme: uiThemeSelector(state),
  }),
  (dispatch: ThunkDispatch<ApplicationState, undefined, Action>) => ({
    togglePlayback: () => dispatch(toggleGlobalPlaybackAction()),
    changeTheme: () => dispatch(toggleDarkLightUIThemes()),
  }),
)(UI)
