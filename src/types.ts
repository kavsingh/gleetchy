import { Action } from 'redux'

export interface AudioNodeIdentifier {
  id: string
  type: string
}

export interface AudioNodeState<PROPS extends object = {}>
  extends AudioNodeIdentifier {
  color: string
  label: string
  props: PROPS
}

export type AudioNodeReturn = () => AudioNode

export interface AudioNodeConnectableProxy {
  getInNode: AudioNodeReturn
  getOutNode: AudioNodeReturn
}

export interface GAudioNode<T extends string = any, P extends object = any>
  extends AudioNode,
    AudioNodeConnectableProxy {
  type: T
  set(props: P): void
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
