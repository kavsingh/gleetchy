import React, { FunctionComponent, memo, useMemo } from 'react'
import { css } from '@emotion/core'
import { withTheme } from 'emotion-theming'
import color from 'color'

import { noop } from '~/util/function'
import { layoutAbsoluteFill } from '~/style/layout'
import { UITheme } from '~/style/theme'
import LoopRegion from '~/components/LoopRegion'
import WaveForm from '~/components/WaveForm'

export interface SampleProps {
  fromSaved?: boolean
  audioBuffer?: AudioBuffer
  loopStart?: number
  loopEnd?: number
  onLoopStartDrag?(movement: number): unknown
  onLoopEndDrag?(movement: number): unknown
  onLoopRegionDrag?(movement: number): unknown
  selectAudioFile?(): unknown
  theme: UITheme
}

const rootStyle = css({
  height: '100%',
  position: 'relative',
  width: '100%',
})

const waveFormContainerStyle = css({
  zIndex: 1,
})

const loopRegionContainerStyle = css({
  zIndex: 2,
})

const initLoadButonStyle = (theme: UITheme) =>
  css({
    alignItems: 'center',
    backgroundColor: color(theme.colors.page)
      .alpha(0.96)
      .string(),
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-around',
    padding: '3em',
    zIndex: 3,

    '& span': {
      display: 'block',
      textAlign: 'center',
    },
  })

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
  const waveform = useMemo(
    () => (
      <WaveForm
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
    <div css={rootStyle}>
      <div css={[layoutAbsoluteFill, waveFormContainerStyle]}>{waveform}</div>
      {audioBuffer ? (
        <div css={[layoutAbsoluteFill, loopRegionContainerStyle]}>
          {loopRegion}
        </div>
      ) : (
        <div
          role="button"
          tabIndex={0}
          onClick={selectAudioFile}
          css={[layoutAbsoluteFill, initLoadButonStyle(theme)]}
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
        </div>
      )}
    </div>
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
