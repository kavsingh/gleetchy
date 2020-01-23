/* eslint-disable @typescript-eslint/no-explicit-any */
import { FunctionComponent } from 'react'
import { Action } from 'redux'

export type PropsWithoutChildren<P> = P & { children?: never }

export type FunctionComponentWithoutChildren<P = {}> = FunctionComponent<
  PropsWithoutChildren<P>
>

export interface AudioNodeIdentifierMeta {
  readonly id: string
  readonly type: string
}

export interface AudioNodeMeta extends AudioNodeIdentifierMeta {
  label: string
}

export interface AudioNodeState<PROPS extends object = {}>
  extends AudioNodeMeta {
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
