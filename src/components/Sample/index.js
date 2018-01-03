import React from 'react'
import { onlyUpdateForKeys } from 'recompose'
import color from 'color'

import PropTypes from '~/PropTypes'
import { COLOR_PAGE, LAYOUT_ABSOLUTE_FILL } from '~/constants/style'
import { noop } from '~/util/function'
import { cssLabeled } from '~/util/style'
import WaveForm from '~/components/WaveForm'
import LoopRegion from '~/components/LoopRegion'

const classes = cssLabeled('sample', {
  root: {
    position: 'relative',
    width: '100%',
    height: '100%',
  },

  waveFormContainer: {
    ...LAYOUT_ABSOLUTE_FILL,
    zIndex: 1,
  },

  loopRegionContainer: {
    ...LAYOUT_ABSOLUTE_FILL,
    zIndex: 2,
  },

  initLoadButon: {
    ...LAYOUT_ABSOLUTE_FILL,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-around',
    cursor: 'pointer',
    zIndex: 3,
    padding: '3em',
    backgroundColor: color(COLOR_PAGE)
      .alpha(0.96)
      .string(),

    '& span': {
      display: 'block',
      textAlign: 'center',
    },
  },
})

const Sample = ({
  fromSaved,
  audioBuffer,
  loopStart,
  loopEnd,
  onLoopStartDrag,
  onLoopEndDrag,
  onLoopRegionDrag,
  selectAudioFile,
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
          if (key === 'Enter') selectAudioFile()
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

Sample.propTypes = {
  fromSaved: PropTypes.bool,
  // eslint-disable-next-line react/no-typos
  audioBuffer: PropTypes.audioBuffer,
  loopStart: PropTypes.number,
  loopEnd: PropTypes.number,
  onLoopStartDrag: PropTypes.func,
  onLoopEndDrag: PropTypes.func,
  onLoopRegionDrag: PropTypes.func,
  selectAudioFile: PropTypes.func,
}

Sample.defaultProps = {
  fromSaved: false,
  audioBuffer: undefined,
  loopStart: 0,
  loopEnd: 1,
  onLoopStartDrag: noop,
  onLoopEndDrag: noop,
  onLoopRegionDrag: noop,
  selectAudioFile: noop,
}

export default onlyUpdateForKeys([
  'fromSaved',
  'audioBuffer',
  'loopStart',
  'loopEnd',
])(Sample)
