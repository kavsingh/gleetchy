import React from 'react'

import PropTypes from '~/PropTypes'
import cssLabeled from '~/util/style'

const classes = cssLabeled('', {
  root: {
    padding: '1.4em 0.4em',
    display: 'flex',
  },
})

const Panel = ({ children, style }) => (
  <div className={classes.root} style={{ ...style }}>
    {children}
  </div>
)

Panel.propTypes = {
  children: PropTypes.node,
  // eslint-disable-next-line react/no-typos
  style: PropTypes.style,
}

Panel.defaultProps = {
  children: null,
  style: null,
}

export default Panel
