import 'babel-polyfill'
import './index.css'
import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { configureStore } from './state/configureStore'
import GleetchyEngine from './containers/GleetchyEngine'
import GleetchyUI from './containers/GleetchyUI'

const container = document.createElement('div')
document.body.appendChild(container)

const store = configureStore()

render(
  <Provider store={store}>
    <div>
      <GleetchyEngine />
      <GleetchyUI />
    </div>
  </Provider>,
  container,
)
