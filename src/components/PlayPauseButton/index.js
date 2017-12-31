import React from 'react'

import PropTypes from '~/PropTypes'
import { noop } from '~/util/function'
import { cssLabeled } from '~/util/style'

const classes = cssLabeled('playPauseButton', {
  root: {
    cursor: 'pointer',
  },
})

const PlayPauseButton = ({ isPlaying, onClick }) => (
  <div
    role="button"
    tabIndex={0}
    onClick={onClick}
    className={classes.root}
    onKeyDown={({ key }) => {
      if (key === 'Enter') onClick()
    }}
  >
    {isPlaying ? 'Stop' : 'Play'}
  </div>
)

PlayPauseButton.propTypes = {
  isPlaying: PropTypes.bool,
  onClick: PropTypes.func,
}

PlayPauseButton.defaultProps = {
  isPlaying: false,
  onClick: noop,
}

export default PlayPauseButton
