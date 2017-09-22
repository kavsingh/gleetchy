import 'babel-polyfill'
import { once, docReady } from './util'
// import simpleOsc from './simpleOsc'
// import audioLoop from './audioLoop'
import gleetchy from './gleetchy'

docReady().then(once(gleetchy))
