import React, { memo, FunctionComponent } from 'react'

import AnimIn from '~/components/AnimIn'
import ErrorBoundary from '~/components/ErrorBoundary'
import { nodeType as loopType } from '~/nodes/instruments/loop'
import { AudioNodeIdentifier } from '~/types'
import { noop } from '~/util/function'
import { cssLabeled } from '~/util/style'

import ConnectedLoop from './ConnectedLoop'

const classes = cssLabeled('instrumentsRack', {
  root: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
  },

  instrumentContainer: {
    '&:not(:first-child)': {
      marginTop: '2em',
    },
  },

  addButton: {
    cursor: 'pointer',
    fontSize: '0.8em',
    margin: '2em 0 0',
    padding: '1em 0',
    textAlign: 'center',
    width: '100%',
  },
})

export interface InstrumentsRackProps {
  instruments: AudioNodeIdentifier[]
  addLoop(): unknown
}

const InstrumentsRack: FunctionComponent<InstrumentsRackProps> = ({
  instruments = [],
  addLoop = noop,
}) => (
  <div className={classes.root}>
    <ErrorBoundary>
      {instruments.map(({ id, type }) => {
        switch (type) {
          case loopType:
            return (
              <div className={classes.instrumentContainer} key={id}>
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
      className={classes.addButton}
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

export default memo(InstrumentsRack)
