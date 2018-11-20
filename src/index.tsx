import React from 'react'
import { render } from 'react-dom'

import { ApplicationStore, configureStore } from '~/state/configureStore'
import offlineInstall from '~/util/offlineInstall'

import Main, { applyGlobalStyles } from './Main'

const store: ApplicationStore = configureStore()

applyGlobalStyles()
offlineInstall('gleetchy-sw.js', '')
render(<Main store={store} />, document.getElementById('app-root'))
