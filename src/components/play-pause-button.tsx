import React, { memo, FunctionComponent } from 'react'
import styled from '@emotion/styled'

const Container = styled.div`
  cursor: pointer;
`

export interface PlayPauseButtonProps {
  isPlaying: boolean
  onClick(): unknown
}

const PlayPauseButton: FunctionComponent<PlayPauseButtonProps> = ({
  isPlaying,
  onClick,
}) => (
  <Container role="button" tabIndex={0} onClick={onClick}>
    {isPlaying ? 'Stop' : 'Play'}
  </Container>
)

export default memo(PlayPauseButton)
