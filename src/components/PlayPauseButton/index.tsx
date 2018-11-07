import React, { memo, StatelessComponent } from 'react'

import { cssLabeled } from '~/util/style'

const classes = cssLabeled('playPauseButton', {
  root: {
    cursor: 'pointer',
  },
})

export interface PlayPauseButtonProps {
  isPlaying: boolean
  onClick(): void
}

const PlayPauseButton: StatelessComponent<PlayPauseButtonProps> = ({
  isPlaying,
  onClick,
}) => (
  <div role="button" tabIndex={0} onClick={onClick} className={classes.root}>
    {isPlaying ? 'Stop' : 'Play'}
  </div>
)

export default memo<PlayPauseButtonProps>(PlayPauseButton)
