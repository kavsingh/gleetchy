import 'babel-polyfill'
import './index.css'
import { once } from 'ramda'
import { docReady } from './util'
import gleetchy from './gleetchy'

docReady().then(once(gleetchy))
