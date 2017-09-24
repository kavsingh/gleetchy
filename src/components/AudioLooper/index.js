import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { clamp } from 'ramda'
import Slider from '../Slider'
import WaveForm from '../WaveForm'
import LoopRegion from '../LoopRegion'
import classNames from './AudioLooper.css'

class AudioLooper extends Component {
  constructor(props, ...rest) {
    super(props, ...rest)

    this.state = {
      loopStart: props.loopStart || 0,
      loopEnd: props.loopEnd || 1,
      gain: props.gain || 0,
      playbackRate: props.playbackRate || 1,
    }

    this.bufferSourceNode = null
    this.gainNode = this.props.createGainNode()

    this.handleLoadAudioClick = this.handleLoadAudioClick.bind(this)
    this.handleLoopStartDrag = this.handleLoopStartDrag.bind(this)
    this.handleLoopEndDrag = this.handleLoopEndDrag.bind(this)
    this.handleLoopRegionDrag = this.handleLoopRegionDrag.bind(this)
    this.handleGainChange = this.handleGainChange.bind(this)
    this.handleRateChange = this.handleRateChange.bind(this)

    this.gainNode.gain.value = this.state.gain

    this.props.connect(this.gainNode)
  }

  componentDidUpdate(prevProps, prevState) {
    const { isPlaying, buffer } = this.props
    const { loopStart, loopEnd, gain, playbackRate } = this.state

    const playChanged = isPlaying !== prevProps.isPlaying
    const bufferChanged = prevProps.buffer !== buffer
    const startChanged = loopStart !== prevState.loopStart

    this.gainNode.gain.value = gain

    if (buffer) {
      if (bufferChanged || playChanged || startChanged) {
        this.replaceBufferSourceNode()

        if (isPlaying) {
          this.bufferSourceNode.start(0, loopStart * buffer.duration)
        }
      } else {
        this.bufferSourceNode.loopStart = loopStart * buffer.duration
        this.bufferSourceNode.loopEnd = loopEnd * buffer.duration
        this.bufferSourceNode.playbackRate.value = playbackRate
      }
    }
  }

  componentWillUnmount() {
    if (this.bufferSourceNode) this.props.disconnect(this.bufferSourceNode)
  }

  handleLoadAudioClick() {
    this.props.loadAudio()
  }

  handleLoopStartDrag(movement) {
    this.setState(state => ({
      loopStart: clamp(0, state.loopEnd - 0.0001, state.loopStart + movement),
    }))
  }

  handleLoopEndDrag(movement) {
    this.setState(state => ({
      loopEnd: clamp(state.loopStart + 0.0001, 1, state.loopEnd + movement),
    }))
  }

  handleLoopRegionDrag(movement) {
    this.setState(({ loopStart, loopEnd }) => {
      const gap = loopEnd - loopStart

      let nextStart
      let nextEnd

      if (movement < 0) {
        nextStart = clamp(0, 1 - gap, loopStart + movement)
        nextEnd = nextStart + gap
      } else {
        nextEnd = clamp(gap, 1, loopEnd + movement)
        nextStart = nextEnd - gap
      }

      return { loopStart: nextStart, loopEnd: nextEnd }
    })
  }

  handleGainChange(gain) {
    this.setState(() => ({ gain }))
  }

  handleRateChange(playbackRate) {
    this.setState(() => ({ playbackRate }))
  }

  replaceBufferSourceNode() {
    if (this.bufferSourceNode) {
      this.bufferSourceNode.disconnect(this.gainNode)
      this.bufferSourceNode = null
    }

    const { loopStart, loopEnd, playbackRate } = this.state
    const { createBufferSourceNode, buffer } = this.props

    this.bufferSourceNode = createBufferSourceNode()
    this.bufferSourceNode.buffer = buffer
    this.bufferSourceNode.loop = true
    this.bufferSourceNode.loopStart = loopStart * buffer.duration
    this.bufferSourceNode.loopEnd = loopEnd * buffer.duration
    this.bufferSourceNode.playbackRate.value = playbackRate

    this.bufferSourceNode.connect(this.gainNode)
  }

  render() {
    const { buffer } = this.props
    const { loopEnd, loopStart, gain, playbackRate } = this.state

    return (
      <div className={classNames.root}>
        <div className={classNames.waveContainer}>
          <div className={classNames.waveFormContainer}>
            <WaveForm buffer={buffer} />
          </div>
          {buffer ? (
            <div className={classNames.loopRegionContainer}>
              <LoopRegion
                loopStart={loopStart}
                loopEnd={loopEnd}
                onLoopStartDrag={this.handleLoopStartDrag}
                onLoopEndDrag={this.handleLoopEndDrag}
                onLoopRegionDrag={this.handleLoopRegionDrag}
              />
            </div>
          ) : (
            <div
              role="button"
              tabIndex={0}
              onClick={this.handleLoadAudioClick}
              className={classNames.initLoadAudio}
            >
              Load audio file
            </div>
          )}
        </div>
        <div className={classNames.gainSliderContainer}>
          <Slider
            value={gain}
            renderLabel={() => 'G'}
            renderValue={() => gain.toFixed(2)}
            onChange={this.handleGainChange}
          />
        </div>
        <div className={classNames.rateSliderContainer}>
          <Slider
            value={playbackRate}
            renderLabel={() => 'S'}
            renderValue={() => playbackRate.toFixed(2)}
            onChange={this.handleRateChange}
          />
        </div>
      </div>
    )
  }
}

AudioLooper.propTypes = {
  loopStart: PropTypes.number,
  loopEnd: PropTypes.number,
  gain: PropTypes.number,
  playbackRate: PropTypes.number,
  isPlaying: PropTypes.bool,
  buffer: PropTypes.instanceOf(AudioBuffer),
  loadAudio: PropTypes.func,
  connect: PropTypes.func,
  disconnect: PropTypes.func,
  createBufferSourceNode: PropTypes.func,
  createGainNode: PropTypes.func,
}

AudioLooper.defaultProps = {
  loopStart: 0,
  loopEnd: 1,
  gain: 1,
  playbackRate: 1,
  isPlaying: false,
  buffer: null,
  loadAudio: () => {},
  connect: () => {},
  disconnect: () => {},
  createBufferSourceNode: () => {},
  createGainNode: () => {},
}

export default AudioLooper
