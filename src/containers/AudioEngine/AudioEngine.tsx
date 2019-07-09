import { always, cond, equals, pick, pipe, tryCatch } from 'ramda'
import { Component } from 'react'

import { getAudioContext } from '~/apis/audio'
import { MAIN_OUT_ID } from '~/constants/audio'
import {
  createAudioNode as createDelayNode,
  nodeType as delayType,
} from '~/nodes/audioEffects/delay'
import {
  createAudioNode as createReverbNode,
  nodeType as reverbType,
} from '~/nodes/audioEffects/reverb'
import {
  createAudioNode as createLoopNode,
  nodeType as loopType,
} from '~/nodes/instruments/loop'
import { isInstrument } from '~/util/audio'
import { warn } from '~/util/dev'

import {
  AudioEngineEvent,
  AudioNodeConnection,
  AudioNodeState,
  GAudioNode,
  InstrumentNode,
} from '~/types'

type AudioEngineNode = AudioNode | GAudioNode | InstrumentNode
type InstrumentNodeProcessor = (node: InstrumentNode) => void
type TrySet = (args: { node: AudioEngineNode; props: object }) => void

const setNodeProps = tryCatch<TrySet>(({ node, props }) => {
  const target = node as GAudioNode

  if (typeof target.set === 'function') {
    target.set(props)
  }
}, warn)

type NodeCreator = (...args: unknown[]) => AudioEngineNode
const getNodeCreator: (state: AudioNodeState) => NodeCreator = pipe(
  ({ type }: AudioNodeState) => type,
  cond([
    [equals(delayType), always(createDelayNode)],
    [equals(reverbType), always(createReverbNode)],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [equals(loopType), always(createLoopNode) as any],
  ]),
)

export interface AudioEngineProps {
  audioEngineEvents: AudioEngineEvent[]
  connections: AudioNodeConnection[]
  isPlaying: boolean
  nodes: { [key: string]: AudioNodeState }
  clearAudioEngineEvents(): unknown
}

class AudioEngine extends Component<AudioEngineProps> {
  private audioContext?: AudioContext
  private audioNodes: {
    [key: string]: GAudioNode | InstrumentNode | AudioNode
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

  private getInstrumentNodes(): InstrumentNode[] {
    return Object.values(this.audioNodes).filter(
      isInstrument,
    ) as InstrumentNode[]
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

    Object.values(this.audioNodes).forEach(node => node.disconnect())
  }

  private updateAudioNodes() {
    if (!this.audioContext) return

    const { nodes: nextNodes = {}, isPlaying = false } = this.props
    const nextNodeIds = Object.keys(nextNodes)

    this.audioNodes = Object.entries(this.audioNodes).length
      ? pick(nextNodeIds, this.audioNodes)
      : { [MAIN_OUT_ID]: this.audioContext.destination }

    nextNodeIds
      .filter(id => !this.audioNodes[id])
      .forEach(id => {
        const node = nextNodes[id]
        const nodeCreator = getNodeCreator(node) as NodeCreator

        if (!nodeCreator) return

        const newNode: AudioEngineNode = nodeCreator(
          this.audioContext,
          node.audioProps,
        )

        this.audioNodes[node.id] = newNode

        if (isPlaying && isInstrument(newNode)) {
          ;(newNode as InstrumentNode).play()
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

      if (fromNode && toNode) {
        fromNode.connect(toNode)
      }
    })
  }

  private updateNode({ id, props }: { id: string; props: object }) {
    const node = this.audioNodes[id]

    if (!node) return

    setNodeProps({ node, props })
  }

  private rebuildAll() {
    this.disconnectAllNodes()

    this.audioNodes = {}

    this.updateAudioNodes()
    this.updateAudioGraph()
  }

  private processAudioEngineEvent = ({
    type,
    payload = {},
  }: AudioEngineEvent) => {
    switch (type) {
      case 'GLOBAL_PLAYBACK_START':
        this.forEachInstrument(node => node.play())
        break
      case 'GLOBAL_PLAYBACK_STOP':
        this.forEachInstrument(node => node.stop())
        break
      case 'AUDIO_EFFECT_UPDATE_PROPS':
      case 'INSTRUMENT_UPDATE_PROPS':
        this.updateNode(payload)
        break
      case 'AUDIO_FILE_DECODE_COMPLETE':
        this.updateNode({ id: payload.id, props: payload.file })
        break
      case 'CONNECTION_ADD':
      case 'CONNECTION_REMOVE':
        this.updateAudioGraph()
        break
      case 'INSTRUMENT_ADD':
      case 'AUDIO_EFFECT_ADD':
        this.updateAudioNodes()
        this.updateAudioGraph()
        break
      case 'INSTRUMENT_REMOVE':
      case 'AUDIO_EFFECT_REMOVE':
        this.rebuildAll()
        break
      default:
        break
    }
  }
}

export default AudioEngine
