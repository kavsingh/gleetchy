import { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { tryCatch, cond, equals, pick, pipe, prop, always } from 'ramda'
import { connection as connectionProp } from '../../propTypes'
import { noop } from '../../util/function'
import { warn } from '../../util/dev'
import { isInstrument } from '../../util/audio'
import { MAIN_OUT_ID } from '../../constants/audio'
import { FX_DELAY, FX_REVERB, INS_LOOP } from '../../constants/nodeTypes'
import { AUDIO_FILE_LOAD_COMPLETE } from '../../state/audioFiles/actionTypes'
import { ENGINE_DECODE_ARRAY_BUFFER_COMPLETE } from '../../state/engine/actionTypes'
import {
  GLOBAL_PLAYBACK_START,
  GLOBAL_PLAYBACK_STOP,
} from '../../state/globalPlayback/actionTypes'
import {
  INSTRUMENT_ADD,
  INSTRUMENT_REMOVE,
  INSTRUMENT_UPDATE_PROPS,
} from '../../state/instruments/actionTypes'
import { FX_ADD, FX_REMOVE, FX_UPDATE_PROPS } from '../../state/fx/actionTypes'
import {
  CONNECTION_ADD,
  CONNECTION_REMOVE,
} from '../../state/connections/actionTypes'
import { instrumentsSelector } from '../../state/instruments/selectors'
import { fxSelector } from '../../state/fx/selectors'
import { connectionsSelector } from '../../state/connections/selectors'
import { engineEventsSelector } from '../../state/engine/selectors'
import { isPlayingSelector } from '../../state/globalPlayback/selectors'
import {
  clearEngineEventsAction,
  decodeAudioDataAction,
} from '../../state/engine/actions'
import { createLoopNode } from '../../audioNodes/loopNode'
import { createDelayNode } from '../../audioNodes/delayNode'
import { createReverbNode } from '../../audioNodes/reverbNode'

const setNodeProps = tryCatch(({ node, props }) => node.set(props), warn)

const getNodeCreator = pipe(
  prop('type'),
  cond([
    [equals(FX_DELAY), always(createDelayNode)],
    [equals(FX_REVERB), always(createReverbNode)],
    [equals(INS_LOOP), always(createLoopNode)],
  ]),
)

class GleetchyEngine extends Component {
  constructor(...args) {
    super(...args)
    this.processAudioEvent = this.processAudioEvent.bind(this)
  }

  componentWillMount() {
    const AudioContext = window.AudioContext || window.webkitAudioContext

    this.audioContext = new AudioContext()

    this.updateAudioNodes()
    this.updateAudioGraph()
  }

  shouldComponentUpdate(props) {
    return (
      props.engineEvents.length &&
      this.props.engineEvents !== props.engineEvents
    )
  }

  componentDidUpdate() {
    this.props.engineEvents.forEach(this.processAudioEvent)
    this.props.clearEngineEvents()
  }

  componentWillUnmount() {
    this.props.clearEngineEvents()
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

    connections.forEach(({ from: { id: fromId }, to: { id: toId } }) => {
      const from = this.audioNodes[fromId]
      const to = this.audioNodes[toId]

      if (from && to) from.connect(to)
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
  processAudioEvent({ type, payload = {} }) {
    switch (type) {
      case GLOBAL_PLAYBACK_START:
        this.forEachInstrument(node => node.play())
        break
      case GLOBAL_PLAYBACK_STOP:
        this.forEachInstrument(node => node.stop())
        break
      case FX_UPDATE_PROPS:
      case INSTRUMENT_UPDATE_PROPS:
        this.updateNode(payload)
        break
      case AUDIO_FILE_LOAD_COMPLETE:
        this.props.decodeAudioFile(this.audioContext, payload.id, payload.file)
        break
      case ENGINE_DECODE_ARRAY_BUFFER_COMPLETE:
        this.updateNode(payload)
        break
      case CONNECTION_ADD:
      case CONNECTION_REMOVE:
        this.updateAudioGraph()
        break
      case INSTRUMENT_ADD:
      case FX_ADD:
        this.updateAudioNodes()
        this.updateAudioGraph()
        break
      case INSTRUMENT_REMOVE:
      case FX_REMOVE:
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

GleetchyEngine.propTypes = {
  isPlaying: PropTypes.bool,
  engineEvents: PropTypes.arrayOf(PropTypes.shape({})),
  nodes: PropTypes.arrayOf(PropTypes.shape({})),
  connections: PropTypes.arrayOf(connectionProp),
  decodeAudioFile: PropTypes.func,
  clearEngineEvents: PropTypes.func,
}

GleetchyEngine.defaultProps = {
  isPlaying: false,
  engineEvents: [],
  nodes: [],
  connections: [],
  decodeAudioFile: noop,
  clearEngineEvents: noop,
}

export default connect(
  state => ({
    isPlaying: isPlayingSelector(state),
    engineEvents: engineEventsSelector(state),
    nodes: [...instrumentsSelector(state), ...fxSelector(state)],
    connections: connectionsSelector(state),
  }),
  dispatch => ({
    clearEngineEvents: () => dispatch(clearEngineEventsAction()),
    decodeAudioFile: (audioContext, id, { buffer }) =>
      dispatch(decodeAudioDataAction(audioContext, id, buffer)),
  }),
)(GleetchyEngine)
