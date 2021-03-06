import { useMemo } from 'react'
import styled from '@emotion/styled'
import type { FunctionComponent } from 'react'

import { noop } from '~/lib/util'
import type { AudioNodeConnection } from '~/types'

import TextInput from './text-input'
import Button from './button'

const TitleBar: FunctionComponent<{
  label: string
  type: string
  connections?: AudioNodeConnection[]
  onLabelChange?(label: string): unknown
  onRemoveClick?(): unknown
}> = ({
  label,
  type,
  onLabelChange = noop,
  onRemoveClick = noop,
  connections = [],
  children,
}) => {
  const connectionIndicators = useMemo(
    () => (
      <>
        {connections.map(({ color, from, to }) => (
          <Connection color={color} key={`${from}${to}`} />
        ))}
      </>
    ),
    [connections],
  )

  return (
    <Container>
      <ConnectionsAndLabelContainer>
        <ConnectionsContainer>{connectionIndicators}</ConnectionsContainer>
        <TextInput onChange={onLabelChange} value={label} />
      </ConnectionsAndLabelContainer>
      <InfoContainer>
        <TypeLabel>{type} /</TypeLabel>
        {children}
        <Button handler={onRemoveClick}>Remove</Button>
      </InfoContainer>
    </Container>
  )
}

export default TitleBar

const Container = styled.div`
  margin-bottom: 0.6em;
  font-size: 0.8em;
`

const ConnectionsAndLabelContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;

  input {
    margin: 0;
    padding: 0;
    font-weight: 500;
    appearance: none;
  }
`

const InfoContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`

const ConnectionsContainer = styled.div`
  display: flex;
  height: 100%;
`

const Connection = styled.div`
  flex-grow: 0;
  flex-shrink: 0;
  width: 0.8em;
  height: 0.8em;
  margin-right: 0.3em;
  background-color: ${(props) => props.color};
`

const TypeLabel = styled.div`
  margin-right: 0.3em;
`
