import { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { pick, forEachObjIndexed, __ } from 'ramda'
import {
  PLAYBACK_START,
  PLAYBACK_STOP,
  LOOPER_UPDATE_PROPS,
  LOOPER_LOAD_FILE_COMPLETE,
  LOOPER_LOAD_FILE_DECODE_COMPLETE,
  DELAY_UPDATE_PROPS,
} from '../../state/gleetchy/actionTypes'
import {
  looperLoadFileDecode,
  engineEventsClear,
} from '../../state/gleetchy/actions'
import { createAudioLooperNode } from '../../audioNodes/audioLooperNode'
import { createDelayNode } from '../../audioNodes/delayNode'

class GleetchyEngine extends Component {
  constructor(...args) {
    super(...args)
    this.processAudioEvent = this.processAudioEvent.bind(this)
  }

  componentWillMount() {
    const AudioContext = window.AudioContext || window.webkitAudioContext

    this.audioContext = new AudioContext()
    this.mainOut = this.audioContext.destination
    this.delayNode = createDelayNode(this.audioContext, this.props.delay)
    this.audioLooperNodes = this.props.loopers.reduce((acc, looper) => {
      acc[looper.id] = createAudioLooperNode(
        this.audioContext,
        pick(
          ['loopStart', 'loopEnd', 'gain', 'playbackRate', 'audioBuffer'],
          looper,
        ),
      )

      return acc
    }, {})
    this.forEachAudioLooper = forEachObjIndexed(__, this.audioLooperNodes)

    this.forEachAudioLooper(node => node.connect(this.delayNode))

    this.delayNode.connect(this.mainOut)
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

  processAudioEvent({ type, payload = {} }) {
    switch (type) {
      case PLAYBACK_START:
        this.forEachAudioLooper(node => node.play())
        break
      case PLAYBACK_STOP:
        this.forEachAudioLooper(node => node.stop())
        break
      case LOOPER_UPDATE_PROPS:
        this.updateAudioLooper(payload)
        break
      case LOOPER_LOAD_FILE_COMPLETE:
        this.props.decodeLooperFile(this.audioContext, payload.id, payload.file)
        break
      case LOOPER_LOAD_FILE_DECODE_COMPLETE:
        this.updateAudioLooper(payload)
        break
      case DELAY_UPDATE_PROPS:
        this.delayNode.set(payload.props)
        break
      default:
        break
    }
  }

  updateAudioLooper({ id, props }) {
    const looperNode = this.audioLooperNodes[id]

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
  engineEvents: PropTypes.arrayOf(PropTypes.shape()),
  loopers: PropTypes.arrayOf(PropTypes.shape()),
  delay: PropTypes.shape(),
  decodeLooperFile: PropTypes.func,
  clearEngineEvents: PropTypes.func,
}

GleetchyEngine.defaultProps = {
  engineEvents: [],
  loopers: [],
  delay: {},
  decodeLooperFile: () => {},
  clearEngineEvents: () => {},
}

export default connect(
  ({ gleetchy }) => ({
    engineEvents: gleetchy.engineEvents,
    loopers: gleetchy.loopers,
    delay: gleetchy.delay,
  }),
  dispatch => ({
    clearEngineEvents: () => dispatch(engineEventsClear()),
    decodeLooperFile: (audioContext, id, file) =>
      dispatch(looperLoadFileDecode(audioContext, id, file)),
  }),
)(GleetchyEngine)
