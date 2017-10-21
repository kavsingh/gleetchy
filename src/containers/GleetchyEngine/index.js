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
import {
  PLAYBACK_START,
  PLAYBACK_STOP,
  NODE_UPDATE_PROPS,
  NODE_ADD,
  NODE_REMOVE,
  LOOP_LOAD_FILE_COMPLETE,
  LOOP_LOAD_FILE_DECODE_COMPLETE,
  GRAPH_UPDATE,
  STATE_REPLACE,
} from '../../state/gleetchy/actionTypes'
import { instrumentsSelector } from '../../state/instruments/selectors'
import { fxSelector } from '../../state/fx/selectors'
import { connectionsSelector } from '../../state/connections/selectors'
import { engineEventsSelector } from '../../state/engineEvents/selectors'
import { isPlayingSelector } from '../../state/globalPlayback/selectors'
import { loopLoadFileDecode } from '../../state/gleetchy/actions'
import { clearEngineEventsAction } from '../../state/engineEvents/actions'
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

  processAudioEvent({ type, payload = {} }) {
    switch (type) {
      case PLAYBACK_START:
        this.forEachInstrument(node => node.play())
        break
      case PLAYBACK_STOP:
        this.forEachInstrument(node => node.stop())
        break
      case NODE_UPDATE_PROPS:
        this.updateNode(payload)
        break
      case LOOP_LOAD_FILE_COMPLETE:
        this.props.decodeLoopFile(this.audioContext, payload.id, payload.file)
        break
      case LOOP_LOAD_FILE_DECODE_COMPLETE:
        this.updateNode(payload)
        break
      case GRAPH_UPDATE:
        this.updateAudioGraph()
        break
      case NODE_ADD:
        this.updateAudioNodes()
        this.updateAudioGraph()
        break
      case NODE_REMOVE:
        this.rebuildAll()
        break
      case STATE_REPLACE:
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
  decodeLoopFile: PropTypes.func,
  clearEngineEvents: PropTypes.func,
}

GleetchyEngine.defaultProps = {
  isPlaying: false,
  engineEvents: [],
  nodes: [],
  connections: [],
  decodeLoopFile: noop,
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
    decodeLoopFile: (audioContext, id, file) =>
      dispatch(loopLoadFileDecode(audioContext, id, file)),
  }),
)(GleetchyEngine)
