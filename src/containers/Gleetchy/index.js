import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { tryCatch, head } from 'ramda'
import { warn, decodeAudioDataP } from '../../util'
import { loadAudioFilesToArrayBuffers } from '../../apis/file'
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

    const context = new AudioContext()
    const out = context.destination

    this.decodeAudioData = decodeAudioDataP(context)
    this.connectOut = tryCatch(node => node.connect(out), warn)
    this.disconnectOut = tryCatch(node => node.disconnect(out), warn)
    this.createBufferSourceNode = tryCatch(
      () => context.createBufferSource(),
      warn,
    )
    this.createGainNode = tryCatch(() => context.createGain(), warn)

    this.handlePlayPause = this.handlePlayPause.bind(this)
  }

  handlePlayPause() {
    this.setState(state => ({ isPlaying: !state.isPlaying }))
  }

  async loadAudioToLooper(id) {
    const file = head(await loadAudioFilesToArrayBuffers())

    if (!file) throw new Error('No file selected')

    file.buffer = await this.decodeAudioData(file.buffer)

    this.setState(state => {
      const loops = [...state.loops]
      const loopState = loops.find(loop => loop.id === id)

      if (!loopState) return {}

      loopState.file = file

      return { ...state, loops }
    })

    return file
  }

  render() {
    const { loops, isPlaying } = this.state

    return (
      <div className={classNames.root}>
        <Panel>
          <PlayPauseButton
            isPlaying={this.state.isPlaying}
            onClick={this.handlePlayPause}
          />
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
                createBufferSourceNode={this.createBufferSourceNode}
                createGainNode={this.createGainNode}
                label={label}
                file={file || {}}
                loadAudio={() => this.loadAudioToLooper(id)}
                connect={node => this.connectOut(node, id)}
                disconnect={node => this.disconnectOut(node, id)}
                isPlaying={isPlaying}
              />
            </Panel>
          ),
        )}
      </div>
    )
  }
}

export default Gleetchy
