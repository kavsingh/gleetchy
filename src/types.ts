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

export interface AudioNodeState<PROPS extends object> extends AudioNodeMeta {
  audioProps: PROPS
}

export type AudioNodeReturn = () => AudioNode

export interface GAudioNodeConnectors {
  getInNode: AudioNodeReturn
  getOutNode: AudioNodeReturn
}

export interface GAudioNodeConnectApi extends GAudioNodeConnectors {
  connect(node: AudioNode | GAudioNodeConnectors): void
  disconnect(node?: AudioNode | GAudioNodeConnectors): void
}

export interface GAudioNodeApi<P extends object, T extends string> {
  type: T
  set(props: Partial<P>): void
}

export type GAudioNode<
  P extends object = any,
  T extends string = any
> = GAudioNodeConnectApi & GAudioNodeApi<P, T>

export interface GInstrumentNodeApi<
  P extends object,
  T extends string,
  S extends (data: any) => unknown
> extends GAudioNodeApi<P, T> {
  play(): void
  stop(): void
  subscribe?(subscriber: S): () => void
}

export type GInstrumentNode<
  P extends object = any,
  T extends string = any,
  S extends (data: any) => unknown = any
> = GAudioNodeConnectApi & GInstrumentNodeApi<P, T, S>

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
