import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { clamp } from 'ramda'
import TitleBar from '../TitleBar'
import Slider from '../Slider'
import WaveForm from '../WaveForm'
import LoopRegion from '../LoopRegion'
import classNames from './AudioLooper.css'

class AudioLooper extends Component {
  constructor(...args) {
    super(...args)

    this.handleLoopStartDrag = this.handleLoopStartDrag.bind(this)
    this.handleLoopEndDrag = this.handleLoopEndDrag.bind(this)
    this.handleLoopRegionDrag = this.handleLoopRegionDrag.bind(this)
  }

  handleLoopStartDrag(movement) {
    const { loopStart, loopEnd } = this.props

    this.props.onLoopRegionChange(
      clamp(0, loopEnd - 0.0001, loopStart + movement),
      loopEnd,
    )
  }

  handleLoopEndDrag(movement) {
    const { loopStart, loopEnd } = this.props

    this.props.onLoopRegionChange(
      loopStart,
      clamp(loopStart + 0.0001, 1, loopEnd + movement),
    )
  }

  handleLoopRegionDrag(movement) {
    const { loopStart, loopEnd } = this.props
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

    this.props.onLoopRegionChange(nextStart, nextEnd)
  }

  render() {
    const {
      fileName,
      audioBuffer,
      label,
      loopEnd,
      loopStart,
      gain,
      playbackRate,
    } = this.props

    const title = [
      label,
      fileName ? ` / ${fileName}` : '',
      fileName && audioBuffer ? ` - ${audioBuffer.duration.toFixed(2)}s` : '',
    ].join('')

    return (
      <div className={classNames.root}>
        <TitleBar>
          {() => (
            <span>
              {title}
              {audioBuffer ? (
                <span
                  role="button"
                  tabIndex={0}
                  style={{ cursor: 'pointer' }}
                  onClick={this.props.loadAudio}
                >
                  {' '}
                  / Load audio file
                </span>
              ) : (
                ''
              )}
            </span>
          )}
        </TitleBar>
        <div className={classNames.main}>
          <div className={classNames.waveContainer}>
            <div className={classNames.waveFormContainer}>
              <WaveForm buffer={audioBuffer} />
            </div>
            {audioBuffer ? (
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
                onClick={this.props.loadAudio}
                className={classNames.initLoadAudio}
              >
                Load audio file
              </div>
            )}
          </div>
          <div className={classNames.gainSliderContainer}>
            <Slider
              value={gain}
              renderTitle={() => 'Gain'}
              renderLabel={() => 'G'}
              renderValue={() => gain.toFixed(2)}
              onChange={this.props.onGainChange}
            />
          </div>
          <div className={classNames.rateSliderContainer}>
            <Slider
              value={playbackRate * 0.5}
              renderTitle={() => 'Speed'}
              renderLabel={() => 'S'}
              renderValue={() => playbackRate.toFixed(2)}
              onChange={val => this.props.onPlaybackRateChange(val * 2)}
            />
          </div>
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
  label: PropTypes.string,
  audioBuffer: PropTypes.instanceOf(AudioBuffer),
  fileName: PropTypes.string,
  loadAudio: PropTypes.func,
  onGainChange: PropTypes.func,
  onPlaybackRateChange: PropTypes.func,
  onLoopRegionChange: PropTypes.func,
}

AudioLooper.defaultProps = {
  loopStart: 0,
  loopEnd: 1,
  gain: 1,
  playbackRate: 1,
  label: '',
  fileName: '',
  audioBuffer: undefined,
  loadAudio: () => {},
  onGainChange: () => {},
  onPlaybackRateChange: () => {},
  onLoopRegionChange: () => {},
}

export default AudioLooper
