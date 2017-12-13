import { Component } from 'react'
import { tryCatch, cond, equals, pick, pipe, prop, always } from 'ramda'
import PropTypes from '~/PropTypes'
import { getAudioContext } from '~/apis/audio'
import { noop } from '~/util/function'
import { warn } from '~/util/dev'
import { isInstrument } from '~/util/audio'
import { MAIN_OUT_ID } from '~/constants/audio'
import {
  GLOBAL_PLAYBACK_START,
  GLOBAL_PLAYBACK_STOP,
} from '~/state/globalPlayback/actionTypes'
import {
  INSTRUMENT_ADD,
  INSTRUMENT_REMOVE,
  INSTRUMENT_UPDATE_PROPS,
} from '~/state/instruments/actionTypes'
import {
  AUDIO_EFFECT_ADD,
  AUDIO_EFFECT_REMOVE,
  AUDIO_EFFECT_UPDATE_PROPS,
} from '~/state/audioEffects/actionTypes'
import {
  CONNECTION_ADD,
  CONNECTION_REMOVE,
} from '~/state/connections/actionTypes'
import { AUDIO_FILE_DECODE_COMPLETE } from '~/state/audioFiles/actionTypes'
import {
  createAudioNode as createLoopNode,
  nodeType as loopType,
} from '~/nodes/instruments/loop'
import {
  createAudioNode as createDelayNode,
  nodeType as delayType,
} from '~/nodes/audioEffects/delay'
import {
  createAudioNode as createReverbNode,
  nodeType as reverbType,
} from '~/nodes/audioEffects/reverb'

const setNodeProps = tryCatch(({ node, props }) => node.set(props), warn)

const getNodeCreator = pipe(
  prop('type'),
  cond([
    [equals(delayType), always(createDelayNode)],
    [equals(reverbType), always(createReverbNode)],
    [equals(loopType), always(createLoopNode)],
  ]),
)

class AudioEngine extends Component {
  constructor(...args) {
    super(...args)
    this.processAudioEngineEvent = this.processAudioEngineEvent.bind(this)
  }

  componentDidMount() {
    this.audioContext = getAudioContext()
    this.updateAudioNodes()
    this.updateAudioGraph()
  }

  shouldComponentUpdate(props) {
    return (
      props.audioEngineEvents.length &&
      this.props.audioEngineEvents !== props.audioEngineEvents
    )
  }

  componentDidUpdate() {
    this.props.audioEngineEvents.forEach(this.processAudioEngineEvent)
    this.props.clearAudioEngineEvents()
  }

  componentWillUnmount() {
    this.props.clearAudioEngineEvents()
    this.audioContext.close()
  }

  forEachInstrument(fn) {
    Object.values(this.audioNodes)
      .filter(isInstrument)
      .forEach(fn)
  }

  disconnectAllNodes() {
    if (!this.audioNodes) return

    Object.values(this.audioNodes).forEach(node => node.disconnect())
  }

  updateAudioNodes() {
    const { nodes, isPlaying } = this.props

    this.audioNodes = this.audioNodes
      ? pick([...nodes.map(({ id }) => id), MAIN_OUT_ID], this.audioNodes)
      : { [MAIN_OUT_ID]: this.audioContext.destination }

    nodes.filter(node => !this.audioNodes[node.id]).forEach(node => {
      const nodeCreator = getNodeCreator(node)

      if (!nodeCreator) return

      const newNode = nodeCreator(this.audioContext, node.props)

      this.audioNodes[node.id] = newNode

      if (isPlaying && isInstrument(newNode)) newNode.play()
    })
  }

  updateAudioGraph() {
    this.disconnectAllNodes()

    const { connections } = this.props

    if (!connections.length) return

    connections.forEach(({ from, to }) => {
      const fromNode = this.audioNodes[from]
      const toNode = this.audioNodes[to]

      if (fromNode && toNode) fromNode.connect(toNode)
    })
  }

  updateNode({ id, props }) {
    const node = this.audioNodes[id]

    if (!node) return

    setNodeProps({ node, props })
  }

  rebuildAll() {
    this.disconnectAllNodes()

    this.audioNodes = undefined

    this.updateAudioNodes()
    this.updateAudioGraph()
  }

  /* eslint-disable complexity */
  processAudioEngineEvent({ type, payload = {} }) {
    switch (type) {
      case GLOBAL_PLAYBACK_START:
        this.forEachInstrument(node => node.play())
        break
      case GLOBAL_PLAYBACK_STOP:
        this.forEachInstrument(node => node.stop())
        break
      case AUDIO_EFFECT_UPDATE_PROPS:
      case INSTRUMENT_UPDATE_PROPS:
        this.updateNode(payload)
        break
      case AUDIO_FILE_DECODE_COMPLETE:
        this.updateNode({ id: payload.id, props: payload.file })
        break
      case CONNECTION_ADD:
      case CONNECTION_REMOVE:
        this.updateAudioGraph()
        break
      case INSTRUMENT_ADD:
      case AUDIO_EFFECT_ADD:
        this.updateAudioNodes()
        this.updateAudioGraph()
        break
      case INSTRUMENT_REMOVE:
      case AUDIO_EFFECT_REMOVE:
        this.rebuildAll()
        break
      default:
        break
    }
  }

  /* eslint-disable class-methods-use-this */
  render() {
    return null
  }
  /* eslint-enable class-methods-use-this */
}

AudioEngine.propTypes = {
  isPlaying: PropTypes.bool,
  audioEngineEvents: PropTypes.arrayOf(PropTypes.shape({})),
  nodes: PropTypes.arrayOf(PropTypes.shape({})),
  connections: PropTypes.arrayOf(PropTypes.connection),
  clearAudioEngineEvents: PropTypes.func,
}

AudioEngine.defaultProps = {
  isPlaying: false,
  audioEngineEvents: [],
  nodes: [],
  connections: [],
  clearAudioEngineEvents: noop,
}

export default AudioEngine
