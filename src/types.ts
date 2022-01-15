/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Action } from 'redux'

export interface AudioNodeIdentifierMeta {
  readonly id: string
  readonly type: string
}

export interface AudioNodeMeta extends AudioNodeIdentifierMeta {
  label: string
}

export interface AudioNodeState<PROPS extends Record<string, unknown>>
  extends AudioNodeMeta {
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

export interface GAudioNodeApi<
  P extends Record<string, unknown>,
  T extends string,
> {
  type: T
  set(props: Partial<P>): void
}

export type GAudioNode<
  P extends Record<string, unknown> = any,
  T extends string = any,
> = GAudioNodeConnectApi & GAudioNodeApi<P, T>

export interface GInstrumentNodeApi<
  P extends Record<string, unknown>,
  T extends string,
  S extends (data: any) => unknown,
> extends GAudioNodeApi<P, T> {
  play(): void
  stop(): void
  subscribe?(subscriber: S): () => void
}

export type GInstrumentNode<
  P extends Record<string, unknown> = any,
  T extends string = any,
  S extends (data: any) => unknown = any,
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

export type ActionCreatorWithArguments<
  A extends Action,
  ARGS extends unknown[],
> = (...args: ARGS) => A
