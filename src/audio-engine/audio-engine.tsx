import { Component } from 'react'
import { pick, tryCatch } from 'ramda'

import { warn } from '~/lib/dev'
import { isInstrument } from '~/lib/audio'
import { getAudioContext } from '~/apis/audio'
import { MAIN_OUT_ID } from '~/constants/audio'
import {
  createAudioNode as createDelayNode,
  nodeType as delayType,
  NodeProps as DelayProps,
} from '~/nodes/audio-effects/delay'
import {
  createAudioNode as createReverbNode,
  nodeType as reverbType,
  NodeProps as ReverbProps,
} from '~/nodes/audio-effects/reverb'
import {
  createAudioNode as createLoopNode,
  nodeType as loopType,
  NodeProps as LoopProps,
} from '~/nodes/instruments/loop'
import { AudioEngineEvent } from '~/state/audio-engine/types'
import {
  AudioNodeConnection,
  AudioNodeState,
  GAudioNode,
  GInstrumentNode,
} from '~/types'
import { noop } from '~/lib/util'

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
}

class AudioEngine extends Component<AudioEngineProps> {
  private audioContext?: AudioContext
  private audioNodes: {
    [key: string]: GAudioNode | GInstrumentNode | AudioNode
  } = {}

  public componentDidMount() {
    this.audioContext = getAudioContext()
    this.updateAudioNodes()
    this.updateAudioGraph()
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

  private getInstrumentNodes(): GInstrumentNode[] {
    return Object.values(this.audioNodes).filter(
      isInstrument,
    ) as GInstrumentNode[]
  }

  private forEachInstrument(fn: InstrumentNodeProcessor) {
    if (!this.audioNodes) {
      return
    }

    this.getInstrumentNodes().forEach(fn)
  }

  private disconnectAllNodes() {
    if (!this.audioNodes) {
      return
    }

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
        // TS doesn't follow through on defined check above
        if (!this.audioContext) return

        const node = nextNodes[id]
        const newNode = createNewNode(this.audioContext, node)

        if (!newNode) return

        this.audioNodes[node.id] = newNode

        if (isPlaying && isInstrument(newNode)) {
          ;(newNode as GInstrumentNode).play()
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
        this.forEachInstrument((node) => node.play())
        break
      case 'GLOBAL_PLAYBACK_STOP':
        this.forEachInstrument((node) => node.stop())
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
        this.rebuildAll()
        break
      default:
        break
    }
  }
}

export default AudioEngine
