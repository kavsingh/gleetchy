import React from 'react'
import { hydrate } from 'react-dom'

import offlineInstall from '~/util/offlineInstall'
import { configureStore } from '~/state/configureStore'

import Main, { applyGlobalStyles } from './Main'

const store = configureStore()

applyGlobalStyles()
offlineInstall('gleetchy-sw.js', '')
hydrate(<Main store={store} />, document.getElementById('app-root'))
