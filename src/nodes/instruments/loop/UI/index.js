import React, { PureComponent } from 'react'
import { cx } from 'emotion'
import { clamp } from 'ramda'

import PropTypes from '~/PropTypes'
import { noop } from '~/util/function'
import { cssLabeled } from '~/util/style'
import { UI as Eq3 } from '~/nodes/audioEffects/eq3'
import TitleBar from '~/components/TitleBar'
import FileDropRegion from '~/components/FileDropRegion'
import Sample from '~/components/Sample'
import PlaybackControls from './PlaybackControls'

const classes = cssLabeled('loop', {
  root: {
    transition: 'opacity 0.2s ease-out',
    width: '100%',
    height: '12em',
  },

  inactive: {
    opacity: 0.4,
  },

  wrap: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    justifyContent: 'stretch',
  },

  titleContainer: {
    flexGrow: 0,
    flexShrink: 0,
    width: '100%',
  },

  mainContainer: {
    display: 'flex',
    flexWrap: 'nowrap',
    flex: '1 0 10em',
    width: '100%',
    paddingLeft: '0.2em',
  },

  controlsContainer: {
    height: '100%',
    marginLeft: '1.2em',
    display: 'flex',
  },

  titleLoadAudio: {
    display: 'inline-block',
    cursor: 'pointer',
    marginLeft: '0.3em',
  },
})

const renderTitle = (fileName, audioBuffer, selectAudioFile) => (
  <span>
    {fileName ? `${fileName}` : ''}
    {fileName && audioBuffer ? ` - ${audioBuffer.duration.toFixed(2)}s` : ''}
    <span
      role="button"
      tabIndex={0}
      className={classes.titleLoadAudio}
      onClick={selectAudioFile}
      onKeyDown={({ key }) => {
        if (key === 'Enter') selectAudioFile()
      }}
    >
      {`${fileName ? ' / ' : ''}[ Load audio file ]`}
    </span>
  </span>
)

class Loop extends PureComponent {
  handleLoopStartDrag = movement => {
    const { loopStart, loopEnd } = this.props

    this.props.onLoopRegionChange(
      clamp(0, loopEnd - 0.0001, loopStart + movement),
      loopEnd,
    )
  }

  handleLoopEndDrag = movement => {
    const { loopStart, loopEnd } = this.props

    this.props.onLoopRegionChange(
      loopStart,
      clamp(loopStart + 0.0001, 1, loopEnd + movement),
    )
  }

  handleLoopRegionDrag = movement => {
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
      <div className={cx([classes.root, !isActive && classes.inactive])}>
        <FileDropRegion
          fileFilter={({ type }) => type.startsWith('audio')}
          onFiles={files => receiveAudioFile(files[0])}
        >
          {({ dropActive, ...fileDropEvents }) => (
            <div className={classes.wrap} {...fileDropEvents}>
              <div className={classes.titleContainer}>
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
              <div className={classes.mainContainer}>
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
                <div className={classes.controlsContainer}>
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
  remove: noop,
}

export default Loop
