/* eslint-disable @typescript-eslint/no-explicit-any */

import { Action } from 'redux'

export interface AudioNodeMeta {
  id: string
  type: string
}

export interface AudioNodeState<PROPS extends object = {}>
  extends AudioNodeMeta {
  label: string
  audioProps: PROPS
}

export type AudioNodeReturn = () => AudioNode

export interface AudioNodeConnectableProxy {
  getInNode: AudioNodeReturn
  getOutNode: AudioNodeReturn
}

export interface GAudioNode<P extends object = any, T extends string = any>
  extends AudioNode,
    AudioNodeConnectableProxy {
  type: T
  set(props: P): void
}

export interface InstrumentNode<P extends object = any, T extends string = any>
  extends GAudioNode<P, T> {
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
