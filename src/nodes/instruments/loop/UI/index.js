import React, { Component } from 'react'
import { clamp, always } from 'ramda'
import PropTypes from '~/PropTypes'
import { noop } from '~/util/function'
import { UI as Eq3 } from '~/nodes/audioEffects/eq3'
import TitleBar from '~/components/TitleBar'
import FileDropRegion from '~/components/FileDropRegion'
import Sample from '~/components/Sample'
import PlaybackControls from './PlaybackControls'

const renderTitle = (fileName, audioBuffer, selectAudioFile) => (
  <span className="loop__titleSpan">
    {fileName ? `${fileName}` : ''}
    {fileName && audioBuffer ? ` - ${audioBuffer.duration.toFixed(2)}s` : ''}
    <span
      role="button"
      tabIndex={0}
      className="loop__titleLoadAudio"
      onClick={selectAudioFile}
      onKeyDown={({ key }) => {
        if (key === 'Enter') selectAudioFile()
      }}
    >
      {`${fileName ? ' / ' : ''}[ Load audio file ]`}
    </span>
    <style jsx>{`
      .loop__titleLoadAudio {
        display: inline-block;
        cursor: pointer;
        margin-left: 0.3em;
      }
    `}</style>
  </span>
)

class Loop extends Component {
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
      selectAudioFile,
      receiveAudioFile,
      onLabelChange,
      highGain,
      midGain,
      lowGain,
      playbackRate,
      gain,
      onGainChange,
      onPlaybackRateChange,
      onEqChange,
      remove,
      connections,
      isActive,
    } = this.props

    return (
      <div className={`loop loop_${isActive ? 'active' : 'inactive'}`}>
        <FileDropRegion
          fileFilter={({ type }) => type.startsWith('audio')}
          onFiles={files => receiveAudioFile(files[0])}
        >
          {({ dropActive, ...fileDropEvents }) => (
            <div className="loop__wrap" {...fileDropEvents}>
              <div className="loop__title">
                <TitleBar
                  type="Loop"
                  label={label}
                  onLabelChange={onLabelChange}
                  onRemoveClick={remove}
                  connections={connections}
                >
                  {() => renderTitle(fileName, audioBuffer, selectAudioFile)}
                </TitleBar>
              </div>
              <div className="loop__main">
                <Sample
                  fromSaved={!!(fileName && !audioBuffer)}
                  audioBuffer={audioBuffer}
                  loopStart={loopStart}
                  loopEnd={loopEnd}
                  onLoopStartDrag={this.handleLoopStartDrag}
                  onLoopEndDrag={this.handleLoopEndDrag}
                  onLoopRegionDrag={this.handleLoopRegionDrag}
                  selectAudioFile={selectAudioFile}
                />
                <div className="loop__controlsContainer">
                  <PlaybackControls
                    gain={gain}
                    playbackRate={playbackRate}
                    onGainChange={onGainChange}
                    onPlaybackRateChange={onPlaybackRateChange}
                  />
                  <Eq3
                    lowGain={lowGain}
                    midGain={midGain}
                    highGain={highGain}
                    onChange={onEqChange}
                  />
                </div>
              </div>
            </div>
          )}
        </FileDropRegion>
        <style jsx>{`
          .loop {
            transition: opacity 0.2s ease-out;
            width: 100%;
            height: 12em;
          }

          .loop_inactive {
            opacity: 0.4;
          }

          .loop__wrap {
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            align-items: stretch;
            justify-content: stretch;
          }

          .loop__title {
            flex-grow: 0;
            flex-shrink: 0;
            width: 100%;
          }

          .loop__main {
            display: flex;
            flex-wrap: nowrap;
            flex: 1 0 10em;
            width: 100%;
            padding-left: 0.2em;
          }

          .loop__controlsContainer {
            height: 100%;
            margin-left: 1.2em;
            display: flex;
          }
        `}</style>
      </div>
    )
  }
}

Loop.propTypes = {
  loopStart: PropTypes.number,
  loopEnd: PropTypes.number,
  label: PropTypes.string,
  // eslint-disable-next-line react/no-typos
  audioBuffer: PropTypes.audioBuffer,
  fileName: PropTypes.string,
  connections: PropTypes.arrayOf(PropTypes.connection),
  isActive: PropTypes.bool,
  highGain: PropTypes.number,
  midGain: PropTypes.number,
  lowGain: PropTypes.number,
  playbackRate: PropTypes.number,
  gain: PropTypes.number,
  onGainChange: PropTypes.func,
  onPlaybackRateChange: PropTypes.func,
  onEqChange: PropTypes.func,
  selectAudioFile: PropTypes.func,
  receiveAudioFile: PropTypes.func,
  onLoopRegionChange: PropTypes.func,
  onLabelChange: PropTypes.func,
  renderControls: PropTypes.func,
  remove: PropTypes.func,
}

Loop.defaultProps = {
  loopStart: 0,
  loopEnd: 1,
  label: '',
  audioBuffer: undefined,
  fileName: '',
  connections: [],
  isActive: true,
  highGain: 0,
  midGain: 0,
  lowGain: 0,
  playbackRate: 1,
  gain: 0.5,
  onGainChange: noop,
  onPlaybackRateChange: noop,
  onEqChange: noop,
  selectAudioFile: noop,
  receiveAudioFile: noop,
  onLoopRegionChange: noop,
  onLabelChange: noop,
  renderControls: always(<div />),
  remove: noop,
}

export default Loop