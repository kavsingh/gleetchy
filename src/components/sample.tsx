import React, { FunctionComponent, memo, useMemo } from 'react'
import styled from '@emotion/styled'
import { withTheme } from 'emotion-theming'
import color from 'color'

import { noop } from '~/lib/util'
import { layoutAbsoluteFill } from '~/style/layout'
import { UITheme, ThemeProps } from '~/style/theme'
import LoopRegion from '~/components/loop-region'
import Waveform from '~/components/waveform'

export interface SampleProps {
  audioBuffer: Nullable<AudioBuffer>
  fromSaved?: boolean
  loopStart?: number
  loopEnd?: number
  onLoopStartDrag?(movement: number): unknown
  onLoopEndDrag?(movement: number): unknown
  onLoopRegionDrag?(movement: number): unknown
  selectAudioFile?(): unknown
  theme: UITheme
}

const Container = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`

const WaveformContainer = styled.div`
  ${layoutAbsoluteFill}
  z-index: 1;
`

const LoopRegionContainer = styled.div`
  ${layoutAbsoluteFill}
  z-index: 2;
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
    color(theme.colors.page)
      .alpha(0.96)
      .string()};
  cursor: pointer;

  span {
    display: block;
    text-align: center;
  }
`

const Sample: FunctionComponent<SampleProps> = ({
  audioBuffer,
  loopStart = 0,
  loopEnd = 1,
  fromSaved = false,
  onLoopStartDrag = noop,
  onLoopEndDrag = noop,
  onLoopRegionDrag = noop,
  selectAudioFile = noop,
  theme,
}) => {
  const waveForm = useMemo(
    () => (
      <Waveform
        color={theme.colors.emphasis}
        baselineColor={theme.colors.keyline}
        buffer={audioBuffer}
      />
    ),
    [audioBuffer, theme],
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
        <LoopRegionContainer>{loopRegion}</LoopRegionContainer>
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

type SampleProp = keyof SampleProps

const updateProps: SampleProp[] = [
  'fromSaved',
  'audioBuffer',
  'loopStart',
  'loopEnd',
]

export default memo(
  withTheme(Sample),
  (prevProps, nextProps) =>
    !updateProps.some(prop => prevProps[prop] !== nextProps[prop]),
)
