import React, { PureComponent, FunctionComponent } from 'react'
import { css } from '@emotion/core'
import { clamp } from 'ramda'

import { AudioNodeConnection } from '~/types'
import { noop } from '~/util/function'
import useFileDropRegion from '~/hooks/useFileDropRegion'
import Sample from '~/components/Sample'
import TitleBar from '~/components/TitleBar'
import { UI as Eq3 } from '~/nodes/audioEffects/eq3'

import PlaybackControls from './PlaybackControls'
import Button from '~/components/Button'

const rootStyle = css({
  height: '12em',
  transition: 'opacity 0.2s ease-out',
  width: '100%',
})

const inactiveStyle = css({
  opacity: 0.4,
})

const wrapStyle = css({
  alignItems: 'stretch',
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  justifyContent: 'stretch',
  width: '100%',
})

const titleContainerStyle = css({
  flexGrow: 0,
  flexShrink: 0,
  width: '100%',
})

const mainContainerStyle = css({
  display: 'flex',
  flex: '1 0 10em',
  flexWrap: 'nowrap',
  paddingLeft: '0.2em',
  width: '100%',
})

const controlsContainerStyle = css({
  display: 'flex',
  height: '100%',
  marginLeft: '1.2em',
})

const AudioFileDropRegion: FunctionComponent<{
  onFiles(files: File[]): unknown
}> = ({ children, onFiles }) => {
  const [, events] = useFileDropRegion({
    onFiles,
    fileFilter: ({ type }) => type.startsWith('audio'),
  })

  return (
    <div css={wrapStyle} {...events}>
      {children}
    </div>
  )
}

export interface LoopProps {
  loopStart: number
  loopEnd: number
  label: string
  fileName: string
  connections: AudioNodeConnection[]
  isActive: boolean
  highGain: number
  midGain: number
  lowGain: number
  playbackRate: number
  gain: number
  audioBuffer?: AudioBuffer
  onGainChange(gain: number): unknown
  onPlaybackRateChange(playbackRate: number): unknown
  onEqChange(props: { [key: string]: number }): unknown
  selectAudioFile(): unknown
  receiveAudioFile(file: File): unknown
  onLoopRegionChange(start: number, end: number): unknown
  onLabelChange(label: string): unknown
  remove(): unknown
}

const renderTitle = (
  fileName: string,
  selectAudioFile: () => void,
  audioBuffer?: AudioBuffer,
) => (
  <span>
    {fileName ? `${fileName}` : ''}
    {fileName && audioBuffer ? ` - ${audioBuffer.duration.toFixed(2)}s` : ''}
    {fileName ? ' / ' : ''}
    <Button handler={selectAudioFile} label="Load audio file" />
  </span>
)

class Loop extends PureComponent<LoopProps> {
  public render() {
    const {
      audioBuffer,
      loopStart = 0,
      loopEnd = 1,
      label = '',
      fileName = '',
      connections = [],
      isActive = true,
      highGain = 0,
      midGain = 0,
      lowGain = 0,
      playbackRate = 1,
      gain = 0.5,
      onGainChange = noop,
      onPlaybackRateChange = noop,
      onEqChange = noop,
      selectAudioFile = noop,
      receiveAudioFile = noop,
      onLabelChange = noop,
      remove = noop,
    } = this.props

    return (
      <div css={[rootStyle, !isActive && inactiveStyle]}>
        <AudioFileDropRegion onFiles={files => receiveAudioFile(files[0])}>
          <div css={titleContainerStyle}>
            <TitleBar
              type="Loop"
              label={label}
              onLabelChange={onLabelChange}
              onRemoveClick={remove}
              connections={connections}
            >
              {() => renderTitle(fileName, selectAudioFile, audioBuffer)}
            </TitleBar>
          </div>
          <div css={mainContainerStyle}>
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
            <div css={controlsContainerStyle}>
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
        </AudioFileDropRegion>
      </div>
    )
  }

  private handleLoopStartDrag = (movement: number) => {
    const { loopStart, loopEnd } = this.props

    this.props.onLoopRegionChange(
      clamp(0, loopEnd - 0.0001, loopStart + movement),
      loopEnd,
    )
  }

  private handleLoopEndDrag = (movement: number) => {
    const { loopStart, loopEnd } = this.props

    this.props.onLoopRegionChange(
      loopStart,
      clamp(loopStart + 0.0001, 1, loopEnd + movement),
    )
  }

  private handleLoopRegionDrag = (movement: number) => {
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
}

export default Loop
