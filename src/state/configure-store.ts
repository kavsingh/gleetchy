import { applyMiddleware, combineReducers, createStore } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly'
import thunk from 'redux-thunk'
import type { Store } from 'redux'

import { audioEngineReducer } from './audio-engine/reducer'
import { audioFilesReducer } from './audio-files/reducer'
import { connectionsReducer } from './connections/reducer'
import { globalPlaybackReducer } from './global-playback/reducer'
import { audioNodesReducer } from './audio-nodes/reducer'
import { uiReducer } from './ui/reducer'
import type { AudioEngineState } from './audio-engine/reducer'
import type { AudioEngineAction } from './audio-engine/types'
import type { AudioFilesState } from './audio-files/reducer'
import type { AudioFilesAction } from './audio-files/types'
import type { ConnectionsState } from './connections/reducer'
import type { ConnectionsAction } from './connections/types'
import type { GlobalPlaybackState } from './global-playback/reducer'
import type { GlobalPlaybackAction } from './global-playback/types'
import type { AudioNodesState } from './audio-nodes/reducer'
import type { AudioNodesAction } from './audio-nodes/types'
import type { UIState } from './ui/reducer'
import type { UIAction } from './ui/types'

const middlewares = [thunk]
const composeEnhancers = composeWithDevTools({})

export interface ApplicationState {
  audioEngine: AudioEngineState
  audioFiles: AudioFilesState
  audioNodes: AudioNodesState
  connections: ConnectionsState
  globalPlayback: GlobalPlaybackState
  ui: UIState
}

export type ApplicationAction =
  | AudioEngineAction
  | AudioFilesAction
  | AudioNodesAction
  | ConnectionsAction
  | GlobalPlaybackAction
  | UIAction

export type ApplicationStore = Store<ApplicationState, ApplicationAction>

export const configureStore = (
  initialState: Partial<ApplicationState> = {},
): ApplicationStore =>
  createStore(
    combineReducers({
      audioEngine: audioEngineReducer,
      audioFiles: audioFilesReducer,
      audioNodes: audioNodesReducer,
      connections: connectionsReducer,
      globalPlayback: globalPlaybackReducer,
      ui: uiReducer,
    }),
    initialState,
    composeEnhancers(applyMiddleware(...middlewares)),
  )
