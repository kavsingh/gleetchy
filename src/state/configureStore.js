import { createStore, combineReducers, applyMiddleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import thunk from 'redux-thunk'
import globalPlayback from './globalPlayback/reducer'
import audioContexts from './audioContexts/reducer'
import instruments from './instruments/reducer'
import fx from './fx/reducer'
import connections from './connections/reducer'
import audioFiles from './audioFiles/reducer'
import audioEngine from './audioEngine/reducer'

const middlewares = [thunk]
const composeEnhancers = composeWithDevTools({})

export const configureStore = (initialState = {}) =>
  createStore(
    combineReducers({
      globalPlayback,
      audioContexts,
      instruments,
      fx,
      connections,
      audioFiles,
      audioEngine,
    }),
    initialState,
    composeEnhancers(applyMiddleware(...middlewares)),
  )
