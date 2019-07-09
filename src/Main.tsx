import React, { FunctionComponent, memo } from 'react'
import { Provider } from 'react-redux'

import { ApplicationStore } from '~/state/configureStore'
import AudioEngine from '~/containers/AudioEngine'
import UI from '~/containers/UI'

const Main: FunctionComponent<{ store: ApplicationStore }> = ({ store }) => (
  <Provider store={store}>
    <AudioEngine />
    <UI />
  </Provider>
)

export default memo(Main)
