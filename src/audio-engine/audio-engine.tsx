import { Component } from 'react'
import { pick, tryCatch } from 'ramda'

import { warn } from '~/lib/dev'
import { noop } from '~/lib/util'
import { isInstrumentNode } from '~/lib/audio'
import { getAudioContext } from '~/apis/audio'
import { MAIN_OUT_ID } from '~/constants/audio'
import {
  createAudioNode as createDelayNode,
  nodeType as delayType,
} from '~/nodes/audio-effects/delay'
import {
  createAudioNode as createReverbNode,
  nodeType as reverbType,
} from '~/nodes/audio-effects/reverb'
import {
  createAudioNode as createLoopNode,
  nodeType as loopType,
} from '~/nodes/instruments/loop'
import type { AudioEngineEvent } from '~/state/audio-engine/types'
import type { NodeProps as DelayProps } from '~/nodes/audio-effects/delay'
import type { NodeProps as ReverbProps } from '~/nodes/audio-effects/reverb'
import type { NodeProps as LoopProps } from '~/nodes/instruments/loop'
import type {
  AudioNodeConnection,
  AudioNodeState,
  GAudioNode,
  GInstrumentNode,
} from '~/types'

type AudioEngineNode = AudioNode | GAudioNode | GInstrumentNode
type InstrumentNodeProcessor = (node: GInstrumentNode) => void
type TrySet = (args: { node: AudioEngineNode; audioProps: object }) => void
type AudioNodeEffect = (node: AudioNode | GAudioNode) => void

const setNodeProps = tryCatch<TrySet>(({ node, audioProps }) => {
  const target = node as GAudioNode

  if (typeof target.set === 'function') target.set(audioProps)
}, warn)

const createNewNode = (context: AudioContext, state: AudioNodeState<{}>) => {
  switch (state.type) {
    case delayType:
      return createDelayNode(context, state.audioProps)
    case reverbType:
      return createReverbNode(context, state.audioProps)
    case loopType:
      return createLoopNode(context, state.audioProps)
    default:
      return
  }
}

export interface AudioEngineProps {
  audioEngineEvents: AudioEngineEvent[]
  connections: AudioNodeConnection[]
  isPlaying: boolean
  nodes: {
    [key: string]: AudioNodeState<DelayProps | ReverbProps | LoopProps | {}>
  }
  clearAudioEngineEvents(): unknown
  dispatchSubscriptionEvent(nodeId: string, payload: unknown): unknown
}

class AudioEngine extends Component<AudioEngineProps> {
  private audioContext?: AudioContext
  private audioNodes: {
    [key: string]: GAudioNode | GInstrumentNode | AudioNode
  } = {}
  private subscriptions: {
    [key: string]: () => void
  } = {}

  public componentDidMount() {
    this.audioContext = getAudioContext()
    this.updateAudioNodes()
    this.updateAudioGraph()

    window.SUBS = this.subscriptions
  }

  public shouldComponentUpdate(props: AudioEngineProps) {
    return (
      !!props.audioEngineEvents.length &&
      this.props.audioEngineEvents !== props.audioEngineEvents
    )
  }

  public componentDidUpdate() {
    this.props.audioEngineEvents.forEach(this.processAudioEngineEvent)
    this.props.clearAudioEngineEvents()
  }

  public componentWillUnmount() {
    this.props.clearAudioEngineEvents()
    if (this.audioContext) this.audioContext.close()
  }

  public render() {
    return null
  }

  private getInstrumentNodes = (): GInstrumentNode[] => {
    return Object.values(this.audioNodes).filter(
      isInstrumentNode,
    ) as GInstrumentNode[]
  }

  private forEachInstrument = (fn: InstrumentNodeProcessor) => {
    this.getInstrumentNodes().forEach(fn)
  }

  private getNodeId = (node: GAudioNode | GInstrumentNode | AudioNode) =>
    Object.entries(this.audioNodes).find(
      ([, registeredNode]) => registeredNode === node,
    )?.[0]

  private playAndSubscribeInstrument = (node: GInstrumentNode) => {
    const nodeId = this.getNodeId(node)

    if (nodeId) {
      this.subscriptions[nodeId]?.()

      if (typeof node.subscribe === 'function') {
        this.subscriptions[nodeId] = node.subscribe((payload: unknown) =>
          this.props.dispatchSubscriptionEvent(nodeId, payload),
        )
      }
    }

    node.play()
  }

  private stopAndUnsubscribeInstrument = (node: GInstrumentNode) => {
    const nodeId = this.getNodeId(node)

    if (nodeId && this.subscriptions[nodeId]) {
      this.subscriptions[nodeId]()
      delete this.subscriptions[nodeId]
    }

    node.stop()
  }

  private disconnectAllNodes() {
    Object.values(this.audioNodes).forEach(
      // Safari crashes if node not connected
      tryCatch<AudioNodeEffect>((node) => node.disconnect(), noop),
    )
  }

  private updateAudioNodes() {
    if (!this.audioContext) return

    const { nodes: nextNodes = {}, isPlaying = false } = this.props
    const nextNodeIds = Object.keys(nextNodes)

    this.audioNodes = Object.entries(this.audioNodes).length
      ? pick(nextNodeIds, this.audioNodes)
      : { [MAIN_OUT_ID]: this.audioContext.destination }

    nextNodeIds
      .filter((id) => !this.audioNodes[id])
      .forEach((id) => {
        if (!this.audioContext) return

        const node = nextNodes[id]
        const newNode = createNewNode(this.audioContext, node)

        if (!newNode) return

        this.audioNodes[node.id] = newNode

        if (isPlaying && isInstrumentNode(newNode)) {
          this.playAndSubscribeInstrument(newNode)
        }
      })
  }

  private updateAudioGraph() {
    this.disconnectAllNodes()

    const { connections } = this.props

    if (!connections.length) return

    connections.forEach(({ from, to }) => {
      const fromNode = this.audioNodes[from]
      const toNode = this.audioNodes[to]

      if (fromNode && toNode) (fromNode as GAudioNode).connect(toNode)
    })
  }

  private updateNode({ id, audioProps }: { id: string; audioProps: object }) {
    const node = this.audioNodes[id]

    if (!node) return

    setNodeProps({ node, audioProps })
  }

  private rebuildAll() {
    this.disconnectAllNodes()

    this.audioNodes = {}

    this.updateAudioNodes()
    this.updateAudioGraph()
  }

  private processAudioEngineEvent = (event: AudioEngineEvent) => {
    switch (event.type) {
      case 'GLOBAL_PLAYBACK_START':
        this.forEachInstrument(this.playAndSubscribeInstrument)
        break
      case 'GLOBAL_PLAYBACK_STOP':
        this.forEachInstrument(this.stopAndUnsubscribeInstrument)
        break
      case 'AUDIO_NODE_UPDATE_AUDIO_PROPS':
        this.updateNode(event.payload)
        break
      case 'AUDIO_FILE_DECODE_COMPLETE':
        this.updateNode({
          id: event.payload.id,
          audioProps: event.payload.file,
        })
        break
      case 'CONNECTION_ADD':
      case 'CONNECTION_REMOVE':
        this.updateAudioGraph()
        break
      case 'AUDIO_NODE_ADD':
      case 'AUDIO_NODE_DUPLICATE':
        this.updateAudioNodes()
        this.updateAudioGraph()
        break
      case 'AUDIO_NODE_REMOVE':
        this.subscriptions[event.payload.id]?.()
        this.rebuildAll()
        break
      default:
        break
    }
  }
}

export default AudioEngine
