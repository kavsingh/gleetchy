import { configureStore } from '@reduxjs/toolkit'

import { globalPlaybackSlice } from './global-playback/slice'
import { audioFilesSlice } from './audio-files/slice'
import { audioNodesSlice } from './audio-nodes/slice'
import { connectionsSlice } from './connections/slice'
import { uiSlice } from './ui/slice'
import { audioEngineReducer } from './audio-engine/reducer'

import type { StateFromReducersMapObject } from '@reduxjs/toolkit'

const reducer = {
  [globalPlaybackSlice.name]: globalPlaybackSlice.reducer,
  [audioFilesSlice.name]: audioFilesSlice.reducer,
  [audioNodesSlice.name]: audioNodesSlice.reducer,
  [connectionsSlice.name]: connectionsSlice.reducer,
  [uiSlice.name]: uiSlice.reducer,
  audioEngine: audioEngineReducer,
} as const

export const createStore = (
  preloadedState: Partial<StateFromReducersMapObject<typeof reducer>> = {},
) =>
  configureStore({
    reducer,
    preloadedState,
    devTools: process.env.NODE_ENV !== 'production',
  })

export type AppStore = ReturnType<typeof createStore>
export type AppState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']
