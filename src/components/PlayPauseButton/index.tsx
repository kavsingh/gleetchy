import React, { memo, FunctionComponent } from 'react'

import { cssLabeled } from '~/util/style'

const classes = cssLabeled('playPauseButton', {
  root: {
    cursor: 'pointer',
  },
})

export interface PlayPauseButtonProps {
  isPlaying: boolean
  onClick(): unknown
}

const PlayPauseButton: FunctionComponent<PlayPauseButtonProps> = ({
  isPlaying,
  onClick,
}) => (
  <div role="button" tabIndex={0} onClick={onClick} className={classes.root}>
    {isPlaying ? 'Stop' : 'Play'}
  </div>
)

export default memo(PlayPauseButton)
