import 'babel-polyfill'
import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { configureStore } from './state/configureStore'
import GleetchyEngine from './containers/GleetchyEngine'
import GleetchyUI from './containers/GleetchyUI'

const container = document.createElement('div')
document.body.appendChild(container)

const store = configureStore()

const App = () => (
  <div>
    <GleetchyEngine />
    <GleetchyUI />
    <style jsx>{`
      :global(html) {
        box-sizing: border-box;
        user-select: none;
        font-size: 14px;
        -webkit-font-smoothing: antialiased;
      }

      :global(*),
      :global(*::before),
      :global(*::after) {
        box-sizing: inherit;
        user-select: inherit;
      }

      :global(*:focus),
      :global(*:active) {
        outline: none;
      }

      :global(html),
      :global(body) {
        width: 100%;
        padding: 0;
        margin: 0;
      }

      :global(body) {
        font-family: -apple-system, BlinkMacSystemFont, sans-serif;
      }
    `}</style>
  </div>
)

render(
  <Provider store={store}>
    <App />
  </Provider>,
  container,
)
