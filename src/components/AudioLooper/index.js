import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { clamp } from 'ramda'
import TitleBar from '../TitleBar'
import Knob from '../Knob'
import WaveForm from '../WaveForm'
import LoopRegion from '../LoopRegion'

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
      <div className="audioLooper">
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
        <div className="audioLooper__main">
          <div className="audioLooper__sampleContainer">
            <div className="audioLooper__waveFormContainer">
              <WaveForm buffer={audioBuffer} />
            </div>
            {audioBuffer ? (
              <div className="audioLooper__loopRegionContainer">
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
                className="audioLooper__initLoadButon"
              >
                Load audio file
              </div>
            )}
          </div>
          <div className="audioLooper__controls">
            <div className="audioLooper__controlContainer">
              <Knob
                value={gain}
                renderTitle={() => 'Gain'}
                renderLabel={() => 'G'}
                renderValue={() => gain.toFixed(2)}
                onChange={this.props.onGainChange}
              />
            </div>
            <div className="audioLooper__controlContainer">
              <Knob
                value={playbackRate * 0.5}
                renderTitle={() => 'Speed'}
                renderLabel={() => 'S'}
                renderValue={() => playbackRate.toFixed(2)}
                onChange={val => this.props.onPlaybackRateChange(val * 2)}
              />
            </div>
          </div>
        </div>
        <style jsx>{`
          .audioLooper {
            width: 100%;
            height: 100%;
          }

          .audioLooper__main {
            display: flex;
            flex-wrap: no-wrap;
            width: 100%;
            height: 100%;
          }

          .audioLooper__controls {
            height: 100%;
            margin-left: 1.2em;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: space-between;
          }

          .audioLooper__controlContainer {
            height: calc(50% - 0.6em);
          }

          .audioLooper__sampleContainer {
            position: relative;
            width: 100%;
            height: 100%;
          }

          .audioLooper__waveFormContainer,
          .audioLooper__loopRegionContainer {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
          }

          .audioLooper__waveFormContainer {
            z-index: 1;
          }

          .audioLooper__loopRegionContainer {
            z-index: 2;
          }

          .audioLooper__initLoadButon {
            width: 100%;
            height: 100%;
            position: absolute;
            top: 0;
            left: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            z-index: 3;
            background-color: rgba(255, 255, 255, 0.96);
          }
        `}</style>
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
