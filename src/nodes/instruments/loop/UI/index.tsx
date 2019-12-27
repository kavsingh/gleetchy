import React, { PureComponent, FunctionComponent } from 'react'
import { clamp } from 'ramda'
import styled from '@emotion/styled'

import { AudioNodeConnection } from '~/types'
import { noop } from '~/util/function'
import { UI as Eq3 } from '~/nodes/audioEffects/eq3'
import useFileDropRegion from '~/components/hooks/useFileDropRegion'
import Sample from '~/components/Sample'
import TitleBar from '~/components/TitleBar'
import Button from '~/components/Button'

import PlaybackControls from './PlaybackControls'

const Container = styled.div<{ isActive: boolean }>`
  width: 100%;
  height: 12em;
  opacity: ${({ isActive }) => (isActive ? 1 : 0.4)};
  transition: opacity 0.2s ease-out;
`

const TitleBarContainer = styled.div`
  flex-grow: 0;
  flex-shrink: 0;
  width: 100%;
`

const FileDropWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: stretch;
  width: 100%;
  height: 100%;
`

const MainContainer = styled.div`
  display: flex;
  flex: 1 0 10em;
  flex-wrap: nowrap;
  width: 100%;
  padding-left: 0.2em;
`

const ControlsContainer = styled.div`
  display: flex;
  height: 100%;
  margin-left: 1.2em;
`

const Title = styled.div`
  display: flex;

  & span {
    margin-right: 0.3em;
  }
`

const AudioFileDropRegion: FunctionComponent<{
  onFiles(files: File[]): unknown
}> = ({ children, onFiles }) => {
  const [, eventHandlers] = useFileDropRegion({
    onFiles,
    fileFilter: ({ type }) => type.startsWith('audio'),
  })

  return <FileDropWrapper {...eventHandlers}>{children}</FileDropWrapper>
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
  <Title>
    {fileName ? <span>{fileName}</span> : null}
    {fileName && audioBuffer ? (
      <span> - {audioBuffer.duration.toFixed(2)}s</span>
    ) : null}
    {fileName ? <span>/</span> : null}
    <Button handler={selectAudioFile} label="Load audio file" />
  </Title>
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
      <Container isActive={isActive}>
        <AudioFileDropRegion onFiles={files => receiveAudioFile(files[0])}>
          <TitleBarContainer>
            <TitleBar
              type="Loop"
              label={label}
              onLabelChange={onLabelChange}
              onRemoveClick={remove}
              connections={connections}
            >
              {() => renderTitle(fileName, selectAudioFile, audioBuffer)}
            </TitleBar>
          </TitleBarContainer>
          <MainContainer>
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
            <ControlsContainer>
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
            </ControlsContainer>
          </MainContainer>
        </AudioFileDropRegion>
      </Container>
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
