import { applyMiddleware, combineReducers, createStore, Store } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import thunk from 'redux-thunk'

import audioEngine, { AudioEngineState } from './audioEngine/reducer'
import { AudioEngineAction } from './audioEngine/types'
import audioFiles, { AudioFilesState } from './audioFiles/reducer'
import { AudioFilesAction } from './audioFiles/types'
import connections, { ConnectionsState } from './connections/reducer'
import { ConnectionsAction } from './connections/types'
import globalPlayback, { GlobalPlaybackState } from './globalPlayback/reducer'
import { GlobalPlaybackAction } from './globalPlayback/types'
import audioNodes, { AudioNodesState } from './audioNodes/reducer'
import { AudioNodesAction } from './audioNodes/types'
import ui, { UIState } from './ui/reducer'
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
      audioEngine,
      audioFiles,
      audioNodes,
      connections,
      globalPlayback,
      ui,
    }),
    initialState,
    composeEnhancers(applyMiddleware(...middlewares)),
  )
