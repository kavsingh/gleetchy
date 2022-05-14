import { createSlice, isAnyOf } from '@reduxjs/toolkit'

import { getAudioContext } from '~/apis/audio'

import { decodeAudioFile } from '../audio-files/actions'
import {
  addAudioNode,
  duplicateAudioNode,
  removeAudioNode,
  updateAudioNodeProps,
} from '../audio-nodes/actions'
import {
  addConnection,
  removeConnection,
  toggleConnection,
} from '../connections/actions'
import { togglePlayback } from '../global-playback/actions'

import type { PayloadAction } from '@reduxjs/toolkit'

const initialState: AudioEngineState = { events: [], subscriptionData: {} }

export const audioEngineSlice = createSlice({
  initialState,
  name: 'audioEngine',
  reducers: {
    initAudioContext: (state) => {
      const context = state.audioContext

      if (!context || context.state === 'closed') {
        state.audioContext = getAudioContext()

        return
      }

      if (context?.state === 'suspended') void context.resume()
    },
    clearEvents: (state) => {
      state.events = []
    },
    publishSubscriptionEvent: (
      state,
      {
        payload: { nodeId, subscriptionPayload },
      }: PayloadAction<{ nodeId: string; subscriptionPayload: unknown }>,
    ) => {
      state.subscriptionData[nodeId] = Object.assign(
        state.subscriptionData[nodeId] ?? {},
        subscriptionPayload,
      )
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(isAnyOf(...sourceActions), (state, action) => {
      state.events.push(action)
    })
  },
})

const sourceActions = [
  addAudioNode,
  removeAudioNode,
  duplicateAudioNode,
  updateAudioNodeProps,
  addConnection,
  removeConnection,
  toggleConnection,
  togglePlayback,
  decodeAudioFile.fulfilled,
] as const

interface AudioEngineState {
  events: unknown[]
  subscriptionData: { [nodeId: string]: { [key: string]: unknown } }
  audioContext?: AudioContext
}
