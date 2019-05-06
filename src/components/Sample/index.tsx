import React, { ReactNode, FunctionComponent } from 'react'
import { onlyUpdateForKeys } from 'recompose'
import { css, cx } from 'emotion'
import color from 'color'

import { noop } from '~/util/function'
import { layoutAbsoluteFill } from '~/style/layout'
import { colorPage } from '~/style/color'
import LoopRegion from '~/components/LoopRegion'
import WaveForm from '~/components/WaveForm'

export interface SampleProps {
  fromSaved?: boolean
  audioBuffer?: AudioBuffer
  loopStart?: number
  loopEnd?: number
  children?: ReactNode // needed for recompose hoc
  onLoopStartDrag?(movement: number): unknown
  onLoopEndDrag?(movement: number): unknown
  onLoopRegionDrag?(movement: number): unknown
  selectAudioFile?(): unknown
}

const rootStyle = css({
  height: '100%',
  position: 'relative',
  width: '100%',
})

const waveFormContainerStyle = cx(
  layoutAbsoluteFill,
  css({
    zIndex: 1,
  }),
)

const loopRegionContainerStyle = cx(
  layoutAbsoluteFill,
  css({
    zIndex: 2,
  }),
)

const initLoadButonStyle = cx(
  layoutAbsoluteFill,
  css({
    alignItems: 'center',
    backgroundColor: color(colorPage)
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
  }),
)

const Sample: FunctionComponent<SampleProps> = ({
  audioBuffer,
  loopStart = 0,
  loopEnd = 1,
  fromSaved = false,
  onLoopStartDrag = noop,
  onLoopEndDrag = noop,
  onLoopRegionDrag = noop,
  selectAudioFile = noop,
}) => (
  <div className={rootStyle}>
    <div className={waveFormContainerStyle}>
      <WaveForm buffer={audioBuffer} />
    </div>
    {audioBuffer ? (
      <div className={loopRegionContainerStyle}>
        <LoopRegion
          loopStart={loopStart}
          loopEnd={loopEnd}
          onLoopStartDrag={onLoopStartDrag}
          onLoopEndDrag={onLoopEndDrag}
          onLoopRegionDrag={onLoopRegionDrag}
        />
      </div>
    ) : (
      <div
        role="button"
        tabIndex={0}
        onClick={selectAudioFile}
        className={initLoadButonStyle}
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

export default onlyUpdateForKeys<SampleProps>([
  'fromSaved',
  'audioBuffer',
  'loopStart',
  'loopEnd',
])(Sample)
