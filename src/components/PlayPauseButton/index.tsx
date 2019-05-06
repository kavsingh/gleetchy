import React, { memo, FunctionComponent } from 'react'
import { css } from 'emotion'

const rootStyle = css({
  cursor: 'pointer',
})

export interface PlayPauseButtonProps {
  isPlaying: boolean
  onClick(): unknown
}

const PlayPauseButton: FunctionComponent<PlayPauseButtonProps> = ({
  isPlaying,
  onClick,
}) => (
  <div role="button" tabIndex={0} onClick={onClick} className={rootStyle}>
    {isPlaying ? 'Stop' : 'Play'}
  </div>
)

export default memo(PlayPauseButton)
