import { Action } from 'redux'

export interface AudioNodeState<PROPS = {}> {
  id: string
  color: string
  label: string
  props: PROPS
  type: string
}

export interface GAudioNode extends AudioNode {
  type: 'string'
  set(props: object): void
}

export interface InstrumentNode extends GAudioNode {
  play(): void
  stop(): void
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
