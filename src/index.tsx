import React from 'react'
import { render } from 'react-dom'

import { configureStore } from '~/state/configureStore'
import offlineInstall from '~/util/offlineInstall'

import Main, { applyGlobalStyles } from './Main'

applyGlobalStyles()
offlineInstall('gleetchy-sw.js', '')
render(<Main store={configureStore()} />, document.getElementById('app-root'))
