import type { Action } from 'redux'

export type GlobalPlaybackStartAction = Action<'GLOBAL_PLAYBACK_START'>

export type GlobalPlaybackStopAction = Action<'GLOBAL_PLAYBACK_STOP'>

export type GlobalPlaybackToggleAction = Action<'GLOBAL_PLAYBACK_TOGGLE'>

export type GlobalPlaybackAction =
  | GlobalPlaybackStartAction
  | GlobalPlaybackStopAction
  | GlobalPlaybackToggleAction
