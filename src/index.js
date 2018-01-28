import React from 'react'
import dom from 'react-dom'

import offlineInstall from '~/util/offlineInstall'
import { configureStore } from '~/state/configureStore'

import Main, { applyGlobalStyles } from './Main'

const store = configureStore()

applyGlobalStyles()
offlineInstall('gleetchy-sw.js', '')
;(typeof dom.hydrate === 'function' ? dom.hydrate : dom.render)(
  <Main store={store} />,
  document.getElementById('app-root'),
)
