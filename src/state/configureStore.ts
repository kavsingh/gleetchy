import { applyMiddleware, combineReducers, createStore } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import thunk from 'redux-thunk'

import audioContexts from './audioContexts/reducer'
import audioEffects from './audioEffects/reducer'
import audioEngine from './audioEngine/reducer'
import audioFiles from './audioFiles/reducer'
import connections from './connections/reducer'
import globalPlayback from './globalPlayback/reducer'
import instruments from './instruments/reducer'

const middlewares = [thunk]
const composeEnhancers = composeWithDevTools({})

export const configureStore = (initialState = {}) =>
  createStore(
    combineReducers({
      audioContexts,
      audioEffects,
      audioEngine,
      audioFiles: audioFiles as any,
      connections,
      globalPlayback,
      instruments,
    }),
    initialState,
    composeEnhancers(applyMiddleware(...middlewares)),
  )
