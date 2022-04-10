import type { ActionCreator } from 'redux'
import type {
  GlobalPlaybackStartAction,
  GlobalPlaybackStopAction,
  GlobalPlaybackToggleAction,
} from './types'

export const startGlobalPlaybackAction: ActionCreator<
  GlobalPlaybackStartAction
> = () => ({
  type: 'GLOBAL_PLAYBACK_START',
})

export const stopGlobalPlaybackAction: ActionCreator<
  GlobalPlaybackStopAction
> = () => ({
  type: 'GLOBAL_PLAYBACK_STOP',
})

export const toggleGlobalPlaybackAction: ActionCreator<
  GlobalPlaybackToggleAction
> = () => ({
  type: 'GLOBAL_PLAYBACK_TOGGLE',
})
