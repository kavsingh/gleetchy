import React, { FunctionComponent, useCallback } from 'react'
import { css } from '@emotion/core'

import { AudioNodeMeta } from '~/types'
import { nodeType as loopType } from '~/nodes/instruments/loop'
import AnimIn from '~/components/AnimIn'
import ErrorBoundary from '~/components/ErrorBoundary'
import useAudioNodes from '~/hooks/useAudioNodes'

import ConnectedLoop from './ConnectedLoop'
import useAudioNodesMeta from '~/hooks/useAudioNodesMeta'

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

const addButtonStyle = css({
  cursor: 'pointer',
  fontSize: '0.8em',
  margin: '2em 0 0',
  padding: '1em 0',
  textAlign: 'center',
  width: '100%',
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
      <div
        css={addButtonStyle}
        onClick={addLoop}
        role="button"
        tabIndex={0}
        onKeyDown={({ key }) => {
          if (key === 'Enter') {
            addLoop()
          }
        }}
      >
        [ Add loop ]
      </div>
    </div>
  )
}

export default InstrumentsRack
