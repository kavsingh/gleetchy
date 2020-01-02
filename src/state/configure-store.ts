import { applyMiddleware, combineReducers, createStore, Store } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import thunk from 'redux-thunk'

import { audioEngineReducer, AudioEngineState } from './audio-engine/reducer'
import { AudioEngineAction } from './audio-engine/types'
import { audioFilesReducer, AudioFilesState } from './audio-files/reducer'
import { AudioFilesAction } from './audio-files/types'
import { connectionsReducer, ConnectionsState } from './connections/reducer'
import { ConnectionsAction } from './connections/types'
import {
  globalPlaybackReducer,
  GlobalPlaybackState,
} from './global-playback/reducer'
import { GlobalPlaybackAction } from './global-playback/types'
import { audioNodesReducer, AudioNodesState } from './audio-nodes/reducer'
import { AudioNodesAction } from './audio-nodes/types'
import { uiReducer, UIState } from './ui/reducer'
import { UIAction } from './ui/types'

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
