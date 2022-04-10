import { memo, useMemo } from 'react'
import { useTheme } from '@emotion/react'
import styled from '@emotion/styled'
import color from 'color'

import { noop } from '~/lib/util'
import { layoutAbsoluteFill } from '~/style/layout'
import LoopRegion from '~/components/loop-region'
import Waveform from '~/components/waveform'

import type { FC } from 'react'
import type { ThemeProps } from '~/style/theme'

const Sample: FC<SampleProps> = ({
  audioBuffer,
  positionRatio = 0,
  loopStart = 0,
  loopEnd = 1,
  fromSaved = false,
  onLoopStartDrag = noop,
  onLoopEndDrag = noop,
  onLoopRegionDrag = noop,
  selectAudioFile = noop,
}) => {
  const theme = useTheme()

  const waveForm = useMemo(
    () => (
      <Waveform
        color={theme.colors.emphasis}
        baselineColor={theme.colors.keyline}
        buffer={audioBuffer}
      />
    ),
    [audioBuffer, theme.colors.emphasis, theme.colors.keyline],
  )
  const loopRegion = useMemo(
    () => (
      <LoopRegion
        loopStart={loopStart}
        loopEnd={loopEnd}
        onLoopStartDrag={onLoopStartDrag}
        onLoopEndDrag={onLoopEndDrag}
        onLoopRegionDrag={onLoopRegionDrag}
      />
    ),
    [loopStart, loopEnd, onLoopStartDrag, onLoopEndDrag, onLoopRegionDrag],
  )

  return (
    <Container>
      <WaveformContainer>{waveForm}</WaveformContainer>
      {audioBuffer ? (
        <>
          <PlayheadContainer>
            <Playhead position={positionRatio} />
          </PlayheadContainer>
          <LoopRegionContainer>{loopRegion}</LoopRegionContainer>
        </>
      ) : (
        <InitLoadButon
          role="button"
          tabIndex={0}
          onClick={selectAudioFile}
          onKeyDown={({ key }) => {
            if (key === 'Enter') {
              selectAudioFile()
            }
          }}
        >
          {fromSaved
            ? [
                <span key="a">
                  Unfortunately audio data is not saved with a project
                </span>,
                <span key="b">
                  Click here (or drag and drop) to load files again
                </span>,
              ]
            : 'Click to load audio file or drag it here'}
        </InitLoadButon>
      )}
    </Container>
  )
}

export default memo(Sample)

const Container = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`

const WaveformContainer = styled.div`
  ${layoutAbsoluteFill}
  z-index: 1;
`

const PlayheadContainer = styled.div`
  ${layoutAbsoluteFill}
  overflow: hidden;
  pointer-events: none;
`

const Playhead = styled.div<ThemeProps & { position: number }>`
  ${layoutAbsoluteFill}
  z-index: 2;
  transform: translateX(${({ position }) => position * 100}%);
  pointer-events: none;

  &::before {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    display: block;
    width: 1px;
    background-color: ${({ theme }) => theme.colors.emphasis};
    content: ' ';
  }
`

const LoopRegionContainer = styled.div`
  ${layoutAbsoluteFill}
  z-index: 3;
`

const InitLoadButon = styled.div<ThemeProps>`
  ${layoutAbsoluteFill}
  z-index: 3;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  padding: 3em;
  background-color: ${({ theme }) =>
    color(theme.colors.page).alpha(0.96).string()};
  cursor: pointer;

  span {
    display: block;
    text-align: center;
  }
`

export interface SampleProps {
  audioBuffer: Nullable<AudioBuffer>
  positionRatio?: number
  fromSaved?: boolean
  loopStart?: number
  loopEnd?: number
  onLoopStartDrag?(movement: number): unknown
  onLoopEndDrag?(movement: number): unknown
  onLoopRegionDrag?(movement: number): unknown
  selectAudioFile?(): unknown
}
