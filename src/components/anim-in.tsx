import { memo } from 'react'
import styled from '@emotion/styled'
import { keyframes } from '@emotion/core'

const animation = keyframes`
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
`

const AnimIn = styled.div`
  width: 100%;
  height: 100%;
  opacity: 0;
  animation: ${animation} 400ms forwards ease-out;
`

export default memo(AnimIn)
