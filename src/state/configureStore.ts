import { applyMiddleware, combineReducers, createStore, Store } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import thunk from 'redux-thunk'

import audioContexts, { AudioContextsState } from './audioContexts/reducer'
import audioEffects, { AudioEffectsState } from './audioEffects/reducer'
import audioEngine from './audioEngine/reducer'
import audioFiles, { AudioFilesState } from './audioFiles/reducer'
import connections, { ConnectionsState } from './connections/reducer'
import globalPlayback, { GlobalPlaybackState } from './globalPlayback/reducer'
import instruments, { InstrumentsState } from './instruments/reducer'

const middlewares = [thunk]
const composeEnhancers = composeWithDevTools({})

export interface ApplicationState {
  audioContexts: AudioContextsState
  audioEffects: AudioEffectsState
  audioFiles: AudioFilesState
  connections: ConnectionsState
  globalPlayback: GlobalPlaybackState
  instruments: InstrumentsState
}

export type ApplicationStore = Store<ApplicationState>

export const configureStore = (initialState = {}): ApplicationStore =>
  createStore(
    combineReducers({
      audioContexts,
      audioEffects,
      audioEngine,
      audioFiles,
      connections,
      globalPlayback,
      instruments,
    }),
    initialState,
    composeEnhancers(applyMiddleware(...middlewares)),
  )
