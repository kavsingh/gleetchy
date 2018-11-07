import React from 'react'
import { render } from 'react-dom'

import { ApplicationStore, configureStore } from '~/state/configureStore'
import offlineInstall from '~/util/offlineInstall'

import MainComp, { applyGlobalStyles } from './Main'

const store: ApplicationStore = configureStore()
const Main = MainComp as any

applyGlobalStyles()
offlineInstall('gleetchy-sw.js', '')
render(<Main store={store} />, document.getElementById('app-root'))
