import { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { pick, forEachObjIndexed, __ } from 'ramda'
import { decodeAudioDataP } from '../../util/audio'
import {
  ENGINE_EVENTS_CLEAR,
  PLAYBACK_START,
  PLAYBACK_STOP,
  LOOPER_UPDATE_PROPS,
  LOOPER_LOAD_FILE_COMPLETE,
  LOOPER_LOAD_FILE_DECODE_COMPLETE,
  LOOPER_LOAD_FILE_ERROR,
} from '../../state/gleetchy/actionTypes'
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
    this.delayNode = createDelayNode(this.audioContext, { delayTime: 1 })
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

    // this.forEachAudioLooper(node => node.connect(this.delayNode))
    this.forEachAudioLooper(node => node.connect(this.mainOut))

    // this.delayNode.connect(this.mainOut)
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
        this.decodeLooperFile(payload)
        break
      case LOOPER_LOAD_FILE_DECODE_COMPLETE:
        this.updateAudioLooper(payload)
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

  decodeLooperFile({ id, file: { buffer, fileName, fileType } = {} }) {
    if (!buffer) {
      this.props.onDecodedLooperBufferError(
        id,
        new Error(`No buffer for ${fileName}`),
      )
    }

    decodeAudioDataP(this.audioContext, buffer)
      .then(audioBuffer =>
        this.props.onDecodedLooperBuffer(id, {
          audioBuffer,
          fileName,
          fileType,
        }),
      )
      .catch(error => {
        this.props.onDecodedLooperBufferError(id, error)
      })
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
  onDecodedLooperBuffer: PropTypes.func,
  onDecodedLooperBufferError: PropTypes.func,
  clearEngineEvents: PropTypes.func,
}

GleetchyEngine.defaultProps = {
  engineEvents: [],
  loopers: [],
  onDecodedLooperBuffer: () => {},
  onDecodedLooperBufferError: () => {},
  clearEngineEvents: () => {},
}

export default connect(
  ({ gleetchy }) => ({
    engineEvents: gleetchy.engineEvents,
    loopers: gleetchy.loopers,
  }),
  dispatch => ({
    clearEngineEvents: () => dispatch({ type: ENGINE_EVENTS_CLEAR }),
    onDecodedLooperBuffer: (id, props) =>
      dispatch({
        type: LOOPER_LOAD_FILE_DECODE_COMPLETE,
        payload: { id, props },
      }),
    onDecodedLooperBufferError: (id, error) =>
      dispatch({
        type: LOOPER_LOAD_FILE_ERROR,
        payload: { id, error },
      }),
  }),
)(GleetchyEngine)
