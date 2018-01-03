import React from 'react'
import { MotionValue } from 'popmotion-react'
import spring from 'popmotion/animations/spring'

import PropTypes from '~/PropTypes'
import { cssLabeled } from '~/util/style'

const stateChangeHandlers = {
  visible: ({ value }) => spring({ from: 0, to: 1 }).start(value),
}

const classes = cssLabeled('animIn', {
  root: {
    width: '100%',
    height: '100%',
  },
})

function AnimIn({ children }) {
  return (
    <MotionValue onStateChange={stateChangeHandlers} initialState="visible">
      {({ v }) => (
        <div className={classes.root} style={{ opacity: v }}>
          {children}
        </div>
      )}
    </MotionValue>
  )
}

AnimIn.propTypes = {
  children: PropTypes.node,
}

AnimIn.defaultProps = {
  children: [],
}

export default AnimIn
