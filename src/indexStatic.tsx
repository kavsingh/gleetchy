import React from 'react'
import { cache } from 'emotion'
import { CacheProvider } from '@emotion/core'
import { renderStylesToString } from 'emotion-server'
import { renderToString } from 'react-dom/server'

import { ApplicationState, configureStore } from '~/state/configureStore'

import Main from './Main'

export default (initialState: Partial<ApplicationState> = {}) =>
  renderStylesToString(
    renderToString(
      <CacheProvider value={cache}>
        <Main store={configureStore(initialState)} />,
      </CacheProvider>,
    ),
  )
