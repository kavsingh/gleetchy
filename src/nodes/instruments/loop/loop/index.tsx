import React, { PureComponent } from 'react'
import { clamp } from 'ramda'
import styled from '@emotion/styled'
import type { FunctionComponent } from 'react'

import { noop } from '~/lib/util'
import { UI as Eq3 } from '~/nodes/audio-effects/eq3'
import useFileDropRegion from '~/components/hooks/use-file-drop-region'

import LoopSample from './loop-sample'
import PlaybackControls from './playback-controls'
import LoopTitleBar from './loop-title-bar'
import type { LoopUIProps } from './types'

class Loop extends PureComponent<LoopUIProps> {
  public render() {
    const {
      nodeId,
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
      duplicate = noop,
      remove = noop,
    } = this.props

    return (
      <Container isActive={isActive}>
        <AudioFileDropRegion onFiles={(files) => receiveAudioFile(files[0])}>
          <TitleBarContainer>
            <LoopTitleBar
              label={label}
              fileName={fileName}
              audioBuffer={audioBuffer}
              connections={connections}
              onLabelChange={onLabelChange}
              duplicate={duplicate}
              remove={remove}
              selectAudioFile={selectAudioFile}
            />
          </TitleBarContainer>
          <MainContainer>
            <LoopSample
              nodeId={nodeId}
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

const AudioFileDropRegion: FunctionComponent<{
  onFiles(files: File[]): unknown
}> = ({ children, onFiles }) => {
  const [, eventHandlers] = useFileDropRegion({
    onFiles,
    fileFilter: ({ type }) => type.startsWith('audio'),
  })

  return <FileDropWrapper {...eventHandlers}>{children}</FileDropWrapper>
}

const FileDropWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: stretch;
  width: 100%;
  height: 100%;
`
