import { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { tryCatch, cond, equals, pipe, prop, always } from 'ramda'
import { warn } from '../../util'
import { isInstrument } from '../../util/audio'
import { FX_DELAY, FX_REVERB, INS_LOOPER } from '../../constants/nodeTypes'
import {
  PLAYBACK_START,
  PLAYBACK_STOP,
  NODE_UPDATE_PROPS,
  LOOPER_LOAD_FILE_COMPLETE,
  LOOPER_LOAD_FILE_DECODE_COMPLETE,
  GRAPH_UPDATE,
} from '../../state/gleetchy/actionTypes'
import {
  nodesSelector,
  engineEventsSelector,
  connectionsSelector,
} from '../../state/gleetchy/selectors'
import {
  looperLoadFileDecode,
  engineEventsClear,
} from '../../state/gleetchy/actions'
import { createLooperNode } from '../../audioNodes/looperNode'
import { createDelayNode } from '../../audioNodes/delayNode'
import { createReverbNode } from '../../audioNodes/reverbNode'

const setNodeProps = tryCatch(({ node, props }) => node.set(props), warn)

const getNodeCreator = pipe(
  prop('type'),
  cond([
    [equals(FX_DELAY), always(createDelayNode)],
    [equals(FX_REVERB), always(createReverbNode)],
    [equals(INS_LOOPER), always(createLooperNode)],
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

    this.audioNodes = this.props.nodes.reduce(
      (acc, node) => {
        const nodeCreator = getNodeCreator(node)

        acc[node.id] = nodeCreator(this.audioContext, node.props)

        return acc
      },
      { mainOut: this.audioContext.destination },
    )

    this.forEachInstrument = cb =>
      Object.values(this.audioNodes)
        .filter(isInstrument)
        .forEach(cb)

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

  updateAudioGraph() {
    Object.values(this.audioNodes).forEach(node => node.disconnect())

    const { connections } = this.props

    if (!connections.length) return

    connections.forEach(([fromId, toId]) => {
      this.audioNodes[fromId].connect(this.audioNodes[toId])
    })
  }

  updateNode({ id, props }) {
    const node = this.audioNodes[id]

    if (!node) return

    setNodeProps({ node, props })
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
      case LOOPER_LOAD_FILE_COMPLETE:
        this.props.decodeLooperFile(this.audioContext, payload.id, payload.file)
        break
      case LOOPER_LOAD_FILE_DECODE_COMPLETE:
        this.updateNode(payload)
        break
      case GRAPH_UPDATE:
        this.updateAudioGraph()
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
  engineEvents: PropTypes.arrayOf(PropTypes.shape({})),
  nodes: PropTypes.arrayOf(PropTypes.shape({})),
  connections: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string)),
  decodeLooperFile: PropTypes.func,
  clearEngineEvents: PropTypes.func,
}

GleetchyEngine.defaultProps = {
  engineEvents: [],
  nodes: [],
  connections: [],
  decodeLooperFile: () => {},
  clearEngineEvents: () => {},
}

export default connect(
  state => ({
    engineEvents: engineEventsSelector(state),
    nodes: nodesSelector(state),
    connections: connectionsSelector(state),
  }),
  dispatch => ({
    clearEngineEvents: () => dispatch(engineEventsClear()),
    decodeLooperFile: (audioContext, id, file) =>
      dispatch(looperLoadFileDecode(audioContext, id, file)),
  }),
)(GleetchyEngine)
