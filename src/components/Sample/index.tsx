import color from 'color'
import { Interpolation } from 'emotion'
import React, { ReactNode, StatelessComponent } from 'react'
import { onlyUpdateForKeys } from 'recompose'

import LoopRegion from '~/components/LoopRegion'
import WaveForm from '~/components/WaveForm'
import { COLOR_PAGE, LAYOUT_ABSOLUTE_FILL } from '~/constants/style'
import { noop } from '~/util/function'
import { cssLabeled } from '~/util/style'

export interface SampleProps {
  fromSaved?: boolean
  audioBuffer?: AudioBuffer
  loopStart?: number
  loopEnd?: number
  // needed for recompose hoc
  children?: ReactNode
  onLoopStartDrag?(): void
  onLoopEndDrag?(): void
  onLoopRegionDrag?(): void
  selectAudioFile?(): void
}

const classes = cssLabeled('sample', {
  root: {
    height: '100%',
    position: 'relative',
    width: '100%',
  },

  waveFormContainer: {
    ...LAYOUT_ABSOLUTE_FILL,
    zIndex: 1,
  } as Interpolation,

  loopRegionContainer: {
    ...LAYOUT_ABSOLUTE_FILL,
    zIndex: 2,
  } as Interpolation,

  initLoadButon: {
    ...LAYOUT_ABSOLUTE_FILL,
    alignItems: 'center',
    backgroundColor: color(COLOR_PAGE)
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
  } as Interpolation,
})

const Sample: StatelessComponent<SampleProps> = ({
  audioBuffer,
  loopStart = 0,
  loopEnd = 1,
  fromSaved = false,
  onLoopStartDrag = noop,
  onLoopEndDrag = noop,
  onLoopRegionDrag = noop,
  selectAudioFile = noop,
}) => (
  <div className={classes.root}>
    <div className={classes.waveFormContainer}>
      <WaveForm buffer={audioBuffer} />
    </div>
    {audioBuffer ? (
      <div className={classes.loopRegionContainer}>
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
        className={classes.initLoadButon}
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
