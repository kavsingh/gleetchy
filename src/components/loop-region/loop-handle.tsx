import { memo } from 'react'
import styled from '@emotion/styled'

import type { FCWithoutChildren } from '~/types'
import type { ThemeProps } from '~/style/theme'

const LoopHandle: FCWithoutChildren<{
  align: Alignment
}> = ({ align = 'left' }) => (
  <Container align={align}>
    <Tag align={align} />
    <Bar align={align} />
  </Container>
)

export default memo(LoopHandle)

const Container = styled.div<{ align: Alignment }>`
  position: relative;
  width: 100%;
  height: 100%;
  transform: ${({ align }) =>
    align === 'right' ? 'translateX(-100%)' : 'initial'};
  pointer-events: none;
`

const Tag = styled.div<
  { align: Alignment; verticalPosition?: 'top' | 'bottom' } & ThemeProps
>`
  position: absolute;
  top: ${({ verticalPosition = 'top' }) =>
    verticalPosition === 'top' ? 0 : 'initial'};
  right: ${({ align }) => (align === 'right' ? 0 : 'initial')};
  bottom: ${({ verticalPosition = 'top' }) =>
    verticalPosition === 'bottom' ? 0 : 'initial'};
  left: ${({ align }) => (align === 'left' ? 0 : 'initial')};
  width: 60%;
  height: 1px;
  background-color: ${({ theme }) => theme.colors.emphasis};
  pointer-events: all;
`

const Bar = styled.div<{ align: Alignment } & ThemeProps>`
  position: absolute;
  top: 0;
  right: ${({ align }) => (align === 'right' ? '-100%' : 'initial')};
  left: ${({ align }) => (align === 'left' ? '-100%' : 'initial')};
  width: 100%;
  height: 100%;
  border-right: ${({ align, theme }) =>
    align === 'left' ? `1px solid ${theme.colors.emphasis}` : 'none'};
  border-left: ${({ align, theme }) =>
    align === 'right' ? `1px solid ${theme.colors.emphasis}` : 'none'};
  pointer-events: all;
`

type Alignment = 'left' | 'right'
