import { memo } from 'react'
import styled from '@emotion/styled'

import type { FCWithoutChildren } from '~/types'

const PlayPauseButton: FCWithoutChildren<{
  isPlaying: boolean
  onClick(): unknown
}> = ({ isPlaying, onClick }) => (
  <Container role="button" tabIndex={0} onClick={onClick}>
    {isPlaying ? 'Stop' : 'Play'}
  </Container>
)

export default memo(PlayPauseButton)

const Container = styled.div`
  cursor: pointer;
`
