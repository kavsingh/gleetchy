import 'babel-polyfill'
import './index.css'
import Inferno, { render } from 'inferno'
import Gleetchy from './containers/Gleetchy'

const container = document.createElement('div')
document.body.appendChild(container)

render(<Gleetchy />, container)
