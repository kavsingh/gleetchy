import { applyMiddleware, combineReducers, createStore, Store } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import thunk from 'redux-thunk'

import audioContexts, { AudioContextsState } from './audioContexts/reducer'
import { AudioContextsAction } from './audioContexts/types'
import audioEffects, { AudioEffectsState } from './audioEffects/reducer'
import { AudioEffectsAction } from './audioEffects/types'
import audioEngine, { AudioEngineState } from './audioEngine/reducer'
import { AudioEngineAction } from './audioEngine/types'
import audioFiles, { AudioFilesState } from './audioFiles/reducer'
import { AudioFilesAction } from './audioFiles/types'
import connections, { ConnectionsState } from './connections/reducer'
import { ConnectionsAction } from './connections/types'
import globalPlayback, { GlobalPlaybackState } from './globalPlayback/reducer'
import { GlobalPlaybackAction } from './globalPlayback/types'
import instruments, { InstrumentsState } from './instruments/reducer'
import { InstrumentsAction } from './instruments/types'
import ui, { UIState } from './ui/reducer'
import { UIAction } from './ui/types'

const middlewares = [thunk]
const composeEnhancers = composeWithDevTools({})

export interface ApplicationState {
  audioContexts: AudioContextsState
  audioEffects: AudioEffectsState
  audioEngine: AudioEngineState
  audioFiles: AudioFilesState
  connections: ConnectionsState
  globalPlayback: GlobalPlaybackState
  instruments: InstrumentsState
  ui: UIState
}

export type ApplicationAction =
  | AudioContextsAction
  | AudioEffectsAction
  | AudioEngineAction
  | AudioFilesAction
  | ConnectionsAction
  | GlobalPlaybackAction
  | InstrumentsAction
  | UIAction

export type ApplicationStore = Store<ApplicationState, ApplicationAction>

export const configureStore = (
  initialState: Partial<ApplicationState> = {},
): ApplicationStore =>
  createStore(
    combineReducers({
      audioContexts,
      audioEffects,
      audioEngine,
      audioFiles,
      connections,
      globalPlayback,
      instruments,
      ui,
    }),
    initialState,
    composeEnhancers(applyMiddleware(...middlewares)),
  )
