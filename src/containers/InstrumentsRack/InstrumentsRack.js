import { equals } from 'ramda'
import React, { Component } from 'react'

import PropTypes from '~/PropTypes'
import { noop } from '~/util/function'
import { cssLabeled } from '~/util/style'
import ErrorBoundary from '~/components/ErrorBoundary'
import AnimIn from '~/components/AnimIn'
import { nodeType as loopType } from '~/nodes/instruments/loop'

import ConnectedLoop from './ConnectedLoop.ts'

const classes = cssLabeled('instrumentsRack', {
  root: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
  },

  instrumentContainer: {
    '&:not(:first-child)': {
      marginTop: '2em',
    },
  },

  addButton: {
    cursor: 'pointer',
    margin: '2em 0 0',
    padding: '1em 0',
    width: '100%',
    textAlign: 'center',
    fontSize: '0.8em',
  },
})

class InstrumentsRack extends Component {
  shouldComponentUpdate(nextProps) {
    return !equals(nextProps.instruments, this.props.instruments)
  }

  render() {
    const { instruments, addLoop } = this.props

    return (
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
            if (key === 'Enter') addLoop()
          }}
        >
          [ Add loop ]
        </div>
      </div>
    )
  }
}

InstrumentsRack.propTypes = {
  instruments: PropTypes.arrayOf(PropTypes.shape({})),
  addLoop: PropTypes.func,
}

InstrumentsRack.defaultProps = {
  instruments: [],
  addLoop: noop,
}

export default InstrumentsRack
