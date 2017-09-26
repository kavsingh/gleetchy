import 'babel-polyfill'
import './index.css'
import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { configureStore } from './state/configureStore'
import Gleetchy from './containers/Gleetchy'

const container = document.createElement('div')
document.body.appendChild(container)

const store = configureStore()

render(
  <Provider store={store}>
    <Gleetchy />
  </Provider>,
  container,
)
