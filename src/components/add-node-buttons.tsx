import React, { memo } from 'react'
import styled from '@emotion/styled'

import { FunctionComponentWithoutChildren } from '~/types'

import Button from './button'

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 5em;
  padding: 1em 0;
  font-size: 0.8em;
`

const AddNodeButtons: FunctionComponentWithoutChildren<{
  buttons: [string, () => unknown][]
}> = ({ buttons }) => (
  <Container>
    {buttons.map(([name, handler]) => (
      <Button handler={handler} label={`Add ${name}`} key={name} />
    ))}
  </Container>
)

export default memo(AddNodeButtons)
