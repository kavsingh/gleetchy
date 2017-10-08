import { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { pick } from 'ramda'
import {
  PLAYBACK_START,
  PLAYBACK_STOP,
  LOOPER_UPDATE_PROPS,
  LOOPER_LOAD_FILE_COMPLETE,
  LOOPER_LOAD_FILE_DECODE_COMPLETE,
  DELAY_UPDATE_PROPS,
  REVERB_UPDATE_PROPS,
  GRAPH_UPDATE,
} from '../../state/gleetchy/actionTypes'
import {
  loopersSelector,
  delaySelector,
  reverbSelector,
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

const pickLooperProps = pick([
  'loopStart',
  'loopEnd',
  'gain',
  'playbackRate',
  'audioBuffer',
  'eqMid',
  'eqLow',
  'eqHigh',
])

class GleetchyEngine extends Component {
  constructor(...args) {
    super(...args)
    this.processAudioEvent = this.processAudioEvent.bind(this)
  }

  componentWillMount() {
    const AudioContext = window.AudioContext || window.webkitAudioContext

    this.audioContext = new AudioContext()

    const { loopers } = this.props
    const looperIds = loopers.map(({ id }) => id)

    this.audioNodes = loopers.reduce(
      (acc, looper) => {
        acc[looper.id] = createLooperNode(
          this.audioContext,
          pickLooperProps(looper),
        )

        return acc
      },
      {
        mainOut: this.audioContext.destination,
        delay: createDelayNode(this.audioContext, this.props.delay),
        reverb: createReverbNode(this.audioContext, this.props.reverb),
      },
    )

    this.forEachLooper = fn => looperIds.forEach(id => fn(this.audioNodes[id]))

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

  processAudioEvent({ type, payload = {} }) {
    switch (type) {
      case PLAYBACK_START:
        this.forEachLooper(node => node.play())
        break
      case PLAYBACK_STOP:
        this.forEachLooper(node => node.stop())
        break
      case LOOPER_UPDATE_PROPS:
        this.updateLooper(payload)
        break
      case LOOPER_LOAD_FILE_COMPLETE:
        this.props.decodeLooperFile(this.audioContext, payload.id, payload.file)
        break
      case LOOPER_LOAD_FILE_DECODE_COMPLETE:
        this.updateLooper(payload)
        break
      case DELAY_UPDATE_PROPS:
        this.audioNodes.delay.set(payload.props)
        break
      case REVERB_UPDATE_PROPS:
        this.audioNodes.reverb.set(payload.props)
        break
      case GRAPH_UPDATE:
        this.updateAudioGraph()
        break
      default:
        break
    }
  }

  updateLooper({ id, props }) {
    const looperNode = this.audioNodes[id]

    if (!looperNode) return

    looperNode.set(props)
  }

  /* eslint-disable class-methods-use-this */
  render() {
    return null
  }
  /* eslint-enable class-methods-use-this */
}

GleetchyEngine.propTypes = {
  engineEvents: PropTypes.arrayOf(PropTypes.shape({})),
  loopers: PropTypes.arrayOf(PropTypes.shape({})),
  delay: PropTypes.shape({}),
  reverb: PropTypes.shape({}),
  connections: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string)),
  decodeLooperFile: PropTypes.func,
  clearEngineEvents: PropTypes.func,
}

GleetchyEngine.defaultProps = {
  engineEvents: [],
  loopers: [],
  delay: {},
  reverb: {},
  connections: [],
  decodeLooperFile: () => {},
  clearEngineEvents: () => {},
}

export default connect(
  state => ({
    engineEvents: engineEventsSelector(state),
    loopers: loopersSelector(state),
    delay: delaySelector(state),
    reverb: reverbSelector(state),
    connections: connectionsSelector(state),
  }),
  dispatch => ({
    clearEngineEvents: () => dispatch(engineEventsClear()),
    decodeLooperFile: (audioContext, id, file) =>
      dispatch(looperLoadFileDecode(audioContext, id, file)),
  }),
)(GleetchyEngine)
