import React, { memo } from 'react'
import styled from '@emotion/styled'
import { memoizeWith, identity } from 'ramda'
import color from 'color'

import { FunctionComponentWithoutChildren, AudioNodeMeta } from '~/types'
import { ThemeProps } from '~/style/theme'
import useConnection from '~/state/hooks/use-connection'

const PatchBayNode: FunctionComponentWithoutChildren<{
  source: AudioNodeMeta
  target: AudioNodeMeta
}> = ({ source, target }) => {
  const [{ connection, blocked }, { toggleConnection }] = useConnection(
    source,
    target,
  )
  const title = blocked
    ? 'This will cause a circular connection, big feedback, ear bleeding, much sadness'
    : `From ${source.label} to ${target.label}`

  return (
    <Container
      role="button"
      title={title}
      activeColor={connection?.color}
      blocked={!!blocked}
      onClick={toggleConnection}
      tabIndex={0}
      onKeyUp={e => {
        if (e.key === 'Enter') toggleConnection()
      }}
    />
  )
}

export default memo(PatchBayNode)

const getActiveBorderColor = memoizeWith(identity, (activeColor: string) =>
  color(activeColor)
    .darken(0.06)
    .hex(),
)

const Container = styled.div<
  ThemeProps & {
    activeColor?: string
    blocked: boolean
  }
>`
  width: 0.8em;
  height: 0.8em;
  margin: 0 auto;
  border: 1px solid
    ${({ activeColor, theme }) =>
      activeColor ? getActiveBorderColor(activeColor) : theme.colors.keyline};
  background-color: ${({ activeColor, blocked, theme }) =>
    activeColor || (blocked ? theme.colors.keyline : 'transparent')};
  transform: ${({ blocked }) =>
    blocked ? 'rotate(45deg) scale(0.5)' : 'rotate(0deg) scale(1)'};
  cursor: ${({ blocked }) => (blocked ? 'default' : 'pointer')};
  transition: all 0.2s ease-out;

  &:hover {
    border-color: ${({ activeColor, theme }) =>
      activeColor || theme.colors.body};
  }
`
