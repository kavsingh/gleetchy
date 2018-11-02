import { ActionWithPayload } from '~/types'

export type AudioFileLoadStartAction = ActionWithPayload<
  'AUDIO_FILE_LOAD_START',
  { id: string }
>

export type AudioFileLoadErrorAction = ActionWithPayload<
  'AUDIO_FILE_LOAD_ERROR',
  { id: string; error: Error }
>

export type AudioFileLoadCompleteAction = ActionWithPayload<
  'AUDIO_FILE_LOAD_COMPLETE',
  { id: string; file: any; buffer: AudioBuffer }
>

export type AudioFileDecodeStartAction = ActionWithPayload<
  'AUDIO_FILE_DECODE_START',
  { id: string }
>

export type AudioFileDecodeErrorAction = ActionWithPayload<
  'AUDIO_FILE_DECODE_ERROR',
  { id: string; error: Error }
>

export type AudioFileDecodeCompleteAction = ActionWithPayload<
  'AUDIO_FILE_DECODE_COMPLETE',
  { id: string; file: any; buffer: AudioBuffer }
>

export type AudioFilesAction =
  | AudioFileLoadStartAction
  | AudioFileLoadErrorAction
  | AudioFileLoadCompleteAction
  | AudioFileDecodeStartAction
  | AudioFileDecodeErrorAction
  | AudioFileDecodeCompleteAction
