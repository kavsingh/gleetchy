import React, { memo, FunctionComponent, ReactNode } from 'react'
import styled from '@emotion/styled'

import { AudioNodeConnection } from '~/types'
import { noop } from '~/util/function'

import TextInput from '../TextInput'
import Button from '../Button'

const Container = styled.div`
  margin-bottom: 0.6em;
  font-size: 0.8em;
`

const LabelContainer = styled.div`
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
  background-color: ${props => props.color};
`

const TypeLabel = styled.div`
  margin-right: 0.3em;
`

export interface TitleBarProps {
  label: string
  type: string
  connections?: AudioNodeConnection[]
  children?: ReactNode | (() => ReactNode)
  onLabelChange?(label: string): unknown
  onRemoveClick?(): unknown
}

const TitleBar: FunctionComponent<TitleBarProps> = ({
  label,
  type,
  onLabelChange = noop,
  onRemoveClick = noop,
  connections = [],
  children = [],
}) => (
  <Container>
    <LabelContainer>
      <ConnectionsContainer>
        {connections.map(({ color, from, to }) => (
          <Connection color={color} key={`${from}${to}`} />
        ))}
      </ConnectionsContainer>
      <TextInput onChange={onLabelChange} value={label} />
    </LabelContainer>
    <InfoContainer>
      <TypeLabel>{type} /</TypeLabel>
      {typeof children === 'function' ? children() : children}
      <Button label="Remove" handler={onRemoveClick} />
    </InfoContainer>
  </Container>
)

export default memo(TitleBar)
