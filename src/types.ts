import { Action } from 'redux'

export interface GAudioNode<PROPS = {}> {
  id: string
  color: string
  label: string
  props: PROPS
  type: string
}

export interface AudioNodeConnection {
  from: string
  to: string
  color: string
}

export interface AudioEngineEvent<PAYLOAD = any> {
  type: string
  payload: PAYLOAD
}

export interface AudioFileData {
  buffer: ArrayBuffer
  fileName: string
  fileType: string
}

export interface DecodedAudioFileData {
  audioBuffer: AudioBuffer
  fileName: string
  fileType: string
}

export interface ActionWithPayload<TYPE, PAYLOAD> extends Action<TYPE> {
  payload: PAYLOAD
}
