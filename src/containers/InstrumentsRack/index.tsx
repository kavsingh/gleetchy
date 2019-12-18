import React, { FunctionComponent, useCallback } from 'react'
import styled from '@emotion/styled'

import { AudioNodeMeta } from '~/types'
import useAudioNodes from '~/state/hooks/useAudioNodes'
import useAudioNodesMeta from '~/state/hooks/useAudioNodesMeta'
import { nodeType as loopType } from '~/nodes/instruments/loop'
import AnimIn from '~/components/AnimIn'
import ErrorBoundary from '~/components/ErrorBoundary'
import AddNodeButtons from '~/components/AddNodeButtons'

import ConnectedLoop from './ConnectedLoop'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`

const InstrumentContainer = styled(AnimIn)`
  &:not(:first-child) {
    margin-top: '2em';
  }
`

export interface InstrumentsRackProps {
  instruments: AudioNodeMeta[]
  addLoop(): unknown
}

const Rack: FunctionComponent = () => {
  const [{ instruments }] = useAudioNodesMeta()

  return (
    <ErrorBoundary>
      {instruments.map(({ id, type }) => {
        switch (type) {
          case loopType:
            return (
              <InstrumentContainer key={id}>
                <ConnectedLoop id={id} />
              </InstrumentContainer>
            )
          default:
            return null
        }
      })}
    </ErrorBoundary>
  )
}

const Add: FunctionComponent = () => {
  const [, { addNode }] = useAudioNodes()

  const addLoop = useCallback(() => addNode(loopType), [addNode])

  return <AddNodeButtons buttons={[['Loop', addLoop]]} />
}

const InstrumentsRack: FunctionComponent = () => {
  return (
    <Container>
      <Rack />
      <Add />
    </Container>
  )
}

export default InstrumentsRack
