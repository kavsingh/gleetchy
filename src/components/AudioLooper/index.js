import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { clamp } from 'ramda'
import TitleBar from '../TitleBar'
import WaveForm from '../WaveForm'
import LoopRegion from '../LoopRegion'
import FileDropRegion from '../FileDropRegion'
import { renderEqControls, renderPlaybackControls } from './controls'

const renderTitle = (title, audioBuffer, selectAudioFile) => (
  <span>
    {title}
    {audioBuffer ? (
      <span
        role="button"
        tabIndex={0}
        style={{ cursor: 'pointer' }}
        onClick={selectAudioFile}
      >
        {' '}
        / Load audio file
      </span>
    ) : (
      ''
    )}
  </span>
)

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
      eqLow,
      eqMid,
      eqHigh,
      selectAudioFile,
      onGainChange,
      onPlaybackRateChange,
      onEqChange,
    } = this.props

    const title = [
      label,
      fileName ? ` / ${fileName}` : '',
      fileName && audioBuffer ? ` - ${audioBuffer.duration.toFixed(2)}s` : '',
    ].join('')

    return (
      <div className="audioLooper">
        <FileDropRegion
          fileFilter={({ type }) => type.startsWith('audio')}
          onFiles={files => this.props.receiveAudioFile(files[0])}
        >
          {fileDropEvents => (
            <div style={{ width: '100%', height: '100%' }} {...fileDropEvents}>
              <TitleBar>
                {() => renderTitle(title, audioBuffer, selectAudioFile)}
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
                      onClick={selectAudioFile}
                      className="audioLooper__initLoadButon"
                    >
                      Click to load audio file or drag it here
                    </div>
                  )}
                </div>
                <div className="audioLooper__controls">
                  {renderPlaybackControls(
                    gain,
                    playbackRate,
                    onGainChange,
                    onPlaybackRateChange,
                  )}
                  {renderEqControls(eqLow, eqMid, eqHigh, onEqChange)}
                </div>
              </div>
            </div>
          )}
        </FileDropRegion>
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
  eqLow: PropTypes.number,
  eqMid: PropTypes.number,
  eqHigh: PropTypes.number,
  label: PropTypes.string,
  audioBuffer: PropTypes.instanceOf(AudioBuffer),
  fileName: PropTypes.string,
  selectAudioFile: PropTypes.func,
  receiveAudioFile: PropTypes.func,
  onGainChange: PropTypes.func,
  onPlaybackRateChange: PropTypes.func,
  onLoopRegionChange: PropTypes.func,
  onEqChange: PropTypes.func,
}

AudioLooper.defaultProps = {
  loopStart: 0,
  loopEnd: 1,
  gain: 1,
  playbackRate: 1,
  eqLow: 0,
  eqMid: 0,
  eqHigh: 0,
  label: '',
  fileName: '',
  audioBuffer: undefined,
  selectAudioFile: () => {},
  receiveAudioFile: () => {},
  onGainChange: () => {},
  onPlaybackRateChange: () => {},
  onLoopRegionChange: () => {},
  onEqChange: () => {},
}

export default AudioLooper
