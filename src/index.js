import 'babel-polyfill'
import './index.css'
import React from 'react'
import { render } from 'react-dom'
import Gleetchy from './containers/Gleetchy'

const container = document.createElement('div')
document.body.appendChild(container)

render(<Gleetchy />, container)
