import React, { FunctionComponent, useCallback } from 'react'
import { css } from '@emotion/core'

import { AudioNodeMeta } from '~/types'
import useAudioNodes from '~/state/hooks/useAudioNodes'
import useAudioNodesMeta from '~/state/hooks/useAudioNodesMeta'
import { nodeType as loopType } from '~/nodes/instruments/loop'
import AnimIn from '~/components/AnimIn'
import ErrorBoundary from '~/components/ErrorBoundary'
import AddNodeButtons from '~/components/AddNodeButtons'

import ConnectedLoop from './ConnectedLoop'

const rootStyle = css({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
})

const instrumentContainerStyle = css({
  '&:not(:first-child)': {
    marginTop: '2em',
  },
})

export interface InstrumentsRackProps {
  instruments: AudioNodeMeta[]
  addLoop(): unknown
}

const InstrumentsRack: FunctionComponent = () => {
  const { add } = useAudioNodes()
  const { instruments } = useAudioNodesMeta()

  const addLoop = useCallback(() => add(loopType), [add])

  return (
    <div css={rootStyle}>
      <ErrorBoundary>
        {instruments.map(({ id, type }) => {
          switch (type) {
            case loopType:
              return (
                <div css={instrumentContainerStyle} key={id}>
                  <AnimIn>
                    <ConnectedLoop id={id} />
                  </AnimIn>
                </div>
              )
            default:
              return null
          }
        })}
      </ErrorBoundary>
      <AddNodeButtons buttons={[['Loop', addLoop]]} />
    </div>
  )
}

export default InstrumentsRack
