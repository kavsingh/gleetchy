import { applyMiddleware, combineReducers, createStore, Store } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import thunk from 'redux-thunk'

import audioContexts, { AudioContextsState } from './audioContexts/reducer'
import audioEffects, { AudioEffectsState } from './audioEffects/reducer'
import audioEngine from './audioEngine/reducer'
import audioFiles from './audioFiles/reducer'
import connections from './connections/reducer'
import globalPlayback from './globalPlayback/reducer'
import instruments from './instruments/reducer'

const middlewares = [thunk]
const composeEnhancers = composeWithDevTools({})

export interface ApplicationState {
  audioContexts: AudioContextsState
  audioEffects: AudioEffectsState
}

export type ApplicationStore = Store<ApplicationState>

export const configureStore = (initialState = {}): ApplicationStore =>
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
