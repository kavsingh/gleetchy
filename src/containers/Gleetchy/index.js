import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { head } from 'ramda'
import GithubIcon from 'react-icons/lib/go/mark-github'
import { decodeAudioDataP } from '../../util'
import { loadAudioFilesToArrayBuffers } from '../../apis/file'
import { createAudioLooperNode } from '../../audio/audioLooperNode'
import PlayPauseButton from '../../components/PlayPauseButton'
import AudioLooper from '../../components/AudioLooper'
import classNames from './Gleetchy.css'

const Panel = ({ children, style }) => (
  <div className={classNames.panel} style={{ ...style }}>
    {children}
  </div>
)

Panel.propTypes = {
  children: PropTypes.node,
  style: PropTypes.shape(),
}

Panel.defaultProps = {
  children: [],
  style: {},
}

class Gleetchy extends Component {
  constructor(...args) {
    super(...args)

    this.state = {
      isPlaying: false,
      loops: [
        {
          id: 'loop0',
          label: 'Loop 0',
          file: {},
          gain: 0.5,
          loopStart: 0,
          loopEnd: 1,
          playbackRate: 1,
        },
        {
          id: 'loop1',
          label: 'Loop 1',
          file: {},
          gain: 0.5,
          loopStart: 0,
          loopEnd: 1,
          playbackRate: 1,
        },
      ],
    }

    const AudioContext = window.AudioContext || window.webkitAudioContext
    const context = new AudioContext()

    this.audioLooperNodes = this.state.loops.reduce((acc, loop) => {
      acc[loop.id] = createAudioLooperNode(context, {
        buffer: (loop.file || {}).buffer,
        playbackRate: loop.playbackRate,
        loopStart: loop.loopStart,
        loopEnd: loop.loopEnd,
        gain: loop.gain,
      })

      return acc
    }, {})

    this.decodeAudioData = decodeAudioDataP(context)
    this.handlePlayPause = this.handlePlayPause.bind(this)

    Object.values(this.audioLooperNodes).forEach(node =>
      node.connectTo(context.destination),
    )
  }

  componentDidUpdate() {
    const { loops, isPlaying } = this.state

    loops.forEach(loop => {
      const node = this.audioLooperNodes[loop.id]

      node.set({
        buffer: (loop.file || {}).buffer,
        playbackRate: loop.playbackRate,
        loopStart: loop.loopStart,
        loopEnd: loop.loopEnd,
        gain: loop.gain,
      })

      if (isPlaying) node.play()
      else node.stop()
    })
  }

  updateLoopState(id, newState) {
    this.setState(state => {
      const loops = [...state.loops]
      const loopState = loops.find(loop => loop.id === id)

      if (!loopState) return {}

      Object.assign(loopState, newState)

      return { loops }
    })
  }

  handlePlayPause() {
    this.setState(state => ({ isPlaying: !state.isPlaying }))
  }

  async loadAudioToLooper(id) {
    const file = head(await loadAudioFilesToArrayBuffers())

    if (!file) throw new Error('No file selected')

    file.buffer = await this.decodeAudioData(file.buffer)
    this.updateLoopState(id, { file })

    return file
  }

  render() {
    const { loops, isPlaying } = this.state

    return (
      <div className={classNames.root}>
        <Panel>
          <div className={classNames.titleBar}>
            <PlayPauseButton
              isPlaying={this.state.isPlaying}
              onClick={this.handlePlayPause}
            />
            <a
              href="https://www.github.com/kavsingh/gleetchy"
              target="_blank"
              rel="noopener noreferrer"
              title="view on github"
            >
              <GithubIcon />
            </a>
          </div>
        </Panel>
        {loops.map(
          (
            { loopStart, loopEnd, gain, file, id, label, playbackRate },
            index,
          ) => (
            <Panel
              style={{
                height: '24vh',
                minHeight: '10em',
                maxHeight: '20em',
                ...(index === 0
                  ? { borderTop: '1px solid #fee' }
                  : { marginTop: '1em' }),
              }}
              key={id}
            >
              <AudioLooper
                gain={gain}
                playbackRate={playbackRate}
                loopStart={loopStart}
                loopEnd={loopEnd}
                label={label}
                file={file || {}}
                loadAudio={() =>
                  this.loadAudioToLooper(id).catch(error => {
                    alert(error) // eslint-disable-line
                  })}
                isPlaying={isPlaying}
                onGainChange={val => this.updateLoopState(id, { gain: val })}
                onPlaybackRateChange={val =>
                  this.updateLoopState(id, { playbackRate: val })}
                onLoopRegionChange={(start, end) =>
                  this.updateLoopState(id, {
                    loopStart: start,
                    loopEnd: end,
                  })}
              />
            </Panel>
          ),
        )}
      </div>
    )
  }
}

export default Gleetchy
